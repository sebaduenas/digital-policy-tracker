import type { Metadata } from "next";
import Link from "next/link";
import { Github, Mail, ScrollText, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sobre el Digital Policy Tracker LATAM, su autor, propósito y forma de contribuir.",
};

export default function AboutPage() {
  return (
    <div className="container py-10 max-w-3xl">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wider text-accent font-medium mb-1.5">
          Sobre el proyecto
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          About
        </h1>
      </header>

      <article className="prose-ficha max-w-none">
        <h2>Qué es</h2>
        <p>
          El <strong>Digital Policy Tracker LATAM</strong> es una plataforma
          pública, curada e independiente que mapea la regulación de nuevas
          tecnologías en América Latina. Reúne en un solo lugar leyes,
          decretos, reglamentos y proyectos en discusión vinculados a
          inteligencia artificial, protección de datos, ciberseguridad,
          plataformas digitales, fintech, soberanía digital y telecomunicaciones,
          entre otras áreas.
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

        <h2>Quién está detrás</h2>
        <p>
          El proyecto es desarrollado y curado por{" "}
          <strong>Sebastián Dueñas Müller</strong>, abogado y académico
          chileno especializado en derecho digital y gobernanza tecnológica.
          Cada ficha lleva firma identificable y nivel de confianza declarado.
        </p>

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
          <Link href="/metodologia">Metodología</Link>) y se publica en formato
          MDX validado por esquema. Los datos están abiertos bajo licencia CC BY
          4.0 y el código bajo licencia MIT en un repositorio público.
        </p>

        <h2>Cómo contribuir</h2>
        <p>Existen varias formas de aportar:</p>
        <ul>
          <li>Reportar errores u omisiones en fichas existentes.</li>
          <li>Proponer nuevas regulaciones para indexar.</li>
          <li>Colaborar como editor invitado en jurisdicciones específicas.</li>
          <li>
            Citar el tracker en publicaciones académicas o profesionales (ver
            cita sugerida abajo).
          </li>
        </ul>

        <h2>Cómo citar</h2>
        <blockquote>
          Dueñas Müller, S. (2026). <em>Digital Policy Tracker LATAM</em>.
          https://policytracker.lat
        </blockquote>
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
          href="mailto:sebaduenas@gmail.com"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-elevated px-4 py-2 text-sm font-medium hover:border-accent/60 transition-colors"
        >
          <Mail className="h-4 w-4" />
          Contactar al editor
        </a>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-bg-elevated px-4 py-2 text-sm font-medium hover:border-accent/60 transition-colors"
        >
          <Github className="h-4 w-4" />
          Ver código
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
