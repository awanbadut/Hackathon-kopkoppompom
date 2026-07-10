# AmanDes UI Generation Prompts

Dokumen ini berisi prompt siap pakai untuk menghasilkan desain UI AmanDes yang modern, minimalis, rapi, dan sesuai dengan sistem di repository `Hackathon-kopkoppompom`.[cite:1][cite:3][cite:4][cite:8][cite:9] Prompt ini dibuat agar bisa dipakai di AI design generator, AI code generator, atau model lain untuk membuat mockup, layout, komponen, maupun frontend implementation dengan arah visual yang konsisten.[cite:8][cite:9]

## Cara pakai

Gunakan prompt ini sesuai kebutuhan:

- Jika ingin hasil visual/moodboard: pakai prompt **Master Visual Prompt**.
- Jika ingin generate halaman tertentu: pakai prompt **Per Halaman**.
- Jika ingin generate komponen: pakai prompt **Komponen UI**.
- Jika ingin generate frontend code: pakai prompt **Implementation Prompt**.

Selalu sertakan bahwa proyek ini adalah **web app koperasi desa berbasis dashboard, OTP login, role-based access, compliance, transaksi, approval, voting, aspirasi, learning, dan rewards** agar hasil AI tidak melenceng dari sistem yang ada.[cite:8][cite:9]

---

## Master UI Prompt

Gunakan prompt ini untuk menghasilkan arah UI utama seluruh sistem.

```text
Design a modern, minimalist, premium web dashboard UI for a cooperative village finance and governance platform called AmanDes. The platform is a role-based system with OTP login and multiple modules: financial transactions, approvals, compliance monitoring, risk logs, pending member verification, e-learning modules, e-RAT voting, community aspirations, reward vouchers, notifications, and financial summaries.

The UI must feel more refined, more modern, and more premium than a typical village cooperative dashboard or generic admin template. Avoid outdated government portal design, avoid noisy dashboard layouts, avoid crowded cards, avoid too many colors, and avoid generic SaaS purple gradients.

Visual direction:
- Modern minimalist
- Warm institutional look
- Clean dashboard hierarchy
- Elegant but simple
- Trustworthy and financial-system oriented
- Suitable for Indonesian cooperative governance
- High readability and strong information structure

Color palette (must be used as the core identity):
- #F9A620 for strong gold accent
- #FFD449 for soft gold highlight
- #AAB03C for olive secondary accent
- #548C2F for emerald green primary actions
- #104911 for deep green brand foundation
- add cream and white surfaces for readability

Use cream and white as the main content surfaces, deep green and emerald for navigation and primary brand identity, gold for premium highlights and CTA accents, and olive as a subtle supporting tone. The interface should feel bright, clean, and trustworthy — not dark, not playful, not childish.

Typography direction:
- modern sans serif
- premium dashboard feel
- clear information hierarchy
- use strong bold headings and clean readable body text
- numeric values should look neat and financial

Layout direction:
- left sidebar navigation on desktop
- sticky topbar
- spacious page header
- balanced white space
- clear KPI cards
- modular content sections
- responsive mobile-friendly version
- data-heavy areas must remain readable and elegant

Design rules:
- minimal ornament
- no unnecessary blobs
- no too many gradients
- no over-rounded childish UI
- no dense table without spacing
- no giant colored icon circles everywhere
- no purple/blue startup look
- no generic admin template style

The result should look like a polished modern product dashboard built for a real financial governance platform.
```

---

## Master Prompt untuk Generate Frontend Code

Gunakan prompt ini jika ingin AI langsung menghasilkan kode UI.

```text
Create a modern frontend UI for AmanDes, a Next.js role-based cooperative governance and financial monitoring web application. The system already has backend data and page structure. Your task is to redesign only the frontend presentation so it becomes more modern, more premium, and much cleaner than the current cooperative web interface.

Important context:
- Existing system includes login page with OTP flow, demo accounts, and NIK checker.
- Dashboard includes role-based data for chairman, management/treasurer, members, and Kemenkop auditor.
- Dashboard data already includes: cooperative profile, cash summary, compliance summary, user points, financial transactions, approvals, pending members, unresolved risk logs, learning modules, user progress, notifications, e-RAT voting agendas, votes, community aspirations, aspiration upvotes, reward vouchers, redeemed vouchers, village circular economy summary, and real-time financial summary.
- Use the existing backend structure, do not invent unrelated modules.

Design objective:
- modern minimalist UI
- warm institutional dashboard
- premium but simple
- highly readable
- suitable for financial and governance workflows
- lighter and cleaner than a generic admin dashboard

Mandatory color palette:
- #F9A620
- #FFD449
- #AAB03C
- #548C2F
- #104911
Use cream and white for primary surfaces.

UI style requirements:
- left sidebar on desktop, mobile drawer on small screens
- sticky topbar
- page header with title, description, and actions
- reusable cards, badges, tables, empty states, skeleton loaders, alerts, and role-based dashboard sections
- elegant KPI cards with subtle top accent bars
- refined forms with soft borders and emerald focus ring
- minimal shadows and modern spacing
- modern typography with strong hierarchy
- responsive layout

Do not:
- use purple gradients
- use neon UI
- use noisy illustrations
- use overly playful cards
- use giant decorative icon circles
- use outdated government portal aesthetics
- use generic admin theme look

Build the UI as reusable components and split by domain if possible: auth, overview, finance, approvals, compliance, members, learning, voting, aspirations, rewards, notifications.
```

