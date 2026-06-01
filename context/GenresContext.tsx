"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const STORAGE_KEY = "shuukatu_genres";
const DEFAULT_GENRES = ["SIer", "エンタメ"];

interface GenresContextType {
  genres: string[];
  addGenre: (name: string) => void;
  deleteGenre: (name: string) => void;
}

const GenresContext = createContext<GenresContextType | null>(null);

export function GenresProvider({ children }: { children: ReactNode }) {
  const [genres, setGenres] = useState<string[]>(DEFAULT_GENRES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setGenres(JSON.parse(stored));
      } catch {}
    }
    setHydrated(true);
  }, []);

  const save = (next: string[]) => {
    setGenres(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addGenre = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || genres.includes(trimmed)) return;
    save([...genres, trimmed]);
  };

  const deleteGenre = (name: string) => {
    save(genres.filter((g) => g !== name));
  };

  if (!hydrated) return <>{children}</>;

  return (
    <GenresContext.Provider value={{ genres, addGenre, deleteGenre }}>
      {children}
    </GenresContext.Provider>
  );
}

export function useGenres() {
  const ctx = useContext(GenresContext);
  if (!ctx) throw new Error("useGenres must be inside GenresProvider");
  return ctx;
}
