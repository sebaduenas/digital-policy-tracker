import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ScrollText } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sobre el Digital Policy Tracker LATAM, su propósito y forma de contribuir.",
};

export default function AboutPage() {
  return (
    <div className="container py-10 max-w-3xl">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wider text-accent font-medium mb-1.5">
          Sobre el proyecto
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          About
        </h1>
      </header>

      <article className="prose-ficha max-w-none">
        <h2>Qué es</h2>
        <p>
          El <strong>Digital Policy Tracker LATAM</strong> es una plataforma
          pública que mapea la regulación de nuevas tecnologías en América
          Latina. Reúne en un solo lugar leyes, decretos, reglamentos y
          proyectos en discusión vinculados a inteligencia artificial,
          protección de datos, ciberseguridad, plataformas digitales, fintech,
          soberanía digital y telecomunicaciones, entre otras áreas.
        </p>

        <h2>Para quién</h2>
        <ul>
          <li>
            <strong>Investigadores y académicos</strong> que comparan normativa
            entre jurisdicciones.
          </li>
          <li>
            <strong>Abogados, asesores y compliance officers</strong> que
            necesitan referencias rápidas y verificables.
          </li>
          <li>
            <strong>Policy makers</strong> que buscan contexto comparado al
            diseñar política pública.
          </li>
          <li>
            <strong>Periodistas y estudiantes</strong> que necesitan
            visualizaciones, citas y contexto.
          </li>
        </ul>

        <h2>Por qué</h2>
        <p>
          La regulación tecnológica en América Latina se ha intensificado en la
          última década, pero la información está dispersa entre boletines
          oficiales, repositorios institucionales y bases de datos sectoriales.
          Bases globales como las de IAPP, OCDE o Stanford ofrecen excelente
          cobertura, pero rara vez profundizan en la realidad regional. Este
          proyecto cubre ese vacío con una mirada comparada, accesible y
          rigurosa.
        </p>

        <h2>Cómo se construye</h2>
        <p>
          Cada ficha sigue una metodología documentada (ver{" "}
          <Link href="/metodologia">Metodología</Link>) y se publica con
          referencias verificables a las fuentes oficiales. El contenido
          editorial se publica bajo licencia Creative Commons Attribution 4.0.
        </p>

        <h2>Cómo contribuir</h2>
        <p>Existen varias formas de aportar:</p>
        <ul>
          <li>Reportar errores u omisiones en fichas existentes.</li>
          <li>Proponer nuevas regulaciones para indexar.</li>
          <li>Colaborar como editor invitado en jurisdicciones específicas.</li>
        </ul>
        <p>
          Para cualquiera de estas vías, escríbenos al correo de contacto.
        </p>
      </article>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/metodologia"
          className="inline-flex items-center gap-2 rounded-md bg-accent text-accent-fg px-4 py-2 text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <ScrollText className="h-4 w-4" />
          Leer metodología
        </Link>
        <a
          href="mailto:contacto@policytracker.lat"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-elevated px-4 py-2 text-sm font-medium hover:border-accent/60 transition-colors"
        >
          <Mail className="h-4 w-4" />
          Contacto
        </a>
      </div>
    </div>
  );
}
