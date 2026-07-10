# Alur Penggunaan End-to-End — AmanDes
Dokumen ini menyatukan seluruh domain (01–08) menjadi alur pemakaian nyata per skenario. Gunakan sebagai peta jalan implementasi UI/flow di Flutter — setiap langkah mereferensikan domain & tabel terkait agar AI agent tahu API/tabel mana yang harus dipanggil di tiap step.
## Daftar Alur
Onboarding Koperasi Baru
Registrasi & Verifikasi Pengguna
Input Transaksi → Risk Scan → Approval → Selesai
Penanganan Risk Flag oleh Pengurus/Ketua
Pergantian Ketua Koperasi
Anggota Mengakses Dashboard Transparansi
Edukasi & Gamifikasi
Pendamping Memantau Kepatuhan
Notifikasi Lintas Alur (ringkasan silang)


## 1. Alur Onboarding Koperasi Baru
Aktor: Admin sistem (bisa jadi Kemenkop/tim penyelenggara) atau calon Ketua koperasi Domain terkait: 02 (Koperasi), 01 (Auth)


Edge case: Koperasi dengan hanya 1 pengurus aktif tetap bisa aktif, tapi sistem akan terus menampilkan warning "struktur pengurus belum lengkap, approval 2-lapis belum bisa berjalan optimal" (lihat domain 05, edge case approval_incomplete_structure).

flowchart TD

    A[Buka App Pertama Kali] --> B[Isi Form Profil Koperasi]

    B --> C[POST /koperasi - status: persiapan]

    C --> D[Registrasi User sebagai Ketua]

    D --> E{Pengurus lain sudah gabung?}

    E -->|Belum| F[Status tetap persiapan, tampilkan warning]

    E -->|Sudah minimal 1| G[Ketua ubah status jadi aktif]


## 2. Alur Registrasi & Verifikasi Pengguna
Aktor: Calon Anggota/Pengurus, Pengurus/Ketua (verifikator) Domain terkait: 01 (Auth), 02 (Membership), 06 (Notifikasi)


Edge case: Reject → user dapat notifikasi alasan penolakan, bisa daftar ulang dengan data yang dikoreksi.


## 3. Alur Input Transaksi → Risk Scan → Approval → Selesai
Aktor: Pengurus (input), Pengurus lain/Ketua (approver) Domain terkait: 03 (Transaksi), 04 (Risk Scanner), 05 (Approval), 06 (Notifikasi)


flowchart TD

    A[Input Transaksi - Draft] --> B[Submit untuk Approval]

    B --> C[Risk Scanner Evaluasi Rule R01-R10]

    C --> D{Risk Level?}

    D -->|Aman| E[Butuh 1 Approval]

    D -->|Perlu Perhatian| F[Butuh 2 Approval]

    D -->|Berisiko Tinggi| G[Butuh 2 Approval, salah satu Ketua]

    E --> H{Semua Setuju?}

    F --> H

    G --> H

    H -->|Ya| I[Status: Disetujui]

    H -->|Ada yang Tolak| J[Status: Ditolak]

    I --> K[Tampil di Dashboard Transparansi]


## 4. Alur Penanganan Risk Flag oleh Pengurus/Ketua
Aktor: Pengurus, Ketua Domain terkait: 04 (Risk Scanner), 06 (Notifikasi)


Catatan penting: Sistem tidak pernah otomatis memblokir transaksi — flag hanya menambah syarat approval (human-in-the-loop). Ini prinsip fail-safe yang disebut di 00-project-overview.md.


## 5. Alur Pergantian Ketua Koperasi
Aktor: Pengurus (pengaju), Pengurus lain (approver) Domain terkait: 02 (Koperasi), 05 (Approval)



## 6. Alur Anggota Mengakses Dashboard Transparansi
Aktor: Anggota Domain terkait: 07 (Dashboard), 02 (Membership)


Batasan penting: Anggota tidak melihat transaksi individu milik anggota lain, dan hanya melihat transaksi berstatus disetujui (lihat domain 07, business rule 1–2).


## 7. Alur Edukasi & Gamifikasi
Aktor: Semua role, terutama Pengurus & Anggota Domain terkait: 08



## 8. Alur Pendamping Memantau Kepatuhan
Aktor: Pendamping (Kemenkop/Dinas) Domain terkait: 07 (Dashboard), 04 (Risk Scanner)



## 9. Notifikasi Lintas Alur (Ringkasan Silang)
Tabel ini merangkum semua notifikasi yang muncul di alur 1–8 di atas, sebagai checklist implementasi domain 06:



