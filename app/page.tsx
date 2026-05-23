import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, GitCompareArrows } from "lucide-react";
import { getIndex } from "@/lib/index";
import { loadRegulations } from "@/lib/content";
import { AREAS, COUNTRIES, type Area, type CountryCode } from "@/lib/taxonomy";
import { AreaChip, areaColor } from "@/components/ui/AreaChip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LatamPaperMap } from "@/components/home/LatamPaperMap";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const data = await getIndex();
  const allRegs = await loadRegulations();
  const countriesCount = new Set(data.map((d) => d.country)).size;
  const areasCount = new Set(data.flatMap((d) => d.areas)).size;
  const featured = data
    .filter((d) => d.hasCriticalAnalysis)
    .slice(0, 4);
  const recent = [...data]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .slice(0, 5);
  const lastUpdated = allRegs
    .map((r) => r.lastUpdated)
    .sort()
    .reverse()[0];

  const byCountry = (Object.keys(COUNTRIES) as CountryCode[])
    .map((c) => ({
      code: c,
      ...COUNTRIES[c],
      count: data.filter((d) => d.country === c).length,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="px-4 sm:px-8 lg:px-10 py-6 sm:py-10 max-w-[1200px] mx-auto">
      {/* HERO with map */}
      <section className="grid lg:grid-cols-[1fr_minmax(260px,360px)] gap-8 lg:gap-14 items-start mb-16">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[0.7rem] text-accent font-medium mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Curaduría académica firmada
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-[5rem] leading-[0.95] tracking-tight text-balance">
            La regulación tecnológica de{" "}
            <span className="text-accent">Latinoamérica</span>, en un solo lugar.
          </h1>
          <p className="mt-6 text-lg text-fg-muted leading-relaxed max-w-xl text-pretty">
            Un catálogo filtrable de leyes, decretos y proyectos sobre
            inteligencia artificial, datos personales, ciberseguridad,
            plataformas y soberanía digital en América Latina.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/regulaciones"
              className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-fg px-5 py-2.5 text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Abrir catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/comparar"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg-elevated px-5 py-2.5 text-sm font-medium hover:border-accent/60 transition-colors"
            >
              <GitCompareArrows className="h-4 w-4" />
              Comparar normas
            </Link>
          </div>

          {/* inline stats */}
          <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            <Stat n={data.length} label="normas" />
            <Stat n={countriesCount} label="países" />
            <Stat n={areasCount} label="áreas" />
          </dl>
          {lastUpdated && (
            <p className="mt-4 text-xs text-fg-muted">
              Última actualización: {formatDate(lastUpdated)}
            </p>
          )}
        </div>

        <div className="hidden lg:block">
          <LatamPaperMap data={data} />
        </div>
      </section>

      {/* Featured reading */}
      {featured.length > 0 && (
        <section className="mb-16">
          <SectionHead
            eyebrow="Lecturas con análisis"
            title="Fichas con comentario crítico firmado"
            href="/regulaciones?analysis=1"
            hrefLabel="Ver todas"
          />
          <ul className="divide-y divide-border border-y border-border">
            {featured.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/regulaciones/${r.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] gap-4 items-start py-4 hover:bg-bg-elevated/60 -mx-3 px-3 rounded-lg transition-colors"
                >
                  <span
                    aria-hidden
                    className="text-2xl mt-0.5"
                  >
                    {r.countryFlag}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.65rem] uppercase tracking-wider text-fg-muted">
                      {r.countryName} · {r.year}
                    </p>
                    <h3 className="font-display text-lg leading-snug group-hover:text-accent transition-colors mt-0.5">
                      {r.shortTitle}
                    </h3>
                    <p className="text-sm text-fg-muted line-clamp-2 mt-1">
                      {r.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <StatusBadge status={r.status} />
                      {r.areas.slice(0, 2).map((a) => (
                        <AreaChip key={a} area={a} link={false} short />
                      ))}
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-fg-muted group-hover:text-accent transition-colors shrink-0 mt-1" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* By country band */}
      <section className="mb-16">
        <SectionHead
          eyebrow="Cobertura por jurisdicción"
          title="11 países, cobertura variable"
          href="/paises"
          hrefLabel="Ver índice"
        />
        <div className="flex flex-wrap gap-2">
          {byCountry.map((c) => (
            <Link
              key={c.code}
              href={c.count > 0 ? `/paises/${c.code.toLowerCase()}` : "/regulaciones"}
              className="inline-flex items-baseline gap-2 rounded-full border border-border bg-bg-elevated px-4 py-1.5 text-sm hover:border-accent/60 transition-colors"
            >
              <span className="text-base leading-none">{c.flag}</span>
              <span>{c.name}</span>
              <span className="text-xs text-fg-muted tabular-nums">{c.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Areas magazine grid */}
      <section className="mb-16">
        <SectionHead
          eyebrow="Materias"
          title="10 áreas curadas"
          href="/areas"
          hrefLabel="Ver todas"
        />
        <div className="grid gap-px bg-border rounded-xl overflow-hidden border border-border">
          {(Object.keys(AREAS) as Area[]).map((a) => {
            const count = data.filter((d) => d.areas.includes(a)).length;
            const color = areaColor(a);
            return (
              <Link
                key={a}
                href={`/areas/${a}`}
                className="group bg-bg-elevated p-5 hover:bg-bg-sunken transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: `rgb(${color})` }}
                  />
                  <span className="text-[0.65rem] uppercase tracking-wider text-fg-muted">
                    {count} ficha{count === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="font-display text-base font-medium leading-tight group-hover:text-accent transition-colors">
                  {AREAS[a].name}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent */}
      <section className="mb-12">
        <SectionHead
          eyebrow="Más recientes por año"
          title="Últimas regulaciones publicadas"
          href="/regulaciones"
          hrefLabel="Catálogo completo"
        />
        <ul className="divide-y divide-border border-y border-border">
          {recent.map((r) => (
            <li key={r.id}>
              <Link
                href={`/regulaciones/${r.slug}`}
                className="group flex items-center gap-4 py-3 hover:bg-bg-elevated/60 -mx-3 px-3 rounded-lg transition-colors"
              >
                <span aria-hidden className="text-xl">
                  {r.countryFlag}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">
                    {r.shortTitle}
                  </p>
                  <p className="text-xs text-fg-muted truncate">{r.officialTitle}</p>
                </div>
                <span className="text-xs text-fg-muted tabular-nums shrink-0">
                  {r.year}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-fg-muted group-hover:text-accent transition-colors shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="stat-num text-4xl">{n}</p>
      <p className="text-[0.7rem] uppercase tracking-wider text-fg-muted mt-1.5">
        {label}
      </p>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  href,
  hrefLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <p className="eyebrow mb-1.5">{eyebrow}</p>
        <h2 className="font-display text-2xl sm:text-[1.7rem] font-medium tracking-tight">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="hidden sm:inline-flex items-center gap-1 text-xs text-fg-muted hover:text-accent transition-colors whitespace-nowrap"
        >
          {hrefLabel} <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
