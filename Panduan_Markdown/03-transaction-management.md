# Domain: Transaction Management
## 1. Tujuan Domain
Mencatat seluruh transaksi keuangan koperasi (pemasukan, pengeluaran, simpanan, pinjaman) dengan bukti pendukung dan status approval.
## 2. Actors
Pengurus (input transaksi)
Ketua (approval final — lihat domain 05)
Anggota (lihat ringkasan transaksi terkait dirinya)
## 3. Data Model
### Table: transactions
## 4. Business Rules
Setiap transaksi dengan amount di atas threshold tertentu (konfigurasi, misal Rp5.000.000) wajib menyertakan evidence_url sebelum bisa diajukan approval.
Transaksi berkategori dana_desa wajib memilih sub-kategori penggunaan (operasional/pembangunan_fisik/distribusi_pangan) untuk keperluan compliance check di domain 04. Ini mengacu pada PMK Nomor 7 Tahun 2026 (berlaku 12 Feb 2026) yang menetapkan 58,03% dari pagu Dana Desa nasional (Rp60,57 triliun) wajib dialokasikan untuk KDMP, dipakai khusus untuk pembangunan fisik gerai/gudang/kelengkapan koperasi (Pasal 15 ayat 3 & Pasal 20). 2b. Transaksi type = pinjaman wajib mengisi tenor_bulan dan bunga_persen. Berdasarkan PMK Nomor 15 Tahun 2026 (mencabut PMK Nomor 49 Tahun 2025), plafon pinjaman KDMP maksimal Rp3 Miliar per koperasi (maks Rp500 Juta untuk operasional), bunga flat 6% per tahun, tenor maksimal 72 bulan, grace period 6–12 bulan. Nilai-nilai ini jadi default form input dan basis validasi Risk Scanner (rule R08–R10, domain 04).
Status draft → menunggu_approval dipicu manual oleh pengurus (submit). Perubahan menunggu_approval → disetujui/ditolak hanya lewat domain 05-approval-workflow, tidak bisa diedit langsung di tabel ini oleh service lain.
Transaksi yang sudah disetujui bersifat immutable — koreksi hanya bisa dilakukan lewat transaksi baru (transaksi pembalik), bukan edit/hapus langsung. Ini untuk menjaga audit trail.
Setiap insert/update pada transactions memicu evaluasi otomatis oleh Risk Scanner (domain 04) sebelum status bisa berubah ke menunggu_approval.
## 5. API / Service Contract
### POST /transactions
{

  "koperasi_id": "uuid", "type": "pengeluaran", "kategori": "operasional",

  "amount": 2500000, "description": "string", "member_id": "uuid|null",

  "evidence_url": "string|null", "transaction_date": "YYYY-MM-DD"

}

Response: transaksi tersimpan status draft, plus hasil scan awal risk_level.
### POST /transactions/:id/submit
Mengubah status draft → menunggu_approval. Trigger notifikasi ke approver (domain 06).
### GET /transactions?koperasi_id=&status=&type=&date_from=&date_to=
List transaksi dengan filter (untuk dashboard pengurus).
### GET /transactions/:id
Detail transaksi termasuk histori risk log (join ke risk_logs, domain 04).
## 6. UI Screens
Form Input Transaksi — pilih tipe & kategori, nominal, upload bukti (kamera/galeri), opsi voice input.
List Transaksi — dengan badge warna sesuai risk_level (hijau/kuning/merah).
Detail Transaksi — termasuk histori approval & risk flag.
Riwayat Transaksi per Anggota (untuk simpanan personal).
## 7. Validasi & Edge Cases
amount <= 0 ditolak di validasi form.
Transaksi pengeluaran yang melebihi saldo kas koperasi saat ini → tetap bisa diinput tapi otomatis di-flag berisiko_tinggi oleh Risk Scanner.
Upload bukti gagal (koneksi lemah) → transaksi tetap tersimpan lokal (offline-first), evidence disinkronkan belakangan, status tetap draft sampai evidence lengkap.
## 8. Dependency ke Domain Lain
Trigger Risk Scanner (domain 04) setiap kali transaksi dibuat/diubah.
Perubahan status approval dikelola oleh domain 05.
Notifikasi submit/approve/reject dikirim lewat domain 06.
Data teragregasi ditampilkan di domain 07 (dashboard).


| Field | Type | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | uuid | PK | — |
| koperasi_id | uuid | FK -> koperasi.id | — |
| type | enum(pemasukan,pengeluaran,simpanan_pokok,simpanan_wajib,simpanan_sukarela,pinjaman,bagi_hasil) | not null | — |
| kategori | enum(dana_desa,simpanan_anggota,operasional,pembangunan_fisik,distribusi_pangan,lainnya) | not null | Kategori sumber/penggunaan dana |
| amount | numeric | not null, > 0 | Nominal (Rupiah) |
| description | text | not null | Keterangan transaksi |
| member_id | uuid | FK -> members.id, nullable | Anggota terkait (jika transaksi personal) |
| evidence_url | text | nullable | Link bukti (foto struk/dokumen di Supabase Storage) |
| input_by | uuid | FK -> users.id | Pengurus yang input |
| status | enum(draft,menunggu_approval,disetujui,ditolak) | default draft | — |
| risk_level | enum(aman,perlu_perhatian,berisiko_tinggi) | default aman | Diisi otomatis oleh Risk Scanner (domain 04) |
| tenor_bulan | integer | nullable | Khusus type = pinjaman, wajib diisi. Maks 72 bulan sesuai PMK 15/2026 |
| bunga_persen | numeric | nullable | Khusus type = pinjaman, default 6.0 (sesuai PMK 15/2026), bisa diedit jika ada perubahan aturan bank |
| transaction_date | date | not null | Tanggal transaksi terjadi |
| created_at | timestamptz | default now() | — |
