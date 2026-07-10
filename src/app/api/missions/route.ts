import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['anggota', 'pengurus', 'ketua', 'pendamping']);
    const body = await req.json();
    const { mission_code, points_awarded } = body;

    if (!mission_code || !points_awarded) {
      return NextResponse.json({ error: 'Data misi tidak lengkap.' }, { status: 400 });
    }

    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Calculate current Monday (week_start)
      const { rows: dateRows } = await client.query("SELECT DATE_TRUNC('week', CURRENT_DATE)::date as week_start");
      const weekStart = dateRows[0].week_start;

      // 2. Check if already claimed
      const { rows: claimRows } = await client.query(
        `SELECT * FROM ${p('weekly_missions_claim')} 
         WHERE user_id = $1 AND mission_code = $2 AND week_start = $3`,
        [session.userId, mission_code, weekStart]
      );

      if (claimRows.length > 0) {
        throw new Error('Anda sudah mengklaim poin untuk misi ini minggu ini.');
      }

      // 3. Insert claim log
      await client.query(
        `INSERT INTO ${p('weekly_missions_claim')} (user_id, mission_code, week_start, points_awarded) 
         VALUES ($1, $2, $3, $4)`,
        [session.userId, mission_code, weekStart, Number(points_awarded)]
      );

      // 4. Add points to user_points (upsert)
      await client.query(
        `INSERT INTO ${p('user_points')} (user_id, total_points) 
         VALUES ($1, $2) 
         ON CONFLICT (user_id) 
         DO UPDATE SET total_points = ${p('user_points')}.total_points + $2`,
        [session.userId, Number(points_awarded)]
      );

      await client.query('COMMIT');
      return NextResponse.json({ success: true, pointsAwarded: points_awarded });
    } catch (err: any) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: err.message || 'Gagal mengklaim misi.' }, { status: 400 });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