---

## Prompt Per Halaman

### 1. Login Page Prompt

```text
Design a premium login page for AmanDes, a cooperative village governance web application. The page uses OTP login and includes demo accounts and a NIK checker utility.

Layout:
- split-screen desktop layout
- left side for branding and trust message
- right side for authentication form
- mobile layout should stack vertically

Left side content:
- AmanDes logo
- strong heading about safe, transparent, compliant cooperative management
- short supporting text
- legal/regulation badges
- compact feature highlights
- optional NIK utility card

Right side content:
- phone number field
- OTP input with modern 6-digit slot style
- request OTP button
- login button
- demo account role cards
- error and success states

Style:
- deep green and emerald on the left
- cream/white auth panel on the right
- gold used for secondary action and highlight
- clean shadows, premium typography, minimal ornament
- look modern, trustworthy, elegant, and cleaner than a basic cooperative portal
```

### 2. Dashboard Overview Prompt

```text
Design a modern dashboard overview page for AmanDes. This is a role-based cooperative financial governance dashboard. The page should work for different roles but keep the same layout system.

Include:
- page header with title, subtitle, and quick actions
- 4 key KPI cards
- alert banner area for compliance risk or pending approvals
- recent activity section
- notification preview
- role-aware quick action cards
- one lower section for role-specific modules

Style:
- white and cream surfaces
- emerald as primary action color
- gold as highlight accent
- olive as secondary chart tone
- subtle shadows, soft borders, clean spacing
- high readability
- should look like a real premium product dashboard
```

### 3. Financial Transactions Prompt

```text
Design a modern financial transactions page for AmanDes. The page should display transaction records, filters, status badges, evidence preview, and action buttons in a clear financial dashboard style.

Include:
- page title and description
- transaction summary strip
- search input
- filters for type, status, category, date
- add transaction button
- transaction table on desktop
- mobile card list on small screens
- amount column using mono-style visual hierarchy
- evidence preview modal or sheet
- empty state and loading skeleton

Style:
- premium financial dashboard
- minimal, clean, readable
- green and gold identity, cream surfaces
- avoid clutter and avoid generic admin table style
```

### 4. Approval Center Prompt

```text
Design an approval center page for AmanDes where chairman and management can review and approve or reject financial transactions.

Include:
- approval summary cards
- list of pending approvals
- transaction detail panel
- evidence attachment preview
- risk level chip
- approve and reject action buttons
- notes field
- approval history

Style:
- serious, clean, action-oriented
- refined status design
- modern enterprise dashboard feel
- subtle trust-driven green theme with gold highlights
```

### 5. Compliance and Risk Prompt

```text
Design a compliance and risk monitoring page for AmanDes. This page is used to review cooperative compliance score and unresolved financial risk logs.

Include:
- large compliance score card
- summary cards for compliant, warning, critical states
- risk log list
- severity chips
- linked transaction snippets
- filter and sorting tools
- clear action items or recommendations

Style:
- institutional and analytical
- white/cream surfaces with green structure
- olive and gold as controlled accents
- no full red alarm design unless critical
- premium dashboard with very strong hierarchy
```

### 6. Pending Member Verification Prompt

```text
Design a pending member verification page for AmanDes where management verifies new members.

Include:
- member count summary
- card or list layout of pending members
- identity details
- cooperative details
- verification actions
- status notes

Style:
- simple, clean, action-driven
- modern list design
- easy scanning
```

### 7. Learning Modules Prompt

```text
Design a modern learning modules page for AmanDes. This module is for cooperative members to learn financial literacy and governance topics.

Include:
- page header
- learning progress summary
- module cards grid
- continue learning CTA
- completion badge
- progress bars

Style:
- friendlier than finance pages
- still clean and premium
- use cream, olive, soft gold, and emerald accents
- modular cards with good breathing room
```

### 8. e-RAT Voting Prompt

```text
Design an e-RAT voting page for AmanDes. This page allows members to read agendas, vote, and see vote status or aggregated result summaries.

Include:
- active agenda cards
- agenda detail section
- voting option cards
- vote status indicator
- countdown or status note
- vote result summary visualization

Style:
- transparent and civic-tech inspired
- modern cooperative governance UI
- minimal and trustworthy
```

### 9. Community Aspirations Prompt

```text
Design a community aspirations page for AmanDes. Members can post aspirations, see community ideas, and upvote suggestions.

Include:
- create aspiration form
- sorting options
- aspiration list cards
- author and role display
- upvote button
- follow-up status

Style:
- community board feel but still structured
- clean modern cards
- readable, not like a social media feed
```

### 10. Rewards and Voucher Prompt

