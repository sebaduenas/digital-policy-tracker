import type { Metadata } from "next";
import { Suspense } from "react";
import { loadRegulations } from "@/lib/content";
import { getIndex } from "@/lib/index";
import { CompareClient } from "@/components/compare/CompareClient";

export const metadata: Metadata = {
  title: "Comparador",
  description:
    "Compara hasta 4 regulaciones tecnológicas LATAM lado a lado con secciones equivalentes alineadas.",
};

export default async function ComparePage() {
  const [regulations, index] = await Promise.all([
    loadRegulations(),
    getIndex(),
  ]);
  return (
    <div className="container py-8">
      <header className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
          Comparador
        </h1>
        <p className="mt-2 text-fg-muted max-w-2xl">
          Visualiza hasta cuatro regulaciones lado a lado. Comparte el resultado
          con el enlace de la página.
        </p>
      </header>
      <Suspense fallback={<div className="text-sm text-fg-muted">Cargando…</div>}>
        <CompareClient index={index} regulations={regulations} />
      </Suspense>
    </div>
  );
}
