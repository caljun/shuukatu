"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCompanies } from "@/context/CompaniesContext";
import CompanyDetailModal from "@/components/CompanyDetailModal";
import { useFavoriteCompanyOrder } from "@/lib/useCompanyOrder";
import type { Company } from "@/lib/types";

function FavoriteCard({ company, onClick }: { company: Company; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: company.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 10 : undefined,
      }}
      className="flex bg-white rounded-2xl border border-slate-200/60 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/50 transition-shadow"
    >
      <button
        {...attributes}
        {...listeners}
        onClick={(event) => event.stopPropagation()}
        aria-label={`${company.name}を並び替える`}
        className="px-3 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0 touch-none"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" />
        </svg>
      </button>
      <button onClick={onClick} className="group flex-1 min-w-0 p-5 pl-1 text-left">
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
    </div>
  );
}

export default function FavoritesPage() {
  const { companies, loading } = useCompanies();
  const [detailId, setDetailId] = useState<string | null>(null);
  const { order, saveOrder } = useFavoriteCompanyOrder();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const favorites = useMemo(() => {
    const favoriteCompanies = companies.filter((company) => company.favorite);
    const byId = new Map(favoriteCompanies.map((company) => [company.id, company]));
    const ordered = order.map((id) => byId.get(id)).filter((company): company is Company => !!company);
    const knownIds = new Set(order);
    return [...ordered, ...favoriteCompanies.filter((company) => !knownIds.has(company.id))];
  }, [companies, order]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = favorites.map((company) => company.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    saveOrder(arrayMove(ids, oldIndex, newIndex));
  };

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
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={favorites.map((company) => company.id)} strategy={rectSortingStrategy}>
            <div className="grid gap-3 sm:grid-cols-2">
              {favorites.map((company) => (
                <FavoriteCard key={company.id} company={company} onClick={() => setDetailId(company.id)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
