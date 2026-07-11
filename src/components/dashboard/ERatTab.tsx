import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ERatTabProps {
  ratVotingAgendas: any[];
  myVotes: any[];
  voteAggregates: any[];
  selectedVotes: Record<string, string>;
  setSelectedVotes: (val: Record<string, string>) => void;
  handleCastVote: (agendaId: string) => void;
}

export default function ERatTab({
  ratVotingAgendas,
  myVotes,
  voteAggregates,
  selectedVotes,
  setSelectedVotes,
  handleCastVote
}: ERatTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
          Musyawarah Anggota e-RAT Digital
        </h3>

        <div className="space-y-6">
          {ratVotingAgendas.map((agenda) => {
            const hasVoted = myVotes.some(v => v.agenda_id === agenda.id);
            const userVote = myVotes.find(v => v.agenda_id === agenda.id);
            const aggs = voteAggregates.filter(a => a.agenda_id === agenda.id);
            const totalVotes = aggs.reduce((sum, item) => sum + Number(item.count), 0);

            return (
              <div key={agenda.id} className="p-5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4">
                
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] uppercase font-black text-stone-400 block tracking-wider">Agenda Musyawarah</span>
                    <h4 className="text-sm font-bold text-stone-850 dark:text-stone-200 mt-1 leading-snug">
                      {agenda.title}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    agenda.status === 'aktif' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-stone-200 text-stone-800'
                  }`}>
                    {agenda.status}
                  </span>
                </div>

                <p className="text-xs text-stone-500 leading-relaxed">
                  {agenda.description}
                </p>

                {totalVotes > 0 && (
                  <div className="p-4 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl space-y-3.5 shadow-sm">
                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider block">Hasil Pemungutan Suara ({totalVotes} Anggota):</span>
                    
                    <div className="space-y-2 text-xs">
                      {agenda.options.map((opt: string) => {
                        const optAgg = aggs.find(a => a.voted_option === opt);
                        const count = optAgg ? Number(optAgg.count) : 0;
                        const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

                        return (
                          <div key={opt} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                              <span>{opt}</span>
                              <span>{count} Suara ({percent}%)</span>
                            </div>
                            <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-[#548C2F] h-full rounded-full transition-all duration-500" 
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {hasVoted ? (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl flex items-center justify-between text-xs text-green-700">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Hak suara terverifikasi masuk
                    </span>
                    <span>Pilihan: <strong>{userVote?.voted_option}</strong></span>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-4">
                    <span className="text-xs font-bold text-stone-500 block">Tentukan Pilihan Anda:</span>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {agenda.options.map((opt: string) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            selectedVotes[agenda.id] === opt
                              ? 'bg-[#548C2F]/10 border-[#548C2F] text-[#548C2F] font-bold shadow-sm'
                              : 'bg-white dark:bg-[#1c1a17] border-stone-200 dark:border-stone-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`vote_${agenda.id}`}
                            value={opt}
                            checked={selectedVotes[agenda.id] === opt}
                            onChange={() => setSelectedVotes({ ...selectedVotes, [agenda.id]: opt })}
                            className="accent-[#548C2F]"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleCastVote(agenda.id)}
                        className="py-2 px-5 bg-[#548C2F] hover:bg-[#427223] text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow border border-[#F9A620]/20 transition-all cursor-pointer"
                      >
                        Kirim Pilihan Suara
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