## 10. Peta Alur ke Dokumen Domain

Untuk AI Agent: implementasikan alur sesuai urutan di atas (1 → 8), karena tiap alur bergantung pada domain yang sudah dibangun di alur sebelumnya (misal Alur 3 butuh Alur 1 & 2 selesai lebih dulu).


| Step | Aksi | Sistem |
| --- | --- | --- |
| 1 | Ketua/calon pengurus buka app pertama kali, pilih "Daftarkan Koperasi Baru" | Tampilkan form profil koperasi |
| 2 | Isi nama koperasi, desa, kecamatan, kabupaten, provinsi, pagu_dana_desa_desa (jika sudah tahu) | POST /koperasi (domain 02) → status persiapan |
| 3 | Sistem generate koperasi_id, tampilkan ke user | — |
| 4 | User yang mendaftarkan otomatis diarahkan ke Alur 2 (Registrasi) dengan role ketua, terhubung ke koperasi_id tsb | — |
| 5 | Setelah minimal 1 pengurus lain terdaftar & aktif, koperasi bisa diubah status ke aktif oleh ketua | PATCH /koperasi/:id |


| Step | Aksi | Sistem |
| --- | --- | --- |
| 1 | User buka app, pilih "Daftar", input nomor HP | POST /auth/register → status pending |
| 2 | Isi nama, NIK, pilih koperasi (search/dropdown) | Tersimpan di users, koperasi_id terisi |
| 3 | Verifikasi OTP via SMS/WA | POST /auth/verify-otp → dapat session token |
| 4 | User masuk ke "Pending Approval Screen", tidak bisa akses fitur lain | — |
| 5 | Pengurus/Ketua koperasi dapat notifikasi user baru pending | Notifikasi type system_info (domain 06) |
| 6 | Pengurus buka "Verifikasi Anggota", cek data, tekan Approve/Reject | PATCH /auth/verify-user/:id |
| 7 | Jika approve → status active, sistem otomatis POST /members untuk generate nomor anggota | Domain 02 |
| 8 | User dapat notifikasi akun aktif, bisa langsung login penuh | Notifikasi type system_info |


| Step | Aksi | Sistem |
| --- | --- | --- |
| 1 | Pengurus buka "Tambah Transaksi", pilih tipe & kategori, isi nominal, deskripsi, tanggal | Form di client, validasi dasar |
| 2 | Jika kategori dana_desa → wajib pilih sub-kategori (pembangunan_fisik/operasional/dll) | — |
| 3 | Jika tipe pinjaman → wajib isi tenor_bulan, bunga_persen (default 6%) | — |
| 4 | Upload bukti (foto/dokumen) — wajib jika nominal > Rp5.000.000 | Upload ke Supabase Storage → evidence_url |
| 5 | Simpan sebagai draft | POST /transactions → status draft |
| 6 | Pengurus tekan "Submit untuk Approval" | POST /transactions/:id/submit |
| 7 | Risk Scanner otomatis jalan (domain 04) — evaluasi semua rule R01–R10 | risk_level terisi (aman/perlu_perhatian/berisiko_tinggi) |
| 8 | Sistem tentukan jumlah & level approval dibutuhkan berdasarkan risk_level | Domain 05: 1 approval (aman) / 2 approval (perlu_perhatian) / 2 approval termasuk ketua (berisiko_tinggi) |
| 9 | Approver yang eligible dapat notifikasi | Domain 06, type approval_request |
| 10 | Approver buka detail transaksi, lihat bukti + hasil risk scan, putuskan Setuju/Tolak | PATCH /approvals/:id/decide |
| 11a | Semua approval "Setuju" → status transaksi jadi disetujui, submitter dapat notifikasi, data masuk dashboard | Domain 03 status update |
| 11b | Ada approval "Tolak" → status transaksi langsung ditolak, submitter dapat notifikasi + alasan | — |
| 12 | Transaksi disetujui bersifat immutable; koreksi lewat transaksi pembalik baru (ulangi dari Step 1) | — |


