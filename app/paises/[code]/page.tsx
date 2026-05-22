import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getIndex } from "@/lib/index";
import { COUNTRIES, AREAS, type CountryCode } from "@/lib/taxonomy";
import { RegulationRow } from "@/components/cards/RegulationCard";
import { MiniTimeline } from "@/components/MiniTimeline";

interface PageProps {
  params: Promise<{ code: string }>;
}

const OFFICIAL_SOURCES: Partial<Record<CountryCode, { name: string; url: string }[]>> = {
  CL: [
    { name: "BCN — LeyChile", url: "https://www.bcn.cl/leychile" },
    { name: "Diario Oficial", url: "https://www.diariooficial.interior.gob.cl" },
  ],
  BR: [
    { name: "Planalto", url: "https://www.planalto.gov.br" },
    { name: "Senado Federal", url: "https://www25.senado.leg.br" },
  ],
  AR: [
    { name: "InfoLEG", url: "https://servicios.infoleg.gob.ar" },
    { name: "Boletín Oficial", url: "https://www.boletinoficial.gob.ar" },
  ],
  CO: [
    { name: "SUIN Juriscol", url: "https://www.suin-juriscol.gov.co" },
    { name: "Función Pública", url: "https://www.funcionpublica.gov.co" },
  ],
  MX: [
    { name: "DOF", url: "https://www.dof.gob.mx" },
    { name: "Cámara de Diputados", url: "https://www.diputados.gob.mx" },
  ],
  PE: [
    { name: "SPIJ", url: "https://spijlibre.minjus.gob.pe" },
    { name: "Congreso", url: "https://www.congreso.gob.pe" },
  ],
  UY: [{ name: "IMPO", url: "https://www.impo.com.uy" }],
};

export async function generateStaticParams() {
  return Object.keys(COUNTRIES).map((code) => ({ code: code.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const upper = code.toUpperCase() as CountryCode;
  const country = COUNTRIES[upper];
  if (!country) return { title: "País no encontrado" };
  return {
    title: country.name,
    description: `Regulación tecnológica en ${country.name}: leyes vigentes, proyectos en discusión y autoridades de aplicación.`,
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { code } = await params;
  const upper = code.toUpperCase() as CountryCode;
  const country = COUNTRIES[upper];
  if (!country) notFound();

  const all = await getIndex();
  const items = all.filter((r) => r.country === upper);

  const byArea = (Object.keys(AREAS) as (keyof typeof AREAS)[])
    .map((a) => ({
      key: a,
      meta: AREAS[a],
      count: items.filter((i) => i.areas.includes(a)).length,
    }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);

  const sources = OFFICIAL_SOURCES[upper];

  const byStatus = items.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container py-8">
      <header className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl" aria-hidden>
            {country.flag}
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-fg-muted">
              {country.region}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
              {country.name}
            </h1>
          </div>
        </div>
        <div className="ml-auto text-sm text-fg-muted">
          <strong className="text-fg">{items.length}</strong> ficha
          {items.length === 1 ? "" : "s"} curada
          {items.length === 1 ? "" : "s"}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3 mb-10">
        <Stat label="Por estado">
          <ul className="space-y-1 text-sm">
            {Object.entries(byStatus).map(([k, v]) => (
              <li key={k} className="flex justify-between">
                <span className="text-fg-muted capitalize">
                  {k.replace(/-/g, " ")}
                </span>
                <span className="font-medium">{v}</span>
              </li>
            ))}
          </ul>
        </Stat>
        <Stat label="Áreas cubiertas">
          <div className="flex flex-wrap gap-1.5">
            {byArea.map((a) => (
              <Link
                key={a.key}
                href={`/areas/${a.key}`}
                className="text-xs rounded-full border border-border bg-bg px-2 py-0.5 hover:border-accent/60"
              >
                {a.meta.short}
                <span className="text-fg-muted ml-1">{a.count}</span>
              </Link>
            ))}
          </div>
        </Stat>
        {sources && sources.length > 0 && (
          <Stat label="Fuentes oficiales">
            <ul className="space-y-1 text-sm">
              {sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    {s.name} <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </Stat>
        )}
      </div>

      {items.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl font-semibold mb-2">Línea temporal</h2>
          <div className="rounded-xl border border-border bg-bg-elevated/40 p-4">
            <MiniTimeline items={items} />
          </div>
        </section>
      )}

      <section>
        <h2 className="font-serif text-xl font-semibold mb-4">Regulaciones</h2>
        {items.length === 0 ? (
          <p className="text-sm text-fg-muted italic">
            Aún no hay fichas publicadas para {country.name}. ¿Quieres
            contribuir? Escríbenos.
          </p>
        ) : (
          <div className="border-t border-border">
            {items.map((r) => (
              <RegulationRow key={r.id} r={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-bg-elevated/40 p-4">
      <p className="text-[0.65rem] uppercase tracking-wider text-fg-muted font-medium mb-2">
        {label}
      </p>
      {children}
    </div>
  );
}
