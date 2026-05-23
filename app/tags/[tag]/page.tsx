import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getIndex } from "@/lib/index";
import { RegulationRow } from "@/components/cards/RegulationCard";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const data = await getIndex();
  const tags = new Set<string>();
  data.forEach((d) => d.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag: raw } = await params;
  const tag = decodeURIComponent(raw);
  return {
    title: `#${tag}`,
    description: `Regulaciones LATAM etiquetadas con #${tag}.`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag: raw } = await params;
  const tag = decodeURIComponent(raw);
  const data = await getIndex();
  const items = data.filter((d) => d.tags.includes(tag));
  if (!items.length) notFound();

  return (
    <div className="container py-8 max-w-4xl">
      <Link
        href="/tags"
        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg transition-colors mb-4"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Volver a tags
      </Link>
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider text-accent font-medium mb-1.5">
          Etiqueta
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          #{tag}
        </h1>
        <p className="mt-2 text-fg-muted">
          {items.length} ficha{items.length === 1 ? "" : "s"} con esta etiqueta
        </p>
      </header>
      <div className="border-t border-border">
        {items.map((r) => (
          <RegulationRow key={r.id} r={r} />
        ))}
      </div>
    </div>
  );
}
