# 🎨 AmanDes — Frontend UI/UX Design Guide

> **Panduan resmi desain antarmuka untuk tim Frontend Hackathon Kemenkop 2026**
> Tujuan: membuat tampilan AmanDes lebih modern, elegan, dan konsisten — tetap bernuansa **Emerald · Gold · Cream · White** namun jauh lebih refined dari tampilan SimKopDes saat ini.

---

## 🧭 Filosofi Desain

AmanDes adalah platform pengawasan keuangan koperasi desa yang harus memancarkan:

| Nilai | Implementasi Visual |
|---|---|
| **Kepercayaan** | Palet warna yang tenang dan profesional, bukan warna-warni |
| **Transparansi** | Layout yang bersih, hierarki informasi yang jelas |
| **Modern & Lokal** | Nuansa emerald-gold yang khas Indonesia, bukan template barat |
| **Accessible** | Kontras tinggi, teks mudah dibaca, mobile-first |

**Prinsip utama:** Sebagian besar halaman adalah **surface netral (cream/white)** dengan **momen aksen** yang presisi menggunakan emerald dan gold. Bukan keduanya sekaligus di mana-mana.

---

## 🎨 Design Token — Warna

### Palet Inti AmanDes

```css
:root {
  /* ═══════════════════════════════════
     EMERALD — Warna Primer (Kepercayaan)
     ═══════════════════════════════════ */
  --emerald-950: #052e16;   /* Background gelap, teks inverse */
  --emerald-900: #14532d;   /* Hero background, sidebar */
  --emerald-800: #166534;   /* Hover state primer */
  --emerald-700: #15803d;   /* Active state */
  --emerald-600: #16a34a;   /* Badge success, icon */
  --emerald-500: #22c55e;   /* Accent ringan */
  --emerald-200: #bbf7d0;   /* Highlight background */
  --emerald-100: #dcfce7;   /* Surface tint emerald */
  --emerald-50:  #f0fdf4;   /* Background sangat ringan */

  /* ═══════════════════════════════════
     GOLD — Warna Aksen (Prestise)
     ═══════════════════════════════════ */
  --gold-900:    #713f12;   /* Text di atas gold highlight */
  --gold-700:    #a16207;   /* Body text gold */
  --gold-600:    #ca8a04;   /* Aksen utama, border, icon */
  --gold-500:    #eab308;   /* Hover gold */
  --gold-400:    #facc15;   /* Badge gold terang */
  --gold-200:    #fef08a;   /* Highlight background */
  --gold-100:    #fefce8;   /* Surface tint gold */
  --gold-50:     #fefce8;   /* Background sangat ringan */

  /* ═══════════════════════════════════
     CREAM & WHITE — Surface Utama
     ═══════════════════════════════════ */
  --cream-100:   #fefdfb;   /* Background halaman utama */
  --cream-200:   #faf9f5;   /* Surface card */
  --cream-300:   #f5f3ee;   /* Surface offset / divider area */
  --cream-400:   #ede9e0;   /* Border card */
  --cream-500:   #d9d4c7;   /* Divider line */
  --white:       #ffffff;   /* Card putih bersih */

  /* ═══════════════════════════════════
     TEKS
     ═══════════════════════════════════ */
  --text-primary:   #1a1a1a;   /* Teks utama */
  --text-secondary: #4b5563;   /* Teks sekunder */
  --text-muted:     #9ca3af;   /* Label, placeholder */
  --text-inverse:   #ffffff;   /* Teks di atas background gelap */

  /* ═══════════════════════════════════
     STATUS
     ═══════════════════════════════════ */
  --status-success: #16a34a;
  --status-warning: #d97706;
  --status-error:   #dc2626;
  --status-info:    #2563eb;

  /* ═══════════════════════════════════
     SEMANTIC MAPPING — Gunakan ini di komponen
     ═══════════════════════════════════ */
  --color-bg:           var(--cream-100);
  --color-surface:      var(--white);
  --color-surface-2:    var(--cream-200);
  --color-surface-3:    var(--cream-300);
  --color-border:       var(--cream-400);
  --color-divider:      var(--cream-500);
  --color-primary:      var(--emerald-900);
  --color-primary-hover:var(--emerald-800);
  --color-accent:       var(--gold-600);
  --color-accent-hover: var(--gold-500);

  /* ═══════════════════════════════════
     SHADOW (tone-matched cream)
     ═══════════════════════════════════ */
  --shadow-xs: 0 1px 2px rgba(20, 83, 45, 0.04);
  --shadow-sm: 0 1px 4px rgba(20, 83, 45, 0.06), 0 2px 8px rgba(20, 83, 45, 0.04);
  --shadow-md: 0 4px 12px rgba(20, 83, 45, 0.08), 0 2px 4px rgba(20, 83, 45, 0.04);
  --shadow-lg: 0 12px 32px rgba(20, 83, 45, 0.12), 0 4px 8px rgba(20, 83, 45, 0.06);
  --shadow-gold: 0 4px 20px rgba(202, 138, 4, 0.20);

  /* ═══════════════════════════════════
     BORDER RADIUS
     ═══════════════════════════════════ */
  --radius-xs:   4px;
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   14px;
  --radius-xl:   20px;
  --radius-2xl:  28px;
  --radius-full: 9999px;
}
```

