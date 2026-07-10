import { requireRole } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { sendNotification } from '@/lib/notifications';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await requireRole(['pengurus', 'ketua']);
    const body = await req.json();
    const { user_id, action, reason } = body;

    if (!user_id || !action) {
      return NextResponse.json({ error: 'User ID dan action wajib diisi.' }, { status: 400 });
    }

    // Get the pending user's details using pg
    const { rows: userRows } = await db.query(
      `SELECT * FROM ${p('app_users')} WHERE id = $1`,
      [user_id]
    );
    const pendingUser = userRows[0];

    if (!pendingUser) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 });
    }

    if (action === 'approve') {
      let refId = '';

      if (pendingUser.role === 'anggota') {
        refId = 'MBR-' + Math.random().toString(36).substring(2, 14).toUpperCase();
        
        // Insert into anggota_koperasi
        await db.query(
          `INSERT INTO ${p('anggota_koperasi')} (anggota_ref, koperasi_ref, nama, nik, status_keanggotaan, status_akun, tanggal_terdaftar)
           VALUES ($1, $2, $3, $4, 'Approved', 'Punya Akun', $5)`,
          [
            refId,
            session.koperasiRef,
            pendingUser.full_name,
            pendingUser.ktp_number,
            new Date().toISOString().split('T')[0]
          ]
        );

        // Update app_users
        await db.query(
          `UPDATE ${p('app_users')} SET status = 'active', anggota_ref = $1 WHERE id = $2`,
          [refId, user_id]
        );

      } else if (pendingUser.role === 'pengurus' || pendingUser.role === 'ketua') {
        refId = 'MGR-' + Math.random().toString(36).substring(2, 14).toUpperCase();

        // Insert into pengurus_koperasi
        await db.query(
          `INSERT INTO ${p('pengurus_koperasi')} (pengurus_ref, koperasi_ref, nama, jabatan, status, no_hp, nik)
           VALUES ($1, $2, $3, $4, 'Aktif', $5, $6)`,
          [
            refId,
            session.koperasiRef,
            pendingUser.full_name,
            pendingUser.role === 'ketua' ? 'Ketua' : 'Bendahara',
            pendingUser.phone_number,
            pendingUser.ktp_number
          ]
        );

        // Update app_users
        await db.query(
          `UPDATE ${p('app_users')} SET status = 'active', pengurus_ref = $1 WHERE id = $2`,
          [refId, user_id]
        );
      }

      // Send notification
      await sendNotification({
        user_id,
        type: 'system_info',
        title: 'Akun Disetujui',
        body: `Selamat! Pendaftaran akun Anda sebagai ${pendingUser.role} telah disetujui oleh pengurus Koperasi Desa Merah Putih.`,
      });

    } else if (action === 'reject') {
      // Suspend user
      await db.query(
        `UPDATE ${p('app_users')} SET status = 'suspended' WHERE id = $1`,
        [user_id]
      );

      // Send notification
      await sendNotification({
        user_id,
        type: 'system_info',
        title: 'Pendaftaran Ditolak',
        body: `Pendaftaran akun Anda ditolak oleh pengurus Koperasi Desa Merah Putih. Alasan: ${reason || '-'}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing request' }, { status: 401 });
  }
}
