import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['pengurus', 'ketua']);
    const body = await req.json();
    const { aspiration_id } = body;

    if (!aspiration_id) {
      return NextResponse.json({ error: 'Aspiration ID wajib diisi.' }, { status: 400 });
    }

    // Connect to database pool to run transaction
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Fetch Aspiration details
      const { rows: aspRows } = await client.query(
        `SELECT a.*, u.full_name as user_name 
         FROM ${p('community_aspirations')} a 
         JOIN ${p('app_users')} u ON a.user_id = u.id 
         WHERE a.id = $1 FOR UPDATE`,
        [aspiration_id]
      );
      const aspiration = aspRows[0];

      if (!aspiration) {
        throw new Error('Aspirasi tidak ditemukan.');
      }

      // 2. Insert new e-RAT Voting Agenda (let PG generate the UUID)
      const agendaTitle = `Musyawarah Usulan: ${aspiration.title}`;
      const agendaDesc = `Menindaklanjuti usulan dari warga (${aspiration.user_name}) di forum aspirasi: "${aspiration.description}". Rapat anggota memutuskan kelayakan realisasi usulan ini.`;
      
      const { rows: agendaRows } = await client.query(
        `INSERT INTO ${p('rat_voting_agenda')} (koperasi_ref, title, description, options, status) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [session.koperasiRef, agendaTitle, agendaDesc, ['Setuju', 'Tolak', 'Abstain'], 'aktif']
      );
      const agendaId = agendaRows[0].id;

      // 3. Update aspiration status and add official response
      const officialResponse = 'Usulan ini dinilai sangat baik oleh pengurus dan telah resmi ditingkatkan menjadi Agenda Voting e-RAT untuk diputuskan secara demokratis oleh seluruh anggota.';
      await client.query(
        `UPDATE ${p('community_aspirations')} 
         SET status = 'ditanggapi', admin_response = $1, responded_at = $2 
         WHERE id = $3`,
        [officialResponse, new Date().toISOString(), aspiration_id]
      );

      await client.query('COMMIT');
      return NextResponse.json({ success: true, agenda_id: agendaId });
    } catch (err: any) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing request' }, { status: 401 });
  }
}
