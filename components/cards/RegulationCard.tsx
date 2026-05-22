import Link from "next/link";
import type { IndexedRegulation } from "@/lib/index-types";
import { AreaChip } from "@/components/ui/AreaChip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { NORM_TYPES } from "@/lib/taxonomy";
import { ChevronRight, Sparkles } from "lucide-react";

export function RegulationCard({ r }: { r: IndexedRegulation }) {
  return (
    <Link
      href={`/regulaciones/${r.slug}`}
      className="group relative flex flex-col rounded-xl border border-border bg-bg-elevated p-5 hover:border-accent/60 hover:shadow-sm transition-all"
    >
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
        {r.shortTitle}
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
    </Link>
  );
}

export function RegulationRow({ r }: { r: IndexedRegulation }) {
  return (
    <Link
      href={`/regulaciones/${r.slug}`}
      className="group grid grid-cols-[auto_1fr_auto] gap-4 items-center border-b border-border py-3 px-2 hover:bg-bg-elevated/60 transition-colors -mx-2 rounded-md"
    >
      <span className="text-xl" aria-hidden>
        {r.countryFlag}
      </span>
      <div className="min-w-0">
        <p className="font-medium text-fg group-hover:text-accent truncate transition-colors">
          {r.shortTitle}
          {r.hasCriticalAnalysis && (
            <Sparkles className="inline-block ml-1.5 h-3 w-3 text-accent align-baseline" aria-label="Análisis crítico" />
          )}
        </p>
        <p className="text-xs text-fg-muted truncate">{r.officialTitle}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
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
    </Link>
  );
}
