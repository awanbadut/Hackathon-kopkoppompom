import React from 'react';
import { Send } from 'lucide-react';

interface TransactionsTabProps {
  session: any;
  txFormError: string | null;
  txType: string;
  setTxType: (val: any) => void;
  txSumber: string;
  setTxSumber: (val: any) => void;
  txKategori: string;
  setTxKategori: (val: any) => void;
  txAmount: string;
  setTxAmount: (val: string) => void;
  txTenor: string;
  setTxTenor: (val: string) => void;
  txBunga: string;
  setTxBunga: (val: string) => void;
  txAnggotaRef: string;
  setTxAnggotaRef: (val: string) => void;
  txDescription: string;
  setTxDescription: (val: string) => void;
  txEvidence: string;
  setTxEvidence: (val: string) => void;
  txDate: string;
  setTxDate: (val: string) => void;
  handleCreateTransaction: (submitImmediately: boolean) => void;
  transactions: any[];
  paginatedTransactions: any[];
  txPage: number;
  setTxPage: (page: number | ((prev: number) => number)) => void;
  totalTxPages: number;
  handleSubmitDraft: (id: string) => void;
  memberSavings: any[];
  isPending: boolean;
  fmt: (val: any) => string;
  getRiskLevelBadge: (level: string) => React.ReactNode;
}

