import React from 'react';
import { Award, CheckCircle2, Clock } from 'lucide-react';

interface LearningTabProps {
  pointsBalance: number;
  modules: any[];
  userProgress: any[];
  handleStartLesson: (module: any) => void;
}

export default function LearningTab({
  pointsBalance,
  modules,
  userProgress,
  handleStartLesson
}: LearningTabProps) {
  return (
    <div className="space-y-6">
      
      <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#548C2F]/10 rounded-2xl text-[#548C2F]">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#548C2F] dark:text-white">
              Peringkat Anggota: <span className="text-[#F9A620] uppercase">
                {pointsBalance >= 150 ? 'Ahli Perkoperasian' : 
                 pointsBalance >= 50 ? 'Cakap Koperasi' : 'Pemula'}
              </span>
            </h3>
            <p className="mt-1 text-xs text-stone-450 leading-relaxed">
              Perdalam pengetahuan tata kelola dana desa dengan menjawab kuis untuk mendapatkan poin insentif belanja.
            </p>
          </div>
        </div>

        <div className="text-center sm:text-right bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-6 py-3.5 rounded-2xl min-w-[130px]">
          <span className="text-[10px] font-black text-stone-450 block uppercase tracking-wider">Tabungan Poin</span>
          <span className="text-2xl font-black text-[#548C2F] dark:text-white font-mono">{pointsBalance} PTS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {modules.map((mod) => {
          const progress = userProgress.find(p => p.module_id === mod.id);
          const isCompleted = progress?.status === 'selesai';
          const isStarted = progress?.status === 'sedang_berjalan';

          return (
            <div key={mod.id} className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] uppercase font-black tracking-wider bg-[#548C2F]/10 px-2.5 py-0.5 rounded-full text-[#548C2F]">
                    {mod.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono font-black text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
                    +{mod.points_reward} PTS
                  </span>
                </div>
                <h4 className="mt-3.5 text-sm font-black text-stone-800 dark:text-stone-200 leading-snug">
                  {mod.title}
                </h4>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-900 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold">
                  {isCompleted ? (
                    <span className="text-[#15803d] flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Lulus</span>
                  ) : isStarted ? (
                    <span className="text-[#b45309] flex items-center gap-1"><Clock className="w-4 h-4 animate-spin" /> Mengikuti</span>
                  ) : (
                    <span className="text-stone-400">Belum dipelajari</span>
                  )}
                </span>
                
                <button
                  onClick={() => handleStartLesson(mod)}
                  className="py-1.5 px-4 bg-[#548C2F] hover:bg-[#427223] text-white rounded-xl font-bold text-xs border border-[#F9A620]/20 transition-all cursor-pointer"
                >
                  {isCompleted ? 'Pelajari Ulang' : isStarted ? 'Lanjutkan' : 'Mulai Belajar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
