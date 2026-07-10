# Domain: Notification & Early Warning System
## 1. Tujuan Domain
Mengirim notifikasi real-time ke pengguna terkait aktivitas penting (approval, risk flag, jadwal RAT) melalui in-app notification dan push (FCM), dengan opsi WhatsApp mock untuk demo.
## 2. Actors
Semua role bisa menjadi penerima notifikasi.
Sistem sebagai pengirim otomatis (triggered oleh domain lain).
## 3. Data Model
### Table: notifications
## 4. Business Rules & Trigger Map
## 5. API / Service Contract
### POST /notifications/send (internal, dipanggil service lain — bukan dari client)
{ "user_id": "uuid", "type": "risk_alert", "title": "string", "body": "string", "reference_id": "uuid|null" }
### GET /notifications?user_id=&is_read=false
List notifikasi user, urut terbaru dulu.
### PATCH /notifications/:id/read
Menandai satu notifikasi sudah dibaca.
### PATCH /notifications/read-all?user_id=
Menandai semua notifikasi user sudah dibaca.
## 6. UI Screens
Notification Center — list notifikasi dengan icon per type, badge unread count di ikon bell.
Notification Detail/Deep Link — tap notifikasi langsung membuka entitas terkait (misal detail transaksi/approval).
Notification Settings (opsional) — toggle jenis notifikasi mana yang ingin diterima.
## 7. Implementasi Teknis (Catatan untuk AI Agent)
Gunakan Supabase Realtime (subscribe ke tabel notifications filter user_id = current_user) untuk update in-app secara live tanpa polling.
FCM push: trigger dari Supabase Edge Function setelah insert ke notifications, kirim ke device token yang tersimpan di tabel tambahan user_devices (user_id, fcm_token).
WhatsApp mock (untuk demo Pitching Day): cukup log ke console/tabel whatsapp_mock_log yang menampilkan simulasi pesan terkirim, tidak perlu integrasi WA Business API asli di MVP.
## 8. Edge Cases
User belum punya device token terdaftar (belum pernah buka app di device tsb) → notifikasi tetap tersimpan in_app, push di-skip.
Duplicate notification untuk event yang sama (misal race condition retry) → dedup berdasarkan reference_id + type + user_id dalam window 1 menit.
## 9. Dependency ke Domain Lain
Domain ini bersifat "consumer" — menerima trigger dari domain 01, 02, 03, 04, dan 05. Tidak ada domain lain yang bergantung pada domain ini secara struktural (kecuali dashboard di domain 07 yang bisa menampilkan ringkasan notifikasi terbaru).


| Field | Type | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | uuid | PK | — |
| user_id | uuid | FK -> users.id, not null | Penerima |
| type | enum(approval_request,risk_alert,transaction_status,rat_reminder,system_info) | not null | — |
| title | text | not null | — |
| body | text | not null | — |
| reference_id | uuid | nullable | ID entitas terkait (transaction_id/approval_id, dll) |
| is_read | boolean | default false | — |
| sent_via | enum(in_app,push,whatsapp_mock) | default in_app | — |
| created_at | timestamptz | default now() | — |


| Event Pemicu | Domain Asal | Penerima | Type Notifikasi |
| --- | --- | --- | --- |
| Transaksi disubmit untuk approval | 03/05 | Approver yang eligible | approval_request |
| Approval disetujui/ditolak | 05 | Submitter (input_by) | transaction_status |
| Risk Scanner menandai berisiko_tinggi | 04 | Ketua + pengurus input | risk_alert |
| H-7 sebelum jadwal RAT tahunan | 02 (jadwal disimpan di profil koperasi) | Semua pengurus & ketua | rat_reminder |
| Anggota baru terdaftar (pending) | 01 | Pengurus/Ketua | system_info |
