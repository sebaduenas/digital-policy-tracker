import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-24 text-center">
      <p className="font-display text-7xl font-semibold text-accent">404</p>
      <h1 className="font-display text-2xl font-semibold mt-4">
        Página no encontrada
      </h1>
      <p className="mt-2 text-fg-muted max-w-md mx-auto">
        Esta ruta no existe en el tracker. Verifica el enlace o vuelve al
        catálogo.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-accent text-accent-fg px-4 py-2 text-sm font-medium"
        >
          Volver al inicio
        </Link>
        <Link
          href="/regulaciones"
          className="inline-flex items-center rounded-md border border-border bg-bg-elevated px-4 py-2 text-sm font-medium"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  );
}
