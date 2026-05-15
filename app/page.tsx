"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCompanies } from "@/context/CompaniesContext";
import { useCompanyOrder } from "@/lib/useCompanyOrder";
import AddCompanyModal from "@/components/AddCompanyModal";
import { Company, Genre } from "@/lib/types";

const GENRE_ORDER: Genre[] = ["SIer", "エンタメ", ""];
const GENRE_LABEL: Record<Genre, string> = {
  SIer: "SIer",
  エンタメ: "エンタメ",
  "": "未分類",
};

function SortableCard({ company, onClick }: { company: Company; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: company.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center bg-white rounded-xl border border-slate-200/60 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100/50 transition-all duration-200">
        {/* ドラッグハンドル */}
        <div
          {...attributes}
          {...listeners}
          className="px-3 py-4 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing transition-colors shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2">
            <circle cx="9" cy="5" r="1" fill="currentColor" />
            <circle cx="9" cy="12" r="1" fill="currentColor" />
            <circle cx="9" cy="19" r="1" fill="currentColor" />
            <circle cx="15" cy="5" r="1" fill="currentColor" />
            <circle cx="15" cy="12" r="1" fill="currentColor" />
            <circle cx="15" cy="19" r="1" fill="currentColor" />
          </svg>
        </div>

        {/* 企業名 */}
        <button
          onClick={onClick}
          className="group flex-1 flex items-center gap-2 py-4 text-left min-w-0"
        >
          <span className="font-semibold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors truncate">
            {company.name}
          </span>
          {company.unread > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
              {company.unread}
            </span>
          )}
        </button>

        {/* マイページボタン */}
        {company.mypageUrl ? (
          <a
            href={company.mypageUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 mr-3 px-3 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors shrink-0"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            マイページ
          </a>
        ) : (
          <div className="mr-3 w-[84px]" />
        )}
      </div>
    </div>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { companies } = useCompanies();
  const { order, saveOrder } = useCompanyOrder();
  const [modalOpen, setModalOpen] = useState(false);
  const [sortedIds, setSortedIds] = useState<string[]>([]);

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setModalOpen(true);
      router.replace("/");
    }
  }, [searchParams, router]);

  // orderに従って並べ、orderにない新規企業は末尾に追加
  useEffect(() => {
    const knownIds = new Set(order);
    const newIds = companies.map((c) => c.id).filter((id) => !knownIds.has(id));
    setSortedIds([...order.filter((id) => companies.some((c) => c.id === id)), ...newIds]);
  }, [order, companies]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent, genreIds: string[]) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = genreIds.indexOf(active.id as string);
    const newIndex = genreIds.indexOf(over.id as string);
    const newGenreOrder = arrayMove(genreIds, oldIndex, newIndex);

    const nextSorted = [
      ...sortedIds.filter((id) => !genreIds.includes(id)),
      ...newGenreOrder,
    ];
    setSortedIds(nextSorted);
    saveOrder(nextSorted);
  };

  const grouped = GENRE_ORDER.map((genre) => {
    const items = sortedIds
      .map((id) => companies.find((c) => c.id === id))
      .filter((c): c is Company => !!c && (c.genre ?? "") === genre);
    return { genre, label: GENRE_LABEL[genre], items };
  }).filter((g) => g.items.length > 0);

  return (
    <div className="p-4 md:p-8">
      {modalOpen && <AddCompanyModal onClose={() => setModalOpen(false)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">企業一覧</h1>
          <p className="text-sm text-slate-500 mt-0.5">{companies.length} 社を管理中</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          企業を追加
        </button>
      </div>

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-40">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
          </svg>
          <p className="text-sm">企業がありません</p>
          <p className="text-xs mt-1">「企業を追加」から登録してください</p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          {grouped.map(({ genre, label, items }) => {
            const genreIds = items.map((c) => c.id);
            return (
              <section key={genre}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</h2>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{items.length}</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(e) => handleDragEnd(e, genreIds)}
                >
                  <SortableContext items={genreIds} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2">
                      {items.map((company) => (
                        <SortableCard
                          key={company.id}
                          company={company}
                          onClick={() => router.push(`/company/${company.id}`)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
