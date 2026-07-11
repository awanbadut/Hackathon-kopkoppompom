import React from 'react';
import { Sparkles, Coins, TrendingUp, CheckCircle2 } from 'lucide-react';

interface RewardsTabProps {
  pointsBalance: number;
  totalKoperasiPoints: number;
  missionsState: any;
  missionClaimPending: string | null;
  handleClaimMission: (code: string, pts: number) => void;
  vouchers: any[];
  userPoints: any;
  handleRedeemVoucher: (id: string) => void;
  myRedeemedVouchers: any[];
  isPending: boolean;
  fmt: (val: any) => string;
}

export default function RewardsTab({
  pointsBalance,
  totalKoperasiPoints,
  missionsState,
  missionClaimPending,
  handleClaimMission,
  vouchers,
  userPoints,
  handleRedeemVoucher,
  myRedeemedVouchers,
  isPending,
  fmt
}: RewardsTabProps) {
  return (
    <div className="space-y-6">

      {/* Misi Mingguan Anggota Koperasi Section */}
      <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-3">
          <div>
            <h3 className="text-sm font-black text-[#548C2F] dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#F9A620]" />
              Misi Mingguan Anggota Kopdes
            </h3>
            <p className="text-[10px] text-stone-500 mt-1 font-medium">
              Selesaikan misi mingguan koperasi di bawah ini untuk mendapatkan bonus poin belanja yang melimpah!
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-2 rounded-2xl flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#F9A620]" />
              <span className="text-xs font-black text-stone-800 dark:text-stone-200 font-mono">Poin Anda: {pointsBalance} PTS</span>
            </div>
            <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-2 rounded-2xl flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#548C2F] dark:text-[#F9A620]" />
              <span className="text-xs font-black text-stone-800 dark:text-stone-200 font-mono">Estimasi SHU: {totalKoperasiPoints > 0 ? ((pointsBalance / totalKoperasiPoints) * 100).toFixed(2) : '0.00'}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              code: 'misi1',
              title: 'Tabungan Sukarela Rutin',
              desc: 'Menabung simpanan sukarela koperasi desa minimal Rp10.000 minggu ini.',
              points: 15,
              progressText: `${fmt(missionsState.misi1?.progress || 0)} / ${fmt(missionsState.misi1?.target || 10000)}`,
              completed: missionsState.misi1?.completed,
              claimed: missionsState.misi1?.claimed,
            },
            {
              code: 'misi2',
              title: 'Hak Suara Demokrasi',
              desc: 'Ikut serta memberikan hak suara pada agenda voting e-RAT koperasi minggu ini.',
              points: 20,
              progressText: `${missionsState.misi2?.progress || 0} / ${missionsState.misi2?.target || 1} Vote`,
              completed: missionsState.misi2?.completed,
              claimed: missionsState.misi2?.claimed,
            },
            {
              code: 'misi3',
              title: 'Belanja Sembako Kopdes',
              desc: 'Berbelanja kebutuhan pangan harian di Gerai Toko Kopdes minimal Rp50.000 minggu ini.',
              points: 30,
              progressText: `${fmt(missionsState.misi3?.progress || 0)} / ${fmt(missionsState.misi3?.target || 50000)}`,
              completed: missionsState.misi3?.completed,
              claimed: missionsState.misi3?.claimed,
            },
            {
              code: 'misi4',
              title: 'Cerdas Literasi Koperasi',
              desc: 'Menyelesaikan minimal 1 modul kuis kelas literasi tata kelola koperasi minggu ini.',
              points: 10,
              progressText: `${missionsState.misi4?.progress || 0} / ${missionsState.misi4?.target || 1} Modul`,
              completed: missionsState.misi4?.completed,
              claimed: missionsState.misi4?.claimed,
            }
          ].map((misi) => (
            <div key={misi.code} className="p-4 border border-stone-205 dark:border-stone-850 rounded-2xl flex flex-col justify-between gap-4 bg-stone-50/50 dark:bg-stone-900/10">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="badge badge-gold">+{misi.points} PTS</span>
                  <span className="text-[10px] text-stone-400 font-mono font-bold">{misi.progressText}</span>
                </div>
                <h4 className="text-xs font-black text-stone-800 dark:text-white">{misi.title}</h4>
                <p className="text-[10px] text-stone-550 dark:text-stone-400 leading-relaxed font-medium">{misi.desc}</p>
              </div>

              <div className="pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <span className="text-[10px] font-bold">
                  {misi.claimed ? (
                    <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Poin Diklaim</span>
                  ) : misi.completed ? (
                    <span className="text-amber-600 font-black animate-pulse">Selesai • Siap Klaim</span>
                  ) : (
                    <span className="text-stone-400 font-semibold">Sedang berjalan</span>
                  )}
                </span>

                {misi.claimed ? (
                  <button
                    disabled
                    className="py-1 px-3 bg-stone-100 dark:bg-stone-800 text-stone-400 text-[10px] font-bold rounded-lg cursor-not-allowed"
                  >
                    Claimed
                  </button>
                ) : misi.completed ? (
                  <button
                    onClick={() => handleClaimMission(misi.code, misi.points)}
                    disabled={missionClaimPending === misi.code}
                    className="py-1.5 px-4 bg-[#548C2F] hover:bg-[#427223] text-white text-[10px] font-black uppercase tracking-wider border border-[#F9A620]/20 rounded-lg cursor-pointer transition-all shadow-sm"
                  >
                    {missionClaimPending === misi.code ? 'Klaim...' : 'Klaim Poin'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="py-1 px-3 bg-stone-100 dark:bg-stone-800 text-stone-400 text-[10px] font-bold rounded-lg cursor-not-allowed border border-stone-200 dark:border-stone-700"
                  >
                    Belum Selesai
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-2 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-3">
            Katalog Hadiah Belanja Koperasi (Gerai Kopdes)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vouchers.map((voucher) => {
              const points = userPoints?.total_points ? Number(userPoints.total_points) : 0;
              const canRedeem = points >= voucher.points_cost && voucher.stock > 0;

              return (
                <div key={voucher.id} className="p-4 border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col justify-between gap-4 bg-stone-50 dark:bg-stone-900">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-0.5 bg-[#F9A620] text-white rounded font-mono font-black text-xs shadow-inner">
                        {voucher.points_cost} PTS
                      </span>
                      <span className="text-[10px] text-stone-400 font-bold">Stok: {voucher.stock} Unit</span>
                    </div>
                    <h4 className="mt-3 text-xs font-black text-stone-800 dark:text-stone-200 leading-snug">
                      {voucher.title}
                    </h4>
                    <p className="text-[10px] text-stone-550 mt-1 leading-relaxed">
                      {voucher.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRedeemVoucher(voucher.id)}
                    disabled={!canRedeem || isPending}
                    className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
                      canRedeem 
                        ? 'bg-[#548C2F] hover:bg-[#427223] text-white border border-[#F9A620]/20 shadow' 
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                    }`}
                  >
                    Tukarkan Poin
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-1 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-3">
            Koleksi Voucher Belanja Anda ({myRedeemedVouchers.length})
          </h3>

          <div className="space-y-3.5">
            {myRedeemedVouchers.map((uv) => (
              <div key={uv.id} className="p-3 border border-dashed border-[#F9A620]/50 rounded-2xl bg-white dark:bg-stone-900 shadow-sm space-y-3">
                <div className="text-[10px] font-black text-stone-450 uppercase">{uv.title}</div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-stone-100 dark:bg-stone-850 border border-stone-200 rounded font-mono font-black text-[#F9A620] text-xs">
                    {uv.code}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                    Aktif
                  </span>
                </div>
                <p className="text-[9px] text-stone-450 mt-1 leading-normal italic">
                  Gunakan kode voucher di atas saat bertransaksi belanja di gerai fisik toko Koperasi Desa.
                </p>
              </div>
            ))}

            {myRedeemedVouchers.length === 0 && (
              <div className="text-center py-6 text-stone-400 font-bold text-xs">
                Belum ada penukaran voucher belanja.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
