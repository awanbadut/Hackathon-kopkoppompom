import React from 'react';
import { Sparkles, FileCheck, FileText } from 'lucide-react';

interface AiAssistantTabProps {
  session: any;
  aiMessages: any[];
  aiInput: string;
  setAiInput: (val: string) => void;
  aiPending: boolean;
  handleSendAiMessage: (msg: string) => void;
  aiAuditPending: boolean;
  aiAuditReport: string | null;
  handleRunAiAudit: () => void;
}

export default function AiAssistantTab({
  session,
  aiMessages,
  aiInput,
  setAiInput,
  aiPending,
  handleSendAiMessage,
  aiAuditPending,
  aiAuditReport,
  handleRunAiAudit
}: AiAssistantTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-scale-in">
        
        {/* Kolom Kiri: Chatbot Assistant */}
        <div className="bg-white dark:bg-[#1c1a17] border border-stone-200 dark:border-stone-800 p-6 rounded-3xl shadow-sm flex flex-col h-[600px]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-black text-[#548C2F] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F9A620]" />
                Asisten AI Kepatuhan Kopdes
              </h3>
              <p className="text-[10px] text-stone-550 mt-1 font-medium">
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
                  {msg.text.split('\n').map((line: string, lIdx: number) => {
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
                          {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold text-[#F9A620] dark:text-amber-405">{part}</strong> : part)}
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
              <p className="text-[10px] text-stone-550 mt-1 font-medium">
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
                <p className="text-xs text-stone-550 font-bold animate-pulse text-center">
                  Menganalisis keselarasan transaksi kas dengan PMK 7/2026, PMK 15/2026, SAK ETAP, dan UU Koperasi...
                </p>
              </div>
            ) : aiAuditReport ? (
              <div className="bg-stone-50 dark:bg-stone-900/40 p-5 rounded-2xl border border-stone-100 dark:border-stone-800 text-xs leading-relaxed text-stone-850 dark:text-stone-300 font-medium">
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
                        {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold text-[#F9A620] dark:text-amber-405">{part}</strong> : part)}
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
                  <p className="text-xs font-black text-stone-750 dark:text-stone-350">Belum ada Laporan Audit Aktif</p>
                  <p className="text-[10px] text-stone-450 max-w-xs mt-1 leading-relaxed">
                    Tekan tombol <strong>"Jalankan Audit"</strong> di atas untuk menganalisis pembukuan kas Koperasi Desa Merah Putih secara cerdas menggunakan Gemini AI.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
