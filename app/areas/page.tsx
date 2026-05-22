import type { Metadata } from "next";
import Link from "next/link";
import { getIndex } from "@/lib/index";
import { AREAS, type Area } from "@/lib/taxonomy";
import { areaColor } from "@/components/ui/AreaChip";

export const metadata: Metadata = {
  title: "Áreas temáticas",
  description:
    "Diez áreas temáticas curadas que organizan la regulación tecnológica del tracker.",
};

export default async function AreasIndex() {
  const data = await getIndex();
  const grouped = (Object.keys(AREAS) as Area[])
    .map((a) => {
      const items = data.filter((d) => d.areas.includes(a));
      return { key: a, meta: AREAS[a], count: items.length };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
          Áreas temáticas
        </h1>
        <p className="mt-2 text-fg-muted max-w-2xl">
          Diez áreas curadas que organizan la regulación. Cada ficha puede
          pertenecer a más de una.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {grouped.map((a) => {
          const color = areaColor(a.key);
          return (
            <Link
              key={a.key}
              href={`/areas/${a.key}`}
              className="group relative rounded-xl border border-border bg-bg-elevated p-5 hover:border-accent/60 transition-all overflow-hidden"
            >
              <div
                className="absolute inset-y-0 left-0 w-1"
                style={{ background: `rgb(${color})` }}
              />
              <div className="flex items-baseline justify-between mb-1.5">
                <h3 className="font-serif text-lg font-semibold group-hover:text-accent transition-colors">
                  {a.meta.name}
                </h3>
                <span className="text-xs text-fg-muted">
                  {a.count} ficha{a.count === 1 ? "" : "s"}
                </span>
              </div>
              <p className="text-sm text-fg-muted leading-relaxed line-clamp-3">
                {a.meta.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