### Aturan Penggunaan Warna

```
✅ BOLEH                              ❌ HINDARI
─────────────────────────────────     ─────────────────────────────────
Cream/white untuk background utama    Emerald penuh di seluruh halaman
Gold hanya untuk CTA & aksen          Gold di teks body biasa
Emerald untuk header/sidebar          Purple, biru, merah sebagai aksen
Border alpha-blended (rgba)           Border abu-abu solid keras
Teks gelap di atas cream surface      Teks putih di cream background
```

---

## ✍️ Tipografi

### Font Stack

```css
/* ─── Display (heading besar) ─── */
--font-display: 'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif;

/* ─── Body (semua teks UI) ─── */
--font-body: 'Inter', 'DM Sans', system-ui, sans-serif;

/* ─── Mono (angka, kode, OTP) ─── */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Load via Google Fonts:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

### Skala Teks

```css
--text-xs:   0.75rem;    /* 12px — label, badge, metadata */
--text-sm:   0.875rem;   /* 14px — tombol, nav, caption */
--text-base: 1rem;       /* 16px — body utama */
--text-lg:   1.125rem;   /* 18px — sub-heading */
--text-xl:   1.25rem;    /* 20px — heading section */
--text-2xl:  1.5rem;     /* 24px — heading halaman */
--text-3xl:  1.875rem;   /* 30px — hero heading */
--text-4xl:  2.25rem;    /* 36px — display hero */
```

### Aturan Tipografi

| Elemen | Font | Size | Weight | Warna |
|---|---|---|---|---|
| Hero Title | Plus Jakarta Sans | `--text-4xl` | 800 | `--emerald-900` |
| Page Heading | Plus Jakarta Sans | `--text-2xl` | 700 | `--text-primary` |
| Section Title | Plus Jakarta Sans | `--text-xl` | 600 | `--text-primary` |
| Card Title | Inter | `--text-lg` | 600 | `--text-primary` |
| Body Copy | Inter | `--text-base` | 400 | `--text-secondary` |
| Label | Inter | `--text-sm` | 500 | `--text-secondary` |
| Badge / Tag | Inter | `--text-xs` | 600 | varies |
| Angka / Nominal | JetBrains Mono | varies | 600 | `--text-primary` |

---

## 📐 Spacing System

Semua margin, padding, dan gap menggunakan kelipatan **4px**:

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

**Panduan pemakaian:**
- `space-1` – `space-3` : gap icon, padding badge kecil
- `space-4` – `space-6` : padding card, form field
- `space-8` – `space-12` : section padding, layout gap
- `space-16`+ : section antar halaman

---

## 🧩 Komponen UI

### 1. Button

```css
/* ─── Base Button ─── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-5);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  min-height: 40px;
}

/* ─── Primary (Emerald) ─── */
.btn-primary {
  background: var(--emerald-900);
  color: white;
  box-shadow: 0 1px 2px rgba(20,83,45,0.2);
}
.btn-primary:hover {
  background: var(--emerald-800);
  box-shadow: 0 4px 12px rgba(20,83,45,0.25);
  transform: translateY(-1px);
}
.btn-primary:active { transform: translateY(0); }

