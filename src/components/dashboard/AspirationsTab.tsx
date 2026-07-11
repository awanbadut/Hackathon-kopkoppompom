import React from 'react';
import { Plus, Vote, ThumbsUp, MessageCircle } from 'lucide-react';

interface AspirationsTabProps {
  session: any;
  filteredAspirations: any[];
  paginatedAspirations: any[];
  aspFilter: string;
  setAspFilter: (val: string) => void;
  aspTitle: string;
  setAspTitle: (val: string) => void;
  aspDesc: string;
  setAspDesc: (val: string) => void;
  myUpvotes: any[];
  aspResponse: Record<string, string>;
  setAspResponse: (val: Record<string, string>) => void;
  handleCreateAspiration: (e: React.FormEvent) => void;
  handleUpvoteAspiration: (id: string) => void;
  handleRespondAspiration: (id: string) => void;
  handlePromoteAspiration: (id: string) => void;
  isPending: boolean;
  aspPage: number;
  setAspPage: (page: number | ((prev: number) => number)) => void;
  totalAspPages: number;
}

export default function AspirationsTab({
  session,
  filteredAspirations,
  paginatedAspirations,
  aspFilter,
  setAspFilter,
  aspTitle,
  setAspTitle,
  aspDesc,
  setAspDesc,
  myUpvotes,
  aspResponse,
  setAspResponse,
  handleCreateAspiration,
  handleUpvoteAspiration,
  handleRespondAspiration,
  handlePromoteAspiration,
  isPending,
  aspPage,
  setAspPage,
  totalAspPages
}: AspirationsTabProps) {
  return (
    <div className="space-y-6">
      
      {session.role === 'anggota' && (
        <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#F9A620]" /> Sampaikan Aspirasi &amp; Program Desa
          </h3>

          <form onSubmit={handleCreateAspiration} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block font-bold text-stone-500 mb-1">Judul Usulan Program</label>
                <input
                  type="text"
                  placeholder="Contoh: Pengadaan Mesin Pengering Padi Kelompok Tani"
                  value={aspTitle}
                  onChange={(e) => setAspTitle(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-stone-500 mb-1">Penjelasan Detail &amp; Latar Belakang</label>
                <textarea
                  placeholder="Jelaskan kebutuhan warga, perkiraan lokasi, dan urgensi fisik program..."
                  value={aspDesc}
                  onChange={(e) => setAspDesc(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none h-20 resize-none"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="py-2.5 px-6 bg-[#548C2F] hover:bg-[#427223] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow border border-[#F9A620]/25 transition-all cursor-pointer"
              >
                Kirim Usulan Warga
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed Aspirasi */}
      <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
          <h3 className="text-sm font-black text-[#548C2F] dark:text-white">
            Usulan & Aspirasi Pembangunan Desa ({filteredAspirations.length})
          </h3>

          <div className="flex bg-stone-100 dark:bg-stone-900 p-1 rounded-xl text-[10px] font-bold border border-stone-200 dark:border-stone-800">
            <button
              onClick={() => setAspFilter('semua')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                aspFilter === 'semua' ? 'bg-white dark:bg-[#1c1a17] text-stone-900 dark:text-white shadow-sm' : 'text-stone-500'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setAspFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                aspFilter === 'pending' ? 'bg-white dark:bg-[#1c1a17] text-stone-900 dark:text-white shadow-sm' : 'text-stone-500'
              }`}
            >
              Belum Respon
            </button>
            <button
              onClick={() => setAspFilter('responded')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                aspFilter === 'responded' ? 'bg-white dark:bg-[#1c1a17] text-stone-900 dark:text-white shadow-sm' : 'text-stone-500'
              }`}
            >
              Direspon
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {paginatedAspirations.map((asp) => {
            const hasUpvoted = myUpvotes.some(up => up.aspiration_id === asp.id);
            return (
              <div key={asp.id} className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4 animate-fade-in-up">
                
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-stone-850 dark:text-stone-200">{asp.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                        asp.status === 'ditanggapi' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {asp.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-455 mt-1.5 block">
                      Pengusul: <strong className="text-stone-700 dark:text-stone-300">{asp.user_name}</strong> &bull; {new Date(asp.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <div className="flex gap-2 items-center flex-wrap">
                    {['pengurus', 'ketua'].includes(session.role) && !asp.admin_response && (
                      <button
                        onClick={() => handlePromoteAspiration(asp.id)}
                        className="px-2.5 py-1.5 bg-[#F9A620]/10 hover:bg-[#F9A620] hover:text-white text-[#F9A620] border border-[#F9A620]/20 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Vote className="w-3.5 h-3.5" />
                        Jadikan Agenda e-RAT
                      </button>
                    )}

                    <button
                      onClick={() => handleUpvoteAspiration(asp.id)}
                      disabled={hasUpvoted}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        hasUpvoted 
                          ? 'bg-blue-50 text-blue-650 border-blue-200' 
                          : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-600'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{asp.upvotes_count} Dukungan</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-semibold">
                  {asp.description}
                </p>

                {asp.admin_response ? (
                  <div className="p-4 bg-[#548C2F]/5 dark:bg-[#548C2F]/15 border border-[#548C2F]/15 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#548C2F] dark:text-[#22c55e] font-black uppercase tracking-wide">
                      <MessageCircle className="w-4 h-4" />
                      Tanggapan Resmi Koperasi Desa:
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-normal font-medium italic">
                      "{asp.admin_response}"
                    </p>
                  </div>
                ) : (
                  ['pengurus', 'ketua'].includes(session.role) && (
                    <div className="pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 space-y-3">
                      <textarea
                        placeholder="Masukkan tanggapan resmi dari pihak koperasi desa..."
                        value={aspResponse[asp.id] || ''}
                        onChange={(e) => setAspResponse({ ...aspResponse, [asp.id]: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl text-xs focus:outline-none h-16 resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleRespondAspiration(asp.id)}
                          className="py-1.5 px-4 bg-[#548C2F] hover:bg-[#427223] text-white text-[11px] font-black uppercase tracking-wider border border-[#F9A620]/20 rounded-xl transition-all cursor-pointer"
                        >
                          Tanggapi Usulan
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        {totalAspPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-900 mt-4 text-xs">
            <span className="text-stone-400 font-semibold">
              Halaman {aspPage} dari {totalAspPages || 1}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setAspPage(p => Math.max(1, p - 1))}
                disabled={aspPage === 1}
                className="py-1 px-3 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 font-bold disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setAspPage(p => Math.min(totalAspPages, p + 1))}
                disabled={aspPage === totalAspPages}
                className="py-1 px-3 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 font-bold disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}

        {filteredAspirations.length === 0 && (
          <p className="text-xs text-stone-400 text-center py-4">Belum ada usulan warga.</p>
        )}
      </div>
    </div>
  );
}
