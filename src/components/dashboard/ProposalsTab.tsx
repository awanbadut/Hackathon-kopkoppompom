import React from 'react';
import { Briefcase } from 'lucide-react';

interface ProposalsTabProps {
  session: any;
  proposalPj: string;
  setProposalPj: (val: string) => void;
  proposalPhone: string;
  setProposalPhone: (val: string) => void;
  proposalNominal: string;
  setProposalNominal: (val: string) => void;
  proposalTenor: string;
  setProposalTenor: (val: string) => void;
  proposalTujuan: string;
  setProposalTujuan: (val: string) => void;
  handleSubmitProposal: (e: React.FormEvent) => void;
  proposalPending: boolean;
  proposalsList: any[];
  fmt: (val: any) => string;
}

export default function ProposalsTab({
  session,
  proposalPj,
  setProposalPj,
  proposalPhone,
  setProposalPhone,
  proposalNominal,
  setProposalNominal,
  proposalTenor,
  setProposalTenor,
  proposalTujuan,
  setProposalTujuan,
  handleSubmitProposal,
  proposalPending,
  proposalsList,
  fmt
}: ProposalsTabProps) {
  return (
    <div className="space-y-6 animate-scale-in">
      
      {/* Form pengajuan */}
      <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
        <h3 className="text-sm font-black text-[#548C2F] mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#F9A620]" />
          Pengajuan Pembiayaan & Kemitraan Kopdes (SIMKOPDES Portal)
        </h3>
        <p className="text-[11px] text-stone-500 mb-6 font-medium">
          Salurkan proposal program pembiayaan, perluasan gerai, atau usaha agribisnis koperasi secara langsung ke Portal Pembiayaan Kementerian Koperasi RI.
        </p>

        <form onSubmit={handleSubmitProposal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 text-xs">
            <div>
              <label className="label">Nama Penanggung Jawab Kopdes</label>
              <input
                type="text"
                value={proposalPj}
                onChange={(e) => setProposalPj(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Nomor WhatsApp Penanggung Jawab</label>
              <input
                type="text"
                value={proposalPhone}
                onChange={(e) => setProposalPhone(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Nominal Permohonan (Rupiah)</label>
              <input
                type="number"
                placeholder="Contoh: 150000000"
                value={proposalNominal}
                onChange={(e) => setProposalNominal(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Tenor Pengembalian (Bulan)</label>
              <select
                value={proposalTenor}
                onChange={(e) => setProposalTenor(e.target.value)}
                className="select-field"
              >
                <option value="12">12 Bulan (1 Tahun)</option>
                <option value="24">24 Bulan (2 Tahun)</option>
                <option value="36">36 Bulan (3 Tahun)</option>
                <option value="48">48 Bulan (4 Tahun)</option>
                <option value="60">60 Bulan (5 Tahun)</option>
                <option value="72">72 Bulan (6 Tahun - Batas PMK)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between text-xs">
            <div>
              <label className="label">Tujuan & Rencana Penggunaan Dana</label>
              <textarea
                rows={6}
                placeholder="Jelaskan secara rinci rencana alokasi dana (misal: perluasan kapasitas gudang lumbung padi Kopdes Desa Merah Putih untuk menampung panen petani)..."
                value={proposalTujuan}
                onChange={(e) => setProposalTujuan(e.target.value)}
                className="input-field resize-none h-[184px]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={proposalPending}
              className="w-full py-3.5 px-6 bg-[#548C2F] hover:bg-[#427223] text-white rounded-xl text-xs font-black uppercase tracking-wider border border-[#F9A620]/20 transition-all cursor-pointer disabled:opacity-40"
            >
              {proposalPending ? 'Mengirim Proposal...' : 'Kirim Permohonan ke Kemenkop'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel history pengajuan */}
      <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
        <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-4">Daftar Pengajuan Pembiayaan Kopdes</h3>
        <div className="overflow-x-auto rounded-xl border border-stone-200">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Ref Code</th>
                <th>Penanggung Jawab</th>
                <th>Nominal Permohonan</th>
                <th>Tenor</th>
                <th>Tujuan Permohonan</th>
                <th>Tanggal Pengajuan</th>
                <th>Status Review</th>
              </tr>
            </thead>
            <tbody>
              {proposalsList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-stone-400 font-medium">
                    Belum ada riwayat pengajuan pembiayaan aktif.
                  </td>
                </tr>
              ) : (
                proposalsList.map((prop) => (
                  <tr key={prop.pengajuan_pembiayaan_ref}>
                    <td className="font-mono font-bold text-[#F9A620]">{prop.pengajuan_pembiayaan_ref}</td>
                    <td className="font-bold">{prop.penanggung_jawab}</td>
                    <td className="font-bold text-[#548C2F]">{fmt(prop.nominal_permohonan)}</td>
                    <td className="font-medium">{prop.tenor} Bulan</td>
                    <td className="max-w-[200px] truncate text-stone-500 font-medium" title={prop.tujuan_permohonan}>
                      {prop.tujuan_permohonan}
                    </td>
                    <td className="text-stone-400 font-semibold">{new Date(prop.dibuat_pada).toLocaleDateString('id-ID')}</td>
                    <td>
                      <span className="badge badge-gold">{prop.status_permohonan}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
