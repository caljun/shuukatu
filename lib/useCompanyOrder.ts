"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const ORDER_REF = doc(db, "settings", "companyOrder");

export function useCompanyOrder() {
  const [order, setOrder] = useState<string[]>([]);

  useEffect(() => {
    getDoc(ORDER_REF).then((snap) => {
      if (snap.exists()) setOrder(snap.data().order ?? []);
    });
  }, []);

  const saveOrder = (newOrder: string[]) => {
    setOrder(newOrder);
    setDoc(ORDER_REF, { order: newOrder });
  };

  return { order, saveOrder };
}
