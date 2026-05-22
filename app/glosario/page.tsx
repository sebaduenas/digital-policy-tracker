import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glosario",
  description:
    "Glosario curado de términos jurídicos y técnicos recurrentes en regulación tecnológica LATAM.",
};

interface Term {
  id: string;
  term: string;
  acronym?: string;
  category: "datos" | "ia" | "ciber" | "fintech" | "general";
  definition: string;
  source?: string;
}

const TERMS: Term[] = [
  {
    id: "rgpd",
    term: "Reglamento General de Protección de Datos",
    acronym: "RGPD / GDPR",
    category: "datos",
    definition:
      "Reglamento (UE) 2016/679 que armoniza la protección de datos personales en la Unión Europea. Es referencia obligada para la mayoría de regímenes LATAM modernos.",
  },
  {
    id: "lgpd",
    term: "Lei Geral de Proteção de Dados",
    acronym: "LGPD",
    category: "datos",
    definition:
      "Ley General de Protección de Datos Personales de Brasil (Lei 13.709/2018), inspirada en el RGPD.",
  },
  {
    id: "arco",
    term: "Derechos ARCO",
    acronym: "ARCO",
    category: "datos",
    definition:
      "Acrónimo de los derechos de Acceso, Rectificación, Cancelación y Oposición que reconocen los regímenes de protección de datos personales latinoamericanos.",
  },
  {
    id: "dpo",
    term: "Encargado de Protección de Datos",
    acronym: "DPO / DPD",
    category: "datos",
    definition:
      "Persona designada por el responsable o encargado del tratamiento para asesorar y supervisar el cumplimiento normativo en materia de datos personales.",
  },
  {
    id: "ai-act",
    term: "Reglamento de IA de la Unión Europea",
    acronym: "AI Act",
    category: "ia",
    definition:
      "Reglamento (UE) 2024/1689 que regula la inteligencia artificial mediante un enfoque basado en riesgos. Es la principal referencia internacional para proyectos LATAM.",
  },
  {
    id: "enfoque-riesgo",
    term: "Enfoque basado en riesgos",
    category: "ia",
    definition:
      "Marco regulatorio que clasifica sistemas de IA según el nivel de riesgo que representan para derechos fundamentales o seguridad, asignando obligaciones diferenciadas.",
  },
  {
    id: "alto-riesgo",
    term: "Sistemas de alto riesgo",
    category: "ia",
    definition:
      "Sistemas de IA con potencial impacto significativo en salud, seguridad o derechos fundamentales, sujetos a requisitos reforzados de transparencia, gobernanza de datos, supervisión humana y evaluación de conformidad.",
  },
  {
    id: "decisiones-automatizadas",
    term: "Decisiones individuales automatizadas",
    category: "ia",
    definition:
      "Decisiones tomadas exclusivamente por sistemas automatizados que producen efectos jurídicos o significativos sobre una persona. Suelen acompañarse de derechos específicos (información, explicación, intervención humana).",
  },
  {
    id: "csirt",
    term: "Equipo de Respuesta a Incidentes",
    acronym: "CSIRT / CERT",
    category: "ciber",
    definition:
      "Equipo técnico encargado de coordinar la respuesta a incidentes de ciberseguridad en una jurisdicción o sector. La mayoría de los países LATAM tienen CSIRT nacionales y sectoriales.",
  },
  {
    id: "oiv",
    term: "Operadores de Importancia Vital",
    acronym: "OIV",
    category: "ciber",
    definition:
      "Categoría regulatoria utilizada en algunas legislaciones (como la chilena 21.663) para designar a operadores cuya operación es crítica para la sociedad o la economía y que están sujetos a obligaciones reforzadas.",
  },
  {
    id: "open-finance",
    term: "Open Finance",
    category: "fintech",
    definition:
      "Modelo de interoperabilidad financiera que permite a los usuarios autorizar el intercambio de datos y operaciones entre instituciones financieras y proveedores autorizados. Extensión del open banking.",
  },
  {
    id: "sandbox",
    term: "Sandbox regulatorio",
    category: "fintech",
    definition:
      "Entorno controlado en el que innovadores prueban productos y servicios financieros con flexibilización temporal de ciertas obligaciones, bajo supervisión de la autoridad.",
  },
  {
    id: "nivel-adecuado",
    term: "Decisión de nivel adecuado",
    category: "datos",
    definition:
      "Decisión por la cual una autoridad reconoce que un tercer país ofrece un nivel de protección de datos esencialmente equivalente al propio, permitiendo transferencias internacionales sin garantías adicionales.",
  },
  {
    id: "ripd",
    term: "Evaluación de impacto en la protección de datos",
    acronym: "EIPD / RIPD / DPIA",
    category: "datos",
    definition:
      "Análisis previo de los riesgos que un tratamiento de datos puede generar para derechos de las personas. Obligatorio en supuestos específicos según cada régimen.",
  },
  {
    id: "habeas-data",
    term: "Hábeas data",
    category: "general",
    definition:
      "Acción constitucional, presente en varios ordenamientos LATAM, que protege el derecho de las personas a acceder, rectificar y cancelar sus datos personales registrados en bancos públicos o privados.",
  },
];

const CATEGORY_LABELS: Record<Term["category"], string> = {
  datos: "Datos personales",
  ia: "Inteligencia artificial",
  ciber: "Ciberseguridad",
  fintech: "Fintech",
  general: "General",
};

export default function GlossaryPage() {
  const groups = Object.keys(CATEGORY_LABELS) as Term["category"][];
  return (
    <div className="container py-10 max-w-3xl">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-wider text-accent font-medium mb-1.5">
          Definiciones canónicas
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">
          Glosario
        </h1>
        <p className="mt-3 text-fg-muted leading-relaxed">
          Términos jurídicos y técnicos recurrentes en regulación tecnológica
          LATAM. Cada definición es deliberadamente breve.
        </p>
      </header>

      <div className="space-y-10">
        {groups.map((g) => {
          const items = TERMS.filter((t) => t.category === g);
          if (!items.length) return null;
          return (
            <section key={g}>
              <h2 className="font-serif text-xl font-semibold mb-4">
                {CATEGORY_LABELS[g]}
              </h2>
              <dl className="space-y-4">
                {items.map((t) => (
                  <div
                    key={t.id}
                    id={t.id}
                    className="rounded-lg border border-border bg-bg-elevated/40 p-4"
                  >
                    <dt className="font-medium">
                      {t.term}
                      {t.acronym && (
                        <span className="ml-2 text-xs text-fg-muted font-mono">
                          ({t.acronym})
                        </span>
                      )}
                    </dt>
                    <dd className="mt-1.5 text-sm text-fg-muted leading-relaxed">
                      {t.definition}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>
    </div>
  );
}
