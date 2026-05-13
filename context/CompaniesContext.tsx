"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Company } from "@/lib/types";

interface CompaniesContextType {
  companies: Company[];
  loading: boolean;
  addCompany: (data: Omit<Company, "id" | "unread">) => Promise<void>;
  updateCompany: (id: string, data: Omit<Company, "id" | "unread">) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  getCompany: (id: string) => Company | undefined;
}

const CompaniesContext = createContext<CompaniesContextType | null>(null);

export function CompaniesProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "companies"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setCompanies(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Company, "id">) }))
      );
      setLoading(false);
    });
    return unsub;
  }, []);

  const addCompany = async (data: Omit<Company, "id" | "unread">) => {
    await addDoc(collection(db, "companies"), {
      ...data,
      unread: 0,
      createdAt: serverTimestamp(),
    });
  };

  const updateCompany = async (id: string, data: Omit<Company, "id" | "unread">) => {
    await updateDoc(doc(db, "companies", id), { ...data });
  };

  const deleteCompany = async (id: string) => {
    await deleteDoc(doc(db, "companies", id));
  };

  const getCompany = (id: string) => companies.find((c) => c.id === id);

  return (
    <CompaniesContext.Provider
      value={{ companies, loading, addCompany, updateCompany, deleteCompany, getCompany }}
    >
      {children}
    </CompaniesContext.Provider>
  );
}

export function useCompanies() {
  const ctx = useContext(CompaniesContext);
  if (!ctx) throw new Error("useCompanies must be inside CompaniesProvider");
  return ctx;
}
