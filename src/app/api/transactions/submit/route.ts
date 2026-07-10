import { requireRole } from '@/lib/auth';
import { evaluateTransactionRisk } from '@/lib/risk-scanner';
import { createApprovalRequests } from '@/lib/approval';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await requireRole(['pengurus', 'ketua']);
    const body = await req.json();
    const { transaction_id } = body;

    if (!transaction_id) {
      return NextResponse.json({ error: 'Transaction ID wajib disertakan.' }, { status: 400 });
    }

    // Evaluate risk scanner just in case it has changed
    await evaluateTransactionRisk(transaction_id);

    // Create approval requests
    await createApprovalRequests(transaction_id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing request' }, { status: 401 });
  }
}
