"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const ORDER_REF = doc(db, "settings", "companyOrder");
const FAVORITE_ORDER_REF = doc(db, "settings", "favoriteCompanyOrder");

function useFirestoreOrder(ref: typeof ORDER_REF) {
  const [order, setOrder] = useState<string[]>([]);

  useEffect(() => {
    getDoc(ref).then((snap) => {
      if (snap.exists()) setOrder(snap.data().order ?? []);
    });
  }, [ref]);

  const saveOrder = (newOrder: string[]) => {
    setOrder(newOrder);
    setDoc(ref, { order: newOrder });
  };

  return { order, saveOrder };
}

export function useCompanyOrder() {
  return useFirestoreOrder(ORDER_REF);
}

export function useFavoriteCompanyOrder() {
  return useFirestoreOrder(FAVORITE_ORDER_REF);
}
