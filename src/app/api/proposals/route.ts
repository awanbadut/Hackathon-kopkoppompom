import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['pengurus', 'ketua']);
    const body = await req.json();
    const { penanggung_jawab, nomor_penanggung_jawab, nominal_permohonan, tenor, tujuan_permohonan } = body;

    // Validate inputs
    if (!penanggung_jawab || !nomor_penanggung_jawab || !nominal_permohonan || !tenor || !tujuan_permohonan) {
      return NextResponse.json({ error: 'Data formulir tidak lengkap.' }, { status: 400 });
    }

    if (Number(nominal_permohonan) <= 0) {
      return NextResponse.json({ error: 'Nominal permohonan harus lebih besar dari 0.' }, { status: 400 });
    }

    const refCode = 'PMB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const now = new Date().toISOString();

    const { rows } = await db.query(
      `INSERT INTO ${p('pengajuan_pembiayaan')} 
       (pengajuan_pembiayaan_ref, koperasi_ref, nik, penanggung_jawab, nomor_penanggung_jawab, status_permohonan, nominal_permohonan, tenor, tujuan_permohonan, dibuat_pada, diperbarui_pada)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        refCode,
        session.koperasiRef,
        session.ktpNumber || '3201010101010002',
        penanggung_jawab,
        nomor_penanggung_jawab,
        'Menunggu Review Kemenkop',
        Number(nominal_permohonan),
        Number(tenor),
        tujuan_permohonan,
        now,
        now
      ]
    );

    return NextResponse.json({ success: true, proposal: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
