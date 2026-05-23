import Link from "next/link";
import type { IndexedRegulation } from "@/lib/index-types";
import { AreaChip } from "@/components/ui/AreaChip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { NORM_TYPES } from "@/lib/taxonomy";
import { ChevronRight, Sparkles, ExternalLink } from "lucide-react";

export function RegulationCard({ r }: { r: IndexedRegulation }) {
  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-bg-elevated p-5 hover:border-accent/60 hover:shadow-sm transition-all">
      <div className="flex items-start gap-2 mb-2">
        <CountryFlag code={r.country} link={false} showName={false} className="text-xl" />
        <span className="text-xs text-fg-muted uppercase tracking-wider font-medium">
          {r.countryName} · {NORM_TYPES[r.normType]}
        </span>
        {r.hasCriticalAnalysis && (
          <Sparkles className="ml-auto h-3.5 w-3.5 text-accent" aria-label="Análisis crítico" />
        )}
      </div>
      <h3 className="font-serif text-lg font-semibold leading-snug text-balance mb-1 group-hover:text-accent transition-colors">
        <Link
          href={`/regulaciones/${r.slug}`}
          className="before:absolute before:inset-0 before:rounded-xl"
        >
          {r.shortTitle}
        </Link>
      </h3>
      <p className="text-xs text-fg-muted line-clamp-1 mb-3">{r.officialTitle}</p>
      <p className="text-sm text-fg-muted line-clamp-3 mb-4 flex-1">{r.summary}</p>
      <div className="flex flex-wrap items-center gap-1.5 mt-auto">
        <StatusBadge status={r.status} />
        {r.areas.slice(0, 2).map((a) => (
          <AreaChip key={a} area={a} link={false} short />
        ))}
        {r.areas.length > 2 && (
          <span className="text-[0.65rem] text-fg-muted">+{r.areas.length - 2}</span>
        )}
        <span className="ml-auto inline-flex items-center text-xs text-fg-muted group-hover:text-accent transition-colors">
          {r.year ?? "—"}
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </span>
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
            <Sparkles className="inline-block ml-1.5 h-3 w-3 text-accent align-baseline" aria-label="Análisis crítico" />
          )}
        </p>
        <p className="text-xs text-fg-muted truncate">{r.officialTitle}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 relative z-10">
          <StatusBadge status={r.status} />
          {r.areas.slice(0, 3).map((a) => (
            <AreaChip key={a} area={a} link={false} short />
          ))}
        </div>
      </div>
      <div className="text-right text-xs text-fg-muted shrink-0">
        <div>{r.year ?? "—"}</div>
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
