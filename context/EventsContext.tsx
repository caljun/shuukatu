"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { CompanyEvent } from "@/lib/types";

interface EventsContextType {
  events: CompanyEvent[];
  addEvent: (data: Omit<CompanyEvent, "id">) => Promise<void>;
  updateEvent: (id: string, data: Partial<Omit<CompanyEvent, "id">>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventsForCompany: (companyId: string) => CompanyEvent[];
}

const EventsContext = createContext<EventsContextType | null>(null);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CompanyEvent[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snap) => {
      setEvents(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as CompanyEvent))
      );
    });
    return unsub;
  }, []);

  const addEvent = async (data: Omit<CompanyEvent, "id">) => {
    await addDoc(collection(db, "events"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  };

  const updateEvent = async (id: string, data: Partial<Omit<CompanyEvent, "id">>) => {
    await updateDoc(doc(db, "events", id), data);
  };

  const deleteEvent = async (id: string) => {
    await deleteDoc(doc(db, "events", id));
  };

  const getEventsForCompany = (companyId: string) =>
    events
      .filter((e) => e.companyId === companyId)
      .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, getEventsForCompany }}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}
