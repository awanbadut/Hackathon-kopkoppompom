import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['anggota', 'pengurus', 'ketua', 'pendamping']);
    const body = await req.json();
    const { voucher_id } = body;

    if (!voucher_id) {
      return NextResponse.json({ error: 'Voucher ID wajib disertakan.' }, { status: 400 });
    }

    // Connect to database pool to run transaction manually
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Fetch voucher details
      const { rows: vRows } = await client.query(
        `SELECT * FROM ${p('reward_vouchers')} WHERE id = $1 FOR UPDATE`,
        [voucher_id]
      );
      const voucher = vRows[0];

      if (!voucher) {
        throw new Error('Voucher tidak ditemukan.');
      }

      if (voucher.stock <= 0) {
        throw new Error('Stok voucher ini telah habis.');
      }

      // 2. Fetch user points balance
      const { rows: ptRows } = await client.query(
        `SELECT total_points FROM ${p('user_points')} WHERE user_id = $1 FOR UPDATE`,
        [session.userId]
      );
      const userPoints = ptRows[0]?.total_points ? Number(ptRows[0].total_points) : 0;

      if (userPoints < voucher.points_cost) {
        throw new Error(`Poin tidak mencukupi. Kupon ini butuh ${voucher.points_cost} Poin (Poin Anda: ${userPoints} Poin).`);
      }

      // 3. Deduct points
      await client.query(
        `UPDATE ${p('user_points')} SET total_points = total_points - $1 WHERE user_id = $2`,
        [voucher.points_cost, session.userId]
      );

      // 4. Deduct stock
      await client.query(
        `UPDATE ${p('reward_vouchers')} SET stock = stock - 1 WHERE id = $1`,
        [voucher_id]
      );

      // 5. Generate random code and insert into user_vouchers
      const voucherCode = 'VCH-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      await client.query(
        `INSERT INTO ${p('user_vouchers')} (user_id, voucher_id, code) 
         VALUES ($1, $2, $3)`,
        [session.userId, voucher_id, voucherCode]
      );

      await client.query('COMMIT');
      return NextResponse.json({ success: true, code: voucherCode });
    } catch (err: any) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: err.message || 'Gagal menukarkan poin.' }, { status: 400 });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
