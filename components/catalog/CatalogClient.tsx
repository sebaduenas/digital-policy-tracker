"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import {
  AREAS,
  COUNTRIES,
  NORM_TYPES,
  STATUSES,
  type Area,
  type CountryCode,
  type NormType,
  type Status,
} from "@/lib/taxonomy";
import {
  EMPTY_FILTERS,
  activeFilterCount,
  applyFilters,
  serializeFilters,
  type FilterState,
} from "@/lib/filters";
import type { IndexedRegulation } from "@/lib/index-types";
import { FilterPopover } from "@/components/filters/FilterPopover";
import { Flag } from "@/components/ui/Flag";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  RegulationCard,
  RegulationRow,
} from "@/components/cards/RegulationCard";
import {
  LayoutGrid,
  List,
  Search,
  NotebookPen,
  X,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toCSV } from "@/lib/csv";

type View = "list" | "grid";
type Sort = "year-desc" | "year-asc" | "title-asc";

export function CatalogClient({
  data,
  initialFilters,
}: {
  data: IndexedRegulation[];
  initialFilters: FilterState;
}) {
  const router = useRouter();
  const [filters, setFilters] = React.useState<FilterState>(initialFilters);
  const [view, setView] = React.useState<View>("list");
  const [sort, setSort] = React.useState<Sort>("year-desc");

  const fuse = React.useMemo(
    () =>
      new Fuse(data, {
        keys: [
          { name: "shortTitle", weight: 0.4 },
          { name: "officialTitle", weight: 0.25 },
          { name: "aliases", weight: 0.1 },
          { name: "tags", weight: 0.15 },
          { name: "summary", weight: 0.05 },
          { name: "enforcingAuthority", weight: 0.05 },
        ],
        threshold: 0.36,
        ignoreLocation: true,
      }),
    [data],
  );

  // Sync filters → URL, but skip the first run: on mount the filters already
  // match the server-provided searchParams, so replacing would trigger a
  // redundant server refetch.
  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const qs = serializeFilters(filters);
    const next = qs ? `?${qs}` : "";
    router.replace(`/regulaciones${next}`, { scroll: false });
  }, [filters, router]);

  const filtered = React.useMemo(() => {
    let result = data;
    if (filters.q.trim()) {
      result = fuse.search(filters.q).map((r) => r.item);
    }
    result = applyFilters(result, filters);
    result = [...result].sort((a, b) => {
      if (sort === "year-desc") return (b.year ?? 0) - (a.year ?? 0);
      if (sort === "year-asc") return (a.year ?? 0) - (b.year ?? 0);
      return a.shortTitle.localeCompare(b.shortTitle);
    });
    return result;
  }, [data, filters, fuse, sort]);

  const count = activeFilterCount(filters);

  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setFilters(EMPTY_FILTERS);

  const exportCsv = () => {
    const csv = toCSV(filtered);
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `policy-tracker-latam-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-16 z-20 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-bg/85 backdrop-blur-md border-b border-border">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
            <Input
              type="search"
              value={filters.q}
              onChange={(e) => update("q", e.target.value)}
              placeholder="Buscar por título, alias, autoridad, tag…"
              className="pl-9 h-10"
              aria-label="Buscar regulaciones"
            />
            {filters.q && (
              <button
                type="button"
                onClick={() => update("q", "")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-bg-elevated"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-3.5 w-3.5 text-fg-muted" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FilterPopover
              label="País"
              options={Object.entries(COUNTRIES).map(([code, c]) => ({
                value: code,
                label: c.name,
                icon: <Flag code={code as CountryCode} size={14} />,
              }))}
              selected={filters.countries}
              onChange={(v) => update("countries", v as CountryCode[])}
            />
            <FilterPopover
              label="Área"
              options={Object.entries(AREAS).map(([slug, a]) => ({
                value: slug,
                label: a.name,
              }))}
              selected={filters.areas}
              onChange={(v) => update("areas", v as Area[])}
            />
            <FilterPopover
              label="Estado"
              options={Object.entries(STATUSES).map(([k, s]) => ({
                value: k,
                label: s.label,
              }))}
              selected={filters.statuses}
              onChange={(v) => update("statuses", v as Status[])}
            />
            <FilterPopover
              label="Tipo normativo"
              options={Object.entries(NORM_TYPES).map(([k, v]) => ({
                value: k,
                label: v,
              }))}
              selected={filters.types}
              onChange={(v) => update("types", v as NormType[])}
            />

            <button
              type="button"
              onClick={() =>
                update("hasAnalysis", filters.hasAnalysis ? undefined : true)
              }
              className={cn(
                "inline-flex items-center gap-1.5 h-9 px-3 rounded-md border text-sm transition-colors",
                filters.hasAnalysis
                  ? "border-accent/50 bg-accent/10 text-fg"
                  : "border-border bg-bg-elevated text-fg-muted hover:text-fg",
              )}
            >
              <NotebookPen className="h-3.5 w-3.5" />
              Comentadas
            </button>

            {count > 0 && (
              <Button variant="ghost" size="sm" onClick={reset}>
                <X className="h-3.5 w-3.5" /> Limpiar ({count})
              </Button>
            )}

            <div className="ml-auto flex items-center gap-2">
              <SortMenu sort={sort} setSort={setSort} />
              <div className="flex rounded-md border border-border overflow-hidden">
                <button
                  type="button"
                  aria-label="Vista en lista"
                  onClick={() => setView("list")}
                  className={cn(
                    "h-9 w-9 inline-flex items-center justify-center transition-colors",
                    view === "list"
                      ? "bg-bg-elevated text-fg"
                      : "text-fg-muted hover:text-fg",
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Vista en cuadrícula"
                  onClick={() => setView("grid")}
                  className={cn(
                    "h-9 w-9 inline-flex items-center justify-center transition-colors",
                    view === "grid"
                      ? "bg-bg-elevated text-fg"
                      : "text-fg-muted hover:text-fg",
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-fg-muted">
        <span>
          <strong className="text-fg font-medium">{filtered.length}</strong>{" "}
          {filtered.length === 1 ? "regulación" : "regulaciones"}
          {count > 0 ? ` (filtrado de ${data.length})` : ""}
        </span>
        {filtered.length > 0 && (
          <Button variant="ghost" size="sm" onClick={exportCsv}>
            <Download className="h-3.5 w-3.5" /> Exportar CSV
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState onReset={reset} />
      ) : view === "list" ? (
        <div className="border-t border-border">
          {filtered.map((r) => (
            <RegulationRow key={r.id} r={r} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <RegulationCard key={r.id} r={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-12 text-center">
      <p className="font-display text-xl font-semibold mb-1">Sin resultados</p>
      <p className="text-sm text-fg-muted mb-4">
        Tus filtros no devolvieron fichas. Prueba con criterios más amplios.
      </p>
      <Button variant="soft" onClick={onReset}>
        <X className="h-3.5 w-3.5" /> Limpiar filtros
      </Button>
    </div>
  );
}

function SortMenu({
  sort,
  setSort,
}: {
  sort: Sort;
  setSort: (s: Sort) => void;
}) {
  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value as Sort)}
      className="h-9 rounded-md border border-border bg-bg-elevated px-2 text-sm text-fg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Ordenar"
    >
      <option value="year-desc">Año (recientes)</option>
      <option value="year-asc">Año (antiguas)</option>
      <option value="title-asc">Título A→Z</option>
    </select>
  );
}
