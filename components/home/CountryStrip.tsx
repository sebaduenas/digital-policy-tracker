import Link from "next/link";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";
import type { IndexedRegulation } from "@/lib/index-types";

export function CountryStrip({ data }: { data: IndexedRegulation[] }) {
  const top = (Object.keys(COUNTRIES) as CountryCode[])
    .map((c) => ({
      code: c,
      ...COUNTRIES[c],
      count: data.filter((d) => d.country === c).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="border-b border-border bg-bg-sunken">
      <div className="container-app py-5">
        <div className="flex items-center gap-4 mb-3">
          <span className="eyebrow">Jurisdicciones cubiertas</span>
          <span className="h-px flex-1 bg-border" />
          <Link
            href="/paises"
            className="text-xs text-fg-muted hover:text-fg transition-colors"
          >
            Ver índice →
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-11 gap-2">
          {top.map((c) => (
            <Link
              key={c.code}
              href={`/paises/${c.code.toLowerCase()}`}
              className="flex items-center gap-2 px-2 py-2 hover:bg-bg transition-colors"
              style={{ borderRadius: 2 }}
              title={`${c.name} · ${c.count} normas`}
            >
              <span className="text-xl" aria-hidden>
                {c.flag}
              </span>
              <div className="hidden md:flex flex-col min-w-0">
                <span className="text-xs font-medium truncate text-fg">
                  {c.name}
                </span>
                <span className="text-[0.65rem] text-fg-muted tabular-nums">
                  {c.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
