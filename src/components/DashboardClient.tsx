'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Shield, 
  X, 
  Landmark 
} from 'lucide-react';

// Import Modular Tab Components
import OverviewTab from './dashboard/OverviewTab';
import MemberSavingsTab from './dashboard/MemberSavingsTab';
import ComplianceTab from './dashboard/ComplianceTab';
import ApprovalsTab from './dashboard/ApprovalsTab';
import FinancialsTab from './dashboard/FinancialsTab';
import ERatTab from './dashboard/ERatTab';
import AspirationsTab from './dashboard/AspirationsTab';
import LearningTab from './dashboard/LearningTab';
import RewardsTab from './dashboard/RewardsTab';
import TransactionsTab from './dashboard/TransactionsTab';
import AiAssistantTab from './dashboard/AiAssistantTab';
import MicrositeTab from './dashboard/MicrositeTab';
import ProposalsTab from './dashboard/ProposalsTab';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';

interface DashboardClientProps {
  session: any;
  currentTab: string;
  koperasi: any;
  kasSummary: any;
  complianceSummary: any;
  healthMetrics: any;
  userPoints: any;
  totalKoperasiPoints: number;
  transactions: any[];
  myApprovals: any[];
  pendingMembers: any[];
  riskLogs: any[];
  modules: any[];
  userProgress: any[];
  notifications: any[];
  ratVotingAgendas: any[];
  myVotes: any[];
  aspirations: any[];
  myUpvotes: any[];
  vouchers: any[];
  myRedeemedVouchers: any[];
  voteAggregates: any[];
  villageEcoSummary: any;
  financialSummary: any;
  proposals: any[];
  weeklyMissionsProgress: any;
  memberSavings: any[];
}

