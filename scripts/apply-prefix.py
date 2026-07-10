import os
import re

def load_prefix():
    prefix = ""
    env_path = ".env.local"
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                match = re.match(r"^\s*DB_PREFIX\s*=\s*(.*)?\s*$", line)
                if match:
                    val = match.group(1).strip()
                    if val.startswith('"') and val.endsWith('"'):
                        val = val[1:-1]
                    elif val.startswith("'") and val.endsWith("'"):
                        val = val[1:-1]
                    prefix = val.strip()
                    break
    if not prefix:
        prefix = "kopkoppompom_"
    return prefix

def main():
    prefix = load_prefix()
    print(f"Applying prefix '{prefix}' to SQL migration files...")

    migrations_dir = "supabase/migrations"
    if not os.path.exists(migrations_dir):
        print(f"Error: {migrations_dir} not found.")
        return

    # List of tables, views, types, and functions to prefix
    entities = [
        # Tables
        'akun_bank_koperasi', 'anggota_koperasi', 'aset_koperasi', 'barang_keluar_produk',
        'barang_masuk_produk', 'dokumen_koperasi', 'gerai_koperasi', 'inventaris_produk',
        'karyawan_koperasi', 'kbli_koperasi', 'modal_koperasi', 'pengajuan_domain',
        'pengajuan_kemitraan', 'pengajuan_pembiayaan', 'pengajuan_rekening_bank',
        'pengurus_koperasi', 'produk_koperasi', 'profil_koperasi', 'rat_koperasi',
        'referensi_dokumen_koperasi', 'referensi_gerai_koperasi', 'referensi_komoditas_desa',
        'referensi_koperasi_wilayah', 'referensi_profil_desa', 'referensi_wilayah',
        'simpanan_anggota', 'transaksi_penjualan',
        # Additive tables
        'app_users', 'transaksi_keuangan', 'risk_logs', 'koperasi_health_score',
        'approvals', 'notifications', 'user_devices', 'whatsapp_mock_log',
        'learning_modules', 'user_progress', 'user_points',
        # Community & Reward tables
        'rat_voting_agenda', 'rat_votes', 'community_aspirations', 'aspiration_upvotes', 'reward_vouchers', 'user_vouchers',
        # Views
        'v_koperasi_summary', 'v_member_summary', 'v_compliance_summary',
        # Types
        'user_role', 'user_status', 'tx_type', 'tx_sumber_dana', 'tx_kategori', 'tx_status', 
        'risk_level_type', 'approval_status', 'notification_type', 'notification_channel', 
        'module_category', 'progress_status',
        # Functions & Triggers
        'update_user_points_on_complete', 'trg_user_progress_complete'
    ]

    for file_name in os.listdir(migrations_dir):
        if file_name.endswith(".sql"):
            file_path = os.path.join(migrations_dir, file_name)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            # Replace each entity name with prefixed version
            # Use regex with boundary to prevent substring replacement (e.g. users vs app_users)
            for entity in entities:
                # Avoid prefixing already prefixed ones if run multiple times
                pattern = rf"\b(?<!{prefix}){entity}\b"
                content = re.sub(pattern, f"{prefix}{entity}", content)

            # Prefix foreign key constraint names to avoid global namespace collisions
            # e.g., ALTER TABLE table ADD CONSTRAINT fk_...
            # replace fk_... with fk_<prefix>...
            content = re.sub(r"\bconstraint fk_", f"constraint fk_{prefix}", content)
            content = re.sub(r"\bADD CONSTRAINT fk_", f"ADD CONSTRAINT fk_{prefix}", content)

            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Prefixed {file_name}")

    print("Successfully applied database prefixing!")

if __name__ == "__main__":
    main()
