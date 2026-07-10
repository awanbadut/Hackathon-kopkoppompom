# Domain: Risk Scanner & Compliance Checker
## 1. Tujuan Domain
Mendeteksi transaksi/aktivitas berisiko secara otomatis berbasis rule, menandai tingkat risiko, dan mencatat alasan flag — sebagai lapisan perlindungan utama bagi pengurus (fitur pembeda AmanDes dari sistem koperasi biasa).
## 2. Actors
Sistem (otomatis, triggered oleh domain 03)
Pengurus/Ketua (menerima & menindaklanjuti flag)
Pendamping (melihat ringkasan tingkat kepatuhan koperasi)
## 3. Data Model
### Table: risk_logs
### Table: koperasi_health_score (agregat, di-update berkala)
## 4. Daftar Rule (Rule-Based Engine — bukan ML, deterministik)
### Sumber Data Resmi (Referensi Regulasi — per Juli 2026)
PMK Nomor 7 Tahun 2026 (berlaku 12 Feb 2026): pagu Dana Desa nasional Rp60,57 triliun; 58,03% (≈Rp34,57 triliun) wajib dialokasikan untuk KDMP, dipakai untuk pembangunan fisik gerai, gudang, dan kelengkapan koperasi (Pasal 15 ayat 3, Pasal 20 ayat 1 huruf e).
PMK Nomor 15 Tahun 2026 (skema pinjaman perbankan Himbara untuk KDMP, mencabut PMK Nomor 49 Tahun 2025): plafon maksimal Rp3 Miliar per koperasi, dari situ maksimal Rp500 Juta untuk belanja operasional, bunga/margin 6% per tahun (flat), tenor maksimal 72 bulan, grace period 6–12 bulan.

