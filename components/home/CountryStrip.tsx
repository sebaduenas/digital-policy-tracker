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
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <div className="bg-nav-bg text-nav-fg py-6 sm:py-7">
      <div className="container-app">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-6 items-center">
          {top.map((c) => (
            <Link
              key={c.code}
              href={`/paises/${c.code.toLowerCase()}`}
              className="group flex items-center justify-center gap-2 text-nav-fg-muted hover:text-nav-fg transition-colors"
            >
              <span className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                {c.flag}
              </span>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold leading-tight">{c.name}</span>
                <span className="text-[0.65rem] tabular-nums opacity-70">
                  {c.count} normas
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
