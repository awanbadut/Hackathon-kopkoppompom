'use server';

import { createSession, deleteSession } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { redirect } from 'next/navigation';

// Lazy-create the OTP table in the database
async function ensureOtpTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS ${p('user_otps')} (
      phone_number VARCHAR(20) PRIMARY KEY,
      otp_code VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL
    )
  `);
}

export async function requestOtpAction(phoneNumber: string) {
  if (!phoneNumber || !phoneNumber.trim()) {
    return { error: 'Nomor HP wajib diisi.' };
  }

  const cleanPhone = phoneNumber.trim();

  try {
    await ensureOtpTable();

    // 1. Verify user exists in the database
    const { rows: userRows } = await db.query(
      `SELECT full_name FROM ${p('app_users')} WHERE phone_number = $1`,
      [cleanPhone]
    );
    const user = userRows[0];

    if (!user) {
      return { error: 'Nomor HP tidak terdaftar dalam database demo.' };
    }

    // 2. Generate a random 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes expiration

    // 3. Upsert OTP code in database
    await db.query(
      `INSERT INTO ${p('user_otps')} (phone_number, otp_code, expires_at) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (phone_number) DO UPDATE 
       SET otp_code = EXCLUDED.otp_code, expires_at = EXCLUDED.expires_at`,
      [cleanPhone, otpCode, expiresAt]
    );

    // 4. Log to WhatsApp mock table for audits & broadcasting
    const msg = `Halo ${user.full_name},\n\n[AmanDes OTP Login]\nKode OTP Anda adalah: ${otpCode}.\n\nBerlaku selama 5 menit. Jangan bagikan kode ini kepada siapa pun.`;
    await db.query(
      `INSERT INTO ${p('whatsapp_mock_log')} (phone_number, message) VALUES ($1, $2)`,
      [cleanPhone, msg]
    );

    return { success: true, otp: otpCode, fullName: user.full_name };
  } catch (err: any) {
    return { error: 'Gagal membuat OTP: ' + err.message };
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  const phoneNumber = formData.get('phone_number') as string;
  const otp = formData.get('otp') as string;

  if (!phoneNumber) {
    return { error: 'Nomor HP wajib diisi.' };
  }

  if (!otp) {
    return { error: 'OTP wajib diisi.' };
  }

  const cleanPhone = phoneNumber.trim();
  let isValidOtp = false;

  try {
    await ensureOtpTable();

    // 1. Query user from database
    const { rows } = await db.query(
      `SELECT * FROM ${p('app_users')} WHERE phone_number = $1`,
      [cleanPhone]
    );
    const user = rows[0];

    if (!user) {
      return { error: 'Nomor HP tidak terdaftar dalam database demo.' };
    }

    if (user.status === 'suspended') {
      return { error: 'Akun Anda dinonaktifkan (suspended). Hubungi pengurus koperasi.' };
    }

    // 2. Validate OTP
    if (otp === '123456') {
      // Allow bypass/demo code for testing convenience
      isValidOtp = true;
    } else {
      // Query dynamic OTP from DB
      const { rows: otpRows } = await db.query(
        `SELECT * FROM ${p('user_otps')} 
         WHERE phone_number = $1 AND otp_code = $2 AND expires_at > NOW()`,
        [cleanPhone, otp]
      );
      if (otpRows.length > 0) {
        isValidOtp = true;
        // Delete verified OTP so it cannot be reused
        await db.query(`DELETE FROM ${p('user_otps')} WHERE phone_number = $1`, [cleanPhone]);
      }
    }

    if (!isValidOtp) {
      return { error: 'OTP tidak valid atau sudah kedaluwarsa. Silakan minta kode baru.' };
    }

    // 3. Create session
    await createSession({
      userId: user.id,
      fullName: user.full_name,
      phoneNumber: user.phone_number,
      ktpNumber: user.ktp_number,
      role: user.role,
      koperasiRef: user.koperasi_ref,
    });

    let redirectPath = '/dashboard';
    if (user.status === 'pending') {
      redirectPath = '/pending-approval';
    }

    return { success: true, redirectPath };
  } catch (error: any) {
    return { error: 'Terjadi kesalahan sistem: ' + error.message };
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect('/');
}
