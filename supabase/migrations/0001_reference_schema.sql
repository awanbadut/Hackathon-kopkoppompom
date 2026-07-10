-- 0001_reference_schema.sql
-- Generated automatically from metadata_database_hackathon_final.xlsx

CREATE TABLE kopkoppompom_akun_bank_koperasi (
    akun_bank_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    nama_rekening text NULL,
    nama_bank text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_anggota_koperasi (
    anggota_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    nama text NULL,
    nik text NULL,
    kode_wilayah text NULL,
    jenis_kelamin text NULL,
    status_keanggotaan text NULL,
    tanggal_terdaftar date NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL,
    file_ktp text NULL,
    status_akun text NULL,
    pekerjaan text NULL
);

CREATE TABLE kopkoppompom_aset_koperasi (
    aset_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    nama_aset text NULL,
    tipe_aset text NULL,
    status text NULL,
    progres_pembangunan numeric NULL,
    foto_utama text NULL,
    foto_sekunder text NULL,
    dokumen_utama text NULL,
    dokumen_sekunder text NULL,
    dokumen_lainnya text NULL,
    luas_lahan numeric NULL,
    panjang_lahan numeric NULL,
    lebar_lahan numeric NULL,
    akses_jalan text NULL,
    koordinat_dibulatkan text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_barang_keluar_produk (
    __row_id serial PRIMARY KEY,
    transaksi_sample_id text NOT NULL,
    produk_sample_id text NOT NULL,
    koperasi_ref text NOT NULL,
    kode_barcode text NULL,
    tanggal_keluar timestamp without time zone NULL,
    status text NULL,
    nama_produk text NULL,
    nama_tampilan text NULL,
    jumlah_keluar numeric NULL,
    harga numeric NULL,
    total_nilai numeric NULL,
    status_transaksi text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_barang_masuk_produk (
    barang_masuk_ref text NOT NULL PRIMARY KEY,
    produk_sample_id text NOT NULL,
    koperasi_ref text NOT NULL,
    kode_barcode text NULL,
    nama_produk text NULL,
    nama_tampilan text NULL,
    jumlah_masuk numeric NULL,
    jumlah_tersedia numeric NULL,
    harga_beli numeric NULL,
    harga_jual numeric NULL,
    total_biaya numeric NULL,
    keterangan text NULL,
    status text NULL,
    tanggal_masuk timestamp without time zone NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_dokumen_koperasi (
    dokumen_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    jenis_dokumen_ref text NOT NULL,
    nomor text NULL,
    tanggal_berlaku date NULL,
    tanggal_kadaluarsa date NULL,
    alamat_pada_dokumen text NULL,
    unggahan_dokumen text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_gerai_koperasi (
    gerai_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    jenis_gerai_ref text NOT NULL,
    status_gerai text NULL,
    foto_gerai text NULL,
    pengisi text NULL,
    akses_internet text NULL,
    akses_listrik text NULL,
    status_kepemilikan_aset_gerai text NULL,
    status_pemanfaatan_aset_gerai text NULL,
    sumber_air_bersih text NULL,
    jenis_bangunan text NULL,
    koordinat_dibulatkan text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_inventaris_produk (
    inventaris_ref text NOT NULL PRIMARY KEY,
    produk_sample_id text NOT NULL,
    koperasi_ref text NOT NULL,
    nama_produk text NULL,
    stok numeric NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL,
    kode_barcode text NULL
);

CREATE TABLE kopkoppompom_karyawan_koperasi (
    karyawan_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    nama text NULL,
    jabatan text NULL,
    nomor_hp_karyawan text NULL,
    jenis_kelamin text NULL,
    nik text NULL,
    email text NULL,
    status_karyawan text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_kbli_koperasi (
    __row_id serial PRIMARY KEY,
    koperasi_ref text NOT NULL,
    kode_kbli text NULL,
    nama_kbli text NULL,
    tipe_izin_usaha text NULL,
    tahun_kbli smallint NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_modal_koperasi (
    modal_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    nomor_perjanjian text NULL,
    tipe_sumber text NULL,
    nama_sumber text NULL,
    tipe_modal text NULL,
    jumlah numeric NULL,
    tanggal_diterima date NULL,
    file_perjanjian text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_pengajuan_domain (
    domain_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    domain_koperasi text NULL,
    status_verifikasi text NULL,
    status_domain text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_pengajuan_kemitraan (
    pengajuan_kemitraan_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    nik text NULL,
    penanggung_jawab text NULL,
    nomor_penanggung_jawab text NULL,
    status_permohonan text NULL,
    bisnis_kemitraan text NULL,
    paket_kemitraan text NULL,
    formulir_permohonan text NULL,
    ktp_penanggung_jawab text NULL,
    tipe_kemitraan text NULL,
    catatan text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_pengajuan_pembiayaan (
    pengajuan_pembiayaan_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    nik text NULL,
    penanggung_jawab text NULL,
    nomor_penanggung_jawab text NULL,
    status_permohonan text NULL,
    formulir_permohonan_pembiayaan text NULL,
    nominal_permohonan real NULL,
    tenor integer NULL,
    tujuan_permohonan text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_pengajuan_rekening_bank (
    pengajuan_rekening_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    nik text NULL,
    penanggung_jawab text NULL,
    nomor_penanggung_jawab text NULL,
    status text NULL,
    kode_bank text NULL,
    nama_bank text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_pengurus_koperasi (
    pengurus_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    nama text NULL,
    jabatan text NULL,
    status text NULL,
    no_hp text NULL,
    nik text NULL,
    jenis_kelamin text NULL,
    foto_profil text NULL,
    email text NULL,
    alamat text NULL,
    kode_pos text NULL,
    tanggal_lahir text NULL,
    status_pendidikan text NULL,
    periode_mulai text NULL,
    periode_selesai date NULL,
    file_ktp text NULL,
    sumber_data text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_produk_koperasi (
    produk_sample_id text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    kode_barcode text NULL,
    nama_produk text NULL,
    unit text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_profil_koperasi (
    koperasi_ref text NOT NULL PRIMARY KEY,
    nama_koperasi text NULL,
    status_registrasi text NULL,
    bentuk_koperasi text NULL,
    kategori_usaha text NULL,
    nik_koperasi text NULL,
    alamat_lengkap text NULL,
    kode_pos text NULL,
    koordinat_dibulatkan text NULL,
    modal_awal text NULL,
    sumber_persetujuan text NULL,
    tentang_koperasi text NULL,
    pola_pengelolaan text NULL,
    metode_pengisian text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_rat_koperasi (
    rat_sample_id text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    jenis_sektor_koperasi text NULL,
    urutan_rat text NULL,
    tahun_buku smallint NULL,
    tahun_rencana_kerja smallint NULL,
    tahun_rencana_anggaran smallint NULL,
    tanggal_rat date NULL,
    jumlah_peserta_rat integer NULL,
    status_rat text NULL,
    tahap_rat text NULL,
    laporan_posisi_keuangan text NULL,
    laporan_hasil_usaha text NULL,
    rapb_posisi_keuangan text NULL,
    rapb_hasil_usaha text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_referensi_dokumen_koperasi (
    jenis_dokumen_ref text NOT NULL PRIMARY KEY,
    nama_dokumen text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_referensi_gerai_koperasi (
    jenis_gerai_ref text NOT NULL PRIMARY KEY,
    nama_jenis_gerai text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_referensi_komoditas_desa (
    komoditas_ref text NOT NULL PRIMARY KEY,
    kode_wilayah text NOT NULL,
    nama_komoditas text NULL,
    luas_area text NULL,
    volume text NULL,
    jumlah_sdm_terlibat real NULL,
    nilai_potensi_desa bigint NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_referensi_koperasi_wilayah (
    koperasi_ref text NOT NULL PRIMARY KEY,
    kode_wilayah text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_referensi_profil_desa (
    kode_wilayah text NOT NULL PRIMARY KEY,
    tahun_populasi integer NULL,
    total_penduduk integer NULL,
    penduduk_laki_laki integer NULL,
    penduduk_perempuan integer NULL,
    tahun_pendanaan integer NULL,
    anggaran_dana_desa numeric NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_referensi_wilayah (
    provinsi text NULL,
    kab_kota text NULL,
    kecamatan text NULL,
    desa_kelurahan text NULL,
    kode_wilayah text NOT NULL PRIMARY KEY,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_simpanan_anggota (
    simpanan_ref text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    anggota_ref text NOT NULL,
    periode_pembayaran text NULL,
    jumlah_simpanan numeric NULL,
    status text NULL,
    dibuat_pada timestamp without time zone NULL,
    dibayar_pada timestamp without time zone NULL
);

CREATE TABLE kopkoppompom_transaksi_penjualan (
    transaksi_sample_id text NOT NULL PRIMARY KEY,
    koperasi_ref text NOT NULL,
    nama_pelanggan text NULL,
    tanggal_dibuat timestamp without time zone NULL,
    total_pembayaran numeric NULL,
    status_transaksi text NULL,
    metode_pembayaran text NULL,
    dibuat_pada timestamp without time zone NULL,
    diperbarui_pada timestamp without time zone NULL
);


-- Foreign Key Constraints
ALTER TABLE kopkoppompom_akun_bank_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_akun_bank_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_anggota_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_anggota_koperasi_kode_wilayah FOREIGN KEY (kode_wilayah) REFERENCES kopkoppompom_referensi_wilayah (kode_wilayah) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_anggota_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_anggota_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_aset_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_aset_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_barang_keluar_produk ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_barang_keluar_produk_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_barang_keluar_produk ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_barang_keluar_produk_produk_sample_id FOREIGN KEY (produk_sample_id) REFERENCES kopkoppompom_produk_koperasi (produk_sample_id) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_barang_keluar_produk ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_barang_keluar_produk_transaksi_sample_id FOREIGN KEY (transaksi_sample_id) REFERENCES kopkoppompom_transaksi_penjualan (transaksi_sample_id) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_barang_masuk_produk ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_barang_masuk_produk_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_barang_masuk_produk ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_barang_masuk_produk_produk_sample_id FOREIGN KEY (produk_sample_id) REFERENCES kopkoppompom_produk_koperasi (produk_sample_id) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_dokumen_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_dokumen_koperasi_jenis_dokumen_ref FOREIGN KEY (jenis_dokumen_ref) REFERENCES kopkoppompom_referensi_dokumen_koperasi (jenis_dokumen_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_dokumen_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_dokumen_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_gerai_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_gerai_koperasi_jenis_gerai_ref FOREIGN KEY (jenis_gerai_ref) REFERENCES kopkoppompom_referensi_gerai_koperasi (jenis_gerai_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_gerai_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_gerai_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_inventaris_produk ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_inventaris_produk_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_inventaris_produk ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_inventaris_produk_produk_sample_id FOREIGN KEY (produk_sample_id) REFERENCES kopkoppompom_produk_koperasi (produk_sample_id) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_karyawan_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_karyawan_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_kbli_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_kbli_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_modal_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_modal_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_pengajuan_domain ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_pengajuan_domain_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_pengajuan_kemitraan ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_pengajuan_kemitraan_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_pengajuan_pembiayaan ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_pengajuan_pembiayaan_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_pengajuan_rekening_bank ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_pengajuan_rekening_bank_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_pengurus_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_pengurus_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_produk_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_produk_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_profil_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_profil_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_rat_koperasi ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_rat_koperasi_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_referensi_komoditas_desa ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_referensi_komoditas_desa_kode_wilayah FOREIGN KEY (kode_wilayah) REFERENCES kopkoppompom_referensi_wilayah (kode_wilayah) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_referensi_koperasi_wilayah ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_referensi_koperasi_wilayah_kode_wilayah FOREIGN KEY (kode_wilayah) REFERENCES kopkoppompom_referensi_wilayah (kode_wilayah) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_referensi_profil_desa ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_referensi_profil_desa_kode_wilayah FOREIGN KEY (kode_wilayah) REFERENCES kopkoppompom_referensi_wilayah (kode_wilayah) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_simpanan_anggota ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_simpanan_anggota_anggota_ref FOREIGN KEY (anggota_ref) REFERENCES kopkoppompom_anggota_koperasi (anggota_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_simpanan_anggota ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_simpanan_anggota_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;
ALTER TABLE kopkoppompom_transaksi_penjualan ADD CONSTRAINT fk_kopkoppompom_kopkoppompom_transaksi_penjualan_koperasi_ref FOREIGN KEY (koperasi_ref) REFERENCES kopkoppompom_referensi_koperasi_wilayah (koperasi_ref) ON DELETE CASCADE;