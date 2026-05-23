import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getIndex } from "@/lib/index";
import { loadRegulations } from "@/lib/content";
import { AREAS, type Area } from "@/lib/taxonomy";
import { HeroStrides } from "@/components/home/HeroStrides";
import { CountryStrip } from "@/components/home/CountryStrip";
import { HelpSection } from "@/components/home/HelpSection";
import { TrackerCard } from "@/components/home/TrackerCard";
import { ShipmentRow } from "@/components/home/ShipmentRow";
import { areaColor } from "@/components/ui/AreaChip";

export default async function HomePage() {
  const data = await getIndex();
  const allRegs = await loadRegulations();
  const annotated = data.filter((d) => d.hasCriticalAnalysis);
  const featured = annotated.slice(0, 4);

  const recent = [...data]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .slice(0, 6);

  return (
    <div>
      <HeroStrides totalRegs={data.length} topRegulations={data} />

      <CountryStrip data={data} />

      <HelpSection />

      {/* ANNOTATED */}
      {annotated.length >= 3 && (
        <section className="container-app py-16">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <p className="eyebrow mb-1">Lecturas con análisis</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Fichas con comentario crítico
              </h2>
            </div>
            <Link
              href="/regulaciones?analysis=1"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-accent font-semibold hover:underline"
            >
              Ver todas <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {annotated.slice(0, 3).map((r) => {
              const full = allRegs.find((x) => x.id === r.id)!;
              return (
                <TrackerCard
                  key={r.id}
                  reg={r}
                  publicationDate={full.publicationDate}
                  effectiveDate={full.effectiveDate}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* AREAS magazine grid */}
      <section className="container-app py-16">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="eyebrow mb-1">Por materia</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Áreas temáticas
            </h2>
          </div>
          <Link
            href="/areas"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-accent font-semibold hover:underline"
          >
            Ver todas <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(AREAS) as Area[]).map((a) => {
            const count = data.filter((d) => d.areas.includes(a)).length;
            const color = areaColor(a);
            return (
              <Link
                key={a}
                href={`/areas/${a}`}
                className="group rounded-2xl bg-bg-elevated border border-border p-5 hover:border-accent/50 hover:shadow-soft transition-all"
              >
                <span
                  className="inline-block h-1.5 w-10 rounded-full mb-3"
                  style={{ background: `rgb(${color})` }}
                />
                <p className="font-semibold text-fg text-sm group-hover:text-accent transition-colors leading-snug">
                  {AREAS[a].name}
                </p>
                <p className="text-xs text-fg-muted mt-1">
                  {count} ficha{count === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* RECENT */}
      <section className="container-app py-16">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="eyebrow mb-1">Más recientes</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Últimas regulaciones publicadas
            </h2>
          </div>
          <Link
            href="/regulaciones"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-accent font-semibold hover:underline"
          >
            Catálogo completo <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {recent.map((r) => (
            <ShipmentRow key={r.id} reg={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
