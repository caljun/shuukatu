"use client";

import { useState } from "react";
import { useEvents } from "@/context/EventsContext";
import { useCompanies } from "@/context/CompaniesContext";

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

function EditEventRow({
  ev,
  companyName,
  onSave,
  onCancel,
  onDelete,
}: {
  ev: { id: string; date: string; title: string; companyId: string };
  companyName: string;
  onSave: (id: string, date: string, title: string) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}) {
  const [date, setDate] = useState(ev.date);
  const [title, setTitle] = useState(ev.title);

  return (
    <div className="flex flex-col gap-2 px-3 py-3 bg-indigo-50 border border-indigo-200 rounded-xl">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-indigo-500 shrink-0">{companyName}</span>
      </div>
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
          className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1 border border-slate-200 rounded-lg transition-colors"
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
    </div>
  );
}

export default function CalendarPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { companies } = useCompanies();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add form for selected day
  const [newTitle, setNewTitle] = useState("");
  const [newCompanyId, setNewCompanyId] = useState("");
  const [adding, setAdding] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthEvents = events.filter((e) => e.date.startsWith(monthStr));

  const eventsByDate: Record<string, typeof events> = {};
  for (const ev of monthEvents) {
    if (!eventsByDate[ev.date]) eventsByDate[ev.date] = [];
    eventsByDate[ev.date].push(ev);
  }

  const getCompanyName = (companyId: string) =>
    companies.find((c) => c.id === companyId)?.name ?? "不明";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return `${d.getMonth() + 1}月${d.getDate()}日(${DAY_NAMES[d.getDay()]})`;
  };

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handleDayClick = (dateStr: string) => {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
    setEditingId(null);
    setNewTitle("");
    setNewCompanyId("");
  };

  const handleAddEvent = async () => {
    if (!selectedDate || !newTitle.trim() || !newCompanyId) return;
    setAdding(true);
    await addEvent({ companyId: newCompanyId, date: selectedDate, title: newTitle.trim() });
    setNewTitle("");
    setNewCompanyId("");
    setAdding(false);
  };

  const handleSaveEdit = async (id: string, date: string, title: string) => {
    if (!date || !title.trim()) return;
    await updateEvent(id, { date, title: title.trim() });
    setEditingId(null);
  };

  const displayEvents = selectedDate
    ? (eventsByDate[selectedDate] ?? [])
    : [...monthEvents].sort((a, b) => a.date.localeCompare(b.date));

  const groupedDisplay = selectedDate
    ? { [selectedDate]: displayEvents }
    : displayEvents.reduce((acc, ev) => {
        if (!acc[ev.date]) acc[ev.date] = [];
        acc[ev.date].push(ev);
        return acc;
      }, {} as Record<string, typeof events>);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">カレンダー</h1>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDate(null); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="text-base font-bold text-slate-800">{year}年 {month + 1}月</span>
          <button
            onClick={() => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDate(null); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {DAY_NAMES.map((d, i) => (
            <div key={d} className={`text-center text-xs font-medium py-1 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-slate-400"}`}>
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = eventsByDate[dateStr] ?? [];
            const todayFlag = isToday(day);
            const selected = selectedDate === dateStr;
            const colIndex = (firstDayOfWeek + day - 1) % 7;

            return (
              <button
                key={day}
                onClick={() => handleDayClick(dateStr)}
                className={`flex flex-col items-center py-1.5 gap-1 rounded-xl transition-colors ${selected ? "bg-indigo-50" : "hover:bg-slate-50"}`}
              >
                <span className={`text-sm w-7 h-7 flex items-center justify-center rounded-full font-medium transition-colors ${
                  todayFlag
                    ? "bg-indigo-600 text-white"
                    : selected
                    ? "bg-indigo-100 text-indigo-700"
                    : colIndex === 0
                    ? "text-red-400"
                    : colIndex === 6
                    ? "text-blue-400"
                    : "text-slate-700"
                }`}>
                  {day}
                </span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((_, idx) => (
                      <div key={idx} className={`w-1.5 h-1.5 rounded-full ${selected ? "bg-indigo-500" : "bg-indigo-400"}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events panel */}
      <div className="bg-white rounded-2xl border border-slate-200/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {selectedDate ? formatDate(selectedDate) : `${month + 1}月の予定`}
          </p>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              全て表示
            </button>
          )}
        </div>

        {/* Add form (only when a day is selected) */}
        {selectedDate && (
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex gap-2">
              <select
                value={newCompanyId}
                onChange={(e) => setNewCompanyId(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              >
                <option value="">企業を選択</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) handleAddEvent(); }}
                placeholder="予定を入力"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>
            <button
              onClick={handleAddEvent}
              disabled={adding || !newTitle.trim() || !newCompanyId}
              className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              追加
            </button>
          </div>
        )}

        {Object.keys(groupedDisplay).length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">
            {selectedDate ? "この日の予定はありません" : "予定なし"}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.keys(groupedDisplay).sort().map((dateStr) => (
              <div key={dateStr}>
                {!selectedDate && (
                  <p className="text-xs font-semibold text-slate-500 mb-2">{formatDate(dateStr)}</p>
                )}
                <div className="flex flex-col gap-1.5">
                  {groupedDisplay[dateStr].map((ev) =>
                    editingId === ev.id ? (
                      <EditEventRow
                        key={ev.id}
                        ev={ev}
                        companyName={getCompanyName(ev.companyId)}
                        onSave={handleSaveEdit}
                        onCancel={() => setEditingId(null)}
                        onDelete={async (id) => { await deleteEvent(id); setEditingId(null); }}
                      />
                    ) : (
                      <div
                        key={ev.id}
                        className="flex items-center gap-2.5 px-3 py-2.5 bg-indigo-50/60 border border-indigo-100 rounded-xl"
                      >
                        <div className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                        <span className="text-xs font-medium text-indigo-600 shrink-0">
                          {getCompanyName(ev.companyId)}
                        </span>
                        <span className="text-sm text-slate-700 flex-1">{ev.title}</span>
                        <button
                          onClick={() => setEditingId(ev.id)}
                          className="text-slate-300 hover:text-indigo-400 transition-colors shrink-0"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
