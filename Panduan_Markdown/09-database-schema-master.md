# Master Database Schema — AmanDes
File ini adalah referensi silang seluruh tabel dari domain 01–08. Gunakan file ini sebagai acuan pertama saat AI agent membangun migration/schema Supabase, agar foreign key antar domain konsisten. Detail bisnis rule tiap tabel tetap merujuk ke file domain masing-masing.
## 1. Entity Relationship Overview
koperasi (02) ─┬─< members (02) >─── users (01)

                │

                ├─< transactions (03) ─┬─< risk_logs (04)

                │                       └─< approvals (05)

                │

                ├─< koperasi_health_score (04)

                │

users (01) ─────┼─< notifications (06)

                 ├─< user_progress (08) >─ learning_modules (08)

                 └─< user_points (08)
## 2. Urutan Pembuatan Migration (Penting untuk Menghindari Error FK)
users (domain 01) — tapi koperasi_id di sini butuh tabel koperasi dulu, jadi:
koperasi (domain 02) — buat dulu tanpa FK ke users.ketua_id, isi nullable.
users (domain 01) — dengan FK ke koperasi.id.
Tambahkan FK koperasi.ketua_id -> users.id via ALTER TABLE setelah users ada (circular dependency, wajib 2 tahap).
members (domain 02).
transactions (domain 03).
risk_logs, koperasi_health_score (domain 04).
approvals (domain 05).
notifications, user_devices, whatsapp_mock_log (domain 06).
learning_modules, user_progress, user_points (domain 08).
Views agregat: v_koperasi_summary, v_member_summary, v_compliance_summary (domain 07) — dibuat paling akhir karena bergantung pada semua tabel di atas.
## 3. Ringkasan Semua Tabel
## 4. Row Level Security (RLS) — Prinsip Umum Supabase
Karena semua akses berbasis role dan koperasi_id, wajib aktifkan RLS di semua tabel dengan pola umum:

-- Contoh pola RLS untuk tabel transactions

CREATE POLICY "user hanya akses koperasi sendiri"

ON transactions FOR SELECT

USING (

  koperasi_id IN (

    SELECT koperasi_id FROM users WHERE id = auth.uid()

  )

);

CREATE POLICY "hanya pengurus/ketua bisa insert transaksi"

ON transactions FOR INSERT

WITH CHECK (

  EXISTS (

    SELECT 1 FROM users

    WHERE id = auth.uid()

    AND role IN ('pengurus','ketua')

    AND koperasi_id = transactions.koperasi_id

  )

);

Terapkan pola serupa (disesuaikan) di setiap tabel sesuai matriks akses per role yang sudah dijelaskan di masing-masing file domain (khususnya poin "Actors" dan "Business Rules").
## 5. Catatan untuk AI Coding Agent (Antigravity)
Bangun schema dari urutan di Bagian 2 sebelum mengerjakan fitur apa pun.
Setiap domain (file 01–08) berisi kontrak API yang bisa langsung dipetakan ke Supabase Edge Function atau RPC — implementasikan satu domain penuh (schema + API + business rules) sebelum lanjut ke domain berikutnya, jangan campur logic antar domain dalam satu file/function agar mudah di-maintain saat debugging bareng tim.
Semua enum sebaiknya didefinisikan sebagai Postgres ENUM TYPE terpisah, bukan text dengan check constraint, untuk konsistensi dan validasi otomatis di level database.


| Tabel | Domain Asal | Fungsi Singkat |
| --- | --- | --- |
| users | 01 | Data pengguna & role |
| koperasi | 02 | Profil KDMP |
| members | 02 | Data keanggotaan + cache simpanan |
| transactions | 03 | Seluruh transaksi keuangan |
| risk_logs | 04 | Hasil deteksi rule-based risk scanner |
| koperasi_health_score | 04 | Skor kepatuhan agregat |
| approvals | 05 | Alur persetujuan berjenjang |
| notifications | 06 | Notifikasi in-app/push |
| user_devices | 06 | Device token FCM (pendukung notifikasi) |
| whatsapp_mock_log | 06 | Simulasi log WA untuk demo |
| learning_modules | 08 | Konten edukasi |
| user_progress | 08 | Progress belajar user |
| user_points | 08 | Poin & level gamifikasi |
