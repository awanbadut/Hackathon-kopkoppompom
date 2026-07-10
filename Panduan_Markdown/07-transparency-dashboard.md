# Domain: Transparency Dashboard
## 1. Tujuan Domain
Menyajikan data keuangan dan kesehatan koperasi secara agregat dan real-time, dengan tampilan berbeda sesuai role — inilah domain yang mewujudkan tujuan "keterlibatan masyarakat" sesuai Tema 3 TOR.
## 2. Actors
Pengurus/Ketua: dashboard lengkap (detail per transaksi, risk log, health score).
Anggota: dashboard ringkas (saldo kas koperasi, ringkasan pemasukan/pengeluaran, simpanan pribadi, bagi hasil).
Pendamping: dashboard kepatuhan (health score, jumlah flag terbuka, status RAT) — tanpa detail nominal transaksi individu.
## 3. Data Model
Domain ini tidak punya tabel sendiri — murni query/view agregat dari domain lain. Disarankan membuat SQL Views di Supabase:
### View: v_koperasi_summary
Agregat dari transactions (status disetujui saja): total pemasukan, total pengeluaran, saldo kas berjalan, per periode (bulan berjalan, tahun berjalan).
### View: v_member_summary
Agregat dari members + transactions per member_id: total simpanan, histori kontribusi.
### View: v_compliance_summary
Dari koperasi_health_score + risk_logs (domain 04): skor terkini, jumlah flag terbuka per level, status RAT terakhir.
## 4. Business Rules
Anggota tidak bisa melihat detail transaksi milik anggota lain (privacy) — hanya melihat data agregat koperasi dan data pribadinya sendiri.
Data di dashboard anggota hanya menampilkan transaksi berstatus disetujui (transaksi draft/menunggu_approval tidak ditampilkan ke anggota, untuk menghindari kebingungan/informasi belum final).
Pendamping tidak melihat nominal transaksi individual, hanya ringkasan agregat dan status kepatuhan — sesuai prinsip minimal access.
Dashboard pengurus wajib menampilkan alert risk_level berisiko_tinggi yang belum resolved secara paling menonjol (di atas fold).
## 5. API / Service Contract
### GET /dashboard/pengurus?koperasi_id=
Response: saldo kas, grafik pemasukan/pengeluaran per bulan, jumlah transaksi pending approval, health score, top 3 risk flag terbuka.
### GET /dashboard/anggota?koperasi_id=
Response: saldo kas koperasi (agregat), ringkasan simpanan milik user login, jadwal RAT terdekat.
### GET /dashboard/pendamping?koperasi_id=
Response: health score, jumlah flag per level, status RAT, tanggal audit terakhir.
## 6. UI Screens
Dashboard Pengurus — kartu ringkas (saldo, pemasukan, pengeluaran) + grafik tren bulanan + widget health score + list alert.
Dashboard Anggota — kartu saldo koperasi + kartu simpanan pribadi + tombol "Ajukan Pengaduan" (opsional fitur tambahan).
Dashboard Pendamping — tampilan minimalis fokus kepatuhan, cocok untuk laporan ke Kemenkop.
Laporan PDF Export — generate ringkasan periode tertentu dalam format PDF untuk dibagikan/dicetak (bisa pakai library seperti pdf di Flutter).
## 7. Edge Cases
Koperasi baru tanpa transaksi sama sekali → tampilkan empty state yang informatif, bukan grafik kosong membingungkan.
Data periode yang diminta melebihi rentang data yang ada → batasi otomatis ke rentang data tersedia dan beri notice ke user.
## 8. Dependency ke Domain Lain
Domain ini murni bergantung pada data dari domain 02 (koperasi/members), 03 (transactions), dan 04 (risk_logs/health_score). Tidak menulis data baru, hanya membaca (read-only aggregator).
