import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db, p } from '@/lib/db';

let currentIndex = 0;

function getNextApiKey(): string {
  const poolStr = process.env.GEMINI_API_KEY_POOL;
  if (poolStr && poolStr.trim()) {
    const keys = poolStr.split(',').map(k => k.trim()).filter(Boolean);
    if (keys.length > 0) {
      const key = keys[currentIndex % keys.length];
      currentIndex = (currentIndex + 1) % keys.length;
      return key;
    }
  }
  return process.env.GEMINI_API_KEY || '';
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !['pengurus', 'ketua', 'pendamping'].includes(session.role)) {
      return NextResponse.json({ error: 'Akses terbatas untuk Pengurus, Ketua, atau Pendamping.' }, { status: 401 });
    }

    if (!session.koperasiRef) {
      return NextResponse.json({ error: 'Koperasi reference tidak ditemukan.' }, { status: 400 });
    }

    // 1. Fetch live database context for the audit
    const { rows: healthRows } = await db.query(
      `SELECT score FROM ${p('koperasi_health_score')} 
       WHERE koperasi_ref = $1 ORDER BY checked_at DESC LIMIT 1`,
      [session.koperasiRef]
    );
    const healthScore = healthRows[0]?.score ?? 100;

    const { rows: riskRows } = await db.query(
      `SELECT r.rule_code, r.message, r.risk_level, t.description, t.amount, t.transaction_date 
       FROM ${p('risk_logs')} r
       JOIN ${p('transaksi_keuangan')} t ON r.transaction_id = t.id
       WHERE t.koperasi_ref = $1 AND r.resolved = false`,
      [session.koperasiRef]
    );

    const { rows: txRows } = await db.query(
      `SELECT type, amount, status, transaction_date FROM ${p('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 ORDER BY transaction_date DESC LIMIT 50`,
      [session.koperasiRef]
    );

    const apiKey = getNextApiKey();

    // 2. Call Gemini API if available
    if (apiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const systemInstruction = `Anda adalah "AmanDes AI Lead Auditor", konsultan independen dari Kementerian Koperasi & UKM RI yang ditugaskan untuk mengaudit Koperasi Desa Merah Putih (KDMP).
Analisis data transaksi dan temuan risiko yang dikirimkan. Buatlah Laporan Audit Kepatuhan Resmi (AI Compliance Audit Report) terstruktur dalam format Markdown.

Regulasi Acuan Wajib:
1. UU Perkoperasian No. 25/1992 (Transparansi kas & RAT).
2. UU Desa No. 6/2014 (Pasal 19).
3. PMK No. 7/2026 (Belanja Dana Desa dilarang keras untuk operasional kantor).
4. PMK No. 15/2026 (Plafon pinjaman anggota max Rp50jt, tenor max 72 bulan, rasio operasional pengurus max 30%).
5. SAK ETAP dan Prinsip Akuntansi Koperasi.

Format Laporan Wajib:
- **Header:** Surat Hasil Audit Kepatuhan AI - Koperasi Desa Merah Putih.
- **Bagian 1: Ringkasan Eksekutif & Indeks Kesehatan Keuangan** (Evaluasi skor ${healthScore}%).
- **Bagian 2: Daftar Pelanggaran & Temuan Kepatuhan** (Sebutkan rincian dari temuan risiko aktif).
- **Bagian 3: Rekomendasi Aksi Mitigasi Hukum** (Langkah konkret yang harus dilakukan ketua dan bendahara untuk menghindari pidana/tuntutan hukum).

Gunakan gaya bahasa Indonesia formal, berwibawa, analitis, dan solutif.`;

      const promptText = `Berikut adalah data riil Koperasi Desa Merah Putih saat ini:
- Skor Kesehatan: ${healthScore}%
- Daftar Temuan Pelanggaran Aktif: ${JSON.stringify(riskRows)}
- 50 Transaksi Keuangan Terakhir: ${JSON.stringify(txRows)}

Harap lakukan audit mendalam dan buat Laporan Audit Kepatuhan resmi.`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\n${promptText}` }]
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const auditReport = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (auditReport) {
          return NextResponse.json({ report: auditReport });
        }
      }
    }

    // 3. Fallback Response if Gemini fails
    const mockReport = `# 📋 SURAT HASIL AUDIT KEPATUHAN AI
**KOPERASI DESA MERAH PUTIH (KDMP)**
*Tanggal Audit: ${new Date().toLocaleDateString('id-ID')}*
*Auditor: Asisten AI Kepatuhan AmanDes (Kemenkop RI Mock Generator)*

---

### I. RINGKASAN EKSEKUTIF
Berdasarkan analisis otomatis terhadap pembukuan kas Koperasi Desa Merah Putih:
*   **Indeks Kepatuhan Hukum:** **${healthScore}%** (Status: ${healthScore >= 80 ? 'SEHAT & PATUH' : 'DALAM PENGAWASAN KETAT'}).
*   **Temuan Pelanggaran Aktif:** **${riskRows.length} Kasus**.

---

### II. DAFTAR TEMUAN PELANGGARAN REGULASI
${
  riskRows.length > 0
    ? riskRows.map((r, i) => `
${i + 1}. **Temuan Kode: ${r.rule_code}** (${r.risk_level.toUpperCase()})
   *   *Deskripsi:* ${r.message}
   *   *Transaksi:* "${r.description}" senilai **Rp${Number(r.amount).toLocaleString('id-ID')}**
   *   *Dampak Regulasi:* Berpotensi melanggar ketentuan sanksi administratif dan penghentian alokasi Dana Desa.
`).join('\n')
    : '*Tidak ditemukan temuan pelanggaran aktif. Transaksi berjalan 100% patuh terhadap PMK 7/2026 dan PMK 15/2026.*'
}

---

### III. LEMBAR REKOMENDASI AKSI PERBAIKAN
1.  **Segera Lakukan Resolusi Risiko:**
    Pengurus wajib masuk ke tab **Kepatuhan PMK** untuk menindaklanjuti temuan yang berisiko tinggi. Transaksi yang salah peruntukan harus segera ditolak atau direvisi keterangannya.
2.  **Patuhi Plafon Kredit & Tenor:**
    Pastikan tidak menyetujui pinjaman anggota di atas Rp50.000.000 atau tenor lebih dari 72 bulan demi menjaga likuiditas kas desa.
3.  **Lengkapi Bukti Fisik Transaksi:**
    Unggah bukti invoice/nota (Evidence URL) untuk semua transaksi bernilai besar di atas Rp5.000.000 guna menghindari dugaan penggelapan kas.`;

    return NextResponse.json({ report: mockReport });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal menjalankan audit AI: ' + error.message }, { status: 500 });
  }
}
