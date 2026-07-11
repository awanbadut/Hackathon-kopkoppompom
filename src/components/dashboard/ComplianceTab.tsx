import React from 'react';
import { Sparkles } from 'lucide-react';

interface ComplianceTabProps {
  session: any;
  healthMetrics: any;
  riskLogs: any[];
  paginatedRiskLogs: any[];
  riskNote: Record<string, string>;
  setRiskNote: (val: Record<string, string>) => void;
  handleResolveRisk: (id: string) => void;
  evidenceUrls: Record<string, string>;
  setEvidenceUrls: (val: Record<string, string>) => void;
  handleUpdateEvidence: (txId: string, url: string) => void;
  handleDeleteTransaction: (txId: string) => void;
  riskPage: number;
  setRiskPage: (page: number | ((prev: number) => number)) => void;
  totalRiskPages: number;
  fmt: (val: any) => string;
  getHealthScoreColor: (score: number) => string;
  getRiskLevelBadge: (level: string) => React.ReactNode;
}

export default function ComplianceTab({
  session,
  healthMetrics,
  riskLogs,
  paginatedRiskLogs,
  riskNote,
  setRiskNote,
  handleResolveRisk,
  evidenceUrls,
  setEvidenceUrls,
  handleUpdateEvidence,
  handleDeleteTransaction,
  riskPage,
  setRiskPage,
  totalRiskPages,
  fmt,
  getHealthScoreColor,
  getRiskLevelBadge
}: ComplianceTabProps) {
 return (
 <div className="space-y-6">
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {/* 1. Kesehatan Kas Card */}
 <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm text-center space-y-4">
 <h3 className="text-xs font-black text-stone-500 uppercase tracking-wider">
 I. Kesehatan Kas
 </h3>
 <div className="py-2">
 <div className={`text-4xl font-black font-mono ${getHealthScoreColor(healthMetrics.kesehatan_kas)}`}>
 {healthMetrics.kesehatan_kas}%
 </div>
 <div className="mt-2 text-[10px] text-stone-500 leading-relaxed max-w-xs mx-auto">
 Mengukur kesehatan likuiditas, ketiadaan kas defisit, kelengkapan bukti nota belanja, & wajaran transaksi.
 </div>
 </div>
 {/* Progress Bar */}
 <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
 <div 
 className={`h-full rounded-full transition-all duration-500 ${
 healthMetrics.kesehatan_kas >= 80 ? 'bg-[#548C2F]' :
 healthMetrics.kesehatan_kas >= 50 ? 'bg-[#F9A620]' : 'bg-red-500'
 }`}
 style={{ width: `${healthMetrics.kesehatan_kas}%` }}
 />
 </div>
 </div>

 {/* 2. Kepatuhan Hukum Card */}
 <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm text-center space-y-4">
 <h3 className="text-xs font-black text-stone-500 uppercase tracking-wider">
 II. Kepatuhan Regulasi
 </h3>
 <div className="py-2">
 <div className={`text-4xl font-black font-mono ${getHealthScoreColor(healthMetrics.kepatuhan)}`}>
 {healthMetrics.kepatuhan}%
 </div>
 <div className="mt-2 text-[10px] text-stone-500 leading-relaxed max-w-xs mx-auto">
 Kepatuhan batas pagu, tenor pinjaman, peruntukan Dana Desa, verifikator ganda, & Rapat Anggota Tahunan (RAT).
 </div>
 </div>
 {/* Progress Bar */}
 <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
 <div 
 className={`h-full rounded-full transition-all duration-500 ${
 healthMetrics.kepatuhan >= 80 ? 'bg-[#548C2F]' :
 healthMetrics.kepatuhan >= 50 ? 'bg-[#F9A620]' : 'bg-red-500'
 }`}
 style={{ width: `${healthMetrics.kepatuhan}%` }}
 />
 </div>
 </div>

 {/* 3. Kesehatan Koperasi Card */}
 <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm text-center space-y-4 ring-2 ring-[#F9A620]/40 relative overflow-hidden">
 <div className="absolute right-0 top-0 w-16 h-16 bg-[#F9A620]/10 rounded-bl-full pointer-events-none" />
 <h3 className="text-xs font-black text-[#F9A620] uppercase tracking-wider flex items-center justify-center gap-1">
 <Sparkles className="w-3.5 h-3.5" />
 III. Kesehatan Koperasi
 </h3>
 <div className="py-2">
 <div className={`text-4xl font-black font-mono ${getHealthScoreColor(healthMetrics.kesehatan_koperasi)}`}>
 {healthMetrics.kesehatan_koperasi}%
 </div>
 <div className="mt-2 text-[10px] text-stone-500 leading-relaxed max-w-xs mx-auto">
 Indeks Komposit: 40% Kesehatan Kas + 40% Kepatuhan + 20% Partisipasi & Keaktifan Warga ({healthMetrics.partisipasi_anggota}%).
 </div>
 </div>
 {/* Progress Bar */}
 <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
 <div 
 className={`h-full rounded-full transition-all duration-500 ${
 healthMetrics.kesehatan_koperasi >= 80 ? 'bg-[#548C2F]' :
 healthMetrics.kesehatan_koperasi >= 50 ? 'bg-[#F9A620]' : 'bg-red-500'
 }`}
 style={{ width: `${healthMetrics.kesehatan_koperasi}%` }}
 />
 </div>
 </div>
 </div>

 <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
 <h3 className="text-sm font-black text-[#548C2F] border-b border-stone-200 pb-4 mb-4">
 Temuan Pelanggaran Regulasi Terdeteksi ({riskLogs.length})
 </h3>

 <div className="space-y-6">
 {paginatedRiskLogs.map((log) => {
 const tx = log.transaksi_keuangan;
 return (
 <div key={log.id} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3.5 animate-fade-in-up">
 <div className="flex justify-between items-start flex-wrap gap-2">
 <div>
 <span className="font-mono text-[9px] font-black text-[#B36F0C] bg-[#FFFBEA] border border-[#FFDD7A] px-2 py-0.5 rounded-full uppercase tracking-wider">
 {log.rule_code}
 </span>
 <h4 className="mt-3 text-xs font-extrabold text-stone-800 leading-relaxed">
 {log.message}
 </h4>
 </div>
 {getRiskLevelBadge(log.risk_level)}
 </div>

 <div className="text-xs text-stone-500 bg-white border border-stone-200 p-4 rounded-xl space-y-1">
 <div>
 <strong>Transaksi:</strong> {tx.description}
 </div>
 {session.role !== 'pendamping' && (
 <div>
 <strong>Nominal & Tanggal:</strong> <span className="font-mono font-bold text-stone-900">{fmt(tx.amount)}</span> &bull; {tx.transaction_date}
 </div>
 )}
 </div>

 {['pengurus', 'ketua'].includes(session.role) && (
    <div className="pt-3 border-t border-dashed border-stone-200 space-y-4">
      {/* Opsi 1: Perbarui Bukti Nota Fisik (Jika pelanggaran bukti nota) */}
      {log.rule_code === 'R01_NO_EVIDENCE' && (
        <div className="p-3 bg-[#F1F7EA] border border-[#C7DDAE] rounded-xl space-y-2">
          <span className="text-[10px] font-black text-[#3F6B24] uppercase tracking-wider block">
            Opsi A: Ambil Foto Nota (Kamera Langsung - Proteksi Galeri)
          </span>
          
          <input
            type="file"
            accept="image/*"
            capture="environment"
            id={`compliance-camera-${tx.id}`}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setEvidenceUrls({ ...evidenceUrls, [tx.id]: reader.result as string });
                };
                reader.readAsDataURL(file);
              }
            }}
          />

          {!evidenceUrls[tx.id] ? (
            <label
              htmlFor={`compliance-camera-${tx.id}`}
              className="flex items-center justify-center gap-2 p-4 border border-dashed border-[#548C2F]/50 hover:border-[#548C2F] bg-white hover:bg-stone-50 rounded-xl cursor-pointer text-xs transition-all text-center"
            >
              <span>📸</span>
              <span className="font-bold text-stone-750">Ambil Foto Nota Sekarang</span>
            </label>
          ) : (
            <div className="space-y-2">
              <div className="relative aspect-video max-w-xs overflow-hidden rounded-xl border border-stone-200 bg-stone-100 flex items-center justify-center mx-auto">
                <img
                  src={evidenceUrls[tx.id]}
                  alt="Preview Nota"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEvidenceUrls({ ...evidenceUrls, [tx.id]: '' })}
                  className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-750 text-[10px] font-black uppercase tracking-wider rounded-lg border border-stone-250 transition-all text-center"
                >
                  Ulangi Foto
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateEvidence(tx.id, evidenceUrls[tx.id])}
                  className="flex-1 py-2 px-3 bg-[#548C2F] hover:bg-[#427223] text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow border border-[#C7DDAE]/30 transition-all text-center"
                >
                  Kirim &amp; Re-Audit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Opsi 2: Resolusi Catatan (Untuk pelanggaran umum) */}
      <div className="p-3 bg-stone-100/50 border border-stone-200 rounded-xl space-y-2">
        <span className="text-[10px] font-black text-stone-550 uppercase tracking-wider block">
          Opsi {log.rule_code === 'R01_NO_EVIDENCE' ? 'B' : 'A'}: Selesaikan dengan Catatan Resolusi
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Masukkan catatan tindakan penyelesaian regulasi..."
            value={riskNote[log.id] || ''}
            onChange={(e) => setRiskNote({ ...riskNote, [log.id]: e.target.value })}
            className="flex-1 p-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none font-medium"
          />
          <button
            onClick={() => handleResolveRisk(log.id)}
            className="py-2 px-4 bg-[#548C2F] hover:bg-[#427223] text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow border border-[#F9A620]/20 cursor-pointer whitespace-nowrap"
          >
            Tandai Selesai
          </button>
        </div>
      </div>

      {/* Opsi 3: Batalkan & Hapus Transaksi Pelanggar */}
      {['draft', 'menunggu_approval', 'ditolak'].includes(tx.status) && (
        <div className="flex justify-between items-center bg-red-50/50 border border-red-150 p-3 rounded-xl">
          <div className="text-[10px] font-bold text-red-750">
            Opsi {log.rule_code === 'R01_NO_EVIDENCE' ? 'C' : 'B'}: Batalkan transaksi untuk menghapus pelanggaran
          </div>
          <button
            onClick={() => handleDeleteTransaction(tx.id)}
            className="py-1.5 px-3 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-red-200 cursor-pointer whitespace-nowrap"
          >
            Batalkan Transaksi
          </button>
        </div>
      )}
    </div>
 )}
 </div>
 );
 })}
 
 {totalRiskPages > 1 && (
 <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-4 text-xs">
 <span className="text-stone-400 font-semibold">
 Halaman {riskPage} dari {totalRiskPages || 1}
 </span>
 <div className="flex gap-1">
 <button
 onClick={() => setRiskPage(p => Math.max(1, p - 1))}
 disabled={riskPage === 1}
 className="py-1 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 font-bold disabled:opacity-40"
 >
 Sebelumnya
 </button>
 <button
 onClick={() => setRiskPage(p => Math.min(totalRiskPages, p + 1))}
 disabled={riskPage === totalRiskPages}
 className="py-1 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 font-bold disabled:opacity-40"
 >
 Selanjutnya
 </button>
 </div>
 </div>
 )}

 {riskLogs.length === 0 && (
 <div className="text-center py-8 text-stone-400 font-bold text-xs">
 Selamat! Tidak ada pelanggaran regulasi/kepatuhan terdeteksi saat ini.
 </div>
 )}
 </div>
 </div>
 </div>
 );
}