| Step | Aksi | Sistem |
| --- | --- | --- |
| 1 | Risk Scanner menandai transaksi (saat Alur 3 Step 7) | risk_logs terisi 1+ baris |
| 2 | Jika risk_level = berisiko_tinggi → notifikasi prioritas tinggi ke Ketua + pengurus input | Domain 06, type risk_alert |
| 3 | Ketua/Pengurus buka "Risk Alert Banner" di dashboard, atau langsung dari notifikasi (deep link) | — |
| 4 | Lihat detail rule yang terpicu (misal R08_PINJAMAN_LIMIT) beserta penjelasan | GET /risk-logs?koperasi_id=&resolved=false |
| 5 | Ambil tindakan: (a) tolak transaksi di alur approval, atau (b) lengkapi data yang kurang lalu submit ulang, atau (c) tandai "sudah ditindaklanjuti" dengan catatan jika memang valid | PATCH /risk-logs/:id/resolve |
| 6 | koperasi_health_score dihitung ulang otomatis (harian) berdasarkan jumlah flag unresolved | Domain 04 |


| Step | Aksi | Sistem |
| --- | --- | --- |
| 1 | Pengurus ajukan perubahan ketua_id dari menu Profil Koperasi | Request khusus, bukan direct edit |
| 2 | Sistem buat approval request dengan approval_level = 2, minimal 2 pengurus lain harus setuju | Domain 05 |
| 3 | Approver menerima notifikasi, review pengajuan | Domain 06 |
| 4 | Setelah semua approval disetujui → koperasi.ketua_id terupdate | Domain 02 |
| 5 | Semua anggota koperasi dapat notifikasi info perubahan ketua | Domain 06, type system_info |


| Step | Aksi | Sistem |
| --- | --- | --- |
| 1 | Anggota login, masuk ke Home/Dashboard Anggota | GET /dashboard/anggota?koperasi_id= |
| 2 | Lihat saldo kas koperasi (agregat), grafik pemasukan/pengeluaran bulan berjalan | View v_koperasi_summary |
| 3 | Lihat kartu simpanan pribadi (pokok, wajib, sukarela) | GET /members/me |
| 4 | Lihat jadwal RAT terdekat | Dari profil koperasi |
| 5 | (Opsional) Ajukan pengaduan jika ada kejanggalan | Fitur tambahan, bisa masuk sebagai notifikasi ke pengurus |


| Step | Aksi | Sistem |
| --- | --- | --- |
| 1 | User buka menu "Belajar", lihat daftar modul relevan sesuai role | GET /learning-modules?category=&role= |
| 2 | Pilih modul, tekan "Mulai" | POST /learning-modules/:id/start → status sedang_berjalan |
| 3 | Baca konten, jawab kuis singkat di akhir | — |
| 4 | Submit kuis | POST /learning-modules/:id/complete → status selesai, poin bertambah |
| 5 | Cek profil gamifikasi (poin, level, leaderboard internal koperasi) | GET /users/me/points |


| Step | Aksi | Sistem |
| --- | --- | --- |
| 1 | Pendamping login (akun di-seed manual oleh admin sistem) | Domain 01 |
| 2 | Pilih koperasi yang ingin dipantau (bisa multi-koperasi dalam wilayah binaan) | — |
| 3 | Lihat dashboard kepatuhan: health score, jumlah flag per level, status RAT terakhir | GET /dashboard/pendamping?koperasi_id= |
| 4 | Tidak bisa lihat nominal transaksi individual (read-only, minimal access) | Sesuai domain 07, business rule 3 |
| 5 | Export laporan kepatuhan periode tertentu (PDF) jika dibutuhkan untuk pelaporan ke Kemenkop | Domain 07 |


| Notifikasi | Dipicu di Alur | Penerima |
| --- | --- | --- |
| User baru pending verifikasi | Alur 2, step 5 | Pengurus/Ketua |
| Akun disetujui/ditolak | Alur 2, step 8 | User bersangkutan |
| Permintaan approval transaksi | Alur 3, step 9 | Approver eligible |
| Transaksi disetujui/ditolak | Alur 3, step 11a/11b | Submitter |
| Risk alert berisiko tinggi | Alur 4, step 2 | Ketua + pengurus input |
| Permintaan approval ganti ketua | Alur 5, step 3 | Approver eligible |
| Info perubahan ketua | Alur 5, step 5 | Semua anggota |
| Reminder RAT (H-7) | Trigger terjadwal, bukan bagian alur di atas | Semua pengurus & ketua |


| Alur | Domain yang Diproses |
| --- | --- |
| 1. Onboarding Koperasi | 02, 01 |
| 2. Registrasi & Verifikasi | 01, 02, 06 |
| 3. Transaksi → Approval | 03, 04, 05, 06 |
| 4. Penanganan Risk Flag | 04, 06 |
| 5. Ganti Ketua | 02, 05, 06 |
| 6. Dashboard Anggota | 07, 02 |
| 7. Edukasi & Gamifikasi | 08 |
| 8. Monitoring Pendamping | 07, 04 |
