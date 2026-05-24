"use client";

import * as React from "react";
import Link from "next/link";
import { GitCompare, Check, Plus, X } from "lucide-react";
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
}: {
  self: CompareItem;
  sameArea: CompareItem[];
}) {
  const { ids, max, isFull, has, toggle, add } = useComparator();
  const [open, setOpen] = React.useState(false);
  const inCart = has(self.id);

  const openSelector = () => {
    add(self.id); // ensure the current ficha is part of the comparison
    setOpen(true);
  };

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

      {sameArea.length > 0 && (
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
                Misma área · máx {max}
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
            <ul className="max-h-72 space-y-0.5 overflow-y-auto scrollbar-thin">
              {sameArea.map((r) => {
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
              })}
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
