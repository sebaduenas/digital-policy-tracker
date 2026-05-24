import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getIndex } from "@/lib/index";
import { AREAS, COUNTRIES, type Area, type CountryCode } from "@/lib/taxonomy";
import { RegulationRow } from "@/components/cards/RegulationCard";
import { Flag } from "@/components/ui/Flag";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(AREAS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = AREAS[slug as Area];
  if (!area) return { title: "Área no encontrada" };
  return {
    title: area.name,
    description: area.description,
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = AREAS[slug as Area];
  if (!area) notFound();

  const all = await getIndex();
  const items = all.filter((r) => r.areas.includes(slug as Area));

  const byCountry = (Object.keys(COUNTRIES) as CountryCode[])
    .map((c) => ({
      code: c,
      ...COUNTRIES[c],
      count: items.filter((i) => i.country === c).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="container py-8">
      <header className="rounded-2xl border border-border bg-bg-elevated/40 p-6 sm:p-8 mb-8">
        <div>
          <p className="text-xs uppercase tracking-wider text-fg-muted">
            Área temática · {items.length} ficha{items.length === 1 ? "" : "s"}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-1">
            {area.name}
          </h1>
          <p className="mt-3 text-fg-muted max-w-3xl leading-relaxed">
            {area.description}
          </p>
        </div>
      </header>

      {byCountry.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4">
            Mapa de calor por país
          </h2>
          <div className="rounded-xl border border-border bg-bg-elevated/40 p-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {byCountry.map((c) => {
              return (
                <Link
                  key={c.code}
                  href={`/regulaciones?country=${c.code}&area=${slug}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-bg-elevated p-3 hover:border-accent/60 transition-all"
                >
                  <Flag code={c.code} size={22} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-fg-muted">
                      {c.count} ficha{c.count === 1 ? "" : "s"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-xl font-semibold mb-4">Regulaciones</h2>
        {items.length === 0 ? (
          <p className="text-sm text-fg-muted italic">
            Aún no hay fichas en esta área.
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
