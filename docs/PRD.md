# PRD: Digital Policy & Legislation Tracker LATAM

**Autor:** Sebastián Dueñas Müller
**Versión:** 1.0
**Fecha:** Mayo 2026
**Estado:** Draft listo para implementación con Claude Code
**Repositorio sugerido:** `legistracker-latam` (público, MIT)
**Dominio sugerido:** `legistracker.lat` o `policytracker.lat` (alternativa: subdominio bajo `sduenas.cl`)

---

## 1. Resumen Ejecutivo

**Producto:** Plataforma web pública, interactiva y curada que rastrea legislación, proyectos de ley y regulación administrativa en materia de nuevas tecnologías en América Latina (Inteligencia Artificial, Protección de Datos Personales, Ciberseguridad, Plataformas Digitales, Propiedad Intelectual, Fintech, Soberanía Digital, Telecomunicaciones e Infraestructura Crítica).

**Propósito doble:**
1. **Pieza de portafolio académico** que demuestra capacidad de investigación comparada, dominio técnico (Next.js, Vercel, ETL) y diseño de productos digitales.
2. **Utilidad pública** para investigadores, abogados, policy makers y periodistas que necesitan un mapa accionable de la regulación tecnológica regional.

**Diferenciador:** A diferencia de bases tipo IAPP, OECD AI Observatory o Stanford CRCL, este tracker se enfoca exclusivamente en LATAM, ofrece curaduría académica con notas críticas firmadas, taxonomía propia y visualizaciones interactivas optimizadas para análisis comparado.

**Stack resumen:** Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui + MDX para contenido + Vercel + GitHub Actions para validación.

---

## 2. Objetivos y Métricas de Éxito

### 2.1 Objetivos del producto
- **O1:** Ofrecer una vista única, filtrable y consultable de la regulación tecnológica en al menos 8 jurisdicciones LATAM.
- **O2:** Permitir comparar regulación equivalente entre 2 a 4 países simultáneamente.
- **O3:** Posicionar al autor como referente regional en gobernanza digital y soberanía tecnológica.
- **O4:** Servir como infraestructura de investigación reutilizable para futuros papers y policy briefs.

### 2.2 KPIs
| KPI | Meta a 6 meses |
|---|---|
| Regulaciones indexadas | ≥ 150 fichas curadas |
| Países cubiertos | ≥ 10 (Chile, Argentina, Brasil, Colombia, México, Perú, Uruguay, Costa Rica, Ecuador, Paraguay) |
| Áreas temáticas | ≥ 8 |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Tiempo de carga (LCP) | < 2.0 s en 4G |
| Visitas mensuales | ≥ 2.000 únicas |
| Backlinks académicos | ≥ 10 (papers, columnas, syllabi) |
| Citas en redes profesionales | tracking via LinkedIn/Google Scholar alerts |

### 2.3 No-objetivos (lo que NO es)
- No es un servicio legal ni reemplaza asesoría profesional.
- No es exhaustivo en derecho infralegal por cada país (se prioriza calidad sobre cantidad).
- No incluye, en v1, alertas por email ni área de usuarios autenticados.
- No realiza scraping en vivo de fuentes oficiales en MVP (ver Fase 3).

---

## 3. Audiencia Objetivo

### 3.1 Personas
- **Persona 1: Investigadora académica LATAM.** Necesita comparar normativa de protección de datos entre 4 países para un capítulo de libro. Tiempo escaso, requiere fuentes citables.
- **Persona 2: Asesor legislativo en Chile.** Está preparando una indicación a un proyecto de IA y quiere antecedentes comparados rápidos.
- **Persona 3: Compliance officer en multinacional.** Necesita un dashboard ejecutivo de obligaciones por país.
- **Persona 4: Periodista tecnológico.** Busca contexto regulatorio para una nota; requiere visualizaciones embebibles.
- **Persona 5: Estudiante de magíster.** Llega por buscador, explora por país o por tema y descarga la cita en formato APA.

### 3.2 Idiomas
- **v1:** Español (interfaz y contenido).
- **v2:** Inglés (interfaz, resúmenes y metadata; los textos originales se mantienen en su idioma fuente: portugués para Brasil, español para el resto).
- **v3:** Portugués (interfaz).

---

## 4. Análisis Competitivo (referencias para inspirarse)

| Referencia | Qué tomar | Qué evitar |
|---|---|---|
| OECD.AI Observatory | Sistema de tags, claridad de fichas, downloads citables | UX denso, poco filtrado interactivo |
| Stanford HAI AI Index | Diseño tipográfico, narrativa con datos | Muy USA-céntrico, poca interactividad real |
| IAPP Global Privacy Tracker | Mapa interactivo, comparador | Paywall, sin LATAM en profundidad |
| GDPRHub | Modelo MDX-friendly, comunitario | Diseño funcional pero plano |
| LawAtlas (Temple Univ) | Visualizaciones de variables jurídicas | Curva de aprendizaje alta |
| OpenSanctions | Datos como producto, API pública | Estética muy técnica |

**Insight:** La oportunidad está en combinar el rigor de OECD.AI, la estética de Stanford HAI y la interactividad de IAPP, pero acotado a LATAM y con curaduría académica firmada.

---

## 5. Alcance MVP vs Roadmap

### 5.1 MVP (Fase 1, semanas 1 a 4)
- Catálogo navegable de ~50 regulaciones en 6 países (Chile, Argentina, Brasil, Colombia, México, Perú).
- Filtros: país, área, estado, tipo normativo, año.
- Búsqueda full-text en título, resumen y tags.
- Vista lista + vista grid (cards).
- Página de detalle por regulación con sidebar de metadata.
- Página por país y por área (agregadores SEO).
- Tema claro/oscuro.
- Responsive mobile-first.

### 5.2 Fase 2 (semanas 5 a 8)
- Comparador lado a lado de 2 a 4 regulaciones.
- Dashboard analítico (mapa coroplético LATAM, treemap por área, timeline temporal).
- 100 regulaciones adicionales (10 países).
- Export de fichas en BibTeX, RIS y APA.
- RSS feed por país y por área.

