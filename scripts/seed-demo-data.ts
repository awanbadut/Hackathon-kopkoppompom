import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

// Load .env.local manually
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

const firstNames = [
  'Joko', 'Ani', 'Slamet', 'Sri', 'Eko', 'Kartini', 'Yusuf', 'Bambang', 'Wahyu', 'Ahmad',
  'Siti', 'Agus', 'Eka', 'Rian', 'Adi', 'Doni', 'Edi', 'Hadi', 'Hendra', 'Indah',
  'Kusuma', 'Lestari', 'Mega', 'Nur', 'Rina', 'Rudi', 'Saputra', 'Taufik', 'Utami',
  'Wawan', 'Yanto', 'Zulkifli', 'Aris', 'Dewi', 'Fitri', 'Guntur', 'Hani', 'Iwan'
];

const lastNames = [
  'Pratama', 'Wijaya', 'Hidayat', 'Setiawan', 'Nugroho', 'Saputra', 'Kusuma', 'Lestari',
  'Rahmawati', 'Utami', 'Wulandari', 'Fitriani', 'Kartika', 'Indah', 'Astuti', 'Suryadi',
  'Gunawan', 'Budiman', 'Hartono', 'Siregar', 'Nasution', 'Harahap', 'Lubis', 'Pohan'
];

const jobs = [
  'Petani', 'Pekebun', 'Pedagang Sembako', 'Nelayan', 'Wiraswasta', 'Guru Honorer',
  'Buruh Harian', 'Peternak Sapi', 'Ibu Rumah Tangga', 'Pengrajin Kayu'
];

function generateName(index: number): string {
  const f = firstNames[index % firstNames.length];
  const l = lastNames[(index * 3) % lastNames.length];
  return `${f} ${l}`;
}

