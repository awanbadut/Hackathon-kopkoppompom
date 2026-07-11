import React, { useState } from 'react';
import { Activity, Scale, BookOpen, ShieldCheck, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface MicrositeTabProps {
  koperasi: any;
  villageEcoSummary: any;
  financialSummary: any;
  complianceSummary: any;
  fmt: (val: any) => string;
}

const REGULASI_LIST = [
  {
    id: 'uu-koperasi',
    title: 'UU No. 25 Tahun 1992 tentang Perkoperasian',
    subtitle: 'Dasar Hukum Utama Tata Kelola & Struktur Koperasi',
    icon: Scale,
    articles: [
      {
        pasal: 'Pasal 3 (Tujuan Koperasi)',
        isi: 'Koperasi bertujuan memajukan kesejahteraan anggota pada khususnya dan masyarakat pada umumnya serta ikut membangun tatanan perekonomian nasional dalam rangka mewujudkan masyarakat yang maju, adil, dan makmur berlandaskan Pancasila dan Undang-Undang Dasar 1945.'
      },
      {
        pasal: 'Pasal 34 (Pertanggungjawaban Pengurus)',
        isi: 'Pengurus menanggung kerugian yang diderita Koperasi sebagai akibat kelalaian atau kesengajaan dalam melakukan tugas-tugasnya. Transaksi di atas Rp5.000.000 wajib menyertakan bukti fisik pendukung yang sah (nota/kuitansi/invoice) untuk pertanggungjawaban pengurus.'
      },
      {
        pasal: 'Pasal 41 (Struktur Simpanan & Permodalan)',
        isi: 'Modal Koperasi terdiri dari modal sendiri dan modal pinjaman. Simpanan Pokok (dibayar sekali saat masuk anggota) dan Simpanan Wajib (dibayar berkala secara rutin) tidak dapat ditarik kembali selama masih aktif menjadi anggota koperasi. Hanya Simpanan Sukarela yang dapat ditarik sewaktu-waktu oleh anggota.'
      },
      {
        pasal: 'Pasal 45 (Pembagian SHU Adil)',
        isi: 'Sisa Hasil Usaha (SHU) Koperasi dibagikan kepada anggota sebanding dengan jasa usaha yang dilakukan oleh masing-masing anggota (berbasis partisipasi aktif, poin literasi, dan transaksi belanja), setelah dikurangi alokasi dana cadangan koperasi.'
      }
    ]
  },
  {
    id: 'uu-desa-pmk',
    title: 'UU No. 6 Tahun 2014 & Peraturan Menteri Keuangan',
    subtitle: 'Sinergi Keuangan Koperasi dengan Pembangunan Desa',
    icon: ShieldCheck,
    articles: [
      {
        pasal: 'UU Desa Pasal 87 & 88 (BUM Desa)',
        isi: 'Desa dapat mendirikan Badan Usaha Milik Desa (BUM Desa) yang dikelola secara kekeluargaan dan kegotongroyongan. BUM Desa dapat mendirikan unit usaha koperasi desa untuk mengkonsolidasikan permodalan dan perdagangan warga desa.'
      },
      {
        pasal: 'PMK 7/PMK.07/2026 (Transparansi Dana Desa)',
        isi: 'Dana Desa yang dialokasikan sebagai penyertaan modal usaha koperasi desa wajib dilaporkan secara transparan melalui sistem pencatatan digital publik secara real-time untuk mencegah praktik korupsi dan penyalahgunaan dana desa.'
      },
      {
        pasal: 'PMK 15/PMK.07/2026 (Batas Risiko Kredit Desa)',
        isi: 'Batas maksimum pemberian pinjaman atau kredit produktif bagi pelaku usaha mikro warga desa dibatasi maksimal sebesar Rp50.000.000 per anggota demi menjaga kesehatan likuiditas kas koperasi dan mencegah risiko kredit macet.'
      }
    ]
  }
];

export default function MicrositeTab({
  koperasi,
  villageEcoSummary,
  financialSummary,
  complianceSummary,
  fmt
}: MicrositeTabProps) {
  const [activeRegTab, setActiveRegTab] = useState<'uu-koperasi' | 'uu-desa-pmk'>('uu-koperasi');
  const [expandedPasal, setExpandedPasal] = useState<string | null>(null);

  const togglePasal = (pasal: string) => {
    setExpandedPasal(prev => (prev === pasal ? null : pasal));
  };

  const activeReg = REGULASI_LIST.find(r => r.id === activeRegTab) || REGULASI_LIST[0];
  const ActiveIcon = activeReg.icon;

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
                <dd className="font-extrabold text-[#F9A620] mt-1 text-[10px] uppercase">
                  Menunggu RAT
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

        {/* ======================================= */}
        {/* NEW SECTION: REGULASI & UNDANG-UNDANG   */}
        {/* ======================================= */}
        <div className="border-t border-stone-200 pt-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-sm font-black text-[#548C2F] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#F9A620]" />
                Pusat Referensi Regulasi & Dasar Hukum Koperasi Desa
              </h3>
              <p className="text-[10px] text-stone-500 mt-1 font-medium">
                Kumpulan Undang-Undang, Peraturan Menteri, dan dasar hukum tata kelola dana desa serta perkoperasian nasional.
              </p>
            </div>

            {/* Tab Selector */}
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveRegTab('uu-koperasi')}
                className={`py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeRegTab === 'uu-koperasi'
                    ? 'bg-white text-[#548C2F] shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                UU Koperasi
              </button>
              <button
                onClick={() => setActiveRegTab('uu-desa-pmk')}
                className={`py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeRegTab === 'uu-desa-pmk'
                    ? 'bg-white text-[#548C2F] shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                UU Desa & PMK
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-stone-200 bg-stone-50/30 flex flex-col md:flex-row gap-6">
            {/* Left Info Panel */}
            <div className="md:w-1/3 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#548C2F]/10 flex items-center justify-center text-[#548C2F] border border-[#548C2F]/20">
                <ActiveIcon className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-black text-stone-800 leading-snug">{activeReg.title}</h4>
              <p className="text-[10px] text-stone-550 leading-relaxed font-medium">
                {activeReg.subtitle}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-[#F9A620] bg-[#FFFBEA] px-2 py-0.5 rounded border border-[#FFE79A]">
                  <FileText className="w-3 h-3" /> Dokumen Resmi
                </span>
              </div>
            </div>

            {/* Right Accordion List */}
            <div className="flex-1 space-y-3.5 text-xs">
              {activeReg.articles.map((art, idx) => {
                const isExpanded = expandedPasal === art.pasal;
                return (
                  <div 
                    key={idx} 
                    className="bg-white border border-stone-200 rounded-xl overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => togglePasal(art.pasal)}
                      className="w-full p-4 flex items-center justify-between font-extrabold text-stone-800 text-left hover:bg-stone-50/50 transition-colors"
                    >
                      <span>{art.pasal}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 text-stone-550 font-medium leading-relaxed text-[11px] border-t border-stone-100 pt-3 animate-fade-in-up">
                        {art.isi}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
