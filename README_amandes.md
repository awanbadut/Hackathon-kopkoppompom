# AmanDes (Web) — Pelindung Digital Koperasi Desa Merah Putih

Implementasi web (Next.js + Supabase) dari dokumentasi domain 00–10, disesuaikan
dengan skema data resmi panitia (`metadata_database_hackathon_final.xlsx`).

## Kenapa skemanya beda dari draf `.md` awal?

Draf domain `01`–`09` di awal dirancang sebelum kita tahu skema resmi panitia.
Setelah xlsx panitia dibaca, ada 27 tabel data induk (profil koperasi, anggota,
pengurus, transaksi penjualan, simpanan, modal, aset, gerai, RAT, dst.) dengan
nama kolom yang **harus dipakai apa adanya** (kemungkinan dipakai untuk validasi
submission). Keputusan yang diambil:

1. **`supabase/migrations/0001_reference_schema.sql`** — 27 tabel persis
   mengikuti xlsx (nama tabel/kolom/tipe tidak diubah, kecuali 2 penyesuaian
   yang didokumentasikan di komentar file itu sendiri).
2. **`supabase/migrations/0002_amandes_additive.sql`** — tabel TAMBAHAN murni
   buatan AmanDes yang tidak ada di xlsx panitia: auth demo, transaksi kas
   (`transaksi_keuangan`), risk scanner, approval workflow, notifikasi,
   edukasi/gamifikasi. Semua terhubung ke data induk lewat `koperasi_ref` /
   `anggota_ref` / `pengurus_ref`.
3. Draf `.md` domain 01–09 sekarang jadi **dokumen rancangan bisnis rule**
   (masih valid untuk business rules & UI flow), TAPI referensi field teknisnya
   perlu dibaca berdampingan dengan migration SQL di atas, bukan tabel
   `users`/`koperasi`/`members`/`transactions` generik yang dulu dikarang.

Perbedaan konkret yang paling penting:
- Field `pagu_dana_desa_desa` (dikarang di `02-koperasi-membership.md`) →
  sekarang diambil dari `referensi_profil_desa.anggaran_dana_desa`
  (via `referensi_koperasi_wilayah.kode_wilayah`).
- Tabel `transactions` generik → dipecah jadi `transaksi_keuangan` (kas
  dana desa/operasional/pinjaman, ada risk scan + approval) terpisah dari
  `transaksi_penjualan` + `barang_keluar_produk`/`barang_masuk_produk`
  (data POS retail dari panitia, murni catatan, tidak lewat approval).
- `kategori = dana_desa` di draf awal sekarang dipecah jadi dua kolom:
  `sumber_dana` (`dana_desa` | `non_dana_desa`) dan `kategori`
  (`operasional` | `pembangunan_fisik` | `distribusi_pangan` | ...).

## Stack

- **Next.js 14** (App Router, Server Components + Route Handlers)
- **Supabase** (Postgres). Auth **bukan** Supabase Auth — lihat bagian Auth.
- **Tailwind CSS** dengan token desain kustom (lihat `tailwind.config.ts` —
  tema "buku kas desa", elemen tanda tangan berupa badge stempel `.stempel`).

## Auth (keputusan yang sudah disepakati)

Login pakai **NIK + OTP statis demo** (`123456`), BUKAN Supabase Auth. Karena
itu:
- Session disimpan sebagai JWT di httpOnly cookie (`src/lib/auth.ts`, pakai
  `jose`), bukan `auth.uid()` Supabase.
- Semua akses ke Supabase dari server pakai **service role key**
  (`src/lib/supabase/server.ts`), dan otorisasi role dicek manual di setiap
  route handler (`requireRole(...)`).
- RLS tetap diaktifkan di semua tabel sebagai defense-in-depth (lihat
  `0003_rls_and_triggers.sql`), tapi default-deny untuk `anon`/`authenticated`
  — browser tidak pernah bicara langsung ke Supabase.
- **Sebelum ke produksi sungguhan**: ganti OTP statis dengan provider
  SMS/WhatsApp asli, dan pertimbangkan pindah ke Supabase Auth + RLS berbasis
  `auth.uid()` untuk keamanan berlapis yang lebih standar.

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env.local   # isi SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SESSION_SECRET

# Jalankan migration di Supabase SQL editor / CLI, urutan:
#   0001_reference_schema.sql -> 0002_amandes_additive.sql -> 0003_rls_and_triggers.sql

npm run seed    # isi data demo (1 koperasi contoh + 4 akun login)
npm run dev
```

Login demo setelah `npm run seed` (OTP selalu `123456`):
| Role | No. HP |
|---|---|
| Ketua | 081200000001 |
| Bendahara (pengurus) | 081200000002 |
| Anggota | 081200000003 |
| Pendamping | 081200000099 |

## Yang sudah jalan (end-to-end)

- Login NIK/HP → OTP → session cookie → dashboard sesuai role.
- Alur 3 (`10-alur-penggunaan-end-to-end.md`): input transaksi kas → risk
  scanner (rule R01, R02, R02b, R03, R06, R07, R08, R09, R10) → approval
  berjenjang (1 approval jika `aman`, 2 approval jika tidak, salah satunya
  ketua jika `berisiko_tinggi`) → notifikasi in-app + WhatsApp mock log.
- Dashboard ringkasan per role (pengurus/ketua/anggota), dashboard kepatuhan
  (pendamping: tanpa nominal individual, sesuai prinsip minimal access).
- Modul belajar (baca-saja untuk demo; tombol "mulai/selesai" belum ditaut).

## Yang BELUM dikerjakan (jujur, supaya tidak salah ekspektasi saat submission)

- **R04 & R05** sudah ada fungsinya (`checkApprovalSufficiency`,
  `checkRatSchedule` di `lib/risk-scanner.ts`) tapi belum dipanggil dari cron
  terjadwal — perlu Supabase Scheduled Function atau route yang dipanggil
  saat dashboard dimuat.
- Halaman verifikasi anggota baru (approve/reject pengurus) — baru ada
  skema `app_users.status = pending`, UI-nya belum dibuat.
- Halaman detail transaksi (histori approval + risk log per transaksi).
- Dashboard transparansi anggota masih ringkas (belum ada grafik tren
  bulanan/`recharts`, sudah ada di dependencies tapi belum dipakai).
- Alur pergantian ketua (domain 05 poin 8, approval_level 2 khusus).
- Export PDF laporan (domain 07 poin 6.4).
- Halaman pengaduan anggota (opsional di domain 07).
- Push notification FCM asli (baru in-app + WhatsApp mock).
- Upload bukti transaksi masih berupa input URL manual — belum ada
  integrasi Supabase Storage untuk upload file dari HP.

## Struktur folder

```
supabase/migrations/       # SQL, urutkan sesuai nomor file
src/lib/                   # supabase client, auth, risk-scanner, approval, notifications
src/app/                   # halaman (App Router)
src/components/            # komponen client (form, nav, badge, approval actions)
scripts/seed-demo-data.ts  # data demo (BUKAN parsing xlsx — xlsx cuma metadata)
```

## Catatan kepatuhan AI (wajib untuk submission, lihat `00-project-overview.md` §6)

Sebagian besar boilerplate (migration SQL, route handler, komponen UI) di
repo ini dibantu AI coding assistant berdasarkan dokumentasi domain yang
sudah divalidasi tim. **Wajib ditinjau ulang oleh tim** sebelum submission,
khususnya: nilai-nilai regulasi (PMK 7/2026, PMK 49/2025) di
`lib/risk-scanner.ts`, dan keputusan desain skema di bagian atas README ini.
