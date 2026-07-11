import React from "react";
import {
  Landmark,
  ChevronRight,
  Activity,
  FileText,
  Coins,
  FileCheck,
  ShieldAlert,
  BarChart3,
  Vote,
  MessageSquare,
  BookOpen,
  Tag,
  Sparkles,
  Globe,
  Briefcase,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  session: any;
  activeTab: string;
  handleTabChange: (tab: string) => void;
  setIsMobileMenuOpen?: (open: boolean) => void;
  myApprovals: any[];
  riskLogs: any[];
  logoutAction: any;
}

export default function Sidebar({
  session,
  activeTab,
  handleTabChange,
  setIsMobileMenuOpen,
  myApprovals,
  riskLogs,
  logoutAction,
}: SidebarProps) {
  const closeMenu = () => {
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const renderNavLinks = () => {
    return (
      <div className="space-y-1.5">
        <button
          onClick={() => {
            handleTabChange("overview");
            closeMenu();
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === "overview"
              ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
              : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-[#F9A620]" />
            Ringkasan Utama
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        {["pengurus", "ketua"].includes(session.role) && (
          <button
            onClick={() => {
              handleTabChange("transactions");
              closeMenu();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === "transactions"
                ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
                : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#F9A620]" />
              Buku Kas (Ledger)
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        )}

        {["pengurus", "ketua"].includes(session.role) && (
          <button
            onClick={() => {
              handleTabChange("member_savings");
              closeMenu();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === "member_savings"
                ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
                : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-[#F9A620]" />
              Buku Simpanan Warga
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        )}

        {session.role === "anggota" && (
          <button
            onClick={() => {
              handleTabChange("member_savings");
              closeMenu();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === "member_savings"
                ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
                : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-[#F9A620]" />
              Simpanan Saya
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        )}

        {["pengurus", "ketua"].includes(session.role) && (
          <button
            onClick={() => {
              handleTabChange("approvals");
              closeMenu();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === "approvals"
                ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
                : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FileCheck className="w-4 h-4 text-[#F9A620]" />
              approval center
            </span>
            {myApprovals.filter((a) => a.status === "menunggu").length > 0 ? (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-black bg-red-650 text-white animate-pulse">
                {myApprovals.filter((a) => a.status === "menunggu").length}
              </span>
            ) : (
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            )}
          </button>
        )}

        {["pengurus", "ketua", "pendamping"].includes(session.role) && (
          <button
            onClick={() => {
              handleTabChange("compliance");
              closeMenu();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === "compliance"
                ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
                : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
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
          onClick={() => {
            handleTabChange("financials");
            closeMenu();
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === "financials"
              ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
              : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4 text-[#F9A620]" />
            Laporan Keuangan
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => {
            handleTabChange("e_rat");
            closeMenu();
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === "e_rat"
              ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
              : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Vote className="w-4 h-4 text-[#F9A620]" />
            E-RAT (Rapat Anggota)
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => {
            handleTabChange("aspirations");
            closeMenu();
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === "aspirations"
              ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
              : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-[#F9A620]" />
            Musrenbang Anggot
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => {
            handleTabChange("learning");
            closeMenu();
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === "learning"
              ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
              : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-[#F9A620]" />
            Kelas Literasi
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => {
            handleTabChange("rewards");
            closeMenu();
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === "rewards"
              ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
              : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Tag className="w-4 h-4 text-[#F9A620]" />
            Hadiah Belanja
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => {
            handleTabChange("ai_assistant");
            closeMenu();
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === "ai_assistant"
              ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
              : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#F9A620]" />
            Asisten AI Kopdes
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        <button
          onClick={() => {
            handleTabChange("microsite");
            closeMenu();
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === "microsite"
              ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
              : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          <span className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-[#F9A620]" />
            Microsite Publik
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </button>

        {["pengurus", "ketua"].includes(session.role) && (
          <button
            onClick={() => {
              handleTabChange("proposals");
              closeMenu();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === "proposals"
                ? "bg-[#548C2F] text-white border-[#F9A620]/30 shadow-md"
                : "bg-transparent text-stone-300 hover:text-white hover:bg-white/5 border-transparent"
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
    <aside className="hidden lg:flex w-64 h-full bg-[#104911] text-[#f4f3ef] border-r border-[#F9A620]/25 flex-col justify-between shrink-0 z-30">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Logo Brand */}
        {/* Logo Brand */}
        <div className="p-5 border-b border-[#F9A620]/20 flex items-center gap-3">
          {/* Logo Container — Dibuat lebih besar (w-11 h-11) dan latar putih murni */}
          <div className="w-11 h-11 bg-white rounded-xl shadow-md flex items-center justify-center shrink-0 overflow-hidden border border-white">
            <img
              src="/logo.png"
              alt="AmanDes Logo"
              className="w-full h-full object-contain p-1.5"
            />
          </div>

          {/* Text Brand */}
          <div>
            <span className="font-black text-sm tracking-tight uppercase text-white block">
              AmanDes
            </span>
            <span className="text-[9px] text-[#A9CC85]/70 block">
              Koperasi Merah Putih
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 flex-1">{renderNavLinks()}</nav>
      </div>

      {/* User Info bottom panel */}
      <div className="p-4 border-t border-[#F9A620]/20 bg-[#0c360c] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-[#F9A620] text-white flex items-center justify-center font-black text-xs shrink-0 shadow">
            {session.fullName.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-black text-white block truncate leading-none mb-1">
              {session.fullName}
            </span>
            <span className="text-[8px] font-black uppercase bg-[#F9A620]/20 text-[#FFD449] px-1.5 py-0.5 rounded border border-[#F9A620]/10">
              {session.role}
            </span>
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
  );
}
