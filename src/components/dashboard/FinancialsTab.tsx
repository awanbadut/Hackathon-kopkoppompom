import React from 'react';
import {
  Scale,
  BarChart3,
  Coins,
  Check,
  AlertTriangle,
  Landmark,
  Wallet,
  TrendingUp,
} from 'lucide-react';

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

function StatCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div
      className="rounded-3xl p-5 shadow-sm border"
      style={{
        background: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        color: 'var(--foreground)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className="text-[10px] uppercase tracking-[0.18em] font-black block"
            style={{ color: 'var(--text-muted)', opacity: 0.9 }}
          >
            {title}
          </span>
          <div className="mt-3 text-2xl font-black tracking-tight">{value}</div>
          {subtitle && (
            <p
              className="mt-2 text-[11px] leading-relaxed max-w-[28ch]"
              style={{ color: 'var(--text-muted)' }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: 'color-mix(in srgb, var(--foreground) 6%, transparent)',
            border: '1px solid var(--border-color)',
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function RowItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-3"
      style={{ borderBottom: '1px solid var(--border-color-subtle)' }}
    >
      <span
        className="text-sm font-medium"
        style={{ color: 'var(--financial-label-strong)' }}
      >
        {label}
      </span>
      <span
        className="font-mono text-right font-bold"
        style={{ color: 'var(--foreground)' }}
      >
        {value}
      </span>
    </div>
  );
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
  fmt,
}: FinancialsTabProps) {
  const saldoKasVal = kasSummary?.saldo_kas ? Number(kasSummary.saldo_kas) : 0;
  const piutangVal = financialSummary?.piutang_anggota
    ? Number(financialSummary.piutang_anggota)
    : 0;
  const totalAset = saldoKasVal + piutangVal;

  const simpokVal = financialSummary?.simpanan_pokok
    ? Number(financialSummary.simpanan_pokok)
    : 0;
  const simwajibVal = financialSummary?.simpanan_wajib
    ? Number(financialSummary.simpanan_wajib)
    : 0;
  const simsukarelaVal = financialSummary?.simpanan_sukarela
    ? Number(financialSummary.simpanan_sukarela)
    : 0;
  const modalAwalVal = koperasi?.modal_awal ? Number(koperasi.modal_awal) : 250000000;
  const totalPasiva = simpokVal + simwajibVal + simsukarelaVal + modalAwalVal;

  const totalPendapatan = financialSummary?.pemasukan_kas
    ? Number(financialSummary.pemasukan_kas)
    : 0;
  const totalBeban = financialSummary?.pengeluaran_kas
    ? Number(financialSummary.pengeluaran_kas)
    : 0;
  const sisaHasilUsaha = totalPendapatan - totalBeban;

  const isBalanced = totalAset === totalPasiva;
  const memberSharePct =
    totalKoperasiPoints > 0 ? (pointsBalance / totalKoperasiPoints) * 100 : 0;
  const estimatedShu = Math.max(
    0,
    totalKoperasiPoints > 0
      ? (pointsBalance / totalKoperasiPoints) * sisaHasilUsaha
      : 0
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Aktiva"
          value={fmt(totalAset)}
          subtitle="Gabungan saldo kas aktif dan piutang anggota koperasi."
          icon={<Landmark className="w-5 h-5" style={{ color: 'var(--primary)' }} />}
        />

        <StatCard
          title="Total Pasiva"
          value={fmt(totalPasiva)}
          subtitle="Akumulasi simpanan anggota dan modal awal koperasi."
          icon={<Wallet className="w-5 h-5" style={{ color: 'var(--accent)' }} />}
        />

        <StatCard
          title="SHU Berjalan"
          value={fmt(sisaHasilUsaha)}
          subtitle="Selisih pendapatan operasional dan total beban berjalan."
          icon={
            <TrendingUp
              className="w-5 h-5"
              style={{
                color:
                  sisaHasilUsaha >= 0
                    ? 'var(--financial-positive)'
                    : 'var(--financial-negative)',
              }}
            />
          }
        />

        <StatCard
          title="Status Neraca"
          value={isBalanced ? 'Balanced' : 'Unbalanced'}
          subtitle={
            isBalanced
              ? 'Aktiva dan pasiva sudah seimbang.'
              : 'Ada selisih antara sisi aset dan pasiva.'
          }
          icon={
            isBalanced ? (
              <Check className="w-5 h-5" style={{ color: 'var(--financial-positive)' }} />
            ) : (
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            )
          }
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.1fr_0.95fr] gap-6">
        <section
          className="rounded-3xl shadow-sm p-6 border"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                border: '1px solid var(--border-color)',
              }}
            >
              <Scale className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h3 className="text-sm font-black" style={{ color: 'var(--foreground)' }}>
                Aktiva Koperasi
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Aset lancar dan pembiayaan yang masih berjalan.
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl p-4 border"
            style={{
              background: 'var(--financial-panel)',
              borderColor: 'var(--border-color-subtle)',
            }}
          >
            <RowItem label="Kas Tunai & Saldo Bank" value={fmt(saldoKasVal)} />
            <RowItem label="Piutang Pembiayaan Anggota" value={fmt(piutangVal)} />

            <div
              className="flex items-center justify-between gap-4 pt-4 mt-4"
              style={{ borderTop: '1px dashed var(--border-color)' }}
            >
              <span className="text-sm font-black uppercase tracking-wide" style={{ color: 'var(--primary)' }}>
                Total Aktiva
              </span>
              <span className="font-mono text-lg font-black" style={{ color: 'var(--foreground)' }}>
                {fmt(totalAset)}
              </span>
            </div>
          </div>
        </section>

        <section
          className="rounded-3xl shadow-sm p-6 border"
          style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                border: '1px solid var(--border-color)',
              }}
            >
              <Coins className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h3 className="text-sm font-black" style={{ color: 'var(--foreground)' }}>
                Pasiva & Modal
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Kewajiban simpanan anggota dan struktur modal koperasi.
              </p>
            </div>
          </div>

          <div
            className="rounded-2xl p-4 border"
            style={{
              background: 'var(--financial-panel)',
              borderColor: 'var(--border-color-subtle)',
            }}
          >
            <RowItem label="Simpanan Pokok Anggota" value={fmt(simpokVal)} />
            <RowItem label="Simpanan Wajib Anggota" value={fmt(simwajibVal)} />
            <RowItem label="Simpanan Sukarela Anggota" value={fmt(simsukarelaVal)} />
            <RowItem label="Ekuitas Modal Awal" value={fmt(modalAwalVal)} />

            <div
              className="flex items-center justify-between gap-4 pt-4 mt-4"
              style={{ borderTop: '1px dashed var(--border-color)' }}
            >
              <span className="text-sm font-black uppercase tracking-wide" style={{ color: 'var(--primary)' }}>
                Total Pasiva
              </span>
              <span className="font-mono text-lg font-black" style={{ color: 'var(--foreground)' }}>
                {fmt(totalPasiva)}
              </span>
            </div>
          </div>
        </section>

        <section
  style={{
    position: 'relative',
    zIndex: 20,
    isolation: 'isolate',
    overflow: 'visible',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '24px',
    boxShadow: 'var(--shadow-card)',
    padding: '24px',
  }}
