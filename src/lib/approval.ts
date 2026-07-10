import { db, p } from './db';
import { sendNotification } from './notifications';

export async function createApprovalRequests(txId: string): Promise<void> {
  // Fetch transaction details
  const { rows: txRows } = await db.query(
    `SELECT * FROM ${p('transaksi_keuangan')} WHERE id = $1`,
    [txId]
  );
  const tx = txRows[0];

  if (!tx) {
    throw new Error('Transaction not found: ' + txId);
  }

  const { koperasi_ref, input_by, risk_level } = tx;

  // Find all active managers (pengurus and ketua) in the same koperasi
  const { rows: managers } = await db.query(
    `SELECT id, role, full_name FROM ${p('app_users')} 
     WHERE koperasi_ref = $1 AND status = 'active' AND id <> $2`,
    [koperasi_ref, input_by]
  );

  // Determine how many approvals and what levels are required
  const requiredApprovals: { level: number; approverId: string }[] = [];

  const pengurusList = managers.filter(m => m.role === 'pengurus');
  const ketuaList = managers.filter(m => m.role === 'ketua');

  if (risk_level === 'aman') {
    const eligible = [...pengurusList, ...ketuaList];
    if (eligible.length > 0) {
      requiredApprovals.push({ level: 1, approverId: eligible[0].id });
    }
  } else if (risk_level === 'perlu_perhatian') {
    const eligible = [...pengurusList, ...ketuaList];
    if (eligible.length < 2) {
      if (eligible.length > 0) {
        requiredApprovals.push({ level: 1, approverId: eligible[0].id });
      }
    } else {
      requiredApprovals.push({ level: 1, approverId: eligible[0].id });
      requiredApprovals.push({ level: 1, approverId: eligible[1].id });
    }
  } else if (risk_level === 'berisiko_tinggi') {
    if (ketuaList.length === 0) {
      const eligible = [...pengurusList];
      if (eligible.length > 0) {
        requiredApprovals.push({ level: 1, approverId: eligible[0].id });
        if (eligible.length > 1) {
          requiredApprovals.push({ level: 2, approverId: eligible[1].id });
        }
      }
    } else {
      const ketua = ketuaList[0];
      requiredApprovals.push({ level: 2, approverId: ketua.id });

      const otherEligible = [...pengurusList, ...ketuaList.slice(1)];
      if (otherEligible.length > 0) {
        requiredApprovals.push({ level: 1, approverId: otherEligible[0].id });
      }
    }
  }

  // Clear existing approvals for this transaction just in case
  await db.query(`DELETE FROM ${p('approvals')} WHERE transaction_id = $1`, [txId]);

  if (requiredApprovals.length === 0) {
    // Fallback to self-approval warning
    requiredApprovals.push({ level: 1, approverId: input_by });
  }

  // Insert approvals
  for (const req of requiredApprovals) {
    await db.query(
      `INSERT INTO ${p('approvals')} (transaction_id, approver_id, approval_level, status) 
       VALUES ($1, $2, $3, 'menunggu')`,
      [txId, req.approverId, req.level]
    );
  }

  // Update transaction status to 'menunggu_approval'
  await db.query(
    `UPDATE ${p('transaksi_keuangan')} SET status = 'menunggu_approval' WHERE id = $1`,
    [txId]
  );

  // Send notifications to approvers
  for (const app of requiredApprovals) {
    await sendNotification({
      user_id: app.approverId,
      type: 'approval_request',
      title: 'Permintaan Persetujuan Transaksi',
      body: `Transaksi baru membutuhkan persetujuan Anda (Risk level: ${risk_level}).`,
      reference_id: txId,
    });
  }
}

export async function decideApproval(
  approvalId: string,
  deciderId: string,
  status: 'disetujui' | 'ditolak',
  catatan?: string
): Promise<void> {
  // Fetch approval details with transaction
  const { rows } = await db.query(
    `SELECT a.*, t.input_by FROM ${p('approvals')} a 
     JOIN ${p('transaksi_keuangan')} t ON a.transaction_id = t.id 
     WHERE a.id = $1`,
    [approvalId]
  );
  const approval = rows[0];

  if (!approval) {
    throw new Error('Approval request not found: ' + approvalId);
  }

  if (approval.approver_id !== deciderId) {
    throw new Error('Unauthorized to make a decision on this approval request');
  }

  // Update approval decision
  await db.query(
    `UPDATE ${p('approvals')} SET status = $1, catatan = $2, decided_at = $3 WHERE id = $4`,
    [status, catatan || null, new Date().toISOString(), approvalId]
  );

  const txId = approval.transaction_id;
  const inputBy = approval.input_by;

  if (status === 'ditolak') {
    // If one is rejected, the entire transaction is rejected immediately
    await db.query(
      `UPDATE ${p('transaksi_keuangan')} SET status = 'ditolak' WHERE id = $1`,
      [txId]
    );

    // Cancel all other pending approvals for this transaction
    await db.query(
      `UPDATE ${p('approvals')} SET status = 'ditolak', catatan = 'Ditolak oleh approver lain' 
       WHERE transaction_id = $1 AND status = 'menunggu'`,
      [txId]
    );

    // Notify submitter
    await sendNotification({
      user_id: inputBy,
      type: 'transaction_status',
      title: 'Transaksi Ditolak',
      body: `Transaksi Anda ditolak oleh approver. Catatan: ${catatan || '-'}`,
      reference_id: txId,
    });
  } else {
    // If approved, check if all required approvals for this transaction are approved
    const { rows: allApps } = await db.query(
      `SELECT status FROM ${p('approvals')} WHERE transaction_id = $1`,
      [txId]
    );

    const allApproved = allApps.every(a => a.status === 'disetujui');

    if (allApproved) {
      // Update transaction status to approved
      await db.query(
        `UPDATE ${p('transaksi_keuangan')} SET status = 'disetujui' WHERE id = $1`,
        [txId]
      );

      // Notify submitter
      await sendNotification({
        user_id: inputBy,
        type: 'transaction_status',
        title: 'Transaksi Disetujui',
        body: 'Transaksi Anda telah disetujui sepenuhnya dan dicatat ke dalam buku kas.',
        reference_id: txId,
      });
    }
  }
}
