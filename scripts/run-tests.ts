import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';
import { encrypt, decrypt } from '../src/lib/auth';
import { evaluateTransactionRisk, calculateKoperasiHealthScore } from '../src/lib/risk-scanner';
import { createApprovalRequests, decideApproval } from '../src/lib/approval';

// Load env
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
  }
}
loadEnv();

const prefix = process.env.DB_PREFIX || '';
function p(tableName: string): string {
  return `${prefix}${tableName}`;
}

const isSslEnabled = process.env.DB_SSL === 'true';

const client = new Client({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: isSslEnabled ? { rejectUnauthorized: false } : undefined,
});

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error('Assertion Failed: ' + message);
  }
}

async function runMigrationsAndSeed() {
  console.log('--- Wiping and running fresh migrations + seed ---');
  // Re-run migration script
  const migrationFiles = [
    'supabase/migrations/0001_reference_schema.sql',
    'supabase/migrations/0002_amandes_additive.sql',
    'supabase/migrations/0003_rls_and_triggers.sql',
    'supabase/migrations/0004_amandes_community.sql',
    'supabase/migrations/0005_weekly_missions.sql',
    'supabase/migrations/0006_savings_points_trigger.sql'
  ];

  // We need to drop our prefixed tables first to ensure clean state
  const tablesToDrop = [
    'weekly_missions_claim', 'user_vouchers', 'reward_vouchers', 'aspiration_upvotes', 'community_aspirations', 
    'rat_votes', 'rat_voting_agenda', 'whatsapp_mock_log', 'user_devices', 
    'notifications', 'approvals', 'koperasi_health_score', 'risk_logs', 
    'transaksi_keuangan', 'user_progress', 'user_points', 'learning_modules', 'app_users',
    'transaksi_penjualan', 'simpanan_anggota', 'rat_koperasi', 'profil_koperasi', 
    'produk_koperasi', 'pengurus_koperasi', 'pengajuan_rekening_bank', 'pengajuan_pembiayaan', 
    'pengajuan_kemitraan', 'pengajuan_domain', 'modal_koperasi', 'kbli_koperasi', 
    'karyawan_koperasi', 'inventaris_produk', 'gerai_koperasi', 'dokumen_koperasi', 
    'barang_masuk_produk', 'barang_keluar_produk', 'aset_koperasi', 'anggota_koperasi', 
    'akun_bank_koperasi', 'referensi_profil_desa', 'referensi_koperasi_wilayah', 
    'referensi_gerai_koperasi', 'referensi_dokumen_koperasi', 'referensi_komoditas_desa', 
    'referensi_wilayah'
  ];

  for (const table of tablesToDrop) {
    await client.query(`DROP TABLE IF EXISTS ${p(table)} CASCADE`);
  }
  // Drop views
  await client.query(`DROP VIEW IF EXISTS ${p('v_koperasi_summary')} CASCADE`);
  await client.query(`DROP VIEW IF EXISTS ${p('v_member_summary')} CASCADE`);
  await client.query(`DROP VIEW IF EXISTS ${p('v_compliance_summary')} CASCADE`);
  // Drop types
  const typesToDrop = [
    'user_role', 'user_status', 'tx_type', 'tx_sumber_dana', 'tx_kategori', 'tx_status', 
    'risk_level_type', 'approval_status', 'notification_type', 'notification_channel', 
    'module_category', 'progress_status'
  ];
  for (const t of typesToDrop) {
    await client.query(`DROP TYPE IF EXISTS ${p(t)} CASCADE`);
  }

  for (const file of migrationFiles) {
    const sql = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
    await client.query(sql);
  }
  console.log('✓ Database Schema recreated successfully.');

  // Run seed data
  // We can just execute the seed function logic here or query it
  // Let's run a quick seed query
  await client.query(`
    INSERT INTO ${p('referensi_wilayah')} (kode_wilayah, provinsi, kab_kota, kecamatan, desa_kelurahan)
    VALUES ('32.01.01.2001', 'Jawa Barat', 'Bogor', 'Ciawi', 'Merah Putih')
  `);
  await client.query(`
    INSERT INTO ${p('referensi_koperasi_wilayah')} (koperasi_ref, kode_wilayah)
    VALUES ('KOP-539EF09CDAAD', '32.01.01.2001')
  `);
  await client.query(`
    INSERT INTO ${p('referensi_profil_desa')} (kode_wilayah, tahun_populasi, total_penduduk, penduduk_laki_laki, penduduk_perempuan, tahun_pendanaan, anggaran_dana_desa)
    VALUES ('32.01.01.2001', 2026, 4500, 2200, 2300, 2026, 1200000000)
  `);
  await client.query(`
    INSERT INTO ${p('profil_koperasi')} (koperasi_ref, nama_koperasi, status_registrasi, bentuk_koperasi, kategori_usaha, nik_koperasi, alamat_lengkap, kode_pos, modal_awal)
    VALUES ('KOP-539EF09CDAAD', 'Koperasi Desa Merah Putih', 'Terverifikasi', 'Produsen', 'Sektor Riil', '3201010000000001', 'Jalan Raya Puncak No. 100', '16720', 250000000)
  `);
  await client.query(`
    INSERT INTO ${p('rat_koperasi')} (rat_sample_id, koperasi_ref, tanggal_rat, tahun_buku, status_rat)
    VALUES ('RAT-MOCK-001', 'KOP-539EF09CDAAD', CURRENT_DATE, 2025, 'Sah')
  `);
  await client.query(`
    INSERT INTO ${p('app_users')} (id, full_name, phone_number, ktp_number, role, koperasi_ref, status)
    VALUES 
    ('d142d765-bcf7-4f0e-b7d1-127e7d69e801', 'H. Ahmad Syarif', '081200000001', '3201010101010001', 'ketua', 'KOP-539EF09CDAAD', 'active'),
    ('d142d765-bcf7-4f0e-b7d1-127e7d69e802', 'Siti Rahma', '081200000002', '3201010101010002', 'pengurus', 'KOP-539EF09CDAAD', 'active'),
    ('d142d765-bcf7-4f0e-b7d1-127e7d69e803', 'Budi Santoso', '081200000003', '3201010101010003', 'anggota', 'KOP-539EF09CDAAD', 'active')
  `);
  // Seed learning module
  await client.query(`
    INSERT INTO ${p('learning_modules')} (id, title, content, category, points_reward, quiz_json)
    VALUES ('b331f822-7901-4475-be02-127e7d69e851', 'Materi 1', 'Content', 'tata_kelola', 15, '{"questions":[]}')
  `);
  // Seed reward vouchers
  await client.query(`
    INSERT INTO ${p('reward_vouchers')} (id, title, points_cost, description, stock)
    VALUES ('b142d765-bcf7-4f0e-b7d1-127e7d69e871', 'Voucher Rp10.000', 10, 'Deskripsi', 5)
  `);
  // Seed voting agenda
  await client.query(`
    INSERT INTO ${p('rat_voting_agenda')} (id, koperasi_ref, title, description, options, status)
    VALUES ('c142d765-bcf7-4f0e-b7d1-127e7d69e881', 'KOP-539EF09CDAAD', 'Agenda 1', 'Deskripsi', ARRAY['Setuju', 'Tolak'], 'aktif')
  `);

  console.log('✓ Seeding complete.');
}

