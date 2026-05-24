import type { Metadata } from "next";
import { getIndex } from "@/lib/index";
import { parseFilters } from "@/lib/filters";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const metadata: Metadata = {
  title: "Regulaciones",
  description:
    "Catálogo completo de regulación tecnológica en América Latina. Filtra por país, área temática, estado y tipo normativo.",
};

export default async function RegulationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [data, sp] = await Promise.all([getIndex(), searchParams]);
  const initialFilters = parseFilters({
    get: (k: string) => {
      const v = sp[k];
      return Array.isArray(v) ? (v[0] ?? null) : (v ?? null);
    },
  });
  return (
    <div className="container py-8">
      <header className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          Regulaciones
        </h1>
        <p className="mt-2 text-fg-muted max-w-2xl">
          Catálogo curado de regulación tecnológica vigente y en discusión en
          América Latina. Filtra por país, área, estado o tipo normativo.
        </p>
      </header>
      <CatalogClient data={data} initialFilters={initialFilters} />
    </div>
  );
}
