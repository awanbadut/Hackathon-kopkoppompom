'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions';
import { 
  Shield, TrendingUp, TrendingDown, Coins, Activity, 
  FileText, Award, BookOpen, Users, LogOut, CheckCircle2, 
  XCircle, Clock, AlertTriangle, HelpCircle, FileCheck, Send, Check, X, ShieldAlert,
  ChevronRight, Bookmark, Vote, MessageSquare, ThumbsUp, Tag, Plus, MessageCircle,
  ArrowRightLeft, Landmark, BarChart3, Scale, ChevronDown, CheckCircle, Sparkles,
  Globe, Briefcase, Menu, Search
} from 'lucide-react';

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

  // Render sidebar navigation links dryly
  const renderNavLinks = () => {
    return (
      <div className="space-y-1.5">
        <button
          onClick={() => { handleTabChange('overview'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === 'overview'
              ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
              : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-[#F9A620]" />
            Ringkasan Utama
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        {['pengurus', 'ketua'].includes(session.role) && (
          <button
            onClick={() => { handleTabChange('transactions'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === 'transactions'
                ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
                : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#F9A620]" />
              Buku Kas (Ledger)
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        )}

        {['pengurus', 'ketua'].includes(session.role) && (
          <button
            onClick={() => { handleTabChange('member_savings'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === 'member_savings'
                ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
                : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-[#F9A620]" />
              Buku Simpanan Warga
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        )}

        {session.role === 'anggota' && (
          <button
            onClick={() => { handleTabChange('member_savings'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === 'member_savings'
                ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
                : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-[#F9A620]" />
              Simpanan Saya
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        )}

        {['pengurus', 'ketua'].includes(session.role) && (
          <button
            onClick={() => { handleTabChange('approvals'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === 'approvals'
                ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
                : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FileCheck className="w-4 h-4 text-[#F9A620]" />
              Kotak Otorisasi
            </span>
            {myApprovals.filter(a => a.status === 'menunggu').length > 0 ? (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black bg-red-650 text-white animate-pulse">
                {myApprovals.filter(a => a.status === 'menunggu').length}
              </span>
            ) : (
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            )}
          </button>
        )}

        {['pengurus', 'ketua', 'pendamping'].includes(session.role) && (
          <button
            onClick={() => { handleTabChange('compliance'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === 'compliance'
                ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
                : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#F9A620]" />
              Kepatuhan PMK
            </span>
            {riskLogs.length > 0 ? (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black bg-[#F9A620] text-white">
                {riskLogs.length}
              </span>
            ) : (
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            )}
          </button>
        )}

        <button
          onClick={() => { handleTabChange('financials'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === 'financials'
              ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
              : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4 text-[#F9A620]" />
            Laporan Keuangan
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => { handleTabChange('e_rat'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === 'e_rat'
              ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
              : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Vote className="w-4 h-4 text-[#F9A620]" />
            E-RAT (Rapat Anggota)
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => { handleTabChange('aspirations'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === 'aspirations'
              ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
              : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-[#F9A620]" />
            Musrenbang Warga
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => { handleTabChange('learning'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === 'learning'
              ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
              : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[#F9A620]" />
            Kelas Literasi
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => { handleTabChange('rewards'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === 'rewards'
              ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
              : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Tag className="w-4 h-4 text-[#F9A620]" />
            Hadiah Belanja
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => { handleTabChange('ai_assistant'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === 'ai_assistant'
              ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
              : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#F9A620]" />
            Asisten AI Kopdes
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => { handleTabChange('microsite'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === 'microsite'
              ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
              : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-[#F9A620]" />
            Microsite Publik
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        {['pengurus', 'ketua'].includes(session.role) && (
          <button
            onClick={() => { handleTabChange('proposals'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === 'proposals'
                ? 'bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md'
                : 'bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-[#F9A620]" />
              Kemitraan & Pembiayaan
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FBF8F1] dark:bg-[#12110e] text-[#1c1917] font-sans transition-colors duration-300">
      
      {/* 1. DESKTOP NAVIGATION SIDEBAR (LEFT) */}
      <aside className="hidden lg:flex w-64 h-full bg-[#104911] text-[#f4f3ef] border-r border-[#F9A620]/25 flex-col justify-between shrink-0 z-30">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo Brand */}
          <div className="p-5 border-b border-[#F9A620]/20 flex items-center gap-3">
            <div className="p-2 bg-[#F9A620] text-white rounded-xl shadow-inner flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight uppercase text-white block">AmanDes</span>
              <span className="text-[9px] text-emerald-300/70 block">Koperasi Merah Putih</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="p-4 flex-1">
            {renderNavLinks()}
          </nav>
        </div>

        {/* User Info bottom panel */}
        <div className="p-4 border-t border-[#F9A620]/20 bg-[#0c360c] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-[#F9A620] text-white flex items-center justify-center font-black text-xs shrink-0 shadow">
              {session.fullName.substring(0, 2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-black text-white block truncate leading-none mb-1">{session.fullName}</span>
              <span className="text-[8px] font-black uppercase bg-[#F9A620]/20 text-[#FFD449] px-1.5 py-0.5 rounded border border-[#F9A620]/10">{session.role}</span>
            </div>
          </div>
          <form action={logoutAction} className="shrink-0">
            <button
              type="submit"
              className="p-2 rounded-lg bg-red-950/20 hover:bg-red-700/20 border border-red-500/20 text-red-300 transition-all cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </aside>

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
                {renderNavLinks()}
              </nav>
            </div>
            
            <div className="pt-4 border-t border-[#F9A620]/20 bg-[#0c360c] -mx-4 -mb-4 p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-xl bg-[#F9A620] text-white flex items-center justify-center font-black text-xs shrink-0">
                  {session.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-black text-white block truncate leading-none mb-1">{session.fullName}</span>
                  <span className="text-[8px] font-black uppercase bg-[#F9A620]/20 text-[#FFD449] px-1.5 py-0.5 rounded">{session.role}</span>
                </div>
              </div>
              <form action={logoutAction}>
                <button type="submit" className="p-2 rounded-lg bg-red-950/20 text-red-300">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Sticky Topbar */}
        <header className="h-16 border-b border-stone-200 dark:border-stone-850 bg-white dark:bg-[#1c1a17] flex items-center justify-between px-6 shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xs font-black text-[#104911] dark:text-white uppercase tracking-wider">
                {activeTab === 'overview' && 'Ringkasan Utama'}
                {activeTab === 'transactions' && 'Buku Kas (Ledger)'}
                {activeTab === 'approvals' && 'Kotak Otorisasi'}
                {activeTab === 'compliance' && 'Pusat Kepatuhan PMK'}
                {activeTab === 'financials' && 'Laporan Keuangan'}
                {activeTab === 'e_rat' && 'Rapat Anggota (e-RAT)'}
                {activeTab === 'aspirations' && 'Musrenbang Warga'}
                {activeTab === 'learning' && 'Kelas Literasi'}
                {activeTab === 'rewards' && 'Katalog Hadiah'}
                {activeTab === 'ai_assistant' && 'Asisten AI Kopdes'}
                {activeTab === 'microsite' && 'Microsite Publik'}
                {activeTab === 'proposals' && 'Kemitraan & Pembiayaan'}
                {activeTab === 'member_savings' && (['pengurus', 'ketua'].includes(session.role) ? 'Buku Simpanan Warga' : 'Simpanan Saya')}
              </h1>
              <p className="text-[9px] text-stone-400 leading-none mt-0.5">
                {koperasi?.nama || 'Koperasi Desa Merah Putih'} &bull; {session.koperasiRef}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase bg-[#548C2F]/10 text-[#548C2F] dark:text-emerald-400 px-2.5 py-1 rounded-full border border-[#548C2F]/20">
                Skor Kesehatan: {healthMetrics?.kesehatan_koperasi ?? 100}%
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#FBF8F1] dark:bg-[#12110e] scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-6">

          {/* ======================================= */}
          {/* TAB 1: OVERVIEW                         */}
          {/* ======================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-[#548C2F] dark:text-white flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-[#F9A620]" />
                    Portal Partisipasi &amp; Keterlibatan Anggota (AmanDes &bull; Tema 3)
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 leading-normal max-w-xl">
                    Halo, <span className="font-bold">{session.fullName}</span>! Platform ini memfasilitasi keterlibatan aktif warga melalui e-RAT demokratis, transparansi laporan keuangan neraca &amp; SHU, serta gamifikasi belajar berhadiah insentif belanja.
                  </p>
                </div>
                
                {userPoints && (
                  <div className="flex items-center gap-3 bg-stone-50 dark:bg-[#23201b] px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 shrink-0">
                    <Award className="w-6 h-6 text-[#F9A620]" />
                    <div>
                      <div className="text-[9px] uppercase font-black tracking-wider text-stone-400">Poin Belanja</div>
                      <div className="text-base font-black text-[#548C2F] dark:text-white font-mono">{pointsBalance} PTS</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-black text-stone-400">Kas Riil Koperasi</span>
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-emerald-700">
                      <Coins className="w-4 h-4" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-[#548C2F] dark:text-white font-mono">
                    {session.role === 'pendamping' ? '🔒 TERBATAS' : fmt(kasSummary?.saldo_kas)}
                  </h2>
                  <p className="text-[9px] text-stone-400 leading-snug">
                    Total saldo kas fisik dari transaksi disetujui.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-black text-stone-400">Kesehatan Kas</span>
                    <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded-xl text-red-700">
                      <Scale className="w-4 h-4" />
                    </div>
                  </div>
                  <h2 className={`text-2xl font-black font-mono ${getHealthScoreColor(healthMetrics.kesehatan_kas)}`}>
                    {healthMetrics.kesehatan_kas}%
                  </h2>
                  <p className="text-[9px] text-stone-400 leading-snug">
                    Kesehatan likuiditas dan pencatatan nota kas.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-black text-stone-400">Kepatuhan PMK</span>
                    <div className="p-2 bg-stone-50 dark:bg-stone-900 rounded-xl text-[#F9A620]">
                      <Shield className="w-4 h-4" />
                    </div>
                  </div>
                  <h2 className={`text-2xl font-black font-mono ${getHealthScoreColor(healthMetrics.kepatuhan)}`}>
                    {healthMetrics.kepatuhan}%
                  </h2>
                  <p className="text-[9px] text-stone-400 leading-snug">
                    Kepatuhan batas pagu, tenor & alokasi PMK.
                  </p>
                </div>

                <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4 ring-2 ring-[#F9A620]/40 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-12 h-12 bg-[#F9A620]/10 rounded-bl-full pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-black text-[#F9A620]">Kesehatan Koperasi</span>
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-[#F9A620]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>
                  <h2 className={`text-2xl font-black font-mono ${getHealthScoreColor(healthMetrics.kesehatan_koperasi)}`}>
                    {healthMetrics.kesehatan_koperasi}%
                  </h2>
                  <p className="text-[9px] text-stone-400 leading-snug">
                    Indeks komposit kesehatan KDMP keseluruhan.
                  </p>
                </div>
              </div>

              {/* Sirkulasi Ekonomi Desa Widget */}
              {villageEcoSummary && (
                <div className="bg-gradient-to-br from-[#548C2F]/10 via-[#548C2F]/0 to-[#F9A620]/10 border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-200/50 dark:border-stone-800/50 pb-4">
                    <div>
                      <h3 className="text-sm font-black text-[#548C2F] dark:text-white flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-[#F9A620]" />
                        Dasbor Ekonomi Sirkular Desa
                      </h3>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Pelacakan perputaran insentif belajar warga yang tersirkulasi kembali di warung belanja koperasi desa.
                      </p>
                    </div>
                    <Landmark className="w-5 h-5 text-stone-450" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
                    <div className="p-4 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider block">Partisipasi Warga</span>
                      <span className="text-xl font-black text-[#548C2F] dark:text-white block mt-2">{villageEcoSummary.member_count} Anggota</span>
                      <span className="text-[9px] text-stone-400 block mt-1">Aktif berkontribusi</span>
                    </div>
                    <div className="p-4 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider block">Insentif Terklaim</span>
                      <span className="text-xl font-black text-[#F9A620] block mt-2">{villageEcoSummary.total_points} Poin</span>
                      <span className="text-[9px] text-stone-400 block mt-1">Dari hasil belajar kuis</span>
                    </div>
                    <div className="p-4 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider block">Voucher Terpakai</span>
                      <span className="text-xl font-black text-emerald-700 dark:text-emerald-450 block mt-2">{villageEcoSummary.total_redeemed} Kupon</span>
                      <span className="text-[9px] text-stone-400 block mt-1">Sirkulasi belanja toko desa</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================= */}
          {/* TAB: MEMBER SAVINGS (BUKU SIMPANAN)      */}
          {/* ======================================= */}
          {activeTab === 'member_savings' && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-[#548C2F] dark:text-white flex items-center gap-2">
                    <Coins className="w-5 h-5 text-[#F9A620]" />
                    {['pengurus', 'ketua'].includes(session.role) ? 'Buku Simpanan Warga Koperasi' : 'Buku Simpanan Anggota Anda'}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 leading-normal max-w-xl">
                    {['pengurus', 'ketua'].includes(session.role) 
                      ? 'Kelola saldo simpanan pokok, wajib, dan sukarela per anggota secara terperinci. Gunakan fitur ini untuk melihat saldo masing-masing anggota dan melakukan penyetoran atau penarikan.'
                      : 'Berikut adalah rincian saldo simpanan Anda di Koperasi Desa Merah Putih. Simpanan pokok & wajib bersifat permanen, sedangkan simpanan sukarela dapat ditarik sewaktu-waktu.'}
                  </p>
                </div>
              </div>

              {/* View for managers (List of all members and balances) */}
              {['pengurus', 'ketua'].includes(session.role) && (
                <div className="space-y-6">
                  {/* Search and Quick Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-4 rounded-2xl shadow-sm">
                    <div className="relative w-full sm:max-w-xs">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-stone-400" />
                      </span>
                      <input
                        type="text"
                        placeholder="Cari anggota atau NIK..."
                        value={savingsSearch}
                        onChange={(e) => setSavingsSearch(e.target.value)}
                        className="input-field pl-10"
                      />
                    </div>
                    <div className="text-xs font-bold text-stone-500">
                      Menampilkan {memberSavings.filter(m => m.nama.toLowerCase().includes(savingsSearch.toLowerCase()) || m.nik.includes(savingsSearch)).length} Anggota
                    </div>
                  </div>

                  {/* Members Savings Table */}
                  <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="premium-table">
                        <thead>
                          <tr>
                            <th>Nama Anggota</th>
                            <th>NIK / Kontak</th>
                            <th>Simpanan Pokok</th>
                            <th>Simpanan Wajib</th>
                            <th>Simpanan Sukarela</th>
                            <th>Total Saldo</th>
                            <th className="text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memberSavings
                            .filter(m => m.nama.toLowerCase().includes(savingsSearch.toLowerCase()) || m.nik.includes(savingsSearch))
                            .map((member) => (
                              <tr key={member.anggota_ref}>
                                <td>
                                  <div className="font-extrabold text-stone-900 dark:text-white">{member.nama}</div>
                                  <div className="text-[10px] text-stone-400 font-mono mt-0.5">{member.anggota_ref}</div>
                                </td>
                                <td className="text-xs font-semibold">
                                  <div className="font-mono text-stone-600 dark:text-stone-300">{member.nik}</div>
                                  <div className="text-[10px] text-stone-450 mt-0.5">{member.phone_number}</div>
                                </td>
                                <td className="font-bold text-stone-800 dark:text-stone-200">{fmt(member.simpanan_pokok)}</td>
                                <td className="font-bold text-stone-800 dark:text-stone-200">{fmt(member.simpanan_wajib)}</td>
                                <td className="font-bold text-emerald-700 dark:text-emerald-400">{fmt(member.simpanan_sukarela)}</td>
                                <td className="font-extrabold text-[#104911] dark:text-green-400">{fmt(member.total_simpanan)}</td>
                                <td className="text-right">
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => {
                                        setTxType('simpanan_sukarela');
                                        setTxKategori('simpanan_anggota');
                                        setTxAnggotaRef(member.anggota_ref);
                                        setTxDescription(`Setoran Simpanan Sukarela - ${member.nama}`);
                                        handleTabChange('transactions');
                                      }}
                                      className="py-1 px-2.5 bg-[#548C2F] hover:bg-[#427223] text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                                    >
                                      Setor
                                    </button>
                                    <button
                                      onClick={() => {
                                        setTxType('pengeluaran');
                                        setTxKategori('simpanan_anggota');
                                        setTxAnggotaRef(member.anggota_ref);
                                        setTxDescription(`Penarikan Simpanan Sukarela - ${member.nama}`);
                                        handleTabChange('transactions');
                                      }}
                                      className="py-1 px-2.5 bg-red-650 hover:bg-red-750 text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                                    >
                                      Tarik
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {memberSavings.length === 0 && (
                            <tr>
                              <td colSpan={7} className="text-center py-8 text-stone-400 font-bold">
                                Tidak ada data anggota koperasi ditemukan.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* View for ordinary members (Personal balances) */}
              {session.role === 'anggota' && (
                <div className="space-y-6">
                  {/* Personal Balances Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Simpanan Pokok</span>
                      <span className="text-2xl font-black text-stone-850 dark:text-stone-100 block mt-2">
                        {fmt(memberSavings[0]?.simpanan_pokok ?? 0)}
                      </span>
                      <span className="text-[10px] text-stone-450 block mt-1">Dibayar sekali saat awal pendaftaran</span>
                    </div>

                    <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Simpanan Wajib</span>
                      <span className="text-2xl font-black text-stone-850 dark:text-stone-100 block mt-2">
                        {fmt(memberSavings[0]?.simpanan_wajib ?? 0)}
                      </span>
                      <span className="text-[10px] text-stone-450 block mt-1">Simpanan rutin berkala anggota</span>
                    </div>

                    <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block">Simpanan Sukarela</span>
                      <span className="text-2xl font-black text-emerald-750 dark:text-emerald-450 block mt-2">
                        {fmt(memberSavings[0]?.simpanan_sukarela ?? 0)}
                      </span>
                      <span className="text-[10px] text-stone-450 block mt-1">Dapat disetor & ditarik sewaktu-waktu</span>
                    </div>

                    <div className="bg-[#104911] text-white border border-[#F9A620]/30 p-6 rounded-3xl shadow-md">
                      <span className="text-[10px] font-black text-emerald-250 uppercase tracking-wider block">Total Saldo Simpanan</span>
                      <span className="text-2xl font-black text-[#FFD449] block mt-2">
                        {fmt(memberSavings[0]?.total_simpanan ?? 0)}
                      </span>
                      <span className="text-[10px] text-emerald-200/70 block mt-1">Total aset simpanan Anda di koperasi</span>
                    </div>
                  </div>

                  {/* Personal recent transaction history */}
                  <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                    <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-4">Riwayat Mutasi Simpanan Anda</h3>
                    <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
                      <table className="premium-table">
                        <thead>
                          <tr>
                            <th>Tanggal</th>
                            <th>Jenis Transaksi</th>
                            <th>Keterangan</th>
                            <th>Jumlah</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions
                            .filter(t => t.anggota_ref === memberSavings[0]?.anggota_ref && ['simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela', 'pengeluaran'].includes(t.type))
                            .map((t) => (
                              <tr key={t.id}>
                                <td className="text-stone-400 font-semibold">{new Date(t.created_at).toLocaleDateString('id-ID')}</td>
                                <td className="font-bold uppercase text-[10px] tracking-wider text-stone-600 dark:text-stone-300">
                                  {t.type === 'pengeluaran' ? 'Penarikan Sukarela' : t.type.replace('simpanan_', 'Simpanan ')}
                                </td>
                                <td className="font-semibold text-stone-700 dark:text-stone-200">{t.description}</td>
                                <td className={`font-bold ${t.type === 'pengeluaran' ? 'text-red-650' : 'text-emerald-700'}`}>
                                  {t.type === 'pengeluaran' ? '-' : '+'}{fmt(t.amount)}
                                </td>
                                <td>
                                  <span className={`badge ${t.status === 'disetujui' ? 'badge-success' : t.status === 'ditolak' ? 'badge-danger' : 'badge-gold'}`}>
                                    {t.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          {transactions.filter(t => t.anggota_ref === memberSavings[0]?.anggota_ref && ['simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela', 'pengeluaran'].includes(t.type)).length === 0 && (
                            <tr>
                              <td colSpan={5} className="text-center py-8 text-stone-400 font-bold">
                                Belum ada riwayat transaksi simpanan aktif.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 2: TRANSACTIONS                     */}
          {/* ======================================= */}
          {activeTab === 'transactions' && ['pengurus', 'ketua'].includes(session.role) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-1 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm self-start space-y-4">
                <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-3">
                  Catat Transaksi Buku Kas
                </h3>

                {txFormError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-750 text-[11px] font-semibold">
                    {txFormError}
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-500 mb-1">Tipe Transaksi</label>
                    <select
                      value={txType}
                      onChange={(e) => setTxType(e.target.value as any)}
                      className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
                    >
                      <option value="pemasukan">Pemasukan Kas Umum</option>
                      <option value="pengeluaran">Pengeluaran Kas Umum</option>
                      <option value="simpanan_pokok">Simpanan Pokok Anggota</option>
                      <option value="simpanan_wajib">Simpanan Wajib Anggota</option>
                      <option value="simpanan_sukarela">Simpanan Sukarela Anggota</option>
                      <option value="pinjaman">Pemberian Pinjaman</option>
                      <option value="bagi_hasil">Pembagian SHU / Bagi Hasil</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-500 mb-1">Sumber Dana</label>
                      <select
                        value={txSumber}
                        onChange={(e) => setTxSumber(e.target.value as any)}
                        className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
                      >
                        <option value="non_dana_desa">Non Dana Desa</option>
                        <option value="dana_desa">Dana Desa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-500 mb-1">Kategori</label>
                      <select
                        value={txKategori}
                        onChange={(e) => setTxKategori(e.target.value as any)}
                        className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
                      >
                        <option value="operasional">Operasional</option>
                        <option value="pembangunan_fisik">Pembangunan Fisik</option>
                        <option value="distribusi_pangan">Distribusi Pangan</option>
                        <option value="simpanan_anggota">Simpanan Anggota</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-500 mb-1">Nominal Transaksi (Rp)</label>
                    <input
                      type="number"
                      placeholder="Contoh: 1500000"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none font-mono"
                    />
                  </div>

                  {txType === 'pinjaman' && (
                    <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl">
                      <div>
                        <label className="block font-bold text-stone-500 mb-1">Tenor (Bulan)</label>
                        <input
                          type="number"
                          placeholder="Maks 72"
                          value={txTenor}
                          onChange={(e) => setTxTenor(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-500 mb-1">Bunga (% flat)</label>
                        <input
                          type="text"
                          value={txBunga}
                          onChange={(e) => setTxBunga(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-lg focus:outline-none text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {['simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela', 'pinjaman'].includes(txType) && (
                    <div>
                      <label className="block font-bold text-stone-500 mb-1">Referensi Anggota</label>
                      <input
                        type="text"
                        placeholder="Contoh: MBR-001"
                        value={txAnggotaRef}
                        onChange={(e) => setTxAnggotaRef(e.target.value)}
                        className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-stone-500 mb-1">Keterangan Transaksi</label>
                    <textarea
                      placeholder="Masukkan detail peruntukan dana belanja..."
                      value={txDescription}
                      onChange={(e) => setTxDescription(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none h-16 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-500 mb-1">Link Bukti Fisik (Evidence URL)</label>
                    <input
                      type="text"
                      placeholder="Link nota, kwitansi, atau invoice..."
                      value={txEvidence}
                      onChange={(e) => setTxEvidence(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-500 mb-1">Tanggal Transaksi</label>
                    <input
                      type="date"
                      value={txDate}
                      onChange={(e) => setTxDate(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleCreateTransaction(false)}
                      disabled={isPending}
                      className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 rounded-xl text-stone-700 dark:text-stone-300 font-bold border border-stone-200 dark:border-stone-800 transition-all cursor-pointer text-center text-[10px] uppercase tracking-wider"
                    >
                      Draft
                    </button>
                    <button
                      onClick={() => handleCreateTransaction(true)}
                      disabled={isPending}
                      className="flex-1 py-2.5 px-3 bg-[#548C2F] hover:bg-[#427223] text-white rounded-xl font-bold shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider border border-[#F9A620]/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Ajukan
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                  <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
                    Buku Kas Ledger Transaksi ({transactions.length})
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-400 uppercase tracking-wider font-extrabold text-[10px]">
                          <th className="py-2.5">Tanggal</th>
                          <th>Tipe / Kategori</th>
                          <th>Keterangan</th>
                          <th>Nominal</th>
                          <th>Status</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTransactions.map((t) => (
                          <tr key={t.id} className="border-b border-stone-100 dark:border-stone-900 group">
                            <td className="py-3.5 font-mono text-stone-500">{t.transaction_date}</td>
                            <td>
                              <div className="font-bold capitalize">{t.type.replace('_', ' ')}</div>
                              <div className="text-[9px] font-black text-[#F9A620] uppercase mt-0.5">{t.sumber_dana.replace('_', ' ')} &bull; {t.kategori.replace('_', ' ')}</div>
                            </td>
                            <td>
                              <div className="font-semibold text-stone-800 dark:text-stone-200">{t.description}</div>
                              <div className="text-[10px] text-stone-400 mt-1 flex items-center gap-2">
                                <span>Oleh: {t.app_users?.full_name}</span>
                                {t.evidence_url && (
                                  <a href={t.evidence_url} target="_blank" className="text-blue-650 hover:underline font-bold">
                                    [Bukti Nota]
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="font-mono font-black text-[#548C2F] dark:text-white">{fmt(t.amount)}</td>
                            <td>
                              <div className="flex flex-col gap-1.5">
                                <span className={`inline-flex self-start px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                  t.status === 'disetujui' ? 'bg-green-50 text-green-700 border-green-200' :
                                  t.status === 'ditolak' ? 'bg-red-50 text-red-700 border-red-200' :
                                  t.status === 'menunggu_approval' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-stone-50 text-stone-600 border-stone-200'
                                }`}>
                                  {t.status === 'menunggu_approval' ? 'Menunggu' : t.status}
                                </span>
                                {getRiskLevelBadge(t.risk_level)}
                              </div>
                            </td>
                            <td>
                              {t.status === 'draft' && (
                                <button
                                  onClick={() => handleSubmitDraft(t.id)}
                                  className="py-1 px-3 bg-[#548C2F] hover:bg-[#427223] text-white text-[9px] font-black rounded-lg uppercase border border-[#F9A620]/20 transition-all cursor-pointer"
                                >
                                  Kirim
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalTxPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-900 mt-4 text-xs">
                      <span className="text-stone-400 font-semibold">
                        Halaman {txPage} dari {totalTxPages || 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setTxPage(p => Math.max(1, p - 1))}
                          disabled={txPage === 1}
                          className="py-1 px-3 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 font-bold disabled:opacity-40"
                        >
                          Sebelumnya
                        </button>
                        <button
                          onClick={() => setTxPage(p => Math.min(totalTxPages, p + 1))}
                          disabled={txPage >= totalTxPages}
                          className="py-1 px-3 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 font-bold disabled:opacity-40"
                        >
                          Berikutnya
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 3: APPROVALS                        */}
          {/* ======================================= */}
          {activeTab === 'approvals' && ['pengurus', 'ketua'].includes(session.role) && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
                  Otorisasi Anggota Baru ({pendingMembers.length})
                </h3>

                <div className="space-y-3.5">
                  {pendingMembers.map((member) => (
                    <div key={member.id} className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl flex items-center justify-between gap-4">
                      <div>
                        <div className="font-extrabold text-sm text-stone-850 dark:text-stone-200">{member.full_name}</div>
                        <div className="text-[11px] text-stone-400 mt-1 flex flex-wrap gap-x-3">
                          <span>NIK: {member.ktp_number || '-'}</span>
                          <span>No HP: {member.phone_number}</span>
                          <span>Sebagai: <strong className="uppercase text-[#F9A620]">{member.role}</strong></span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerifyMember(member.id, 'reject')}
                          className="p-2 bg-red-50 text-red-650 rounded-xl hover:bg-red-100 border border-red-200 transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleVerifyMember(member.id, 'approve')}
                          className="p-2 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 border border-green-200 transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingMembers.length === 0 && (
                    <p className="text-xs text-stone-400 text-center py-4">Tidak ada pengajuan keanggotaan baru.</p>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
                  Otorisasi Transaksi Keuangan ({myApprovals.filter(a => a.status === 'menunggu').length})
                </h3>

                <div className="space-y-6">
                  {myApprovals.map((app) => {
                    const tx = app.transaksi_keuangan;
                    return (
                      <div key={app.id} className="p-5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4">
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-dashed border-stone-200 dark:border-stone-800 pb-3">
                          <div>
                            <span className="text-[9px] uppercase font-black text-stone-400 block tracking-wider">Identifikasi Transaksi</span>
                            <span className="text-xs font-bold capitalize text-stone-800 dark:text-stone-200">
                              {tx.type.replace('_', ' ')} ({tx.sumber_dana.replace('_', ' ')})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] uppercase font-black text-stone-400 block tracking-wider">Nilai Dana</span>
                            <span className="text-base font-extrabold text-[#548C2F] dark:text-white font-mono">{fmt(tx.amount)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-stone-550 block font-bold text-[11px] mb-0.5">Rincian Belanja:</span>
                            <p className="text-stone-700 dark:text-stone-300 font-semibold">{tx.description}</p>
                            {tx.evidence_url && (
                              <a href={tx.evidence_url} target="_blank" className="mt-2 text-blue-650 hover:underline block font-bold">
                                [Buka Tautan Lampiran Bukti Fisik]
                              </a>
                            )}
                          </div>
                          <div>
                            <span className="text-stone-550 block font-bold text-[11px] mb-0.5">Penilaian Risiko Scanner:</span>
                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                              {getRiskLevelBadge(tx.risk_level)}
                              <span className="text-[10px] text-stone-400 font-semibold">Tingkat Verifikator: {app.approval_level === 1 ? 'Pengurus' : 'Ketua'}</span>
                            </div>
                          </div>
                        </div>

                        {app.status === 'menunggu' ? (
                          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-3">
                            <input
                              type="text"
                              placeholder="Masukkan alasan pembatalan jika menolak, atau catatan otorisasi..."
                              value={approvalNote[app.id] || ''}
                              onChange={(e) => setApprovalNote({ ...approvalNote, [app.id]: e.target.value })}
                              className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl text-xs focus:outline-none"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleDecideApproval(app.id, 'ditolak')}
                                className="py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" /> Tolak
                              </button>
                              <button
                                onClick={() => handleDecideApproval(app.id, 'disetujui')}
                                className="py-2 px-4 bg-green-50 hover:bg-green-150 text-green-700 border border-green-200 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" /> Setujui
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                            <span className="text-stone-400">Keputusan Anda:</span>
                            <span className={`font-black uppercase ${app.status === 'disetujui' ? 'text-green-700' : 'text-red-700'}`}>
                              {app.status}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 4: COMPLIANCE                       */}
          {/* ======================================= */}
          {activeTab === 'compliance' && ['pengurus', 'ketua', 'pendamping'].includes(session.role) && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Kesehatan Kas Card */}
                <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm text-center space-y-4">
                  <h3 className="text-xs font-black text-stone-500 uppercase tracking-wider">
                    I. Kesehatan Kas
                  </h3>
                  <div className="py-2">
                    <div className={`text-4xl font-black font-mono ${getHealthScoreColor(healthMetrics.kesehatan_kas)}`}>
                      {healthMetrics.kesehatan_kas}%
                    </div>
                    <div className="mt-2 text-[10px] text-stone-500 leading-relaxed max-w-xs mx-auto">
                      Mengukur kesehatan likuiditas, ketiadaan kas defisit, kelengkapan bukti nota belanja, & wajaran transaksi.
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-stone-100 dark:bg-stone-850 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        healthMetrics.kesehatan_kas >= 80 ? 'bg-green-600' :
                        healthMetrics.kesehatan_kas >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${healthMetrics.kesehatan_kas}%` }}
                    />
                  </div>
                </div>

                {/* 2. Kepatuhan Hukum Card */}
                <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm text-center space-y-4">
                  <h3 className="text-xs font-black text-stone-500 uppercase tracking-wider">
                    II. Kepatuhan Regulasi
                  </h3>
                  <div className="py-2">
                    <div className={`text-4xl font-black font-mono ${getHealthScoreColor(healthMetrics.kepatuhan)}`}>
                      {healthMetrics.kepatuhan}%
                    </div>
                    <div className="mt-2 text-[10px] text-stone-500 leading-relaxed max-w-xs mx-auto">
                      Kepatuhan batas pagu, tenor pinjaman, peruntukan Dana Desa, verifikator ganda, & Rapat Anggota Tahunan (RAT).
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-stone-100 dark:bg-stone-850 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        healthMetrics.kepatuhan >= 80 ? 'bg-green-600' :
                        healthMetrics.kepatuhan >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${healthMetrics.kepatuhan}%` }}
                    />
                  </div>
                </div>

                {/* 3. Kesehatan Koperasi Card */}
                <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm text-center space-y-4 ring-2 ring-[#F9A620]/40 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-16 h-16 bg-[#F9A620]/10 rounded-bl-full pointer-events-none" />
                  <h3 className="text-xs font-black text-[#F9A620] uppercase tracking-wider flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    III. Kesehatan Koperasi
                  </h3>
                  <div className="py-2">
                    <div className={`text-4xl font-black font-mono ${getHealthScoreColor(healthMetrics.kesehatan_koperasi)}`}>
                      {healthMetrics.kesehatan_koperasi}%
                    </div>
                    <div className="mt-2 text-[10px] text-stone-500 leading-relaxed max-w-xs mx-auto">
                      Indeks Komposit: 40% Kesehatan Kas + 40% Kepatuhan + 20% Partisipasi & Keaktifan Warga ({healthMetrics.partisipasi_anggota}%).
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-stone-100 dark:bg-stone-850 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        healthMetrics.kesehatan_koperasi >= 80 ? 'bg-green-600' :
                        healthMetrics.kesehatan_koperasi >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${healthMetrics.kesehatan_koperasi}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
                  Temuan Pelanggaran Regulasi Terdeteksi ({riskLogs.length})
                </h3>

                <div className="space-y-6">
                  {paginatedRiskLogs.map((log) => {
                    const tx = log.transaksi_keuangan;
                    return (
                      <div key={log.id} className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-3.5 animate-fade-in-up">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <span className="font-mono text-[9px] font-black text-amber-700 bg-amber-50 dark:bg-amber-950/20 border border-amber-250 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {log.rule_code}
                            </span>
                            <h4 className="mt-3 text-xs font-extrabold text-stone-800 dark:text-stone-200 leading-relaxed">
                              {log.message}
                            </h4>
                          </div>
                          {getRiskLevelBadge(log.risk_level)}
                        </div>

                        <div className="text-xs text-stone-500 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-4 rounded-xl space-y-1">
                          <div>
                            <strong>Transaksi:</strong> {tx.description}
                          </div>
                          {session.role !== 'pendamping' && (
                            <div>
                              <strong>Nominal & Tanggal:</strong> <span className="font-mono font-bold text-stone-900 dark:text-white">{fmt(tx.amount)}</span> &bull; {tx.transaction_date}
                            </div>
                          )}
                        </div>

                        {['pengurus', 'ketua'].includes(session.role) && (
                          <div className="pt-2 border-t border-dashed border-stone-200 dark:border-stone-800 space-y-3">
                            <input
                              type="text"
                              placeholder="Masukkan catatan resolusi tindak lanjut..."
                              value={riskNote[log.id] || ''}
                              onChange={(e) => setRiskNote({ ...riskNote, [log.id]: e.target.value })}
                              className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl text-xs focus:outline-none"
                            />
                            <div className="flex justify-end">
                              <button
                                onClick={() => handleResolveRisk(log.id)}
                                className="py-2 px-5 bg-[#548C2F] hover:bg-[#427223] text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow border border-[#F9A620]/20 cursor-pointer"
                              >
                                Tandai Selesai ditindaklanjuti
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {totalRiskPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-900 mt-4 text-xs">
                      <span className="text-stone-400 font-semibold">
                        Halaman {riskPage} dari {totalRiskPages || 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setRiskPage(p => Math.max(1, p - 1))}
                          disabled={riskPage === 1}
                          className="py-1 px-3 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 font-bold disabled:opacity-40"
                        >
                          Sebelumnya
                        </button>
                        <button
                          onClick={() => setRiskPage(p => Math.min(totalRiskPages, p + 1))}
                          disabled={riskPage >= totalRiskPages}
                          className="py-1 px-3 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 font-bold disabled:opacity-40"
                        >
                          Berikutnya
                        </button>
                      </div>
                    </div>
                  )}

                  {riskLogs.length === 0 && (
                    <p className="text-xs text-stone-400 text-center py-4">Semua sistem kepatuhan terpantau aman.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* TAB: LAPORAN KEUANGAN                   */}
          {/* ======================================= */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3 mb-4">
                  <h3 className="text-sm font-black text-[#548C2F] dark:text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-[#F9A620]" />
                    Laporan Posisi Keuangan (Neraca Saldo)
                  </h3>
                  {totalAset === totalPasiva ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase border border-green-200">
                      <Check className="w-3.5 h-3.5" /> Balanced
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-black uppercase border border-amber-200">
                      Unbalanced
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-normal">
                  
                  {/* Left Column: Aset */}
                  <div className="space-y-4">
                    <h4 className="font-black uppercase tracking-wider text-stone-400 border-b border-stone-100 dark:border-stone-900 pb-2">AKTIVA (ASET KOPERASI)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-1 border-b border-stone-50 dark:border-stone-900">
                        <span className="text-stone-600">Kas Tunai & Saldo Bank</span>
                        <span className="font-mono font-bold text-stone-900 dark:text-white">{fmt(saldoKasVal)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-50 dark:border-stone-900">
                        <span className="text-stone-600">Piutang Pembiayaan Anggota</span>
                        <span className="font-mono font-bold text-stone-900 dark:text-white">{fmt(piutangVal)}</span>
                      </div>
                      <div className="pt-3 border-t border-dashed border-stone-250 dark:border-stone-750 flex justify-between font-black text-sm text-[#548C2F] dark:text-white">
                        <span>TOTAL AKTIVA</span>
                        <span className="font-mono">{fmt(totalAset)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Liabilitas & Ekuitas */}
                  <div className="space-y-4">
                    <h4 className="font-black uppercase tracking-wider text-stone-400 border-b border-stone-100 dark:border-stone-900 pb-2">PASIVA (LIABILITAS & MODAL)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-1 border-b border-stone-50 dark:border-stone-900">
                        <span className="text-stone-600">Simpanan Pokok Anggota</span>
                        <span className="font-mono font-bold text-stone-900 dark:text-white">{fmt(simpokVal)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-50 dark:border-stone-900">
                        <span className="text-stone-600">Simpanan Wajib Anggota</span>
                        <span className="font-mono font-bold text-stone-900 dark:text-white">{fmt(simwajibVal)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-50 dark:border-stone-900">
                        <span className="text-stone-600">Simpanan Sukarela Anggota</span>
                        <span className="font-mono font-bold text-stone-900 dark:text-white">{fmt(simsukarelaVal)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-50 dark:border-stone-900">
                        <span className="text-stone-600">Ekuitas Modal Awal</span>
                        <span className="font-mono font-bold text-stone-900 dark:text-white">{fmt(modalAwalVal)}</span>
                      </div>
                      <div className="pt-3 border-t border-dashed border-stone-250 dark:border-stone-750 flex justify-between font-black text-sm text-[#548C2F] dark:text-white">
                        <span>TOTAL PASIVA</span>
                        <span className="font-mono">{fmt(totalPasiva)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Laporan SHU */}
              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-3 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#F9A620]" />
                  Laporan Hasil Usaha (SHU / Rugi Laba)
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-50 dark:border-stone-900">
                    <span className="text-stone-600">Total Pendapatan Operasional (Kas Masuk)</span>
                    <span className="font-mono font-extrabold text-green-700">+{fmt(totalPendapatan)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-50 dark:border-stone-900">
                    <span className="text-stone-600">Total Beban Operasional (Kas Keluar)</span>
                    <span className="font-mono font-extrabold text-red-750">-{fmt(totalBeban)}</span>
                  </div>
                  <div className="pt-3 flex justify-between font-black text-sm text-[#548C2F] dark:text-white pb-3 border-b border-stone-200 dark:border-stone-850">
                    <span>SISA HASIL USAHA (SHU) BERJALAN</span>
                    <span className={`font-mono ${sisaHasilUsaha >= 0 ? 'text-green-700' : 'text-red-750'}`}>
                      {fmt(sisaHasilUsaha)}
                    </span>
                  </div>

                  {/* Estimasi SHU Anggota */}
                  <div className="mt-4 bg-stone-50 dark:bg-stone-900/40 p-4 rounded-2xl space-y-2 border border-stone-100 dark:border-stone-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#548C2F] dark:text-[#F9A620]">Estimasi Porsi SHU Warga</span>
                      <span className="font-mono font-black text-xs text-stone-800 dark:text-stone-200">
                        {totalKoperasiPoints > 0 ? ((pointsBalance / totalKoperasiPoints) * 100).toFixed(2) : '0.00'}%
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-normal font-medium">
                      Porsi dihitung dari total partisipasi aktif Anda ({pointsBalance} PTS) dibagi total partisipasi seluruh anggota ({totalKoperasiPoints} PTS) dalam ekosistem Koperasi Desa Merah Putih.
                    </p>
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="font-medium text-stone-600">Estimasi Nilai SHU Diterima:</span>
                      <span className="font-mono font-black text-xs text-green-700">
                        {fmt(Math.max(0, totalKoperasiPoints > 0 ? (pointsBalance / totalKoperasiPoints) * sisaHasilUsaha : 0))}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Bagi SHU untuk Ketua */}
                  {session.role === 'ketua' && sisaHasilUsaha > 0 && (
                    <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-850 flex justify-end">
                      <button
                        onClick={handleDistributeShu}
                        disabled={isPending}
                        className="py-2.5 px-6 bg-[#F9A620] hover:bg-[#b07803] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow border border-amber-600/20 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Coins className="w-4 h-4" />
                        Bagikan SHU Digital Berbasis Poin
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 5: RAPAT ANGGOTA (e-RAT)           */}
          {/* ======================================= */}
          {activeTab === 'e_rat' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
                  Musyawarah Anggota e-RAT Digital
                </h3>

                <div className="space-y-6">
                  {ratVotingAgendas.map((agenda) => {
                    const hasVoted = myVotes.some(v => v.agenda_id === agenda.id);
                    const userVote = myVotes.find(v => v.agenda_id === agenda.id);
                    const aggs = voteAggregates.filter(a => a.agenda_id === agenda.id);
                    const totalVotes = aggs.reduce((sum, item) => sum + Number(item.count), 0);

                    return (
                      <div key={agenda.id} className="p-5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4">
                        
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] uppercase font-black text-stone-400 block tracking-wider">Agenda Musyawarah</span>
                            <h4 className="text-sm font-bold text-stone-850 dark:text-stone-200 mt-1 leading-snug">
                              {agenda.title}
                            </h4>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            agenda.status === 'aktif' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-stone-200 text-stone-800'
                          }`}>
                            {agenda.status}
                          </span>
                        </div>

                        <p className="text-xs text-stone-500 leading-relaxed">
                          {agenda.description}
                        </p>

                        {totalVotes > 0 && (
                          <div className="p-4 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl space-y-3.5 shadow-sm">
                            <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider block">Hasil Pemungutan Suara ({totalVotes} Anggota):</span>
                            
                            <div className="space-y-2 text-xs">
                              {agenda.options.map((opt: string) => {
                                const optAgg = aggs.find(a => a.voted_option === opt);
                                const count = optAgg ? Number(optAgg.count) : 0;
                                const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

                                return (
                                  <div key={opt} className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                      <span>{opt}</span>
                                      <span>{count} Suara ({percent}%)</span>
                                    </div>
                                    <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                                      <div 
                                        className="bg-[#548C2F] h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${percent}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {hasVoted ? (
                          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl flex items-center justify-between text-xs text-green-700">
                            <span className="flex items-center gap-1.5 font-bold">
                              <CheckCircle2 className="w-4 h-4" /> Hak suara terverifikasi masuk
                            </span>
                            <span>Pilihan: <strong>{userVote?.voted_option}</strong></span>
                          </div>
                        ) : (
                          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-4">
                            <span className="text-xs font-bold text-stone-500 block">Tentukan Pilihan Anda:</span>
                            <div className="grid gap-2 sm:grid-cols-3">
                              {agenda.options.map((opt: string) => (
                                <label
                                  key={opt}
                                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                    selectedVotes[agenda.id] === opt
                                      ? 'bg-[#548C2F]/10 border-[#548C2F] text-[#548C2F] font-bold shadow-sm'
                                      : 'bg-white dark:bg-[#1c1a17] border-stone-200 dark:border-stone-800'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`vote_${agenda.id}`}
                                    value={opt}
                                    checked={selectedVotes[agenda.id] === opt}
                                    onChange={() => setSelectedVotes({ ...selectedVotes, [agenda.id]: opt })}
                                    className="accent-[#548C2F]"
                                  />
                                  {opt}
                                </label>
                              ))}
                            </div>
                            <div className="flex justify-end">
                              <button
                                onClick={() => handleCastVote(agenda.id)}
                                className="py-2 px-5 bg-[#548C2F] hover:bg-[#427223] text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow border border-[#F9A620]/20 transition-all cursor-pointer"
                              >
                                Kirim Pilihan Suara
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 6: ASPIRASI WARGA                   */}
          {/* ======================================= */}
          {activeTab === 'aspirations' && (
            <div className="space-y-6">
              
              {session.role === 'anggota' && (
                <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#F9A620]" /> Sampaikan Aspirasi &amp; Program Desa
                  </h3>

                  <form onSubmit={handleCreateAspiration} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block font-bold text-stone-500 mb-1">Judul Usulan Program</label>
                        <input
                          type="text"
                          placeholder="Contoh: Pengadaan Mesin Pengering Padi Kelompok Tani"
                          value={aspTitle}
                          onChange={(e) => setAspTitle(e.target.value)}
                          className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-500 mb-1">Penjelasan Detail &amp; Latar Belakang</label>
                        <textarea
                          placeholder="Jelaskan kebutuhan warga, perkiraan lokasi, dan urgensi fisik program..."
                          value={aspDesc}
                          onChange={(e) => setAspDesc(e.target.value)}
                          className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl focus:outline-none h-20 resize-none"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isPending}
                        className="py-2.5 px-6 bg-[#548C2F] hover:bg-[#427223] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow border border-[#F9A620]/25 transition-all cursor-pointer"
                      >
                        Kirim Usulan Warga
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Feed Aspirasi */}
              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
                  <h3 className="text-sm font-black text-[#548C2F] dark:text-white">
                    Usulan & Aspirasi Pembangunan Desa ({filteredAspirations.length})
                  </h3>

                  <div className="flex bg-stone-100 dark:bg-stone-900 p-1 rounded-xl text-[10px] font-bold border border-stone-200 dark:border-stone-800">
                    <button
                      onClick={() => setAspFilter('semua')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        aspFilter === 'semua' ? 'bg-white dark:bg-[#1c1a17] text-stone-900 dark:text-white shadow-sm' : 'text-stone-500'
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setAspFilter('pending')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        aspFilter === 'pending' ? 'bg-white dark:bg-[#1c1a17] text-stone-900 dark:text-white shadow-sm' : 'text-stone-500'
                      }`}
                    >
                      Belum Respon
                    </button>
                    <button
                      onClick={() => setAspFilter('responded')}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        aspFilter === 'responded' ? 'bg-white dark:bg-[#1c1a17] text-stone-900 dark:text-white shadow-sm' : 'text-stone-500'
                      }`}
                    >
                      Direspon
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {paginatedAspirations.map((asp) => {
                    const hasUpvoted = myUpvotes.some(up => up.aspiration_id === asp.id);
                    return (
                      <div key={asp.id} className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4 animate-fade-in-up">
                        
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-sm text-stone-850 dark:text-stone-200">{asp.title}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                asp.status === 'ditanggapi' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {asp.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-455 mt-1.5 block">
                              Pengusul: <strong className="text-stone-700 dark:text-stone-300">{asp.user_name}</strong> &bull; {new Date(asp.created_at).toLocaleDateString('id-ID')}
                            </span>
                          </div>

                          <div className="flex gap-2 items-center flex-wrap">
                            {['pengurus', 'ketua'].includes(session.role) && !asp.admin_response && (
                              <button
                                onClick={() => handlePromoteAspiration(asp.id)}
                                className="px-2.5 py-1.5 bg-[#F9A620]/10 hover:bg-[#F9A620] hover:text-white text-[#F9A620] border border-[#F9A620]/20 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Vote className="w-3.5 h-3.5" />
                                Jadikan Agenda e-RAT
                              </button>
                            )}

                            <button
                              onClick={() => handleUpvoteAspiration(asp.id)}
                              disabled={hasUpvoted}
                              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                hasUpvoted 
                                  ? 'bg-blue-50 text-blue-650 border-blue-200' 
                                  : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-600'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span>{asp.upvotes_count} Dukungan</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-semibold">
                          {asp.description}
                        </p>

                        {asp.admin_response ? (
                          <div className="p-4 bg-[#548C2F]/5 dark:bg-[#548C2F]/15 border border-[#548C2F]/15 rounded-xl space-y-2">
                            <div className="flex items-center gap-1.5 text-xs text-[#548C2F] dark:text-[#22c55e] font-black uppercase tracking-wide">
                              <MessageCircle className="w-4 h-4" />
                              Tanggapan Resmi Koperasi Desa:
                            </div>
                            <p className="text-xs text-stone-700 dark:text-stone-300 leading-normal font-medium italic">
                              "{asp.admin_response}"
                            </p>
                          </div>
                        ) : (
                          ['pengurus', 'ketua'].includes(session.role) && (
                            <div className="pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 space-y-3">
                              <textarea
                                placeholder="Masukkan tanggapan resmi dari pihak koperasi desa..."
                                value={aspResponse[asp.id] || ''}
                                onChange={(e) => setAspResponse({ ...aspResponse, [asp.id]: e.target.value })}
                                className="w-full p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl text-xs focus:outline-none h-16 resize-none"
                              />
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleRespondAspiration(asp.id)}
                                  className="py-1.5 px-4 bg-[#548C2F] hover:bg-[#427223] text-white text-[11px] font-black uppercase tracking-wider border border-[#F9A620]/20 rounded-xl transition-all cursor-pointer"
                                >
                                  Tanggapi Usulan
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    );
                  })}

                  {totalAspPages > 1 && (
                    <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-900 mt-4 text-xs">
                      <span className="text-stone-400 font-semibold">
                        Halaman {aspPage} dari {totalAspPages || 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setAspPage(p => Math.max(1, p - 1))}
                          disabled={aspPage === 1}
                          className="py-1 px-3 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 font-bold disabled:opacity-40"
                        >
                          Sebelumnya
                        </button>
                        <button
                          onClick={() => setAspPage(p => Math.min(totalAspPages, p + 1))}
                          disabled={aspPage >= totalAspPages}
                          className="py-1 px-3 rounded-lg border border-stone-200 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-900 font-bold disabled:opacity-40"
                        >
                          Berikutnya
                        </button>
                      </div>
                    </div>
                  )}

                  {filteredAspirations.length === 0 && (
                    <p className="text-xs text-stone-400 text-center py-4">Belum ada usulan warga.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 7: LITERASI & GAMIFIKASI             */}
          {/* ======================================= */}
          {activeTab === 'learning' && (
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#548C2F]/10 rounded-2xl text-[#548C2F]">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#548C2F] dark:text-white">
                      Peringkat Anggota: <span className="text-[#F9A620] uppercase">
                        {pointsBalance >= 150 ? 'Ahli Perkoperasian' : 
                         pointsBalance >= 50 ? 'Cakap Koperasi' : 'Pemula'}
                      </span>
                    </h3>
                    <p className="mt-1 text-xs text-stone-450 leading-relaxed">
                      Perdalam pengetahuan tata kelola dana desa dengan menjawab kuis untuk mendapatkan poin insentif belanja.
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-6 py-3.5 rounded-2xl min-w-[130px]">
                  <span className="text-[10px] font-black text-stone-450 block uppercase tracking-wider">Tabungan Poin</span>
                  <span className="text-2xl font-black text-[#548C2F] dark:text-white font-mono">{pointsBalance} PTS</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {modules.map((mod) => {
                  const progress = userProgress.find(p => p.module_id === mod.id);
                  const isCompleted = progress?.status === 'selesai';
                  const isStarted = progress?.status === 'sedang_berjalan';

                  return (
                    <div key={mod.id} className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] uppercase font-black tracking-wider bg-[#548C2F]/10 px-2.5 py-0.5 rounded-full text-[#548C2F]">
                            {mod.category.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-mono font-black text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
                            +{mod.points_reward} PTS
                          </span>
                        </div>
                        <h4 className="mt-3.5 text-sm font-black text-stone-800 dark:text-stone-200 leading-snug">
                          {mod.title}
                        </h4>
                      </div>

                      <div className="pt-4 border-t border-stone-100 dark:border-stone-900 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold">
                          {isCompleted ? (
                            <span className="text-[#15803d] flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Lulus</span>
                          ) : isStarted ? (
                            <span className="text-[#b45309] flex items-center gap-1"><Clock className="w-4 h-4 animate-spin" /> Mengikuti</span>
                          ) : (
                            <span className="text-stone-400">Belum dipelajari</span>
                          )}
                        </span>
                        
                        <button
                          onClick={() => handleStartLesson(mod)}
                          className="py-1.5 px-4 bg-[#548C2F] hover:bg-[#427223] text-white rounded-xl font-bold text-xs border border-[#F9A620]/20 transition-all cursor-pointer"
                        >
                          {isCompleted ? 'Pelajari Ulang' : isStarted ? 'Lanjutkan' : 'Mulai Belajar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* TAB 8: REWARD REDEMPTION                 */}
          {/* ======================================= */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">

              {/* Misi Mingguan Anggota Koperasi Section */}
              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-[#548C2F] dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#F9A620]" />
                      Misi Mingguan Anggota Kopdes
                    </h3>
                    <p className="text-[10px] text-stone-500 mt-1 font-medium">
                      Selesaikan misi mingguan koperasi di bawah ini untuk mendapatkan bonus poin belanja yang melimpah!
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-2 rounded-2xl flex items-center gap-2">
                      <Coins className="w-4 h-4 text-[#F9A620]" />
                      <span className="text-xs font-black text-stone-800 dark:text-stone-200 font-mono">Poin Anda: {pointsBalance} PTS</span>
                    </div>
                    <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-2 rounded-2xl flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#548C2F] dark:text-[#F9A620]" />
                      <span className="text-xs font-black text-stone-800 dark:text-stone-200 font-mono">Estimasi SHU: {totalKoperasiPoints > 0 ? ((pointsBalance / totalKoperasiPoints) * 100).toFixed(2) : '0.00'}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      code: 'misi1',
                      title: 'Tabungan Sukarela Rutin',
                      desc: 'Menabung simpanan sukarela koperasi desa minimal Rp10.000 minggu ini.',
                      points: 15,
                      progressText: `${fmt(missionsState.misi1?.progress || 0)} / ${fmt(missionsState.misi1?.target || 10000)}`,
                      completed: missionsState.misi1?.completed,
                      claimed: missionsState.misi1?.claimed,
                    },
                    {
                      code: 'misi2',
                      title: 'Hak Suara Demokrasi',
                      desc: 'Ikut serta memberikan hak suara pada agenda voting e-RAT koperasi minggu ini.',
                      points: 20,
                      progressText: `${missionsState.misi2?.progress || 0} / ${missionsState.misi2?.target || 1} Vote`,
                      completed: missionsState.misi2?.completed,
                      claimed: missionsState.misi2?.claimed,
                    },
                    {
                      code: 'misi3',
                      title: 'Belanja Sembako Kopdes',
                      desc: 'Berbelanja kebutuhan pangan harian di Gerai Toko Kopdes minimal Rp50.000 minggu ini.',
                      points: 30,
                      progressText: `${fmt(missionsState.misi3?.progress || 0)} / ${fmt(missionsState.misi3?.target || 50000)}`,
                      completed: missionsState.misi3?.completed,
                      claimed: missionsState.misi3?.claimed,
                    },
                    {
                      code: 'misi4',
                      title: 'Cerdas Literasi Koperasi',
                      desc: 'Menyelesaikan minimal 1 modul kuis kelas literasi tata kelola koperasi minggu ini.',
                      points: 10,
                      progressText: `${missionsState.misi4?.progress || 0} / ${missionsState.misi4?.target || 1} Modul`,
                      completed: missionsState.misi4?.completed,
                      claimed: missionsState.misi4?.claimed,
                    }
                  ].map((misi) => (
                    <div key={misi.code} className="p-4 border border-stone-205 dark:border-stone-850 rounded-2xl flex flex-col justify-between gap-4 bg-stone-50/50 dark:bg-stone-900/10">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="badge badge-gold">+{misi.points} PTS</span>
                          <span className="text-[10px] text-stone-400 font-mono font-bold">{misi.progressText}</span>
                        </div>
                        <h4 className="text-xs font-black text-stone-800 dark:text-white">{misi.title}</h4>
                        <p className="text-[10px] text-stone-550 dark:text-stone-400 leading-relaxed font-medium">{misi.desc}</p>
                      </div>

                      <div className="pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-between">
                        <span className="text-[10px] font-bold">
                          {misi.claimed ? (
                            <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Poin Diklaim</span>
                          ) : misi.completed ? (
                            <span className="text-amber-600 font-black animate-pulse">Selesai • Siap Klaim</span>
                          ) : (
                            <span className="text-stone-400 font-semibold">Sedang berjalan</span>
                          )}
                        </span>

                        {misi.claimed ? (
                          <button
                            disabled
                            className="py-1 px-3 bg-stone-100 dark:bg-stone-800 text-stone-400 text-[10px] font-bold rounded-lg cursor-not-allowed"
                          >
                            Claimed
                          </button>
                        ) : misi.completed ? (
                          <button
                            onClick={() => handleClaimMission(misi.code, misi.points)}
                            disabled={missionClaimPending === misi.code}
                            className="py-1.5 px-4 bg-[#548C2F] hover:bg-[#427223] text-white text-[10px] font-black uppercase tracking-wider border border-[#F9A620]/20 rounded-lg cursor-pointer transition-all shadow-sm"
                          >
                            {missionClaimPending === misi.code ? 'Klaim...' : 'Klaim Poin'}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="py-1 px-3 bg-stone-100 dark:bg-stone-800 text-stone-400 text-[10px] font-bold rounded-lg cursor-not-allowed border border-stone-200 dark:border-stone-700"
                          >
                            Belum Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-2 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-3">
                    Katalog Hadiah Belanja Koperasi (Gerai Kopdes)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vouchers.map((voucher) => {
                      const points = userPoints?.total_points ? Number(userPoints.total_points) : 0;
                      const canRedeem = points >= voucher.points_cost && voucher.stock > 0;

                      return (
                        <div key={voucher.id} className="p-4 border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col justify-between gap-4 bg-stone-50 dark:bg-stone-900">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className="px-2.5 py-0.5 bg-[#F9A620] text-white rounded font-mono font-black text-xs shadow-inner">
                                {voucher.points_cost} PTS
                              </span>
                              <span className="text-[10px] text-stone-400 font-bold">Stok: {voucher.stock} Unit</span>
                            </div>
                            <h4 className="mt-3 text-xs font-black text-stone-800 dark:text-stone-200 leading-snug">
                              {voucher.title}
                            </h4>
                            <p className="text-[10px] text-stone-500 mt-1 leading-relaxed">
                              {voucher.description}
                            </p>
                          </div>

                          <button
                            onClick={() => handleRedeemVoucher(voucher.id)}
                            disabled={!canRedeem || isPending}
                            className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer text-center ${
                              canRedeem 
                                ? 'bg-[#548C2F] hover:bg-[#427223] text-white border border-[#F9A620]/20 shadow' 
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                            }`}
                          >
                            Tukarkan Poin
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="md:col-span-1 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-[#548C2F] dark:text-white border-b border-stone-200 dark:border-stone-800 pb-3">
                    Koleksi Voucher Belanja Anda ({myRedeemedVouchers.length})
                  </h3>

                  <div className="space-y-3.5">
                    {myRedeemedVouchers.map((uv) => (
                      <div key={uv.id} className="p-3 border border-dashed border-[#F9A620]/50 rounded-2xl bg-white dark:bg-stone-900 shadow-sm space-y-3">
                        <div className="text-[10px] font-black text-stone-450 uppercase">{uv.title}</div>
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-stone-100 dark:bg-stone-850 border border-stone-200 rounded font-mono font-black text-[#F9A620] text-xs">
                            {uv.code}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                            Aktif
                          </span>
                        </div>
                        <p className="text-[9px] text-stone-450 mt-1 leading-normal italic">
                          Tunjukkan kode kupon di atas saat transaksi di Kasir Gerai Koperasi.
                        </p>
                      </div>
                    ))}
                    {myRedeemedVouchers.length === 0 && (
                      <p className="text-xs text-stone-400 text-center py-4">Belum ada voucher belanja yang diklaim.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai_assistant' && (
            <div className="space-y-6 animate-scale-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Kolom Kiri: Chatbot Assistant */}
                <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm flex flex-col h-[600px]">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
                    <div>
                      <h3 className="text-sm font-black text-[#548C2F] dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#F9A620]" />
                        Asisten AI Kepatuhan Kopdes
                      </h3>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Konsultan hukum virtual untuk kepatuhan PMK, SAK ETAP, dan UU Koperasian.
                      </p>
                    </div>
                    <span className="badge badge-gold">MOCK AI GATEWAY</span>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
                    {aiMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-[#548C2F] text-white rounded-tr-none'
                              : 'bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-tl-none font-medium'
                          }`}
                        >
                          {msg.text.split('\n').map((line, lIdx) => {
                            if (line.startsWith('### ')) {
                              return <h4 key={lIdx} className="font-black text-[13px] my-2 text-[#548C2F] dark:text-amber-500">{line.replace('### ', '')}</h4>;
                            }
                            if (line.startsWith('- ') || line.startsWith('* ')) {
                              return <li key={lIdx} className="ml-4 list-disc my-1">{line.substring(2)}</li>;
                            }
                            // Bold markers
                            if (line.includes('**')) {
                              const parts = line.split('**');
                              return (
                                <p key={lIdx} className="my-1">
                                  {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold text-[#F9A620] dark:text-amber-400">{part}</strong> : part)}
                                </p>
                              );
                            }
                            return <p key={lIdx} className="my-1">{line}</p>;
                          })}
                        </div>
                      </div>
                    ))}
                    {aiPending && (
                      <div className="flex justify-start">
                        <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggestions */}
                  <div className="mb-4 space-y-2">
                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider block">Pertanyaan Disarankan:</span>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        'Audit kesehatan koperasi saat ini',
                        'Jelaskan aturan belanja Dana Desa (PMK 7/2026)',
                        'Batas kredit PMK 15/2026',
                        'Bagaimana aturan RAT?'
                      ].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSendAiMessage(s)}
                          disabled={aiPending}
                          className="py-1 px-3 bg-stone-100 hover:bg-[#F9A620] hover:text-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-full text-[10px] font-bold text-stone-600 dark:text-stone-300 transition-all cursor-pointer disabled:opacity-40"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Area */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendAiMessage(aiInput);
                    }}
                    className="flex gap-2 pt-3 border-t border-stone-200 dark:border-stone-800"
                  >
                    <input
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Tanyakan regulasi koperasi, PMK, atau audit keuangan..."
                      className="flex-1 p-2.5 bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 rounded-xl text-xs focus:outline-none"
                      disabled={aiPending}
                    />
                    <button
                      type="submit"
                      disabled={!aiInput.trim() || aiPending}
                      className="py-2.5 px-5 bg-[#548C2F] hover:bg-[#427223] text-white rounded-xl text-xs font-black uppercase tracking-wider border border-[#F9A620]/20 transition-all cursor-pointer disabled:opacity-40"
                    >
                      Kirim
                    </button>
                  </form>
                </div>

                {/* Kolom Kanan: AI Compliance Audit Report Center */}
                <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm flex flex-col h-[600px] overflow-hidden">
                  <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
                    <div>
                      <h3 className="text-sm font-black text-[#548C2F] dark:text-white flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-[#F9A620]" />
                        Pusat Audit Kepatuhan AI
                      </h3>
                      <p className="text-[10px] text-stone-500 mt-1">
                        Jalankan audit komprehensif real-time terhadap seluruh database transaksi KDMP.
                      </p>
                    </div>
                    {['pengurus', 'ketua', 'pendamping'].includes(session.role) && (
                      <button
                        onClick={handleRunAiAudit}
                        disabled={aiAuditPending}
                        className="py-2 px-4 bg-[#548C2F] hover:bg-[#427223] text-white rounded-xl text-[10px] font-black uppercase tracking-wider border border-[#F9A620]/20 transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#F9A620]" />
                        {aiAuditPending ? 'Mengaudit...' : 'Jalankan Audit'}
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
                    {aiAuditPending ? (
                      <div className="flex flex-col items-center justify-center h-full space-y-3 py-10">
                        <div className="w-10 h-10 border-4 border-stone-200 border-t-[#F9A620] rounded-full animate-spin" />
                        <p className="text-xs text-stone-500 font-bold animate-pulse text-center">
                          Menganalisis keselarasan transaksi kas dengan PMK 7/2026, PMK 15/2026, SAK ETAP, dan UU Koperasi...
                        </p>
                      </div>
                    ) : aiAuditReport ? (
                      <div className="bg-stone-50 dark:bg-stone-900/40 p-5 rounded-2xl border border-stone-100 dark:border-stone-800 text-xs leading-relaxed text-stone-800 dark:text-stone-300 font-medium">
                        {aiAuditReport.split('\n').map((line, rIdx) => {
                          if (line.startsWith('# ')) {
                            return <h1 key={rIdx} className="text-base font-black text-[#548C2F] dark:text-amber-500 border-b border-stone-200 dark:border-stone-800 pb-2 mb-4">{line.replace('# ', '')}</h1>;
                          }
                          if (line.startsWith('## ')) {
                            return <h2 key={rIdx} className="text-sm font-black text-[#548C2F] dark:text-amber-400 mt-4 mb-2">{line.replace('## ', '')}</h2>;
                          }
                          if (line.startsWith('### ')) {
                            return <h3 key={rIdx} className="text-xs font-black text-stone-800 dark:text-stone-200 mt-3 mb-2">{line.replace('### ', '')}</h3>;
                          }
                          if (line.startsWith('- ') || line.startsWith('* ')) {
                            return <li key={rIdx} className="ml-4 list-disc my-1">{line.substring(2)}</li>;
                          }
                          if (line.includes('**')) {
                            const parts = line.split('**');
                            return (
                              <p key={rIdx} className="my-1.5">
                                {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold text-[#F9A620] dark:text-amber-400">{part}</strong> : part)}
                              </p>
                            );
                          }
                          return <p key={rIdx} className="my-1">{line}</p>;
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-10">
                        <FileText className="w-16 h-16 text-stone-300 dark:text-stone-700 stroke-1" />
                        <div>
                          <p className="text-xs font-black text-stone-700 dark:text-stone-300">Belum ada Laporan Audit Aktif</p>
                          <p className="text-[10px] text-stone-400 max-w-xs mt-1">
                            Tekan tombol **"Jalankan Audit"** di atas untuk menganalisis pembukuan kas Koperasi Desa Merah Putih secara cerdas menggunakan Gemini AI.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'microsite' && (
            <div className="space-y-6 animate-scale-in">
              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-8 rounded-3xl shadow-sm space-y-8">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#548C2F] to-[#0d341c] p-8 text-white border border-[#F9A620]/20 shadow-inner flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-[#F9A620]/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="space-y-3 z-10">
                    <div className="flex items-center gap-3">
                      <span className="badge badge-gold">SIMKOPDES PORTAL</span>
                      <span className="badge badge-success">TERVERIFIKASI</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">{koperasi?.nama_koperasi || 'Koperasi Desa Merah Putih'}</h2>
                    <p className="text-xs text-stone-300 max-w-xl font-medium">
                      Wajah digital resmi Koperasi Desa/Kelurahan Merah Putih (KDKMP) berdasarkan basis data terintegrasi Kementerian Koperasi RI.
                    </p>
                  </div>
                  <div className="flex flex-col items-end z-10">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">NIK KOPERASI</span>
                    <span className="text-sm font-mono font-black text-amber-400 tracking-widest">{koperasi?.nik_koperasi || '3201010000000001'}</span>
                  </div>
                </div>

                {/* Grid Legalitas & Informasi */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
                    <h4 className="text-[10px] font-black text-stone-450 uppercase tracking-widest mb-3">Identitas Hukum</h4>
                    <dl className="space-y-2.5 text-xs">
                      <div>
                        <dt className="text-stone-400 font-medium">Bentuk Koperasi</dt>
                        <dd className="font-extrabold text-stone-800 dark:text-stone-200 mt-0.5">{koperasi?.bentuk_koperasi || 'Produsen'}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-400 font-medium">Kategori Usaha</dt>
                        <dd className="font-extrabold text-stone-800 dark:text-stone-200 mt-0.5">{koperasi?.kategori_usaha || 'Sektor Riil'}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-400 font-medium">Modal Awal Pendirian</dt>
                        <dd className="font-extrabold text-stone-800 dark:text-stone-200 mt-0.5">{fmt(koperasi?.modal_awal || 250000000)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
                    <h4 className="text-[10px] font-black text-stone-450 uppercase tracking-widest mb-3">Lokasi & Wilayah Kerja</h4>
                    <dl className="space-y-2.5 text-xs">
                      <div>
                        <dt className="text-stone-400 font-medium">Alamat Lengkap Kantor</dt>
                        <dd className="font-extrabold text-stone-800 dark:text-stone-200 mt-0.5 leading-relaxed">{koperasi?.alamat_lengkap || 'Jalan Raya Puncak No. 100'}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-400 font-medium">Provinsi / Kabupaten / Kecamatan</dt>
                        <dd className="font-extrabold text-stone-800 dark:text-stone-200 mt-0.5">Jawa Barat / Kab. Bogor / Ciawi</dd>
                      </div>
                      <div>
                        <dt className="text-stone-400 font-medium">Kode Pos</dt>
                        <dd className="font-extrabold text-stone-800 dark:text-stone-200 mt-0.5">{koperasi?.kode_pos || '16720'}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
                    <h4 className="text-[10px] font-black text-stone-450 uppercase tracking-widest mb-3">Statistik Transparansi</h4>
                    <dl className="space-y-2.5 text-xs">
                      <div>
                        <dt className="text-stone-400 font-medium">Anggota Terdaftar Aktif</dt>
                        <dd className="font-extrabold text-stone-800 dark:text-stone-200 mt-0.5">{villageEcoSummary?.member_count || 1} Anggota</dd>
                      </div>
                      <div>
                        <dt className="text-stone-400 font-medium">Sisa Hasil Usaha (SHU) Berjalan</dt>
                        <dd className="font-extrabold text-stone-800 dark:text-stone-200 mt-0.5 text-green-600 dark:text-green-400">
                          {fmt((financialSummary?.pemasukan_kas || 0) - (financialSummary?.pengeluaran_kas || 0))}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-stone-400 font-medium">Skor Kepatuhan Audit Kemenkop</dt>
                        <dd className="font-extrabold text-stone-800 dark:text-stone-200 mt-0.5 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-[#F9A620]" />
                          <span>{complianceSummary?.health_score || 100} / 100</span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Unit Usaha KDKMP */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider">Unit Usaha Utama KDKMP</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: 'Toko Retail Sembako Kopdes', desc: 'Gerai sembako penyedia bahan pokok pangan murah bagi warga desa secara luring.', badge: 'RITEL' },
                      { title: 'Lumbung Pangan Mandiri', desc: 'Gudang penyimpanan dan pengeringan padi/jagung dari petani anggota koperasi.', badge: 'AGRIBISNIS' },
                      { title: 'Unit Pembiayaan Mikro Kopdes', desc: 'Layanan fasilitas simpanan wajib/sukarela dan penyaluran kredit produktif pedagang.', badge: 'FINANCIAL' }
                    ].map((unit, uidx) => (
                      <div key={uidx} className="card p-5 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="badge badge-gold">{unit.badge}</span>
                          <span className="text-[10px] text-green-600 font-bold uppercase">AKTIF</span>
                        </div>
                        <h4 className="text-xs font-black text-stone-800 dark:text-white">{unit.title}</h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed font-medium">{unit.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'proposals' && ['pengurus', 'ketua'].includes(session.role) && (
            <div className="space-y-6 animate-scale-in">
              
              {/* Form pengajuan */}
              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                <h3 className="text-sm font-black text-[#548C2F] dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#F9A620]" />
                  Pengajuan Pembiayaan & Kemitraan Kopdes (SIMKOPDES Portal)
                </h3>
                <p className="text-[11px] text-stone-500 mb-6 font-medium">
                  Salurkan proposal program pembiayaan, perluasan gerai, atau usaha agribisnis koperasi secara langsung ke Portal Pembiayaan Kementerian Koperasi RI.
                </p>

                <form onSubmit={handleSubmitProposal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="label">Nama Penanggung Jawab Kopdes</label>
                      <input
                        type="text"
                        value={proposalPj}
                        onChange={(e) => setProposalPj(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Nomor WhatsApp Penanggung Jawab</label>
                      <input
                        type="text"
                        value={proposalPhone}
                        onChange={(e) => setProposalPhone(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Nominal Permohonan (Rupiah)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 150000000"
                        value={proposalNominal}
                        onChange={(e) => setProposalNominal(e.target.value)}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">Tenor Pengembalian (Bulan)</label>
                      <select
                        value={proposalTenor}
                        onChange={(e) => setProposalTenor(e.target.value)}
                        className="select-field"
                      >
                        <option value="12">12 Bulan (1 Tahun)</option>
                        <option value="24">24 Bulan (2 Tahun)</option>
                        <option value="36">36 Bulan (3 Tahun)</option>
                        <option value="48">48 Bulan (4 Tahun)</option>
                        <option value="60">60 Bulan (5 Tahun)</option>
                        <option value="72">72 Bulan (6 Tahun - Batas PMK)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col justify-between">
                    <div>
                      <label className="label">Tujuan & Rencana Penggunaan Dana</label>
                      <textarea
                        rows={6}
                        placeholder="Jelaskan secara rinci rencana alokasi dana (misal: perluasan kapasitas gudang lumbung padi Kopdes Desa Merah Putih untuk menampung panen petani)..."
                        value={proposalTujuan}
                        onChange={(e) => setProposalTujuan(e.target.value)}
                        className="input-field resize-none h-[184px]"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={proposalPending}
                      className="w-full py-3.5 px-6 bg-[#548C2F] hover:bg-[#427223] text-white rounded-xl text-xs font-black uppercase tracking-wider border border-[#F9A620]/20 transition-all cursor-pointer disabled:opacity-40"
                    >
                      {proposalPending ? 'Mengirim Proposal...' : 'Kirim Permohonan ke Kemenkop'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Tabel history pengajuan */}
              <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm">
                <h3 className="text-xs font-black uppercase text-stone-400 tracking-wider mb-4">Daftar Pengajuan Pembiayaan Kopdes</h3>
                <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Ref Code</th>
                        <th>Penanggung Jawab</th>
                        <th>Nominal Permohonan</th>
                        <th>Tenor</th>
                        <th>Tujuan Permohonan</th>
                        <th>Tanggal Pengajuan</th>
                        <th>Status Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposalsList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-stone-400 font-medium">
                            Belum ada riwayat pengajuan pembiayaan aktif.
                          </td>
                        </tr>
                      ) : (
                        proposalsList.map((prop) => (
                          <tr key={prop.pengajuan_pembiayaan_ref}>
                            <td className="font-mono font-bold text-[#F9A620]">{prop.pengajuan_pembiayaan_ref}</td>
                            <td className="font-bold">{prop.penanggung_jawab}</td>
                            <td className="font-bold text-[#548C2F] dark:text-green-400">{fmt(prop.nominal_permohonan)}</td>
                            <td className="font-medium">{prop.tenor} Bulan</td>
                            <td className="max-w-[200px] truncate text-stone-500 font-medium" title={prop.tujuan_permohonan}>
                              {prop.tujuan_permohonan}
                            </td>
                            <td className="text-stone-400 font-semibold">{new Date(prop.dibuat_pada).toLocaleDateString('id-ID')}</td>
                            <td>
                              <span className="badge badge-gold">{prop.status_permohonan}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
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
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* CUSTOM DIALOG POPUP (NO CHROME ALERTS)   */}
      {/* ======================================= */}
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
                  <HelpCircle className="w-8 h-8" />
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
