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
      console.log(`[Gemini Round-Robin Pool]: Rotating API Key to index ${currentIndex % keys.length} from pool`);
      currentIndex = (currentIndex + 1) % keys.length;
      return key;
    }
  }
  return process.env.GEMINI_API_KEY || '';
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Pesan kosong' }, { status: 400 });
    }

    const query = message.toLowerCase().trim();

    // 1. Fetch live database context
    const { rows: healthRows } = await db.query(
      `SELECT score FROM ${p('koperasi_health_score')} 
       WHERE koperasi_ref = $1 ORDER BY checked_at DESC LIMIT 1`,
      [session.koperasiRef]
    );
    const healthScore = healthRows[0]?.score ?? 100;

    const { rows: riskRows } = await db.query(
      `SELECT r.rule_code, r.message, t.description, t.amount, t.transaction_date 
       FROM ${p('risk_logs')} r
       JOIN ${p('transaksi_keuangan')} t ON r.transaction_id = t.id
       WHERE t.koperasi_ref = $1 AND r.resolved = false`,
      [session.koperasiRef]
    );

    const apiKey = getNextApiKey();

    // 2. If Gemini API Key is configured, use real live Gemini 2.5 model!
    if (apiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const systemInstruction = `Anda adalah "AmanDes AI Auditor", asisten kecerdasan buatan dan konsultan hukum Koperasi Unit Desa (KUD) di Indonesia.
Gunakan gaya bahasa Indonesia yang profesional, ramah, dan berwibawa.
Patuhi dasar hukum berikut dalam memberikan jawaban:
1. UU Perkoperasian No. 25 Tahun 1992 (Pasal 26 & 34).
2. UU Desa No. 6 Tahun 2014 (Pasal 19).
3. PMK No. 7/2026 tentang Dana Desa (Hanya untuk fisik/gerai/gudang KDMP, dilarang untuk operasional kantor).
4. PMK No. 15/2026 (Plafon pinjaman anggota max Rp50.000.000, tenor max 72 bulan, rasio operasional pengurus max 30%).
5. SAK ETAP dan Prinsip Akuntansi Koperasi.

Konteks Real-Time Koperasi Desa Pengguna saat ini:
- Nama Pengguna: ${session.fullName}
- Peran Pengguna: ${session.role}
- Skor Kesehatan Kepatuhan KUD saat ini: ${healthScore}%
- Daftar Temuan Pelanggaran Aktif di Database Koperasi: ${JSON.stringify(riskRows)}

Tugas Anda:
- Jika pengguna menanyakan tentang kesehatan, audit, atau temuan pelanggaran koperasi mereka saat ini, analisis data real-time di atas dan berikan penjelasan detail serta saran aksi nyata yang solutif.
- Jika pengguna bertanya tentang dasar hukum (PMK, UU, Akuntansi), jelaskan dengan menyebutkan nomor pasal dan implementasinya di desa.
- Selalu berikan struktur Markdown yang bersih (gunakan bullet points, bolding, dan sub-header).`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: `${systemInstruction}\n\nPertanyaan pengguna: ${message}` }
              ]
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return NextResponse.json({ reply });
        }
      } else {
        console.error('[Gemini Pool Error]: API call failed, falling back to local fallback. Status:', response.status);
      }
    }

    // 3. Graceful Fallback if API key is missing or API call fails
    let reply = '';
    const poolStr = process.env.GEMINI_API_KEY_POOL;
    const poolLength = poolStr ? poolStr.split(',').filter(Boolean).length : 0;
    const missingKeyNotice = !apiKey 
      ? `\n\n*(Catatan Dev: Kunci API Gemini belum disetel. Menampilkan respon otomatis terstruktur lokal)*` 
      : (poolLength > 0 
          ? `\n\n*(Catatan Dev: Menggunakan Gemini API Pool Round Robin - Indeks Ke-${(currentIndex - 1 + poolLength) % poolLength})*`
          : `\n\n*(Catatan Dev: Menggunakan Kunci API Tunggal)*`
        );

    if (query.includes('skor') || query.includes('kesehatan') || query.includes('audit') || query.includes('status')) {
      reply = `### 📊 Laporan Audit AI Kepatuhan Koperasi Anda:

Status Kesehatan Koperasi Desa saat ini berada di angka **${healthScore}%** (Kategori: ${healthScore >= 80 ? 'SEHAT & PATUH' : 'DALAM PENGAWASAN'}).

${riskRows.length > 0 ? `Ditemukan **${riskRows.length} pelanggaran aktif** yang membutuhkan tindakan segera:
${riskRows.map((r, i) => `${i + 1}. **${r.rule_code}**: ${r.message} (Transaksi: *"${r.description}"* senilai **Rp${Number(r.amount).toLocaleString('id-ID')}**).`).join('\n')}\n\n**Rekomendasi Tindakan AI:** Segera buka tab **"Kepatuhan PMK"** dan lakukan tindakan penyelesaian (resolusi) atau tolak transaksi yang bersangkutan untuk mengembalikan skor kesehatan koperasi Anda ke 100%.` : `Koperasi Anda berada dalam kondisi **prima dan 100% patuh** terhadap seluruh regulasi menteri (PMK 7/2026 & PMK 15/2026) serta UU Koperasi. Tidak ada temuan pelanggaran aktif.`}${missingKeyNotice}`;

    } else if (query.includes('dana desa') || query.includes('pmk 7') || query.includes('pmk 7/2026')) {
      reply = `### 🌾 Ringkasan Regulasi Penggunaan Dana Desa (PMK No. 7/2026):

Berdasarkan **PMK Nomor 7 Tahun 2026 Pasal 15 & 20**, serta **UU Desa No. 6/2014 Pasal 19**, berikut adalah aturan ketat penggunaan Dana Desa oleh Koperasi Desa:
1. **Peruntukan Wajib:** Dana Desa hanya boleh digunakan untuk pembiayaan pembangunan fisik (seperti gerai retail, lumbung pangan, gudang komoditas, atau infrastruktur penunjang ekonomi lokal).
2. **Larangan Operasional:** Dilarang keras menggunakan Dana Desa untuk biaya operasional kantor koperasi (alat tulis kantor, printer, AC, gaji pengurus, konsumsi rapat, dll).
3. **Konsekuensi Pelanggaran:** Pelanggaran peruntukan ini akan otomatis memicu status **Risiko Tinggi** di *Risk Scanner* dan membekukan persetujuan transaksi hingga diverifikasi ulang oleh Pendamping Kemenkop.${missingKeyNotice}`;

    } else if (query.includes('plafon') || query.includes('tenor') || query.includes('pmk 15') || query.includes('pinjam')) {
      reply = `### 💳 Batas Kredit & Tenor Pinjaman Anggota (PMK No. 15/2026):

Mengikuti peraturan **PMK Nomor 15 Tahun 2026** tentang tata kelola keuangan mikro koperasi pedesaan:
- **Plafon Pinjaman Maksimal:** Pemberian pinjaman ke satu anggota tidak boleh melebihi **Rp50.000.000** (lima puluh juta rupiah).
- **Tenor Pinjaman Maksimal:** Jangka waktu pengembalian pinjaman dibatasi maksimal **72 bulan** (6 tahun).
- **Rasio Biaya Operasional:** Belanja operasional bulanan pengurus koperasi dilarang melebihi **30%** dari total pendapatan operasional koperasi guna menjamin likuiditas kas.${missingKeyNotice}`;

    } else if (query.includes('rat') || query.includes('rapat') || query.includes('tahunan')) {
      reply = `### 🗳️ Aturan Penyelenggaraan RAT (UU Koperasi No. 25/1992):

Berdasarkan **UU Nomor 25 Tahun 1992 tentang Perkoperasian Pasal 26**:
1. **Kewajiban RAT:** Rapat Anggota Tahunan (RAT) merupakan pemegang kekuasaan tertinggi di koperasi dan wajib diselenggarakan minimal **1 kali dalam setahun**.
2. **Batas Waktu Pelaksanaan:** RAT wajib dilaksanakan paling lambat **6 bulan** setelah tahun buku ditutup (biasanya sebelum tanggal 30 Juni tahun berikutnya).
3. **Penyelarasan Digital (e-RAT):** Melalui fitur **e-RAT AmanDes**, suara anggota dapat disalurkan secara digital yang sah, rahasia, dan langsung terakumulasi guna mendorong partisipasi aktif warga pedesaan.${missingKeyNotice}`;

    } else {
      reply = `Halo **${session.fullName}**, saya adalah **Asisten AI AmanDes Kepatuhan KUD**. 

Saya dapat membantu Anda memahami regulasi hukum perkoperasian di Indonesia. Coba tanyakan hal berikut kepada saya:
- *"Audit kesehatan koperasi saat ini"*
- *"Jelaskan aturan belanja Dana Desa (PMK 7/2026)"*
- *"Berapa plafon pinjaman anggota berdasarkan PMK 15/2026?"*
- *"Bagaimana aturan RAT?"*

Ada yang bisa saya bantu hari ini terkait kepatuhan hukum koperasi Anda?${missingKeyNotice}`;
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: 'Gagal memproses obrolan AI: ' + err.message }, { status: 500 });
  }
}
