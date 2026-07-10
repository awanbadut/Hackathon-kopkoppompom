import { db, p } from './db';

export interface NotificationPayload {
  user_id: string;
  type: 'approval_request' | 'risk_alert' | 'transaction_status' | 'rat_reminder' | 'system_info';
  title: string;
  body: string;
  reference_id?: string;
}

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  // 1. Insert into notifications table (in-app)
  try {
    await db.query(
      `INSERT INTO ${p('notifications')} (user_id, type, title, body, reference_id, is_read, sent_via)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [payload.user_id, payload.type, payload.title, payload.body, payload.reference_id || null, false, 'in_app']
    );
  } catch (notifError: any) {
    console.error('Error inserting notification:', notifError.message);
  }

  // 2. Mock WhatsApp Notification Logger
  try {
    const { rows } = await db.query(
      `SELECT phone_number, full_name FROM ${p('app_users')} WHERE id = $1`,
      [payload.user_id]
    );
    const user = rows[0];

    if (user?.phone_number) {
      const waMessage = `Halo ${user.full_name},\n\n[AmanDes Notifikasi - ${payload.title}]\n${payload.body}\n\nSilakan cek aplikasi untuk detail selengkapnya.`;
      
      await db.query(
        `INSERT INTO ${p('whatsapp_mock_log')} (phone_number, message) VALUES ($1, $2)`,
        [user.phone_number, waMessage]
      );

      console.log(`[WA MOCK SENT to ${user.phone_number}]: ${waMessage.replace(/\n/g, ' ')}`);
    }
  } catch (waError: any) {
    console.error('Error writing to WhatsApp mock log:', waError.message);
  }
}
