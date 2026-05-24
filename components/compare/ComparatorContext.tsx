"use client";

import * as React from "react";

const STORAGE_KEY = "dpt-compare";
const MAX = 4;

interface ComparatorApi {
  ids: string[];
  max: number;
  isFull: boolean;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
}

const ComparatorContext = React.createContext<ComparatorApi | null>(null);

export function ComparatorProvider({ children }: { children: React.ReactNode }) {
  // Start empty so server and first client render match; hydrate from
  // localStorage after mount to avoid a hydration mismatch.
  const [ids, setIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setIds(parsed.filter((x) => typeof x === "string").slice(0, MAX));
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore quota/availability errors */
    }
  }, [ids]);

  const api = React.useMemo<ComparatorApi>(
    () => ({
      ids,
      max: MAX,
      isFull: ids.length >= MAX,
      has: (id) => ids.includes(id),
      add: (id) =>
        setIds((prev) =>
          prev.includes(id) || prev.length >= MAX ? prev : [...prev, id],
        ),
      remove: (id) => setIds((prev) => prev.filter((x) => x !== id)),
      toggle: (id) =>
        setIds((prev) =>
          prev.includes(id)
            ? prev.filter((x) => x !== id)
            : prev.length >= MAX
              ? prev
              : [...prev, id],
        ),
      clear: () => setIds([]),
    }),
    [ids],
  );

  return (
    <ComparatorContext.Provider value={api}>
      {children}
    </ComparatorContext.Provider>
  );
}

export function useComparator(): ComparatorApi {
  const ctx = React.useContext(ComparatorContext);
  if (!ctx) {
    throw new Error("useComparator must be used within a ComparatorProvider");
  }
  return ctx;
}
