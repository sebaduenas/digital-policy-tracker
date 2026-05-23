import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import type { IndexedRegulation } from "@/lib/index-types";
import { STATUSES, NORM_TYPES } from "@/lib/taxonomy";
import { formatDate } from "@/lib/utils";

interface Props {
  reg: IndexedRegulation;
  publicationDate?: string;
  effectiveDate?: string;
  authority?: string;
}

const STAGES = [
  { key: "proyecto-en-discusion", label: "Proyecto" },
  { key: "aprobado-pendiente-promulgacion", label: "Aprobado" },
  { key: "vigencia-diferida", label: "Vigencia diferida" },
  { key: "vigente", label: "Vigente" },
];

export function TrackerCard({ reg, publicationDate, effectiveDate, authority }: Props) {
  const statusOrder: Record<string, number> = {
    "proyecto-en-discusion": 0,
    "aprobado-pendiente-promulgacion": 1,
    "vigencia-diferida": 2,
    vigente: 3,
    derogado: 4,
    "veto-pendiente": 0,
    "reglamento-pendiente": 2,
  };
  const stage = statusOrder[reg.status] ?? 0;

  return (
    <Link
      href={`/regulaciones/${reg.slug}`}
      className="block rounded-2xl bg-bg-elevated border border-border p-5 shadow-soft hover:shadow-card hover:border-accent/50 transition-all group"
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Package className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[0.7rem] text-fg-muted">
            <span aria-hidden>{reg.countryFlag}</span>
            <span className="uppercase tracking-wider font-semibold">
              {reg.countryName}
            </span>
            <span>·</span>
            <span className="font-mono text-fg">#{reg.id.toUpperCase()}</span>
          </div>
          <p className="font-semibold text-fg group-hover:text-accent transition-colors mt-0.5 truncate">
            {reg.shortTitle}
          </p>
          <p className="text-xs text-fg-muted truncate mt-0.5">
            {STATUSES[reg.status].label} · {NORM_TYPES[reg.normType]}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-fg-muted/60 group-hover:text-accent transition-colors shrink-0" />
      </div>

      {/* Tracker stepper */}
      <div className="mt-3 pt-3 border-t border-dashed border-border">
        <div className="relative flex items-center justify-between mb-2">
          {/* line behind */}
          <span className="absolute inset-y-0 left-2 right-2 my-auto h-px bg-border" />
          {/* progress line */}
          <span
            className="absolute inset-y-0 left-2 my-auto h-px bg-accent transition-all"
            style={{
              width: `${(stage / (STAGES.length - 1)) * 90}%`,
            }}
          />
          {STAGES.map((s, i) => {
            const done = i <= stage;
            return (
              <span
                key={s.key}
                className={`relative z-10 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors ${
                  done
                    ? "bg-accent border-accent"
                    : "bg-bg-elevated border-border-strong"
                }`}
                title={s.label}
              >
                {done && (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-fg" />
                )}
              </span>
            );
          })}
        </div>
        <div className="flex justify-between text-[0.6rem] text-fg-muted">
          <span>{publicationDate ? formatDate(publicationDate) : "—"}</span>
          <span className="text-right">
            {effectiveDate ? `vigor ${formatDate(effectiveDate)}` : reg.year}
          </span>
        </div>
      </div>

      {authority && (
        <div className="mt-3 pt-3 border-t border-dashed border-border text-[0.7rem] text-fg-muted">
          <span className="uppercase tracking-wider font-semibold mr-1">Autoridad:</span>
          <span className="text-fg">{authority}</span>
        </div>
      )}
    </Link>
  );
}