async function testAuthSession() {
  console.log('\n--- Testing Test Case 1: Auth & JWT Session Helpers ---');
  const payload = { userId: 'user-123', fullName: 'Tester', role: 'pengurus' };
  const token = await encrypt(payload);
  assert(token !== null, 'Token encryption should not be null');
  
  const decrypted = await decrypt(token);
  assert(decrypted !== null, 'Token decryption should succeed');
  assert(decrypted.userId === 'user-123', 'Decrypted user ID should match');
  assert(decrypted.role === 'pengurus', 'Decrypted role should match');
  console.log('✓ JWT Session encrypt & decrypt passed.');
}

async function testRiskScanner() {
  console.log('\n--- Testing Test Case 2: Risk Scanner PMK Regulations ---');

  // Helper to insert test transaction
  const insertTx = async (amount: number, type: string, sumber: string, kat: string, desc: string, evidence?: string) => {
    const { rows } = await client.query(`
      INSERT INTO ${p('transaksi_keuangan')} 
      (koperasi_ref, type, sumber_dana, kategori, amount, description, evidence_url, input_by, status, risk_level, transaction_date)
      VALUES ('KOP-539EF09CDAAD', $1, $2, $3, $4, $5, $6, 'd142d765-bcf7-4f0e-b7d1-127e7d69e802', 'draft', 'aman', CURRENT_DATE)
      RETURNING id
    `, [type, sumber, kat, amount, desc, evidence || null]);
    return rows[0].id;
  };

  // Test Case 2a: Aman transaction (small amount, with evidence)
  const txAmanId = await insertTx(150000, 'pemasukan', 'non_dana_desa', 'operasional', 'Iuran Kas', 'http://evidence.co/1.jpg');
  const riskAman = await evaluateTransactionRisk(txAmanId);
  assert(riskAman.finalRiskLevel === 'aman', 'Transaction should be aman');
  assert(riskAman.triggeredRules.length === 0, 'No rules should be triggered');
  console.log('✓ Sub-test 2a: Transaksi Aman Passed.');

  // Test Case 2b: Large transaction without evidence (R01 violation)
  const txNoEvidenceId = await insertTx(6000000, 'pengeluaran', 'non_dana_desa', 'operasional', 'Belanja Meja Kursi');
  const riskNoEvidence = await evaluateTransactionRisk(txNoEvidenceId);
  assert(riskNoEvidence.finalRiskLevel === 'berisiko_tinggi', 'Should be berisiko_tinggi due to >5M without evidence');
  assert(riskNoEvidence.triggeredRules.some(r => r.rule_code === 'R01_NO_EVIDENCE'), 'Should trigger R01');
  console.log('✓ Sub-test 2b: R01_NO_EVIDENCE Violation Passed.');

  // Test Case 2c: Dana Desa mismatch (R02 violation)
  const txDdMismatchId = await insertTx(200000, 'pengeluaran', 'dana_desa', 'operasional', 'Beli Kertas');
  const riskDdMismatch = await evaluateTransactionRisk(txDdMismatchId);
  assert(riskDdMismatch.finalRiskLevel === 'berisiko_tinggi', 'Should be berisiko_tinggi due to Dana Desa for operasional');
  assert(riskDdMismatch.triggeredRules.some(r => r.rule_code === 'R02_DANA_DESA_MISMATCH'), 'Should trigger R02');
  console.log('✓ Sub-test 2c: R02_DANA_DESA_MISMATCH Violation Passed.');

  // Test Case 2d: Over budget check (R03 violation)
  // Let's insert a massive pengeluaran exceeding current cash balance (current balance is Rp0 or small)
  const txOverBudgetId = await insertTx(50000000, 'pengeluaran', 'non_dana_desa', 'operasional', 'Pembelian Mobil Operasional', 'http://evidence.co/car.jpg');
  const riskOverBudget = await evaluateTransactionRisk(txOverBudgetId);
  assert(riskOverBudget.finalRiskLevel === 'berisiko_tinggi', 'Should be berisiko_tinggi due to over budget');
  assert(riskOverBudget.triggeredRules.some(r => r.rule_code === 'R03_OVER_BUDGET'), 'Should trigger R03');
  console.log('✓ Sub-test 2d: R03_OVER_BUDGET Violation Passed.');

  // Test Case 2e: Duplicate transactions detection (R06 violation)
  const txDup1Id = await insertTx(250000, 'pengeluaran', 'non_dana_desa', 'operasional', 'Beli Sabun Gerai', 'http://evidence.co/dup.jpg');
  const txDup2Id = await insertTx(250000, 'pengeluaran', 'non_dana_desa', 'operasional', 'Beli Sabun Gerai', 'http://evidence.co/dup.jpg');
  await evaluateTransactionRisk(txDup1Id);
  const riskDup2 = await evaluateTransactionRisk(txDup2Id);
  assert(riskDup2.triggeredRules.some(r => r.rule_code === 'R06_DUPLICATE_TX'), 'Should trigger R06 on second transaction');
  console.log('✓ Sub-test 2e: R06_DUPLICATE_TX Detection Passed.');
}

