# AmanDes UI Design Blueprint

Dokumen ini adalah panduan desain menyeluruh untuk merombak frontend AmanDes menjadi lebih modern, minimalis, rapi, dan lebih kuat secara visual daripada tampilan KopDes web yang ada saat ini. Blueprint ini disusun berdasarkan struktur dan perilaku sistem di repository `Hackathon-kopkoppompom`, termasuk halaman login, dashboard, role pengguna, alur data, dan kebutuhan modul yang sudah terhubung ke backend.[cite:1][cite:3][cite:4][cite:8][cite:9]

## Tujuan desain

Frontend AmanDes harus terlihat seperti produk digital yang matang: bersih, terpercaya, cepat dipahami, dan cocok untuk sistem koperasi desa berbasis pengawasan keuangan, kepatuhan, aspirasi, edukasi, dan persetujuan transaksi.[cite:8][cite:9] Tampilan baru tidak boleh ramai, tidak boleh terasa seperti template admin generik, dan harus menjaga identitas warna yang sudah kamu pilih: orange-gold hangat, kuning emas lembut, olive, emerald, dan deep green.[cite:1]

## Prinsip visual utama

- Modern minimalist: sedikit warna aktif, banyak ruang lega, hierarki jelas.
- Surface terang: gunakan cream dan white sebagai area baca utama.
- Emerald sebagai primary brand: dipakai untuk navigasi utama, tombol primer, state aktif, dan heading penting.
- Gold sebagai accent: dipakai untuk CTA sekunder, badge penghargaan, highlight KPI, dan aksen legal/compliance.
- Olive sebagai warna jembatan: dipakai untuk panel informasi, chart tone, dan background netral yang tidak dingin.
- Deep green untuk trust layer: sidebar, hero block, dan elemen yang butuh rasa aman dan institusional.

## Color palette final

Palette ini diambil dari palet yang kamu kirim dan diadaptasi menjadi semantic system untuk UI modern.[cite:1]

| Token | Hex | Fungsi UI |
|---|---|---|
| `--brand-gold-strong` | `#F9A620` | Accent CTA, hover highlight, icon penting |
| `--brand-gold-soft` | `#FFD449` | Badge lembut, chip aktif, panel sorotan |
| `--brand-olive` | `#AAB03C` | Chart, tab sekunder, info box |
| `--brand-emerald` | `#548C2F` | Tombol primer, status sukses, heading utama |
| `--brand-deep-green` | `#104911` | Sidebar, hero, background identitas |
| `--surface-cream` | `#FBF8F1` | Background utama halaman |
| `--surface-white` | `#FFFFFF` | Card utama |
| `--surface-soft` | `#F2EEE3` | Section offset |
| `--text-primary` | `#1E1E1E` | Teks utama |
| `--text-secondary` | `#5B6470` | Teks deskripsi |
| `--border-soft` | `rgba(16,73,17,0.10)` | Border lembut |

## Typography

Gunakan tipografi yang lebih modern dan profesional agar produk terasa premium namun tetap ramah. Halaman sistem sebaiknya memakai pasangan font seperti berikut:

- Display / heading: `Plus Jakarta Sans` atau `Manrope`
- Body / UI: `Inter`
- Numeric / OTP / nominal uang: `JetBrains Mono`

Aturan tipografinya:

- Heading halaman: 28–36px, bold.
- Heading section: 20–24px, semibold.
- Body utama: 16px.
- Label tombol dan nav: 14px–15px.
- Badge / meta kecil: minimum 12px.
- Angka uang dan OTP: mono, semibold.

## Mood board sistem

AmanDes secara visual harus terasa seperti gabungan antara dashboard institusional, aplikasi finansial, dan portal layanan publik yang modern. Landing page boleh punya hero yang kuat, tetapi dashboard harus jauh lebih bersih dan fungsional agar data cepat dibaca.[cite:8][cite:9]

## Sistem layout global

### Desktop

- Sidebar kiri tetap, gelap emerald/deep green.
- Topbar atas terang, sticky, berisi judul halaman, pencarian, notifikasi, profil role.
- Area konten utama menggunakan background cream terang.
- Grid konten memakai 12 kolom dengan jarak 24px–32px.

### Mobile

