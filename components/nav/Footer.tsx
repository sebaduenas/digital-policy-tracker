import Link from "next/link";
import { Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-bg-elevated/40">
      <div className="container py-10 grid gap-8 md:grid-cols-4 text-sm">
        <div className="md:col-span-2">
          <p className="font-serif text-lg font-semibold">
            Digital Policy Tracker LATAM
          </p>
          <p className="mt-2 text-fg-muted max-w-md leading-relaxed">
            Mapa interactivo y curado de la regulación de nuevas tecnologías en
            América Latina. Curaduría académica firmada, datos abiertos,
            visualizaciones comparadas.
          </p>
          <p className="mt-3 text-xs text-fg-muted">
            Contenido bajo licencia{" "}
            <a
              className="underline hover:text-fg"
              href="https://creativecommons.org/licenses/by/4.0/"
            >
              CC BY 4.0
            </a>
            . Código bajo MIT.
          </p>
        </div>
        <nav className="flex flex-col gap-1.5 text-fg-muted">
          <p className="text-xs uppercase tracking-wider text-fg font-medium mb-2">
            Explorar
          </p>
          <Link className="hover:text-fg" href="/regulaciones">
            Regulaciones
          </Link>
          <Link className="hover:text-fg" href="/paises">
            Países
          </Link>
          <Link className="hover:text-fg" href="/areas">
            Áreas
          </Link>
          <Link className="hover:text-fg" href="/comparar">
            Comparador
          </Link>
          <Link className="hover:text-fg" href="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-fg" href="/tags">
            Tags
          </Link>
        </nav>
        <nav className="flex flex-col gap-1.5 text-fg-muted">
          <p className="text-xs uppercase tracking-wider text-fg font-medium mb-2">
            Proyecto
          </p>
          <Link className="hover:text-fg" href="/metodologia">
            Metodología
          </Link>
          <Link className="hover:text-fg" href="/glosario">
            Glosario
          </Link>
          <Link className="hover:text-fg" href="/about">
            About
          </Link>
          <a
            className="hover:text-fg inline-flex items-center gap-1"
            href="https://github.com/"
          >
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
          <a
            className="hover:text-fg inline-flex items-center gap-1"
            href="mailto:sebastian.duenas@uc.cl"
          >
            <Mail className="h-3.5 w-3.5" /> Contacto
          </a>
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="container py-4 text-xs text-fg-muted flex flex-wrap justify-between items-center gap-2">
          <span>
            © {new Date().getFullYear()} Sebastián Dueñas Müller. Curaduría
            académica.
          </span>
          <span>
            Este sitio no constituye asesoría legal. Verifica siempre las
            fuentes oficiales.
          </span>
        </div>
      </div>
    </footer>
  );
}
