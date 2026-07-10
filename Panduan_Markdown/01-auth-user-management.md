# Domain: Auth & User Management
## 1. Tujuan Domain
Mengelola registrasi, login, dan otorisasi berbasis role untuk seluruh pengguna aplikasi AmanDes (pengurus, ketua, anggota, pendamping).
## 2. Actors
Pengurus koperasi
Ketua koperasi
Anggota masyarakat
Pendamping (Kemenkop/Dinas) — read-only
## 3. Data Model
### Table: users
## 4. Business Rules
Registrasi anggota baru berstatus pending sampai diverifikasi oleh pengurus koperasi terkait.
Satu nomor HP hanya bisa terdaftar di satu akun (unique constraint).
Role pendamping hanya bisa dibuat oleh admin sistem (seeded manual, tidak lewat self-registration).
Login memakai OTP via SMS/WhatsApp mock (untuk demo, boleh pakai OTP statis 123456 dengan flag is_demo_mode).
Setiap user hanya terasosiasi dengan satu koperasi (koperasi_id), tidak multi-tenant per user di MVP ini.
## 5. API / Service Contract (Supabase Edge Functions atau RPC)
### POST /auth/register
Request:

{ "full_name": "string", "phone_number": "string", "ktp_number": "string", "role": "anggota|pengurus", "koperasi_id": "uuid" }

Response: 201 dengan user_id, status pending.
### POST /auth/login
Request: { "phone_number": "string" } → kirim OTP.
### POST /auth/verify-otp
Request: { "phone_number": "string", "otp": "string" } → Response: session token (Supabase Auth JWT).
### PATCH /auth/verify-user/:user_id
Hanya bisa dipanggil oleh role pengurus/ketua. Mengubah status pending → active.
## 6. UI Screens
Splash/Login screen — input nomor HP.
OTP verification screen.
Register screen (untuk anggota baru) — form nama, NIK, pilih koperasi (dropdown/search).
Pending approval screen — ditampilkan ke user berstatus pending.
Verifikasi anggota screen (khusus pengurus) — list user pending + tombol approve/reject.
## 7. Validasi & Edge Cases
Nomor HP tidak valid format Indonesia (+62) → reject di client-side sebelum submit.
OTP expired setelah 5 menit → tampilkan tombol "Kirim Ulang".
User dengan status suspended tidak bisa login, tampilkan pesan kontak pengurus.
Duplicate NIK terdeteksi saat registrasi → tampilkan warning tapi tidak hard block (karena NIK bisa typo, cukup flag ke pengurus).
## 8. Dependency ke Domain Lain
koperasi_id merujuk ke domain 02-koperasi-membership.
Role dipakai sebagai basis authorization di semua domain lain (03, 04, 05, 06, 07).


| Field | Type | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | uuid | PK, default gen_random_uuid() | ID unik user |
| full_name | text | not null | Nama lengkap |
| phone_number | text | unique, not null | Nomor HP (dipakai untuk login OTP) |
| ktp_number | text | unique, nullable | NIK (opsional, untuk verifikasi) |
| role | enum(pengurus,ketua,anggota,pendamping) | not null | Role user |
| koperasi_id | uuid | FK -> koperasi.id, not null | Koperasi tempat user terdaftar |
| status | enum(active,pending,suspended) | default pending | Status akun |
| created_at | timestamptz | default now() | — |
| updated_at | timestamptz | default now() | — |