- Sidebar berubah menjadi drawer atau bottom navigation.
- Konten stack satu kolom.
- KPI card berubah menjadi slider horizontal atau grid 2 kolom.
- Tabel panjang diubah menjadi card list ringkas.

## Role dan pengalaman per role

Repo saat ini mendefinisikan empat akun demo dan empat role utama: ketua koperasi, pengurus/bendahara, anggota koperasi, dan pendamping Kemenkop/auditor.[cite:8] Desain dashboard tidak boleh identik untuk semua role; shell boleh sama, tetapi isi, prioritas, dan CTA harus berbeda.[cite:9]

### 1. Ketua Koperasi

Fokus UI:
- Ringkasan kesehatan koperasi.
- Persetujuan penting.
- Risiko kepatuhan.
- Ringkasan RAT, aspirasi, dan laporan keuangan.

Elemen utama di overview:
- KPI saldo kas.
- KPI pemasukan vs pengeluaran.
- KPI approval pending.
- KPI compliance score.
- Risk alert panel.
- Ringkasan suara e-RAT.
- Aktivitas terbaru.

Nuansa visual:
- Lebih formal, lebih banyak deep green + gold accent.
- Komponen approval dan compliance harus paling menonjol.

### 2. Pengurus / Bendahara

Fokus UI:
- Input transaksi.
- Status approval.
- Kas harian.
- Bukti transaksi.
- Monitoring anggota pending.

Elemen utama:
- Quick action tambah transaksi.
- Tabel transaksi terbaru.
- Status approval board.
- Form upload bukti.
- KPI kas masuk/keluar.

Nuansa visual:
- Lebih operasional dan cepat dipakai.
- Banyak komponen form, tabel, dan status chip.

### 3. Anggota Koperasi

Fokus UI:
- Simpanan/pinjaman milik anggota.
- Notifikasi pribadi.
- E-learning / modul belajar.
- Aspirasi komunitas.
- e-RAT voting.
- Reward points dan voucher.

Elemen utama:
- Welcome card personal.
- Progress belajar.
- Daftar voting aktif.
- Riwayat transaksi anggota.
- Forum aspirasi dengan upvote.
- Reward center.

Nuansa visual:
- Lebih ramah, ringan, dan engaging.
- Banyak card modular dengan ilustrasi sederhana atau icon-led layout.

### 4. Pendamping Kemenkop / Auditor

Fokus UI:
- Compliance dan audit lintas koperasi.
- Risk logs.
- Temuan transaksi berisiko.
- Ringkasan legal dan monitoring menyeluruh.

Elemen utama:
- Compliance score besar.
- Tabel risk logs unresolved.
- Feed transaksi berisiko.
- Panel audit notes.
- Ringkasan koperasi dan warning area.

Nuansa visual:
- Lebih analitik, lebih tajam, lebih sedikit dekorasi.
- Olive dan deep green bisa dominan, gold dipakai hemat.

## Pemetaan halaman berdasarkan repo

Berdasarkan struktur repository, halaman dan shell yang sudah jelas saat ini adalah login page, dashboard page, pending approval page, dan satu komponen dashboard client yang sangat besar sebagai pusat render mayoritas fitur.[cite:4][cite:6][cite:8][cite:9] Karena `DashboardClient.tsx` menjadi komponen besar yang memuat banyak domain UI, blueprint desain harus memecah dashboard menjadi beberapa page-state dan section-state yang lebih modular meski routing saat ini masih tab-driven.[cite:6][cite:9]

## Halaman 1 — Login / Landing (`src/app/page.tsx`)

Halaman login saat ini sudah memakai layout split dua kolom, branding hijau-emas, akun demo, request OTP, dan widget validasi NIK.[cite:8] Ini fondasinya sudah menarik, tapi masih perlu disempurnakan agar terlihat lebih premium, rapi, dan modern.[cite:8]

### Tujuan visual

- Menciptakan first impression institusional tetapi modern.
- Menjelaskan AmanDes dalam 3 detik.
- Memudahkan login role demo tanpa membingungkan pengguna.

### Layout baru yang disarankan

#### Kolom kiri — Brand story panel

