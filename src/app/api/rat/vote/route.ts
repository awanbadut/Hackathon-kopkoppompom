import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['anggota', 'pengurus', 'ketua']);
    const body = await req.json();
    const { agenda_id, voted_option } = body;

    if (!agenda_id || !voted_option) {
      return NextResponse.json({ error: 'Agenda ID dan pilihan suara wajib diisi.' }, { status: 400 });
    }

    // Insert vote using pg
    try {
      await db.query(
        `INSERT INTO ${p('rat_votes')} (agenda_id, user_id, voted_option) 
         VALUES ($1, $2, $3)`,
        [agenda_id, session.userId, voted_option]
      );
    } catch (err: any) {
      if (err.code === '23505') { // Unique constraint violation code in PostgreSQL
        return NextResponse.json({ error: 'Anda sudah menyalurkan suara untuk agenda voting ini.' }, { status: 400 });
      }
      throw err;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing vote' }, { status: 401 });
  }
}