/* ─── Gold / Aksen ─── */
.btn-gold {
  background: var(--gold-600);
  color: white;
  box-shadow: var(--shadow-gold);
}
.btn-gold:hover {
  background: var(--gold-700);
  box-shadow: 0 6px 24px rgba(202,138,4,0.30);
  transform: translateY(-1px);
}

/* ─── Outline Emerald ─── */
.btn-outline {
  background: transparent;
  border: 1.5px solid var(--emerald-900);
  color: var(--emerald-900);
}
.btn-outline:hover {
  background: var(--emerald-50);
}

/* ─── Ghost ─── */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}
.btn-ghost:hover {
  background: var(--cream-300);
  color: var(--text-primary);
}

/* ─── Ukuran ─── */
.btn-sm { padding: var(--space-1) var(--space-3); font-size: var(--text-xs); min-height: 32px; }
.btn-lg { padding: var(--space-3) var(--space-8); font-size: var(--text-base); min-height: 48px; }
```

---

### 2. Card

```css
/* ─── Base Card ─── */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 180ms ease, transform 180ms ease;
}

/* ─── Interactive Card ─── */
.card-interactive:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: rgba(20, 83, 45, 0.15);
}

/* ─── KPI / Stats Card ─── */
.card-stat {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5) var(--space-6);
  position: relative;
  overflow: hidden;
}
/* Accent bar di atas card stat */
.card-stat::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--emerald-900), var(--gold-600));
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

/* ─── Glass Card (untuk hero/sidebar) ─── */
.card-glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-xl);
}
```

---

### 3. Form Input

```css
/* ─── Input Field ─── */
.input-group { display: flex; flex-direction: column; gap: var(--space-2); }

.label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.input-field {
  width: 100%;
  height: 44px;
  padding: var(--space-2) var(--space-4);
  background: var(--white);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-primary);
  transition: border-color 180ms ease, box-shadow 180ms ease;
  outline: none;
}

.input-field::placeholder { color: var(--text-muted); }

.input-field:hover { border-color: var(--cream-500); }

.input-field:focus {
  border-color: var(--emerald-900);
  box-shadow: 0 0 0 3px rgba(20, 83, 45, 0.08);
}

/* ─── Input dengan icon ─── */
.input-wrapper {
  position: relative;
}
.input-wrapper .input-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
  width: 16px; height: 16px;
}
.input-wrapper .input-field { padding-left: 40px; }
```

---

### 4. Badge & Status

```css
/* ─── Base Badge ─── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
  line-height: 1.6;
  letter-spacing: 0.01em;
}

/* ─── Varian ─── */
.badge-emerald {
  background: var(--emerald-100);
  color: var(--emerald-800);
  border: 1px solid var(--emerald-200);
}
.badge-gold {
  background: var(--gold-100);
  color: var(--gold-700);
  border: 1px solid var(--gold-200);
}
.badge-warning {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}
.badge-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
.badge-neutral {
  background: var(--cream-300);
  color: var(--text-secondary);
  border: 1px solid var(--cream-400);
}
```

---

### 5. Sidebar / Navigation

```css
/* ─── Sidebar ─── */
.sidebar {
  width: 260px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  background: var(--emerald-950);
  /* subtle texture */
  background-image: 
    radial-gradient(ellipse at top left, rgba(202,138,4,0.06) 0%, transparent 60%),
    radial-gradient(ellipse at bottom right, rgba(34,197,94,0.04) 0%, transparent 50%);
  overflow: hidden;
}

