"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateTransactionRisk = evaluateTransactionRisk;
exports.calculateKoperasiHealthScore = calculateKoperasiHealthScore;
const db_1 = require("./db");
async function evaluateTransactionRisk(txId) {
    // 1. Fetch transaction details
    const { rows: txRows } = await db_1.db.query(`SELECT * FROM ${(0, db_1.p)('transaksi_keuangan')} WHERE id = $1`, [txId]);
    const tx = txRows[0];
    if (!tx) {
        throw new Error('Transaction not found: ' + txId);
    }
    const triggeredRules = [];
    // R01_NO_EVIDENCE: amount > 5000000 and evidence_url is empty/null
    // Reference: UU No. 25/1992 Pasal 34 (Akuntabilitas Pengurus) & AD Koperasi Pasal 12
    if (Number(tx.amount) > 5000000 && (!tx.evidence_url || tx.evidence_url.trim() === '')) {
        triggeredRules.push({
            transaction_id: txId,
            rule_code: 'R01_NO_EVIDENCE',
            risk_level: 'berisiko_tinggi',
            message: '[UU No. 25/1992 Pasal 34 & AD Koperasi Pasal 12] Transaksi di atas Rp5.000.000 tidak disertai bukti pendukung fisik (nota/kuitansi/invoice) untuk pertanggungjawaban pengurus.',
        });
    }
    // R02_DANA_DESA_MISMATCH: sumber_dana = dana_desa but kategori is not pembangunan_fisik
    // Reference: UU No. 6/2014 tentang Desa Pasal 19 & PMK No. 7/2026 Pasal 20
    if (tx.sumber_dana === 'dana_desa' && tx.kategori !== 'pembangunan_fisik') {
        triggeredRules.push({
            transaction_id: txId,
            rule_code: 'R02_DANA_DESA_MISMATCH',
            risk_level: 'berisiko_tinggi',
            message: '[UU No. 6/2014 Pasal 19 & PMK No. 7/2026 Pasal 20] Penggunaan Dana Desa di luar peruntukan resmi pembangunan fisik/gerai/gudang Koperasi Desa Mandiri Pangan (KDMP) dilarang.',
        });
    }
    // R02b_DANA_DESA_ALOKASI_CAP: check against 58.03% of desa funding
    // Reference: PMK No. 7/2026 Pasal 15 Ayat 3
    if (tx.sumber_dana === 'dana_desa') {
        const { rows: kwRows } = await db_1.db.query(`SELECT kode_wilayah FROM ${(0, db_1.p)('referensi_koperasi_wilayah')} WHERE koperasi_ref = $1`, [tx.koperasi_ref]);
        const kopWil = kwRows[0];
        if (kopWil?.kode_wilayah) {
            const { rows: pdRows } = await db_1.db.query(`SELECT anggaran_dana_desa FROM ${(0, db_1.p)('referensi_profil_desa')} WHERE kode_wilayah = $1`, [kopWil.kode_wilayah]);
            const profDesa = pdRows[0];
            if (profDesa?.anggaran_dana_desa) {
                const cap = Number(profDesa.anggaran_dana_desa) * 0.5803;
                // Sum current year's dana_desa transactions
                const currentYear = new Date().getFullYear();
                const { rows: yearRows } = await db_1.db.query(`SELECT SUM(amount) as total FROM ${(0, db_1.p)('transaksi_keuangan')} 
           WHERE koperasi_ref = $1 AND sumber_dana = 'dana_desa' AND status = 'disetujui' 
           AND transaction_date >= $2`, [tx.koperasi_ref, `${currentYear}-01-01`]);
                const sumPrev = yearRows[0]?.total ? Number(yearRows[0].total) : 0;
                const totalWithCurrent = sumPrev + Number(tx.amount);
                if (totalWithCurrent > cap) {
                    triggeredRules.push({
                        transaction_id: txId,
                        rule_code: 'R02b_DANA_DESA_ALOKASI_CAP',
                        risk_level: 'perlu_perhatian',
                        message: `[PMK No. 7/2026 Pasal 15 Ayat 3] Akumulasi penyaluran Dana Desa untuk koperasi (Rp${totalWithCurrent.toLocaleString()}) melebihi batas alokasi wajib 58,03% dari total anggaran Dana Desa (Rp${cap.toLocaleString()}).`,
                    });
                }
            }
        }
    }
    // R03_OVER_BUDGET: check if pengeluaran exceeds current cash balance
    // Reference: UU No. 25/1992 Pasal 32 & AD/ART Koperasi Pasal 18 (Batas Anggaran)
    const isOutflow = ['pengeluaran', 'pinjaman', 'bagi_hasil'].includes(tx.type);
    if (isOutflow) {
        const { rows: sumRows } = await db_1.db.query(`SELECT saldo_kas FROM ${(0, db_1.p)('v_koperasi_summary')} WHERE koperasi_ref = $1`, [tx.koperasi_ref]);
        const summary = sumRows[0];
        const currentBalance = summary ? Number(summary.saldo_kas) : 0;
        if (Number(tx.amount) > currentBalance) {
            triggeredRules.push({
                transaction_id: txId,
                rule_code: 'R03_OVER_BUDGET',
                risk_level: 'berisiko_tinggi',
                message: `[AD/ART Koperasi Pasal 18 & UU No. 25/1992] Nominal pengeluaran (Rp${Number(tx.amount).toLocaleString()}) melebihi total saldo kas koperasi tersedia (Rp${currentBalance.toLocaleString()}), melanggar batas otorisasi belanja.`,
            });
        }
    }
    // R06_DUPLICATE_TX: identical amount, description, transaction_date in 24 hours
    // Reference: Standar Akuntansi Keuangan Entitas Tanpa Akuntabilitas Publik (SAK ETAP) / PAKI
    const { rows: dupRows } = await db_1.db.query(`SELECT id FROM ${(0, db_1.p)('transaksi_keuangan')} 
     WHERE koperasi_ref = $1 AND amount = $2 AND description = $3 
     AND transaction_date = $4 AND id <> $5 LIMIT 1`, [tx.koperasi_ref, tx.amount, tx.description, tx.transaction_date, txId]);
    if (dupRows.length > 0) {
        triggeredRules.push({
            transaction_id: txId,
            rule_code: 'R06_DUPLICATE_TX',
            risk_level: 'perlu_perhatian',
            message: '[SAK ETAP / Prinsip Akuntansi Koperasi] Terdeteksi indikasi transaksi duplikat dengan tanggal, rincian, dan nominal yang sama dalam 24 jam.',
        });
    }
    // R07_ROUND_NUMBER_PATTERN: 3+ round numbers consecutively (divisible by 1,000,000)
    // Reference: UU No. 8/2010 Pasal 3 (Pencegahan & Pemberantasan TPPU)
    if (isOutflow && Number(tx.amount) % 1000000 === 0) {
        const { rows: lastRows } = await db_1.db.query(`SELECT amount FROM ${(0, db_1.p)('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 AND type IN ('pengeluaran', 'pinjaman', 'bagi_hasil') AND id <> $2 
       ORDER BY created_at DESC LIMIT 2`, [tx.koperasi_ref, txId]);
        if (lastRows.length === 2) {
            const allRound = lastRows.every(t => Number(t.amount) % 1000000 === 0);
            if (allRound) {
                triggeredRules.push({
                    transaction_id: txId,
                    rule_code: 'R07_ROUND_NUMBER_PATTERN',
                    risk_level: 'perlu_perhatian',
                    message: '[UU No. 8/2010 Pasal 3] Pola transaksi keluar dengan nominal bulat berturut-turut terdeteksi secara tidak wajar, berpotensi memicu indikasi pencucian uang.',
                });
            }
        }
    }
    // R04_SINGLE_APPROVER: transactions > 10,000,000 need at least 2 approvals
    // Reference: Anggaran Dasar Koperasi Pasal 24 (Kolektif Kolegial)
    if (Number(tx.amount) > 10000000) {
        const { rows: appCount } = await db_1.db.query(`SELECT COUNT(*)::int as count FROM ${(0, db_1.p)('approvals')} WHERE transaction_id = $1 AND status = 'disetujui'`, [txId]);
        if (tx.status === 'disetujui' && appCount[0].count < 2) {
            triggeredRules.push({
                transaction_id: txId,
                rule_code: 'R04_SINGLE_APPROVER',
                risk_level: 'perlu_perhatian',
                message: '[AD Koperasi Pasal 24] Transaksi bernominal besar di atas Rp10.000.000 disetujui secara sepihak tanpa minimal 2 verifikator pengurus.',
            });
        }
    }
    // R05_LATE_RAT: check if RAT has been held in the last 12 months
    // Reference: UU No. 25/1992 tentang Perkoperasian Pasal 26 (Kewajiban RAT)
    const { rows: ratRows } = await db_1.db.query(`SELECT MAX(tanggal_rat) as last_rat FROM ${(0, db_1.p)('rat_koperasi')} WHERE koperasi_ref = $1`, [tx.koperasi_ref]);
    const lastRat = ratRows[0]?.last_rat;
    if (!lastRat) {
        triggeredRules.push({
            transaction_id: txId,
            rule_code: 'R05_LATE_RAT',
            risk_level: 'perlu_perhatian',
            message: '[UU No. 25/1992 Pasal 26] Koperasi melanggar tata kelola organisasi karena belum pernah menyelenggarakan Rapat Anggota Tahunan (RAT) resmi.',
        });
    }
    else {
        const monthsSinceRat = (new Date().getTime() - new Date(lastRat).getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (monthsSinceRat > 12) {
            triggeredRules.push({
                transaction_id: txId,
                rule_code: 'R05_LATE_RAT',
                risk_level: 'perlu_perhatian',
                message: `[UU No. 25/1992 Pasal 26] Koperasi terlambat menyelenggarakan RAT. RAT terakhir pada ${new Date(lastRat).toLocaleDateString('id-ID')}, telah melewati batas wajib 12 bulan sekali.`,
            });
        }
    }
    // Pinjaman checks (R08, R09, R10)
    // Reference: PMK No. 15/2026 & PP No. 11/2021
    if (tx.type === 'pinjaman') {
        if (tx.tenor_bulan && tx.tenor_bulan > 72) {
            triggeredRules.push({
                transaction_id: txId,
                rule_code: 'R10_PINJAMAN_TENOR',
                risk_level: 'perlu_perhatian',
                message: '[PMK No. 15/2026] Jangka waktu (tenor) pinjaman koperasi melanggar batas maksimal 72 bulan (6 tahun).',
            });
        }
        const { rows: allPinjaman } = await db_1.db.query(`SELECT amount, kategori FROM ${(0, db_1.p)('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 AND type = 'pinjaman' AND status = 'disetujui'`, [tx.koperasi_ref]);
        const totalPinjaman = allPinjaman.reduce((sum, item) => sum + Number(item.amount), 0);
        const nextTotalPinjaman = totalPinjaman + Number(tx.amount);
        if (nextTotalPinjaman > 3000000000) {
            triggeredRules.push({
                transaction_id: txId,
                rule_code: 'R08_PINJAMAN_LIMIT',
                risk_level: 'berisiko_tinggi',
                message: `[PP No. 11/2021 & PMK No. 15/2026] Akumulasi total pinjaman (Rp${nextTotalPinjaman.toLocaleString()}) melampaui plafon pinjaman maksimal Rp3 Miliar yang dijamin pemerintah.`,
            });
        }
        if (tx.kategori === 'operasional') {
            const operasionalPinjaman = allPinjaman
                .filter(p => p.kategori === 'operasional')
                .reduce((sum, item) => sum + Number(item.amount), 0);
            const nextOperasionalPinjaman = operasionalPinjaman + Number(tx.amount);
            if (nextOperasionalPinjaman > 500000000) {
                triggeredRules.push({
                    transaction_id: txId,
                    rule_code: 'R09_PINJAMAN_OPERASIONAL_LIMIT',
                    risk_level: 'berisiko_tinggi',
                    message: `[PMK No. 15/2026] Akumulasi alokasi belanja operasional dari pinjaman (Rp${nextOperasionalPinjaman.toLocaleString()}) melebihi pagu maksimal Rp500 Juta.`,
                });
            }
        }
    }
    // 2. Determine final risk level
    let finalRiskLevel = 'aman';
    if (triggeredRules.some(r => r.risk_level === 'berisiko_tinggi')) {
        finalRiskLevel = 'berisiko_tinggi';
    }
    else if (triggeredRules.some(r => r.risk_level === 'perlu_perhatian')) {
        finalRiskLevel = 'perlu_perhatian';
    }
    // 3. Write logs to db and update transaction risk_level
    // Clear previous logs
    await db_1.db.query(`DELETE FROM ${(0, db_1.p)('risk_logs')} WHERE transaction_id = $1`, [txId]);
    if (triggeredRules.length > 0) {
        // Insert new logs
        for (const rule of triggeredRules) {
            await db_1.db.query(`INSERT INTO ${(0, db_1.p)('risk_logs')} (transaction_id, rule_code, risk_level, message) 
         VALUES ($1, $2, $3, $4)`, [txId, rule.rule_code, rule.risk_level, rule.message]);
        }
    }
    // Update risk level on transaction
    await db_1.db.query(`UPDATE ${(0, db_1.p)('transaksi_keuangan')} SET risk_level = $1 WHERE id = $2`, [finalRiskLevel, txId]);
    // Recalculate health score for the cooperative
    await calculateKoperasiHealthScore(tx.koperasi_ref);
    return { triggeredRules, finalRiskLevel };
}
async function calculateKoperasiHealthScore(koperasiRef) {
    const { rows } = await db_1.db.query(`SELECT r.risk_level, r.resolved 
     FROM ${(0, db_1.p)('risk_logs')} r 
     JOIN ${(0, db_1.p)('transaksi_keuangan')} t ON r.transaction_id = t.id 
     WHERE t.koperasi_ref = $1`, [koperasiRef]);
    let score = 100;
    for (const r of rows) {
        if (!r.resolved) {
            if (r.risk_level === 'berisiko_tinggi') {
                score -= 10;
            }
            else if (r.risk_level === 'perlu_perhatian') {
                score -= 3;
            }
        }
    }
    score = Math.max(0, score);
    await db_1.db.query(`INSERT INTO ${(0, db_1.p)('koperasi_health_score')} (koperasi_ref, score) VALUES ($1, $2)`, [koperasiRef, score]);
    return score;
}
