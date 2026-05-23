import type { Metadata } from "next";
import Link from "next/link";
import { getIndex } from "@/lib/index";

export const metadata: Metadata = {
  title: "Tags",
  description:
    "Índice de etiquetas temáticas utilizadas en las fichas del tracker. Útil para navegar la regulación por concepto específico.",
};

export default async function TagsIndex() {
  const data = await getIndex();
  const counts: Record<string, number> = {};
  data.forEach((d) => d.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)));
  const tags = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = tags[0]?.[1] || 1;

  return (
    <div className="container py-8 max-w-4xl">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wider text-accent font-medium mb-1.5">
          Navegación por concepto
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
          Tags
        </h1>
        <p className="mt-2 text-fg-muted max-w-2xl">
          {tags.length} etiquetas en uso. El tamaño refleja la frecuencia en el
          catálogo.
        </p>
      </header>

      {tags.length === 0 ? (
        <p className="text-fg-muted italic">Aún no hay tags catalogados.</p>
      ) : (
        <div className="flex flex-wrap gap-2 items-baseline">
          {tags.map(([tag, count]) => {
            const scale = 0.85 + (count / max) * 0.9;
            return (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-baseline gap-1 rounded-full border border-border bg-bg-elevated px-3 py-1 hover:border-accent/60 hover:text-accent transition-all"
                style={{ fontSize: `${scale}rem` }}
              >
                <span>#{tag}</span>
                <span className="text-xs text-fg-muted">{count}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
