import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { sendNotification } from '@/lib/notifications';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Only the Chairman (ketua) can distribute the SHU
    const session = await requireRole(['ketua']);

    if (!session.koperasiRef) {
      return NextResponse.json({ error: 'Koperasi reference tidak ditemukan.' }, { status: 400 });
    }

    // 1. Calculate net undistributed SHU
    const { rows: pem } = await db.query(
      `SELECT COALESCE(SUM(amount), 0)::numeric as total FROM ${p('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 AND type = 'pemasukan' AND status = 'disetujui'`,
      [session.koperasiRef]
    );
    const { rows: peng } = await db.query(
      `SELECT COALESCE(SUM(amount), 0)::numeric as total FROM ${p('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 AND type = 'pengeluaran' AND status = 'disetujui'`,
      [session.koperasiRef]
    );
    const { rows: bag } = await db.query(
      `SELECT COALESCE(SUM(amount), 0)::numeric as total FROM ${p('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 AND type = 'bagi_hasil' AND status = 'disetujui'`,
      [session.koperasiRef]
    );

    const totalSHU = Number(pem[0].total) - Number(peng[0].total);
    const netSHU = totalSHU - Number(bag[0].total);

    if (netSHU <= 0) {
      return NextResponse.json(
        { error: 'Tidak ada Sisa Hasil Usaha (SHU) berjalan yang tersisa untuk dibagikan saat ini.' },
        { status: 400 }
      );
    }

    // 2. Fetch all active members who have participation points
    const { rows: members } = await db.query(
      `SELECT u.id as user_id, u.anggota_ref, COALESCE(p.total_points, 0)::int as points 
       FROM ${p('app_users')} u
       LEFT JOIN ${p('user_points')} p ON u.id = p.user_id
       WHERE u.koperasi_ref = $1 AND u.role = 'anggota' AND u.status = 'active'`,
      [session.koperasiRef]
    );

    const totalPoints = members.reduce((sum, m) => sum + m.points, 0);

    if (totalPoints <= 0) {
      return NextResponse.json(
        { error: 'Belum ada poin partisipasi anggota yang terkumpul untuk pembagian SHU.' },
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();

    // 3. Distribute SHU and record transactions
    for (const member of members) {
      if (member.points > 0) {
        const memberShuAmount = Math.round((member.points / totalPoints) * netSHU);

        if (memberShuAmount > 0) {
          // Record SHU distribution transaction
          const { rows: txRows } = await db.query(
            `INSERT INTO ${p('transaksi_keuangan')} 
             (koperasi_ref, type, sumber_dana, kategori, amount, description, anggota_ref, input_by, status, risk_level, transaction_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING id`,
            [
              session.koperasiRef,
              'bagi_hasil',
              'non_dana_desa',
              'lainnya',
              memberShuAmount,
              `Bagi Hasil SHU Periode ${currentYear} berbasis partisipasi aktif (${member.points} PTS)`,
              member.anggota_ref,
              session.userId,
              'disetujui',
              'aman',
              new Date().toISOString().split('T')[0]
            ]
          );

          const txId = txRows[0]?.id;

          // Notify member about SHU receipt
          await sendNotification({
            user_id: member.user_id,
            type: 'transaction_status',
            title: 'SHU Digital Ditransfer!',
            body: `Selamat! Pembagian SHU Periode ${currentYear} sebesar Rp${memberShuAmount.toLocaleString('id-ID')} telah dikreditkan berdasarkan partisipasi aktif Anda (${member.points} PTS).`,
            reference_id: txId || null
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      distributedAmount: netSHU,
      membersCount: members.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error distributing SHU' }, { status: 500 });
  }
}