### 5.3 Fase 3 (mes 3 en adelante)
- Sistema de alertas por email (Resend + cron Vercel).
- API pública REST/GraphQL con rate limiting.
- Scraping semi-automatizado de boletines oficiales (workflow nocturno, revisión humana).
- Inglés y portugués.
- Modo "policy brief generator" con AI (Claude API en artifacts), conexión a tu skill de extracción de jurisprudencia.

---

## 6. User Stories Priorizadas

| ID | Como... | Quiero... | Para... | Prioridad |
|---|---|---|---|---|
| US01 | Investigador | filtrar por país y área simultáneamente | encontrar normas comparables | P0 |
| US02 | Usuario nuevo | ver una landing clara con buscador prominente | entender qué hace el sitio en 5 s | P0 |
| US03 | Investigador | abrir el detalle y copiar la cita en APA | citar en mi paper | P0 |
| US04 | Visitante | navegar desde móvil sin fricción | revisar en transporte | P0 |
| US05 | Compliance | descargar una ficha en PDF | adjuntar a un informe | P1 |
| US06 | Periodista | embeber un gráfico en una nota | ilustrar mi artículo | P1 |
| US07 | Académico | comparar 3 leyes de PDP lado a lado | armar tabla comparativa | P1 |
| US08 | Visitante | ver un mapa con la "temperatura regulatoria" | obtener visión panorámica | P1 |
| US09 | Suscriptor | recibir alertas cuando cambia el estado de un proyecto | seguir un trámite legislativo | P2 |
| US10 | Desarrollador | acceder a la data vía API JSON | construir mi propio análisis | P2 |

---

## 7. Requisitos Funcionales

### 7.1 Sistema de Filtros (combinables, persistentes en URL)
- **Filtro por país:** multiselect con bandera + nombre. Países en MVP: Chile, Argentina, Brasil, Colombia, México, Perú. Luego: Uruguay, Costa Rica, Ecuador, Paraguay, Bolivia, Venezuela, República Dominicana, Panamá, Guatemala.
- **Filtro por área temática:** multiselect con icono y color. Lista canónica:
  1. Inteligencia Artificial
  2. Protección de Datos Personales
  3. Ciberseguridad
  4. Propiedad Intelectual Digital
  5. Plataformas Digitales y Mercados
  6. Fintech y Cripto Activos
  7. Telecomunicaciones e Infraestructura
  8. Soberanía Digital y Transferencia Internacional
  9. Identidad Digital y Gobierno Electrónico
  10. Menores y Contenidos en Línea
- **Filtro por estado:** Vigente, En vigor diferida, Proyecto en discusión, Aprobado pendiente de promulgación, Derogado, Veto pendiente, Reglamento pendiente.
- **Filtro por tipo normativo:** Ley, Decreto con fuerza de ley, Decreto supremo, Reglamento, Circular, Resolución exenta, Instrucción, Norma técnica, Estándar, Constitución, Tratado internacional, Proyecto de ley, Proyecto de reglamento.
- **Filtro por año** (rango): por año de publicación o de ingreso a tramitación.
- **Filtro por rama de derecho:** público, privado, mixto, administrativo, penal, internacional.
- **Filtro por autoridad de aplicación:** ANPD, Agencia de Protección de Datos, CNIL equivalente, Subsecretaría, etc.

**Comportamiento:**
- Filtros sincronizados con query params (`?country=cl,br&area=ai,pdp&status=vigente`).
- Botón "Limpiar filtros".
- Contador de resultados visible.
- Persistencia en localStorage para "última búsqueda".

### 7.2 Búsqueda
- Input prominente en header.
- Tipo: full-text fuzzy sobre título, alias, resumen, tags, autoridad.
- Implementación MVP: Fuse.js en cliente sobre JSON estático.
- Implementación v2: Pagefind o Algolia DocSearch (free para OSS).
- Shortcut: Cmd/Ctrl + K abre command palette.

### 7.3 Vistas
- **Vista lista (default):** filas densas con título, país (bandera), área, estado (badge), año, link.
- **Vista grid (cards):** card 3 columnas en desktop, 1 en mobile, con thumbnail temático.
- **Vista tabla (modo analista):** sortable, columnas configurables, exportable a CSV.
- **Vista timeline:** eje horizontal por año, filtrable, agrupable por país.
- **Vista mapa LATAM:** coropleta con cantidad de regulaciones por país, click abre lista filtrada.
- **Vista dashboard:** KPIs + treemap por área + barras apiladas por estado + heatmap país x área.

### 7.4 Página de Detalle de Regulación
**Layout:**
- Header: título oficial + alias + country chip + área chips + status badge.
- Sidebar derecho sticky con metadata estructurada (ver modelo de datos).
- Cuerpo MDX con secciones canónicas:
  1. Resumen ejecutivo (3 a 5 párrafos).
  2. Estructura de la norma (índice de títulos).
  3. Disposiciones clave (lista anotada).
  4. Autoridades de aplicación y sanciones.
  5. Estado de tramitación / vigencia diferida.
  6. Análisis crítico (sección firmada por el editor académico).
  7. Comparación regional rápida (opcional, link al comparador).
  8. Recursos: PDF oficial, boletín, prensa, doctrina relevante.
- Footer de la ficha: botones "Copiar cita APA", "Exportar BibTeX", "Compartir LinkedIn/X", "Reportar error".

### 7.5 Comparador (Fase 2)
- Selección de 2 a 4 regulaciones desde checkbox en lista.
- Vista columnas paralelas con secciones equivalentes alineadas.
- Toggle "mostrar solo diferencias" usando diffing semántico simple.
- Compartible vía URL (`/comparar?ids=ar-25326,br-13709,cl-21719`).

### 7.6 Página de país
- Hero con bandera, nombre, breve descripción regulatoria.
- Indicadores: número de leyes vigentes por área, último cambio relevante.
- Cards de "regulaciones destacadas".
- Timeline del país.
- Links a fuentes oficiales del país.

### 7.7 Página de área temática
- Hero con icono y nombre.
- Definición curatorial del área y sus límites.
- Mapa de calor LATAM.
- Top 10 regulaciones.
- Glosario corto (5 a 10 términos).

### 7.8 Glosario
- Página `/glosario` con términos definidos una sola vez y reutilizables vía componente `<Term id="lgpd" />`.

