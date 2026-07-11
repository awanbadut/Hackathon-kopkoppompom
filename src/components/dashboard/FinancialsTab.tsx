import React from 'react';
import { Scale, BarChart3, Coins, Check } from 'lucide-react';

interface FinancialsTabProps {
  session: any;
  koperasi: any;
  kasSummary: any;
  financialSummary: any;
  totalKoperasiPoints: number;
  pointsBalance: number;
  handleDistributeShu: () => void;
  isPending: boolean;
  fmt: (val: any) => string;
}

export default function FinancialsTab({
  session,
  koperasi,
  kasSummary,
  financialSummary,
  totalKoperasiPoints,
  pointsBalance,
  handleDistributeShu,
  isPending,
  fmt
}: FinancialsTabProps) {
  const saldoKasVal = kasSummary?.saldo_kas ? Number(kasSummary.saldo_kas) : 0;
  const piutangVal = financialSummary?.piutang_anggota ? Number(financialSummary.piutang_anggota) : 0;
  const totalAset = saldoKasVal + piutangVal;

  const simpokVal = financialSummary?.simpanan_pokok ? Number(financialSummary.simpanan_pokok) : 0;
  const simwajibVal = financialSummary?.simpanan_wajib ? Number(financialSummary.simpanan_wajib) : 0;
  const simsukarelaVal = financialSummary?.simpanan_sukarela ? Number(financialSummary.simpanan_sukarela) : 0;
  const modalAwalVal = koperasi?.modal_awal ? Number(koperasi.modal_awal) : 250000000;
  const totalPasiva = simpokVal + simwajibVal + simsukarelaVal + modalAwalVal;

  const totalPendapatan = financialSummary?.pemasukan_kas ? Number(financialSummary.pemasukan_kas) : 0;
  const totalBeban = financialSummary?.pengeluaran_kas ? Number(financialSummary.pengeluaran_kas) : 0;
  const sisaHasilUsaha = totalPendapatan - totalBeban;

  const isBalanced = totalAset === totalPasiva;

  return (
    <div className="space-y-6">
      
      {/* Neraca Saldo */}
      <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
          <h3 className="text-sm font-black text-[#548C2F] flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#F9A620]" />
            Laporan Posisi Keuangan (Neraca Saldo)
          </h3>
          {isBalanced ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F1F7EA] text-[#3F6B24] text-[10px] font-black uppercase border border-[#C7DDAE]">
              <Check className="w-3.5 h-3.5" /> Balanced
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFFBEA] text-[#B36F0C] text-[10px] font-black uppercase border border-[#FFE79A]">
              Unbalanced
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-normal">
          {/* Left Column: Aset */}
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-2">
              AKTIVA (ASET KOPERASI)
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-600">Kas Tunai & Saldo Bank</span>
                <span className="font-mono font-bold text-stone-900">{fmt(saldoKasVal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-600">Piutang Pembiayaan Anggota</span>
                <span className="font-mono font-bold text-stone-900">{fmt(piutangVal)}</span>
              </div>
              <div className="pt-3 border-t border-dashed border-stone-250 flex justify-between font-black text-sm text-[#548C2F]">
                <span>TOTAL AKTIVA</span>
                <span className="font-mono">{fmt(totalAset)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Liabilitas & Ekuitas */}
          <div className="space-y-4">
            <h4 className="font-black uppercase tracking-wider text-stone-400 border-b border-stone-100 pb-2">
              PASIVA (LIABILITAS & MODAL)
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-600">Simpanan Pokok Anggota</span>
                <span className="font-mono font-bold text-stone-900">{fmt(simpokVal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-600">Simpanan Wajib Anggota</span>
                <span className="font-mono font-bold text-stone-900">{fmt(simwajibVal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-600">Simpanan Sukarela Anggota</span>
                <span className="font-mono font-bold text-stone-900">{fmt(simsukarelaVal)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-50">
                <span className="text-stone-600">Ekuitas Modal Awal</span>
                <span className="font-mono font-bold text-stone-900">{fmt(modalAwalVal)}</span>
              </div>
              <div className="pt-3 border-t border-dashed border-stone-250 flex justify-between font-black text-sm text-[#548C2F]">
                <span>TOTAL PASIVA</span>
                <span className="font-mono">{fmt(totalPasiva)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Laporan SHU */}
      <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm font-black text-[#548C2F] border-b border-stone-200 pb-3 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#F9A620]" />
          Laporan Hasil Usaha (SHU / Rugi Laba)
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex justify-between py-1 border-b border-stone-50">
            <span className="text-stone-600">Total Pendapatan Operasional (Kas Masuk)</span>
            <span className="font-mono font-extrabold text-[#3F6B24]">+{fmt(totalPendapatan)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-stone-50">
            <span className="text-stone-600">Total Beban Operasional (Kas Keluar)</span>
            <span className="font-mono font-extrabold text-red-750">-{fmt(totalBeban)}</span>
          </div>
          <div className="pt-3 flex justify-between font-black text-sm text-[#548C2F] pb-3 border-b border-stone-200">
            <span>SISA HASIL USAHA (SHU) BERJALAN</span>
            <span className="badge badge-gold uppercase">
              Menunggu Ketetapan RAT
            </span>
          </div>

          {/* Estimasi SHU Anggota */}
          <div className="mt-4 bg-stone-50 p-4 rounded-2xl space-y-2 border border-stone-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#548C2F]">Estimasi Porsi SHU Warga</span>
              <span className="font-mono font-black text-xs text-stone-800">
                {totalKoperasiPoints > 0 ? ((pointsBalance / totalKoperasiPoints) * 100).toFixed(2) : '0.00'}%
              </span>
            </div>
            <p className="text-[10px] text-stone-500 leading-normal font-medium">
              Porsi dihitung dari total partisipasi aktif Anda ({pointsBalance} PTS) dibagi total partisipasi seluruh anggota ({totalKoperasiPoints} PTS) dalam ekosistem Koperasi Desa Merah Putih.
            </p>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="font-medium text-stone-600">Estimasi Status SHU Diterima:</span>
              <span className="font-sans font-black text-xs text-[#3F6B24] uppercase">
                Menunggu Keputusan RAT
              </span>
            </div>
          </div>

          {/* Tombol Bagi SHU untuk Ketua */}
          {session.role === 'ketua' && sisaHasilUsaha > 0 && (
            <div className="mt-4 pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={handleDistributeShu}
                disabled={isPending}
                className="py-2.5 px-6 bg-[#F9A620] hover:bg-[#b07803] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow border border-[#E08E10]/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Coins className="w-4 h-4" />
                Bagikan SHU Digital Berbasis Poin
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}