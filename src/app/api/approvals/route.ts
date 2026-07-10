import { requireRole } from '@/lib/auth';
import { decideApproval } from '@/lib/approval';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['pengurus', 'ketua']);
    const body = await req.json();
    const { approval_id, status, catatan } = body;

    if (!approval_id || !status) {
      return NextResponse.json({ error: 'Approval ID dan status wajib diisi.' }, { status: 400 });
    }

    if (status === 'ditolak' && (!catatan || catatan.trim() === '')) {
      return NextResponse.json({ error: 'Alasan penolakan (catatan) wajib diisi jika ditolak.' }, { status: 400 });
    }

    await decideApproval(approval_id, session.userId, status, catatan);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing approval' }, { status: 401 });
  }
}
