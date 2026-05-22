import Link from "next/link";
import type { IndexedRegulation } from "@/lib/index-types";
import { cn } from "@/lib/utils";

export function MiniTimeline({
  items,
  emptyLabel = "Sin regulaciones",
}: {
  items: IndexedRegulation[];
  emptyLabel?: string;
}) {
  if (!items.length) {
    return <p className="text-sm text-fg-muted italic">{emptyLabel}</p>;
  }
  const withYear = items.filter((i) => i.year != null);
  if (!withYear.length) return null;
  const minYear = Math.min(...withYear.map((i) => i.year!));
  const maxYear = Math.max(...withYear.map((i) => i.year!));
  const span = Math.max(1, maxYear - minYear);

  return (
    <div className="relative pt-6 pb-3">
      <div className="relative h-1 rounded-full bg-border">
        {withYear.map((i) => {
          const pos = ((i.year! - minYear) / span) * 100;
          return (
            <Link
              key={i.id}
              href={`/regulaciones/${i.slug}`}
              className={cn(
                "group absolute top-1/2 -translate-y-1/2 -translate-x-1/2",
              )}
              style={{ left: `${pos}%` }}
              title={`${i.year} · ${i.shortTitle}`}
            >
              <span className="block h-3 w-3 rounded-full bg-accent ring-2 ring-bg" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-6 whitespace-nowrap rounded bg-bg-elevated border border-border px-1.5 py-0.5 text-[0.65rem] text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                {i.year} · {i.shortTitle}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[0.65rem] text-fg-muted">
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
    </div>
  );
}
