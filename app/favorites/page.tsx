"use client";

import { useState } from "react";
import { useCompanies } from "@/context/CompaniesContext";
import CompanyDetailModal from "@/components/CompanyDetailModal";

export default function FavoritesPage() {
  const { companies, loading } = useCompanies();
  const [detailId, setDetailId] = useState<string | null>(null);
  const favorites = companies.filter((company) => company.favorite);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      {detailId && <CompanyDetailModal companyId={detailId} onClose={() => setDetailId(null)} />}

      <div className="mb-6">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <h1 className="text-2xl font-bold text-slate-800">お気に入り</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">本命企業 {favorites.length} 社</p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400 py-16 text-center">読み込み中…</p>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 px-6 py-16 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-amber-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <p className="font-medium text-slate-600">お気に入り企業はまだありません</p>
          <p className="text-sm text-slate-400 mt-1">企業詳細の「お気に入り」から本命企業を追加できます</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {favorites.map((company) => (
            <button
              key={company.id}
              onClick={() => setDetailId(company.id)}
              className="group bg-white rounded-2xl border border-slate-200/60 p-5 text-left hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 group-hover:text-amber-700 transition-colors truncate">{company.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{company.genre || "未分類"}</p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 shrink-0">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              {company.memo && <p className="text-sm text-slate-500 mt-3 line-clamp-2 whitespace-pre-wrap">{company.memo}</p>}
              {company.loginId && <p className="text-xs text-slate-400 mt-3 truncate">{company.loginId}</p>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
