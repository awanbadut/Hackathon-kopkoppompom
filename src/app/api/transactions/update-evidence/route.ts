import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { evaluateTransactionRisk, calculateKoperasiHealthScore } from '@/lib/risk-scanner';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['pengurus', 'ketua']);
    const body = await req.json();
    const { transaction_id, evidence_url } = body;

    if (!transaction_id || !evidence_url || !evidence_url.trim()) {
      return NextResponse.json({ error: 'ID Transaksi dan URL bukti fisik wajib diisi.' }, { status: 400 });
    }

    // 1. Update the evidence URL
    const { rowCount } = await db.query(
      `UPDATE ${p('transaksi_keuangan')} 
       SET evidence_url = $1 
       WHERE id = $2 AND koperasi_ref = $3`,
      [evidence_url.trim(), transaction_id, session.koperasiRef]
    );

    if (rowCount === 0) {
      return NextResponse.json({ error: 'Transaksi tidak ditemukan atau bukan milik koperasi Anda.' }, { status: 404 });
    }

    // 2. Re-assess transaction risk (this will automatically resolve R01_NO_EVIDENCE if evidence is present!)
    await evaluateTransactionRisk(transaction_id);

    // 3. Recalculate health score
    if (session.koperasiRef) {
      await calculateKoperasiHealthScore(session.koperasiRef);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing request' }, { status: 401 });
  }
}
