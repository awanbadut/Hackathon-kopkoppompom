import { getSession } from '@/lib/auth';
import { db, p } from '@/lib/db';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/DashboardClient';

// Helper to recursively serialize JavaScript Date objects into ISO strings for Next.js Client Component compatibility
function serializeDates(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeDates);
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        res[key] = serializeDates(obj[key]);
      }
    }
    return res;
  }
  return obj;
}

export default async function DashboardPage(props: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/');
  }

  if (session.role !== 'pendamping' && !session.koperasiRef) {
    redirect('/');
  }

  const searchParamsResolved = await props.searchParams;
  const currentTab = searchParamsResolved.tab || 'overview';

  // 1. Load Koperasi Profile
  let koperasi = null;
  if (session.koperasiRef) {
    const { rows } = await db.query(
      `SELECT * FROM ${p('profil_koperasi')} WHERE koperasi_ref = $1`,
      [session.koperasiRef]
    );
    koperasi = rows[0] || null;
  }

  // 2. Load Cash Balance / Summary
  let kasSummary = null;
  if (session.koperasiRef) {
    const { rows } = await db.query(
      `SELECT * FROM ${p('v_koperasi_summary')} WHERE koperasi_ref = $1`,
      [session.koperasiRef]
    );
    kasSummary = rows[0] || null;
  }

  // 3. Load Compliance Summary
  let complianceSummary = null;
  if (session.koperasiRef) {
    const { rows } = await db.query(
      `SELECT * FROM ${p('v_compliance_summary')} WHERE koperasi_ref = $1`,
      [session.koperasiRef]
    );
    complianceSummary = rows[0] || null;
  }

  // 4. Load User Points
  const { rows: ptRows } = await db.query(
    `SELECT * FROM ${p('user_points')} WHERE user_id = $1`,
    [session.userId]
  );
  const userPoints = ptRows[0] || null;

  // Load Cooperative Total Points Pool
  let totalKoperasiPoints = 0;
  if (session.koperasiRef) {
    const { rows: totalPtRows } = await db.query(
      `SELECT COALESCE(SUM(total_points), 0)::int as total FROM ${p('user_points')} 
       WHERE user_id IN (SELECT id FROM ${p('app_users')} WHERE koperasi_ref = $1)`,
      [session.koperasiRef]
    );
    totalKoperasiPoints = totalPtRows[0]?.total || 0;
  }

  // 5. Load Transactions
  let transactions: any[] = [];
  if (session.koperasiRef) {
    const { rows } = await db.query(
      `SELECT t.*, u.full_name as input_by_name FROM ${p('transaksi_keuangan')} t 
       LEFT JOIN ${p('app_users')} u ON t.input_by = u.id 
       WHERE t.koperasi_ref = $1 
       ORDER BY t.created_at DESC LIMIT 100`,
      [session.koperasiRef]
    );
    transactions = rows.map(t => ({
      ...t,
      app_users: { full_name: t.input_by_name }
    }));
  }

  // 6. Load Approvals for current user (if manager)
  let myApprovals: any[] = [];
  if (['pengurus', 'ketua'].includes(session.role)) {
    const { rows } = await db.query(
      `SELECT a.*, t.type, t.sumber_dana, t.kategori, t.amount, t.description, t.evidence_url, t.risk_level, t.input_by, u.full_name as input_by_name 
       FROM ${p('approvals')} a 
       JOIN ${p('transaksi_keuangan')} t ON a.transaction_id = t.id 
       LEFT JOIN ${p('app_users')} u ON t.input_by = u.id 
       WHERE a.approver_id = $1 
       ORDER BY a.created_at DESC`,
      [session.userId]
    );
    myApprovals = rows.map(a => ({
      ...a,
      transaksi_keuangan: {
        id: a.transaction_id,
        type: a.type,
        sumber_dana: a.sumber_dana,
        kategori: a.kategori,
        amount: a.amount,
        description: a.description,
        evidence_url: a.evidence_url,
        risk_level: a.risk_level,
        input_by: a.input_by,
        app_users: { full_name: a.input_by_name }
      }
    }));
  }

  // 7. Load Pending Members for verification (if manager)
  let pendingMembers: any[] = [];
  if (['pengurus', 'ketua'].includes(session.role) && session.koperasiRef) {
    const { rows } = await db.query(
      `SELECT * FROM ${p('app_users')} WHERE koperasi_ref = $1 AND status = 'pending'`,
      [session.koperasiRef]
    );
    pendingMembers = rows;
  }

  // 8. Load Risk Logs (unresolved)
  let riskLogs: any[] = [];
  if (session.koperasiRef) {
    const { rows } = await db.query(
      `SELECT r.*, t.description, t.amount, t.transaction_date, t.koperasi_ref 
       FROM ${p('risk_logs')} r 
       JOIN ${p('transaksi_keuangan')} t ON r.transaction_id = t.id 
       WHERE t.koperasi_ref = $1 AND r.resolved = false`,
      [session.koperasiRef]
    );
    riskLogs = rows.map(r => ({
      ...r,
      transaksi_keuangan: {
        koperasi_ref: r.koperasi_ref,
        description: r.description,
        amount: r.amount,
        transaction_date: r.transaction_date
      }
    }));
  }

  // 9. Load Learning Modules
  const { rows: modules } = await db.query(
    `SELECT * FROM ${p('learning_modules')}`
  );

  // 10. Load User Progress
  const { rows: userProgress } = await db.query(
    `SELECT * FROM ${p('user_progress')} WHERE user_id = $1`,
    [session.userId]
  );

  // 11. Load Notifications
  const { rows: notifications } = await db.query(
    `SELECT * FROM ${p('notifications')} WHERE user_id = $1 ORDER BY created_at DESC LIMIT 30`,
    [session.userId]
  );

  // 12. Load e-RAT Voting Agendas
  let ratVotingAgendas: any[] = [];
  if (session.koperasiRef) {
    const { rows } = await db.query(
      `SELECT * FROM ${p('rat_voting_agenda')} 
       WHERE koperasi_ref = $1 
       ORDER BY created_at DESC`,
      [session.koperasiRef]
    );
    ratVotingAgendas = rows;
  }

  // 13. Load User Votes
  const { rows: voteRows } = await db.query(
    `SELECT * FROM ${p('rat_votes')} WHERE user_id = $1`,
    [session.userId]
  );
  const myVotes = voteRows;

  // 14. Load Community Aspirations (Suggestions Forum)
  let aspirations: any[] = [];
  if (session.koperasiRef) {
    const { rows } = await db.query(
      `SELECT a.*, u.full_name as user_name, u.role as user_role 
       FROM ${p('community_aspirations')} a 
       LEFT JOIN ${p('app_users')} u ON a.user_id = u.id 
       WHERE a.koperasi_ref = $1 
       ORDER BY a.upvotes_count DESC, a.created_at DESC`,
      [session.koperasiRef]
    );
    aspirations = rows;
  }

  // 15. Load User Aspiration Upvotes
  const { rows: upvoteRows } = await db.query(
    `SELECT * FROM ${p('aspiration_upvotes')} WHERE user_id = $1`,
    [session.userId]
  );
  const myUpvotes = upvoteRows;

  // 16. Load Reward Vouchers
  const { rows: vouchers } = await db.query(
    `SELECT * FROM ${p('reward_vouchers')} ORDER BY points_cost ASC`
  );

  // 17. Load User Redeemed Vouchers
  const { rows: userVouchers } = await db.query(
    `SELECT uv.*, rv.title, rv.points_cost, rv.description 
     FROM ${p('user_vouchers')} uv 
     JOIN ${p('reward_vouchers')} rv ON uv.voucher_id = rv.id 
     WHERE uv.user_id = $1 
     ORDER BY uv.created_at DESC`,
    [session.userId]
  );
  const myRedeemedVouchers = userVouchers;

  // 18. Aggregate e-RAT Vote Results
  const { rows: voteAggregates } = await db.query(
    `SELECT agenda_id, voted_option, COUNT(*)::int as count 
     FROM ${p('rat_votes')} 
     GROUP BY agenda_id, voted_option`
  );

  // 19. Village Circular Economy Metrics
  const { rows: ecoPoints } = await db.query(`SELECT COALESCE(SUM(total_points), 0)::int as total_points FROM ${p('user_points')}`);
  const { rows: ecoVouchers } = await db.query(`SELECT COUNT(*)::int as total_redeemed FROM ${p('user_vouchers')}`);
  const { rows: ecoMembers } = await db.query(`SELECT COUNT(*)::int as member_count FROM ${p('app_users')} WHERE role = 'anggota' AND status = 'active'`);
  
  const villageEcoSummary = {
    total_points: ecoPoints[0].total_points,
    total_redeemed: ecoVouchers[0].total_redeemed,
    member_count: ecoMembers[0].member_count,
  };

  // 20. Load Real-time Financial Reports (Neraca & SHU)
  let financialSummary = null;
  if (session.koperasiRef) {
    const { rows: piutang } = await db.query(
      `SELECT COALESCE(SUM(amount), 0)::int as total FROM ${p('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 AND type = 'pinjaman' AND status = 'disetujui'`,
      [session.koperasiRef]
    );

    const { rows: simpok } = await db.query(
      `SELECT COALESCE(SUM(amount), 0)::int as total FROM ${p('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 AND type = 'simpanan_pokok' AND status = 'disetujui'`,
      [session.koperasiRef]
    );

    const { rows: simwajib } = await db.query(
      `SELECT COALESCE(SUM(amount), 0)::int as total FROM ${p('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 AND type = 'simpanan_wajib' AND status = 'disetujui'`,
      [session.koperasiRef]
    );

    const { rows: simsukarela } = await db.query(
      `SELECT COALESCE(SUM(amount), 0)::int as total FROM ${p('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 AND type = 'simpanan_sukarela' AND status = 'disetujui'`,
      [session.koperasiRef]
    );

    const { rows: pem } = await db.query(
      `SELECT COALESCE(SUM(amount), 0)::int as total FROM ${p('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 AND type = 'pemasukan' AND status = 'disetujui'`,
      [session.koperasiRef]
    );

    const { rows: peng } = await db.query(
      `SELECT COALESCE(SUM(amount), 0)::int as total FROM ${p('transaksi_keuangan')} 
       WHERE koperasi_ref = $1 AND type = 'pengeluaran' AND status = 'disetujui'`,
      [session.koperasiRef]
    );

    financialSummary = {
      piutang_anggota: piutang[0].total,
      simpanan_pokok: simpok[0].total,
      simpanan_wajib: simwajib[0].total,
      simpanan_sukarela: simsukarela[0].total,
      pemasukan_kas: pem[0].total,
      pengeluaran_kas: peng[0].total,
    };
  }

  // 21. Load funding proposals (for cooperative)
  let proposals: any[] = [];
  if (session.koperasiRef) {
    const { rows } = await db.query(
      `SELECT * FROM ${p('pengajuan_pembiayaan')} 
       WHERE koperasi_ref = $1 
       ORDER BY dibuat_pada DESC`,
      [session.koperasiRef]
    );
    proposals = rows;
  }

  // 22. Load user's weekly mission progress
  let weeklyMissionsProgress = {
    misi1: { progress: 0, target: 10000, completed: false, claimed: false }, // Simpanan Sukarela Rutin
    misi2: { progress: 0, target: 1, completed: false, claimed: false },     // Suara Demokrasi (Vote RAT)
    misi3: { progress: 0, target: 50000, completed: false, claimed: false }, // Belanja Warung KUD
    misi4: { progress: 0, target: 1, completed: false, claimed: false },     // Cerdas Koperasi
  };

  try {
    // A. Query claimed missions for this week
    const { rows: claims } = await db.query(
      `SELECT mission_code FROM ${p('weekly_missions_claim')} 
       WHERE user_id = $1 AND week_start = DATE_TRUNC('week', CURRENT_DATE)`,
      [session.userId]
    );
    const claimedCodes = claims.map(c => c.mission_code);

    // B. Misi 1: Simpanan Sukarela Rutin
    const { rows: r1 } = await db.query(
      `SELECT COALESCE(SUM(amount), 0)::int as total FROM ${p('transaksi_keuangan')} 
       WHERE input_by = $1 AND type = 'simpanan_sukarela' AND status = 'disetujui'
       AND created_at >= DATE_TRUNC('week', CURRENT_DATE)`,
      [session.userId]
    );
    const progress1 = Number(r1[0]?.total || 0);
    weeklyMissionsProgress.misi1 = {
      progress: progress1,
      target: 10000,
      completed: progress1 >= 10000,
      claimed: claimedCodes.includes('misi1')
    };

    // C. Misi 2: Suara Demokrasi (Vote RAT)
    const { rows: r2 } = await db.query(
      `SELECT COUNT(*)::int as count FROM ${p('rat_votes')} 
       WHERE user_id = $1 AND voted_at >= DATE_TRUNC('week', CURRENT_DATE)`,
      [session.userId]
    );
    const progress2 = Number(r2[0]?.count || 0);
    weeklyMissionsProgress.misi2 = {
      progress: progress2,
      target: 1,
      completed: progress2 >= 1,
      claimed: claimedCodes.includes('misi2')
    };

    // D. Misi 3: Belanja Sembako KUD
    const { rows: memberRows } = await db.query(
      `SELECT anggota_ref FROM ${p('anggota_koperasi')} WHERE ktp_number = $1`,
      [session.ktpNumber]
    );
    const memberRef = memberRows[0]?.anggota_ref;
    let progress3 = 0;
    if (memberRef) {
      const { rows: r3 } = await db.query(
        `SELECT COALESCE(SUM(amount), 0)::int as total FROM ${p('transaksi_keuangan')} 
         WHERE anggota_ref = $1 AND type = 'pemasukan' AND kategori = 'distribusi_pangan' AND status = 'disetujui'
         AND created_at >= DATE_TRUNC('week', CURRENT_DATE)`,
        [memberRef]
      );
      progress3 = Number(r3[0]?.total || 0);
    }
    weeklyMissionsProgress.misi3 = {
      progress: progress3,
      target: 50000,
      completed: progress3 >= 50000,
      claimed: claimedCodes.includes('misi3')
    };

    // E. Misi 4: Cerdas Koperasi (Literasi)
    const { rows: r4 } = await db.query(
      `SELECT COUNT(*)::int as count FROM ${p('user_progress')} 
       WHERE user_id = $1 AND status = 'selesai' 
       AND completed_at >= DATE_TRUNC('week', CURRENT_DATE)`,
      [session.userId]
    );
    const progress4 = Number(r4[0]?.count || 0);
    weeklyMissionsProgress.misi4 = {
      progress: progress4,
      target: 1,
      completed: progress4 >= 1,
      claimed: claimedCodes.includes('misi4')
    };
  } catch (err) {
    console.error('Error loading weekly missions progress:', err);
  }

  const propsToClient = serializeDates({
    session,
    currentTab,
    koperasi,
    kasSummary,
    complianceSummary,
    userPoints,
    totalKoperasiPoints,
    transactions,
    myApprovals,
    pendingMembers,
    riskLogs,
    modules,
    userProgress,
    notifications,
    ratVotingAgendas,
    myVotes,
    aspirations,
    myUpvotes,
    vouchers,
    myRedeemedVouchers,
    voteAggregates,
    villageEcoSummary,
    financialSummary,
    proposals,
    weeklyMissionsProgress
  });

  return <DashboardClient {...propsToClient} />;
}
