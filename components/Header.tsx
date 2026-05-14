"use client";

export default function Header() {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-slate-900 flex items-center px-5 z-20">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
          </svg>
        </div>
        <span className="text-white font-bold text-base tracking-tight">就活管理</span>
      </div>
    </header>
  );
}
