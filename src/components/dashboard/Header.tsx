import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  session: any;
  koperasi: any;
  healthMetrics: any;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Header({
  activeTab,
  session,
  koperasi,
  healthMetrics,
  setIsMobileMenuOpen
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-stone-200 dark:border-stone-850 bg-white dark:bg-[#1c1a17] flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xs font-black text-[#104911] dark:text-white uppercase tracking-wider">
            {activeTab === 'overview' && 'Ringkasan Utama'}
            {activeTab === 'transactions' && 'Buku Kas (Ledger)'}
            {activeTab === 'approvals' && 'Kotak Otorisasi'}
            {activeTab === 'compliance' && 'Pusat Kepatuhan PMK'}
            {activeTab === 'financials' && 'Laporan Keuangan'}
            {activeTab === 'e_rat' && 'Rapat Anggota (e-RAT)'}
            {activeTab === 'aspirations' && 'Musrenbang Warga'}
            {activeTab === 'learning' && 'Kelas Literasi'}
            {activeTab === 'rewards' && 'Katalog Hadiah'}
            {activeTab === 'ai_assistant' && 'Asisten AI Kopdes'}
            {activeTab === 'microsite' && 'Microsite Publik'}
            {activeTab === 'proposals' && 'Kemitraan & Pembiayaan'}
            {activeTab === 'member_savings' && (['pengurus', 'ketua'].includes(session.role) ? 'Buku Simpanan Warga' : 'Simpanan Saya')}
          </h1>
          <p className="text-[9px] text-stone-450 leading-none mt-0.5">
            {koperasi?.nama || 'Koperasi Desa Merah Putih'} &bull; {session.koperasiRef}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase bg-[#548C2F]/10 text-[#548C2F] dark:text-emerald-400 px-2.5 py-1 rounded-full border border-[#548C2F]/20">
            Skor Kesehatan: {healthMetrics?.kesehatan_koperasi ?? 100}%
          </span>
        </div>
      </div>
    </header>
  );
}
