import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['anggota', 'pengurus', 'ketua', 'pendamping']);
    const body = await req.json();
    const { action, title, description, aspiration_id, admin_response } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action wajib ditentukan.' }, { status: 400 });
    }

    if (action === 'create') {
      if (session.role !== 'anggota') {
        return NextResponse.json({ error: 'Hanya Anggota Koperasi yang dapat menyampaikan aspirasi.' }, { status: 403 });
      }

      if (!title || !description) {
        return NextResponse.json({ error: 'Judul dan keterangan aspirasi wajib diisi.' }, { status: 400 });
      }

      await db.query(
        `INSERT INTO ${p('community_aspirations')} (koperasi_ref, user_id, title, description) 
         VALUES ($1, $2, $3, $4)`,
        [session.koperasiRef, session.userId, title, description]
      );

      return NextResponse.json({ success: true });

    } else if (action === 'upvote') {
      if (!aspiration_id) {
        return NextResponse.json({ error: 'Aspiration ID wajib diisi.' }, { status: 400 });
      }

      try {
        // Track upvote to prevent duplicate
        await db.query(
          `INSERT INTO ${p('aspiration_upvotes')} (aspiration_id, user_id) 
           VALUES ($1, $2)`,
          [aspiration_id, session.userId]
        );

        // Increment count in main table
        await db.query(
          `UPDATE ${p('community_aspirations')} 
           SET upvotes_count = upvotes_count + 1 
           WHERE id = $1`,
          [aspiration_id]
        );
      } catch (err: any) {
        if (err.code === '23505') {
          return NextResponse.json({ error: 'Anda sudah mendukung (upvote) usulan ini.' }, { status: 400 });
        }
        throw err;
      }

      return NextResponse.json({ success: true });

    } else if (action === 'respond') {
      // Must be manager/chairman to respond
      if (!['pengurus', 'ketua'].includes(session.role)) {
        return NextResponse.json({ error: 'Hanya Pengurus atau Ketua yang dapat memberikan tanggapan.' }, { status: 403 });
      }

      if (!aspiration_id || !admin_response) {
        return NextResponse.json({ error: 'Aspiration ID dan tanggapan wajib diisi.' }, { status: 400 });
      }

      await db.query(
        `UPDATE ${p('community_aspirations')} 
         SET admin_response = $1, status = 'ditanggapi', responded_at = $2 
         WHERE id = $3`,
        [admin_response, new Date().toISOString(), aspiration_id]
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Action tidak valid.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing request' }, { status: 401 });
  }
}
