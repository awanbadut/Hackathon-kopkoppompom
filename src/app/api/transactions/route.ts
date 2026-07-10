import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { evaluateTransactionRisk } from '@/lib/risk-scanner';
import { createApprovalRequests } from '@/lib/approval';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['pengurus', 'ketua']);
    const body = await req.json();
    const {
      type,
      sumber_dana,
      kategori,
      amount,
      description,
      anggota_ref,
      evidence_url,
      transaction_date,
      submit_immediately,
      tenor_bulan,
      bunga_persen
    } = body;

    // Validate inputs
    if (!type || !sumber_dana || !kategori || !amount || !description || !transaction_date) {
      return NextResponse.json({ error: 'Data input tidak lengkap.' }, { status: 400 });
    }

    if (Number(amount) <= 0) {
      return NextResponse.json({ error: 'Nominal transaksi harus lebih besar dari 0.' }, { status: 400 });
    }

    // Insert transaction using pg
    const { rows } = await db.query(
      `INSERT INTO ${p('transaksi_keuangan')} 
       (koperasi_ref, type, sumber_dana, kategori, amount, description, anggota_ref, evidence_url, input_by, status, risk_level, transaction_date, tenor_bulan, bunga_persen)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        session.koperasiRef,
        type,
        sumber_dana,
        kategori,
        Number(amount),
        description,
        anggota_ref || null,
        evidence_url || null,
        session.userId,
        'draft',
        'aman',
        transaction_date,
        tenor_bulan ? Number(tenor_bulan) : null,
        bunga_persen ? Number(bunga_persen) : null
      ]
    );
    const tx = rows[0];

    if (!tx) {
      return NextResponse.json({ error: 'Gagal mencatat transaksi kas.' }, { status: 500 });
    }

    // Evaluate risk scanner immediately for draft preview
    const { triggeredRules, finalRiskLevel } = await evaluateTransactionRisk(tx.id);

    if (submit_immediately) {
      await createApprovalRequests(tx.id);
    }

    return NextResponse.json({
      success: true,
      transaction: { ...tx, risk_level: finalRiskLevel },
      triggeredRules
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
