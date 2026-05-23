"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, X, Search, ExternalLink, ChevronRight } from "lucide-react";
import type { IndexedRegulation } from "@/lib/index-types";
import type { Regulation } from "@/lib/schemas/regulation";
import { AREAS, COUNTRIES, NORM_TYPES, STATUSES, type CountryCode, type Area } from "@/lib/taxonomy";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AreaChip } from "@/components/ui/AreaChip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface Props {
  index: IndexedRegulation[];
  regulations: Regulation[];
}

const MAX = 4;

export function CompareClient({ index, regulations }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const ids = (params.get("ids") || "").split(",").filter(Boolean);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const selected = ids
    .map((id) => regulations.find((r) => r.id === id))
    .filter(Boolean) as Regulation[];

  const update = (next: string[]) => {
    const q = next.length ? `?ids=${next.join(",")}` : "";
    router.replace(`/comparar${q}`, { scroll: false });
  };

  const add = (id: string) => {
    if (ids.includes(id)) return;
    if (ids.length >= MAX) return;
    update([...ids, id]);
    setPickerOpen(false);
    setQuery("");
  };
  const remove = (id: string) => update(ids.filter((x) => x !== id));

  const available = index
    .filter((i) => !ids.includes(i.id))
    .filter(
      (i) =>
        !query.trim() ||
        i.shortTitle.toLowerCase().includes(query.toLowerCase()) ||
        i.officialTitle.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 20);

  if (selected.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyCompare />
        <PickerPanel
          available={available}
          query={query}
          setQuery={setQuery}
          add={add}
          alwaysOpen
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-fg-muted">Comparando {selected.length} de {MAX}</span>
        <Button variant="ghost" size="sm" onClick={() => update([])}>
          <X className="h-3.5 w-3.5" /> Limpiar
        </Button>
        {ids.length < MAX && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPickerOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" /> Añadir regulación
          </Button>
        )}
      </div>

      {pickerOpen && (
        <PickerPanel
          available={available}
          query={query}
          setQuery={setQuery}
          add={add}
          onClose={() => setPickerOpen(false)}
        />
      )}

      <div className="overflow-x-auto scrollbar-thin -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-sm border-collapse">
          <colgroup>
            <col className="w-44" />
            {selected.map((r) => (
              <col key={r.id} className="min-w-[260px]" />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-bg text-left p-3 text-xs uppercase tracking-wider text-fg-muted font-medium align-top">
                Atributo
              </th>
              {selected.map((r) => (
                <th
                  key={r.id}
                  className="p-3 text-left align-top border-l border-border"
                >
                  <div className="flex items-start gap-2 mb-1">
                    <CountryFlag code={r.country as CountryCode} link={false} showName={false} className="text-xl" />
                    <button
                      type="button"
                      onClick={() => remove(r.id)}
                      className="ml-auto text-fg-muted hover:text-fg"
                      aria-label="Quitar"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <Link
                    href={`/regulaciones/${r.slug}`}
                    className="font-display text-base font-semibold leading-tight hover:text-accent transition-colors block"
                  >
                    {r.shortTitle}
                  </Link>
                  <p className="text-[0.65rem] text-fg-muted mt-1 font-mono">
                    {r.citation}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="Título oficial" rows={selected} render={(r) => r.officialTitle} />
            <Row
              label="Estado"
              rows={selected}
              render={(r) => <StatusBadge status={r.status as keyof typeof STATUSES} />}
            />
            <Row
              label="Tipo normativo"
              rows={selected}
              render={(r) => NORM_TYPES[r.normType as keyof typeof NORM_TYPES]}
            />
            <Row
              label="Materias"
              rows={selected}
              render={(r) => (
                <div className="flex flex-wrap gap-1">
                  {(r.areas as Area[]).map((a) => (
                    <AreaChip key={a} area={a} link={false} short />
                  ))}
                </div>
              )}
            />
            <Row
              label="Publicación"
              rows={selected}
              render={(r) => formatDate(r.publicationDate)}
            />
            <Row
              label="Entrada en vigor"
              rows={selected}
              render={(r) => formatDate(r.effectiveDate)}
            />
            <Row
              label="Autoridad de aplicación"
              rows={selected}
              render={(r) =>
                r.enforcingAuthority?.length
                  ? r.enforcingAuthority.join(" · ")
                  : "—"
              }
            />
            <Row label="Resumen" rows={selected} render={(r) => r.summary} fullText />
            <Row
              label="Disposiciones clave"
              rows={selected}
              render={(r) =>
                r.keyProvisions?.length ? (
                  <ul className="space-y-1.5 list-disc pl-4 marker:text-accent/60">
                    {r.keyProvisions.map((p, i) => (
                      <li key={i} className="text-sm">{p}</li>
                    ))}
                  </ul>
                ) : (
                  "—"
                )
              }
              fullText
            />
            <Row
              label="Sanciones"
              rows={selected}
              render={(r) => r.penalties || "No especificado"}
              fullText
            />
            <Row
              label="Texto oficial"
              rows={selected}
              render={(r) => (
                <a
                  href={r.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline text-sm"
                >
                  Ver en fuente <ExternalLink className="h-3 w-3" />
                </a>
              )}
            />
            <Row
              label="Ficha completa"
              rows={selected}
              render={(r) => (
                <Link
                  href={`/regulaciones/${r.slug}`}
                  className="inline-flex items-center gap-1 text-accent hover:underline text-sm"
                >
                  Abrir <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({
  label,
  rows,
  render,
  fullText,
}: {
  label: string;
  rows: Regulation[];
  render: (r: Regulation) => React.ReactNode;
  fullText?: boolean;
}) {
  return (
    <tr className="border-t border-border align-top">
      <td className="sticky left-0 z-10 bg-bg p-3 text-xs uppercase tracking-wider text-fg-muted font-medium">
        {label}
      </td>
      {rows.map((r) => (
        <td
          key={r.id}
          className={cn("p-3 border-l border-border text-fg leading-relaxed", fullText ? "text-sm" : "text-sm")}
        >
          {render(r)}
        </td>
      ))}
    </tr>
  );
}

function EmptyCompare() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-10 text-center bg-bg-elevated/40">
      <h2 className="font-display text-2xl font-semibold mb-2">
        Selecciona regulaciones para comparar
      </h2>
      <p className="text-fg-muted max-w-md mx-auto">
        Elige hasta {MAX} fichas y visualízalas lado a lado. Puedes compartir el
        comparador vía URL.
      </p>
    </div>
  );
}

function PickerPanel({
  available,
  query,
  setQuery,
  add,
  onClose,
  alwaysOpen,
}: {
  available: IndexedRegulation[];
  query: string;
  setQuery: (s: string) => void;
  add: (id: string) => void;
  onClose?: () => void;
  alwaysOpen?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-elevated/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Search className="h-4 w-4 text-fg-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar para añadir…"
          autoFocus
          className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0"
        />
        {!alwaysOpen && (
          <button
            type="button"
            onClick={onClose}
            className="text-fg-muted hover:text-fg"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 max-h-72 overflow-y-auto scrollbar-thin">
        {available.length === 0 ? (
          <p className="col-span-full text-sm text-fg-muted py-4 text-center">
            Sin resultados.
          </p>
        ) : (
          available.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => add(r.id)}
              className="flex items-start gap-3 p-2 text-left rounded-md hover:bg-bg transition-colors"
            >
              <span className="text-xl">{r.countryFlag}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{r.shortTitle}</p>
                <p className="text-xs text-fg-muted truncate">
                  {COUNTRIES[r.country].name} · {NORM_TYPES[r.normType]}
                </p>
              </div>
              <Plus className="ml-auto h-4 w-4 text-fg-muted shrink-0" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
