/*
 * Descubrimiento de normas candidatas.
 *
 * Por cada país del tracker lanza dos búsquedas en el RSS de Google Noticias
 * (una por grupo de áreas), filtra los titulares que mezclan una señal
 * normativa con un término de área, descarta lo que ya tiene ficha y acumula
 * el resto en content/_candidates.json para revisión humana. No crea fichas.
 *
 * Uso:
 *   pnpm discover [--country CC] [--days N] [--limit N] [--delay MS] [--dry]
 *   pnpm discover --selftest     (sin red, valida parseo y filtros)
 *
 * El campo country es el país que se consultó, no una verificación: Google
 * Noticias mezcla algo de prensa vecina y hay que confirmar a mano. Con
 * --days 3650 sirve también para barrer hacia atrás y buscar vacíos viejos.
 *
 * El archivo de salida es acumulativo: si marcas a mano el status de un
 * candidato ("descartado", "fichado"), las corridas siguientes lo respetan y
 * no lo vuelven a proponer.
 *
 * ponytail: Google Noticias es la única fuente. Los boletines oficiales de la
 * región no publican RSS usable (probados el DOF mexicano, el Boletín Oficial
 * argentino, el Senado colombiano y el Congreso peruano: 403, 404, certificado
 * SSL inválido y timeout). Si más adelante hace falta precisión de fuente
 * oficial, el siguiente paso son las APIs de datos abiertos del Senado de
 * Brasil y de la Cámara de Chile, que sí responden pero traen cada una su
 * propio formato y necesitan su propio parser.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import matter from "gray-matter";

const ROOT = process.cwd();
const REG_DIR = path.join(ROOT, "content", "regulations");
const OUT_PATH = path.join(ROOT, "content", "_candidates.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

type Lang = "es" | "pt" | "fr";

const COUNTRIES: Record<string, { hl: string; lang: Lang }> = {
  ar: { hl: "es-419", lang: "es" },
  bo: { hl: "es-419", lang: "es" },
  br: { hl: "pt-BR", lang: "pt" },
  cl: { hl: "es-419", lang: "es" },
  co: { hl: "es-419", lang: "es" },
  cr: { hl: "es-419", lang: "es" },
  cu: { hl: "es-419", lang: "es" },
  do: { hl: "es-419", lang: "es" },
  ec: { hl: "es-419", lang: "es" },
  gt: { hl: "es-419", lang: "es" },
  hn: { hl: "es-419", lang: "es" },
  ht: { hl: "fr", lang: "fr" },
  mx: { hl: "es-419", lang: "es" },
  ni: { hl: "es-419", lang: "es" },
  pa: { hl: "es-419", lang: "es" },
  pe: { hl: "es-419", lang: "es" },
  py: { hl: "es-419", lang: "es" },
  sv: { hl: "es-419", lang: "es" },
  uy: { hl: "es-419", lang: "es" },
  ve: { hl: "es-419", lang: "es" },
};

/* El primer nombre entra en la consulta; todos sirven para descartar noticias
 * de otro país, porque el parámetro gl de Google Noticias filtra poco. */
const COUNTRY_NAMES: Record<string, string[]> = {
  ar: ["Argentina", "argentino"],
  bo: ["Bolivia", "boliviano"],
  br: ["Brasil", "brasileiro"],
  cl: ["Chile", "chileno"],
  co: ["Colombia", "colombiano"],
  cr: ["Costa Rica", "costarricense"],
  cu: ["Cuba", "cubano"],
  do: ["Republica Dominicana", "dominicano"],
  ec: ["Ecuador", "ecuatoriano"],
  gt: ["Guatemala", "guatemalteco"],
  hn: ["Honduras", "hondureno"],
  ht: ["Haiti", "haitien"],
  mx: ["Mexico", "mexicano"],
  ni: ["Nicaragua", "nicaraguense"],
  pa: ["Panama", "panameno"],
  pe: ["Peru", "peruano"],
  py: ["Paraguay", "paraguayo"],
  sv: ["El Salvador", "salvadoreno"],
  uy: ["Uruguay", "uruguayo"],
  ve: ["Venezuela", "venezolano"],
};

