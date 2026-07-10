# Domain: Approval Workflow
## 1. Tujuan Domain
Mengatur alur persetujuan berjenjang untuk transaksi, memastikan tidak ada transaksi besar/berisiko yang disetujui oleh satu orang saja (segregation of duties).
## 2. Actors
Pengurus (submitter, bisa juga jadi approver level 1 jika bukan yang submit)
Ketua (approver final, wajib untuk transaksi berisiko_tinggi)
## 3. Data Model
### Table: approvals
## 4. Business Rules
Jumlah approval yang dibutuhkan tergantung risk_level transaksi (hasil dari domain 04):
aman: 1 approval (dari pengurus lain, bukan yang input).
perlu_perhatian: 2 approval (2 pengurus berbeda, bukan yang input).
berisiko_tinggi: 2 approval, salah satunya wajib dari role ketua.
Approver tidak boleh sama dengan input_by pada transaksi (self-approval dilarang secara sistem, bukan hanya kebijakan).
Jika salah satu approver menolak (ditolak), status transaksi langsung berubah menjadi ditolak di domain 03 — tidak perlu menunggu approver lain.
Transaksi berubah menjadi disetujui di domain 03 hanya setelah semua approval level yang disyaratkan berstatus disetujui.
Approval request kadaluarsa otomatis setelah 7 hari tanpa keputusan → status transaksi kembali ke draft dan submitter diberi notifikasi untuk submit ulang.
## 5. API / Service Contract
### POST /approvals/request (dipanggil otomatis saat transaksi di-submit, domain 03)
{ "transaction_id": "uuid" }

Sistem otomatis menentukan jumlah & level approval yang dibutuhkan berdasarkan risk_level, lalu membuat baris approvals sejumlah yang diperlukan dengan status menunggu dan mengirim notifikasi ke calon approver yang eligible (role sesuai level, bukan submitter).
### PATCH /approvals/:id/decide
{ "status": "disetujui|ditolak", "catatan": "string|null" }

Hanya bisa dipanggil oleh user yang menjadi approver_id pada baris tersebut.
### GET /approvals/pending?approver_id=
List approval yang menunggu keputusan user tersebut.
## 6. UI Screens
Inbox Approval — list transaksi menunggu approval user, dengan preview risk flag.
Detail Approval — tampilkan transaksi lengkap, bukti, dan hasil risk scanner sebelum user memutuskan.
Konfirmasi Approve/Reject — modal dengan field catatan wajib diisi jika reject.
Status Tracker — progress bar approval (misal "1 dari 2 persetujuan").
## 7. Edge Cases
Koperasi hanya punya 1 pengurus aktif (belum lengkap struktur) → sistem tidak bisa memenuhi syarat 2 approval; tampilkan warning ke ketua untuk menambah pengurus, dan sementara izinkan approval level darurat dengan flag khusus approval_incomplete_structure yang tercatat di audit log.
Approver keluar dari koperasi sebelum memutuskan → request approval dialihkan otomatis ke pengurus aktif lain dengan role setara.
## 8. Dependency ke Domain Lain
Dipicu oleh submit transaksi (domain 03).
Syarat jumlah/level approval ditentukan oleh hasil Risk Scanner (domain 04).
Notifikasi ke approver dikirim lewat domain 06.
Perubahan ketua_id di domain 02 juga menggunakan alur approval ini (approval_level 2, minimal 2 pengurus lain menyetujui).


| Field | Type | Constraint | Deskripsi |
| --- | --- | --- | --- |
| id | uuid | PK | — |
| transaction_id | uuid | FK -> transactions.id, not null | — |
| approver_id | uuid | FK -> users.id, not null | — |
| approval_level | integer | not null | 1 = pengurus lain, 2 = ketua |
| status | enum(menunggu,disetujui,ditolak) | default menunggu | — |
| catatan | text | nullable | Alasan jika ditolak |
| decided_at | timestamptz | nullable | — |
| created_at | timestamptz | default now() | — |