async function testApprovalWorkflow() {
  console.log('\n--- Testing Test Case 3: Multilevel Approval Workflow ---');

  // Insert a high risk transaction (R01 violation)
  const { rows: txRows } = await client.query(`
    INSERT INTO ${p('transaksi_keuangan')} 
    (koperasi_ref, type, sumber_dana, kategori, amount, description, input_by, status, risk_level, transaction_date)
    VALUES ('KOP-539EF09CDAAD', 'pengeluaran', 'non_dana_desa', 'operasional', 7000000, 'Beli Genset Kantor', 'd142d765-bcf7-4f0e-b7d1-127e7d69e802', 'draft', 'aman', CURRENT_DATE)
    RETURNING id
  `);
  const txId = txRows[0].id;

  // Run risk scanner so it marks it high risk
  await evaluateTransactionRisk(txId);

  // Run approval creation
  await createApprovalRequests(txId);

  // Check generated approvals in database
  const { rows: approvals } = await client.query(
    `SELECT * FROM ${p('approvals')} WHERE transaction_id = $1`,
    [txId]
  );
  
  // Since risk level is high, it should create approvals targeting Ketua Koperasi (Ahmad Syarif)
  assert(approvals.length > 0, 'Approval requests should be generated');
  const hasKetuaApprover = approvals.some(a => a.approver_id === 'd142d765-bcf7-4f0e-b7d1-127e7d69e801');
  assert(hasKetuaApprover, 'High risk transaction must require Ketua as approver');
  console.log('✓ Sub-test 3a: Multilevel Approver Dispatch Passed.');

  // Test Case 3b: Decision Approval - Tolak (Reject)
  const ketuaApp = approvals.find(a => a.approver_id === 'd142d765-bcf7-4f0e-b7d1-127e7d69e801');
  if (ketuaApp) {
    await decideApproval(ketuaApp.id, 'd142d765-bcf7-4f0e-b7d1-127e7d69e801', 'ditolak', 'Nominal terlalu mahal');
    
    // Check transaction status
    const { rows: updatedTx } = await client.query(
      `SELECT status FROM ${p('transaksi_keuangan')} WHERE id = $1`,
      [txId]
    );
    assert(updatedTx[0].status === 'ditolak', 'Transaction status must be ditolak after rejection');
    console.log('✓ Sub-test 3b: Rejection Decision Propagation Passed.');
  }
}

