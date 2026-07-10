import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['pengurus', 'ketua', 'anggota', 'pendamping']);
    const body = await req.json();
    const { module_id, action, quiz_score } = body;

    if (!module_id || !action) {
      return NextResponse.json({ error: 'Module ID dan action wajib diisi.' }, { status: 400 });
    }

    if (action === 'start') {
      await db.query(
        `INSERT INTO ${p('user_progress')} (user_id, module_id, status) 
         VALUES ($1, $2, 'sedang_berjalan') 
         ON CONFLICT (user_id, module_id) DO UPDATE SET status = 'sedang_berjalan'`,
        [session.userId, module_id]
      );

      return NextResponse.json({ success: true });

    } else if (action === 'complete') {
      const { rows } = await db.query(
        `SELECT status FROM ${p('user_progress')} WHERE user_id = $1 AND module_id = $2`,
        [session.userId, module_id]
      );
      const existingProgress = rows[0];

      if (existingProgress?.status === 'selesai') {
        return NextResponse.json({ success: true, message: 'Modul sudah diselesaikan sebelumnya.' });
      }

      await db.query(
        `INSERT INTO ${p('user_progress')} (user_id, module_id, status, quiz_score, completed_at) 
         VALUES ($1, $2, 'selesai', $3, $4) 
         ON CONFLICT (user_id, module_id) DO UPDATE SET status = 'selesai', quiz_score = $3, completed_at = $4`,
        [
          session.userId, 
          module_id, 
          quiz_score !== undefined ? Number(quiz_score) : 100, 
          new Date().toISOString()
        ]
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Action tidak valid.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing request' }, { status: 401 });
  }
}