### 7.9 About y metodología
- Página `/metodologia`: criterios de inclusión, taxonomía, fuentes, política de actualización, declaración de conflictos de interés, equipo editorial.
- Página `/about`: bio del autor, propósito del proyecto, cómo contribuir.

---

## 8. Requisitos No Funcionales

- **Performance:** SSG por defecto, ISR para páginas de detalle con `revalidate` semanal. LCP < 2.0 s, CLS < 0.1, INP < 200 ms.
- **Accesibilidad:** WCAG 2.2 AA. Foco visible, contraste AAA en texto, navegación por teclado, ARIA labels, alt en imágenes.
- **SEO:** sitemap.xml dinámico, robots.txt, Open Graph, JSON-LD `LegalDocument` schema, canonical URLs, breadcrumbs.
- **Internacionalización:** estructura preparada para i18n desde el inicio aunque MVP sea solo en español (rutas `/(es)` reservadas).
- **Responsive:** mobile first, breakpoints sm 640, md 768, lg 1024, xl 1280.
- **Privacidad:** sin cookies de tracking en MVP. Analytics con Vercel Analytics y Plausible (sin cookies). Banner de privacidad mínimo.
- **Licencia del contenido:** CC BY 4.0 para fichas curadas; texto oficial mantiene su licencia de origen.
- **Licencia del código:** MIT.

---

## 9. Modelo de Datos

### 9.1 Esquema canónico (TypeScript)

```ts
// content/types.ts
export type CountryCode =
  | 'AR' | 'BO' | 'BR' | 'CL' | 'CO' | 'CR' | 'DO' | 'EC'
  | 'GT' | 'MX' | 'PA' | 'PE' | 'PY' | 'SV' | 'UY' | 'VE';

export type Area =
  | 'ia' | 'pdp' | 'ciberseguridad' | 'propiedad-intelectual'
  | 'plataformas' | 'fintech' | 'telecom' | 'soberania'
  | 'identidad-digital' | 'menores-online';

export type Status =
  | 'vigente' | 'vigencia-diferida' | 'proyecto-en-discusion'
  | 'aprobado-pendiente-promulgacion' | 'derogado'
  | 'veto-pendiente' | 'reglamento-pendiente';

export type NormType =
  | 'ley' | 'dfl' | 'decreto-supremo' | 'reglamento'
  | 'circular' | 'resolucion-exenta' | 'instruccion'
  | 'norma-tecnica' | 'estandar' | 'constitucion'
  | 'tratado-internacional' | 'proyecto-ley' | 'proyecto-reglamento';

export interface Regulation {
  // Identificación
  id: string;                        // ej. "cl-21719"
  slug: string;                      // ej. "cl/ley-21719-proteccion-datos-personales"
  officialTitle: string;             // Título oficial completo
  shortTitle: string;                // Alias usable
  aliases?: string[];                // Otros nombres comunes
  citation: string;                  // Cita canónica para mostrar

  // Clasificación
  country: CountryCode;
  areas: Area[];                     // Multi-área
  status: Status;
  normType: NormType;
  branches: ('publico' | 'privado' | 'administrativo' | 'penal' | 'internacional')[];

  // Fechas
  publicationDate?: string;          // ISO 8601 YYYY-MM-DD
  effectiveDate?: string;
  introductionDate?: string;         // para proyectos
  lastStatusChange?: string;

  // Tramitación (para proyectos)
  legislativeFile?: {
    boletinNumber?: string;          // ej. "16.821-19" Chile
    chamberOfOrigin?: string;
    currentStage?: string;
    url?: string;
  };

  // Autoridad
  enforcingAuthority?: string[];     // ej. ["Agencia de Protección de Datos Personales (Chile)"]
  applicationScope?: string;         // ámbito territorial / material

  // Contenido
  summary: string;                   // 2 a 4 frases
  keyProvisions?: string[];          // bullets clave
  penalties?: string;                // texto corto
  tags: string[];

  // Vínculos
  officialUrl: string;
  pdfUrl?: string;
  relatedRegulations?: string[];     // ids
  supersedes?: string[];             // ids derogados
  supersededBy?: string;             // id que la deroga
  implementsTreaty?: string[];

  // Metadatos editoriales
  editor: string;                    // nombre del curador
  editorOrcid?: string;
  lastUpdated: string;               // ISO datetime
  version: string;                   // semver para la ficha (1.0.0)
  sources: Source[];
  confidenceLevel: 'alto' | 'medio' | 'bajo';

  // Análisis (opcional, MDX)
  hasCriticalAnalysis: boolean;
}

export interface Source {
  type: 'oficial' | 'doctrina' | 'prensa' | 'jurisprudencia';
  title: string;
  author?: string;
  url: string;
  accessedOn: string;
}
```

### 9.2 Almacenamiento
- **MVP:** cada regulación es un archivo `.mdx` en `content/regulations/{country}/{slug}.mdx` con frontmatter YAML que mapea al schema.
- **Validación:** Zod schema valida frontmatter en build time. Si una ficha es inválida, el build falla.
- **Indexación:** script `scripts/build-index.ts` genera `public/data/index.json` con todas las fichas para alimentar filtros y búsqueda cliente.
- **v2:** migración opcional a base de datos (Turso/libSQL o Supabase) cuando se incorporen alertas y usuarios.

### 9.3 Ejemplo de ficha (frontmatter)

