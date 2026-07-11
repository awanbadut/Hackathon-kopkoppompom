import React from 'react';
import { X, Check } from 'lucide-react';

interface ApprovalsTabProps {
  session: any;
  pendingMembers: any[];
  handleVerifyMember: (id: string, decision: 'approve' | 'reject') => void;
  myApprovals: any[];
  approvalNote: Record<string, string>;
  setApprovalNote: (val: Record<string, string>) => void;
  handleDecideApproval: (id: string, decision: 'disetujui' | 'ditolak') => void;
  getRiskLevelBadge: (level: string) => React.ReactNode;
  fmt: (val: any) => string;
}

function enumLabel(value: unknown): string {
  return String(value ?? '').replaceAll('_', ' ');
}

export default function ApprovalsTab({
  session,
  pendingMembers,
  handleVerifyMember,
  myApprovals,
  approvalNote,
  setApprovalNote,
  handleDecideApproval,
  getRiskLevelBadge,
  fmt,
}: ApprovalsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
          Otorisasi Anggota Baru ({pendingMembers.length})
        </h3>

        <div className="space-y-3.5">
          {pendingMembers.map((member) => (
            <div
              key={member.id}
              className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl flex items-center justify-between gap-4"
            >
              <div>
                <div className="font-extrabold text-sm text-stone-850 dark:text-stone-200">
                  {member.full_name}
                </div>
                <div className="text-[11px] text-stone-400 mt-1 flex flex-wrap gap-x-3">
                  <span>NIK: {member.ktp_number || '-'}</span>
                  <span>No HP: {member.phone_number || '-'}</span>
                  <span>
                    Sebagai:{' '}
                    <strong className="uppercase text-[#F9A620]">
                      {member.role || '-'}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleVerifyMember(member.id, 'reject')}
                  className="p-2 bg-red-50 text-red-650 rounded-xl hover:bg-red-100 border border-red-200 transition-all cursor-pointer"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleVerifyMember(member.id, 'approve')}
                  className="p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 border border-green-200 transition-all cursor-pointer"
                  type="button"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {pendingMembers.length === 0 && (
            <p className="text-xs text-stone-400 text-center py-4">
              Tidak ada pengajuan keanggotaan baru.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
          Otorisasi Transaksi Keuangan ({myApprovals.filter((a) => a.status === 'menunggu').length})
        </h3>

        <div className="space-y-6">
          {myApprovals.map((app) => {
            const tx = app?.transaksi_keuangan ?? null;

            return (
              <div
                key={app.id}
                className="p-5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-dashed border-stone-200 dark:border-stone-800 pb-3">
                  <div>
                    <span className="text-[9px] uppercase font-black text-stone-400 block tracking-wider">
                      Identifikasi Transaksi
                    </span>
                    <span className="text-xs font-bold capitalize text-stone-800 dark:text-stone-200">
                      {enumLabel(tx?.type)} ({enumLabel(tx?.sumber_dana)})
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] uppercase font-black text-stone-400 block tracking-wider">
                      Nilai Dana
                    </span>
                    <span className="text-base font-extrabold text-[#548C2F] dark:text-white font-mono">
                      {fmt(tx?.amount)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-stone-550 block font-bold text-[11px] mb-0.5">
                      Rincian Belanja:
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 font-semibold">
                      {tx?.description || '-'}
                    </p>

                    {tx?.evidence_url && (
                      <a
                        href={tx.evidence_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-blue-650 hover:underline block font-bold"
                      >
                        [Buka Tautan Lampiran Bukti Fisik]
                      </a>
                    )}
                  </div>

                  <div>
                    <span className="text-stone-550 block font-bold text-[11px] mb-0.5">
                      Penilaian Risiko Scanner:
                    </span>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      {getRiskLevelBadge(tx?.risk_level)}
                      <span className="text-[10px] text-stone-400 font-semibold">
                        Tingkat Verifikator: {app.approval_level === 1 ? 'Pengurus' : 'Ketua'}
                      </span>
                    </div>
                  </div>
                </div>

                {app.status === 'menunggu' ? (
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Masukkan alasan pembatalan jika menolak, atau catatan otorisasi..."
                      value={approvalNote[app.id] || ''}
                      onChange={(e) =>
                        setApprovalNote({
                          ...approvalNote,
                          [app.id]: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl text-xs focus:outline-none"
                    />

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleDecideApproval(app.id, 'ditolak')}
                        className="py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1"
                        type="button"
                      >
                        <X className="w-3.5 h-3.5" /> Tolak
                      </button>

                      <button
                        onClick={() => handleDecideApproval(app.id, 'disetujui')}
                        className="py-2 px-4 bg-green-50 hover:bg-green-150 text-green-700 border border-green-200 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1"
                        type="button"
                      >
                        <Check className="w-3.5 h-3.5" /> Setujui
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-stone-400">Keputusan Anda:</span>
                    <span
                      className={`font-black uppercase ${
                        app.status === 'disetujui' ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {myApprovals.length === 0 && (
            <p className="text-xs text-stone-400 text-center py-4">
              Tidak ada transaksi yang menunggu otorisasi.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}