.sidebar-logo {
  padding: var(--space-6);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.sidebar-nav { flex: 1; padding: var(--space-4); overflow-y: auto; }

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  cursor: pointer;
  transition: all 150ms ease;
  margin-bottom: 2px;
}

.nav-item:hover {
  color: rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.06);
}

.nav-item.active {
  color: white;
  background: rgba(202,138,4,0.15);
  border: 1px solid rgba(202,138,4,0.2);
}

.nav-item.active .nav-icon {
  color: var(--gold-400);
}
```

---

### 6. Header / Topbar

```css
.topbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
}
```

---

### 7. Table

```css
.table-container {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

thead {
  background: var(--cream-200);
  border-bottom: 1px solid var(--color-border);
}

th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

td {
  padding: var(--space-3) var(--space-4);
  color: var(--text-primary);
  border-bottom: 1px solid var(--color-divider);
  vertical-align: middle;
}

tbody tr:last-child td { border-bottom: none; }

tbody tr:hover { background: var(--cream-200); }

/* Angka keuangan */
.amount-positive { color: var(--status-success); font-family: var(--font-mono); font-weight: 600; }
.amount-negative { color: var(--status-error); font-family: var(--font-mono); font-weight: 600; }
.amount-neutral   { color: var(--text-primary); font-family: var(--font-mono); font-weight: 600; }
```

---

### 8. Skeleton Loading

```css
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--cream-300) 25%,
    var(--cream-200) 50%,
    var(--cream-300) 75%
  );
  background-size: 800px 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