```yaml
---
id: cl-21719
slug: cl/ley-21719-proteccion-datos-personales
officialTitle: "Ley N° 21.719 que regula la protección y el tratamiento de los datos personales y crea la Agencia de Protección de Datos Personales"
shortTitle: "Ley 21.719 (Chile)"
citation: "Ley N° 21.719, D.O. 13.12.2024 (Chile)"
country: CL
areas: [pdp]
status: vigencia-diferida
normType: ley
branches: [publico, administrativo]
publicationDate: 2024-12-13
effectiveDate: 2026-12-01
enforcingAuthority:
  - Agencia de Protección de Datos Personales
summary: "Reforma estructural del régimen chileno de protección de datos personales, alineada con estándares OCDE y con elementos inspirados en el RGPD. Crea una agencia autónoma de fiscalización."
keyProvisions:
  - "Crea la Agencia de Protección de Datos Personales como organismo autónomo."
  - "Introduce categorías de datos sensibles y datos personales relativos a infracciones."
  - "Establece bases de licitud expresas, incluyendo interés legítimo."
  - "Régimen sancionatorio escalonado por gravedad."
  - "Reconoce derechos ARCO y derechos asociados a decisiones automatizadas."
officialUrl: https://www.bcn.cl/leychile/navegar?idNorma=...
tags: [datos-personales, agencia, sanciones, transferencia-internacional, anonimizacion]
editor: Sebastián Dueñas Müller
editorOrcid: 0000-0000-0000-0000
lastUpdated: 2026-05-15T10:00:00Z
version: 1.2.0
confidenceLevel: alto
hasCriticalAnalysis: true
sources:
  - type: oficial
    title: "Texto oficial Ley 21.719"
    url: https://www.bcn.cl/leychile/navegar?idNorma=...
    accessedOn: 2026-05-15
---
```

---

## 10. Stack Tecnológico (decisiones justificadas)

### 10.1 Decisiones
| Capa | Elección | Justificación | Alternativa descartada |
|---|---|---|---|
| Framework | **Next.js 15 App Router** | SSG + ISR nativos, óptimo SEO, integración Vercel | Astro (excelente pero menos ecosistema de UI), Remix |
| Lenguaje | **TypeScript estricto** | Robustez en modelo de datos jurídicos | JS plano |
| Estilos | **Tailwind v4 + shadcn/ui** | Velocidad de prototipado, accesibilidad por defecto | CSS modules, Chakra |
| Contenido | **MDX + Contentlayer/Velite** | Mezcla markdown + componentes React, tipado fuerte | Sanity, Notion API |
| Validación | **Zod** | Validación runtime + types | Yup |
| Búsqueda | **Fuse.js (MVP), Pagefind (v2)** | Cero costo, cliente | Algolia (excelente pero requiere cuenta) |
| Gráficos | **Recharts + visx (mapa)** | React-friendly, accesibles | D3 puro (más control, más tiempo) |
| Mapa coroplético LATAM | **react-simple-maps + topojson de LATAM** | Liviano, control fino | Leaflet (overkill para coroplético) |
| Animaciones | **Framer Motion** | Microinteracciones polish | CSS puro |
| Iconos | **Lucide** | Consistente con shadcn, abierto | Heroicons |
| Tipografía | **Inter + Source Serif 4** (Sebastián ya usa esta combinación) | Identidad consistente con su trabajo en UC | DM Sans alternativa |
| Analytics | **Vercel Analytics + Plausible** | Sin cookies, GDPR/LPDC friendly | GA4 |
| Forms (reportar error) | **Resend + React Email + Vercel Functions** | Stack moderno, gratuito en tier inicial | Formspree |
| Testing | **Vitest + Playwright** | Rapidez en unit, E2E real | Jest + Cypress |
| Linting | **Biome** | Más rápido que ESLint+Prettier | ESLint + Prettier |
| CI | **GitHub Actions** | Integración con Vercel preview deploys | CircleCI |
| Hosting | **Vercel (Hobby tier)** | Cero fricción Next, edge nativo, preview por PR | Cloudflare Pages |
| Repo | **GitHub público** | Visibilidad académica, contribuciones | GitLab |

### 10.2 Dependencias principales (package.json esperado)
```json
{
  "next": "15.x",
  "react": "19.x",
  "typescript": "^5.5",
  "tailwindcss": "^4.0",
  "@radix-ui/react-*": "via shadcn",
  "lucide-react": "latest",
  "framer-motion": "^11",
  "fuse.js": "^7",
  "zod": "^3.23",
  "velite": "^0.2",
  "recharts": "^2.12",
  "react-simple-maps": "^3",
  "topojson-client": "^3",
  "next-themes": "^0.3",
  "@vercel/analytics": "^1",
  "resend": "^4",
  "react-email": "^3"
}
```

---

## 11. Arquitectura

### 11.1 Diagrama lógico
```
+--------------------------+        build time         +-------------------+
| content/regulations/*.mdx| ---------------------->   | Velite (parser)   |
+--------------------------+                           +---------+---------+
                                                                |
                                                                v
                                                       +-------------------+
                                                       | Zod validation    |
                                                       +---------+---------+
                                                                 |
                                                                 v
                                       +---------------------------------------------+
                                       | .velite/index.json + tipos generados        |
                                       +---------------------------------------------+
                                                                 |
                              +----------------------------------+----------------+
                              |                                                  |
                              v                                                  v
                    +-------------------+                              +-------------------+
                    | Next.js App Router|                              | API routes        |
                    | (SSG + ISR)       |                              | /api/search       |
                    +---------+---------+                              | /api/data         |
                              |                                        +---------+---------+
                              v                                                  |
                    +-------------------+                                        |
                    |   Vercel Edge     |  <-------------------------------------+
                    +-------------------+
                              |
                              v
                       Usuario final
```

