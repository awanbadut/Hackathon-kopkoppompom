"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction, requestOtpAction } from "./actions";
import { parseNIK } from "@/lib/nik-parser";
import type { ParsedNIK } from "@/lib/nik-parser";
import {
  Shield,
  KeyRound,
  Phone,
  ArrowRight,
  Lock,
  Users,
  Sparkles,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Scale,
  Search,
  X,
  Landmark,
  TrendingUp,
  BookOpen,
  Vote,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Dialog State
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Dynamic OTP state
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);
  const [simulatedOtpMsg, setSimulatedOtpMsg] = useState<{
    visible: boolean;
    name: string;
    code: string;
  } | null>(null);

  // Rule-Based Compliance Simulator state
  const [simTxType, setSimTxType] = useState("simpanan_wajib");
  const [simNominal, setSimNominal] = useState("10000000");
  const [simResult, setSimResult] = useState<{
    status: "blocked" | "warning" | "allowed";
    pasal: string;
    message: string;
  } | null>(null);

  const demoAccounts = [
    {
      role: "Ketua Koperasi",
      phone: "081200000001",
      icon: Shield,
      badge: "ADMIN",
    },
    {
      role: "Bendahara (Pengurus)",
      phone: "081200000002",
      icon: Landmark,
      badge: "PENGURUS",
    },
    {
      role: "Anggota Koperasi",
      phone: "081200000003",
      icon: Users,
      badge: "ANGGOTA",
    },
    {
      role: "Pendamping Kemenkop",
      phone: "081200000099",
      icon: Scale,
      badge: "AUDITOR",
    },
  ];

  const handleDemoFill = (phone: string) => {
    setPhoneNumber(phone);
    setOtp("123456");
    setError(null);
    setOtpSuccess(null);
    setSimulatedOtpMsg(null);
  };

  const handleRequestOtp = async () => {
    setError(null);
    setOtpSuccess(null);
    setSimulatedOtpMsg(null);

    if (!phoneNumber || !phoneNumber.trim()) {
      setError("Masukkan nomor HP terlebih dahulu untuk meminta OTP.");
      return;
    }

    startTransition(async () => {
      const res = await requestOtpAction(phoneNumber);
      if (res.error) {
        setError(res.error);
      } else if (res.success && res.otp) {
        setOtpSuccess("OTP berhasil dikirim via WhatsApp!");
        setSimulatedOtpMsg({
          visible: true,
          name: res.fullName || "Anggota Koperasi",
          code: res.otp,
        });
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("phone_number", phoneNumber);
      formData.append("otp", otp);

      const result = await loginAction(null, formData);
      if (result && result.error) {
        setError(result.error);
      } else if (result && result.success && result.redirectPath) {
        router.push(result.redirectPath);
      }
    });
  };

  const handleSimulateCompliance = () => {
    const nominal = Number(simNominal) || 0;
    if (simTxType === "simpanan_wajib") {
      setSimResult({
        status: "blocked",
        pasal: "Pasal 41 UU Koperasi No. 25/1992",
        message:
          "Pencairan Simpanan Wajib DITOLAK. Simpanan pokok & wajib bersifat permanen dan hanya dapat dicairkan apabila anggota keluar dari keanggotaan koperasi.",
      });
    } else if (simTxType === "pinjaman") {
      if (nominal > 50000000) {
        setSimResult({
          status: "blocked",
          pasal: "Regulasi PMK 15/PMK.07/2026",
          message: `Pemberian Kredit sebesar Rp ${nominal.toLocaleString("id-ID")} DIBLOKIR. Aturan PMK membatasi pinjaman modal usaha perorangan maksimal Rp50.000.000 untuk menekan risiko kredit macet.`,
        });
      } else {
        setSimResult({
          status: "allowed",
          pasal: "Regulasi PMK 15/PMK.07/2026",
          message: `Pemberian Kredit sebesar Rp ${nominal.toLocaleString("id-ID")} DISETUJUI. Nominal berada di bawah batas maksimum kementerian dan memenuhi rasio likuiditas.`,
        });
      }
    } else if (simTxType === "pengeluaran_no_evidence") {
      if (nominal > 50000000) {
        setSimResult({
          status: "blocked",
          pasal: "Pasal 34 UU Koperasi & PMK 7/2026",
          message: `Transaksi Pengeluaran kas sebesar Rp ${nominal.toLocaleString("id-ID")} DIBLOKIR keras karena nominal melebihi Rp5.000.000 dan tidak melampirkan invoice/nota fisik.`,
        });
      } else if (nominal > 5000000) {
        setSimResult({
          status: "warning",
          pasal: "Pasal 34 UU Koperasi & AD Koperasi",
          message: `PENGASIH RISIKO TINGGI (BENDERA MERAH). Transaksi pengeluaran kas sebesar Rp ${nominal.toLocaleString("id-ID")} ditahan sementara menunggu otorisasi khusus dari Ketua Koperasi karena tidak disertai bukti fisik.`,
        });
      } else {
        setSimResult({
          status: "allowed",
          pasal: "Pasal 34 UU Koperasi & AD Koperasi",
          message: `Transaksi Pengeluaran kas sebesar Rp ${nominal.toLocaleString("id-ID")} DISETUJUI. Pengeluaran kecil di bawah Rp5.000.000 diperbolehkan dengan pelaporan standar.`,
        });
      }
    } else if (simTxType === "simpanan_sukarela") {
      setSimResult({
        status: "allowed",
        pasal: "Pasal 41 UU Koperasi No. 25/1992",
        message: `Setoran Simpanan Sukarela sebesar Rp ${nominal.toLocaleString("id-ID")} DISETUJUI. Tabungan sukarela bersifat likuid, tidak dikunci, dan dapat ditarik kembali oleh anggota kapan saja.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f3ef] text-[#1c1917] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#548C2F]/20 selection:text-[#104911]">
      {/* ═══════════════════════════════════════════════
          STICKY HEADER
          ═══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Container dengan latar putih untuk menonjolkan logo */}
            <div className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden">
              <img
                src="/logo.png"
                alt="AmanDes Logo"
                className="w-full h-full object-contain p-1.5"
              />
            </div>

            {/* Teks Brand */}
            <div>
              <span className="text-lg font-black tracking-tight text-[#104911] block leading-none">
                AmanDes
              </span>
              <span className="text-[8px] uppercase tracking-[0.18em] font-extrabold text-stone-400 mt-0.5 block">
                Audit Koperasi Desa
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-stone-500">
            <a href="#fitur" className="hover:text-[#548C2F] transition-all">
              Fitur Unggulan
            </a>
            <a href="#regulasi" className="hover:text-[#548C2F] transition-all">
              Dasar Hukum
            </a>
            <a
              href="#kalkulator"
              className="hover:text-[#548C2F] transition-all"
            >
              Uji Kepatuhan
            </a>
            <a
              href="#statistik"
              className="hover:text-[#548C2F] transition-all"
            >
              Statistik Desa
            </a>
          </nav>

          <button
            onClick={() => setIsLoginOpen(true)}
            className="py-2.5 px-6 bg-[#548C2F] hover:bg-[#427223] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md border border-[#F9A620]/20 transition-all hover:scale-[1.03] cursor-pointer flex items-center gap-2"
          >
            Masuk Portal
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════ */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-stone-200">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-[#104911]/[0.02] -skew-x-12 origin-top-right pointer-events-none" />

        {/* Floating gradient orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-[#F9A620]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-[#548C2F]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Copywriting */}
          <div className="lg:col-span-7 space-y-6 text-left animate-slide-in-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#548C2F]/10 border border-[#548C2F]/20 text-[#3F6B24] text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F9A620]" />
              Platform Pengawasan Keuangan Desa Terpadu
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight leading-[1.05] text-[#104911]">
              Aman Kelola, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9A620] to-[#E08E10]">
                Transparan
              </span>{" "}
              &amp; Patuh Hukum
            </h1>

            <p className="text-stone-550 text-sm md:text-base leading-relaxed max-w-xl font-medium">
              Menegakkan tata kelola permodalan dan pengeluaran Koperasi Desa
              secara real-time berdasarkan{" "}
              <strong className="text-[#104911]">
                UU Koperasi No. 25/1992
              </strong>
              , <strong className="text-[#104911]">UU Desa No. 6/2014</strong>,
              serta kepatuhan penuh terhadap regulasi{" "}
              <strong className="text-[#104911]">PMK 7/2026</strong> &amp;{" "}
              <strong className="text-[#104911]">PMK 15/2026</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="py-3.5 px-8 bg-[#548C2F] hover:bg-[#427223] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg border border-[#F9A620]/30 transition-all hover:scale-[1.02] cursor-pointer text-center"
              >
                Jelajahi Dashboard Demo
              </button>
              <a
                href="#kalkulator"
                className="py-3.5 px-8 bg-white hover:bg-stone-50 text-stone-700 text-xs font-black uppercase tracking-wider rounded-xl shadow-sm border border-stone-250 transition-all text-center"
              >
                Simulasi Kepatuhan
              </a>
            </div>

            {/* Micro Stats Banner */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-stone-200/80 max-w-lg">
              <div>
                <span className="text-2xl font-black text-[#548C2F] block">
                  100+
                </span>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Anggota Ter-seed
                </span>
              </div>
              <div>
                <span className="text-2xl font-black text-[#F9A620] block">
                  95 / 100
                </span>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Skor Kepatuhan AI
                </span>
              </div>
              <div>
                <span className="text-2xl font-black text-[#104911] block">
                  Real-Time
                </span>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Laporan Neraca/SHU
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Mockup Card */}
          <div className="lg:col-span-5 animate-fade-in-up">
            <div className="relative">
              {/* Decorative back border */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#104911] to-[#548C2F] rounded-3xl rotate-3 scale-[1.02] opacity-10 pointer-events-none" />

              {/* Main Card */}
              <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-xl space-y-6 relative z-10">
                <div className="flex items-center justify-between border-b border-stone-150 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#548C2F] animate-ping" />
                    <span className="text-xs font-black uppercase tracking-wider text-stone-800">
                      Buku Kas Real-Time
                    </span>
                  </div>
                  <span className="badge badge-gold">KOP-539EF09CDAAD</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-stone-450 uppercase tracking-wider block">
                      Total Saldo Kas Tersedia
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-black text-[#104911]">
                        Rp 5.250.000
                      </span>
                      <span className="text-xs text-[#3F6B24] font-extrabold flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> +15.5%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                      <span className="text-[8px] font-black text-stone-400 uppercase block">
                        Dana Desa
                      </span>
                      <span className="text-xs font-bold text-[#104911] mt-1 block">
                        Rp 250.000.000
                      </span>
                    </div>
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                      <span className="text-[8px] font-black text-stone-400 uppercase block">
                        Simpanan Sukarela
                      </span>
                      <span className="text-xs font-bold text-emerald-700 mt-1 block">
                        Rp 2.450.000
                      </span>
                    </div>
                  </div>

                  {/* Compliance Indicator */}
                  <div className="p-3.5 rounded-xl bg-[#F1F7EA] border border-[#C7DDAE] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-[#3F6B24] shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-[#3F6B24] block leading-none">
                          AUDIT KEPATUHAN AI
                        </span>
                        <span className="text-[9px] text-[#3F6B24]/70 block mt-0.5 font-semibold">
                          Transaksi terverifikasi PMK 7
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-[#3F6B24] font-mono">
                      100% PASS
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#104911] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center block border border-stone-200"
                  >
                    Simulasi Otomasi &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CASE STUDY SECTION: PAK BUDI & RULE-BASED ENGINE
          ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span
              className="badge badge-danger"
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "#dc2626",
                borderColor: "rgba(239,68,68,0.2)",
              }}
            >
              ⚠️ ANALISIS PERSONA & STUDI KASUS HUKUM
            </span>
            <h2 className="text-3xl font-black text-[#104911] tracking-tight leading-snug">
              Niat Baik Saja Tidak Cukup: Kisah Pelanggaran Hukum Pak Budi
            </h2>
            <p className="text-stone-500 text-xs font-medium leading-relaxed">
              Ketidaktahuan pengurus terhadap aturan regulasi yang rumit sering
              kali menjadi penyebab utama pelanggaran hukum administrasi hingga
              risiko tindak pidana korupsi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: The Problem (Pak Budi's Persona) */}
            <div className="lg:col-span-5 bg-white border border-red-200 p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-700 text-sm">
                    PB
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-850">
                      Pak Budi (52 Tahun)
                    </h4>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-red-650">
                      Bendahara Koperasi Desa Sukamakmur
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 text-[11px] leading-relaxed text-stone-600 font-medium">
                  <div className="p-3 bg-red-50/40 rounded-xl border border-red-100">
                    <span className="font-extrabold text-red-800 block mb-1">
                      💼 Tindakan Yang Dilakukan:
                    </span>
                    1. Menyetujui pencairan <strong>Simpanan Wajib</strong>{" "}
                    anggota sebesar Rp10.000.000 untuk membantu biaya darurat
                    medis warga.
                    <br className="mt-1" />
                    2. Menyalurkan kredit usaha sebesar{" "}
                    <strong>Rp65.000.000</strong> kepada pedagang lokal
                    menggunakan permodalan sisa Dana Desa.
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-extrabold text-stone-800 block mb-1">
                      ⚖️ Pelanggaran Hukum (Unintentional):
                    </span>
                    &bull; <strong>Pasal 41 UU Koperasi No. 25/1992:</strong>{" "}
                    Simpanan pokok &amp; wajib dilarang keras dicairkan selama
                    masih aktif menjadi anggota.
                    <br />
                    &bull; <strong>PMK 15/PMK.07/2026:</strong> Batas kredit
                    maksimal dari Dana Desa dibatasi Rp50.000.000 per anggota.
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <span className="text-[10px] font-black text-red-800 uppercase tracking-wider block mb-1">
                  🚨 Konsekuensi Hukum:
                </span>
                <p className="text-[10px] text-red-750 font-bold leading-normal">
                  Saat audit Kemenkop, Koperasi dinyatakan tidak patuh regulasi.
                  Bantuan permodalan dibekukan, dan Pak Budi dituduh melakukan
                  maladministrasi anggaran Dana Desa (Risiko Tindak Pidana
                  Tipikor).
                </p>
              </div>
            </div>

            {/* Middle Indicator */}
            <div className="lg:col-span-2 flex lg:flex-col items-center justify-center gap-3">
              <div className="h-0.5 w-8 lg:h-12 lg:w-0.5 bg-stone-300" />
              <span className="text-[9px] font-black text-[#F9A620] uppercase bg-[#FFFBEA] px-2.5 py-1 rounded-full border border-[#FFE79A] tracking-wider text-center">
                Solusi AmanDes
              </span>
              <div className="h-0.5 w-8 lg:h-12 lg:w-0.5 bg-stone-300" />
            </div>

            {/* Right: The Solution (AmanDes Rule-Based Engine) */}
            <div className="lg:col-span-5 bg-white border border-[#C7DDAE] p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#548C2F]/5 rounded-full blur-xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#548C2F]/10 flex items-center justify-center border border-[#548C2F]/20 text-[#548C2F]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-850">
                      AmanDes Rule-Based Engine
                    </h4>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#3F6B24]">
                      Pengawal Hukum Terotomasi
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-550 leading-relaxed font-medium">
                  AmanDes menanamkan langsung regulasi UU dan PMK ke dalam
                  sistem pembukuan transaksi secara real-time. Mesin aturan
                  (Rule Engine) kami secara otomatis menganalisis draft sebelum
                  transaksi disetujui.
                </p>

                <div className="space-y-3 pt-2 text-[10px] font-bold text-stone-750">
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#548C2F] text-white flex items-center justify-center font-mono text-[9px] mt-0.5">
                      1
                    </span>
                    <p className="flex-1">
                      <strong>Deteksi Instan:</strong> Saat Pak Budi menginput
                      pencairan simpanan wajib atau kredit Rp65 Juta, sistem
                      membaca kode pos dan tipe transaksi.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#548C2F] text-white flex items-center justify-center font-mono text-[9px] mt-0.5">
                      2
                    </span>
                    <p className="flex-1">
                      <strong>Pemblokiran Otomatis:</strong> Transaksi berstatus
                      draft langsung diberi bendera peringatan risiko tinggi
                      (R03 &amp; R04) dan <strong>dikunci otomatis</strong> dari
                      persetujuan.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-[#548C2F] text-white flex items-center justify-center font-mono text-[9px] mt-0.5">
                      3
                    </span>
                    <p className="flex-1">
                      <strong>Rekomendasi Tindakan:</strong> Sistem memberikan
                      solusi alternatif patuh hukum (misal: memandu anggota
                      melakukan penarikan sukarela saja).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F1F7EA] border border-[#C7DDAE] rounded-2xl flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#3F6B24] shrink-0" />
                <span className="text-[9px] text-[#3F6B24] font-black uppercase tracking-wider">
                  Hasil Akhir: Koperasi Bebas Pelanggaran &amp; Pengurus
                  Terlindungi
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BENTO GRID: FEATURE HIGHLIGHTS
          ═══════════════════════════════════════════════ */}
      <section
        id="fitur"
        className="py-20 bg-white border-b border-stone-200 relative"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-xs font-black text-[#F9A620] uppercase tracking-[0.2em]">
              Pilar Sistem Pengawasan
            </h2>
            <h3 className="text-2xl md:text-3xl font-black text-[#104911] tracking-tight leading-snug">
              Dirancang khusus untuk menjaga integritas, transparansi, dan
              kemandirian ekonomi desa.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Buku Kas Ledger */}
            <div className="card p-6 flex flex-col justify-between gap-6 hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#548C2F]/10 text-[#548C2F] flex items-center justify-center border border-[#548C2F]/20">
                  <Landmark className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-stone-800">
                  Buku Kas Ledger & Multi-Sumber
                </h4>
                <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
                  Pencatatan akuntansi terpisah antara kas Dana Desa dan kas
                  Non-Dana Desa secara otomatis. Dilengkapi upload bukti fisik
                  invoice yang sah.
                </p>
              </div>
              <span className="text-[9px] font-black text-[#548C2F] uppercase tracking-wider">
                Transparansi Keuangan &rarr;
              </span>
            </div>

            {/* 2. Audit Kepatuhan AI */}
            <div className="card p-6 flex flex-col justify-between gap-6 hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F9A620]/10 text-[#F9A620] flex items-center justify-center border border-[#F9A620]/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-stone-800">
                  Asisten & Audit Kepatuhan AI
                </h4>
                <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
                  Deteksi transaksi duplikat, verifikasi kepemilikan bukti nota
                  fisik, serta peringatan batas kredit maks Rp50 juta per
                  transaksi otomatis.
                </p>
              </div>
              <span className="text-[9px] font-black text-[#F9A620] uppercase tracking-wider">
                Kecerdasan Buatan &rarr;
              </span>
            </div>

            {/* 3. e-RAT Rapat Anggota */}
            <div className="card p-6 flex flex-col justify-between gap-6 hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#3F6B24] flex items-center justify-center border border-emerald-200">
                  <Vote className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-stone-800">
                  E-RAT (Rapat Anggota Tahunan)
                </h4>
                <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
                  Pemungutan suara dan keputusan rapat digital yang aman dan
                  terverifikasi NIK KTP. Setiap suara tercatat rapi untuk
                  laporan kepatuhan.
                </p>
              </div>
              <span className="text-[9px] font-black text-[#3F6B24] uppercase tracking-wider">
                Demokrasi Digital &rarr;
              </span>
            </div>

            {/* 4. Buku Simpanan Anggota */}
            <div className="card p-6 flex flex-col justify-between gap-6 hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#E08E10] flex items-center justify-center border border-amber-200">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-stone-800">
                  Buku Simpanan Pokok, Wajib, Sukarela
                </h4>
                <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
                  Pemisahan rekening saldo simpanan secara detail per anggota.
                  Simpanan pokok & wajib dikunci sesuai aturan, simpanan
                  sukarela cair kapan saja.
                </p>
              </div>
              <span className="text-[9px] font-black text-[#E08E10] uppercase tracking-wider">
                Manajemen Saldo &rarr;
              </span>
            </div>

            {/* 5. Musrenbang Aspirasi */}
            <div className="card p-6 flex flex-col justify-between gap-6 hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center border border-blue-200">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-stone-800">
                  Musrenbang & Aspirasi Warga
                </h4>
                <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
                  Forum usulan program pembangunan dari bawah ke atas. Mendukung
                  upvoting warga serta eskalasi langsung usulan populer ke
                  agenda e-RAT.
                </p>
              </div>
              <span className="text-[9px] font-black text-blue-700 uppercase tracking-wider">
                Partisipasi Warga &rarr;
              </span>
            </div>

            {/* 6. Literasi Gamifikasi */}
            <div className="card p-6 flex flex-col justify-between gap-6 hover:scale-[1.01] transition-transform">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-650 flex items-center justify-center border border-red-200">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-stone-800">
                  Kelas Literasi & Poin Belanja
                </h4>
                <p className="text-[11px] text-stone-550 font-medium leading-relaxed">
                  Modul belajar regulasi koperasi terintegrasi kuis berhadiah
                  poin. Tukarkan poin Anda dengan voucher sembako murah di Gerai
                  Koperasi.
                </p>
              </div>
              <span className="text-[9px] font-black text-red-650 uppercase tracking-wider">
                Kuis Edukasi &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          REGULASI & DASAR HUKUM Timeline
          ═══════════════════════════════════════════════ */}
      <section
        id="regulasi"
        className="py-20 bg-stone-50 border-b border-stone-200"
      >
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-black text-[#548C2F] uppercase tracking-[0.2em]">
              Pondasi Hukum Resmi
            </h2>
            <h3 className="text-2xl md:text-3xl font-black text-[#104911] tracking-tight">
              Kepatuhan Berdasarkan Undang-Undang
            </h3>
            <p className="text-stone-500 text-xs font-medium max-w-md mx-auto">
              Sistem ini mematuhi standar hukum nasional perkoperasian RI dan
              tata kelola anggaran dana desa.
            </p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-stone-200">
            {/* Timeline item 1 */}
            <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6">
              <div className="absolute left-4 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#548C2F] border-4 border-white -translate-x-1.5 z-10" />
              <div className="md:w-[45%] bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <span className="badge badge-success text-[8px]">
                  UU NO. 25 TAHUN 1992
                </span>
                <h4 className="text-xs font-black text-[#104911]">
                  UU Perkoperasian Indonesia
                </h4>
                <p className="text-[10px] text-stone-500 leading-relaxed font-medium">
                  Mengatur struktur wajib permodalan, RAT sebagai keputusan
                  tertinggi, pemisahan simpanan pokok/wajib dari sukarela, serta
                  pertanggungjawaban hukum pengurus koperasi.
                </p>
              </div>
              <div className="hidden md:block md:w-[45%]" />
            </div>

            {/* Timeline item 2 */}
            <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6">
              <div className="absolute left-4 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#F9A620] border-4 border-white -translate-x-1.5 z-10" />
              <div className="hidden md:block md:w-[45%]" />
              <div className="md:w-[45%] bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <span className="badge badge-gold text-[8px]">
                  UU NO. 6 TAHUN 2014
                </span>
                <h4 className="text-xs font-black text-[#104911]">
                  Pemberdayaan Ekonomi Desa
                </h4>
                <p className="text-[10px] text-stone-500 leading-relaxed font-medium">
                  Landasan hukum integrasi modal BUM Desa dengan Koperasi Desa
                  untuk memajukan ritel pangan murah dan pembiayaan mikro usaha
                  komoditas warga lokal.
                </p>
              </div>
            </div>

            {/* Timeline item 3 */}
            <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6">
              <div className="absolute left-4 md:left-1/2 w-3.5 h-3.5 rounded-full bg-red-600 border-4 border-white -translate-x-1.5 z-10" />
              <div className="md:w-[45%] bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <span className="badge badge-danger text-[8px]">
                  PMK NO. 7 &amp; 15 TAHUN 2026
                </span>
                <h4 className="text-xs font-black text-[#104911]">
                  Aturan Penyaluran &amp; Kredit Desa
                </h4>
                <p className="text-[10px] text-stone-500 leading-relaxed font-medium">
                  Membatasi pemberian pinjaman maksimal Rp50 juta per anggota
                  untuk menekan kredit macet, serta mewajibkan penyertaan modal
                  dana desa diaudit secara real-time dan terbuka.
                </p>
              </div>
              <div className="hidden md:block md:w-[45%]" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          RULE-BASED COMPLIANCE SIMULATOR
          ═══════════════════════════════════════════════ */}
      <section
        id="kalkulator"
        className="py-20 bg-white border-b border-stone-200"
      >
        <div className="max-w-2xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#548C2F]/10 text-[#548C2F] flex items-center justify-center border border-[#548C2F]/20 mx-auto">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#104911] tracking-tight">
              Kalkulator Kepatuhan &amp; Simulasi Transaksi (Rule-Based)
            </h3>
            <p className="text-[11px] text-stone-555 max-w-md mx-auto font-medium">
              Uji coba sistem pengawasan otomatis AmanDes. Simulasikan transaksi
              pencairan kas, pinjaman modal, atau penarikan wajib untuk melihat
              aturan hukum yang langsung memblokirnya jika terdeteksi melanggar.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-stone-200 bg-stone-50/50 space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-stone-600">
              <div>
                <label className="block text-stone-500 mb-1.5 font-bold">
                  Pilih Simulasi Transaksi
                </label>
                <select
                  value={simTxType}
                  onChange={(e) => {
                    setSimTxType(e.target.value);
                    setSimResult(null);
                  }}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none"
                >
                  <option value="simpanan_wajib">
                    Pencairan Simpanan Wajib Anggota (Pasal 41)
                  </option>
                  <option value="pinjaman">
                    Pemberian Pinjaman Modal Usaha (PMK 15/2026)
                  </option>
                  <option value="pengeluaran_no_evidence">
                    Pengeluaran Operasional Tanpa Bukti Nota (Pasal 34)
                  </option>
                  <option value="simpanan_sukarela">
                    Setoran Simpanan Sukarela Anggota (Pasal 41)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-stone-500 mb-1.5 font-bold">
                  Nominal Transaksi (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Masukkan nominal dalam Rupiah..."
                  value={simNominal}
                  onChange={(e) => {
                    setSimNominal(e.target.value);
                    setSimResult(null);
                  }}
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none font-mono font-bold text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleSimulateCompliance}
              className="w-full py-3 bg-[#548C2F] hover:bg-[#427223] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md border border-[#F9A620]/20 transition-all cursor-pointer text-center block"
            >
              Jalankan Analisis Kepatuhan Hukum
            </button>

            {simResult && (
              <div className="animate-fade-in-up rounded-2xl p-4 bg-white border border-stone-200 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                      simResult.status === "blocked"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : simResult.status === "warning"
                          ? "bg-[#FFFBEA] text-[#B36F0C] border-[#FFE79A]"
                          : "bg-[#F1F7EA] text-[#3F6B24] border-[#C7DDAE]"
                    }`}
                  >
                    {simResult.status === "blocked"
                      ? "❌ DIBLOKIR OTOMATIS"
                      : simResult.status === "warning"
                        ? "⚠️ TERTUNDA (RE-ROUTE)"
                        : "✅ DIPERBOLEHKAN (AMAN)"}
                  </span>
                  <span className="font-extrabold text-[#F9A620]">
                    {simResult.pasal}
                  </span>
                </div>
                <p className="text-[11px] text-stone-550 leading-relaxed font-semibold pt-1">
                  {simResult.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════ */}
      <footer className="mt-auto bg-[#0a230b] text-white py-12 border-t border-[#F9A620]/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#F9A620] text-white rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-base font-black uppercase tracking-tight">
                AmanDes
              </span>
            </div>
            <p className="text-[10px] text-stone-400 leading-relaxed font-medium max-w-xs">
              Sistem informasi permodalan, buku kas ledger terotomasi, dan modul
              literasi kuis patuh regulasi Kementerian Koperasi RI.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-black text-[#F9A620] uppercase tracking-wider">
              Pranala Cepat
            </h4>
            <div className="flex flex-col gap-2 font-bold text-stone-300">
              <a href="#fitur" className="hover:text-white transition-colors">
                Fitur Utama
              </a>
              <a
                href="#regulasi"
                className="hover:text-white transition-colors"
              >
                Undang-Undang
              </a>
              <a
                href="#kalkulator"
                className="hover:text-white transition-colors"
              >
                Uji Kepatuhan
              </a>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-black text-[#F9A620] uppercase tracking-wider">
              Mitra Resmi
            </h4>
            <p className="text-[10px] text-stone-400 font-semibold leading-relaxed">
              Tim Audit Pengawasan Keuangan Desa &amp; Kementerian Koperasi dan
              Usaha Kecil Menengah Republik Indonesia.
            </p>
            <div className="pt-2 text-[9px] text-[#A9CC85]/55 font-bold uppercase tracking-wider">
              AMANDES &copy; 2026 &bull; TIM INSPEKSI KOS
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════
          INTERACTIVE LOGIN DIALOG OVERLAY (Drawer/Modal)
          ═══════════════════════════════════════════════ */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-modal-overlay">
          <div className="bg-white border border-stone-200 w-full max-w-md p-6 rounded-3xl shadow-2xl relative animate-modal-content max-h-[90vh] overflow-y-auto scrollbar-thin">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsLoginOpen(false);
                setError(null);
                setOtpSuccess(null);
                setSimulatedOtpMsg(null);
              }}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#F9A620] to-[#548C2F]" />
              <h2 className="text-lg font-black tracking-tight text-[#104911]">
                Masuk Gerbang AmanDes
              </h2>
            </div>
            <p className="text-[10px] font-bold text-stone-500 mb-6">
              Gunakan nomor HP terdaftar akun demo Anda di bawah ini untuk
              mengakses dashboard.
            </p>

            {/* Alerts */}
            {error && (
              <div className="mb-4 animate-fade-in-up p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-750 text-[10px] font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {otpSuccess && (
              <div className="mb-4 animate-fade-in-up p-3.5 rounded-xl bg-[#F1F7EA] border border-[#C7DDAE] text-[#3F6B24] text-[10px] font-bold flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#548C2F] shrink-0 mt-0.5" />
                <span>{otpSuccess}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#F9A620]" />
                  Nomor HP Terdaftar
                </label>
                <input
                  type="text"
                  name="phone_number"
                  placeholder="Contoh: 081200000001"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-field font-mono text-xs"
                  required
                />
              </div>

              <div>
                <label className="label flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#F9A620]" />
                  Masukkan Kode OTP
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Masukkan 6 digit OTP..."
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field font-mono text-xs flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={isPending}
                    className="btn-gold text-[10px] uppercase font-black tracking-wider whitespace-nowrap disabled:opacity-50 flex items-center gap-1"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`}
                    />
                    Minta OTP
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-[#548C2F] hover:bg-[#427223] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md border border-[#F9A620]/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    Masuk ke Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts Panel */}
            <div className="mt-6 pt-6 border-t border-stone-200 space-y-3">
              <h3 className="label flex items-center gap-1 text-stone-500">
                <KeyRound className="w-3.5 h-3.5 text-[#F9A620]" />
                Akun Demo Koperasi (Klik untuk Auto-Fill)
              </h3>
              <div className="grid gap-2">
                {demoAccounts.map((acc, idx) => {
                  const Icon = acc.icon;
                  return (
                    <button
                      key={acc.phone}
                      type="button"
                      onClick={() => handleDemoFill(acc.phone)}
                      className="card card-interactive p-3 flex items-center justify-between text-left w-full cursor-pointer hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-stone-100 border border-stone-200">
                          <Icon className="w-3.5 h-3.5 text-[#104911]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-stone-800">
                              {acc.role}
                            </span>
                            <span className="badge badge-success text-[8px] py-0 px-1">
                              {acc.badge}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-stone-400 block mt-0.5">
                            {acc.phone} &bull; OTP: 123455 (Auto)
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          WHATSAPP OTP TOAST NOTIFICATION
          ═══════════════════════════════════════════════ */}
      {simulatedOtpMsg && simulatedOtpMsg.visible && (
        <div
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-toast-in"
          style={{
            background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
            border: "1px solid #6ee7b7",
            borderRadius: "1.25rem",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(34,197,94,0.1)",
          }}
        >
          <div className="p-4 flex gap-3.5">
            <div
              className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center animate-pulse-glow"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
              }}
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#2C561B] flex items-center gap-1">
                  💬 WhatsApp AmanDes
                </span>
                <button
                  type="button"
                  onClick={() => setSimulatedOtpMsg(null)}
                  className="p-1 rounded-lg text-[#548C2F] hover:text-[#1B3610] hover:bg-[#C7DDAE]/50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="mt-1.5 text-[11px] text-[#1B3610]/80 leading-relaxed font-semibold">
                Halo{" "}
                <strong className="text-[#1B3610]">
                  {simulatedOtpMsg.name}
                </strong>
                ,
                <br />
                Kode OTP login AmanDes Anda:
              </p>

              <div
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  background: "white",
                  border: "2px dashed #F9A620",
                  boxShadow: "0 2px 8px rgba(249,166,32,0.1)",
                }}
              >
                <KeyRound
                  className="w-3.5 h-3.5"
                  style={{ color: "#F9A620" }}
                />
                <span
                  className="font-mono font-black text-lg tracking-[0.2em]"
                  style={{ color: "#F9A620" }}
                >
                  {simulatedOtpMsg.code}
                </span>
              </div>

              <span className="text-[9px] text-[#3F6B24]/50 block mt-2 font-semibold">
                Berlaku selama 5 menit &bull; Tim Audit Kemenkop
              </span>
            </div>
          </div>

          <div
            className="h-1 rounded-b-xl overflow-hidden"
            style={{ background: "rgba(34,197,94,0.15)" }}
          >
            <div
              className="h-full rounded-full animate-progress-fill"
              style={{
                width: "100%",
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