/* Fuera de la región, pero copan los resultados en español. */
const FOREIGN = ["espana", "union europea", "parlamento europeo", "estados unidos", "california", "texas", "china"];

/* Primer término de cada área va a la consulta; todos sirven para etiquetar. */
const AREA_TERMS: Record<Lang, Record<string, string[]>> = {
  es: {
    ia: ["inteligencia artificial", "sistemas algoritmicos", "deepfake"],
    pdp: ["datos personales", "proteccion de datos", "privacidad"],
    ciberseguridad: ["ciberseguridad", "delitos informaticos", "ciberataque"],
    "propiedad-intelectual": ["derecho de autor", "propiedad intelectual"],
    plataformas: ["plataformas digitales", "redes sociales", "moderacion de contenidos"],
    fintech: ["fintech", "criptoactivos", "criptomonedas", "finanzas abiertas"],
    telecom: ["telecomunicaciones", "neutralidad de la red", "espectro radioelectrico"],
    soberania: ["soberania digital", "localizacion de datos", "transferencia internacional de datos"],
    "identidad-digital": ["identidad digital", "firma electronica", "gobierno digital"],
    "menores-online": ["verificacion de edad", "menores en linea", "ninos en internet"],
  },
  pt: {
    ia: ["inteligencia artificial", "sistemas algoritmicos", "deepfake"],
    pdp: ["dados pessoais", "protecao de dados", "privacidade"],
    ciberseguridad: ["ciberseguranca", "crimes ciberneticos", "ciberataque"],
    "propiedad-intelectual": ["direito autoral", "propriedade intelectual"],
    plataformas: ["plataformas digitais", "redes sociais", "moderacao de conteudo"],
    fintech: ["fintech", "criptoativos", "criptomoedas", "open finance"],
    telecom: ["telecomunicacoes", "neutralidade da rede", "espectro"],
    soberania: ["soberania digital", "localizacao de dados", "transferencia internacional de dados"],
    "identidad-digital": ["identidade digital", "assinatura eletronica", "governo digital"],
    "menores-online": ["verificacao de idade", "menores online", "criancas na internet"],
  },
  fr: {
    ia: ["intelligence artificielle", "systemes algorithmiques", "deepfake"],
    pdp: ["donnees personnelles", "protection des donnees", "vie privee"],
    ciberseguridad: ["cybersecurite", "cybercriminalite", "cyberattaque"],
    "propiedad-intelectual": ["droit d'auteur", "propriete intellectuelle"],
    plataformas: ["plateformes numeriques", "reseaux sociaux", "moderation des contenus"],
    fintech: ["fintech", "cryptoactifs", "cryptomonnaies"],
    telecom: ["telecommunications", "neutralite du net", "spectre"],
    soberania: ["souverainete numerique", "localisation des donnees"],
    "identidad-digital": ["identite numerique", "signature electronique", "gouvernement numerique"],
    "menores-online": ["verification de l'age", "mineurs en ligne"],
  },
};

/* Señales de que el titular habla de una norma y no de tecnología en general. */
const SIGNALS: Record<Lang, string[]> = {
  es: ["ley", "proyecto de ley", "decreto", "reglamento", "regula", "normativa",
       "congreso", "senado", "camara de diputados", "promulg", "aprueba", "sanciona"],
  pt: ["lei", "projeto de lei", "decreto", "regulamento", "regula", "congresso",
       "senado", "camara dos deputados", "sancion", "aprova", "medida provisoria"],
  fr: ["loi", "projet de loi", "decret", "reglement", "regule", "parlement",
       "senat", "assemblee nationale", "adopte", "promulg"],
};

/* Dos grupos para no exceder lo que Google Noticias devuelve por consulta. */
const GROUPS = [
  ["ia", "pdp", "ciberseguridad", "plataformas", "fintech"],
  ["telecom", "identidad-digital", "propiedad-intelectual", "soberania", "menores-online"],
];