### 11.2 Estructura del proyecto
```
legistracker-latam/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx                 # landing
│   ├── (app)/
│   │   ├── regulaciones/
│   │   │   ├── page.tsx             # listado + filtros
│   │   │   └── [slug]/page.tsx      # detalle
│   │   ├── paises/[code]/page.tsx
│   │   ├── areas/[slug]/page.tsx
│   │   ├── comparar/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── glosario/page.tsx
│   │   ├── metodologia/page.tsx
│   │   └── about/page.tsx
│   ├── api/
│   │   ├── data/route.ts            # GET JSON
│   │   ├── search/route.ts
│   │   └── report-error/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── opengraph-image.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                          # shadcn primitives
│   ├── filters/
│   │   ├── FilterBar.tsx
│   │   ├── CountrySelect.tsx
│   │   ├── AreaSelect.tsx
│   │   ├── StatusSelect.tsx
│   │   └── TypeSelect.tsx
│   ├── views/
│   │   ├── ListView.tsx
│   │   ├── GridView.tsx
│   │   ├── TableView.tsx
│   │   ├── TimelineView.tsx
│   │   ├── MapView.tsx
│   │   └── DashboardView.tsx
│   ├── cards/
│   │   ├── RegulationCard.tsx
│   │   └── RegulationDetailSidebar.tsx
│   ├── compare/CompareTable.tsx
│   ├── search/CommandPalette.tsx
│   ├── nav/Header.tsx
│   ├── nav/Footer.tsx
│   └── theme/ThemeToggle.tsx
├── content/
│   ├── regulations/
│   │   ├── cl/
│   │   ├── ar/
│   │   ├── br/
│   │   └── ...
│   ├── glossary/
│   ├── countries/                   # MDX por país
│   └── areas/                       # MDX por área
├── lib/
│   ├── filters.ts                   # parsing y aplicación de filtros
│   ├── search.ts                    # Fuse.js setup
│   ├── citations.ts                 # generadores APA, BibTeX, RIS
│   ├── status-helpers.ts
│   └── seo.ts
├── scripts/
│   ├── build-index.ts
│   ├── validate-content.ts
│   └── generate-og-images.ts
├── public/
│   ├── data/
│   │   └── index.json
│   ├── topojson/latam.json
│   ├── flags/
│   └── og/
├── styles/tokens.css
├── tests/
│   ├── unit/
│   └── e2e/
├── .github/workflows/
│   ├── ci.yml
│   └── content-validate.yml
├── velite.config.ts
├── next.config.mjs
├── tailwind.config.ts
├── biome.json
├── tsconfig.json
├── README.md
├── LICENSE
├── CITATION.cff                     # cita académica del proyecto
└── docs/
    ├── PRD.md                       # este archivo
    ├── DATA-DICTIONARY.md
    ├── EDITORIAL-POLICY.md
    └── CONTRIBUTING.md
```

---

## 12. Diseño Visual y UX

### 12.1 Principios de diseño
- **Editorial-first:** se lee como una revista académica digital, no como una hoja de cálculo.
- **Tipografía protagonista:** jerarquías serif para títulos de fichas, sans para UI.
- **Color institucional con identidad LATAM:** paleta neutra con acento azul cobalto y referencias sutiles a banderas (en chips, no en backgrounds).
- **Densidad ajustable:** modo "lectura" vs modo "analista".
- **Microinteracciones discretas:** transiciones suaves, sin animaciones gratuitas.

### 12.2 Sistema de diseño (tokens)
```css
/* styles/tokens.css */
:root {
  /* Color base */
  --bg: #FAFAF9;
  --bg-elevated: #FFFFFF;
  --fg: #18181B;
  --fg-muted: #52525B;
  --border: #E4E4E7;

  /* Acento */
  --accent: #1E40AF;        /* cobalto */
  --accent-fg: #FFFFFF;

  /* Áreas (chips) */
  --area-ia: #7C3AED;
  --area-pdp: #2563EB;
  --area-ciber: #DC2626;
  --area-pi: #EA580C;
  --area-plataformas: #0891B2;
  --area-fintech: #16A34A;
  --area-telecom: #CA8A04;
  --area-soberania: #9333EA;
  --area-id: #0D9488;
  --area-menores: #DB2777;

  /* Estados */
  --status-vigente: #16A34A;
  --status-diferida: #CA8A04;
  --status-proyecto: #2563EB;
  --status-aprobado: #06B6D4;
  --status-derogado: #71717A;
  --status-veto: #DC2626;
  --status-reglamento-pendiente: #EA580C;

  /* Tipografía */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Source Serif 4', Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;
}

[data-theme='dark'] {
  --bg: #0A0A0A;
  --bg-elevated: #18181B;
  --fg: #FAFAFA;
  --fg-muted: #A1A1AA;
  --border: #27272A;
  --accent: #60A5FA;
}
```

### 12.3 Componentes clave
- **Header:** logo, nav (Regulaciones, Países, Áreas, Comparar, Dashboard, About), buscador, theme toggle.
- **FilterBar:** sticky en top de listado, colapsable en mobile, chips de filtros activos removibles.
- **RegulationCard:** título serif, alias, chips de área (color), badge de estado, país con bandera SVG, fecha, link.
- **Detail sidebar:** metadata densa, links a fuentes, botones de citación.
- **CommandPalette:** Cmd+K, búsqueda + navegación rápida.
- **MapView:** SVG coroplético interactivo de LATAM con tooltip por país.

### 12.4 Landing (home)
```
[HERO]
H1 serif grande: "El mapa regulatorio de la tecnología en América Latina"
Subhead sans: descripción en 2 líneas
Buscador prominente
3 CTAs: "Explorar regulaciones", "Comparar países", "Ver dashboard"

[STATS STRIP]
N regulaciones | N países | N áreas | Última actualización

[SECCIÓN: Destacadas]
Carrusel de 6 fichas curadas (editor's picks)

[SECCIÓN: Mapa]
Mapa LATAM interactivo + leyenda

[SECCIÓN: Áreas]
Grid de 10 áreas con icono y conteo

[SECCIÓN: Análisis recientes]
Últimas 3 fichas con análisis crítico

[FOOTER]
Editor, metodología, contacto, licencia, GitHub
```

### 12.5 Páginas referencia para inspiración estética
- vercel.com (tipografía, espaciado)
- linear.app (microinteracciones, command palette)
- stripe.com/docs (estructura editorial)
- the-public-domain-review.org (tono académico)
- pudding.cool (visualizaciones narrativas)

---

## 13. Plan de Datos: fuentes, metodología, taxonomía

### 13.1 Fuentes oficiales por país (lista canónica para `docs/SOURCES.md`)
| País | Fuente primaria | URL base |
|---|---|---|
| Chile | BCN LeyChile, Diario Oficial, Senado, Cámara | bcn.cl/leychile, diariooficial.interior.gob.cl |
| Argentina | InfoLEG, Boletín Oficial | servicios.infoleg.gob.ar, boletinoficial.gob.ar |
| Brasil | Planalto, Senado, Câmara | planalto.gov.br, senado.leg.br, camara.leg.br |
| Colombia | SUIN Juriscol, Congreso | suin-juriscol.gov.co, congreso.gov.co |
| México | DOF, Cámara de Diputados, Senado | dof.gob.mx, diputados.gob.mx |
| Perú | SPIJ, Congreso | spijlibre.minjus.gob.pe, congreso.gob.pe |
| Uruguay | IMPO | impo.com.uy |
| Costa Rica | SCIJ (Sistema Costarricense de Información Jurídica) | pgrweb.go.cr/scij |
| Ecuador | Registro Oficial | registroficial.gob.ec |
| Paraguay | Gaceta Oficial | gacetaoficial.gov.py |