async function testGamificationPoints() {
  console.log('\n--- Testing Test Case 4: Gamification & Points Triggers ---');

  // Query initial user points
  const { rows: initialPt } = await client.query(
    `SELECT total_points FROM ${p('user_points')} WHERE user_id = $1`,
    ['d142d765-bcf7-4f0e-b7d1-127e7d69e803']
  );
  const initialPoints = initialPt[0]?.total_points ? Number(initialPt[0].total_points) : 0;

  // Insert completion record for Budi Santoso on Module 1 (should trigger the PostgreSQL trigger)
  await client.query(`
    INSERT INTO ${p('user_progress')} (user_id, module_id, status, quiz_score, completed_at)
    VALUES ('d142d765-bcf7-4f0e-b7d1-127e7d69e803', 'b331f822-7901-4475-be02-127e7d69e851', 'selesai', 100, NOW())
  `);

  // Query updated user points
  const { rows: updatedPt } = await client.query(
    `SELECT total_points FROM ${p('user_points')} WHERE user_id = $1`,
    ['d142d765-bcf7-4f0e-b7d1-127e7d69e803']
  );
  const finalPoints = updatedPt[0]?.total_points ? Number(updatedPt[0].total_points) : 0;

  // Modul reward is 15 PTS
  assert(finalPoints === initialPoints + 15, `Points should increase by 15. Initial: ${initialPoints}, Final: ${finalPoints}`);
  console.log('✓ Sub-test 4a: Points Automatic Database Trigger Passed.');
}

