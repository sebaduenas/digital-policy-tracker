import Link from "next/link";
import { ArrowRight, ArrowLeftRight, History } from "lucide-react";
import type { Regulation } from "@/lib/schemas/regulation";
import { type CountryCode } from "@/lib/taxonomy";
import { Flag } from "@/components/ui/Flag";

interface Props {
  current: Regulation;
  all: Regulation[];
}

export function RelatedRegulations({ current, all }: Props) {
  const related = (current.relatedRegulations ?? [])
    .map((id) => all.find((r) => r.id === id))
    .filter(Boolean) as Regulation[];

  const supersedes = (current.supersedes ?? [])
    .map((id) => all.find((r) => r.id === id))
    .filter(Boolean) as Regulation[];

  const supersededBy = current.supersededBy
    ? all.find((r) => r.id === current.supersededBy)
    : undefined;

  if (!related.length && !supersedes.length && !supersededBy) return null;

  return (
    <section className="mt-8 pt-6 border-t border-border">
      <h2 className="font-display text-xl font-semibold mb-4">
        Relacionadas en el tracker
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {supersededBy && (
          <RelatedCard
            label="Reemplazada por"
            icon={<ArrowRight className="h-3.5 w-3.5" />}
            reg={supersededBy}
            tone="destructive"
          />
        )}
        {supersedes.map((r) => (
          <RelatedCard
            key={r.id}
            label="Reemplaza a"
            icon={<History className="h-3.5 w-3.5" />}
            reg={r}
            tone="muted"
          />
        ))}
        {related.map((r) => (
          <RelatedCard
            key={r.id}
            label="Relacionada"
            icon={<ArrowLeftRight className="h-3.5 w-3.5" />}
            reg={r}
            tone="accent"
          />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({
  label,
  icon,
  reg,
  tone,
}: {
  label: string;
  icon: React.ReactNode;
  reg: Regulation;
  tone: "accent" | "muted" | "destructive";
}) {
  const toneStyles: Record<string, string> = {
    accent: "text-accent",
    muted: "text-fg-muted",
    destructive: "text-[rgb(220_38_38)]",
  };
  return (
    <Link
      href={`/regulaciones/${reg.slug}`}
      className="group flex items-start gap-3 rounded-lg border border-border bg-bg-elevated/60 p-3 hover:border-accent/60 transition-all"
    >
      <span className={`shrink-0 mt-0.5 ${toneStyles[tone]}`}>{icon}</span>
      <div className="min-w-0">
        <p className={`text-[0.65rem] uppercase tracking-wider font-medium ${toneStyles[tone]}`}>
          {label}
        </p>
        <p className="text-sm font-medium text-fg group-hover:text-accent transition-colors truncate">
          <Flag code={reg.country as CountryCode} size={14} /> {reg.shortTitle}
        </p>
        <p className="text-xs text-fg-muted line-clamp-1 mt-0.5">
          {reg.officialTitle}
        </p>
      </div>
    </Link>
  );
}
