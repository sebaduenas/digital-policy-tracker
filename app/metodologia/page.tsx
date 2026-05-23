import type { Metadata } from "next";
import { AREAS, COUNTRIES } from "@/lib/taxonomy";

export const metadata: Metadata = {
  title: "Metodología",
  description:
    "Criterios de inclusión, taxonomía, fuentes oficiales y política editorial del Digital Policy Tracker LATAM.",
};

export default function MetodologiaPage() {
  return (
    <div className="container py-10 max-w-3xl">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wider text-accent font-medium mb-1.5">
          Documentación editorial
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Metodología
        </h1>
        <p className="mt-3 text-fg-muted leading-relaxed">
          Este documento explica cómo construimos y mantenemos el catálogo:
          criterios de inclusión, taxonomía, fuentes oficiales, política
          editorial, niveles de confianza y manejo de errores.
        </p>
      </header>

      <article className="prose-ficha max-w-none">
        <h2>1. Criterios de inclusión</h2>
        <p>
          Indexamos normativa con jerarquía de ley, decreto o reglamento que
          regule materia tecnológica con impacto en derechos o mercado.
          Adicionalmente, incluimos proyectos de ley con ingreso formal y
          movimiento legislativo verificable en los últimos veinticuatro meses.
        </p>
        <p>
          Estándares técnicos solo se incluyen si tienen efecto obligatorio o
          han sido referenciados por norma oficial. Reglamentación
          administrativa (resoluciones, circulares) se incluye cuando proviene
          de la autoridad de aplicación principal.
        </p>

        <h2>2. Criterios de exclusión</h2>
        <ul>
          <li>Anteproyectos sin ingreso formal en el órgano legislativo.</li>
          <li>
            Doctrina o jurisprudencia (se referencian como fuentes
            secundarias dentro de cada ficha).
          </li>
          <li>
            Normativa derogada anterior a 2010, salvo relevancia histórica
            documentada.
          </li>
        </ul>

        <h2>3. Taxonomía</h2>
        <p>
          Cada regulación se etiqueta con una o más áreas temáticas. Definimos{" "}
          {Object.keys(AREAS).length} áreas canónicas que cubren el grueso de la
          regulación tecnológica contemporánea:
        </p>
        <ul>
          {Object.values(AREAS).map((a) => (
            <li key={a.name}>
              <strong>{a.name}</strong>: {a.description}
            </li>
          ))}
        </ul>

        <h2>4. Cobertura geográfica</h2>
        <p>
          Cubrimos {Object.keys(COUNTRIES).length} jurisdicciones LATAM. La
          profundidad de cobertura varía según la madurez del ecosistema
          regulatorio nacional y la disponibilidad de fuentes oficiales
          digitalizadas. Priorizamos en MVP: Chile, Brasil, Argentina, México,
          Colombia y Perú.
        </p>

        <h2>5. Fuentes oficiales</h2>
        <p>
          Cada ficha cita su fuente oficial primaria (texto consolidado o
          versión publicada en el órgano oficial del Estado correspondiente).
          Las fuentes secundarias (doctrina, prensa especializada, jurisprudencia)
          se referencian de forma adicional cuando aportan contexto sustantivo.
        </p>

        <h2>6. Política editorial</h2>
        <ul>
          <li>Cada ficha tiene un curador identificable.</li>
          <li>Conflictos de interés se declaran en la sección de cada ficha.</li>
          <li>
            Los cambios sustantivos se versionan según semver de la ficha.
          </li>
          <li>
            Los errores reportados se atienden en plazos de 7 días hábiles para
            confirmación y 30 días para corrección.
          </li>
        </ul>

        <h2>7. Niveles de confianza</h2>
        <p>
          Cada ficha declara explícitamente su nivel de confianza:
        </p>
        <ul>
          <li>
            <strong>Alto</strong>: revisión por el editor principal, validación
            cruzada con doctrina o jurisprudencia y verificación reciente de la
            URL oficial.
          </li>
          <li>
            <strong>Medio</strong>: revisión por el editor principal y
            validación con al menos una fuente secundaria.
          </li>
          <li>
            <strong>Bajo</strong>: ficha preliminar pendiente de revisión más
            exhaustiva.
          </li>
        </ul>

        <h2>8. Licencias</h2>
        <p>
          El contenido editorial (resúmenes, análisis editoriales, taxonomía) se
          publica bajo licencia <strong>Creative Commons BY 4.0</strong>. El
          código fuente de la plataforma se publica bajo licencia{" "}
          <strong>MIT</strong>. Los textos oficiales mantienen su licencia de
          origen.
        </p>

        <h2>9. Limitaciones</h2>
        <p>
          Este tracker no constituye asesoría legal. La información publicada
          puede no estar actualizada respecto a modificaciones recientes. Los
          usuarios deben verificar siempre la versión vigente en la fuente
          oficial correspondiente.
        </p>

        <h2>10. Cómo contribuir</h2>
        <p>
          Aceptamos contribuciones externas mediante pull request en el
          repositorio público. Las fichas propuestas son revisadas por el editor
          principal antes de su publicación. Para errores, sugerencias o
          colaboración como editor invitado, escríbenos.
        </p>
      </article>
    </div>
  );
}