### 13.2 Criterios de inclusión
1. Norma con jerarquía de ley, decreto o reglamento que regule materia tecnológica con impacto en derechos o mercado.
2. Proyectos de ley con ingreso formal y movimiento legislativo en últimos 24 meses.
3. Estándares técnicos solo si tienen efecto obligatorio o han sido referenciados por norma oficial.
4. Reglamentación administrativa relevante (resoluciones, circulares de agencias).

### 13.3 Criterios de exclusión
1. Anteproyectos sin ingreso formal.
2. Doctrina o jurisprudencia (van en sección de fuentes secundarias).
3. Normativa derogada anterior a 2010, salvo relevancia histórica.

### 13.4 Política editorial
- Cada ficha tiene un curador identificable y trazable.
- Conflictos de interés se declaran en `EDITORIAL-POLICY.md`.
- Cambios en fichas se versionan (semver) y se registran en CHANGELOG por ficha.
- Errores reportados vía formulario o issue de GitHub.

---

## 14. Seed Data Inicial (50 fichas para MVP)

### 14.1 Chile (8)
- Ley 21.719 (PDP)
- Ley 21.663 (Marco de Ciberseguridad)
- Ley 21.521 (Fintec)
- Ley 19.628 (PDP, vigente en transición)
- Ley 19.223 (Delitos Informáticos)
- Ley 21.459 (Delitos Informáticos, Convenio Budapest)
- Proyecto IA Boletín 16.821-19
- Proyecto Deepfakes Boletín relevante

### 14.2 Argentina (6)
- Ley 25.326 (PDP)
- Ley 27.078 (Argentina Digital)
- Ley 26.388 (Delitos Informáticos)
- Disposición 11/2006 AAIP
- Proyecto Ley IA
- Decreto DNU sobre firma digital

### 14.3 Brasil (8)
- Lei 13.709/2018 LGPD
- Lei 12.965/2014 Marco Civil da Internet
- Lei 12.737/2012 Carolina Dieckmann
- Lei 14.063/2020 (assinaturas eletrônicas)
- PL 2338/2023 Marco da IA
- PL 2630/2020 Fake News
- Decreto 10.222/2020 (E-Digital)
- Lei 9.609/1998 (Software)

### 14.4 Colombia (6)
- Ley 1581/2012 (PDP)
- Ley 1273/2009 (Delitos Informáticos)
- Ley 1341/2009 (TIC)
- Decreto 1377/2013 (reglamento PDP)
- Decreto 338/2022 (Política de Confianza Digital)
- Proyecto IA

### 14.5 México (8)
- LFPDPPP (Ley Federal PDP en Posesión de Particulares)
- LGPDPPSO (Ley General PDP en Posesión de Sujetos Obligados)
- Ley Federal de Telecomunicaciones y Radiodifusión
- Ley Federal del Derecho de Autor
- Iniciativa Ley Federal de Ciberseguridad
- Iniciativa Ley para Regular la IA (varias)
- Código Penal Federal arts. delitos informáticos
- Ley Fintech

### 14.6 Perú (6)
- Ley 29733 (PDP)
- Decreto Supremo 003-2013-JUS (reglamento)
- Ley 30096 (Delitos Informáticos)
- Ley 31814 (Promoción del uso de IA)
- Decreto Legislativo 1412 (Gobierno Digital)
- Ley 30999 (Ciberdefensa)

### 14.7 Uruguay (4)
- Ley 18.331 (PDP)
- Ley 19.670 (transferencias internacionales)
- Ley 18.600 (firma electrónica)
- Decreto Reglamento PDP

### 14.8 Costa Rica (4)
- Ley 8968 (PDP)
- Ley 9048 (Delitos Informáticos)
- Ley 8642 (Telecomunicaciones)
- Estrategia Nacional de IA

**Recomendación:** comienza con el cluster Chile + Brasil + México + Argentina + Colombia + Perú porque concentran el 80% del interés académico y profesional regional.

---

## 15. Plan de Implementación con Claude Code (vibecoding)

### 15.1 Flujo recomendado
1. **Inicialización:** Sebastián ejecuta `npx create-next-app@latest legistracker-latam --typescript --tailwind --app` localmente.
2. **Setup Claude Code:** abre el repo y ejecuta `claude` en el terminal. Crea `CLAUDE.md` con instrucciones del proyecto (ver 15.2).
3. **Trabajar por épicas:** cada épica se ejecuta en una rama, con prompts encadenados.
4. **PR por épica:** Claude Code abre PR contra `main`. Vercel deploya preview automático.
5. **Merge cuando preview es aprobado.**

### 15.2 Plantilla `CLAUDE.md` para el repo
```markdown
# Contexto del proyecto

Este repositorio es el "Digital Policy & Legislation Tracker LATAM".
Lee siempre `docs/PRD.md` antes de proponer cambios estructurales.

## Stack
- Next.js 15 App Router, TypeScript estricto
- Tailwind v4, shadcn/ui, Lucide
- Velite para MDX, Zod para validación
- Vercel deploy

## Convenciones
- Componentes en PascalCase, hooks en camelCase con prefijo use.
- Imports absolutos con alias `@/`.
- Cada componente con su test en `tests/unit/`.
- Sin estilos inline. Usa tokens en `styles/tokens.css`.
- No usar em-dash en copy ni en docs.
- Idioma de la UI: español neutro LATAM.
- Accesibilidad WCAG AA obligatoria.

## Reglas de contenido
- Fichas en `content/regulations/{country}/{slug}.mdx`.
- Frontmatter validado contra `lib/schemas/regulation.ts`.
- Antes de añadir una ficha, verifica que el slug no exista.

## Workflows
- Antes de cualquier PR: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.
- Commits con Conventional Commits.
```

### 15.3 Épicas y prompts sugeridos para Claude Code

