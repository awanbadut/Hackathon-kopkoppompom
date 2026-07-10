-- Redefine member summary view to correctly subtract savings withdrawals
CREATE OR REPLACE VIEW kopkoppompom_v_member_summary AS
SELECT
    a.anggota_ref,
    a.koperasi_ref,
    a.nama,
    a.nik,
    COALESCE(SUM(CASE WHEN t.type = 'simpanan_pokok' THEN t.amount ELSE 0 END), 0) AS simpanan_pokok,
    COALESCE(SUM(CASE WHEN t.type = 'simpanan_wajib' THEN t.amount ELSE 0 END), 0) AS simpanan_wajib,
    COALESCE(SUM(CASE WHEN t.type = 'simpanan_sukarela' THEN t.amount 
                      WHEN t.type = 'pengeluaran' AND t.kategori = 'kopkoppompom_simpanan_anggota' THEN -t.amount 
                      ELSE 0 END), 0) AS simpanan_sukarela,
    COALESCE(SUM(CASE WHEN t.type IN ('simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela') THEN t.amount 
                      WHEN t.type = 'pengeluaran' AND t.kategori = 'kopkoppompom_simpanan_anggota' THEN -t.amount 
                      ELSE 0 END), 0) AS total_simpanan
FROM kopkoppompom_anggota_koperasi a
LEFT JOIN kopkoppompom_transaksi_keuangan t ON t.anggota_ref = a.anggota_ref AND t.status = 'disetujui'
GROUP BY a.anggota_ref, a.koperasi_ref, a.nama, a.nik;