Isi elemen:
- Logo AmanDes versi SVG sederhana.
- Judul hero: “Aman Kelola, Transparan, dan Patuh.”
- Subteks singkat tentang koperasi desa digital.
- Legal strip: UU Koperasi, UU Desa, PMK terkait.[cite:8]
- Mini highlight 3 poin: audit realtime, approval berjenjang, literasi anggota.
- NIK tool diposisikan sebagai utility card, bukan hero utama.

Desain:
- Background deep green dengan overlay gradient lembut ke emerald.[cite:8]
- Accent gold hanya pada badge, underline, icon kecil.
- Hindari orb dekoratif berlebihan; ganti dengan pattern garis halus atau grid lembut.

#### Kolom kanan — Auth panel

Isi elemen:
- Heading login.
- Input nomor HP.
- Input OTP 6 digit lebih modern (slot/pin style).
- Tombol request OTP gold.
- Tombol masuk emerald.
- Error/success alert minimalis.
- Demo role cards 4 buah dengan label role.[cite:8]

Desain:
- Card auth putih besar dengan shadow lembut.
- Setiap input punya icon tipis, focus ring emerald, placeholder abu hangat.
- Demo card bukan list plain; buat jadi selectable mini role card.

### UI state yang wajib ada

- Default state.
- Request OTP loading.
- OTP success toast / panel.[cite:8]
- Invalid OTP.
- Invalid phone.
- Disabled submit.
- Mobile stacked state.

## Halaman 2 — Pending Approval

Repository memiliki route `pending-approval` yang menandakan ada flow setelah login untuk akun yang belum disetujui.[cite:4] Halaman ini harus terlihat ramah, jelas, dan tidak terasa seperti error page.[cite:4]

Isi elemen:
- Icon status besar.
- Judul: “Akun Anda sedang menunggu verifikasi.”
- Penjelasan singkat alur verifikasi.
- Info role / koperasi yang diajukan.
- Checklist proses yang sudah dan belum selesai.
- Tombol kembali / logout.
- Kontak pengurus koperasi atau bantuan.

Desain:
- Background cream.
- Card utama putih dengan ilustrasi status.
- Badge warning olive/gold, bukan merah.

## Halaman 3 — Dashboard Overview

Dashboard page saat ini melakukan loading data yang sangat banyak: profil koperasi, summary kas, compliance, user points, transaksi, approvals, pending members, risk logs, modules, progress, notifications, RAT, aspirations, vouchers, eco summary, dan financial summary sebelum dikirim ke `DashboardClient`.[cite:9] Karena itu overview harus menjadi “halaman pengarah”, bukan tempat semua hal dilempar sekaligus.[cite:9]

### Struktur overview universal

Urutan section yang ideal:
1. Header page + greeting role-aware.
2. KPI strip utama.
3. Quick actions sesuai role.
4. Insight / alerts penting.
5. Aktivitas terbaru.
6. Section sekunder berdasarkan role.

### Elemen universal overview

- Page title.
- Subtitle ringkas koperasi / role.
- Search atau command bar ringan.
- 4 KPI utama.
- Alert banner jika ada risk / pending approval / voting aktif.
- Recent activity feed.
- Notification preview.[cite:9]

### KPI card style

Setiap KPI card berisi:
- Icon kecil kiri atas.
- Judul pendek.
- Angka utama besar.
- Delta kecil di bawah.
- Sparkline mini jika perlu.

Gaya visual:
- Background putih atau cream very light.
- Border sangat halus.
- Shadow tipis.
- Top accent bar emerald atau gold.
- Nominal uang pakai mono font.

## Halaman 4 — Transaksi Keuangan

Data transaksi di-load dari tabel `transaksi_keuangan`, lengkap dengan penginput dan bukti transaksi.[cite:9] Maka halaman transaksi perlu fokus pada kejelasan tabel, filter, form action, dan approval state.[cite:9]

Isi elemen:
- Heading halaman.
- Quick filter: jenis transaksi, status, kategori, tanggal.
- Search input.
- CTA tambah transaksi.
- Tabel transaksi.
- Drawer / modal detail transaksi.
- Evidence preview.
- Approval timeline.

Desain:
- Tabel desktop, card-list mobile.
- Status badge berwarna lembut.
- Amount hijau / merah / netral sesuai type.
- Evidence tampil dalam modal sheet yang bersih.

## Halaman 5 — Approval Center

