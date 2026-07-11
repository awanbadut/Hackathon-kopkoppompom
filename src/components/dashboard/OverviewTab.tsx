import React from 'react';
import { Coins, Award, Shield, Scale, Sparkles, ArrowRightLeft, Landmark } from 'lucide-react';

interface OverviewTabProps {
 session: any;
 kasSummary: any;
 complianceSummary: any;
 healthMetrics: any;
 villageEcoSummary: any;
 pointsBalance: number;
 fmt: (val: any) => string;
 getHealthScoreColor: (score: number) => string;
}

export default function OverviewTab({
 session,
 kasSummary,
 complianceSummary,
 healthMetrics,
 villageEcoSummary,
 pointsBalance,
 fmt,
 getHealthScoreColor
}: OverviewTabProps) {
 return (
 <div className="space-y-6">
 <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
 <div>
 <h3 className="text-lg font-black tracking-tight text-[#548C2F] flex items-center gap-2">
 <Landmark className="w-5 h-5 text-[#F9A620]" />
 Portal Partisipasi &amp; Keterlibatan Anggota (AmanDes &bull; Tema 3)
 </h3>
 <p className="mt-1 text-xs text-stone-500 leading-normal max-w-xl">
 Halo, <span className="font-bold">{session.fullName}</span>! Platform ini memfasilitasi keterlibatan aktif warga melalui e-RAT demokratis, transparansi laporan keuangan neraca &amp; SHU, serta gamifikasi belajar berhadiah insentif belanja.
 </p>
 </div>
 
 {session.role === 'anggota' && (
 <div className="flex items-center gap-3 bg-stone-50 px-4 py-3 rounded-2xl border border-stone-200 shrink-0">
 <Award className="w-6 h-6 text-[#F9A620]" />
 <div>
 <div className="text-[9px] uppercase font-black tracking-wider text-stone-400">Poin Belanja</div>
 <div className="text-base font-black text-[#548C2F] font-mono">{pointsBalance} PTS</div>
 </div>
 </div>
 )}
 </div>

 {/* Metrics Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
 <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase tracking-wider font-black text-stone-400">Kas Riil Koperasi</span>
 <div className="p-2 bg-[#F1F7EA] rounded-xl text-[#3F6B24]">
 <Coins className="w-4 h-4" />
 </div>
 </div>
 <h2 className="text-2xl font-black text-[#548C2F] font-mono">
 {session.role === 'pendamping' ? '🔒 TERBATAS' : fmt(kasSummary?.saldo_kas)}
 </h2>
 <p className="text-[9px] text-stone-400 leading-snug">
 Total saldo kas fisik dari transaksi disetujui.
 </p>
 </div>

 <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase tracking-wider font-black text-stone-400">Kesehatan Kas</span>
 <div className="p-2 bg-red-50 rounded-xl text-red-700">
 <Scale className="w-4 h-4" />
 </div>
 </div>
 <h2 className={`text-2xl font-black font-mono ${getHealthScoreColor(healthMetrics.kesehatan_kas)}`}>
 {healthMetrics.kesehatan_kas}%
 </h2>
 <p className="text-[9px] text-stone-400 leading-snug">
 Kesehatan likuiditas dan pencatatan nota kas.
 </p>
 </div>

 <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase tracking-wider font-black text-stone-400">Kepatuhan PMK</span>
 <div className="p-2 bg-stone-50 rounded-xl text-[#F9A620]">
 <Shield className="w-4 h-4" />
 </div>
 </div>
 <h2 className={`text-2xl font-black font-mono ${getHealthScoreColor(healthMetrics.kepatuhan)}`}>
 {healthMetrics.kepatuhan}%
 </h2>
 <p className="text-[9px] text-stone-400 leading-snug">
 Kepatuhan batas pagu, tenor & alokasi PMK.
 </p>
 </div>

 <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4 ring-2 ring-[#F9A620]/40 relative overflow-hidden">
 <div className="absolute right-0 top-0 w-12 h-12 bg-[#F9A620]/10 rounded-bl-full pointer-events-none" />
 <div className="flex items-center justify-between">
 <span className="text-[10px] uppercase tracking-wider font-black text-[#F9A620]">Kesehatan Koperasi</span>
 <div className="p-2 bg-[#FFFBEA] rounded-xl text-[#F9A620]">
 <Sparkles className="w-4 h-4" />
 </div>
 </div>
 <h2 className={`text-2xl font-black font-mono ${getHealthScoreColor(healthMetrics.kesehatan_koperasi)}`}>
 {healthMetrics.kesehatan_koperasi}%
 </h2>
 <p className="text-[9px] text-stone-400 leading-snug">
 Indeks komposit kesehatan KDMP keseluruhan.
 </p>
 </div>
 </div>

 {/* Sirkulasi Ekonomi Desa Widget */}
 {villageEcoSummary && (
 <div className="bg-gradient-to-br from-[#548C2F]/10 via-[#548C2F]/0 to-[#F9A620]/10 border border-stone-200 p-6 rounded-3xl shadow-sm space-y-6">
 <div className="flex items-center justify-between border-b border-stone-200/50 pb-4">
 <div>
 <h3 className="text-sm font-black text-[#548C2F] flex items-center gap-2">
 <ArrowRightLeft className="w-4 h-4 text-[#F9A620]" />
 Dasbor Ekonomi Sirkular Desa
 </h3>
 <p className="text-[10px] text-stone-500 mt-1">
 Pelacakan perputaran insentif belajar warga yang tersirkulasi kembali di warung belanja koperasi desa.
 </p>
 </div>
 <Landmark className="w-5 h-5 text-stone-450" />
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
 <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
 <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider block">Partisipasi Warga</span>
 <span className="text-xl font-black text-[#548C2F] block mt-2">{villageEcoSummary.member_count} Anggota</span>
 <span className="text-[9px] text-stone-400 block mt-1">Aktif berkontribusi</span>
 </div>
 <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
 <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider block">Insentif Terklaim</span>
 <span className="text-xl font-black text-[#F9A620] block mt-2">{villageEcoSummary.total_points} Poin</span>
 <span className="text-[9px] text-stone-400 block mt-1">Dari hasil belajar kuis</span>
 </div>
 <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-sm">
 <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider block">Voucher Terpakai</span>
 <span className="text-xl font-black text-[#3F6B24] block mt-2">{villageEcoSummary.total_redeemed} Kupon</span>
 <span className="text-[9px] text-stone-400 block mt-1">Sirkulasi belanja toko desa</span>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
