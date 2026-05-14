"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/mypage",
    label: "マイページ",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    href: "/",
    label: "企業一覧",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-20 flex">
      {NAV.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex-1 flex flex-col items-center justify-center py-5 gap-1 text-xs font-medium transition-colors ${
            isActive(href) ? "text-indigo-400" : "text-slate-500"
          }`}
        >
          {icon}
          {label}
        </Link>
      ))}
    </nav>
  );
}