interface Candidate {
  id: string;
  /* País, área principal y mes. Agrupa las muchas notas de prensa sobre una
   * misma norma sin fusionarlas, para revisarlas de una pasada. */
  cluster: string;
  country: string;
  areas: string[];
  title: string;
  outlet: string;
  url: string;
  publishedAt: string;
  firstSeenAt: string;
  status: string;
}

interface Args {
  country?: string;
  days: number;
  limit?: number;
  delay: number;
  dry: boolean;
  selftest: boolean;
}

function parseArgs(argv: string[]): Args {
  const out: Args = { days: 30, delay: 3500, dry: false, selftest: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--country") out.country = argv[++i].toLowerCase();
    else if (a === "--days") out.days = parseInt(argv[++i], 10);
    else if (a === "--limit") out.limit = parseInt(argv[++i], 10);
    else if (a === "--delay") out.delay = parseInt(argv[++i], 10);
    else if (a === "--dry") out.dry = true;
    else if (a === "--selftest") out.selftest = true;
  }
  return out;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

interface FeedItem {
  title: string;
  url: string;
  publishedAt: string;
  outlet: string;
}

function parseFeed(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  for (const raw of xml.match(/<item>[\s\S]*?<\/item>/g) ?? []) {
    const pick = (tag: string) =>
      decodeEntities(
        raw.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "",
      ).trim();
    const title = pick("title");
    const url = pick("link");
    if (!title || !url) continue;
    const outlet = pick("source");
    /* Google Noticias repite el medio al final del titular. */
    const clean = outlet && title.endsWith(` - ${outlet}`)
      ? title.slice(0, -(outlet.length + 3)).trim()
      : title;
    items.push({ title: clean, url, publishedAt: pick("pubDate"), outlet });
  }
  return items;
}

function tagAreas(title: string, lang: Lang): string[] {
  const n = normalize(title);
  return Object.entries(AREA_TERMS[lang])
    .filter(([, terms]) => terms.some((t) => n.includes(normalize(t))))
    .map(([area]) => area);
}

/* Google Noticias ignora su propio operador when:, así que se filtra acá. */
function isStale(publishedAt: string, days: number, now: number): boolean {
  const t = Date.parse(publishedAt);
  if (Number.isNaN(t)) return false;
  return t < now - days * 86_400_000;
}

function hasSignal(title: string, lang: Lang): boolean {
  const n = normalize(title);
  return SIGNALS[lang].some((w) => n.includes(w));
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return walk(p);
      return e.name.endsWith(".mdx") ? [p] : [];
    }),
  );
  return nested.flat();
}

/* Títulos cortos y alias de las fichas existentes, por país. */
async function existingTitles(): Promise<Map<string, string[]>> {
  const byCountry = new Map<string, string[]>();
  for (const file of await walk(REG_DIR)) {
    const fm = matter(await fs.readFile(file, "utf-8")).data as {
      country?: string;
      shortTitle?: string;
      aliases?: string[];
    };
    if (!fm.country) continue;
    const cc = fm.country.toLowerCase();
    const names = [fm.shortTitle ?? "", ...(fm.aliases ?? [])]
      .map(normalize)
      .filter((t) => t.length >= 10);
    byCountry.set(cc, [...(byCountry.get(cc) ?? []), ...names]);
  }
  return byCountry;
}

function isCovered(title: string, known: string[]): boolean {
  const n = normalize(title);
  return known.some((k) => n.includes(k));
}

function candidateId(country: string, title: string): string {
  return createHash("sha1")
    .update(`${country}:${normalize(title)}`)
    .digest("hex")
    .slice(0, 12);
}

function buildQuery(group: string[], lang: Lang, days: number, cc: string): string {
  const quote = (t: string) => (t.includes(" ") ? `"${t}"` : t);
  const areas = group
    .map((a) => AREA_TERMS[lang][a][0])
    .map(quote)
    .join(" OR ");
  const norms = SIGNALS[lang].slice(0, 5).map(quote).join(" OR ");
  const place = COUNTRY_NAMES[cc].map(quote).join(" OR ");
  return `(${norms}) (${areas}) (${place}) when:${days}d`;
}

