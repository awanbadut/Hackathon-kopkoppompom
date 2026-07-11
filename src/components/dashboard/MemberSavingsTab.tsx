import React from 'react';
import { Coins, Search } from 'lucide-react';

interface MemberSavingsTabProps {
  session: any;
  memberSavings: any[];
  savingsSearch: string;
  setSavingsSearch: (val: string) => void;
  setTxType: (val: any) => void;
  setTxKategori: (val: any) => void;
  setTxAnggotaRef: (val: string) => void;
  setTxDescription: (val: string) => void;
  handleTabChange: (tab: string) => void;
  transactions: any[];
  fmt: (val: any) => string;
}

export default function MemberSavingsTab({
  session,
  memberSavings,
  savingsSearch,
  setSavingsSearch,
  setTxType,
  setTxKategori,
  setTxAnggotaRef,
  setTxDescription,
  handleTabChange,
  transactions,
  fmt
}: MemberSavingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-black tracking-tight text-[#548C2F] flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#F9A620]" />
            {['pengurus', 'ketua'].includes(session.role) ? 'Buku Simpanan Warga Koperasi' : 'Buku Simpanan Anggota Anda'}
          </h3>
          <p className="mt-1 text-xs text-stone-500 leading-normal max-w-xl">
            {['pengurus', 'ketua'].includes(session.role) 
              ? 'Kelola saldo simpanan pokok, wajib, dan sukarela per anggota secara terperinci. Gunakan fitur ini untuk melihat saldo masing-masing anggota and melakukan penyetoran atau penarikan.'
              : 'Berikut adalah rincian saldo simpanan Anda di Koperasi Desa Merah Putih. Simpanan pokok & wajib bersifat permanen, sedangkan simpanan sukarela dapat ditarik sewaktu-waktu.'}
          </p>
        </div>
      </div>

      {/* View for managers (List of all members and balances) */}
      {['pengurus', 'ketua'].includes(session.role) && (
        <div className="space-y-6">
          {/* Search and Quick Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-stone-200 p-4 rounded-2xl shadow-sm">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-stone-400" />
              </span>
              <input
                type="text"
                placeholder="Cari anggota atau NIK..."
                value={savingsSearch}
                onChange={(e) => setSavingsSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="text-xs font-bold text-stone-500">
              Menampilkan {memberSavings.filter(m => m.nama.toLowerCase().includes(savingsSearch.toLowerCase()) || m.nik.includes(savingsSearch)).length} Anggota
            </div>
          </div>

          {/* Members Savings Table */}
          <div className="bg-white border border-stone-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Nama Anggota</th>
                    <th>NIK / Kontak</th>
                    <th>Simpanan Pokok</th>
                    <th>Simpanan Wajib</th>
                    <th>Simpanan Sukarela</th>
                    <th>Total Saldo</th>
                    <th className="text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {memberSavings
                    .filter(m => m.nama.toLowerCase().includes(savingsSearch.toLowerCase()) || m.nik.includes(savingsSearch))
                    .map((member) => (
                      <tr key={member.anggota_ref}>
                        <td>
                          <div className="font-extrabold text-stone-900">{member.nama}</div>
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5">{member.anggota_ref}</div>
                        </td>
                        <td className="text-xs font-semibold">
                          <div className="font-mono text-stone-600">{member.nik}</div>
                          <div className="text-[10px] text-stone-450 mt-0.5">{member.phone_number}</div>
                        </td>
                        <td className="font-bold text-stone-800">{fmt(member.simpanan_pokok)}</td>
                        <td className="font-bold text-stone-800">{fmt(member.simpanan_wajib)}</td>
                        <td className="font-bold text-emerald-700">{fmt(member.simpanan_sukarela)}</td>
                        <td className="font-extrabold text-[#104911]">{fmt(member.total_simpanan)}</td>
                        <td className="text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setTxType('simpanan_sukarela');
                                setTxKategori('simpanan_anggota');
                                setTxAnggotaRef(member.anggota_ref);
                                setTxDescription(`Setoran Simpanan Sukarela - ${member.nama}`);
                                handleTabChange('transactions');
                              }}
                              className="py-1 px-2.5 bg-[#548C2F] hover:bg-[#427223] text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                            >
                              Setor
                            </button>
                            <button
                              onClick={() => {
                                setTxType('pengeluaran');
                                setTxKategori('simpanan_anggota');
                                setTxAnggotaRef(member.anggota_ref);
                                setTxDescription(`Penarikan Simpanan Sukarela - ${member.nama}`);
                                handleTabChange('transactions');
                              }}
                              className="py-1 px-2.5 bg-red-650 hover:bg-red-750 text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                            >
                              Tarik
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {memberSavings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-stone-400 font-bold">
                        Tidak ada data anggota koperasi ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View for ordinary members (Personal balances) */}
      {session.role === 'anggota' && (
        <div className="space-y-6">
          {/* Personal Balances Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Simpanan Pokok</span>
              <span className="text-2xl font-black text-stone-800 block mt-2">
                {fmt(memberSavings[0]?.simpanan_pokok ?? 0)}
              </span>
              <span className="text-[10px] text-stone-450 block mt-1">Dibayar sekali saat awal pendaftaran</span>
            </div>

            <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Simpanan Wajib</span>
              <span className="text-2xl font-black text-stone-800 block mt-2">
                {fmt(memberSavings[0]?.simpanan_wajib ?? 0)}
              </span>
              <span className="text-[10px] text-stone-450 block mt-1">Simpanan rutin berkala anggota</span>
            </div>

            <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Simpanan Sukarela</span>
              <span className="text-2xl font-black text-emerald-750 block mt-2">
                {fmt(memberSavings[0]?.simpanan_sukarela ?? 0)}
              </span>
              <span className="text-[10px] text-stone-450 block mt-1">Dapat disetor & ditarik sewaktu-waktu</span>
            </div>

            <div className="bg-[#104911] text-white border border-[#F9A620]/30 p-6 rounded-3xl shadow-md">
              <span className="text-[10px] font-black text-emerald-200 uppercase tracking-wider block">Total Saldo Simpanan</span>
              <span className="text-2xl font-black text-[#FFD449] block mt-2">
                {fmt(memberSavings[0]?.total_simpanan ?? 0)}
              </span>
              <span className="text-[10px] text-emerald-100/70 block mt-1">Total aset simpanan Anda di koperasi</span>
            </div>
          </div>

          {/* Personal recent transaction history */}
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-4">Riwayat Mutasi Simpanan Anda</h3>
            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Jenis Transaksi</th>
                    <th>Keterangan</th>
                    <th>Jumlah</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .filter(t => t.anggota_ref === memberSavings[0]?.anggota_ref && ['simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela', 'pengeluaran'].includes(t.type))
                    .map((t) => (
                      <tr key={t.id}>
                        <td className="text-stone-400 font-semibold">{new Date(t.created_at).toLocaleDateString('id-ID')}</td>
                        <td className="font-bold uppercase text-[10px] tracking-wider text-stone-600">
                          {t.type === 'pengeluaran' ? 'Penarikan Sukarela' : t.type.replace('simpanan_', 'Simpanan ')}
                        </td>
                        <td className="font-semibold text-stone-700">{t.description}</td>
                        <td className={`font-bold ${t.type === 'pengeluaran' ? 'text-red-650' : 'text-emerald-700'}`}>
                          {t.type === 'pengeluaran' ? '-' : '+'}{fmt(t.amount)}
                        </td>
                        <td>
                          <span className={`badge ${t.status === 'disetujui' ? 'badge-success' : t.status === 'ditolak' ? 'badge-danger' : 'badge-gold'}`}>
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {transactions.filter(t => t.anggota_ref === memberSavings[0]?.anggota_ref && ['simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela', 'pengeluaran'].includes(t.type)).length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-stone-400 font-bold">
                        Belum ada riwayat transaksi simpanan aktif.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