export default function TransactionsTab({
  session,
  txFormError,
  txType,
  setTxType,
  txSumber,
  setTxSumber,
  txKategori,
  setTxKategori,
  txAmount,
  setTxAmount,
  txTenor,
  setTxTenor,
  txBunga,
  setTxBunga,
  txAnggotaRef,
  setTxAnggotaRef,
  txDescription,
  setTxDescription,
  txEvidence,
  setTxEvidence,
  txDate,
  setTxDate,
  handleCreateTransaction,
  transactions,
  paginatedTransactions,
  txPage,
  setTxPage,
  totalTxPages,
  handleSubmitDraft,
  memberSavings,
  isPending,
  fmt,
  getRiskLevelBadge
}: TransactionsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div className="lg:col-span-1 bg-white border border-stone-200 p-6 rounded-3xl shadow-sm self-start space-y-4">
        <h3 className="text-sm font-black text-[#548C2F] border-b border-stone-200 pb-3">
          Catat Transaksi Buku Kas
        </h3>

        {txFormError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-750 text-[11px] font-semibold">
            {txFormError}
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-500 mb-1">Tipe Transaksi</label>
            <select
              value={txType}
              onChange={(e) => setTxType(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
            >
              <option value="pemasukan">Pemasukan Kas Umum</option>
              <option value="pengeluaran">Pengeluaran Kas Umum</option>
              <option value="simpanan_pokok">Simpanan Pokok Anggota</option>
              <option value="simpanan_wajib">Simpanan Wajib Anggota</option>
              <option value="simpanan_sukarela">Simpanan Sukarela Anggota</option>
              <option value="pinjaman">Pemberian Pinjaman</option>
              <option value="bagi_hasil">Pembagian SHU / Bagi Hasil</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-500 mb-1">Sumber Dana</label>
              <select
                value={txSumber}
                onChange={(e) => setTxSumber(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
              >
                <option value="non_dana_desa">Non Dana Desa</option>
                <option value="dana_desa">Dana Desa</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-500 mb-1">Kategori</label>
              <select
                value={txKategori}
                onChange={(e) => setTxKategori(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
              >
                <option value="operasional">Operasional</option>
                <option value="pembangunan_fisik">Pembangunan Fisik</option>
                <option value="distribusi_pangan">Distribusi Pangan</option>
                <option value="simpanan_anggota">Simpanan Anggota</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-500 mb-1">Nominal Transaksi (Rp)</label>
            <input
              type="number"
              placeholder="Contoh: 1500000"
              value={txAmount}
              onChange={(e) => setTxAmount(e.target.value)}
              className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none font-mono"
            />
          </div>

          {txType === 'pinjaman' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl">
              <div>
                <label className="block font-bold text-stone-500 mb-1">Tenor (Bulan)</label>
                <input
                  type="number"
                  placeholder="Maks 72"
                  value={txTenor}
                  onChange={(e) => setTxTenor(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg focus:outline-none text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-500 mb-1">Bunga (% flat)</label>
                <input
                  type="text"
                  value={txBunga}
                  onChange={(e) => setTxBunga(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg focus:outline-none text-xs font-mono"
                />
              </div>
            </div>
          )}

          {([
            'simpanan_pokok',
            'simpanan_wajib',
            'simpanan_sukarela',
            'pinjaman'
          ].includes(txType) || (txType === 'pengeluaran' && txKategori === 'simpanan_anggota')) && (
            <div>
              <label className="block font-bold text-stone-500 mb-1">Referensi Anggota</label>
              <input
                type="text"
                placeholder="Contoh: MBR-001"
                value={txAnggotaRef}
                onChange={(e) => setTxAnggotaRef(e.target.value)}
                className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
              />
              {/* Real-time Voluntary Savings Balance Check */}
              {txType === 'pengeluaran' && txKategori === 'simpanan_anggota' && txAnggotaRef && (() => {
                const m = memberSavings.find(member => member.anggota_ref === txAnggotaRef);
                if (m) {
                  const isOver = txAmount && Number(txAmount) > Number(m.simpanan_sukarela);
                  return (
                    <div className="mt-1 text-[11px] font-bold">
                      <span className="text-[#3F6B24]">
                        Saldo Sukarela: Rp {Number(m.simpanan_sukarela).toLocaleString('id-ID')}
                      </span>
                      {isOver && (
                        <span className="text-red-650 block mt-0.5 animate-pulse">
                          ⚠ Penarikan melebihi saldo sukarela anggota!
                        </span>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div className="mt-1 text-[11px] font-bold text-stone-400">
                      Anggota tidak ditemukan. Pastikan ref MBR-XXX valid.
                    </div>
                  );
                }
              })()}
            </div>
          )}

          <div>
            <label className="block font-bold text-stone-500 mb-1">Keterangan Transaksi</label>
            <textarea
              placeholder="Masukkan detail peruntukan dana belanja..."
              value={txDescription}
              onChange={(e) => setTxDescription(e.target.value)}
              className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none h-16 resize-none"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-500 mb-1">Bukti Fisik Transaksi (Foto Nota/Kuitansi)</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              id="tx-camera-capture"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64 = reader.result as string;
                    const img = new Image();
                    img.src = base64;
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      const maxDim = 800;
                      let w = img.width;
                      let h = img.height;
                      if (w > h && w > maxDim) {
                        h = Math.round((h * maxDim) / w);
                        w = maxDim;
                      } else if (h > maxDim) {
                        w = Math.round((w * maxDim) / h);
                        h = maxDim;
                      }
                      canvas.width = w;
                      canvas.height = h;
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.drawImage(img, 0, 0, w, h);
                        setTxEvidence(canvas.toDataURL('image/jpeg', 0.7));
                      } else {
                        setTxEvidence(base64);
                      }
                    };
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            
            {!txEvidence ? (
              <label
                htmlFor="tx-camera-capture"
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 hover:border-[#548C2F] bg-stone-50 hover:bg-[#F1F7EA]/20 rounded-2xl cursor-pointer transition-all gap-2 text-center"
              >
                <span className="text-xl">📸</span>
                <span className="text-[11px] font-black text-stone-700">Ambil Foto Nota Langsung</span>
                <span className="text-[9px] font-bold text-stone-400 leading-tight max-w-[200px]">
                  Kamera akan terbuka otomatis. Proteksi sistem: tidak diizinkan unggah foto dari galeri/folder untuk mencegah manipulasi data.
                </span>
              </label>
            ) : (
              <div className="p-3 bg-[#F1F7EA] border border-[#C7DDAE] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#3F6B24] uppercase tracking-wider flex items-center gap-1">
                    ✅ Foto Nota Berhasil Diambil (Live Camera)
                  </span>
                  <button
                    type="button"
                    onClick={() => setTxEvidence('')}
                    className="text-[10px] text-red-650 font-extrabold hover:underline"
                  >
                    Hapus Foto
                  </button>
                </div>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-100 flex items-center justify-center">
                  <img
                    src={txEvidence}
                    alt="Preview Bukti Nota"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-stone-500 mb-1">Tanggal Transaksi</label>
            <input
              type="date"
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
              className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleCreateTransaction(false)}
              disabled={isPending}
              className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-700 font-bold border border-stone-200 transition-all cursor-pointer text-center text-[10px] uppercase tracking-wider"
            >
              Draft
            </button>
            <button
              onClick={() => handleCreateTransaction(true)}
              disabled={isPending}
              className="flex-1 py-2.5 px-3 bg-[#548C2F] hover:bg-[#427223] text-white rounded-xl font-bold shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider border border-[#F9A620]/30"
            >
              <Send className="w-3.5 h-3.5" />
              Ajukan
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
          <h3 className="text-sm font-black text-[#548C2F] border-b border-stone-200 pb-4 mb-4">
            Buku Kas Ledger Transaksi ({transactions.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase tracking-wider font-extrabold text-[10px]">
                  <th className="py-2.5">Tanggal</th>
                  <th>Tipe / Kategori</th>
                  <th>Keterangan</th>
                  <th>Nominal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-stone-100 group">
                    <td className="py-3.5 font-mono text-stone-500">{t.transaction_date}</td>
                    <td>
                      <div className="font-bold capitalize">{t.type.replace('_', ' ')}</div>
                      <div className="text-[9px] font-black text-[#F9A620] uppercase mt-0.5">
                        {t.sumber_dana.replace('_', ' ')} &bull; {t.kategori.replace('_', ' ')}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-stone-800">{t.description}</div>
                      <div className="text-[10px] text-stone-400 mt-1 flex items-center gap-2">
                        <span>Oleh: {t.app_users?.full_name}</span>
                        {t.evidence_url && (
                          <a
                            href={t.evidence_url}
                            target="_blank"
                            className="text-blue-650 hover:underline font-bold"
                          >
                            [Bukti Nota]
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="font-mono font-black text-[#548C2F]">{fmt(t.amount)}</td>
                    <td>
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                          t.status === 'disetujui'
                            ? 'bg-[#F1F7EA] text-[#3F6B24] border-[#C7DDAE]'
                            : t.status === 'ditolak'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : t.status === 'menunggu_approval'
                            ? 'bg-[#FFFBEA] text-[#B36F0C] border-[#FFE79A]'
                            : 'bg-stone-50 text-stone-600 border-stone-200'
                        }`}>
                          {t.status === 'menunggu_approval' ? 'Menunggu' : t.status}
                        </span>
                        {getRiskLevelBadge(t.risk_level)}
                      </div>
                    </td>
                    <td>
                      {t.status === 'draft' && (
                        <button
                          onClick={() => handleSubmitDraft(t.id)}
                          className="py-1 px-3 bg-[#548C2F] hover:bg-[#427223] text-white text-[9px] font-black rounded-lg uppercase border border-[#F9A620]/20 transition-all cursor-pointer"
                        >
                          Kirim
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalTxPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-4 text-xs">
              <span className="text-stone-400 font-semibold">
                Halaman {txPage} dari {totalTxPages || 1}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setTxPage(p => Math.max(1, p - 1))}
                  disabled={txPage === 1}
                  className="py-1 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 font-bold disabled:opacity-40"
                >
                  Sebelumnya
                </button>
                <button
                  onClick={() => setTxPage(p => Math.min(totalTxPages, p + 1))}
                  disabled={txPage >= totalTxPages}
                  className="py-1 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 font-bold disabled:opacity-40"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