.skeleton-text    { height: 1em; margin-bottom: var(--space-2); }
.skeleton-heading { height: 1.5em; width: 40%; margin-bottom: var(--space-4); }
.skeleton-avatar  { width: 40px; height: 40px; border-radius: var(--radius-full); }
.skeleton-card    { height: 120px; border-radius: var(--radius-lg); }
.skeleton-stat    { height: 80px; border-radius: var(--radius-lg); }
```

---

### 9. Toast Notification

```css
.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 360px;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background: var(--white);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  animation: toast-in 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes toast-in {
  from { opacity: 0; transform: translateX(24px) scale(0.95); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}

.toast-success { border-left: 3px solid var(--status-success); }
.toast-error   { border-left: 3px solid var(--status-error); }
.toast-warning { border-left: 3px solid var(--status-warning); }
.toast-info    { border-left: 3px solid var(--color-primary); }
```

> ⚠️ **Catatan:** Toast dengan `border-left` hanya digunakan di sini karena fungsinya adalah **status indicator yang kritis** — bukan dekorasi card biasa.

---

### 10. Empty State

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-16) var(--space-8);
  min-height: 280px;
}

.empty-state-icon {
  width: 64px; height: 64px;
  background: var(--cream-300);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-5);
  color: var(--text-muted);
}

.empty-state h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.empty-state p {
  font-size: var(--text-sm);
  color: var(--text-muted);
  max-width: 36ch;
  margin-bottom: var(--space-6);
}
```

---

## 🌀 Animasi & Motion

### Prinsip Animasi

- **Minimal tapi meaningful** — animasi hanya untuk transisi state, bukan dekorasi
- **Durasi pendek** — UI mikro: 120-200ms, konten: 300-400ms
- **Easing konsisten** — gunakan `cubic-bezier(0.16, 1, 0.3, 1)` untuk feel natural

### Keyframes Standar

```css
/* ─── Fade In Up ─── */
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 350ms cubic-bezier(0.16, 1, 0.3, 1) both; }

/* ─── Slide In Left ─── */
@keyframes slide-in-left {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}
.animate-slide-in-left { animation: slide-in-left 400ms cubic-bezier(0.16, 1, 0.3, 1) both; }

/* ─── Scale In ─── */
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
.animate-scale-in { animation: scale-in 250ms cubic-bezier(0.16, 1, 0.3, 1) both; }

/* ─── Stagger Delay ─── */
.stagger-1 { animation-delay: 50ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 150ms; }
.stagger-4 { animation-delay: 200ms; }
.stagger-5 { animation-delay: 250ms; }

/* ─── Float (hero decoration) ─── */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
.animate-float { animation: float 4s ease-in-out infinite; }

/* ─── Reduced Motion ─── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Layout & Responsif

### Dashboard Layout

```
Desktop (1024px+):
┌─────────────┬──────────────────────────────────────┐
│  SIDEBAR    │  TOPBAR                               │
│  260px      ├──────────────────────────────────────┤
│  (emerald)  │                                       │
│             │  KONTEN UTAMA                         │
│  • Overview │  (cream background)                   │
│  • Transaksi│                                       │
│  • Laporan  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│  • Anggota  │  │ KPI  │ │ KPI  │ │ KPI  │ │ KPI  ││
│  • e-RAT    │  └──────┘ └──────┘ └──────┘ └──────┘│
│  • Belajar  │                                       │
│  • Reward   │  ┌─────────────────┐ ┌──────────────┐│
│             │  │  Chart Keuangan │ │  Risk Logs   ││
└─────────────┴──└─────────────────┘─└──────────────┘┘

Mobile (< 768px):
┌──────────────────────────────────────┐
│  TOPBAR + Hamburger menu             │
├──────────────────────────────────────┤
│  Konten — single column stack        │
├──────────────────────────────────────┤
│  [Overview] [Transaksi] [+] [Profil] │  ← Bottom nav
└──────────────────────────────────────┘
```

### Breakpoint

```css
/* Mobile first */
.container { padding: 0 var(--space-4); }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 0 var(--space-6); }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: 0 var(--space-8); }
}
```

---

## 📄 Panduan Per Halaman

### Halaman Login (page.tsx)

**Struktur yang direkomendasikan:**

```
[Kolom Kiri 52%]                    [Kolom Kanan 48%]
background: emerald-950             background: cream-100
─────────────────────               ─────────────────────
Logo AmanDes (SVG)                  Heading "Masuk Gerbang"
                                    
Tagline hero                        Input Nomor HP
(text-white, font-display)          ↳ dengan icon Phone
                                    
NIK Widget                          Input OTP + tombol gold
(glassmorphism card)                ↳ dengan feedback real-time
                                    
Regulasi badge strip                Tombol "Masuk" (emerald)
(gold text, semi-transparent)       
                                    Demo Accounts (4 card)
Footer text                         ↳ dengan animasi stagger
```

**Yang harus diperbaiki:**
- Tambahkan animasi `fade-in-up` dengan stagger pada kolom kanan
- Input OTP: tampilkan 6 kotak terpisah (digit input) bukan satu field biasa
- Tombol "Minta OTP": gunakan loading state dengan spinner
- Demo account card: tambahkan hover glow emerald tipis
- Footer: pindahkan ke kolom kanan, lebih minimalis

---

### Halaman Dashboard (DashboardClient.tsx)

**Tab Navigation:**

```
Bukan lagi tab horizontal biasa — gunakan sidebar dengan icon.
Setiap tab punya:
  • Icon (Lucide)
  • Label teks
  • Badge counter (jika ada data pending)
  • Active state: background gold semi-transparent + border kiri gold
