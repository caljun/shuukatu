"use client";

import { useState } from "react";
import ResumeTab from "./ResumeTab";

type Tab = "basic" | "interview";

export default function MyPage() {
  const [tab, setTab] = useState<Tab>("basic");

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">マイページ</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-8 w-fit">
        {(["basic", "interview"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === t
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "basic" ? "基本情報" : "面接対策"}
          </button>
        ))}
      </div>

      {tab === "basic" ? (
        <ResumeTab />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 px-6 py-16 text-center">
          <p className="text-sm text-slate-400">面接対策は準備中です</p>
        </div>
      )}
    </div>
  );
}