**Épica 1: Bootstrap y tokens (sesión 1)**
```
Prompt 1:
"Lee docs/PRD.md secciones 10, 11, 12. Configura el proyecto: instala shadcn/ui,
añade Velite, Zod, next-themes, lucide-react, framer-motion, fuse.js. Crea
styles/tokens.css con la paleta de la sección 12.2. Configura tailwind.config.ts
para consumir tokens. Crea el layout base con header y footer mínimos y theme
toggle."
```

**Épica 2: Modelo de datos y validación**
```
Prompt 2:
"Implementa el schema de la sección 9 en lib/schemas/regulation.ts usando Zod.
Configura Velite para procesar content/regulations/**/*.mdx, validar frontmatter
contra el schema y generar tipos TypeScript. Añade el script
scripts/validate-content.ts y un workflow GH Actions que falle si una ficha es
inválida. Crea 3 fichas de ejemplo: cl-21719, br-13709, ar-25326."
```

**Épica 3: Listado y filtros (sesión 2 a 3)**
```
Prompt 3:
"Implementa /regulaciones con FilterBar sticky. Filtros: país, área, estado,
tipo, año. Sincroniza con URL query params (nuqs o searchParams nativos).
Muestra resultados en ListView por defecto y GridView opcional, con toggle.
Implementa Fuse.js para búsqueda full text sobre el índice generado por Velite."
```

**Épica 4: Detalle de regulación**
```
Prompt 4:
"Crea /regulaciones/[...slug]/page.tsx que renderice una ficha MDX con el layout
descrito en 7.4. Implementa el sidebar de metadata sticky. Añade botones de
citación: APA, BibTeX, RIS. Usa lib/citations.ts. Genera Open Graph image
dinámica con next/og."
```

**Épica 5: Páginas país y área**
```
Prompt 5:
"Genera estáticamente /paises/[code] y /areas/[slug] con SSG. Cada página
combina contenido MDX (descripción) + componentes con listado filtrado y
visualizaciones simples (mini timeline, conteo por estado)."
```

**Épica 6: Dashboard y mapa**
```
Prompt 6:
"Implementa /dashboard con: (a) MapView coroplético LATAM con react-simple-maps
y un topojson en public/topojson/latam.json, (b) treemap por área con Recharts,
(c) timeline por año, (d) heatmap país x área. Todos los gráficos accesibles
con descripción textual alternativa."
```

**Épica 7: Comparador**
```
Prompt 7:
"Implementa /comparar?ids=... con vista de columnas paralelas y secciones
alineadas. Toggle 'solo diferencias'. Permite seleccionar regulaciones desde
checkboxes en /regulaciones."
```

**Épica 8: SEO, sitemap, analytics**
```
Prompt 8:
"Genera sitemap.xml dinámico con todas las regulaciones, países y áreas. Añade
robots.ts. Implementa JSON-LD LegalDocument en páginas de detalle. Integra
Vercel Analytics y Plausible. Verifica Lighthouse >= 95 en performance y a11y."
```

**Épica 9: Pulido, tests y deploy**
```
Prompt 9:
"Cobertura Vitest mínima en lib/. Tests Playwright para flujo: home -> filtrar
-> abrir ficha -> copiar cita. Configura Vercel project. Conecta dominio.
Documenta despliegue en README. Añade CITATION.cff."
```

### 15.4 Estimación temporal
| Épica | Sesiones (1.5 a 2 h cada una) |
|---|---|
| 1. Bootstrap | 1 |
| 2. Modelo de datos | 1 |
| 3. Listado y filtros | 2 |
| 4. Detalle | 1 |
| 5. País y área | 1 |
| 6. Dashboard y mapa | 2 |
| 7. Comparador | 1 |
| 8. SEO y analytics | 1 |
| 9. Pulido y deploy | 1 |
| **Total** | **~11 sesiones** |

A ritmo de 2 sesiones semanales: 5 a 6 semanas para MVP funcional con 50 fichas seed.

---

## 16. Flujo Git + Vercel

### 16.1 Setup inicial
```bash
# Local
gh repo create legistracker-latam --public --description "Digital Policy & Legislation Tracker LATAM" --license MIT
git init
git add . && git commit -m "feat: bootstrap project"
git branch -M main
git push -u origin main

# Vercel
vercel link
vercel env add RESEND_API_KEY production
vercel --prod
```

### 16.2 Convenciones
- **Branches:** `main` (protegida), `feat/*`, `fix/*`, `content/*`, `docs/*`.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `content:`, `docs:`, `chore:`).
- **PRs:** template en `.github/pull_request_template.md` con checklist (lint, typecheck, test, screenshot, Lighthouse).
- **Preview deploys:** automáticos por PR.

### 16.3 GitHub Actions (`.github/workflows/ci.yml`)
- Job 1: install + lint + typecheck.
- Job 2: validate content (Velite + Zod).
- Job 3: build + test.
- Job 4 (semanal, cron): script `check-source-urls.ts` valida que las URLs oficiales sigan activas.

### 16.4 Variables de entorno en Vercel
```
RESEND_API_KEY=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=legistracker.lat
NEXT_PUBLIC_SITE_URL=https://legistracker.lat
EDITOR_EMAIL=sfduenas@uc.cl
```

---

## 17. Mantenimiento y Actualización de Datos

### 17.1 Cadencia editorial
- **Diaria** (automatizado v2): chequeo de URLs activas.
- **Semanal:** revisión de "proyectos en discusión" prioritarios (10 a 15 boletines).
- **Mensual:** auditoría de cambios de estado, nuevas fichas (~5 a 10 por mes).
- **Trimestral:** revisión profunda por país (rotativa), publicación de "State of Digital Policy LATAM" como newsletter o policy brief.

### 17.2 Workflow de contribución externa (`CONTRIBUTING.md`)
1. Fork.
2. Crear ficha siguiendo la plantilla `content/_template.mdx`.
3. PR con etiqueta `content`.
4. Revisión por editor (Sebastián u otro miembro del equipo).
5. Merge.

### 17.3 Plantilla de ficha vacía (`content/_template.mdx`)
Incluida en repo, copy-pasteable, con todos los campos del frontmatter.

---

## 18. SEO y Posicionamiento Académico

