# Domain: Edukasi & Gamifikasi
## 1. Tujuan Domain
Meningkatkan literasi pengurus dan anggota tentang risiko tata kelola koperasi & Dana Desa melalui modul belajar singkat dan sistem poin reward — mendukung nilai "Inovasi & Kreativitas" dan "Dampak & Manfaat" di kriteria penilaian TOR.
## 2. Actors
Semua role bisa mengakses modul edukasi.
Poin reward utamanya ditujukan untuk pengurus (mendorong kepatuhan) dan anggota (mendorong partisipasi).
## 3. Data Model
### Table: learning_modules
### Table: user_progress
### Table: user_points
## 4. Business Rules
Poin bertambah otomatis saat user_progress.status berubah ke selesai (trigger: tambahkan points_reward dari modul terkait ke user_points.total_points).
Level dihitung dari total poin: 0–50 = "Pemula", 51–150 = "Cakap", 151+ = "Ahli" (threshold bisa disesuaikan tim).
Modul kategori tata_kelola dan keuangan diprioritaskan tampil untuk role pengurus; modul digital_literasi diprioritaskan untuk anggota.
Konten modul (content) adalah materi edukasi statis buatan tim (bukan real-time dari AI), untuk menghindari isu orisinalitas — lihat catatan kepatuhan TOR di 00-project-overview.md.
## 5. API / Service Contract
### GET /learning-modules?category=&role=
List modul relevan untuk role user.
### POST /learning-modules/:id/start
Membuat/update user_progress jadi sedang_berjalan.
### POST /learning-modules/:id/complete
{ "quiz_score": 80 }

Update user_progress jadi selesai, trigger penambahan poin.
### GET /users/me/points
Response: total poin, level, dan progress modul (selesai/total).
## 6. UI Screens
Daftar Modul — list card per kategori, progress bar per modul.
Detail Modul — konten bacaan + kuis singkat di akhir.
Profil Gamifikasi — badge level, total poin, leaderboard internal koperasi (opsional, ranking antar pengurus/anggota di koperasi yang sama).
## 7. Edge Cases
User mengulang modul yang sudah selesai → poin tidak ditambahkan dobel (cek status existing sebelum trigger reward).
Quiz tidak dijawab semua → tidak bisa submit complete, validasi di client & server.
## 8. Dependency ke Domain Lain
Domain ini relatif independen, hanya bergantung pada users (domain 01) untuk role targeting. Tidak ada domain lain yang bergantung pada domain ini — bersifat suplemen/engagement, bukan core financial flow.


| Field | Type | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | uuid | PK | — |
| title | text | not null | Judul modul |
| content | text | not null | Konten (markdown/rich text) |
| category | enum(tata_kelola,keuangan,hukum,digital_literasi) | not null | — |
| points_reward | integer | default 10 | Poin didapat setelah selesai |
| quiz_json | jsonb | nullable | Soal kuis singkat (opsional) |
| created_at | timestamptz | default now() | — |


| Field | Type | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | uuid | PK | — |
| user_id | uuid | FK -> users.id | — |
| module_id | uuid | FK -> learning_modules.id | — |
| status | enum(belum,sedang_berjalan,selesai) | default belum | — |
| quiz_score | integer | nullable | — |
| completed_at | timestamptz | nullable | — |


| Field | Type | Constraint | Deskripsi |
| --- | --- | --- | --- |
| user_id | uuid | PK, FK -> users.id | — |
| total_points | integer | default 0 | — |
| level | text | computed (Pemula/Cakap/Ahli, berdasarkan total_points) | — |
