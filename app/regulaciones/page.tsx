import type { Metadata } from "next";
import { Suspense } from "react";
import { getIndex } from "@/lib/index";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const metadata: Metadata = {
  title: "Regulaciones",
  description:
    "Catálogo completo de regulación tecnológica en América Latina. Filtra por país, área temática, estado y tipo normativo.",
};

export default async function RegulationsPage() {
  const data = await getIndex();
  return (
    <div className="container py-8">
      <header className="mb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
          Regulaciones
        </h1>
        <p className="mt-2 text-fg-muted max-w-2xl">
          Catálogo curado de regulación tecnológica vigente y en discusión en
          América Latina. Filtra por país, área, estado o tipo normativo.
        </p>
      </header>
      <Suspense fallback={<div className="text-sm text-fg-muted">Cargando catálogo…</div>}>
        <CatalogClient data={data} />
      </Suspense>
    </div>
  );
}
