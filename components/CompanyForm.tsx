"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Company } from "@/lib/types";

interface Props {
  initialData?: Omit<Company, "id" | "unread">;
  onSubmit: (data: Omit<Company, "id" | "unread">) => void;
  title: string;
}

export default function CompanyForm({ initialData, onSubmit, title }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
const [loginId, setLoginId] = useState(initialData?.loginId ?? "");
  const [mypageUrl, setMypageUrl] = useState(initialData?.mypageUrl ?? "");
  const [memo, setMemo] = useState(initialData?.memo ?? "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("企業名を入力してください。");
      return;
    }
    onSubmit({ name: name.trim(), genre: initialData?.genre ?? "", deadline: "", loginId, mypageUrl, memo });
    router.push("/");
  };

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all";

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        戻る
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">{title}</h1>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            企業名 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="例：楽天グループ"
            className={inputClass}
          />
          {error && (
            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">ログインID</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="例：taro.yamada@example.com"
              className={inputClass}
            />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
            <label className="block text-sm font-semibold text-slate-700 mb-2">マイページURL</label>
            <input
              type="url"
              value={mypageUrl}
              onChange={(e) => setMypageUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">メモ</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={5}
            placeholder="自由記入..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="flex-1 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-sm shadow-indigo-200"
          >
            保存する
          </button>
        </div>
      </form>
    </div>
  );
}
