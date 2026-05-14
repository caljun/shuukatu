"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCompanies } from "@/context/CompaniesContext";
import { useEvents } from "@/context/EventsContext";
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

export default function CompanyDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { getCompany, deleteCompany } = useCompanies();
  const { getEventsForCompany, addEvent, updateEvent, deleteEvent } = useEvents();
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newDate, setNewDate] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const company = getCompany(id);
  const events = getEventsForCompany(id);

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

  const handleAddEvent = async () => {
    if (!newDate || !newTitle.trim()) return;
    setAdding(true);
    await addEvent({ companyId: id, date: newDate, title: newTitle.trim() });
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

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
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

      <div className="grid grid-cols-2 gap-4 mb-4">
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

      {/* Events section */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">予定</p>

        <div className="flex gap-2 mb-4">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
          />
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) handleAddEvent(); }}
            placeholder="予定を入力"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
          />
          <button
            onClick={handleAddEvent}
            disabled={adding || !newDate || !newTitle.trim()}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            追加
          </button>
        </div>

        {events.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">予定なし</p>
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
                      ? "border-slate-100 bg-slate-50 opacity-50"
                      : "border-indigo-100 bg-indigo-50/50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xs font-medium text-indigo-600 bg-white border border-indigo-200 rounded-lg px-2 py-1 shrink-0">
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
  );
}
