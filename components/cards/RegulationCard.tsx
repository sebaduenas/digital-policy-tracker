import Link from "next/link";
import type { IndexedRegulation } from "@/lib/index-types";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { AREAS, NORM_TYPES, STATUSES } from "@/lib/taxonomy";
import { ChevronRight, ExternalLink, NotebookPen } from "lucide-react";

function areasLabel(r: IndexedRegulation, max = 3) {
  const names = r.areas.slice(0, max).map((a) => AREAS[a].name);
  const extra = r.areas.length - max;
  return extra > 0 ? `${names.join(", ")} (+${extra})` : names.join(", ");
}

export function RegulationCard({ r }: { r: IndexedRegulation }) {
  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-bg-elevated p-5 hover:border-accent/60 hover:shadow-[0_2px_24px_-12px_rgb(var(--accent)/0.4)] transition-all">
      <div className="flex items-center gap-2 mb-2">
        <CountryFlag code={r.country} link={false} showName={false} className="text-lg" />
        <span className="text-[0.65rem] text-fg-muted uppercase tracking-[0.15em] font-medium">
          {r.countryName} · {NORM_TYPES[r.normType]}
        </span>
        {r.hasCriticalAnalysis && (
          <span
            className="ml-auto inline-flex items-center gap-1 text-[0.6rem] uppercase tracking-wider text-accent font-medium"
            title="Tiene comentario editorial"
          >
            <NotebookPen className="h-3 w-3" />
            anotada
          </span>
        )}
      </div>
      <h3 className="font-display text-lg font-medium leading-snug text-balance mb-1 group-hover:text-accent transition-colors">
        <Link
          href={`/regulaciones/${r.slug}`}
          className="before:absolute before:inset-0 before:rounded-xl"
        >
          {r.shortTitle}
        </Link>
      </h3>
      <p className="text-xs text-fg-muted line-clamp-1 mb-3">{r.officialTitle}</p>
      <p className="text-sm text-fg-muted line-clamp-3 mb-4 flex-1">{r.summary}</p>
      <dl className="mt-auto space-y-1 text-xs text-fg-muted">
        <div className="flex gap-1.5">
          <dt className="font-semibold text-fg shrink-0">Estado:</dt>
          <dd className="truncate">{STATUSES[r.status].label}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="font-semibold text-fg shrink-0">Materia:</dt>
          <dd className="truncate">{areasLabel(r, 2)}</dd>
        </div>
      </dl>
      <div className="mt-3 flex items-center justify-end text-xs text-fg-muted tabular-nums group-hover:text-accent transition-colors">
        {r.year ?? "—"}
        <ChevronRight className="ml-1 h-3.5 w-3.5" />
      </div>
      {r.officialUrl && (
        <a
          href={r.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[0.65rem] text-fg-muted hover:text-accent hover:bg-bg transition-colors"
          aria-label="Abrir fuente oficial en nueva pestaña"
          title="Fuente oficial"
        >
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </article>
  );
}

export function RegulationRow({ r }: { r: IndexedRegulation }) {
  return (
    <div className="group relative grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center border-b border-border py-3 px-2 hover:bg-bg-elevated/60 transition-colors -mx-2 rounded-md">
      <span className="text-xl" aria-hidden>
        {r.countryFlag}
      </span>
      <div className="min-w-0">
        <p className="font-medium text-fg group-hover:text-accent truncate transition-colors">
          <Link
            href={`/regulaciones/${r.slug}`}
            className="before:absolute before:inset-0"
          >
            {r.shortTitle}
          </Link>
          {r.hasCriticalAnalysis && (
            <span
              className="inline-flex items-center gap-1 ml-2 align-middle text-[0.55rem] uppercase tracking-wider text-accent font-medium"
              title="Tiene comentario editorial"
            >
              <NotebookPen className="h-2.5 w-2.5" />
              anotada
            </span>
          )}
        </p>
        <p className="text-xs text-fg-muted truncate">{r.officialTitle}</p>
        <p className="mt-1 text-xs text-fg-muted truncate">
          <span className="font-semibold text-fg">Estado:</span>{" "}
          {STATUSES[r.status].label}
          <span className="mx-2 text-fg-muted/40">·</span>
          <span className="font-semibold text-fg">Materia:</span>{" "}
          {areasLabel(r)}
        </p>
      </div>
      <div className="text-right text-xs text-fg-muted shrink-0">
        <div className="tabular-nums">{r.year ?? "—"}</div>
        <div className="mt-1">{NORM_TYPES[r.normType]}</div>
      </div>
      {r.officialUrl ? (
        <a
          href={r.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex items-center gap-1 text-xs text-fg-muted hover:text-accent rounded p-1.5 hover:bg-bg-elevated transition-colors shrink-0"
          aria-label={`Abrir texto oficial de ${r.shortTitle} en nueva pestaña`}
          title="Fuente oficial"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <span className="w-7" />
      )}
    </div>
  );
}
