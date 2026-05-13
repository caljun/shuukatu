"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Resume {
  name: string;
  birthdate: string;
  address: string;
  phone: string;
  email: string;
  university: string;
  faculty: string;
  grade: string;
  graduationYear: string;
  certifications: string;
  hobbies: string;
  selfPr: string;
}

const DEFAULT: Resume = {
  name: "", birthdate: "", address: "", phone: "", email: "",
  university: "", faculty: "", grade: "", graduationYear: "",
  certifications: "", hobbies: "", selfPr: "",
};

const GRADE_OPTIONS = ["大学1年生", "大学2年生", "大学3年生", "大学4年生"];
const REF = doc(db, "mypage", "resume");

const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function ResumeTab() {
  const [data, setData] = useState<Resume>(DEFAULT);
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDoc(REF).then((snap) => {
      if (snap.exists()) setData({ ...DEFAULT, ...(snap.data() as Resume) });
    });
  }, []);

  const handleChange = (field: keyof Resume, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await setDoc(REF, data);
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <Section title="基本情報">
        <div className="grid grid-cols-2 gap-4">
          <Field label="氏名">
            <input type="text" value={data.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="山田 太郎" className={inputClass} />
          </Field>
          <Field label="生年月日">
            <input type="date" value={data.birthdate} onChange={(e) => handleChange("birthdate", e.target.value)} className={inputClass} />
          </Field>
          <Field label="電話番号">
            <input type="tel" value={data.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="090-0000-0000" className={inputClass} />
          </Field>
          <Field label="メールアドレス">
            <input type="email" value={data.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="taro@example.com" className={inputClass} />
          </Field>
          <div className="col-span-2">
            <Field label="住所">
              <input type="text" value={data.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="東京都渋谷区…" className={inputClass} />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="学歴">
        <div className="grid grid-cols-2 gap-4">
          <Field label="大学名">
            <input type="text" value={data.university} onChange={(e) => handleChange("university", e.target.value)} placeholder="○○大学" className={inputClass} />
          </Field>
          <Field label="学部・学科">
            <input type="text" value={data.faculty} onChange={(e) => handleChange("faculty", e.target.value)} placeholder="経済学部 経済学科" className={inputClass} />
          </Field>
          <Field label="学年">
            <select value={data.grade} onChange={(e) => handleChange("grade", e.target.value)} className={inputClass}>
              <option value="">選択</option>
              {GRADE_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="卒業予定年月">
            <input type="month" value={data.graduationYear} onChange={(e) => handleChange("graduationYear", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="資格・免許">
        <textarea value={data.certifications} onChange={(e) => handleChange("certifications", e.target.value)} rows={3} placeholder={"普通自動車第一種運転免許（取得年月）\nTOEIC 800点（取得年月）"} className={`${inputClass} resize-none`} />
      </Section>

      <Section title="趣味・特技">
        <textarea value={data.hobbies} onChange={(e) => handleChange("hobbies", e.target.value)} rows={3} placeholder="趣味・特技を入力…" className={`${inputClass} resize-none`} />
      </Section>

      <Section title="自己PR">
        <textarea value={data.selfPr} onChange={(e) => handleChange("selfPr", e.target.value)} rows={6} placeholder="自己PRを入力…" className={`${inputClass} resize-none`} />
        <p className="text-xs text-slate-300 mt-2 text-right">{data.selfPr.length} 文字</p>
      </Section>

      <div className="flex items-center justify-end gap-3 pt-2">
        {saved
          ? <span className="text-xs text-emerald-500">保存済み</span>
          : <span className="text-xs text-slate-400">未保存の変更があります</span>
        }
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
