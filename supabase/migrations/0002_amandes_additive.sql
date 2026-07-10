-- 0002_amandes_additive.sql

CREATE TYPE kopkoppompom_user_role AS ENUM ('pengurus', 'ketua', 'anggota', 'pendamping');
CREATE TYPE kopkoppompom_user_status AS ENUM ('active', 'pending', 'suspended');

CREATE TABLE kopkoppompom_app_users (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name text NOT NULL,
    phone_number text UNIQUE NOT NULL,
    ktp_number text UNIQUE, -- NIK
    role kopkoppompom_user_role NOT NULL,
    koperasi_ref text REFERENCES kopkoppompom_referensi_koperasi_wilayah(koperasi_ref) ON DELETE CASCADE,
    anggota_ref text REFERENCES kopkoppompom_anggota_koperasi(anggota_ref) ON DELETE SET NULL,
    pengurus_ref text REFERENCES kopkoppompom_pengurus_koperasi(pengurus_ref) ON DELETE SET NULL,
    status kopkoppompom_user_status NOT NULL DEFAULT 'pending',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TYPE kopkoppompom_tx_type AS ENUM ('pemasukan', 'pengeluaran', 'simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela', 'pinjaman', 'bagi_hasil');
CREATE TYPE kopkoppompom_tx_sumber_dana AS ENUM ('dana_desa', 'non_dana_desa');
CREATE TYPE kopkoppompom_tx_kategori AS ENUM ('operasional', 'pembangunan_fisik', 'distribusi_pangan', 'kopkoppompom_simpanan_anggota', 'lainnya');
CREATE TYPE kopkoppompom_tx_status AS ENUM ('draft', 'menunggu_approval', 'disetujui', 'ditolak');
CREATE TYPE kopkoppompom_risk_level_type AS ENUM ('aman', 'perlu_perhatian', 'berisiko_tinggi');

CREATE TABLE kopkoppompom_transaksi_keuangan (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    koperasi_ref text NOT NULL REFERENCES kopkoppompom_referensi_koperasi_wilayah(koperasi_ref) ON DELETE CASCADE,
    type kopkoppompom_tx_type NOT NULL,
    sumber_dana kopkoppompom_tx_sumber_dana NOT NULL,
    kategori kopkoppompom_tx_kategori NOT NULL,
    amount numeric NOT NULL CHECK (amount > 0),
    description text NOT NULL,
    anggota_ref text REFERENCES kopkoppompom_anggota_koperasi(anggota_ref) ON DELETE SET NULL,
    evidence_url text,
    input_by uuid NOT NULL REFERENCES kopkoppompom_app_users(id) ON DELETE RESTRICT,
    status kopkoppompom_tx_status NOT NULL DEFAULT 'draft',
    risk_level kopkoppompom_risk_level_type NOT NULL DEFAULT 'aman',
    tenor_bulan integer,
    bunga_persen numeric,
    transaction_date date NOT NULL DEFAULT current_date,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE kopkoppompom_risk_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id uuid NOT NULL REFERENCES kopkoppompom_transaksi_keuangan(id) ON DELETE CASCADE,
    rule_code text NOT NULL,
    risk_level kopkoppompom_risk_level_type NOT NULL,
    message text NOT NULL,
    resolved boolean NOT NULL DEFAULT false,
    resolved_note text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE kopkoppompom_koperasi_health_score (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    koperasi_ref text NOT NULL REFERENCES kopkoppompom_referensi_koperasi_wilayah(koperasi_ref) ON DELETE CASCADE,
    score integer NOT NULL CHECK (score >= 0 AND score <= 100),
    last_calculated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TYPE kopkoppompom_approval_status AS ENUM ('menunggu', 'disetujui', 'ditolak');

CREATE TABLE kopkoppompom_approvals (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id uuid NOT NULL REFERENCES kopkoppompom_transaksi_keuangan(id) ON DELETE CASCADE,
    approver_id uuid REFERENCES kopkoppompom_app_users(id) ON DELETE SET NULL,
    approval_level integer NOT NULL CHECK (approval_level IN (1, 2)),
    status kopkoppompom_approval_status NOT NULL DEFAULT 'menunggu',
    catatan text,
    decided_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TYPE kopkoppompom_notification_type AS ENUM ('approval_request', 'risk_alert', 'transaction_status', 'rat_reminder', 'system_info');
CREATE TYPE kopkoppompom_notification_channel AS ENUM ('in_app', 'push', 'whatsapp_mock');

CREATE TABLE kopkoppompom_notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES kopkoppompom_app_users(id) ON DELETE CASCADE,
    type kopkoppompom_notification_type NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    reference_id uuid,
    is_read boolean NOT NULL DEFAULT false,
    sent_via kopkoppompom_notification_channel NOT NULL DEFAULT 'in_app',
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE kopkoppompom_user_devices (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES kopkoppompom_app_users(id) ON DELETE CASCADE,
    fcm_token text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE kopkoppompom_whatsapp_mock_log (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number text NOT NULL,
    message text NOT NULL,
    sent_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TYPE kopkoppompom_module_category AS ENUM ('tata_kelola', 'keuangan', 'hukum', 'digital_literasi');
CREATE TYPE kopkoppompom_progress_status AS ENUM ('belum', 'sedang_berjalan', 'selesai');

CREATE TABLE kopkoppompom_learning_modules (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    content text NOT NULL,
    category kopkoppompom_module_category NOT NULL,
    points_reward integer NOT NULL DEFAULT 10,
    quiz_json jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE kopkoppompom_user_progress (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES kopkoppompom_app_users(id) ON DELETE CASCADE,
    module_id uuid NOT NULL REFERENCES kopkoppompom_learning_modules(id) ON DELETE CASCADE,
    status kopkoppompom_progress_status NOT NULL DEFAULT 'belum',
    quiz_score integer,
    completed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, module_id)
);

CREATE TABLE kopkoppompom_user_points (
    user_id uuid NOT NULL REFERENCES kopkoppompom_app_users(id) ON DELETE CASCADE PRIMARY KEY,
    total_points integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Views
CREATE OR REPLACE VIEW kopkoppompom_v_koperasi_summary AS
SELECT
    koperasi_ref,
    COALESCE(SUM(CASE WHEN type IN ('pemasukan', 'simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela') THEN amount ELSE 0 END), 0) AS total_pemasukan,
    COALESCE(SUM(CASE WHEN type IN ('pengeluaran', 'pinjaman', 'bagi_hasil') THEN amount ELSE 0 END), 0) AS total_pengeluaran,
    COALESCE(SUM(CASE WHEN type IN ('pemasukan', 'simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela') THEN amount ELSE -amount END), 0) AS saldo_kas
FROM kopkoppompom_transaksi_keuangan
WHERE status = 'disetujui'
GROUP BY koperasi_ref;

CREATE OR REPLACE VIEW kopkoppompom_v_member_summary AS
SELECT
    a.anggota_ref,
    a.koperasi_ref,
    a.nama,
    a.nik,
    COALESCE(SUM(CASE WHEN t.type = 'simpanan_pokok' THEN t.amount ELSE 0 END), 0) AS simpanan_pokok,
    COALESCE(SUM(CASE WHEN t.type = 'simpanan_wajib' THEN t.amount ELSE 0 END), 0) AS simpanan_wajib,
    COALESCE(SUM(CASE WHEN t.type = 'simpanan_sukarela' THEN t.amount ELSE 0 END), 0) AS simpanan_sukarela,
    COALESCE(SUM(CASE WHEN t.type IN ('simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela') THEN t.amount ELSE 0 END), 0) AS total_simpanan
FROM kopkoppompom_anggota_koperasi a
LEFT JOIN kopkoppompom_transaksi_keuangan t ON t.anggota_ref = a.anggota_ref AND t.status = 'disetujui'
GROUP BY a.anggota_ref, a.koperasi_ref, a.nama, a.nik;

CREATE OR REPLACE VIEW kopkoppompom_v_compliance_summary AS
SELECT
    k.koperasi_ref,
    COALESCE(h.score, 100) AS health_score,
    COUNT(CASE WHEN r.resolved = false AND r.risk_level = 'berisiko_tinggi' THEN 1 END) AS open_high_risks,
    COUNT(CASE WHEN r.resolved = false AND r.risk_level = 'perlu_perhatian' THEN 1 END) AS open_medium_risks,
    (SELECT MAX(tanggal_rat) FROM kopkoppompom_rat_koperasi WHERE koperasi_ref = k.koperasi_ref) AS tanggal_rat_terakhir
FROM kopkoppompom_referensi_koperasi_wilayah k
LEFT JOIN (
    SELECT DISTINCT ON (koperasi_ref) koperasi_ref, score
    FROM kopkoppompom_koperasi_health_score
    ORDER BY koperasi_ref, last_calculated_at DESC
) h ON h.koperasi_ref = k.koperasi_ref
LEFT JOIN kopkoppompom_transaksi_keuangan t ON t.koperasi_ref = k.koperasi_ref
LEFT JOIN kopkoppompom_risk_logs r ON r.transaction_id = t.id
GROUP BY k.koperasi_ref, h.score;
