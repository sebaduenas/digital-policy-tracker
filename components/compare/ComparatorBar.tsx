"use client";

import Link from "next/link";
import { GitCompare, X } from "lucide-react";
import type { IndexedRegulation } from "@/lib/index-types";
import { useComparator } from "./ComparatorContext";

export function ComparatorBar({ index }: { index: IndexedRegulation[] }) {
  const { ids, max, remove, clear } = useComparator();
  if (ids.length === 0) return null;

  const byId = new Map(index.map((r) => [r.id, r]));
  const selected = ids.map((id) => byId.get(id)).filter(Boolean) as IndexedRegulation[];

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-border bg-bg-elevated/95 py-2 pl-4 pr-2 shadow-card backdrop-blur-md">
        <span className="hidden sm:flex items-center gap-1.5 min-w-0">
          {selected.map((r) => (
            <span
              key={r.id}
              className="inline-flex items-center gap-1 rounded-full bg-bg-sunken px-2 py-0.5 text-xs text-fg-muted max-w-[10rem]"
              title={r.shortTitle}
            >
              <span aria-hidden>{r.countryFlag}</span>
              <span className="truncate">{r.shortTitle}</span>
              <button
                type="button"
                onClick={() => remove(r.id)}
                aria-label={`Quitar ${r.shortTitle} del comparador`}
                className="shrink-0 text-fg-muted/60 hover:text-fg"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </span>
        <button
          type="button"
          onClick={clear}
          className="sm:hidden text-fg-muted hover:text-fg"
          aria-label="Vaciar comparador"
        >
          <X className="h-4 w-4" />
        </button>
        <Link
          href={`/comparar?ids=${ids.join(",")}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-fg hover:opacity-90 transition-opacity"
        >
          <GitCompare className="h-4 w-4" />
          Comparar ({ids.length}/{max})
        </Link>
      </div>
    </div>
  );
}