Approval untuk role pengurus dan ketua diambil dari join data approvals + transaksi.[cite:9] Halaman ini harus terasa seperti command center yang fokus dan cepat.[cite:9]

Isi elemen:
- Summary approval pending, approved, rejected.
- List approval cards atau table hybrid.
- Detail transaksi.
- Bukti lampiran.
- Approve / reject / beri catatan.
- Riwayat keputusan.

Desain:
- Kartu approval dengan severity indicator kecil.
- Risk level menggunakan chip, bukan panel merah besar.
- Sticky action bar saat detail dibuka.

## Halaman 6 — Profil Koperasi dan Summary Keuangan

Repo memuat `profil_koperasi`, `v_koperasi_summary`, dan `financialSummary` yang dihitung dari berbagai jenis transaksi.[cite:9] Halaman ini cocok dibuat seperti “financial cockpit”.[cite:9]

Isi elemen:
- Profil koperasi singkat.
- Saldo kas.
- Piutang anggota.
- Simpanan pokok, wajib, sukarela.
- Pemasukan dan pengeluaran.
- Ringkasan neraca / SHU style block.
- Chart tren kas.

Desain:
- Banyak angka besar, visual clean.
- Gunakan olive dan emerald untuk chart series utama.
- Gold untuk highlight pencapaian atau CTA ekspor.

## Halaman 7 — Compliance & Risk

Compliance summary dan risk logs unresolved termasuk core value sistem AmanDes.[cite:9] Halaman ini harus terlihat serius, mudah dipindai, dan kuat secara hierarki.[cite:9]

Isi elemen:
- Compliance score utama.
- Ringkasan indikator patuh / perlu perhatian / kritis.
- Daftar risk logs unresolved.
- Filter severity.
- Tautan transaksi terkait.
- Catatan rekomendasi tindak lanjut.

Desain:
- Score card besar di atas.
- Risk list dengan icon, severity chip, tanggal, amount, description.
- Jangan gunakan full red background; cukup neutral surface + warning accent.

## Halaman 8 — Verifikasi Anggota Pending

Pending members diambil dari `app_users` dengan status `pending` untuk role manager.[cite:9] Halaman ini harus ringkas dan action-oriented.[cite:9]

Isi elemen:
- Jumlah anggota pending.
- Card/list anggota baru.
- Detail NIK, nomor HP, role, tanggal daftar.
- Approve / reject.
- Catatan verifikasi.

Desain:
- Layout list-card sederhana.
- Identitas anggota tampil rapi, tidak terlalu padat.

## Halaman 9 — Notifikasi

Notifikasi diambil per user dan ditampilkan berdasarkan created date.[cite:9] Halaman notifikasi harus dibagi menjadi read/unread dan kategori.[cite:9]

Isi elemen:
- Filter all / unread / finance / approval / learning / voting.
- Notification list.
- Ikon kategori.
- Timestamp humanized.
- CTA buka detail terkait.

Desain:
- Tampilan list modern seperti inbox, bukan alert box bertumpuk.

## Halaman 10 — E-learning / Modul Belajar

`learning_modules` dan `user_progress` menunjukkan adanya modul edukasi untuk pengguna.[cite:9] Ini harus terasa lebih ringan dan engaging dibanding halaman finansial.[cite:9]

Isi elemen:
- Hero mini pembelajaran.
- Progress summary.
- Grid modul.
- Status selesai / belum.
- CTA lanjutkan belajar.
- Progress bar.

Desain:
- Card modular.
- Gunakan kombinasi cream, olive, gold soft.
- Jangan terlalu gelap.

## Halaman 11 — e-RAT Voting

Data voting agenda dan votes user sudah tersedia.[cite:9] Halaman ini harus menjelaskan status voting, pilihan, dan hasil agregat secara transparan.[cite:9]

Isi elemen:
- Agenda voting aktif.
- Deskripsi agenda.
- Opsi voting card.
- Status sudah vote / belum.
- Countdown jika ada.
- Hasil suara agregat setelah vote atau jika diizinkan.[cite:9]

Desain:
- Voting option dibuat seperti selectable cards.
- Result chart pakai olive, emerald, gold.

## Halaman 12 — Forum Aspirasi Komunitas