/* Descarta la noticia que nombra otro país o una potencia de fuera. */
function isElsewhere(title: string, cc: string): boolean {
  const n = normalize(title);
  const own = COUNTRY_NAMES[cc].map(normalize);
  if (FOREIGN.some((f) => n.includes(f))) return true;
  return Object.entries(COUNTRY_NAMES).some(
    ([other, names]) =>
      other !== cc &&
      names.some((name) => {
        const t = normalize(name);
        return n.includes(t) && !own.some((o) => o.includes(t) || t.includes(o));
      }),
  );
}

async function fetchFeed(query: string, cc: string): Promise<FeedItem[]> {
  const { hl } = COUNTRIES[cc];
  const gl = cc.toUpperCase();
  const url =
    "https://news.google.com/rss/search?" +
    new URLSearchParams({ q: query, hl, gl, ceid: `${gl}:${hl}` }).toString();
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseFeed(await res.text());
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function selftest(): void {
  const assert = (cond: unknown, msg: string) => {
    if (!cond) throw new Error(`selftest: ${msg}`);
  };

  const xml = `<rss><channel><item><title>Senado aprueba el proyecto de ley de datos personales - El Mercurio</title>` +
    `<link>https://news.google.com/rss/articles/ABC</link><pubDate>Mon, 03 Nov 2026 10:00:00 GMT</pubDate>` +
    `<source url="https://emol.com">El Mercurio</source></item>` +
    `<item><title>Sin enlace</title></item></channel></rss>`;
  const items = parseFeed(xml);
  assert(items.length === 1, "debe descartar el item sin enlace");
  assert(items[0].outlet === "El Mercurio", "debe leer el medio");
  assert(
    items[0].title === "Senado aprueba el proyecto de ley de datos personales",
    `debe recortar el medio del titular, quedó: ${items[0].title}`,
  );

  assert(decodeEntities("Ley &amp; datos &quot;x&quot;") === 'Ley & datos "x"', "entidades");
  assert(normalize("Protección DE  Datos") === "proteccion de datos", "normalize");

  assert(
    tagAreas("Nueva ley de inteligencia artificial y datos personales", "es").join() ===
      "ia,pdp",
    "debe etiquetar dos áreas",
  );
  assert(tagAreas("Receta de empanadas", "es").length === 0, "sin áreas");
  assert(tagAreas("Projeto regula dados pessoais", "pt")[0] === "pdp", "términos en portugués");

  const t0 = Date.parse("2026-11-09T00:00:00Z");
  assert(isStale("Mon, 03 Nov 2025 10:00:00 GMT", 30, t0), "nota vieja");
  assert(!isStale("Mon, 03 Nov 2026 10:00:00 GMT", 30, t0), "nota reciente");
  assert(!isStale("", 30, t0), "sin fecha no se descarta");

  assert(hasSignal("Congreso discute el proyecto", "es"), "señal normativa");
  assert(!hasSignal("Empresa lanza chatbot", "es"), "sin señal normativa");

  const known = [normalize("Ley de Protección de Datos Personales")];
  assert(isCovered("Reglamento de la Ley de Protección de Datos Personales", known), "cubierto");
  assert(!isCovered("Proyecto de ley de ciberseguridad", known), "no cubierto");

  assert(
    candidateId("cl", "Ley X") === candidateId("cl", "ley  x"),
    "el id ignora mayúsculas y espacios",
  );
  assert(candidateId("cl", "Ley X") !== candidateId("pe", "Ley X"), "el id separa países");

  const q = buildQuery(["ia", "pdp"], "es", 30, "cl");
  assert(
    q === '(ley OR "proyecto de ley" OR decreto OR reglamento OR regula) ' +
      '("inteligencia artificial" OR "datos personales") (Chile OR chileno) when:30d',
    `consulta inesperada: ${q}`,
  );

  assert(isElsewhere("Congreso de Guatemala aprueba ley de ciberseguridad", "cl"), "otro país");
  assert(isElsewhere("La UE prepara una ley para España", "cl"), "fuera de la región");
  assert(!isElsewhere("Senado chileno aprueba la ley de datos", "cl"), "país propio");
  assert(!isElsewhere("Diputados aprueban la ley de ciberseguridad", "cl"), "sin país nombrado");
  assert(!isElsewhere("Costa Rica regula la IA", "cr"), "nombre compuesto propio");

  console.log("selftest OK");
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.selftest) return selftest();

  const countries = args.country ? [args.country] : Object.keys(COUNTRIES);
  for (const cc of countries) {
    if (!COUNTRIES[cc]) throw new Error(`país desconocido: ${cc}`);
  }

  const known = await existingTitles();
  const previous: Candidate[] = JSON.parse(
    await fs.readFile(OUT_PATH, "utf-8").catch(() => '{"candidates":[]}'),
  ).candidates;
  const byId = new Map(previous.map((c) => [c.id, c]));
  const now = new Date().toISOString();

  let added = 0;
  let empty = 0;
  for (const cc of countries) {
    const { lang } = COUNTRIES[cc];
    let seen = 0;
    let kept = 0;
    for (const group of GROUPS) {
      const query = buildQuery(group, lang, args.days, cc);
      let items: FeedItem[];
      try {
        items = await fetchFeed(query, cc);
      } catch (err) {
        console.warn(`  ${cc}: falló la consulta (${(err as Error).message})`);
        continue;
      }
      if (items.length === 0) empty++;
      seen += items.length;
      for (const item of args.limit ? items.slice(0, args.limit) : items) {
        const areas = tagAreas(item.title, lang);
        if (areas.length === 0 || !hasSignal(item.title, lang)) continue;
        if (isElsewhere(item.title, cc)) continue;
        if (isStale(item.publishedAt, args.days, Date.parse(now))) continue;
        if (isCovered(item.title, known.get(cc) ?? [])) continue;
        const id = candidateId(cc, item.title);
        if (byId.has(id)) continue;
        const month = (item.publishedAt ? new Date(item.publishedAt) : new Date())
          .toISOString()
          .slice(0, 7);
        byId.set(id, {
          id,
          cluster: `${cc}-${areas[0]}-${month}`,
          country: cc.toUpperCase(),
          areas,
          title: item.title,
          outlet: item.outlet,
          url: item.url,
          publishedAt: item.publishedAt
            ? new Date(item.publishedAt).toISOString()
            : now,
          firstSeenAt: now,
          status: "nuevo",
        });
        kept++;
        added++;
      }
      await sleep(args.delay);
    }
    console.log(`${cc}: ${seen} titulares, ${kept} candidatos nuevos`);
  }

  if (empty > 0) {
    console.warn(
      `\n${empty} consultas volvieron vacías. Google Noticias limita las ` +
        `ráfagas: si son muchas, repetir con --delay 8000.`,
    );
  }

  const candidates = [...byId.values()].sort(
    (a, b) =>
      a.cluster.localeCompare(b.cluster) ||
      b.publishedAt.localeCompare(a.publishedAt),
  );
  const nuevos = candidates.filter((c) => c.status === "nuevo").length;
  console.log(`\n${added} nuevos, ${candidates.length} en total, ${nuevos} por revisar`);

  const porCluster = new Map<string, number>();
  for (const c of candidates) {
    if (c.status === "nuevo") porCluster.set(c.cluster, (porCluster.get(c.cluster) ?? 0) + 1);
  }
  for (const [cluster, n] of [...porCluster].sort((a, b) => b[1] - a[1]).slice(0, 15)) {
    console.log(`  ${cluster}: ${n}`);
  }

  if (args.dry) return;
  await fs.writeFile(
    OUT_PATH,
    JSON.stringify({ updatedAt: now, candidates }, null, 2) + "\n",
    "utf-8",
  );
  console.log(`-> ${path.relative(ROOT, OUT_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
