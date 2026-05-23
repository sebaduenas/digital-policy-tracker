import type { Metadata } from "next";
import Link from "next/link";
import { getIndex } from "@/lib/index";
import { COUNTRIES } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Países",
  description: "Listado de jurisdicciones LATAM cubiertas por el tracker.",
};

const REGION_ORDER = [
  "Sudamérica",
  "Centroamérica y Norteamérica",
  "Caribe",
] as const;

export default async function CountriesIndex() {
  const data = await getIndex();
  const all = Object.entries(COUNTRIES).map(([code, c]) => {
    const items = data.filter((d) => d.country === code);
    return { code, ...c, count: items.length };
  });

  const withFichas = all.filter((c) => c.count > 0);

  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          Países
        </h1>
        <p className="mt-2 text-fg-muted max-w-2xl">
          {withFichas.length} de {all.length} jurisdicciones de América Latina
          con fichas publicadas. Listado por región y orden alfabético.
        </p>
      </header>

      <div className="space-y-10">
        {REGION_ORDER.map((region) => {
          const inRegion = all
            .filter((c) => c.region === region)
            .sort((a, b) => a.name.localeCompare(b.name, "es"));
          if (!inRegion.length) return null;
          return (
            <section key={region}>
              <h2 className="font-display text-xl font-semibold mb-4">
                {region}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {inRegion.map((c) => (
                  <Link
                    key={c.code}
                    href={
                      c.count > 0
                        ? `/paises/${c.code.toLowerCase()}`
                        : `/regulaciones?country=${c.code}`
                    }
                    className="group flex items-center gap-3 rounded-lg border border-border bg-bg-elevated p-4 hover:border-accent/60 hover:shadow-sm transition-all"
                  >
                    <span className="text-3xl" aria-hidden>
                      {c.flag}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-fg group-hover:text-accent transition-colors">
                        {c.name}
                      </p>
                      <p className="text-xs text-fg-muted">
                        {c.count > 0
                          ? `${c.count} ficha${c.count === 1 ? "" : "s"}`
                          : "Próximamente"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