async function testCommunityFeatures() {
  console.log('\n--- Testing Test Case 5: Community e-RAT & Aspirations ---');

  // e-RAT Vote casting
  await client.query(`
    INSERT INTO ${p('rat_votes')} (agenda_id, user_id, voted_option)
    VALUES ('c142d765-bcf7-4f0e-b7d1-127e7d69e881', 'd142d765-bcf7-4f0e-b7d1-127e7d69e803', 'Setuju')
  `);
  console.log('✓ Sub-test 5a: Cast e-RAT Vote Passed.');

  // Double vote check (must fail unique constraint)
  try {
    await client.query(`
      INSERT INTO ${p('rat_votes')} (agenda_id, user_id, voted_option)
      VALUES ('c142d765-bcf7-4f0e-b7d1-127e7d69e881', 'd142d765-bcf7-4f0e-b7d1-127e7d69e803', 'Tolak')
    `);
    assert(false, 'Double voting should throw error');
  } catch (err: any) {
    assert(err.code === '23505', 'Should throw unique key violation error');
    console.log('✓ Sub-test 5b: Double Voting Prevention Constraint Passed.');
  }

  // Aspiration insertion
  const { rows: aspRows } = await client.query(`
    INSERT INTO ${p('community_aspirations')} (koperasi_ref, user_id, title, description)
    VALUES ('KOP-539EF09CDAAD', 'd142d765-bcf7-4f0e-b7d1-127e7d69e803', 'Saran Pemasaran', 'Uraian saran')
    RETURNING id
  `);
  const aspId = aspRows[0].id;

  // Upvote Aspiration
  await client.query(`
    INSERT INTO ${p('aspiration_upvotes')} (aspiration_id, user_id)
    VALUES ($1, 'd142d765-bcf7-4f0e-b7d1-127e7d69e802')
  `, [aspId]);
  await client.query(`
    UPDATE ${p('community_aspirations')} SET upvotes_count = upvotes_count + 1 WHERE id = $1
  `, [aspId]);

  const { rows: aspCheck } = await client.query(
    `SELECT upvotes_count FROM ${p('community_aspirations')} WHERE id = $1`,
    [aspId]
  );
  assert(Number(aspCheck[0].upvotes_count) === 1, 'Upvotes count should increment to 1');
  console.log('✓ Sub-test 5c: Aspiration Upvoting Passed.');
}

async function testRewardCenter() {
  console.log('\n--- Testing Test Case 6: Reward Center Voucher Redemption ---');

  // Let's deduct 10 points for voucher costing 10 points
  // 1. Check initial points (Budi Santoso should have 15 PTS from quiz)
  const { rows: ptsCheck } = await client.query(
    `SELECT total_points FROM ${p('user_points')} WHERE user_id = $1`,
    ['d142d765-bcf7-4f0e-b7d1-127e7d69e803']
  );
  const initialPoints = Number(ptsCheck[0].total_points);
  assert(initialPoints >= 10, 'Points must be at least 10 to redeem');

  // 2. Perform mock redemption query flow simulating api transaction
  await client.query('BEGIN');
  
  // Deduct points
  await client.query(
    `UPDATE ${p('user_points')} SET total_points = total_points - 10 WHERE user_id = $1`,
    ['d142d765-bcf7-4f0e-b7d1-127e7d69e803']
  );
  // Deduct stock
  await client.query(
    `UPDATE ${p('reward_vouchers')} SET stock = stock - 1 WHERE id = $1`,
    ['b142d765-bcf7-4f0e-b7d1-127e7d69e871']
  );
  // Insert voucher code
  const code = 'VCH-TEST1234';
  await client.query(
    `INSERT INTO ${p('user_vouchers')} (user_id, voucher_id, code) 
     VALUES ('d142d765-bcf7-4f0e-b7d1-127e7d69e803', 'b142d765-bcf7-4f0e-b7d1-127e7d69e871', $1)`,
    [code]
  );

  await client.query('COMMIT');

  // 3. Verify final state
  const { rows: finalPts } = await client.query(
    `SELECT total_points FROM ${p('user_points')} WHERE user_id = $1`,
    ['d142d765-bcf7-4f0e-b7d1-127e7d69e803']
  );
  assert(Number(finalPts[0].total_points) === initialPoints - 10, 'Points must be deducted by 10');

  const { rows: finalStock } = await client.query(
    `SELECT stock FROM ${p('reward_vouchers')} WHERE id = $1`,
    ['b142d765-bcf7-4f0e-b7d1-127e7d69e871']
  );
  assert(Number(finalStock[0].stock) === 4, 'Voucher stock must decrease by 1 from initial 5');
  console.log('✓ Sub-test 6a: Points Deduction and Stock Update Passed.');
}

