import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { calculateKoperasiHealthScore } from '@/lib/risk-scanner';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['pengurus', 'ketua']);
    const body = await req.json();
    const { risk_log_id, resolved_note } = body;

    if (!risk_log_id || !resolved_note) {
      return NextResponse.json({ error: 'Risk log ID dan catatan penyelesaian wajib diisi.' }, { status: 400 });
    }

    // Update risk log using pg
    const { rowCount } = await db.query(
      `UPDATE ${p('risk_logs')} SET resolved = true, resolved_note = $1 WHERE id = $2`,
      [resolved_note, risk_log_id]
    );

    if (rowCount === 0) {
      return NextResponse.json({ error: 'Risk log tidak ditemukan.' }, { status: 404 });
    }

    // Recalculate health score for the koperasi
    if (session.koperasiRef) {
      await calculateKoperasiHealthScore(session.koperasiRef);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing request' }, { status: 401 });
  }
}
