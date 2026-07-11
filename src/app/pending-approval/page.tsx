import React from 'react';
import { logoutAction } from '../actions';
import { Clock, ShieldAlert, LogOut, RefreshCw } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db, p } from '@/lib/db';

export default async function PendingApprovalPage() {
 const session = await getSession();
 
 if (!session) {
 redirect('/');
 }

 // Double check status in DB using pg
 const { rows } = await db.query(
 `SELECT status FROM ${p('app_users')} WHERE id = $1`,
 [session.userId]
 );
 const user = rows[0];

 if (user && user.status === 'active') {
 redirect('/dashboard');
 }

 return (
 <div className="flex-1 flex flex-col justify-center items-center p-6 bg-[#fdfbf7]">
 <div className="max-w-md w-full text-center p-8 bg-white border border-[#e5e0d8] rounded-2xl shadow-xl shadow-stone-900/5">
 <div className="w-16 h-16 bg-[#FFFBEA] border border-[#FFE79A] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#E08E10]">
 <Clock className="w-8 h-8 animate-pulse" />
 </div>

 <h1 className="text-2xl font-bold text-[#1c1a16] tracking-tight">
 Menunggu Verifikasi Pengurus
 </h1>
 <p className="mt-3 text-sm text-[#7c7567] leading-relaxed">
 Halo, <span className="font-semibold text-[#1c1a16]">{session.fullName}</span>. Pendaftaran akun Anda sebagai <span className="font-medium text-[#cc3333]">{session.role}</span> sedang dalam antrean verifikasi oleh Pengurus/Ketua Koperasi Desa Merah Putih.
 </p>

 <div className="mt-8 flex flex-col sm:flex-row gap-3">
 <a
 href="/pending-approval"
 className="flex-1 py-3 px-4 bg-white hover:bg-[#f6f2eb] border border-[#e5e0d8] rounded-xl text-sm font-medium transition-all text-[#1c1a16] flex items-center justify-center gap-2 cursor-pointer"
 >
 <RefreshCw className="w-4 h-4" />
 Periksa Status
 </a>
 
 <form action={logoutAction} className="flex-1">
 <button
 type="submit"
 className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 text-[#cc3333] border border-red-200 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
 >
 <LogOut className="w-4 h-4" />
 Keluar Akun
 </button>
 </form>
 </div>

 <div className="mt-6 flex items-center gap-2 justify-center text-xs text-[#7c7567]">
 <ShieldAlert className="w-3.5 h-3.5" />
 Akses dibatasi sampai status disetujui
 </div>
 </div>
 </div>
 );
}
