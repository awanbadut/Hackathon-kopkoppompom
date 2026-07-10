# AmanDes — Pelindung Digital Koperasi Desa Merah Putih
## 1. Ringkasan Proyek
Nama Produk: AmanDes Tagline: "Aman Kelola, Transparan, & Terlindungi" Kompetisi: Hackathon Kementerian Koperasi RI 2026 — Digital Cooperatives Expo Tema yang dipilih: Tema 3 — "Peningkatan Keterlibatan Masyarakat dalam Berkoperasi"

Problem Statement: Koperasi Desa Merah Putih (KDMP) mengelola porsi signifikan Dana Desa dengan pengurus yang sebagian besar baru dilantik dan belum berpengalaman mengelola dana dalam skala besar. Tanpa sistem pengawasan otomatis, kesalahan administrasi berisiko berujung pada masalah hukum bagi pengurus, sementara minimnya transparansi berisiko menurunkan kepercayaan anggota/masyarakat.

Solusi: AmanDes adalah aplikasi yang berfungsi sebagai lapisan perlindungan & transparansi bagi pengurus dan anggota KDMP — melalui deteksi risiko otomatis (rule-based compliance checker), alur persetujuan transaksi berjenjang, audit trail, dan dashboard transparansi real-time untuk anggota.
## 2. Struktur Dokumentasi
Dokumentasi dipecah per domain agar setiap modul bisa dikerjakan/di-generate secara independen oleh AI coding agent tanpa tercampur konteks:


Cara pakai untuk AI Agent: Proses file 09-database-schema-master.md terlebih dahulu untuk membangun struktur database secara utuh, baru kerjakan domain 01–08 secara berurutan sesuai dependency yang tercantum di masing-masing file.
## 3. Tech Stack Global
Frontend: Flutter (Dart), state management Riverpod
Backend: Supabase (PostgreSQL + Auth + Realtime + Storage + Edge Functions)
Notifikasi: Firebase Cloud Messaging (push) + WhatsApp API mock (untuk demo)
Voice Input: speech_to_text plugin (opsional, untuk input transaksi via suara)
Deployment: Supabase hosting (backend) + APK build (frontend) untuk demo Pitching Day
## 4. Roles Global (dipakai lintas domain)
## 5. Prinsip Desain Sistem (berlaku di semua domain)
Fail-safe by default: transaksi mencurigakan tidak diblokir otomatis, tapi ditandai dan butuh approval ekstra (human-in-the-loop, bukan auto-reject).
Audit trail immutable: setiap perubahan data transaksi/approval dicatat di log terpisah, tidak bisa dihapus, hanya bisa ditambah (append-only).
Transparansi berlapis: anggota melihat ringkasan agregat, pengurus melihat detail penuh, pendamping melihat status kepatuhan saja.
Offline-first di sisi input: pengurus di desa dengan koneksi terbatas tetap bisa input data, sync saat online.
## 6. Catatan Kepatuhan (Wajib Dibaca Sebelum Submit)
Sesuai TOR Hackathon Kemenkop 2026 bagian J. Aturan Penggunaan AI/IP:

Dokumentasi ini adalah alat bantu teknis (boleh dipakai untuk coding assistance dan dokumentasi).
Ide inti, problem framing, dan keputusan desain harus tetap divalidasi/dikembangkan oleh tim, bukan sekadar disalin mentah.
Wajib mencantumkan disclosure penggunaan AI generatif di README repo dan pitch deck (bagian mana yang dibantu AI, tools apa yang dipakai).


| No | File | Domain |
| --- | --- | --- |
| 01 | 01-auth-user-management.md | Autentikasi & Manajemen Pengguna |
| 02 | 02-koperasi-membership.md | Data Koperasi & Keanggotaan |
| 03 | 03-transaction-management.md | Manajemen Transaksi Keuangan |
| 04 | 04-risk-scanner-compliance.md | Risk Scanner & Compliance Checker |
| 05 | 05-approval-workflow.md | Alur Persetujuan Berjenjang |
| 06 | 06-notification-system.md | Notifikasi & Early Warning |
| 07 | 07-transparency-dashboard.md | Dashboard Transparansi |
| 08 | 08-edukasi-gamifikasi.md | Modul Edukasi & Gamifikasi |
| 09 | 09-database-schema-master.md | Master Schema & ERD (referensi silang semua domain) |


| Role | Deskripsi | Akses Utama |
| --- | --- | --- |
| pengurus | Pengurus koperasi (admin operasional) | Input transaksi, lihat risk scanner, approval |
| ketua | Ketua koperasi | Approval final, lihat semua laporan |
| anggota | Anggota masyarakat koperasi | Lihat dashboard transparan, ajukan pengaduan |
| pendamping | Pendamping/viewer dari Kemenkop/Dinas | Read-only akses laporan kepatuhan |
