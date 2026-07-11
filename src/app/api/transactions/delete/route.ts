import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { calculateKoperasiHealthScore } from '@/lib/risk-scanner';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['pengurus', 'ketua']);
    const body = await req.json();
    const { transaction_id } = body;

    if (!transaction_id) {
      return NextResponse.json({ error: 'ID Transaksi wajib ditentukan.' }, { status: 400 });
    }

    // 1. Verify transaction status and ownership
    const { rows } = await db.query(
      `SELECT status FROM ${p('transaksi_keuangan')} 
       WHERE id = $1 AND koperasi_ref = $2`,
      [transaction_id, session.koperasiRef]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Transaksi tidak ditemukan.' }, { status: 404 });
    }

    const status = rows[0].status;
    if (status === 'disetujui') {
      return NextResponse.json({ error: 'Transaksi yang sudah disetujui/cair tidak dapat dihapus.' }, { status: 400 });
    }

    // 2. Delete the transaction (referencing tables will cascade delete)
    await db.query(
      `DELETE FROM ${p('transaksi_keuangan')} WHERE id = $1`,
      [transaction_id]
    );

    // 3. Recalculate health score
    if (session.koperasiRef) {
      await calculateKoperasiHealthScore(session.koperasiRef);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing request' }, { status: 401 });
  }
}
