-- 0003_rls_and_triggers.sql

-- Enable RLS for reference tables (default deny for public/authenticated, accessed via service role)
ALTER TABLE kopkoppompom_akun_bank_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_anggota_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_aset_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_barang_keluar_produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_barang_masuk_produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_dokumen_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_gerai_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_inventaris_produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_karyawan_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_kbli_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_modal_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_pengajuan_domain ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_pengajuan_kemitraan ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_pengajuan_pembiayaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_pengajuan_rekening_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_pengurus_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_produk_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_profil_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_rat_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_referensi_dokumen_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_referensi_gerai_koperasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_referensi_komoditas_desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_referensi_koperasi_wilayah ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_referensi_profil_desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_referensi_wilayah ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_simpanan_anggota ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_transaksi_penjualan ENABLE ROW LEVEL SECURITY;

-- Enable RLS for AmanDes additive tables
ALTER TABLE kopkoppompom_app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_transaksi_keuangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_risk_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_koperasi_health_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_whatsapp_mock_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_user_points ENABLE ROW LEVEL SECURITY;

-- Trigger: Automatically update kopkoppompom_user_points when kopkoppompom_user_progress is completed
CREATE OR REPLACE FUNCTION kopkoppompom_update_user_points_on_complete()
RETURNS TRIGGER AS $$
DECLARE
    points_to_add INTEGER;
BEGIN
    IF NEW.status = 'selesai' AND (OLD IS NULL OR OLD.status <> 'selesai') THEN
        -- Get points_reward from kopkoppompom_learning_modules
        SELECT points_reward INTO points_to_add
        FROM kopkoppompom_learning_modules
        WHERE id = NEW.module_id;
        
        -- Insert or update kopkoppompom_user_points
        INSERT INTO kopkoppompom_user_points (user_id, total_points)
        VALUES (NEW.user_id, COALESCE(points_to_add, 10))
        ON CONFLICT (user_id) DO UPDATE
        SET total_points = kopkoppompom_user_points.total_points + COALESCE(points_to_add, 10);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER kopkoppompom_trg_user_progress_complete
AFTER INSERT OR UPDATE ON kopkoppompom_user_progress
FOR EACH ROW
EXECUTE FUNCTION kopkoppompom_update_user_points_on_complete();
