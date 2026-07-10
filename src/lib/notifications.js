"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = sendNotification;
const db_1 = require("./db");
async function sendNotification(payload) {
    // 1. Insert into notifications table (in-app)
    try {
        await db_1.db.query(`INSERT INTO ${(0, db_1.p)('notifications')} (user_id, type, title, body, reference_id, is_read, sent_via)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`, [payload.user_id, payload.type, payload.title, payload.body, payload.reference_id || null, false, 'in_app']);
    }
    catch (notifError) {
        console.error('Error inserting notification:', notifError.message);
    }
    // 2. Mock WhatsApp Notification Logger
    try {
        const { rows } = await db_1.db.query(`SELECT phone_number, full_name FROM ${(0, db_1.p)('app_users')} WHERE id = $1`, [payload.user_id]);
        const user = rows[0];
        if (user?.phone_number) {
            const waMessage = `Halo ${user.full_name},\n\n[AmanDes Notifikasi - ${payload.title}]\n${payload.body}\n\nSilakan cek aplikasi untuk detail selengkapnya.`;
            await db_1.db.query(`INSERT INTO ${(0, db_1.p)('whatsapp_mock_log')} (phone_number, message) VALUES ($1, $2)`, [user.phone_number, waMessage]);
            console.log(`[WA MOCK SENT to ${user.phone_number}]: ${waMessage.replace(/\n/g, ' ')}`);
        }
    }
    catch (waError) {
        console.error('Error writing to WhatsApp mock log:', waError.message);
    }
}
