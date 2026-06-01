"use client";

import * as React from "react";
import Link from "next/link";
import { GitCompare, Check, Plus, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryCode } from "@/lib/taxonomy";
import { Flag } from "@/components/ui/Flag";
import { useComparator } from "./ComparatorContext";

export interface CompareItem {
  id: string;
  shortTitle: string;
  country: CountryCode;
  countryName: string;
}

export function AddToCompareButton({
  self,
  sameArea,
  allItems,
}: {
  self: CompareItem;
  sameArea: CompareItem[];
  allItems: CompareItem[];
}) {
  const { ids, max, isFull, has, toggle, add } = useComparator();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inCart = has(self.id);

  const openSelector = () => {
    add(self.id); // ensure the current ficha is part of the comparison
    setOpen(true);
  };

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const visible = React.useMemo(() => {
    if (!searching) return sameArea;
    return allItems
      .filter(
        (r) =>
          r.shortTitle.toLowerCase().includes(q) ||
          r.countryName.toLowerCase().includes(q),
      )
      .slice(0, 50);
  }, [searching, q, sameArea, allItems]);

  return (
    <div className="relative inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => toggle(self.id)}
        aria-pressed={inCart}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors",
          inCart
            ? "border-accent/50 bg-accent/10 text-fg"
            : "border-border bg-bg-elevated text-fg-muted hover:text-fg hover:border-accent/50",
        )}
      >
        {inCart ? <Check className="h-4 w-4 text-accent" /> : <Plus className="h-4 w-4" />}
        {inCart ? "En el comparador" : "Agregar al comparador"}
      </button>

      {allItems.length > 0 && (
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openSelector())}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm text-fg-muted hover:text-fg hover:border-accent/50 transition-colors"
          aria-expanded={open}
        >
          <GitCompare className="h-4 w-4" />
          Comparar con…
        </button>
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-full z-40 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-bg-elevated p-3 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-fg-muted uppercase tracking-wider">
                {searching
                  ? `Resultados · máx ${max}`
                  : `Misma área · máx ${max}`}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-fg-muted hover:text-fg"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título o país…"
                className="w-full rounded-md border border-border bg-bg-sunken py-1.5 pl-7 pr-7 text-sm text-fg placeholder:text-fg-muted/70 focus:outline-none focus:border-accent/50"
                aria-label="Buscar normas para comparar"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <ul className="max-h-72 space-y-0.5 overflow-y-auto scrollbar-thin">
              {visible.length === 0 ? (
                <li className="px-2 py-3 text-center text-xs text-fg-muted">
                  {searching
                    ? "Sin coincidencias."
                    : "No hay sugerencias para esta área."}
                </li>
              ) : (
                visible.map((r) => {
                  const selected = has(r.id);
                  const blocked = !selected && isFull;
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        disabled={blocked}
                        onClick={() => toggle(r.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                          selected
                            ? "bg-accent/10 text-fg"
                            : blocked
                              ? "text-fg-muted/40 cursor-not-allowed"
                              : "text-fg-muted hover:bg-bg-sunken hover:text-fg",
                        )}
                      >
                        <Flag code={r.country} size={14} />
                        <span className="min-w-0 flex-1 truncate">{r.shortTitle}</span>
                        {selected ? (
                          <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                        ) : (
                          <Plus className="h-3.5 w-3.5 shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
            <Link
              href={`/comparar?ids=${ids.join(",")}`}
              className="mt-2 flex items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-fg hover:opacity-90 transition-opacity"
            >
              <GitCompare className="h-4 w-4" />
              Ver comparación ({ids.length})
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
