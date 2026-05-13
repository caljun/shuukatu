"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCompanies } from "@/context/CompaniesContext";
import EditCompanyModal from "@/components/EditCompanyModal";

export default function CompanyDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { getCompany, deleteCompany } = useCompanies();
  const [editOpen, setEditOpen] = useState(false);

  const company = getCompany(id);

  if (!company) {
    return (
      <div className="p-8 text-center text-slate-400 mt-20">
        企業が見つかりませんでした。
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`「${company.name}」を削除しますか？`)) {
      deleteCompany(id);
      router.push("/");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {editOpen && <EditCompanyModal company={company} onClose={() => setEditOpen(false)} />}

      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        企業一覧へ戻る
      </button>

      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 mb-4">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold text-slate-800">{company.name}</h1>
          <div className="flex gap-2 ml-4 shrink-0">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              編集
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              削除
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">ログインID</p>
          <p className="text-slate-800 font-medium text-sm">
            {company.loginId || <span className="text-slate-400 font-normal">未設定</span>}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">マイページ</p>
          {company.mypageUrl ? (
            <a
              href={company.mypageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              マイページを開く
            </a>
          ) : (
            <span className="text-slate-400 text-sm">未設定</span>
          )}
        </div>

        <div className="col-span-2 bg-white rounded-2xl border border-slate-200/60 p-5">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">メモ</p>
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {company.memo || <span className="text-slate-400">なし</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
