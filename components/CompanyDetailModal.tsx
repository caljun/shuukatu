"use client";

import { useState, useEffect } from "react";
import { useCompanies } from "@/context/CompaniesContext";
import { useEvents } from "@/context/EventsContext";
import { CompanyColor } from "@/lib/types";
import EditCompanyModal from "@/components/EditCompanyModal";

function EditEventRow({
  ev,
  onSave,
  onCancel,
  onDelete,
}: {
  ev: { id: string; date: string; title: string };
  onSave: (id: string, date: string, title: string) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}) {
  const [date, setDate] = useState(ev.date);
  const [title, setTitle] = useState(ev.title);

  return (
    <li className="flex flex-col gap-2 px-3 py-3 bg-indigo-50 border border-indigo-200 rounded-xl">
      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onDelete(ev.id)}
          className="text-xs text-red-400 hover:text-red-600 px-2 py-1 transition-colors"
        >
          削除
        </button>
        <button
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1 border border-slate-200 rounded-lg bg-white transition-colors"
        >
          キャンセル
        </button>
        <button
          onClick={() => onSave(ev.id, date, title)}
          className="text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg transition-colors"
        >
          保存
        </button>
      </div>
    </li>
  );
}

const COLOR_OPTIONS: { value: CompanyColor; label: string; swatch: string; ring: string }[] = [
  { value: "white",  label: "白", swatch: "bg-white border-2 border-slate-300",   ring: "ring-slate-400"  },
  { value: "blue",   label: "青", swatch: "bg-blue-200 border-2 border-blue-300", ring: "ring-blue-500"   },
  { value: "red",    label: "赤", swatch: "bg-red-200 border-2 border-red-300",   ring: "ring-red-500"    },
  { value: "purple", label: "紫", swatch: "bg-purple-200 border-2 border-purple-300", ring: "ring-purple-500" },
  { value: "black",  label: "黒", swatch: "bg-slate-800 border-2 border-slate-600",   ring: "ring-slate-500"  },
];

interface Props {
  companyId: string;
  onClose: () => void;
}

export default function CompanyDetailModal({ companyId, onClose }: Props) {
  const { getCompany, deleteCompany, setCompanyColor } = useCompanies();
  const { getEventsForCompany, addEvent, updateEvent, deleteEvent } = useEvents();
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !editOpen) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, editOpen]);

  const company = getCompany(companyId);
  const events = getEventsForCompany(companyId);

  if (!company) return null;

  const handleDelete = () => {
    if (confirm(`「${company.name}」を削除しますか？`)) {
      deleteCompany(companyId);
      onClose();
    }
  };

  const handleAddEvent = async () => {
    if (!newDate || !newTitle.trim()) return;
    setAdding(true);
    await addEvent({ companyId, date: newDate, title: newTitle.trim() });
    setNewDate("");
    setNewTitle("");
    setAdding(false);
  };

  const handleSaveEdit = async (evId: string, date: string, title: string) => {
    if (!date || !title.trim()) return;
    await updateEvent(evId, { date, title: title.trim() });
    setEditingId(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${d.getMonth() + 1}月${d.getDate()}日(${days[d.getDay()]})`;
  };

  const isPast = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr + "T00:00:00") < today;
  };

  const currentColor = company.color ?? "white";

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      {editOpen && (
        <EditCompanyModal company={company} onClose={() => setEditOpen(false)} />
      )}

      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 truncate">{company.name}</h2>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              編集
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              削除
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 flex flex-col gap-4">
          {/* Color Picker */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider shrink-0">カードの色</span>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCompanyColor(companyId, opt.value)}
                  title={opt.label}
                  className={`w-7 h-7 rounded-full transition-all ${opt.swatch} ${
                    currentColor === opt.value
                      ? `ring-2 ring-offset-2 ${opt.ring} scale-110`
                      : "hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">ログインID</p>
              <p className="text-slate-800 font-medium text-sm break-all">
                {company.loginId || <span className="text-slate-400 font-normal">未設定</span>}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">マイページ</p>
              {company.mypageUrl ? (
                <a
                  href={company.mypageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-indigo-600 font-medium text-sm hover:text-indigo-800 transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          </div>

          {(company.memo) && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">メモ</p>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">{company.memo}</p>
            </div>
          )}

          {/* Events */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">予定</p>

            <div className="flex flex-col gap-2 mb-3">
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) handleAddEvent(); }}
                  placeholder="予定を入力"
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={handleAddEvent}
                disabled={adding || !newDate || !newTitle.trim()}
                className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                追加
              </button>
            </div>

            {events.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-2">予定なし</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {events.map((ev) =>
                  editingId === ev.id ? (
                    <EditEventRow
                      key={ev.id}
                      ev={ev}
                      onSave={handleSaveEdit}
                      onCancel={() => setEditingId(null)}
                      onDelete={async (evId) => { await deleteEvent(evId); setEditingId(null); }}
                    />
                  ) : (
                    <li
                      key={ev.id}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${
                        isPast(ev.date)
                          ? "border-slate-100 bg-white opacity-50"
                          : "border-indigo-100 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-1 shrink-0">
                          {formatDate(ev.date)}
                        </span>
                        <span className="text-sm text-slate-700 truncate">{ev.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 ml-2 shrink-0">
                        <button
                          onClick={() => setEditingId(ev.id)}
                          className="text-slate-300 hover:text-indigo-400 transition-colors"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteEvent(ev.id)}
                          className="text-slate-300 hover:text-red-400 transition-colors"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
