"use client";

import { useState } from "react";
import ResumeTab from "./ResumeTab";
import EsTab from "./EsTab";

type Tab = "resume" | "es";

export default function MyPage() {
  const [tab, setTab] = useState<Tab>("resume");

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">マイページ</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-8 w-fit">
        {(["resume", "es"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === t
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "resume" ? "履歴書" : "ES"}
          </button>
        ))}
      </div>

      {tab === "resume" ? <ResumeTab /> : <EsTab />}
    </div>
  );
}