export default function DashboardClient({
  session,
  currentTab,
  koperasi,
  kasSummary,
  complianceSummary,
  healthMetrics,
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
  weeklyMissionsProgress,
  memberSavings
}: DashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Tabs state
  const [activeTab, setActiveTab] = useState(currentTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [savingsSearch, setSavingsSearch] = useState('');
  
  // Transaction Form state
  const [txType, setTxType] = useState<'pemasukan' | 'pengeluaran' | 'simpanan_pokok' | 'simpanan_wajib' | 'simpanan_sukarela' | 'pinjaman' | 'bagi_hasil'>('pemasukan');
  const [txSumber, setTxSumber] = useState<'dana_desa' | 'non_dana_desa'>('non_dana_desa');
  const [txKategori, setTxKategori] = useState<'operasional' | 'pembangunan_fisik' | 'distribusi_pangan' | 'simpanan_anggota' | 'lainnya'>('operasional');
  const [txAmount, setTxAmount] = useState('');
  const [txDescription, setTxDescription] = useState('');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [txEvidence, setTxEvidence] = useState('');
  const [txTenor, setTxTenor] = useState('');
  const [txBunga, setTxBunga] = useState('6.0');
  const [txAnggotaRef, setTxAnggotaRef] = useState('');

  // Custom Dialog Component state (Replacing browser alert and confirm)
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Points and weekly missions state
  const [pointsBalance, setPointsBalance] = useState(userPoints?.total_points ? Number(userPoints.total_points) : 0);
  const [missionsState, setMissionsState] = useState(weeklyMissionsProgress || {});
  const [missionClaimPending, setMissionClaimPending] = useState<string | null>(null);

  const handleClaimMission = async (missionCode: string, pointsAwarded: number) => {
    if (missionClaimPending) return;
    setMissionClaimPending(missionCode);

    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mission_code: missionCode,
          points_awarded: pointsAwarded
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Gagal mengklaim poin misi.');
      }

      setPointsBalance(prev => prev + pointsAwarded);
      setMissionsState((prev: any) => ({
        ...prev,
        [missionCode]: {
          ...prev[missionCode],
          claimed: true
        }
      }));

      setDialog({
        isOpen: true,
        type: 'success',
        title: 'Misi Diklaim!',
        message: `Selamat! Anda berhasil mengklaim ${pointsAwarded} Poin untuk misi mingguan ini. Kumpulkan lebih banyak poin untuk ditukarkan dengan kupon belanja di Gerai Kopdes.`
      });
    } catch (err: any) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Klaim Gagal',
        message: err.message
      });
    } finally {
      setMissionClaimPending(null);
    }
  };

  const showDialog = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setDialog({ isOpen: true, type, title, message });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void, confirmText = 'Lanjutkan', cancelText = 'Batal') => {
    setDialog({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      confirmText,
      cancelText,
      onConfirm
    });
  };

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Transaction Form error/success alerts via Dialog
  const [txFormError, setTxFormError] = useState<string | null>(null);

  // Approval decision state
  const [approvalNote, setApprovalNote] = useState<{ [key: string]: string }>({});
  
  // Resolve Risk state
  const [riskNote, setRiskNote] = useState<{ [key: string]: string }>({});

  // Evidence urls for PMK compliance corrections
  const [evidenceUrls, setEvidenceUrls] = useState<{ [key: string]: string }>({});

  // Active Lesson state (for modal)
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizResult, setQuizResult] = useState<string | null>(null);

  // e-RAT state
  const [selectedVotes, setSelectedVotes] = useState<{ [key: string]: string }>({});

  // Aspirations state
  const [aspTitle, setAspTitle] = useState('');
  const [aspDesc, setAspDesc] = useState('');
  const [aspResponse, setAspResponse] = useState<{ [key: string]: string }>({});
  const [aspFilter, setAspFilter] = useState<'semua' | 'pending' | 'responded'>('semua');

  // Pagination states
  const [txPage, setTxPage] = useState(1);
  const txPerPage = 5;
  const [riskPage, setRiskPage] = useState(1);
  const riskPerPage = 3;
  const [aspPage, setAspPage] = useState(1);
  const aspPerPage = 4;

  // AI Chat state
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Halo! Saya adalah **Asisten AI Kepatuhan Kopdes**. Saya dapat menganalisis data kepatuhan koperasi Anda secara real-time dan memberikan saran regulasi PMK/UU Perkoperasian. Silakan tanyakan sesuatu kepada saya!' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiPending, setAiPending] = useState(false);
  const [aiAuditReport, setAiAuditReport] = useState<string | null>(null);
  const [aiAuditPending, setAiAuditPending] = useState(false);

  // Proposal Form state
  const [proposalPj, setProposalPj] = useState(session.fullName || '');
  const [proposalPhone, setProposalPhone] = useState(session.phoneNumber || '');
  const [proposalNominal, setProposalNominal] = useState('');
  const [proposalTenor, setProposalTenor] = useState('12');
  const [proposalTujuan, setProposalTujuan] = useState('');
  const [proposalPending, setProposalPending] = useState(false);
  const [proposalsList, setProposalsList] = useState<any[]>(proposals || []);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalNominal || !proposalTujuan) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Formulir Tidak Lengkap',
        message: 'Mohon isi nominal permohonan dan tujuan permohonan pembiayaan.'
      });
      return;
    }

    setProposalPending(true);
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          penanggung_jawab: proposalPj,
          nomor_penanggung_jawab: proposalPhone,
          nominal_permohonan: proposalNominal,
          tenor: proposalTenor,
          tujuan_permohonan: proposalTujuan
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Gagal mengajukan pembiayaan.');
      }

      setProposalsList([data.proposal, ...proposalsList]);
      setProposalNominal('');
      setProposalTujuan('');
      setDialog({
        isOpen: true,
        type: 'success',
        title: 'Pengajuan Terkirim',
        message: `Permohonan pembiayaan Anda (${data.proposal.pengajuan_pembiayaan_ref}) telah berhasil dikirim ke portal Kementerian Koperasi (SIMKOPDES) untuk direview.`
      });
    } catch (err: any) {
      setDialog({
        isOpen: true,
        type: 'error',
        title: 'Gagal Pengajuan',
        message: err.message
      });
    } finally {
      setProposalPending(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard?tab=${tab}`);
  };

  const handleSendAiMessage = async (text: string) => {
    if (!text.trim() || aiPending) return;

    setAiMessages(prev => [...prev, { sender: 'user', text }]);
    setAiInput('');
    setAiPending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (data.reply) {
        setAiMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
      } else if (data.error) {
        setAiMessages(prev => [...prev, { sender: 'ai', text: `Error: ${data.error}` }]);
      }
    } catch (err) {
      setAiMessages(prev => [...prev, { sender: 'ai', text: 'Error: Gagal menghubungi server asisten AI.' }]);
    } finally {
      setAiPending(false);
    }
  };

  const handleRunAiAudit = async () => {
    if (aiAuditPending) return;
    setAiAuditPending(true);
    setAiAuditReport(null);

    try {
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.report) {
        setAiAuditReport(data.report);
      } else if (data.error) {
        showDialog('error', 'Audit Gagal', data.error);
      }
    } catch (err) {
      showDialog('error', 'Kesalahan', 'Gagal menjalankan audit AI.');
    } finally {
      setAiAuditPending(false);
    }
  };

  // Submit Transaction
  const handleCreateTransaction = async (submitImmediately: boolean) => {
    setTxFormError(null);

    if (!txAmount || Number(txAmount) <= 0) {
      setTxFormError('Nominal transaksi harus lebih besar dari 0.');
      return;
    }

    if (!txDescription.trim()) {
      setTxFormError('Keterangan transaksi wajib diisi.');
      return;
    }

    if (txType === 'pengeluaran' && txKategori === 'simpanan_anggota') {
      if (!txAnggotaRef) {
        setTxFormError('Referensi anggota wajib ditentukan untuk penarikan simpanan.');
        return;
      }
      const m = memberSavings.find(member => member.anggota_ref === txAnggotaRef);
      if (!m) {
        setTxFormError('Referensi anggota tidak valid. Pastikan format MBR-XXX benar.');
        return;
      }
      if (Number(txAmount) > Number(m.simpanan_sukarela)) {
        setTxFormError(`Pencairan ditolak: Saldo Simpanan Sukarela tidak mencukupi. (Tersedia: Rp ${Number(m.simpanan_sukarela).toLocaleString('id-ID')})`);
        return;
      }
    }

    const proceed = () => {
      startTransition(async () => {
        try {
          const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: txType,
              sumber_dana: txSumber,
              kategori: txKategori,
              amount: Number(txAmount),
              description: txDescription,
              evidence_url: txEvidence,
              transaction_date: txDate,
              anggota_ref: txAnggotaRef || null,
              tenor_bulan: txType === 'pinjaman' ? Number(txTenor) : null,
              bunga_persen: txType === 'pinjaman' ? Number(txBunga) : null,
              submit_immediately: submitImmediately
            })
          });

          const data = await res.json();
          if (data.error) {
            showDialog('error', 'Gagal Mencatat Transaksi', data.error);
          } else {
            showDialog(
              'success', 
              'Berhasil', 
              submitImmediately 
                ? 'Transaksi berhasil dicatat dan diajukan untuk approval pengurus.' 
                : 'Transaksi berhasil disimpan sebagai DRAFT.'
            );
            setTxAmount('');
            setTxDescription('');
            setTxEvidence('');
            setTxTenor('');
            setTxAnggotaRef('');
            router.refresh();
          }
        } catch (err) {
          showDialog('error', 'Kesalahan', 'Terjadi kesalahan jaringan.');
        }
      });
    };

    if (Number(txAmount) > 5000000 && !txEvidence.trim() && submitImmediately) {
      showConfirm(
        'Ketiadaan Bukti Transaksi',
        'Peringatan: Transaksi di atas Rp5.000.000 wajib menyertakan Bukti (Evidence URL) untuk disetujui. Apakah Anda tetap ingin mengajukan transaksi ini?',
        proceed,
        'Ya, Tetap Ajukan',
        'Batal'
      );
    } else {
      proceed();
    }
  };

  // Submit Draft
  const handleSubmitDraft = async (txId: string) => {
    showConfirm(
      'Ajukan Transaksi',
      'Apakah Anda yakin ingin mengajukan draft transaksi ini untuk proses approval?',
      async () => {
        startTransition(async () => {
          try {
            const res = await fetch('/api/transactions/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ transaction_id: txId })
            });
            const data = await res.json();
            if (data.error) {
              showDialog('error', 'Pengajuan Gagal', data.error);
            } else {
              showDialog('success', 'Berhasil Diajukan', 'Draft transaksi berhasil diajukan untuk approval.');
              router.refresh();
            }
          } catch (err) {
            showDialog('error', 'Kesalahan', 'Gagal memproses pengajuan.');
          }
        });
      }
    );
  };

  // Handle Approval Action
  const handleDecideApproval = async (approvalId: string, status: 'disetujui' | 'ditolak') => {
    const note = approvalNote[approvalId] || '';
    if (status === 'ditolak' && !note.trim()) {
      showDialog('warning', 'Alasan Diperlukan', 'Catatan alasan penolakan wajib diisi.');
      return;
    }

    const actionText = status === 'disetujui' ? 'menyetujui' : 'menolak';
    showConfirm(
      'Konfirmasi Otorisasi',
      `Apakah Anda yakin ingin ${actionText} transaksi ini?`,
      async () => {
        startTransition(async () => {
          try {
            const res = await fetch('/api/approvals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                approval_id: approvalId,
                status,
                catatan: note
              })
            });
            const data = await res.json();
            if (data.error) {
              showDialog('error', 'Otorisasi Gagal', data.error);
            } else {
              showDialog('success', 'Otorisasi Berhasil', `Transaksi berhasil ${status}.`);
              router.refresh();
            }
          } catch (err) {
            showDialog('error', 'Kesalahan', 'Gagal memproses persetujuan.');
          }
        });
      }
    );
  };

  // Resolve Risk Flag
  const handleResolveRisk = async (riskId: string) => {
    const note = riskNote[riskId] || '';
    if (!note.trim()) {
      showDialog('warning', 'Catatan Diperlukan', 'Catatan tindakan penyelesaian / resolusi wajib diisi.');
      return;
    }

    showConfirm(
      'Tindak Lanjuti Pelanggaran',
      'Apakah Anda yakin catatan tindak lanjut ini sudah sesuai dengan resolusi PMK?',
      async () => {
        startTransition(async () => {
          try {
            const res = await fetch('/api/risk-logs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                risk_log_id: riskId,
                resolved_note: note
              })
            });
            const data = await res.json();
            if (data.error) {
              showDialog('error', 'Gagal Tindak Lanjut', data.error);
            } else {
              showDialog('success', 'Berhasil Diselesaikan', 'Temuan kepatuhan berhasil ditandai sebagai diselesaikan.');
              router.refresh();
            }
          } catch (err) {
            showDialog('error', 'Kesalahan', 'Gagal memproses data.');
          }
        });
      }
    );
  };

  // Update Evidence URL in Compliance Tab
  const handleUpdateEvidence = async (txId: string, url: string) => {
    if (!url.trim()) {
      showDialog('warning', 'Link Diperlukan', 'Link/URL bukti fisik wajib diisi.');
      return;
    }

    showConfirm(
      'Perbarui Bukti Fisik',
      'Apakah Anda yakin ingin menambahkan bukti fisik ini ke transaksi? Sistem akan secara otomatis mengevaluasi ulang kepatuhan PMK.',
      async () => {
        startTransition(async () => {
          try {
            const res = await fetch('/api/transactions/update-evidence', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transaction_id: txId,
                evidence_url: url
              })
            });
            const data = await res.json();
            if (data.error) {
              showDialog('error', 'Gagal Memperbarui', data.error);
            } else {
              showDialog('success', 'Berhasil Diperbarui', 'Bukti fisik berhasil diperbarui dan audit ulang berhasil diselesaikan.');
              router.refresh();
            }
          } catch (err) {
            showDialog('error', 'Kesalahan', 'Gagal memproses data.');
          }
        });
      }
    );
  };

  // Delete Transaction in Compliance Tab
  const handleDeleteTransaction = async (txId: string) => {
    showConfirm(
      'Batalkan & Hapus Transaksi',
      'Apakah Anda yakin ingin membatalkan transaksi ini? Transaksi beserta temuan pelanggarannya akan dihapus secara permanen dari sistem.',
      async () => {
        startTransition(async () => {
          try {
            const res = await fetch('/api/transactions/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transaction_id: txId
              })
            });
            const data = await res.json();
            if (data.error) {
              showDialog('error', 'Gagal Menghapus', data.error);
            } else {
              showDialog('success', 'Transaksi Dibatalkan', 'Transaksi dan laporan pelanggaran terkait berhasil dihapus dari sistem.');
              router.refresh();
            }
          } catch (err) {
            showDialog('error', 'Kesalahan', 'Gagal memproses data.');
          }
        });
      }
    );
  };

  // Approve Pending Member
  const handleVerifyMember = async (userId: string, action: 'approve' | 'reject') => {
    let reason = '';
    if (action === 'reject') {
      const inputReason = prompt('Masukkan alasan penolakan pendaftaran:');
      if (inputReason === null) return;
      reason = inputReason;
    }

    showConfirm(
      'Verifikasi Anggota',
      `Apakah Anda yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} pendaftaran warga ini?`,
      async () => {
        startTransition(async () => {
          try {
            const res = await fetch('/api/members', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: userId,
                action,
                reason
              })
            });
            const data = await res.json();
            if (data.error) {
              showDialog('error', 'Gagal Verifikasi', data.error);
            } else {
              showDialog('success', 'Verifikasi Selesai', `Pendaftaran berhasil ${action === 'approve' ? 'disetujui' : 'ditolak'}.`);
              router.refresh();
            }
          } catch (err) {
            showDialog('error', 'Kesalahan', 'Gagal memproses verifikasi.');
          }
        });
      }
    );
  };

  // Start learning module
  const handleStartLesson = async (mod: any) => {
    setActiveLesson(mod);
    setQuizAnswers({});
    setQuizResult(null);

    const progress = userProgress.find(p => p.module_id === mod.id);
    if (!progress || progress.status === 'belum') {
      try {
        await fetch('/api/learning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ module_id: mod.id, action: 'start' })
        });
        router.refresh();
      } catch (err) {
        console.error('Failed to log module start:', err);
      }
    }
  };

  // Submit quiz
  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLesson.quiz_json?.questions) return;

    const questions = activeLesson.quiz_json.questions;
    let correctCount = 0;
    
    questions.forEach((q: any, idx: number) => {
      if (quizAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    
    if (score >= 70) {
      setQuizResult(`Selamat! Anda LULUS dengan skor ${score}%. Poin literasi berhasil diklaim!`);
      try {
        await fetch('/api/learning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            module_id: activeLesson.id, 
            action: 'complete', 
            quiz_score: score 
          })
        });
        router.refresh();
      } catch (err) {
        console.error('Failed to log module completion:', err);
      }
    } else {
      setQuizResult(`Skor Anda ${score}%. Anda butuh minimal 70% untuk lulus. Silakan coba lagi.`);
    }
  };

  // Cast e-RAT Vote
  const handleCastVote = async (agendaId: string) => {
    const option = selectedVotes[agendaId];
    if (!option) {
      showDialog('warning', 'Pilih Suara', 'Silakan pilih opsi suara Anda terlebih dahulu.');
      return;
    }

    showConfirm(
      'Salurkan Hak Suara',
      `Apakah Anda yakin ingin menyalurkan suara "${option}" untuk agenda ini? Pilihan suara e-RAT bersifat rahasia dan permanen.`,
      async () => {
        startTransition(async () => {
          try {
            const res = await fetch('/api/rat/vote', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ agenda_id: agendaId, voted_option: option })
            });
            const data = await res.json();
            if (data.error) {
              showDialog('error', 'Gagal Voting', data.error);
            } else {
              showDialog('success', 'Suara Disalurkan', 'Terima kasih, hak suara demokratis Anda berhasil dicatat secara sah di e-RAT.');
              router.refresh();
            }
          } catch (err) {
            showDialog('error', 'Kesalahan', 'Gagal mengirim hak suara.');
          }
        });
      }
    );
  };

  // Promote Aspiration to RAT (Musrenbang Flow)
  const handlePromoteAspiration = async (aspId: string) => {
    showConfirm(
      'Musyawarah Program Desa',
      'Apakah Anda yakin usulan program pembangunan dari warga ini sudah layak ditingkatkan menjadi Agenda Voting resmi di e-RAT untuk diputuskan oleh rapat anggota?',
      async () => {
        startTransition(async () => {
          try {
            const res = await fetch('/api/aspirations/promote', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ aspiration_id: aspId })
            });
            const data = await res.json();
            if (data.error) {
              showDialog('error', 'Gagal Peningkatan', data.error);
            } else {
              showDialog('success', 'Musrenbang Berhasil', 'Usulan warga berhasil ditingkatkan menjadi Agenda Rapat Anggota e-RAT desa.');
              router.refresh();
            }
          } catch (err) {
            showDialog('error', 'Kesalahan', 'Gagal memproses peningkatan.');
          }
        });
      }
    );
  };

  // Submit Suggestion/Aspiration
  const handleCreateAspiration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aspTitle.trim() || !aspDesc.trim()) {
      showDialog('warning', 'Isian Kurang', 'Judul usulan dan deskripsi aspirasi wajib diisi.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/aspirations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', title: aspTitle, description: aspDesc })
        });
        const data = await res.json();
        if (data.error) {
          showDialog('error', 'Gagal Mengirim', data.error);
        } else {
          showDialog('success', 'Aspirasi Terkirim', 'Aspirasi Anda berhasil diunggah ke forum musyawarah warga.');
          setAspTitle('');
          setAspDesc('');
          router.refresh();
        }
      } catch (err) {
        showDialog('error', 'Kesalahan', 'Gagal mengunggah aspirasi.');
      }
    });
  };

  // Upvote Aspiration
  const handleUpvoteAspiration = async (aspId: string) => {
    try {
      const res = await fetch('/api/aspirations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upvote', aspiration_id: aspId })
      });
      const data = await res.json();
      if (data.error) {
        showDialog('info', 'Dukungan', data.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      showDialog('error', 'Kesalahan', 'Gagal mengirim dukungan.');
    }
  };

  // Respond Aspiration (Pengurus/Ketua)
  const handleRespondAspiration = async (aspId: string) => {
    const reply = aspResponse[aspId] || '';
    if (!reply.trim()) {
      showDialog('warning', 'Jawaban Kosong', 'Tanggapan resmi pengurus wajib diisi.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/aspirations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'respond', aspiration_id: aspId, admin_response: reply })
        });
        const data = await res.json();
        if (data.error) {
          showDialog('error', 'Gagal Menanggapi', data.error);
        } else {
          showDialog('success', 'Tanggapan Terkirim', 'Tanggapan resmi pengurus berhasil diunggah.');
          setAspResponse({ ...aspResponse, [aspId]: '' });
          router.refresh();
        }
      } catch (err) {
        showDialog('error', 'Kesalahan', 'Gagal menanggapi aspirasi.');
      }
    });
  };

  // Redeem Points for Voucher
  const handleRedeemVoucher = async (voucherId: string) => {
    showConfirm(
      'Klaim Voucher Belanja',
      'Apakah Anda yakin ingin menukarkan poin literasi Anda untuk kupon belanja Gerai Desa ini?',
      async () => {
        startTransition(async () => {
          try {
            const voucher = vouchers.find(v => v.id === voucherId);
            const cost = voucher ? Number(voucher.points_cost) : 0;

            const res = await fetch('/api/rewards/redeem', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ voucher_id: voucherId })
            });
            const data = await res.json();
            if (data.error) {
              showDialog('error', 'Klaim Gagal', data.error);
            } else {
              setPointsBalance(prev => prev - cost);
              showDialog(
                'success', 
                'Penukaran Berhasil!', 
                `Sukses menukarkan poin! Kode kupon belanja Anda: ${data.code}. Silakan tunjukkan kode ini di kasir Gerai Desa.`
              );
              router.refresh();
            }
          } catch (err) {
            showDialog('error', 'Kesalahan', 'Gagal menukarkan voucher.');
          }
        });
      }
    );
  };

  // Distribute SHU based on member points
  const handleDistributeShu = async () => {
    showConfirm(
      'Bagikan SHU Koperasi',
      `Apakah Anda yakin ingin membagikan sisa hasil usaha (SHU) berjalan sebesar ${fmt(sisaHasilUsaha)} kepada seluruh anggota terdaftar secara proporsional sesuai poin partisipasi mereka?`,
      async () => {
        startTransition(async () => {
          try {
            const res = await fetch('/api/financials/distribute-shu', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.error) {
              showDialog('error', 'Pembagian Gagal', data.error);
            } else {
              showDialog(
                'success',
                'SHU Didistribusikan!',
                `Sukses membagikan SHU sebesar ${fmt(data.distributedAmount)} kepada ${data.membersCount} anggota yang berpartisipasi aktif.`
              );
              router.refresh();
            }
          } catch (err) {
            showDialog('error', 'Kesalahan', 'Gagal memproses pembagian SHU.');
          }
        });
      }
    );
  };

  // Format currency
  const fmt = (num: any) => {
    if (num === undefined || num === null) return 'Rp0';
    return 'Rp' + Number(num).toLocaleString('id-ID');
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#15803d] dark:text-[#22c55e]';
    if (score >= 50) return 'text-[#b45309] dark:text-[#f59e0b]';
    return 'text-[#dc2626] dark:text-[#f87171]';
  };

  const getRiskLevelBadge = (level: string) => {
    if (level === 'berisiko_tinggi') {
      return <span className="inline-flex px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-extrabold uppercase border border-red-200">Risiko Tinggi</span>;
    }
    if (level === 'perlu_perhatian') {
      return <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold uppercase border border-amber-200">Perlu Perhatian</span>;
    }
    return <span className="inline-flex px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-extrabold uppercase border border-green-200">Aman</span>;
  };

  const filteredAspirations = aspirations.filter(asp => {
    if (aspFilter === 'pending') return !asp.admin_response;
    if (aspFilter === 'responded') return !!asp.admin_response;
    return true;
  });

  // Calculate Neraca Totals
  const saldoKasVal = kasSummary?.saldo_kas ? Number(kasSummary.saldo_kas) : 0;
  const piutangVal = financialSummary?.piutang_anggota ? Number(financialSummary.piutang_anggota) : 0;
  const totalAset = saldoKasVal + piutangVal;

  const simpokVal = financialSummary?.simpanan_pokok ? Number(financialSummary.simpanan_pokok) : 0;
  const simwajibVal = financialSummary?.simpanan_wajib ? Number(financialSummary.simpanan_wajib) : 0;
  const simsukarelaVal = financialSummary?.simpanan_sukarela ? Number(financialSummary.simpanan_sukarela) : 0;
  const modalAwalVal = koperasi?.modal_awal ? Number(koperasi.modal_awal) : 250000000;
  const totalPasiva = simpokVal + simwajibVal + simsukarelaVal + modalAwalVal;

  const totalPendapatan = financialSummary?.pemasukan_kas ? Number(financialSummary.pemasukan_kas) : 0;
  const totalBeban = financialSummary?.pengeluaran_kas ? Number(financialSummary.pengeluaran_kas) : 0;
  const sisaHasilUsaha = totalPendapatan - totalBeban;

  // Paginated lists
  const totalTxPages = Math.ceil(transactions.length / txPerPage);
  const paginatedTransactions = transactions.slice((txPage - 1) * txPerPage, txPage * txPerPage);

  const totalRiskPages = Math.ceil(riskLogs.length / riskPerPage);
  const paginatedRiskLogs = riskLogs.slice((riskPage - 1) * riskPerPage, riskPage * riskPerPage);

  const totalAspPages = Math.ceil(filteredAspirations.length / aspPerPage);
  const paginatedAspirations = filteredAspirations.slice((aspPage - 1) * aspPerPage, aspPage * aspPerPage);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FBF8F1] dark:bg-[#12110e] text-[#1c1917] font-sans transition-colors duration-300">
      
      {/* 1. DESKTOP NAVIGATION SIDEBAR (LEFT) */}
      <Sidebar
        session={session}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        myApprovals={myApprovals}
        riskLogs={riskLogs}
        logoutAction={logoutAction}
      />

      {/* 2. MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-stone-900/60 transition-opacity duration-300"
          />
          {/* Sidebar Drawer */}
          <aside className="relative flex flex-col w-64 max-w-xs h-full bg-[#104911] text-[#f4f3ef] border-r border-[#F9A620]/25 z-50 p-4 justify-between animate-slide-in-left">
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="pb-4 mb-4 border-b border-[#F9A620]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#F9A620] text-white rounded-xl flex items-center justify-center">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-sm uppercase text-white block">AmanDes</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1">
                <Sidebar
                  session={session}
                  activeTab={activeTab}
                  handleTabChange={handleTabChange}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                  myApprovals={myApprovals}
                  riskLogs={riskLogs}
                  logoutAction={logoutAction}
                />
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Sticky Topbar */}
        <Header
          activeTab={activeTab}
          session={session}
          koperasi={koperasi}
          healthMetrics={healthMetrics}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FBF8F1] dark:bg-[#12110e] scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-6">

            {activeTab === 'overview' && (
              <OverviewTab
                session={session}
                kasSummary={kasSummary}
                complianceSummary={complianceSummary}
                healthMetrics={healthMetrics}
                villageEcoSummary={villageEcoSummary}
                pointsBalance={pointsBalance}
                fmt={fmt}
                getHealthScoreColor={getHealthScoreColor}
              />
            )}

            {activeTab === 'member_savings' && (
              <MemberSavingsTab
                session={session}
                memberSavings={memberSavings}
                savingsSearch={savingsSearch}
                setSavingsSearch={setSavingsSearch}
                setTxType={setTxType}
                setTxKategori={setTxKategori}
                setTxAnggotaRef={setTxAnggotaRef}
                setTxDescription={setTxDescription}
                handleTabChange={handleTabChange}
                transactions={transactions}
                fmt={fmt}
              />
            )}

            {activeTab === 'transactions' && ['pengurus', 'ketua'].includes(session.role) && (
              <TransactionsTab
                session={session}
                txFormError={txFormError}
                txType={txType}
                setTxType={setTxType}
                txSumber={txSumber}
                setTxSumber={setTxSumber}
                txKategori={txKategori}
                setTxKategori={setTxKategori}
                txAmount={txAmount}
                setTxAmount={setTxAmount}
                txTenor={txTenor}
                setTxTenor={setTxTenor}
                txBunga={txBunga}
                setTxBunga={setTxBunga}
                txAnggotaRef={txAnggotaRef}
                setTxAnggotaRef={setTxAnggotaRef}
                txDescription={txDescription}
                setTxDescription={setTxDescription}
                txEvidence={txEvidence}
                setTxEvidence={setTxEvidence}
                txDate={txDate}
                setTxDate={setTxDate}
                handleCreateTransaction={handleCreateTransaction}
                transactions={transactions}
                paginatedTransactions={paginatedTransactions}
                txPage={txPage}
                setTxPage={setTxPage}
                totalTxPages={totalTxPages}
                handleSubmitDraft={handleSubmitDraft}
                memberSavings={memberSavings}
                isPending={isPending}
                fmt={fmt}
                getRiskLevelBadge={getRiskLevelBadge}
              />
            )}

            {activeTab === 'approvals' && ['pengurus', 'ketua'].includes(session.role) && (
              <ApprovalsTab
                session={session}
                pendingMembers={pendingMembers}
                handleVerifyMember={handleVerifyMember}
                myApprovals={myApprovals}
                approvalNote={approvalNote}
                setApprovalNote={setApprovalNote}
                handleDecideApproval={handleDecideApproval}
                getRiskLevelBadge={getRiskLevelBadge}
                fmt={fmt}
              />
            )}

            {activeTab === 'compliance' && ['pengurus', 'ketua', 'pendamping'].includes(session.role) && (
              <ComplianceTab
                session={session}
                healthMetrics={healthMetrics}
                riskLogs={riskLogs}
                paginatedRiskLogs={paginatedRiskLogs}
                riskNote={riskNote}
                setRiskNote={setRiskNote}
                handleResolveRisk={handleResolveRisk}
                evidenceUrls={evidenceUrls}
                setEvidenceUrls={setEvidenceUrls}
                handleUpdateEvidence={handleUpdateEvidence}
                handleDeleteTransaction={handleDeleteTransaction}
                riskPage={riskPage}
                setRiskPage={setRiskPage}
                totalRiskPages={totalRiskPages}
                fmt={fmt}
                getHealthScoreColor={getHealthScoreColor}
                getRiskLevelBadge={getRiskLevelBadge}
              />
            )}

            {activeTab === 'financials' && (
              <FinancialsTab
                session={session}
                koperasi={koperasi}
                kasSummary={kasSummary}
                financialSummary={financialSummary}
                totalKoperasiPoints={totalKoperasiPoints}
                pointsBalance={pointsBalance}
                handleDistributeShu={handleDistributeShu}
                isPending={isPending}
                fmt={fmt}
              />
            )}

            {activeTab === 'e_rat' && (
              <ERatTab
                ratVotingAgendas={ratVotingAgendas}
                myVotes={myVotes}
                voteAggregates={voteAggregates}
                selectedVotes={selectedVotes}
                setSelectedVotes={setSelectedVotes}
                handleCastVote={handleCastVote}
              />
            )}

            {activeTab === 'aspirations' && (
              <AspirationsTab
                session={session}
                filteredAspirations={filteredAspirations}
                paginatedAspirations={paginatedAspirations}
                aspFilter={aspFilter}
                setAspFilter={setAspFilter}
                aspTitle={aspTitle}
                setAspTitle={setAspTitle}
                aspDesc={aspDesc}
                setAspDesc={setAspDesc}
                myUpvotes={myUpvotes}
                aspResponse={aspResponse}
                setAspResponse={setAspResponse}
                handleCreateAspiration={handleCreateAspiration}
                handleUpvoteAspiration={handleUpvoteAspiration}
                handleRespondAspiration={handleRespondAspiration}
                handlePromoteAspiration={handlePromoteAspiration}
                isPending={isPending}
                aspPage={aspPage}
                setAspPage={setAspPage}
                totalAspPages={totalAspPages}
              />
            )}

            {activeTab === 'learning' && (
              <LearningTab
                pointsBalance={pointsBalance}
                modules={modules}
                userProgress={userProgress}
                handleStartLesson={handleStartLesson}
              />
            )}

            {activeTab === 'rewards' && (
              <RewardsTab
                pointsBalance={pointsBalance}
                totalKoperasiPoints={totalKoperasiPoints}
                missionsState={missionsState}
                missionClaimPending={missionClaimPending}
                handleClaimMission={handleClaimMission}
                vouchers={vouchers}
                userPoints={userPoints}
                handleRedeemVoucher={handleRedeemVoucher}
                myRedeemedVouchers={myRedeemedVouchers}
                isPending={isPending}
                fmt={fmt}
              />
            )}

            {activeTab === 'ai_assistant' && (
              <AiAssistantTab
                session={session}
                aiMessages={aiMessages}
                aiInput={aiInput}
                setAiInput={setAiInput}
                aiPending={aiPending}
                handleSendAiMessage={handleSendAiMessage}
                aiAuditPending={aiAuditPending}
                aiAuditReport={aiAuditReport}
                handleRunAiAudit={handleRunAiAudit}
              />
            )}

            {activeTab === 'microsite' && (
              <MicrositeTab
                koperasi={koperasi}
                villageEcoSummary={villageEcoSummary}
                financialSummary={financialSummary}
                complianceSummary={complianceSummary}
                fmt={fmt}
              />
            )}

            {activeTab === 'proposals' && ['pengurus', 'ketua'].includes(session.role) && (
              <ProposalsTab
                session={session}
                proposalPj={proposalPj}
                setProposalPj={setProposalPj}
                proposalPhone={proposalPhone}
                setProposalPhone={setProposalPhone}
                proposalNominal={proposalNominal}
                setProposalNominal={setProposalNominal}
                proposalTenor={proposalTenor}
                setProposalTenor={setProposalTenor}
                proposalTujuan={proposalTujuan}
                setProposalTujuan={setProposalTujuan}
                handleSubmitProposal={handleSubmitProposal}
                proposalPending={proposalPending}
                proposalsList={proposalsList}
                fmt={fmt}
              />
            )}

          </div>
        </main>
      </div>

      {/* Lesson Content & Quiz Modal */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-[#fcfbfa] dark:bg-[#1c1a17] max-w-2xl w-full rounded-3xl border border-[#F9A620]/30 overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-[#548C2F] text-white">
              <div>
                <span className="text-[10px] uppercase font-black text-stone-300 tracking-wider">Modul Pembelajaran Koperasi</span>
                <h3 className="text-sm font-black text-white">{activeLesson.title}</h3>
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm leading-relaxed text-[#1c1917] dark:text-stone-300">
              <div className="prose dark:prose-invert max-w-none text-stone-750 dark:text-stone-300">
                {activeLesson.content.split('\n\n').map((para: string, idx: number) => {
                  if (para.startsWith('# ')) {
                    return <h3 key={idx} className="text-lg font-black mt-4 mb-2 text-[#548C2F] dark:text-white border-b border-[#F9A620]/10 pb-1">{para.substring(2)}</h3>;
                  }
                  if (para.startsWith('## ')) {
                    return <h4 key={idx} className="text-base font-extrabold mt-3 mb-1.5 text-stone-800 dark:text-stone-250">{para.substring(3)}</h4>;
                  }
                  if (para.startsWith('* ')) {
                    return (
                      <ul key={idx} className="list-disc pl-5 my-2 space-y-1">
                        {para.split('\n').map((li, lidx) => (
                          <li key={lidx} className="font-medium">{li.substring(2)}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={idx} className="mb-3 font-medium">{para}</p>;
                })}
              </div>

              {activeLesson.quiz_json?.questions && (
                <div className="border-t border-stone-200 dark:border-stone-800 pt-6 space-y-4">
                  <h4 className="font-black text-stone-850 dark:text-stone-200 flex items-center gap-1.5 uppercase text-xs tracking-wider text-[#548C2F]">
                    <HelpCircle className="w-4 h-4 text-[#F9A620]" />
                    Lembar Ujian Kompetensi
                  </h4>

                  {quizResult && (
                    <div className={`p-4 rounded-2xl text-xs font-bold border ${
                      quizResult.includes('LULUS')
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 text-green-700'
                        : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 text-amber-700'
                    }`}>
                      {quizResult}
                    </div>
                  )}

                  <form onSubmit={handleQuizSubmit} className="space-y-6">
                    {activeLesson.quiz_json.questions.map((q: any, qIdx: number) => (
                      <div key={qIdx} className="space-y-2">
                        <p className="font-extrabold text-stone-800 dark:text-stone-200">
                          {qIdx + 1}. {q.question}
                        </p>
                        <div className="grid gap-2">
                          {q.options.map((opt: string) => (
                            <label
                              key={opt}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                quizAnswers[qIdx] === opt
                                  ? 'bg-[#548C2F]/10 border-[#548C2F] text-[#548C2F] font-bold shadow-sm'
                                  : 'bg-white dark:bg-[#1c1a17] border-stone-250 hover:bg-stone-50 dark:border-stone-800'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q_${qIdx}`}
                                value={opt}
                                checked={quizAnswers[qIdx] === opt}
                                onChange={(e) => setQuizAnswers({ ...quizAnswers, [qIdx]: opt })}
                                className="accent-[#548C2F] cursor-pointer"
                                required
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="py-2.5 px-6 bg-[#548C2F] hover:bg-[#427223] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow border border-[#F9A620]/20 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        Kirim Lembar Jawaban
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM DIALOG POPUP (NO CHROME ALERTS) */}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-[#fcfbfa] dark:bg-[#1c1a17] max-w-sm w-full rounded-3xl border border-[#F9A620]/30 overflow-hidden shadow-2xl p-6 space-y-4 text-center">
            
            <div className="flex items-center justify-center">
              {dialog.type === 'success' && (
                <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded-full">
                  <CheckCircle className="w-8 h-8" />
                </div>
              )}
              {dialog.type === 'error' && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-full">
                  <XCircle className="w-8 h-8" />
                </div>
              )}
              {dialog.type === 'warning' && (
                <div className="p-3 bg-amber-50 text-amber-700 border border-amber-250 rounded-full">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              )}
              {dialog.type === 'info' && (
                <div className="p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                  <HelpCircle className="w-8 h-8 text-[#548C2F]" />
                </div>
              )}
              {dialog.type === 'confirm' && (
                <div className="p-3 bg-[#548C2F]/10 text-[#548C2F] border border-[#F9A620]/30 rounded-full">
                  <Shield className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-stone-900 dark:text-white uppercase tracking-wider">{dialog.title}</h3>
              <p className="text-xs text-stone-500 font-semibold leading-relaxed">{dialog.message}</p>
            </div>

            <div className="pt-2 flex gap-3">
              {dialog.type === 'confirm' ? (
                <>
                  <button
                    onClick={closeDialog}
                    className="flex-1 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {dialog.cancelText || 'Batal'}
                  </button>
                  <button
                    onClick={() => {
                      closeDialog();
                      if (dialog.onConfirm) dialog.onConfirm();
                    }}
                    className="flex-1 py-2.5 bg-[#548C2F] hover:bg-[#427223] text-white border border-[#F9A620]/30 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    {dialog.confirmText || 'Lanjutkan'}
                  </button>
                </>
              ) : (
                <button
                  onClick={closeDialog}
                  className="w-full py-2.5 bg-[#548C2F] hover:bg-[#427223] text-white border border-[#F9A620]/30 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  Selesai
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
