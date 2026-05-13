"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ESSection {
  id: string;
  title: string;
  content: string;
}

const DEFAULT_SECTIONS: ESSection[] = [
  { id: "1", title: "志望動機", content: "" },
  { id: "2", title: "ガクチカ（学生時代に力を入れたこと）", content: "" },
  { id: "3", title: "長所・短所", content: "" },
  { id: "4", title: "将来のビジョン", content: "" },
];

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getRef() {
  return doc(db, "mypage", "es");
}

export default function EsTab() {
  const [sections, setSections] = useState<ESSection[]>(DEFAULT_SECTIONS);
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(getRef()).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (Array.isArray(d.sections)) setSections(d.sections);
      }
    });
  }, []);

  const handleChange = (id: string, field: "title" | "content", value: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    setSaved(false);
  };

  const addSection = () => {
    setSections((prev) => [...prev, { id: genId(), title: "新しいセクション", content: "" }]);
    setSaved(false);
  };

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await setDoc(getRef(), { sections });
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50/60">
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleChange(section.id, "title", e.target.value)}
              className="flex-1 text-sm font-semibold text-slate-700 bg-transparent focus:outline-none"
              placeholder="セクション名"
            />
            <button
              onClick={() => deleteSection(section.id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <textarea
            value={section.content}
            onChange={(e) => handleChange(section.id, "content", e.target.value)}
            placeholder="ここに書いてください…"
            rows={6}
            className="w-full px-5 py-4 text-sm text-slate-700 leading-relaxed placeholder:text-slate-300 focus:outline-none resize-none"
          />
          <div className="px-5 pb-3 flex justify-end">
            <span className="text-xs text-slate-300">{section.content.length} 文字</span>
          </div>
        </div>
      ))}

      <button
        onClick={addSection}
        className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-sm hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        セクションを追加
      </button>

      {/* Save */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saved && <span className="text-xs text-emerald-500">保存済み</span>}
        {!saved && <span className="text-xs text-slate-400">未保存の変更があります</span>}
        <button
          onClick={handleSave}
          disabled={saved || saving}
          className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm shadow-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "保存中…" : "保存する"}
        </button>
      </div>
    </div>
  );
}