```

**KPI Cards (Overview):**

```
┌─────────────────────────────────────────┐
│ ≡ gradient bar (emerald → gold)         │  ← 3px top accent
│                                         │
│  💰  Saldo Kas                          │
│  Rp 127.500.000                         │  ← JetBrains Mono, text-3xl
│                                         │
│  ↑ +12.3% dari bulan lalu              │  ← badge hijau kecil
│                                         │
│  [mini sparkline chart]                 │  ← opsional, SVG ringan
└─────────────────────────────────────────┘
```

**Tabel Transaksi:**
- Filter bar di atas (Search + dropdown Jenis + dropdown Status)
- Setiap row punya status badge berwarna
- Kolom Amount selalu right-aligned dengan font mono
- Hover row: background cream-200 dengan transisi smooth

**Risk Logs:**
- Card berwarna merah muda tipis (bukan merah penuh)
- Icon `AlertTriangle` dengan warna warning
- Tombol "Resolve" outline emerald

---

## 🔤 Panduan Penulisan Teks UI

| Konteks | Contoh |
|---|---|
| Heading halaman | "Laporan Keuangan" (bukan "LAPORAN KEUANGAN") |
| Placeholder input | "Contoh: 081200000001" (bukan "Masukkan nomor...") |
| Label tombol | "Minta OTP" / "Masuk" (bukan "Submit" atau "Click Here") |
| Pesan kosong | "Belum ada transaksi. Tambahkan transaksi pertama Anda →" |
| Pesan error | "Nomor HP belum terdaftar. Hubungi pengurus koperasi." |
| Konfirmasi sukses | "Transaksi berhasil dicatat dan menunggu persetujuan." |

---

## ✅ Checklist Sebelum Push

Sebelum setiap commit yang menyentuh UI, verifikasi:

- [ ] Semua warna menggunakan CSS variable, bukan hardcode hex
- [ ] Ukuran teks minimal 12px (tidak ada yang lebih kecil)
- [ ] Tombol memiliki min-height 40px (touch target)
- [ ] Semua gambar ada `alt` text
- [ ] Tidak ada warna abu-abu solid untuk border — gunakan rgba/alpha
- [ ] Komponen baru punya state: default, hover, focus, active, disabled
- [ ] Skeleton loading sudah ada untuk setiap section async
- [ ] Empty state sudah ada untuk list/tabel yang bisa kosong
- [ ] Sudah dicek di mobile 375px dan desktop 1280px
- [ ] Animasi respek `prefers-reduced-motion`

---

## 🚫 Anti-Pattern yang Harus Dihindari

Ini adalah pola yang membuat UI terlihat "template" dan "asal jadi":

| ❌ Jangan | ✅ Lakukan |
|---|---|
| Tombol gradien warna-warni | Tombol solid emerald atau gold |
| Semua teks di-center | Left-align untuk body, center hanya untuk hero |
| Icon di dalam lingkaran berwarna sebagai dekorasi | Icon tanpa background, langsung di-flow |
| Blob/orbs abstrak sebagai background decoration | Background bersih dengan surface layering |
| Border abu-abu keras | Border `rgba(0,0,0,0.08)` atau `rgba(20,83,45,0.10)` |
| Card dengan border kiri berwarna (Notion style) | Card dengan shadow dan surface elevation |
| Font Poppins / Montserrat | Plus Jakarta Sans / Inter |
| Teks hero "Selamat Datang di AmanDes" | Copy yang spesifik: "Aman Kelola, Transparan & Patuh Hukum" |
| Purple/biru sebagai aksen tambahan | Hanya emerald + gold |
| `border-radius: 999px` di semua elemen | Radius proporsional: card=14px, badge=full, input=10px |

---

## 📌 Referensi Inspirasi

Perhatikan desain dari platform berikut sebagai referensi "modern tapi profesional":

- **Linear** — kebersihan teks, kepadatan informasi
- **Vercel Dashboard** — sidebar dark, konten light
- **Stripe** — tipografi kelas dunia, hierarki informasi
- **Lark (ByteDance)** — sidebar navigasi multi-level

**Yang berbeda dari AmanDes:** nuansa warm cream + emerald, bukan dark/gray cold seperti kebanyakan SaaS barat.

---

*AmanDes Frontend Guide · Tim Hackathon Kemenkop 2026 · Dibuat untuk frontend developer*