Catatan: field pagu_dana_desa_desa di rule R02b perlu diisi manual per koperasi (data ini spesifik per desa, tidak tersedia via API publik) — sumber data bisa diambil dari SIMKOPDES (https://simkopdes.go.id/pers/dashboard) sesuai referensi TOR, atau diinput manual oleh pendamping. Angka regulasi di atas bisa berubah, cek ulang ke JDIH Kementerian Keuangan sebelum submission final.
## 5. Business Rules (Logika Eksekusi)
Risk Scanner dijalankan otomatis (via Supabase Edge Function/Trigger) setiap kali transactions di-insert atau di-update ke status menunggu_approval.
Setiap rule yang terpicu menghasilkan satu baris di risk_logs.
risk_level pada tabel transactions diambil dari level tertinggi di antara semua rule yang terpicu untuk transaksi tersebut (berisiko_tinggi > perlu_perhatian > aman).
Sistem tidak pernah memblokir transaksi secara otomatis (fail-safe/human-in-the-loop) — hanya menambah syarat approval (lihat domain 05: transaksi berisiko_tinggi butuh approval dari ketua, bukan cukup pengurus biasa).
koperasi_health_score dihitung ulang harian: 100 - (jumlah risk_logs unresolved berisiko_tinggi * 10) - (jumlah risk_logs unresolved perlu_perhatian * 3), floor di 0.
## 6. API / Service Contract
### POST /risk-scanner/evaluate (dipanggil internal oleh domain 03, bukan dari client langsung)
{ "transaction_id": "uuid" }

Response: list rule yang terpicu + risk_level final.
### GET /risk-logs?koperasi_id=&resolved=false
List flag yang belum ditindaklanjuti (untuk dashboard pengurus).
### PATCH /risk-logs/:id/resolve
{ "resolved_note": "string" }
### GET /koperasi/:id/health-score
Response: skor terkini + trend 30 hari terakhir.
## 7. UI Screens
Risk Alert Banner — muncul di dashboard pengurus jika ada flag berisiko_tinggi belum ditindaklanjuti.
Daftar Risk Log — filter by resolved/unresolved, risk level.
Health Score Widget — gauge/skor di dashboard utama.
Detail Rule Terpicu — penjelasan rule + tombol "Tandai Sudah Ditindaklanjuti".
## 8. Edge Cases
Transaksi tanpa kategori yang jelas (edge input error) → default masuk perlu_perhatian dengan rule generik "Kategori tidak lengkap".
Rule R03 (over budget) butuh saldo kas real-time — pastikan query saldo dihitung dari SUM transaksi disetujui, bukan cache basi.
## 9. Dependency ke Domain Lain
Triggered oleh domain 03 (transactions).
Menentukan syarat approval di domain 05.
Ditampilkan agregat di domain 07 (dashboard) dan dikirim sebagai notifikasi via domain 06.


| Field | Type | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | uuid | PK | — |
| transaction_id | uuid | FK -> transactions.id, not null | — |
| rule_code | text | not null | Kode rule yang terpicu (lihat daftar rule di bawah) |
| risk_level | enum(perlu_perhatian,berisiko_tinggi) | not null | — |
| message | text | not null | Penjelasan human-readable kenapa terpicu |
| resolved | boolean | default false | Apakah sudah ditindaklanjuti pengurus |
| resolved_note | text | nullable | Catatan tindak lanjut |
| created_at | timestamptz | default now() | — |


| Field | Type | Deskripsi |
| --- | --- | --- |
| koperasi_id | uuid | FK -> koperasi.id |
| score | integer (0-100) | Skor kesehatan kepatuhan |
| last_calculated_at | timestamptz | — |


| Rule Code | Trigger Condition | Risk Level | Pesan |
| --- | --- | --- | --- |
| R01_NO_EVIDENCE | amount > Rp5.000.000 dan evidence_url kosong | berisiko_tinggi | "Transaksi besar tanpa bukti pendukung" |
| R02_DANA_DESA_MISMATCH | kategori = dana_desa tapi sub-kategori bukan pembangunan_fisik (gerai/gudang/kelengkapan) atau angsuran pinjaman terkait KDMP — sesuai peruntukan resmi Pasal 20 PMK 7/2026 | berisiko_tinggi | "Penggunaan Dana Desa tidak sesuai peruntukan resmi KDMP (gerai/gudang/kelengkapan)" |
| R02b_DANA_DESA_ALOKASI_CAP | Akumulasi transaksi kategori = dana_desa pada satu koperasi melebihi 58,03% dari total Dana Desa yang diterima desa tsb (field pagu_dana_desa_desa di tabel koperasi, diisi manual dari data resmi desa) | perlu_perhatian | "Realisasi Dana Desa untuk KDMP mendekati/melebihi batas alokasi 58,03% sesuai PMK 7/2026" |
| R03_OVER_BUDGET | Total pengeluaran bulan berjalan > saldo kas tersedia | berisiko_tinggi | "Pengeluaran melebihi saldo kas koperasi" |
| R04_SINGLE_APPROVER | Transaksi besar (di atas threshold) hanya disetujui oleh 1 orang, bukan minimal 2 | perlu_perhatian | "Transaksi besar memerlukan minimal 2 persetujuan" |
| R05_LATE_RAT | RAT (Rapat Anggota Tahunan) belum dilaksanakan padahal sudah lewat jadwal tahunan | perlu_perhatian | "RAT terlambat dari jadwal" |
| R06_DUPLICATE_TX | Ada transaksi dengan amount, description, dan transaction_date identik dalam 24 jam | perlu_perhatian | "Kemungkinan transaksi duplikat" |
| R07_ROUND_NUMBER_PATTERN | 3+ transaksi pengeluaran berturut-turut dengan nominal bulat mencurigakan (misal selalu persis Rp5.000.000) tanpa variasi | perlu_perhatian | "Pola nominal transaksi perlu ditinjau" |
| R08_PINJAMAN_LIMIT | Akumulasi pinjaman koperasi melebihi Rp3.000.000.000 (plafon maksimal per koperasi sesuai PMK 15/2026) | berisiko_tinggi | "Total pinjaman melebihi plafon Rp3 Miliar per koperasi" |
| R09_PINJAMAN_OPERASIONAL_LIMIT | Bagian pinjaman berkategori operasional melebihi Rp500.000.000 dari total plafon | berisiko_tinggi | "Alokasi pinjaman untuk belanja operasional melebihi batas Rp500 Juta" |
| R10_PINJAMAN_TENOR | Field tenor_bulan pada transaksi pinjaman melebihi 72 bulan | perlu_perhatian | "Tenor pinjaman melebihi batas maksimal 72 bulan (6 tahun) sesuai PMK 15/2026" |
