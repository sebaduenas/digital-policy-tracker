import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { IndexedRegulation } from "@/lib/index-types";
import { COUNTRIES, type CountryCode } from "@/lib/taxonomy";

interface Props {
  totalRegs: number;
  topRegulations: IndexedRegulation[];
}

export function HeroStrides({ totalRegs, topRegulations }: Props) {
  const countriesCount = new Set(topRegulations.map((r) => r.country)).size;
  return (
    <section
      className="relative border-b border-border"
      style={{ background: "rgb(var(--bg-cream))" }}
    >
      <div className="container-app py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <p className="eyebrow mb-4">Repositorio normativo regional</p>
            <h1
              className="display-tight text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] text-balance"
              style={{ color: "rgb(var(--navy))" }}
            >
              Regulación tecnológica en{" "}
              <span style={{ color: "rgb(var(--accent))" }}>
                América Latina
              </span>
              , en un solo lugar.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-fg-muted max-w-2xl leading-relaxed">
              {totalRegs} normas, decretos y proyectos de ley sobre inteligencia
              artificial, datos personales, ciberseguridad, plataformas
              digitales, fintech y soberanía digital, organizados por país,
              materia y estado de tramitación.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 items-center">
              <Link
                href="/regulaciones"
                className="btn-pill"
                style={{
                  background: "rgb(var(--navy))",
                  color: "white",
                }}
              >
                Abrir catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/metodologia"
                className="btn-pill bg-bg text-fg hover:bg-bg-sunken border border-border-strong"
              >
                Leer metodología
              </Link>
            </div>
          </div>

          <aside
            className="bg-bg border border-border p-6 shadow-soft"
            style={{ borderRadius: 4 }}
          >
            <p className="eyebrow mb-4">Cobertura actual</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
              <Stat n={totalRegs} label="Normas indexadas" />
              <Stat n={countriesCount > 0 ? 11 : 0} label="Jurisdicciones" />
              <Stat n={10} label="Áreas temáticas" />
              <Stat
                n={topRegulations.filter((r) => r.hasCriticalAnalysis).length}
                label="Con análisis"
              />
            </dl>
            <div className="mt-6 pt-5 border-t border-border">
              <p className="eyebrow mb-3">Países con mayor cobertura</p>
              <ul className="space-y-1.5 text-sm">
                {topCountries(topRegulations)
                  .slice(0, 5)
                  .map((c) => (
                    <li
                      key={c.code}
                      className="flex items-center justify-between"
                    >
                      <Link
                        href={`/paises/${c.code.toLowerCase()}`}
                        className="text-fg hover:text-accent transition-colors flex items-center gap-2"
                      >
                        <span aria-hidden>{c.flag}</span>
                        <span>{c.name}</span>
                      </Link>
                      <span className="text-xs text-fg-muted tabular-nums">
                        {c.count}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="stat-num text-3xl" style={{ color: "rgb(var(--navy))" }}>
        {n}
      </p>
      <p className="text-xs text-fg-muted mt-1">{label}</p>
    </div>
  );
}

function topCountries(items: IndexedRegulation[]) {
  const acc: Partial<Record<CountryCode, number>> = {};
  items.forEach((i) => {
    acc[i.country] = (acc[i.country] || 0) + 1;
  });
  return Object.entries(acc)
    .map(([code, count]) => ({
      code: code as CountryCode,
      count: count as number,
      ...COUNTRIES[code as CountryCode],
    }))
    .sort((a, b) => b.count - a.count);
}
