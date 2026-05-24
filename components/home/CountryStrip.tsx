"use client";

import Link from "next/link";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";
import type { IndexedRegulation } from "@/lib/index-types";
import { useLocale } from "@/lib/i18n";
import { Flag } from "@/components/ui/Flag";

export function CountryStrip({ data }: { data: IndexedRegulation[] }) {
  const { t } = useLocale();
  const top = (Object.keys(COUNTRIES) as CountryCode[])
    .map((c) => ({
      code: c,
      ...COUNTRIES[c],
      count: data.filter((d) => d.country === c).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="border-b border-border" style={{ background: "rgb(var(--bg-mint))" }}>
      <div className="container-app py-12 sm:py-16">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-10 items-center">
          <div>
            <h2 className="display-tight text-[2rem] sm:text-[2.5rem] leading-[1.1]">
              {t("country.title.before")}{" "}
              <span style={{ color: "rgb(var(--accent))" }}>
                {t("country.title.accent")}
              </span>
              {t("country.title.suffix")}
            </h2>
            <p className="mt-3 text-fg-muted max-w-md">
              {t("country.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {top.map((c) => (
              <Link
                key={c.code}
                href={`/paises/${c.code.toLowerCase()}`}
                className="flex items-center gap-2.5 bg-bg/85 hover:bg-bg px-3 py-2.5 transition-colors"
                style={{ borderRadius: 6 }}
                title={`${c.name} · ${c.count} normas`}
              >
                <Flag code={c.code} size={18} />
                <span className="text-sm font-medium truncate flex-1 text-fg">
                  {c.name}
                </span>
                <span
                  className="text-xs tabular-nums px-1.5 py-0.5 rounded font-semibold"
                  style={{
                    background: "rgb(var(--accent-soft))",
                    color: "rgb(var(--accent-deep))",
                  }}
                >
                  {c.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
