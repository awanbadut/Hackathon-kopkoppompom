# Domain: Koperasi & Membership
## 1. Tujuan Domain
Menyimpan data profil koperasi (KDMP) dan mengelola status keanggotaan, termasuk simpanan anggota.
## 2. Actors
Pengurus/Ketua (kelola data koperasi & anggota)
Anggota (lihat status keanggotaan sendiri)
Pendamping (lihat profil koperasi, read-only)
## 3. Data Model
### Table: koperasi
### Table: members
## 4. Business Rules
Nomor anggota di-generate otomatis: format {kode_kecamatan}-{tahun}-{urutan}.
Simpanan pokok dibayar sekali di awal keanggotaan (jumlah ditentukan koperasi masing-masing, konfigurasi per koperasi).
Total simpanan (pokok + wajib + sukarela) dihitung dari akumulasi transaksi di domain 03-transaction-management, bukan field yang diedit manual — field di atas adalah cache/summary yang di-update via trigger/function saat ada transaksi simpanan baru.
Anggota berstatus keluar tidak bisa lagi input/melihat transaksi baru, tapi histori tetap tersimpan (soft delete).
## 5. API / Service Contract
### POST /koperasi (setup awal, sekali per koperasi)
{ "nama_koperasi": "string", "desa": "string", "kecamatan": "string", "kabupaten": "string", "provinsi": "string" }
### GET /koperasi/:id/profile
Response: profil lengkap koperasi + ringkasan jumlah anggota aktif.
### POST /members (tambah anggota, dipanggil setelah user diverifikasi di domain Auth)
{ "user_id": "uuid", "koperasi_id": "uuid" }

→ Auto-generate nomor_anggota.
### GET /members/:koperasi_id
Response: list anggota + status + total simpanan (untuk pengurus).
### GET /members/me
Response: data keanggotaan user yang sedang login (untuk anggota).
## 6. UI Screens
Profil Koperasi (view untuk semua role, edit khusus pengurus/ketua).
Daftar Anggota (khusus pengurus) — list + search + filter status.
Detail Anggota — histori simpanan & transaksi individu.
Kartu Anggota Digital (untuk anggota) — nomor anggota, QR code, total simpanan.
## 7. Validasi & Edge Cases
Satu user tidak bisa jadi anggota di lebih dari satu koperasi (constraint di level users.koperasi_id, lihat domain 01).
Perubahan ketua_id hanya bisa dilakukan lewat proses approval khusus (bukan single-user edit), untuk mencegah pengambilalihan sepihak — referensi ke domain 05-approval-workflow.
## 8. Dependency ke Domain Lain
Bergantung pada users (domain 01).
simpanan_* fields di-update oleh transaksi (domain 03).
Perubahan ketua melalui approval flow (domain 05).


| Field | Type | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | uuid | PK | ID koperasi |
| nama_koperasi | text | not null | Nama resmi KDMP |
| desa | text | not null | Nama desa |
| kecamatan | text | not null | — |
| kabupaten | text | not null | — |
| provinsi | text | not null | — |
| tanggal_berdiri | date | nullable | — |
| status_operasional | enum(persiapan,aktif,nonaktif) | default persiapan | — |
| ketua_id | uuid | FK -> users.id, nullable | Ketua koperasi saat ini |
| pagu_dana_desa_desa | numeric | nullable | Total pagu Dana Desa yang diterima desa tahun berjalan (input manual, sumber SIMKOPDES/data desa) — dipakai untuk hitung batas 58,03% sesuai PMK 7/2026 |
| created_at | timestamptz | default now() | — |


| Field | Type | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | uuid | PK | — |
| user_id | uuid | FK -> users.id, not null | — |
| koperasi_id | uuid | FK -> koperasi.id, not null | — |
| nomor_anggota | text | unique per koperasi | Nomor keanggotaan |
| tanggal_gabung | date | default now() | — |
| status | enum(aktif,nonaktif,keluar) | default aktif | — |
| simpanan_pokok | numeric | default 0 | — |
| simpanan_wajib_total | numeric | default 0 | — |
| simpanan_sukarela_total | numeric | default 0 | — |