```text
Design a rewards and voucher page for AmanDes where users can redeem points collected from participation and learning.

Include:
- total user points
- featured reward card
- voucher grid
- point cost labels
- redeem action
- redeemed voucher history

Style:
- premium but not flashy
- gold and olive accents may be stronger here
- maintain the same system-wide design language
```

---

## Prompt Per Role

### Ketua Koperasi

```text
Design the AmanDes dashboard experience specifically for the cooperative chairman role. Prioritize approvals, compliance, financial health, risk visibility, and governance summaries. The interface should feel executive, trustworthy, clean, and premium. Use stronger deep green and gold accents for authority, but keep the main content bright and readable.
```

### Pengurus / Bendahara

```text
Design the AmanDes dashboard experience specifically for the management/treasurer role. Prioritize daily finance operations, transaction input, approvals, evidence uploads, and pending member verification. The interface should feel efficient, operational, and clean, with fast access to tables, forms, and action buttons.
```

### Anggota

```text
Design the AmanDes dashboard experience specifically for the cooperative member role. Prioritize personal progress, learning modules, voting, aspirations, notifications, and reward points. The interface should feel welcoming, modern, light, and motivating, while staying within the same institutional design system.
```

### Pendamping / Auditor

```text
Design the AmanDes dashboard experience specifically for the Kemenkop auditor role. Prioritize compliance score, unresolved risks, financial summaries, and audit monitoring. The interface should feel analytical, formal, and high-trust with clean structure and strong information hierarchy.
```

---

## Prompt Komponen UI

### Prompt untuk membuat design system komponen

```text
Generate a reusable design system for AmanDes, a modern cooperative governance dashboard. Create a consistent component set for buttons, inputs, select fields, cards, data tables, status badges, KPI cards, alerts, empty states, skeleton loaders, sidebar navigation, topbar, mobile nav, modal sheets, and role badges.

The design system must use this palette:
- #F9A620
- #FFD449
- #AAB03C
- #548C2F
- #104911
plus cream and white surfaces.

Make it modern, minimal, readable, premium, and suitable for a financial governance application.
```

### Prompt untuk membuat KPI cards

```text
Generate modern KPI cards for a cooperative financial dashboard. The cards should look premium, minimal, and readable. Use cream/white surfaces, emerald accents, subtle gold highlights, strong number hierarchy, and soft shadows. Avoid generic admin KPI design.
```

### Prompt untuk membuat sidebar

```text
Generate a modern left sidebar navigation for AmanDes, a cooperative governance dashboard. Use deep green as the base, with elegant active states using gold or olive overlays. The sidebar should feel premium, compact, and highly usable for a role-based dashboard.
```

### Prompt untuk membuat tabel modern

```text
Generate a modern data table design for financial transactions in a cooperative dashboard. The table should have excellent spacing, refined status badges, readable amount formatting, elegant filters, and a clean mobile alternative card list. Avoid dense, outdated admin table design.
```

---

## Prompt untuk Implementasi Berdasarkan Repo

Prompt ini cocok kalau kamu ingin AI membantu dari sudut pandang struktur project.

```text
Use the existing repository structure of a Next.js web app and redesign the frontend without changing the backend logic. The repository currently has a login page, a dashboard page that loads many data domains, a pending approval page, and a very large dashboard client component that should be split into reusable modules.

Refactor the frontend into reusable domain-based components for:
- auth
- overview
- finance
- approvals
- compliance
- members
- learning
- voting
- aspirations
- rewards
- notifications

Create a cleaner modern UI architecture while preserving the existing data sources and role-based behavior.

The new design must follow these visual rules:
- modern minimalist
- warm, premium, institutional
- palette: #F9A620, #FFD449, #AAB03C, #548C2F, #104911, cream, white
- more elegant than a generic village cooperative portal
- clean dashboard shell with sidebar and topbar
- reusable UI components
- role-aware overview sections
```

---

## Prompt Singkat Siap Tempel

Kalau kamu mau prompt singkat yang bisa langsung dipakai cepat, gunakan ini:

```text
Design a modern, minimalist, premium UI for AmanDes, a role-based cooperative governance and financial monitoring dashboard. Use this palette: #F9A620, #FFD449, #AAB03C, #548C2F, #104911, plus cream and white surfaces. The system includes OTP login, dashboard overview, transactions, approvals, compliance, pending member verification, learning modules, voting, aspirations, rewards, and notifications. Make it cleaner, brighter, and more elegant than a typical cooperative web portal. Use strong hierarchy, spacious layouts, premium typography, subtle shadows, refined KPI cards, a deep green sidebar, and gold accents. Avoid generic admin templates, purple gradients, noisy layouts, and outdated government portal aesthetics.
```

## Catatan penting

Prompt-prompt ini sudah disesuaikan dengan domain dan data yang memang ada di sistem AmanDes saat ini, termasuk login OTP, akun demo role, dashboard multi-domain, approval flow, compliance, risk logs, voting, aspirasi, learning, reward, dan summary keuangan.[cite:8][cite:9] Jadi prompt ini lebih aman dipakai untuk menghasilkan UI yang nyambung ke backend dibanding prompt generik dashboard biasa.[cite:8][cite:9]