async function main() {
  console.log(`Connecting to database at ${process.env.DB_HOST}...`);
  await client.connect();
  console.log('Connected! Seeding demo data with prefix:', prefix);

  // 1. referensi_wilayah
  await client.query(`
    INSERT INTO ${p('referensi_wilayah')} (kode_wilayah, provinsi, kab_kota, kecamatan, desa_kelurahan)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (kode_wilayah) DO UPDATE 
    SET provinsi = EXCLUDED.provinsi, kab_kota = EXCLUDED.kab_kota, 
        kecamatan = EXCLUDED.kecamatan, desa_kelurahan = EXCLUDED.desa_kelurahan
  `, ['32.01.01.2001', 'Jawa Barat', 'Bogor', 'Ciawi', 'Merah Putih']);
  console.log('✓ Seeded referensi_wilayah');

  // 2. referensi_koperasi_wilayah
  await client.query(`
    INSERT INTO ${p('referensi_koperasi_wilayah')} (koperasi_ref, kode_wilayah)
    VALUES ($1, $2)
    ON CONFLICT (koperasi_ref) DO UPDATE SET kode_wilayah = EXCLUDED.kode_wilayah
  `, ['KOP-539EF09CDAAD', '32.01.01.2001']);
  console.log('✓ Seeded referensi_koperasi_wilayah');

  // 3. referensi_profil_desa
  await client.query(`
    INSERT INTO ${p('referensi_profil_desa')} (kode_wilayah, tahun_populasi, total_penduduk, penduduk_laki_laki, penduduk_perempuan, tahun_pendanaan, anggaran_dana_desa)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (kode_wilayah) DO UPDATE 
    SET tahun_populasi = EXCLUDED.tahun_populasi, total_penduduk = EXCLUDED.total_penduduk,
        penduduk_laki_laki = EXCLUDED.penduduk_laki_laki, penduduk_perempuan = EXCLUDED.penduduk_perempuan,
        tahun_pendanaan = EXCLUDED.tahun_pendanaan, anggaran_dana_desa = EXCLUDED.anggaran_dana_desa
  `, ['32.01.01.2001', 2026, 4500, 2200, 2300, 2026, 1200000000]);
  console.log('✓ Seeded referensi_profil_desa');

  // 4. profil_koperasi
  await client.query(`
    INSERT INTO ${p('profil_koperasi')} (koperasi_ref, nama_koperasi, status_registrasi, bentuk_koperasi, kategori_usaha, nik_koperasi, alamat_lengkap, kode_pos, modal_awal)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (koperasi_ref) DO UPDATE 
    SET nama_koperasi = EXCLUDED.nama_koperasi, status_registrasi = EXCLUDED.status_registrasi,
        bentuk_koperasi = EXCLUDED.bentuk_koperasi, kategori_usaha = EXCLUDED.kategori_usaha,
        nik_koperasi = EXCLUDED.nik_koperasi, alamat_lengkap = EXCLUDED.alamat_lengkap,
        kode_pos = EXCLUDED.kode_pos, modal_awal = EXCLUDED.modal_awal
  `, [
    'KOP-539EF09CDAAD', 
    'Koperasi Desa Merah Putih', 
    'Terverifikasi', 
    'Produsen', 
    'Sektor Riil', 
    '3201010000000001', 
    'Jalan Raya Puncak No. 100, Desa Merah Putih', 
    '16720', 
    250000000
  ]);
  console.log('✓ Seeded profil_koperasi');

  // Seed rat_koperasi to avoid LATE_RAT flag in demo data
  await client.query(`
    INSERT INTO ${p('rat_koperasi')} (rat_sample_id, koperasi_ref, tanggal_rat, tahun_buku, status_rat)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (rat_sample_id) DO UPDATE 
    SET tanggal_rat = EXCLUDED.tanggal_rat, tahun_buku = EXCLUDED.tahun_buku,
        status_rat = EXCLUDED.status_rat
  `, [
    'RAT-MOCK-001', 'KOP-539EF09CDAAD', new Date().toISOString().split('T')[0], 2025, 'Sah'
  ]);
  console.log('✓ Seeded rat_koperasi');

  // 5. pengurus_koperasi
  await client.query(`
    INSERT INTO ${p('pengurus_koperasi')} (pengurus_ref, koperasi_ref, nama, jabatan, status, no_hp, nik, jenis_kelamin, email, alamat)
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),
    ($11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    ON CONFLICT (pengurus_ref) DO UPDATE 
    SET koperasi_ref = EXCLUDED.koperasi_ref, nama = EXCLUDED.nama, jabatan = EXCLUDED.jabatan,
        status = EXCLUDED.status, no_hp = EXCLUDED.no_hp, nik = EXCLUDED.nik,
        jenis_kelamin = EXCLUDED.jenis_kelamin, email = EXCLUDED.email, alamat = EXCLUDED.alamat
  `, [
    'MGR-KETUA-001', 'KOP-539EF09CDAAD', 'H. Ahmad Syarif', 'Ketua', 'Aktif', '081200000001', '3201010101010001', 'LAKI-LAKI', 'ahmad@merahputih.desa', 'Desa Merah Putih RT 01/RW 01',
    'MGR-BEND-001', 'KOP-539EF09CDAAD', 'Siti Rahma', 'Bendahara', 'Aktif', '081200000002', '3201010101010002', 'PEREMPUAN', 'siti@merahputih.desa', 'Desa Merah Putih RT 02/RW 01'
  ]);
  console.log('✓ Seeded pengurus_koperasi');

  // 6. Seed 100 Members (anggota_koperasi) & App Users
  console.log('Generating and seeding 100 members and linking to app_users...');
  
  // Standard manager and pendamping users
  await client.query(`
    INSERT INTO ${p('app_users')} (id, full_name, phone_number, ktp_number, role, koperasi_ref, pengurus_ref, status)
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8),
    ($9, $10, $11, $12, $13, $14, $15, $16),
    ($17, $18, $19, $20, $21, $22, NULL, $23)
    ON CONFLICT (phone_number) DO UPDATE 
    SET full_name = EXCLUDED.full_name, ktp_number = EXCLUDED.ktp_number, role = EXCLUDED.role,
        koperasi_ref = EXCLUDED.koperasi_ref, pengurus_ref = EXCLUDED.pengurus_ref, status = EXCLUDED.status
  `, [
    'd142d765-bcf7-4f0e-b7d1-127e7d69e801', 'H. Ahmad Syarif', '081200000001', '3201010101010001', 'ketua', 'KOP-539EF09CDAAD', 'MGR-KETUA-001', 'active',
    'd142d765-bcf7-4f0e-b7d1-127e7d69e802', 'Siti Rahma', '081200000002', '3201010101010002', 'pengurus', 'KOP-539EF09CDAAD', 'MGR-BEND-001', 'active',
    'd142d765-bcf7-4f0e-b7d1-127e7d69e899', 'Drs. Bambang Wijaya', '081200000099', '3201010101010099', 'pendamping', 'KOP-539EF09CDAAD', 'active'
  ]);

  for (let i = 1; i <= 100; i++) {
    const memberRef = `MBR-${String(i).padStart(3, '0')}`;
    
    // For MBR-001 (Budi Santoso), reuse the exact standard demo credentials to avoid breaking any tests
    const userId = i === 1 ? 'd142d765-bcf7-4f0e-b7d1-127e7d69e803' : `d142d765-bcf7-4f0e-b7d1-127e7d69e${String(i + 100).padStart(3, '0')}`;
    const name = i === 1 ? 'Budi Santoso' : generateName(i);
    const nik = i === 1 ? '3201010101010003' : `320101010101${String(i + 100).padStart(4, '0')}`;
    const phone = i === 1 ? '081200000003' : `0812${String(i + 100).padStart(8, '0')}`;
    
    const job = jobs[i % jobs.length];

    // Seed anggota_koperasi
    await client.query(`
      INSERT INTO ${p('anggota_koperasi')} (anggota_ref, koperasi_ref, nama, nik, kode_wilayah, jenis_kelamin, status_keanggotaan, status_akun, pekerjaan)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (anggota_ref) DO UPDATE 
      SET koperasi_ref = EXCLUDED.koperasi_ref, nama = EXCLUDED.nama, nik = EXCLUDED.nik,
          kode_wilayah = EXCLUDED.kode_wilayah, jenis_kelamin = EXCLUDED.jenis_kelamin,
          status_keanggotaan = EXCLUDED.status_keanggotaan, status_akun = EXCLUDED.status_akun,
          pekerjaan = EXCLUDED.pekerjaan
    `, [memberRef, 'KOP-539EF09CDAAD', name, nik, '32.01.01.2001', i % 2 === 0 ? 'PEREMPUAN' : 'LAKI-LAKI', 'Approved', 'Punya Akun', job]);

    // Seed app_users for this member
    await client.query(`
      INSERT INTO ${p('app_users')} (id, full_name, phone_number, ktp_number, role, koperasi_ref, anggota_ref, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (phone_number) DO UPDATE 
      SET full_name = EXCLUDED.full_name, ktp_number = EXCLUDED.ktp_number, role = EXCLUDED.role,
          koperasi_ref = EXCLUDED.koperasi_ref, anggota_ref = EXCLUDED.anggota_ref, status = EXCLUDED.status
    `, [userId, name, phone, nik, 'anggota', 'KOP-539EF09CDAAD', memberRef, 'active']);

    // Seed User Points
    const points = 10 + (i * 3) % 90; // Between 10 and 100 points
    await client.query(`
      INSERT INTO ${p('user_points')} (user_id, total_points)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE SET total_points = EXCLUDED.total_points
    `, [userId, points]);
  }
  console.log('✓ Seeded 100 members, app_users, and user_points');

  // 7. learning_modules
  const module1Quiz = JSON.stringify({
    questions: [
      {
        question: "Berapa persentase Dana Desa nasional yang dialokasikan untuk KDMP berdasarkan PMK 7/2026?",
        options: ["40.15%", "50.00%", "58.03%", "65.50%"],
        answer: "58.03%"
      },
      {
        question: "Berapakah plafon maksimal pinjaman per koperasi sesuai PMK 15/2026?",
        options: ["Rp1 Miliar", "Rp2 Miliar", "Rp3 Miliar", "Rp5 Miliar"],
        answer: "Rp3 Miliar"
      }
    ]
  });

  const module2Quiz = JSON.stringify({
    questions: [
      {
        question: "Siapa yang wajib menyetujui transaksi jika terdeteksi berisiko tinggi?",
        options: ["Cukup 1 pengamat", "Bendahara saja", "Salah satu harus Ketua Koperasi", "Sistem langsung menyetujui"],
        answer: "Salah satu harus Ketua Koperasi"
      }
    ]
  });

  await client.query(`
    INSERT INTO ${p('learning_modules')} (id, title, content, category, points_reward, quiz_json)
    VALUES 
    ($1, $2, $3, $4, $5, $6),
    ($7, $8, $9, $10, $11, $12)
    ON CONFLICT (id) DO UPDATE 
    SET title = EXCLUDED.title, content = EXCLUDED.content, category = EXCLUDED.category,
        points_reward = EXCLUDED.points_reward, quiz_json = EXCLUDED.quiz_json
  `, [
    'b331f822-7901-4475-be02-127e7d69e851', 
    'Dasar-Dasar Kepatuhan Koperasi & Regulasi Dana Desa', 
    `# Regulasi Kepatuhan Koperasi Desa

Koperasi Desa Merah Putih (KDMP) merupakan badan usaha yang mengelola dana masyarakat sekaligus Dana Desa. Kepatuhan regulasi sangat penting untuk menjaga amanah dan menghindari sanksi hukum.

## Pasal Penting PMK Nomor 7 Tahun 2026
*   **58,03%** dari Pagu Dana Desa yang diterima wajib dialokasikan untuk koperasi desa.
*   Dana tersebut dikhususkan untuk **Pembangunan Fisik** seperti gerai, gudang, dan kelengkapan operasional retail koperasi.
*   Penggunaan dana untuk keperluan di luar ketentuan di atas akan dikenai sanksi penangguhan dana tahap berikutnya.

## Skema Pinjaman PMK Nomor 49/2025
*   Plafon pinjaman maksimal: **Rp3.000.000.000 (3 Miliar)**.
*   Batas belanja operasional dari pinjaman: Maksimal **Rp500.000.000**.
*   Tenor maksimal: **72 Bulan (6 Tahun)**.
*   Bunga flat: **6.0%** per tahun.`,
    'tata_kelola', 15, module1Quiz,

    'b331f822-7901-4475-be02-127e7d69e852',
    'Manajemen Risiko Keuangan Koperasi Desa',
    `# Manajemen Risiko Keuangan Koperasi

Untuk mencegah terjadinya penyalahgunaan wewenang dan kesalahan pencatatan keuangan, AmanDes menggunakan prinsip **Segregation of Duties** (Pemisahan Wewenang).

## Aturan Approval Berjenjang
1.  **Transaksi Aman**: Membutuhkan minimal **1 persetujuan** dari pengurus lain yang bukan pembuat transaksi.
2.  **Perlu Perhatian (Risk Alert)**: Membutuhkan minimal **2 persetujuan** dari pengurus berbeda.
3.  **Berisiko Tinggi**: Membutuhkan minimal **2 persetujuan**, di mana salah satunya wajib disetujui oleh **Ketua Koperasi**.

## Prinsip Pengawasan
*   Sistem tidak pernah memblokir transaksi secara otomatis, melainkan menaikkan tingkat persetujuan yang dibutuhkan (*human-in-the-loop*).
*   Semua transaksi di atas Rp5.000.000 wajib memiliki bukti transaksi berupa unggahan gambar/nota.`,
    'keuangan', 20, module2Quiz
  ]);
  console.log('✓ Seeded learning_modules');

  // 8. rat_voting_agenda
  await client.query(`
    INSERT INTO ${p('rat_voting_agenda')} (id, koperasi_ref, title, description, options, status)
    VALUES 
    ($1, $2, $3, $4, $5, $6),
    ($7, $8, $9, $10, $11, $12)
    ON CONFLICT (id) DO UPDATE 
    SET title = EXCLUDED.title, description = EXCLUDED.description, 
        options = EXCLUDED.options, status = EXCLUDED.status
  `, [
    'c142d765-bcf7-4f0e-b7d1-127e7d69e881', 'KOP-539EF09CDAAD', 
    'Persetujuan Rencana Anggaran Belanja (RAB) Koperasi Tahun Buku 2026',
    'Voting anggota untuk pengesahan alokasi belanja operasional dan fisik koperasi desa menggunakan dana desa dan simpanan wajib.',
    ['Setuju', 'Tolak', 'Abstain'], 'aktif',

    'c142d765-bcf7-4f0e-b7d1-127e7d69e882', 'KOP-539EF09CDAAD',
    'Pemilihan Ketua Koperasi Baru Periode Jabatan 2026-2029',
    'Pemungutan suara berkala anggota koperasi desa untuk menentukan Ketua Umum Pengurus Koperasi Desa Merah Putih selanjutnya.',
    ['Calon 1: H. Ahmad Syarif (Incumbent)', 'Calon 2: Siti Rahma'], 'aktif'
  ]);
  console.log('✓ Seeded rat_voting_agenda');

  // 9. Seed Votes for the 100 Members in both agendas
  console.log('Seeding votes for 100 members...');
  for (let i = 1; i <= 100; i++) {
    const userId = i === 1 ? 'd142d765-bcf7-4f0e-b7d1-127e7d69e803' : `d142d765-bcf7-4f0e-b7d1-127e7d69e${String(i + 100).padStart(3, '0')}`;
    const vote1 = ['Setuju', 'Tolak', 'Abstain'][i % 3];
    const vote2 = ['Calon 1: H. Ahmad Syarif (Incumbent)', 'Calon 2: Siti Rahma'][i % 2];

    await client.query(`
      INSERT INTO ${p('rat_votes')} (agenda_id, user_id, voted_option)
      VALUES ($1, $2, $3)
      ON CONFLICT (agenda_id, user_id) DO UPDATE SET voted_option = EXCLUDED.voted_option
    `, ['c142d765-bcf7-4f0e-b7d1-127e7d69e881', userId, vote1]);

    await client.query(`
      INSERT INTO ${p('rat_votes')} (agenda_id, user_id, voted_option)
      VALUES ($1, $2, $3)
      ON CONFLICT (agenda_id, user_id) DO UPDATE SET voted_option = EXCLUDED.voted_option
    `, ['c142d765-bcf7-4f0e-b7d1-127e7d69e882', userId, vote2]);
  }
  console.log('✓ Seeded 200 votes (e-RAT)');

  // 10. community_aspirations
  await client.query(`
    INSERT INTO ${p('community_aspirations')} (id, koperasi_ref, user_id, title, description, upvotes_count, status, admin_response)
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8),
    ($9, $10, $11, $12, $13, $14, $15, $16)
    ON CONFLICT (id) DO UPDATE 
    SET title = EXCLUDED.title, description = EXCLUDED.description, 
        upvotes_count = EXCLUDED.upvotes_count, status = EXCLUDED.status, 
        admin_response = EXCLUDED.admin_response
  `, [
    'a142d765-bcf7-4f0e-b7d1-127e7d69e891', 'KOP-539EF09CDAAD', 'd142d765-bcf7-4f0e-b7d1-127e7d69e803',
    'Saran untuk menambah lini komoditas beras organik lokal desa',
    'Bagaimana kalau koperasi kita mulai menampung dan menjual beras organik dari para petani lokal? Permintaan pasar di kota tetangga saat ini sangat tinggi dan harga jualnya lebih menguntungkan.',
    5, 'diajukan', null,

    'a142d765-bcf7-4f0e-b7d1-127e7d69e892', 'KOP-539EF09CDAAD', 'd142d765-bcf7-4f0e-b7d1-127e7d69e803',
    'Usulan perbaikan atap gudang penyimpanan pupuk pertanian',
    'Atap gudang penyimpanan pupuk di sebelah selatan bocor cukup parah jika hujan lebat. Khawatir merusak kualitas timbunan pupuk urea milik kelompok tani. Perlu segera ditindaklanjuti.',
    12, 'ditanggapi', 'Usulan telah disetujui oleh pengurus. Anggaran belanja tak terduga untuk perbaikan atap gudang sebesar Rp4.500.000 telah dialokasikan dan pekerjaan perbaikan atap akan dikerjakan minggu depan.'
  ]);
  console.log('✓ Seeded community_aspirations');

  // 11. Seed random upvotes to aspirations to represent community engagement
  console.log('Seeding upvotes on aspirations...');
  for (let i = 1; i <= 40; i++) {
    const userId = i === 1 ? 'd142d765-bcf7-4f0e-b7d1-127e7d69e803' : `d142d765-bcf7-4f0e-b7d1-127e7d69e${String(i + 100).padStart(3, '0')}`;
    
    if (i <= 25) {
      await client.query(`
        INSERT INTO ${p('aspiration_upvotes')} (aspiration_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (aspiration_id, user_id) DO NOTHING
      `, ['a142d765-bcf7-4f0e-b7d1-127e7d69e891', userId]);
    }

    await client.query(`
      INSERT INTO ${p('aspiration_upvotes')} (aspiration_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (aspiration_id, user_id) DO NOTHING
    `, ['a142d765-bcf7-4f0e-b7d1-127e7d69e892', userId]);
  }
  console.log('✓ Seeded aspiration upvotes');

  // 12. Seed financial transactions (Savings Pokok, Wajib, Sukarela & Withdrawals) for all 100 members!
  console.log('Seeding financial transactions for all 100 members...');
  
  const simpananKategori = prefix + 'simpanan_anggota';

  // Clean old savings/financial transactions first to avoid duplicates or overflow
  await client.query(`
    DELETE FROM ${p('transaksi_keuangan')} 
    WHERE type IN ('simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela')
       OR (type = 'pengeluaran' AND kategori = $1)
  `, [simpananKategori]);

  for (let i = 1; i <= 100; i++) {
    const memberRef = `MBR-${String(i).padStart(3, '0')}`;
    const name = i === 1 ? 'Budi Santoso' : generateName(i);
    
    // Deposit Pokok (Rp100.000)
    await client.query(`
      INSERT INTO ${p('transaksi_keuangan')} (id, koperasi_ref, type, sumber_dana, kategori, amount, description, status, input_by, anggota_ref, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, now() - interval '30 days')
    `, ['KOP-539EF09CDAAD', 'simpanan_pokok', 'non_dana_desa', simpananKategori, 100000, `Setoran Simpanan Pokok Awal - ${name}`, 'disetujui', 'd142d765-bcf7-4f0e-b7d1-127e7d69e802', memberRef]);

    // Deposit Wajib (Rp50.000)
    await client.query(`
      INSERT INTO ${p('transaksi_keuangan')} (id, koperasi_ref, type, sumber_dana, kategori, amount, description, status, input_by, anggota_ref, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, now() - interval '15 days')
    `, ['KOP-539EF09CDAAD', 'simpanan_wajib', 'non_dana_desa', simpananKategori, 50000, `Setoran Simpanan Wajib Bulanan - ${name}`, 'disetujui', 'd142d765-bcf7-4f0e-b7d1-127e7d69e802', memberRef]);

    // Deposit Sukarela (Random Rp50.000 to Rp300.000)
    const sukarelaAmount = 50000 + (i * 7000) % 250000;
    await client.query(`
      INSERT INTO ${p('transaksi_keuangan')} (id, koperasi_ref, type, sumber_dana, kategori, amount, description, status, input_by, anggota_ref, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, now() - interval '5 days')
    `, ['KOP-539EF09CDAAD', 'simpanan_sukarela', 'non_dana_desa', simpananKategori, sukarelaAmount, `Setoran Tabungan Sukarela - ${name}`, 'disetujui', 'd142d765-bcf7-4f0e-b7d1-127e7d69e802', memberRef]);

    // Withdraw Sukarela for some members (e.g. index divisible by 5)
    if (i % 5 === 0) {
      const withdrawAmount = 20000 + (i * 1000) % 30000;
      await client.query(`
        INSERT INTO ${p('transaksi_keuangan')} (id, koperasi_ref, type, sumber_dana, kategori, amount, description, status, input_by, anggota_ref, created_at)
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, now() - interval '1 day')
      `, ['KOP-539EF09CDAAD', 'pengeluaran', 'non_dana_desa', simpananKategori, withdrawAmount, `Penarikan Simpanan Sukarela - ${name}`, 'disetujui', 'd142d765-bcf7-4f0e-b7d1-127e7d69e802', memberRef]);
    }
  }
  console.log('✓ Seeded approved savings deposit & withdrawal transactions for all 100 members');

  // 13. reward_vouchers
  await client.query(`
    INSERT INTO ${p('reward_vouchers')} (id, title, points_cost, description, stock)
    VALUES 
    ($1, $2, $3, $4, $5),
    ($6, $7, $8, $9, $10)
    ON CONFLICT (id) DO UPDATE 
    SET title = EXCLUDED.title, points_cost = EXCLUDED.points_cost, 
        description = EXCLUDED.description, stock = EXCLUDED.stock
  `, [
    'b142d765-bcf7-4f0e-b7d1-127e7d69e871', 'Voucher Belanja Gerai Rp10.000', 10, 'Voucher potongan harga belanja senilai Rp10.000 di Gerai Retail Koperasi Desa Merah Putih.', 100,
    'b142d765-bcf7-4f0e-b7d1-127e7d69e872', 'Gratis Minyak Goreng 1 Liter', 25, 'Kupon penukaran gratis minyak goreng kemasan 1 Liter di warung sembako koperasi.', 50
  ]);
  console.log('✓ Seeded reward_vouchers');

  await client.end();
  console.log('Seed completed successfully!');
}

main().catch(async err => {
  console.error('Fatal error during seed:', err);
  try {
    await client.end();
  } catch (e) {}
  process.exit(1);
});
