import Link from "next/link";
import {
  ArrowRight,
  Search,
  ScrollText,
  GitCompareArrows,
  PieChart,
  Sparkles,
  MapPin,
} from "lucide-react";
import { getIndex } from "@/lib/index";
import { AREAS, COUNTRIES, type Area, type CountryCode } from "@/lib/taxonomy";
import { RegulationCard } from "@/components/cards/RegulationCard";
import { areaColor } from "@/components/ui/AreaChip";

export default async function HomePage() {
  const data = await getIndex();
  const countriesCount = new Set(data.map((d) => d.country)).size;
  const areasCount = new Set(data.flatMap((d) => d.areas)).size;
  const featured = data.filter((d) => d.hasCriticalAnalysis).slice(0, 3);
  const recent = [...data]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .slice(0, 6);

  const lastUpdated = data
    .map((d) => d.publicationDate)
    .filter(Boolean)
    .sort()
    .reverse()[0];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            background:
              "radial-gradient(ellipse at top, rgb(var(--accent)) 0%, transparent 60%)",
          }}
        />
        <div className="container relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs text-fg-muted mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Proyecto académico abierto · curaduría firmada
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance leading-[1.05]">
              El mapa regulatorio de la{" "}
              <span className="text-accent">tecnología</span> en América Latina.
            </h1>
            <p className="mt-5 text-lg text-fg-muted leading-relaxed max-w-2xl text-pretty">
              Catálogo curado, filtrable y comparable de leyes, decretos y
              proyectos en materia de inteligencia artificial, protección de
              datos, ciberseguridad, plataformas digitales y soberanía
              tecnológica.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/regulaciones"
                className="inline-flex items-center gap-2 rounded-md bg-accent text-accent-fg px-5 py-2.5 text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                <Search className="h-4 w-4" />
                Explorar regulaciones
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/comparar"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-elevated px-5 py-2.5 text-sm font-medium hover:border-accent/60 transition-colors"
              >
                <GitCompareArrows className="h-4 w-4" />
                Comparar países
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-elevated px-5 py-2.5 text-sm font-medium hover:border-accent/60 transition-colors"
              >
                <PieChart className="h-4 w-4" />
                Ver dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-b border-border bg-bg-elevated/40">
        <div className="container py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox value={data.length} label="Regulaciones indexadas" />
          <StatBox value={countriesCount} label="Países cubiertos" />
          <StatBox value={areasCount} label="Áreas temáticas" />
          <StatBox
            value={lastUpdated?.slice(0, 4) || "—"}
            label="Última actualización"
            sub={lastUpdated ? `Publicada ${lastUpdated}` : undefined}
          />
        </div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="container py-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-accent font-medium mb-1">
                Editor's picks
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight">
                Fichas con análisis crítico
              </h2>
            </div>
            <Link
              href="/regulaciones?analysis=1"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-fg-muted hover:text-accent"
            >
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((r) => (
              <RegulationCard key={r.id} r={r} />
            ))}
          </div>
        </section>
      )}

      {/* AREAS GRID */}
      <section className="border-y border-border bg-bg-elevated/40">
        <div className="container py-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-accent font-medium mb-1">
                Por temas
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight">
                Áreas temáticas
              </h2>
            </div>
            <Link
              href="/areas"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-fg-muted hover:text-accent"
            >
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {(Object.keys(AREAS) as Area[]).map((a) => {
              const items = data.filter((d) => d.areas.includes(a));
              const color = areaColor(a);
              return (
                <Link
                  key={a}
                  href={`/areas/${a}`}
                  className="group rounded-lg border border-border bg-bg p-4 hover:border-accent/60 transition-all"
                >
                  <span
                    className="block h-1 w-8 rounded-full mb-3"
                    style={{ background: `rgb(${color})` }}
                  />
                  <p className="text-sm font-medium text-fg group-hover:text-accent transition-colors">
                    {AREAS[a].name}
                  </p>
                  <p className="text-xs text-fg-muted mt-0.5">
                    {items.length} ficha{items.length === 1 ? "" : "s"}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* RECENT */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-accent font-medium mb-1">
              Más recientes
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight">
              Últimas regulaciones publicadas
            </h2>
          </div>
          <Link
            href="/regulaciones"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-fg-muted hover:text-accent"
          >
            Ver catálogo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recent.map((r) => (
            <RegulationCard key={r.id} r={r} />
          ))}
        </div>
      </section>

      {/* COUNTRIES STRIP */}
      <section className="border-t border-border bg-bg-elevated/40">
        <div className="container py-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-wider text-accent font-medium mb-1">
                Por jurisdicción
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight">
                Países cubiertos
              </h2>
            </div>
            <Link
              href="/paises"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-fg-muted hover:text-accent"
            >
              Ver mapa <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(COUNTRIES) as CountryCode[])
              .map((c) => ({
                code: c,
                ...COUNTRIES[c],
                count: data.filter((d) => d.country === c).length,
              }))
              .sort((a, b) => b.count - a.count)
              .map((c) => (
                <Link
                  key={c.code}
                  href={
                    c.count > 0
                      ? `/paises/${c.code.toLowerCase()}`
                      : "/regulaciones"
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-bg px-3 py-1.5 text-sm hover:border-accent/60 transition-colors"
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                  <span className="text-xs text-fg-muted">{c.count}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY CTA */}
      <section className="container py-16">
        <div className="rounded-2xl border border-border bg-bg-elevated p-8 sm:p-10 flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent mb-3">
              <Sparkles className="h-3 w-3" /> Curaduría académica
            </div>
            <h2 className="font-serif text-2xl font-semibold tracking-tight mb-2">
              Metodología transparente, fuentes verificables
            </h2>
            <p className="text-fg-muted leading-relaxed max-w-2xl">
              Cada ficha es revisada por un editor identificable, con citas
              oficiales, nivel de confianza declarado y versionado público.
              Conoce nuestros criterios de inclusión, taxonomía y política
              editorial.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Link
              href="/metodologia"
              className="inline-flex items-center gap-2 rounded-md bg-accent text-accent-fg px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <ScrollText className="h-4 w-4" />
              Leer metodología
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-accent/60 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              Sobre el proyecto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatBox({
  value,
  label,
  sub,
}: {
  value: string | number;
  label: string;
  sub?: string;
}) {
  return (
    <div>
      <p className="font-serif text-3xl font-semibold tracking-tight text-fg">
        {value}
      </p>
      <p className="text-xs text-fg-muted uppercase tracking-wider mt-1">
        {label}
      </p>
      {sub && <p className="text-[0.65rem] text-fg-muted mt-0.5">{sub}</p>}
    </div>
  );
}
