# Digital Policy Tracker LATAM

> Mapa interactivo y curado de la regulación de nuevas tecnologías en América Latina.

Catálogo navegable de leyes, decretos y proyectos de ley en materia de
inteligencia artificial, protección de datos personales, ciberseguridad,
plataformas digitales, fintech, propiedad intelectual digital, telecomunicaciones,
soberanía digital, identidad digital y protección de menores en línea.

## Stack

- **Next.js 15** (App Router) + React 19
- **TypeScript** estricto
- **Tailwind CSS 3** con tokens de diseño centralizados
- Contenido en **MDX** validado con **Zod**
- **Fuse.js** para búsqueda fuzzy en cliente
- **Recharts** para visualizaciones
- **cmdk** para command palette (Cmd/Ctrl + K)
- **next-themes** para tema claro/oscuro

## Estructura

```
.
├── app/
│   ├── page.tsx                       # Landing
│   ├── regulaciones/                  # Catálogo + detalle
│   ├── paises/                        # Índice y por país
│   ├── areas/                         # Índice y por área temática
│   ├── comparar/                      # Comparador 1-4
│   ├── dashboard/                     # Analítico
│   ├── metodologia/ about/ glosario/  # Documentación editorial
│   ├── sitemap.ts robots.ts           # SEO
│   └── opengraph-image.tsx            # OG dinámico
├── components/
│   ├── AppShell.tsx
│   ├── nav/ theme/ search/ filters/
│   ├── catalog/ compare/ dashboard/
│   ├── cards/                         # Card, Row, Sidebar, Citation
│   └── ui/                            # Badge, Button, Input, AreaChip…
├── content/regulations/{cc}/*.mdx     # Fichas curadas
├── lib/
│   ├── schemas/regulation.ts          # Zod schema
│   ├── content.ts                     # Carga y validación
│   ├── filters.ts citations.ts        # Pure-functions
│   └── taxonomy.ts                    # Áreas, países, estados, tipos
└── docs/PRD.md                        # PRD original
```

## Desarrollo

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm build
```

## Descubrir normas nuevas

```bash
pnpm discover                 # últimos 30 días, los 20 países
pnpm discover --country cl --days 90
pnpm discover --selftest      # sin red
```

Busca en el RSS de Google Noticias, filtra por señal normativa y área, descarta
lo que ya tiene ficha y acumula los candidatos en `content/_candidates.json`.
No crea fichas: el campo `status` de cada candidato se edita a mano
(`descartado`, `fichado`) y las corridas siguientes lo respetan.

## Añadir una ficha

Crea `content/regulations/{cc}/{slug}.mdx` con frontmatter que valide contra
`lib/schemas/regulation.ts`. Si el frontmatter es inválido el build falla.

## Cita

> Policy Tracker LATAM (2024). _Mapa regulatorio de la tecnología en Latinoamérica_. https://policytracker.lat

## Licencias

- Contenido editorial (fichas, resúmenes, análisis, taxonomía): **CC BY 4.0**,
  texto completo en [`LICENSE`](LICENSE)
- Código: **MIT**, texto completo en [`LICENSE-CODE`](LICENSE-CODE)
- Textos oficiales en `public/texts`: licencia de origen