>
  <div
    style={{
      position: 'relative',
      zIndex: 21,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      overflow: 'visible',
    }}
  >
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(84, 140, 47, 0.12)',
        border: '1px solid var(--border-color)',
        flexShrink: 0,
      }}
    >
      <BarChart3 className="w-5 h-5" style={{ color: 'var(--primary)' }} />
    </div>

    <div style={{ minWidth: 0 }}>
      <h3
        style={{
          margin: 0,
          color: 'var(--foreground)',
          fontSize: '14px',
          fontWeight: 900,
          lineHeight: 1.3,
          display: 'block',
          overflow: 'visible',
          WebkitLineClamp: 'unset',
          WebkitBoxOrient: 'horizontal',
        }}
      >
        Laporan Hasil Usaha (SHU / Rugi Laba)
      </h3>
      <p
        style={{
          margin: '4px 0 0',
          color: 'var(--text-muted)',
          fontSize: '11px',
          lineHeight: 1.5,
          display: 'block',
          overflow: 'visible',
          WebkitLineClamp: 'unset',
          WebkitBoxOrient: 'horizontal',
        }}
      >
        Ringkasan pendapatan, beban, dan estimasi distribusi SHU.
      </p>
    </div>
  </div>

  <div
    style={{
      position: 'relative',
      zIndex: 22,
      overflow: 'visible',
      background: 'var(--financial-panel)',
      border: '1px solid var(--border-color-subtle)',
      borderRadius: '18px',
      padding: '16px',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--border-color)',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          color: 'var(--financial-label-strong)',
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: 1.45,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflow: 'visible',
          display: 'block',
          WebkitLineClamp: 'unset',
          WebkitBoxOrient: 'horizontal',
        }}
      >
        Total Pendapatan Operasional (Kas Masuk)
      </div>
      <div
        style={{
          color: 'var(--financial-positive)',
          fontSize: '14px',
          fontWeight: 800,
          lineHeight: 1.3,
          fontFamily: 'var(--font-mono), monospace',
          whiteSpace: 'nowrap',
          opacity: 1,
          visibility: 'visible',
        }}
      >
        +{fmt(totalPendapatan)}
      </div>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--border-color)',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          color: 'var(--financial-label-strong)',
          fontSize: '14px',
          fontWeight: 700,
          lineHeight: 1.45,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          overflow: 'visible',
          display: 'block',
          WebkitLineClamp: 'unset',
          WebkitBoxOrient: 'horizontal',
          opacity: 1,
          visibility: 'visible',
        }}
      >
        Total Beban Operasional (Kas Keluar)
      </div>
      <div
        style={{
          color: 'var(--financial-negative)',
          fontSize: '14px',
          fontWeight: 800,
          lineHeight: 1.3,
          fontFamily: 'var(--font-mono), monospace',
          whiteSpace: 'nowrap',
          opacity: 1,
          visibility: 'visible',
        }}
      >
        -{fmt(totalBeban)}
      </div>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        alignItems: 'center',
        paddingTop: '16px',
        marginTop: '16px',
        borderTop: '1px dashed var(--border-color)',
        overflow: 'visible',
      }}
    >
      <div
        style={{
          color: 'var(--accent)',
          fontSize: '14px',
          fontWeight: 900,
          lineHeight: 1.3,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        SHU Berjalan
      </div>
      <div
        style={{
          color:
            sisaHasilUsaha >= 0
              ? 'var(--financial-positive)'
              : 'var(--financial-negative)',
          fontSize: '18px',
          fontWeight: 900,
          lineHeight: 1.2,
          fontFamily: 'var(--font-mono), monospace',
          whiteSpace: 'nowrap',
        }}
      >
        {fmt(sisaHasilUsaha)}
      </div>
    </div>
  </div>
</section>
      </div>
    </div>
  );
}