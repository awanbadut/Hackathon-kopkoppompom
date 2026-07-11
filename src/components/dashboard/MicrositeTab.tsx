import React from 'react';
import { Activity } from 'lucide-react';

interface MicrositeTabProps {
  koperasi: any;
  villageEcoSummary: any;
  financialSummary: any;
  complianceSummary: any;
  fmt: (val: any) => string;
}

export default function MicrositeTab({
  koperasi,
  villageEcoSummary,
  financialSummary,
  complianceSummary,
  fmt
}: MicrositeTabProps) {
  return (
    <div className="space-y-6 animate-scale-in">
      <div className="bg-white border border-stone-200 p-8 rounded-3xl shadow-sm space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#548C2F] to-[#0d341c] p-8 text-white border border-[#F9A620]/20 shadow-inner flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#F9A620]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-3 z-10">
            <div className="flex items-center gap-3">
              <span className="badge badge-gold">SIMKOPDES PORTAL</span>
              <span className="badge badge-success">TERVERIFIKASI</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">{koperasi?.nama_koperasi || 'Koperasi Desa Merah Putih'}</h2>
            <p className="text-xs text-stone-300 max-w-xl font-medium">
              Wajah digital resmi Koperasi Desa/Kelurahan Merah Putih (KDKMP) berdasarkan basis data terintegrasi Kementerian Koperasi RI.
            </p>
          </div>
          <div className="flex flex-col items-end z-10">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">NIK KOPERASI</span>
            <span className="text-sm font-mono font-black text-[#FFC93D] tracking-widest">{koperasi?.nik_koperasi || '3201010000000001'}</span>
          </div>
        </div>

        {/* Grid Legalitas & Informasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50">
            <h4 className="text-[10px] font-black text-stone-450 uppercase tracking-widest mb-3">Identitas Hukum</h4>
            <dl className="space-y-2.5 text-xs">
              <div>
                <dt className="text-stone-400 font-medium">Bentuk Koperasi</dt>
                <dd className="font-extrabold text-stone-800 mt-0.5">{koperasi?.bentuk_koperasi || 'Produsen'}</dd>
              </div>
              <div>
                <dt className="text-stone-400 font-medium">Kategori Usaha</dt>
                <dd className="font-extrabold text-stone-800 mt-0.5">{koperasi?.kategori_usaha || 'Sektor Riil'}</dd>
              </div>
              <div>
                <dt className="text-stone-400 font-medium">Modal Awal Pendirian</dt>
                <dd className="font-extrabold text-stone-800 mt-0.5">{fmt(koperasi?.modal_awal || 250000000)}</dd>
              </div>
            </dl>
          </div>

          <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50">
            <h4 className="text-[10px] font-black text-stone-450 uppercase tracking-widest mb-3">Lokasi & Wilayah Kerja</h4>
            <dl className="space-y-2.5 text-xs">
              <div>
                <dt className="text-stone-400 font-medium">Alamat Lengkap Kantor</dt>
                <dd className="font-extrabold text-stone-800 mt-0.5 leading-relaxed">{koperasi?.alamat_lengkap || 'Jalan Raya Puncak No. 100'}</dd>
              </div>
              <div>
                <dt className="text-stone-400 font-medium">Provinsi / Kabupaten / Kecamatan</dt>
                <dd className="font-extrabold text-stone-800 mt-0.5">Jawa Barat / Kab. Bogor / Ciawi</dd>
              </div>
              <div>
                <dt className="text-stone-400 font-medium">Kode Pos</dt>
                <dd className="font-extrabold text-stone-800 mt-0.5">{koperasi?.kode_pos || '16720'}</dd>
              </div>
            </dl>
          </div>

          <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50">
            <h4 className="text-[10px] font-black text-stone-450 uppercase tracking-widest mb-3">Statistik Transparansi</h4>
            <dl className="space-y-2.5 text-xs">
              <div>
                <dt className="text-stone-400 font-medium">Anggota Terdaftar Aktif</dt>
                <dd className="font-extrabold text-stone-800 mt-0.5">{villageEcoSummary?.member_count || 1} Anggota</dd>
              </div>
              <div>
                <dt className="text-stone-400 font-medium">Sisa Hasil Usaha (SHU) Berjalan</dt>
                <dd className="font-extrabold text-stone-800 mt-0.5 text-[#548C2F]">
                  {fmt((financialSummary?.pemasukan_kas || 0) - (financialSummary?.pengeluaran_kas || 0))}
                </dd>
              </div>
              <div>
                <dt className="text-stone-400 font-medium">Skor Kepatuhan Audit Kemenkop</dt>
                <dd className="font-extrabold text-stone-850 mt-0.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#F9A620]" />
                  <span>{complianceSummary?.health_score || 100} / 100</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Unit Usaha KDKMP */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider">Unit Usaha Utama KDKMP</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Toko Retail Sembako Kopdes', desc: 'Gerai sembako penyedia bahan pokok pangan murah bagi warga desa secara luring.', badge: 'RITEL' },
              { title: 'Lumbung Pangan Mandiri', desc: 'Gudang penyimpanan dan pengeringan padi/jagung dari petani anggota koperasi.', badge: 'AGRIBISNIS' },
              { title: 'Unit Pembiayaan Mikro Kopdes', desc: 'Layanan fasilitas simpanan wajib/sukarela dan penyaluran kredit produktif pedagang.', badge: 'FINANCIAL' }
            ].map((unit, uidx) => (
              <div key={uidx} className="card p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="badge badge-gold">{unit.badge}</span>
                  <span className="text-[10px] text-[#3F6B24] font-bold uppercase">AKTIF</span>
                </div>
                <h4 className="text-xs font-black text-stone-800">{unit.title}</h4>
                <p className="text-[11px] text-stone-550 leading-relaxed font-medium">{unit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
