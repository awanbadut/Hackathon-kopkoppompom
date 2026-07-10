'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction, requestOtpAction } from './actions';
import { parseNIK } from '@/lib/nik-parser';
import type { ParsedNIK } from '@/lib/nik-parser';
import {
  Shield, KeyRound, Phone, ArrowRight, Lock, Users, Sparkles,
  MessageSquare, CheckCircle, AlertCircle, RefreshCw, Scale, Search, X, Landmark
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Dynamic OTP state
  const [otpSuccess, setOtpSuccess] = useState<string | null>(null);
  const [simulatedOtpMsg, setSimulatedOtpMsg] = useState<{
    visible: boolean;
    name: string;
    code: string;
  } | null>(null);

  // NIK Validation Tool state
  const [nikInput, setNikInput] = useState('');
  const [nikResult, setNikResult] = useState<ParsedNIK | null>(null);

  const demoAccounts = [
    { role: 'Ketua Koperasi', phone: '081200000001', icon: Shield, badge: 'ADMIN' },
    { role: 'Bendahara (Pengurus)', phone: '081200000002', icon: Landmark, badge: 'PENGURUS' },
    { role: 'Anggota Koperasi', phone: '081200000003', icon: Users, badge: 'ANGGOTA' },
    { role: 'Pendamping Kemenkop', phone: '081200000099', icon: Scale, badge: 'AUDITOR' },
  ];

  const handleDemoFill = (phone: string) => {
    setPhoneNumber(phone);
    setOtp('123456');
    setError(null);
    setOtpSuccess(null);
    setSimulatedOtpMsg(null);
  };

  const handleRequestOtp = async () => {
    setError(null);
    setOtpSuccess(null);
    setSimulatedOtpMsg(null);

    if (!phoneNumber || !phoneNumber.trim()) {
      setError('Masukkan nomor HP terlebih dahulu untuk meminta OTP.');
      return;
    }

    startTransition(async () => {
      const res = await requestOtpAction(phoneNumber);
      if (res.error) {
        setError(res.error);
      } else if (res.success && res.otp) {
        setOtpSuccess('OTP berhasil dikirim via WhatsApp!');
        setSimulatedOtpMsg({
          visible: true,
          name: res.fullName || 'Anggota Koperasi',
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
      formData.append('phone_number', phoneNumber);
      formData.append('otp', otp);

      const result = await loginAction(null, formData);
      if (result && result.error) {
        setError(result.error);
      } else if (result && result.success && result.redirectPath) {
        router.push(result.redirectPath);
      }
    });
  };

  const handleNikCheck = (val: string) => {
    setNikInput(val);
    if (val.trim().length >= 6) {
      const parsed = parseNIK(val);
      setNikResult(parsed);
    } else {
      setNikResult(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">

      {/* ═══════════════════════════════════════════════
          LEFT COLUMN — Forest Green & Gold Branding
          ═══════════════════════════════════════════════ */}
      <div
        className="relative lg:w-[52%] flex flex-col justify-between overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #104911 0%, #205c21 50%, #548C2F 100%)',
        }}
      >
        {/* Decorative floating orbs */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.07] animate-float"
          style={{ background: 'radial-gradient(circle, #F9A620 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-[0.05] animate-float"
          style={{ background: 'radial-gradient(circle, #548C2F 0%, transparent 70%)', animationDelay: '1.5s' }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-12 lg:p-16">

          {/* Logo */}
          <div className="animate-slide-in-left stagger-1">
            <div className="flex items-center gap-3.5">
              <div
                className="p-3 rounded-2xl shadow-lg border border-white/10"
                style={{ background: 'linear-gradient(135deg, #F9A620 0%, #FFD449 100%)' }}
              >
                <Shield className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white block leading-none">
                  AmanDes
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-emerald-300/70 mt-0.5 block">
                  Sistem Pengawasan Keuangan Desa
                </span>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="max-w-lg my-12 lg:my-0 space-y-7">

            {/* Badge */}
            <div className="animate-slide-in-left stagger-2">
              <span className="badge badge-gold" style={{ background: 'rgba(249,166,32,0.15)', color: '#FFD449', borderColor: 'rgba(249,166,32,0.3)' }}>
                <Sparkles className="w-3 h-3" />
                Tema 3 — Digital Cooperatives Hackathon 2026
              </span>
            </div>

            {/* Hero Title */}
            <h1 className="animate-slide-in-left stagger-3 text-4xl md:text-[2.75rem] lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
              Aman Kelola,{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #FFD449, #F9A620)' }}>
                Transparan
              </span>{' '}
              &amp; Patuh Hukum
            </h1>

            {/* Subtitle */}
            <p className="animate-slide-in-left stagger-4 text-emerald-200/70 text-sm md:text-base leading-relaxed max-w-md">
              Menegakkan tata kelola Koperasi Desa secara real-time berdasarkan{' '}
              <strong className="text-emerald-100">UU Koperasi No. 25/1992</strong>,{' '}
              <strong className="text-emerald-100">UU Desa No. 6/2014</strong>, serta regulasi{' '}
              <strong className="text-emerald-100">PMK 7/2026</strong> &amp;{' '}
              <strong className="text-emerald-100">PMK 15/2026</strong>.
            </p>

            {/* NIK KTP Parser Widget */}
            <div className="animate-slide-in-left stagger-5">
              <div
                className="card-glass p-5 rounded-2xl space-y-4"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                }}
              >
                <h4 className="text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2" style={{ color: '#F9A620' }}>
                  <Scale className="w-4 h-4" />
                  Kalkulator Kepatuhan KTP/NIK (UU PDP)
                </h4>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="w-3.5 h-3.5 text-stone-400" />
                  </span>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Ketik 16 digit NIK KTP Anda..."
                    value={nikInput}
                    onChange={(e) => handleNikCheck(e.target.value)}
                    className="input-field pl-9 font-mono text-xs"
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      color: '#1c1917',
                      borderColor: 'rgba(255,255,255,0.2)',
                    }}
                  />
                </div>

                {nikResult && (
                  <div
                    className="animate-fade-in-up rounded-xl p-3.5 space-y-2"
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    {nikResult.isValid ? (
                      <>
                        <div className="flex items-center gap-1.5 text-[11px] font-black text-green-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          NIK Valid &amp; Terverifikasi
                        </div>
                        <div className="text-[10px] text-emerald-200/80 space-y-1">
                          <div>
                            <span className="font-bold text-emerald-100">Wilayah:</span>{' '}
                            {nikResult.provinsi}, {nikResult.kabupaten}, {nikResult.kecamatan}
                          </div>
                          <div>
                            <span className="font-bold text-emerald-100">Info Personal:</span>{' '}
                            {nikResult.jenisKelamin} &bull; Lahir: {nikResult.tanggalLahir} ({nikResult.umur} tahun)
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {nikResult.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="animate-slide-in-left stagger-6 text-[10px] text-emerald-300/40 font-semibold tracking-wide">
            AmanDes &copy; 2026 &bull; Tim Inspeksi Kos &bull; Kementerian Koperasi RI
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          RIGHT COLUMN — Login Form
          ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-[var(--background)]">
        <div className="w-full max-w-md space-y-8">

          {/* Heading */}
          <div className="animate-fade-in-up stagger-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(180deg, #F9A620, #548C2F)' }} />
              <h2 className="text-2xl font-black tracking-tight" style={{ color: 'var(--primary)' }}>
                Masuk Gerbang AmanDes
              </h2>
            </div>
            <p className="text-xs font-semibold ml-3" style={{ color: 'var(--text-muted)' }}>
              Gunakan Nomor HP demo Anda untuk masuk ke sistem pengawasan Koperasi Desa.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="animate-fade-in-up card p-4 flex items-start gap-3" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {otpSuccess && (
            <div className="animate-fade-in-up card p-4 flex items-start gap-3" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-green-800">{otpSuccess}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Phone Number Field */}
            <div className="animate-fade-in-up stagger-2">
              <label className="label flex items-center gap-1.5">
                <Phone className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                Nomor Handphone Terdaftar
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="phone_number"
                  placeholder="Contoh: 081200000001"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-field pl-10 font-mono font-bold text-xs"
                  required
                />
              </div>
            </div>

            {/* OTP Field + Request Button */}
            <div className="animate-fade-in-up stagger-3">
              <label className="label flex items-center gap-1.5">
                <Lock className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                Kode Verifikasi OTP
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none" style={{ color: 'var(--text-muted)' }}>
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Ketik 6-digit kode OTP..."
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field pl-10 font-mono font-bold text-xs"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  disabled={isPending}
                  className="btn-gold flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin' : ''}`} />
                  Minta OTP
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="animate-fade-in-up stagger-4 pt-1">
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2.5 text-sm disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Mengautentikasi...
                  </>
                ) : (
                  <>
                    Masuk ke Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ═══════════════════════════════════════════
              Demo Accounts Panel
              ═══════════════════════════════════════════ */}
          <div className="animate-fade-in-up stagger-5">
            <div className="pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
              <h3 className="label flex items-center gap-1.5 mb-4">
                <KeyRound className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                Akun Demo Koperasi (Klik untuk Auto-Fill)
              </h3>

              <div className="grid gap-2.5">
                {demoAccounts.map((acc, idx) => {
                  const Icon = acc.icon;
                  return (
                    <button
                      key={acc.phone}
                      type="button"
                      onClick={() => handleDemoFill(acc.phone)}
                      className={`card card-interactive flex items-center gap-3.5 p-3.5 text-left w-full animate-fade-in-up stagger-${Math.min(idx + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div
                        className="p-2 rounded-xl shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(20,83,45,0.08) 0%, rgba(202,138,4,0.06) 100%)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black truncate" style={{ color: 'var(--foreground)' }}>
                            {acc.role}
                          </span>
                          <span className="badge badge-success text-[8px] py-0">
                            {acc.badge}
                          </span>
                        </div>
                        <span
                          className="text-[10px] font-mono font-bold mt-0.5 block"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {acc.phone} &middot; OTP: 123456
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-30" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          WHATSAPP OTP TOAST NOTIFICATION
          ═══════════════════════════════════════════════ */}
      {simulatedOtpMsg && simulatedOtpMsg.visible && (
        <div
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-toast-in"
          style={{
            background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
            border: '1px solid #6ee7b7',
            borderRadius: '1.25rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(34,197,94,0.1)',
          }}
        >
          <div className="p-4 flex gap-3.5">
            {/* WhatsApp icon */}
            <div
              className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center animate-pulse-glow"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: '0 4px 16px rgba(34,197,94,0.3)',
              }}
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-green-800 flex items-center gap-1">
                  💬 WhatsApp AmanDes
                </span>
                <button
                  type="button"
                  onClick={() => setSimulatedOtpMsg(null)}
                  className="p-1 rounded-lg text-green-600 hover:text-green-900 hover:bg-green-200/50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="mt-1.5 text-[11px] text-green-900/80 leading-relaxed font-semibold">
                Halo <strong className="text-green-900">{simulatedOtpMsg.name}</strong>,
                <br />
                Kode OTP login AmanDes Anda:
              </p>

              {/* OTP Code Display */}
              <div
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{
                  background: 'white',
                  border: '2px dashed #F9A620',
                  boxShadow: '0 2px 8px rgba(249,166,32,0.1)',
                }}
              >
                <KeyRound className="w-3.5 h-3.5" style={{ color: '#F9A620' }} />
                <span className="font-mono font-black text-lg tracking-[0.2em]" style={{ color: '#F9A620' }}>
                  {simulatedOtpMsg.code}
                </span>
              </div>

              <span className="text-[9px] text-green-700/50 block mt-2 font-semibold">
                Berlaku selama 5 menit &bull; Tim Audit Kemenkop
              </span>
            </div>
          </div>

          {/* Bottom progress bar */}
          <div className="h-1 rounded-b-xl overflow-hidden" style={{ background: 'rgba(34,197,94,0.15)' }}>
            <div
              className="h-full rounded-full animate-progress-fill"
              style={{ width: '100%', background: 'linear-gradient(90deg, #22c55e, #16a34a)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
