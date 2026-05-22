import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
import { loadRegulations, getRegulationBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { AreaChip } from "@/components/ui/AreaChip";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { RegulationDetailSidebar } from "@/components/cards/RegulationDetailSidebar";
import { CitationButtons } from "@/components/cards/CitationButtons";
import {
  AREAS,
  COUNTRIES,
  type Area,
  type CountryCode,
} from "@/lib/taxonomy";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const all = await loadRegulations();
  return all.map((r) => ({ slug: r.slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const reg = await getRegulationBySlug(slug.join("/"));
  if (!reg) return { title: "No encontrada" };
  const country = COUNTRIES[reg.country as CountryCode];
  return {
    title: reg.shortTitle,
    description: reg.summary,
    openGraph: {
      title: `${reg.shortTitle} · ${country?.name}`,
      description: reg.summary,
      type: "article",
    },
  };
}

export default async function RegulationDetail({ params }: PageProps) {
  const { slug } = await params;
  const reg = await getRegulationBySlug(slug.join("/"));
  if (!reg) notFound();

  const html = renderMarkdown(reg.body);
  const country = COUNTRIES[reg.country as CountryCode];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    name: reg.officialTitle,
    alternateName: reg.shortTitle,
    legislationJurisdiction: country?.name,
    datePublished: reg.publicationDate,
    legislationLegalForce:
      reg.status === "vigente" ? "InForce" : "PartiallyInForce",
    url: reg.officialUrl,
    citation: reg.citation,
    inLanguage: "es",
    description: reg.summary,
  };

  return (
    <div className="container py-6">
      <Link
        href="/regulaciones"
        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg transition-colors mb-4"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Volver al catálogo
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <CountryFlag code={reg.country as CountryCode} />
            {(reg.areas as Area[]).map((a) => (
              <AreaChip key={a} area={a} />
            ))}
            <StatusBadge status={reg.status as Parameters<typeof StatusBadge>[0]["status"]} />
            {reg.hasCriticalAnalysis && (
              <span className="inline-flex items-center gap-1 text-xs text-accent">
                <Sparkles className="h-3 w-3" /> análisis crítico
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-balance leading-tight">
            {reg.officialTitle}
          </h1>
          {reg.aliases && reg.aliases.length > 0 && (
            <p className="mt-2 text-sm text-fg-muted">
              También conocida como: {reg.aliases.join(" · ")}
            </p>
          )}
          <p className="mt-3 text-xs text-fg-muted font-mono">{reg.citation}</p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 mb-8">
              <p className="text-[0.65rem] uppercase tracking-wider text-accent font-medium mb-1.5">
                Resumen
              </p>
              <p className="text-fg leading-relaxed">{reg.summary}</p>
            </div>

            {reg.keyProvisions && reg.keyProvisions.length > 0 && (
              <section className="mb-8">
                <h2 className="font-serif text-xl font-semibold mb-3">
                  Disposiciones clave
                </h2>
                <ul className="space-y-2">
                  {reg.keyProvisions.map((p, i) => (
                    <li key={i} className="flex gap-2 text-sm text-fg-muted">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-accent shrink-0" />
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {reg.penalties && (
              <section className="mb-8 rounded-lg border border-border bg-bg-elevated/50 p-4">
                <h2 className="text-xs uppercase tracking-wider text-fg-muted font-medium mb-1.5">
                  Régimen sancionatorio
                </h2>
                <p className="text-sm text-fg leading-relaxed">{reg.penalties}</p>
              </section>
            )}

            {reg.body && (
              <div
                className="prose-ficha max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}

            {reg.tags && reg.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs uppercase tracking-wider text-fg-muted mb-2">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {reg.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full bg-bg-elevated px-2 py-0.5 text-xs text-fg-muted border border-border"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <CitationButtons reg={reg} />
            </div>
          </div>

          <div className="lg:sticky lg:top-20 lg:self-start">
            <RegulationDetailSidebar reg={reg} />
          </div>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