Aspirasi dan upvotes user adalah fitur sosial dalam sistem.[cite:9] Halaman ini harus seperti forum ringan dengan gaya modern dan bersih.[cite:9]

Isi elemen:
- Input buat aspirasi.
- Sorting populer / terbaru.
- Card aspirasi.
- Informasi user dan role.
- Upvote button.
- Status ditindaklanjuti / belum.

Desain:
- Card list seperti community board.
- Jangan seperti komentar media sosial yang ramai.
- Tekankan readability.

## Halaman 13 — Reward & Voucher

Data voucher dan voucher user sudah tersedia.[cite:9] Halaman ini cocok menjadi space yang lebih hidup namun tetap rapi.[cite:9]

Isi elemen:
- Total points user.
- Voucher grid.
- Harga points.
- Detail voucher.
- Riwayat redeemed voucher.

Desain:
- Gunakan gold dan olive lebih terasa di sini.
- Voucher card bisa punya aksen premium.

## Halaman 14 — Profil User / Session Menu

Walaupun belum terlihat penuh dari struktur, session user jelas dipakai untuk role, koperasi_ref, dan identitas login.[cite:9] Maka perlu area profil user yang ringkas:

Isi elemen:
- Nama.
- Role.
- Nomor HP.
- Status akun.
- Koperasi.
- Logout.

## Komponen dasar yang harus dibangun ulang

Supaya dashboard tidak lagi bergantung pada satu komponen raksasa, desain harus mengasumsikan adanya library komponen UI inti berikut:

- AppShell
- Sidebar
- Topbar
- PageHeader
- StatCard
- DataCard
- SectionCard
- EmptyState
- LoadingSkeleton
- AlertBanner
- StatusBadge
- RoleBadge
- FilterBar
- SearchField
- DataTable
- MobileDataList
- ApprovalCard
- TransactionRow
- NotificationItem
- VotingCard
- AspirationCard
- VoucherCard
- ComplianceScoreCard
- RiskLogItem
- ModuleCard
- ProgressRing

## State desain yang wajib disiapkan

Setiap halaman harus punya state berikut, bukan hanya happy path:

- Loading.
- Empty.
- Success.
- Warning.
- Error.
- Mobile collapsed.
- Tablet medium.
- Desktop wide.
- Disabled action.
- Permission restricted.

## Aturan micro-interaction

- Hover card: naik 2px dan shadow lembut.
- Tombol primer: hover lebih gelap 6–8%.
- Input focus: ring emerald tipis.
- Sidebar item active: background soft gold/olive overlay.
- Modal/sheet: slide up atau fade scale, cepat dan halus.
- Skeleton shimmer halus, bukan terlalu terang.

## Aturan visual yang harus dihindari

- Jangan memakai gradien ungu/biru ala template SaaS generik.
- Jangan center semua teks.
- Jangan menaruh icon dalam lingkaran warna tebal di setiap card.
- Jangan membuat setiap card punya border kiri warna tebal.
- Jangan membuat dashboard terlalu gelap.
- Jangan memakai terlalu banyak warna selain palette utama.
- Jangan memakai radius berlebihan di semua elemen.

## Copywriting UI

Gaya bahasa UI harus:
- Singkat.
- Formal-ringan.
- Jelas.
- Tidak terlalu teknis untuk anggota.

Contoh:
- “Minta OTP” bukan “Kirim kode verifikasi sekarang”.
- “Belum ada transaksi” bukan “Data tidak ditemukan”.
- “Akun Anda sedang menunggu verifikasi pengurus” untuk pending approval.

## Prioritas implementasi desain

Urutan redesign yang paling aman:
1. Global tokens dan typography.
2. App shell: sidebar + topbar + page container.
3. Login page.
4. Overview dashboard.
5. Transaction + approvals.
6. Compliance + risk.
7. Community, learning, voting, voucher.
8. Mobile refinement.

## Deliverable desain

Dokumen ini dipakai sebagai sumber utama untuk membuat seluruh tampilan frontend baru yang tetap kompatibel dengan data backend yang sudah ada di repo.[cite:8][cite:9] Fokusnya bukan hanya cantik, tetapi juga memetakan kebutuhan per role dan per halaman agar redesign bisa dilakukan sistematis di atas arsitektur AmanDes saat ini.[cite:4][cite:6][cite:8][cite:9]