### 18.1 Estrategia SEO
- Páginas individuales por regulación con URLs canónicas profundas (`/cl/regulaciones/ley-21719-proteccion-datos-personales`).
- Schema.org `LegalDocument` + `BreadcrumbList`.
- Open Graph dinámico por ficha (next/og), con título, país y área.
- Sitemap segmentado por sección.
- Backlinks: incluir el tracker en CVs académicos, en bios LinkedIn, en columnas Forbes y El Mercurio Legal, en bibliografía del diplomado.

### 18.2 Posicionamiento académico
- Archivo `CITATION.cff` con cita en formato APA/Chicago: "Dueñas Müller, S. (2026). Digital Policy & Legislation Tracker LATAM. https://legistracker.lat"
- DOI opcional vía Zenodo (vincular el repo a Zenodo y archivar releases).
- Mención del proyecto en el sitio web personal y en el programa universitario PUC.
- Difusión en redes con visuales generados desde el dashboard.

---

## 19. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Desactualización del contenido | Alta | Alto | Cadencia editorial, banner "última actualización", política transparente |
| Dependencia de fuentes oficiales que cambian estructura | Media | Medio | URLs documentadas, snapshots periódicos en Wayback Machine |
| Demasiado scope, no se termina | Alta | Alto | MVP estricto (50 fichas, 6 países, 4 vistas) |
| Sobrecarga visual | Media | Medio | Design review con usuarios reales en semana 3 |
| Errores jurídicos en fichas | Media | Alto | Doble revisión, declaración de incertidumbre por ficha (`confidenceLevel`) |
| Plagio o uso indebido | Baja | Bajo | Licencia CC BY 4.0 + atribución exigida |
| Costos Vercel al escalar | Baja en MVP | Medio | Hobby tier soporta tráfico inicial; plan migración a Pro si supera límites |
| Burnout editorial | Media | Alto | Sumar 2 a 3 asistentes de investigación con roles claros |

---

## 20. Roadmap por Fases (resumen visual)

```
Mes 1  | Semana 1-2: Bootstrap + Modelo de datos + 20 fichas
       | Semana 3-4: Filtros + Detalle + 30 fichas más (50 total)
       | Deploy MVP en producción
Mes 2  | Semana 5-6: Dashboard + Mapa + Comparador
       | Semana 7-8: 50 fichas adicionales (100 total) + SEO + analytics
       | Lanzamiento público + difusión
Mes 3  | Fichas hasta 150, glosario completo, traducción inicial al inglés
Mes 4+ | API pública, alertas por email, integración con scraping semi-asistido
```

---

## 21. Apéndices

### 21.1 Checklist pre-launch
- [ ] 50 fichas validadas con `confidenceLevel: alto` o `medio`
- [ ] 6 países cubiertos
- [ ] Lighthouse Performance ≥ 95
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Tests E2E del flujo principal verdes
- [ ] Sitemap publicado y enviado a Google Search Console
- [ ] Open Graph verificado con cardvalidator
- [ ] Política editorial publicada
- [ ] CITATION.cff válido
- [ ] README con badges (build, license, citation)
- [ ] Dominio configurado con HTTPS
- [ ] Aviso de privacidad mínimo

### 21.2 Checklist por ficha
- [ ] Frontmatter pasa validación Zod
- [ ] `officialUrl` activa y verificada hoy
- [ ] Resumen entre 60 y 120 palabras
- [ ] Al menos 3 `keyProvisions`
- [ ] Tags coherentes con glosario
- [ ] `lastUpdated` y `version` correctos
- [ ] `editor` declarado
- [ ] Conflictos de interés revisados

### 21.3 Plantilla `README.md` (sección destacada)
```markdown
# Digital Policy & Legislation Tracker LATAM

> Mapa interactivo de regulación de nuevas tecnologías en América Latina.

[![CI](https://github.com/.../actions/workflows/ci.yml/badge.svg)](.)
[![DOI](https://zenodo.org/badge/.../zenodo....svg)](.)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Content: CC BY 4.0](https://img.shields.io/badge/Content-CC%20BY%204.0-lightgrey.svg)](.)

## Cómo citar
> Dueñas Müller, S. (2026). Digital Policy & Legislation Tracker LATAM. https://legistracker.lat
```

### 21.4 Prompt maestro para arrancar con Claude Code
```
"Estás trabajando en el proyecto 'legistracker-latam'. Lee primero docs/PRD.md
completo y resume en 10 bullets lo que entiendes del producto. Luego, propón un
plan de 9 PRs alineado con las épicas de la sección 15.3. No ejecutes nada
hasta que apruebe el plan. Cuando arranquemos cada PR, trabaja en una rama
nueva, sigue las convenciones de CLAUDE.md, y al finalizar abre la PR con
descripción detallada y screenshot si aplica."
```

---

## 22. Notas finales para Sebastián

1. **Pieza de portafolio doble:** este proyecto sirve como código (GitHub público), como contenido editorial (las fichas son tu producción intelectual citable) y como vehículo de posicionamiento (LinkedIn, columnas, conferencias).
2. **Conexión con tu skill de jurisprudencia:** en Fase 3, el "policy brief generator" puede reutilizar la arquitectura de tu Claude Skill de extracción de fallos de la Corte Suprema, pero aplicada a comparación normativa.
3. **Plug a Inteligencia Digital:** podrías ofrecer un add-on B2B en el dominio `pro.legistracker.lat` con alertas premium y exports masivos, monetizando la base sin contaminar la versión pública.
4. **Plug al diplomado PUC:** el tracker puede ser referencia obligatoria del diplomado en Derecho e IA, y los asistentes de investigación pueden contribuir con fichas como evaluación parcial.
5. **Publicabilidad:** una vez con 100 fichas, el dataset puede sustentar un paper comparado (por ejemplo, "Convergencia y divergencia regulatoria en IA en LATAM 2018 a 2026"), con visualizaciones reutilizadas del propio tracker.

---

**Próximo paso recomendado:** clonar el repo, pegar este PRD en `docs/PRD.md`, crear `CLAUDE.md` con la plantilla de 15.2, y lanzar el prompt maestro de 21.4 en la primera sesión de Claude Code.