async function testShuDistribution() {
  console.log('\n--- Testing Test Case 7: Digital SHU Distribution based on Points ---');

  // 1. Record mock income to create positive SHU berjalan
  await client.query(
    `INSERT INTO ${p('transaksi_keuangan')} 
     (koperasi_ref, type, sumber_dana, kategori, amount, description, input_by, status, risk_level, transaction_date)
     VALUES ('KOP-539EF09CDAAD', 'pemasukan', 'non_dana_desa', 'operasional', 500000, 'Pendapatan Toko Desa', 'd142d765-bcf7-4f0e-b7d1-127e7d69e802', 'disetujui', 'aman', CURRENT_DATE)`
  );

  // 2. Load total SHU
  const { rows: pem } = await client.query(
    `SELECT COALESCE(SUM(amount), 0)::numeric as total FROM ${p('transaksi_keuangan')} 
     WHERE koperasi_ref = 'KOP-539EF09CDAAD' AND type = 'pemasukan' AND status = 'disetujui'`
  );
  const { rows: peng } = await client.query(
    `SELECT COALESCE(SUM(amount), 0)::numeric as total FROM ${p('transaksi_keuangan')} 
     WHERE koperasi_ref = 'KOP-539EF09CDAAD' AND type = 'pengeluaran' AND status = 'disetujui'`
  );
  const totalSHU = Number(pem[0].total) - Number(peng[0].total);
  assert(totalSHU > 0, 'SHU must be positive to distribute');

  // 3. Load active members with points
  const { rows: members } = await client.query(
    `SELECT u.id as user_id, u.anggota_ref, COALESCE(p.total_points, 0)::int as points 
     FROM ${p('app_users')} u
     LEFT JOIN ${p('user_points')} p ON u.id = p.user_id
     WHERE u.koperasi_ref = 'KOP-539EF09CDAAD' AND u.role = 'anggota' AND u.status = 'active'`
  );
  const totalPoints = members.reduce((sum, m) => sum + m.points, 0);
  assert(totalPoints > 0, 'Total points must be positive');

  // 4. Simulate distribution
  for (const member of members) {
    if (member.points > 0) {
      const memberShuAmount = Math.round((member.points / totalPoints) * totalSHU);
      if (memberShuAmount > 0) {
        await client.query(
          `INSERT INTO ${p('transaksi_keuangan')} 
           (koperasi_ref, type, sumber_dana, kategori, amount, description, anggota_ref, input_by, status, risk_level, transaction_date)
           VALUES ('KOP-539EF09CDAAD', 'bagi_hasil', 'non_dana_desa', 'lainnya', $1, 'Bagi Hasil SHU Test', $2, 'd142d765-bcf7-4f0e-b7d1-127e7d69e801', 'disetujui', 'aman', CURRENT_DATE)`,
          [memberShuAmount, member.anggota_ref]
        );
      }
    }
  }

  // 5. Verify that bagi_hasil records are successfully created
  const { rows: bag } = await client.query(
    `SELECT COUNT(*)::int as count FROM ${p('transaksi_keuangan')} 
     WHERE koperasi_ref = 'KOP-539EF09CDAAD' AND type = 'bagi_hasil' AND status = 'disetujui'`
  );
  assert(bag[0].count > 0, 'Should have created bagi_hasil records');
  console.log('✓ Sub-test 7a: Dynamic SHU Payout Calculation and Recording Passed.');
}

async function main() {
  console.log('Connecting to database...');
  await client.connect();
  console.log('Connected! Starting Test Suite execution...');

  await runMigrationsAndSeed();
  await testAuthSession();
  await testRiskScanner();
  await testApprovalWorkflow();
  await testGamificationPoints();
  await testCommunityFeatures();
  await testRewardCenter();
  await testShuDistribution();

  await client.end();
  console.log('\n=======================================');
  console.log('🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY!');
  console.log('=======================================');
}

main().catch(async err => {
  console.error('\n✗ TEST RUNNER FAILED WITH ERROR:', err);
  try {
    await client.end();
  } catch (e) {}
  process.exit(1);
});
