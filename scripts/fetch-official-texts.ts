/*
 * Script de adquisición masiva de "texto oficial" para cada ficha.
 *
 * Por cada ficha:
 *  1) curl --silent --location --user-agent (browser realista) al officialUrl
 *  2) Detectar Content-Type
 *  3) PDF  -> pdftotext -layout -> texto
 *     HTML -> strip tags y normalizar -> texto
 *     otro -> heurística por extensión
 *  4) Si el resultado parece error (403/cloudflare/404), marcar como fallo
 *  5) Guardar en content/texts/{cc}/{slug}.txt y registrar metadata en
 *     content/texts/_manifest.json
 *
 * Uso:
 *   pnpm exec tsx scripts/fetch-official-texts.ts [--limit N] [--country CC]
 *                                                  [--slug PATTERN] [--force]
 *
 * Es idempotente: salta fichas ya cubiertas en el manifest a menos que pases
 * --force o cambien la URL fuente.
 */
import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import matter from "gray-matter";

const ROOT = process.cwd();
const REG_DIR = path.join(ROOT, "content", "regulations");
const TEXT_DIR = path.join(ROOT, "content", "texts");
const MANIFEST_PATH = path.join(TEXT_DIR, "_manifest.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

interface ManifestEntry {
  source: string;
  sourceType: "pdf" | "html" | "text" | "manual" | "unknown";
  fetchedAt: string;
  bytes: number;
  notes?: string;
}
type Manifest = Record<string, ManifestEntry>;

interface FailureLog {
  slug: string;
  source: string;
  reason: string;
  details?: string;
}

interface Args {
  limit?: number;
  country?: string;
  slug?: string;
  force: boolean;
}

function parseArgs(argv: string[]): Args {
  const out: Args = { force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--limit") out.limit = parseInt(argv[++i], 10);
    else if (a === "--country") out.country = argv[++i].toUpperCase();
    else if (a === "--slug") out.slug = argv[++i];
    else if (a === "--force") out.force = true;
  }
  return out;
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return walk(p);
      if (e.name.endsWith(".mdx")) return [p];
      return [];
    }),
  );
  return files.flat();
}

function run(
  cmd: string,
  args: string[],
  options: { input?: Buffer; timeoutMs?: number } = {},
): Promise<{ stdout: Buffer; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ["pipe", "pipe", "pipe"] });
    const out: Buffer[] = [];
    const err: string[] = [];
    let killed = false;
    const timer = options.timeoutMs
      ? setTimeout(() => {
          killed = true;
          child.kill("SIGKILL");
        }, options.timeoutMs)
      : null;
    child.stdout.on("data", (d) => out.push(d));
    child.stderr.on("data", (d) => err.push(d.toString()));
    child.on("close", (code) => {
      if (timer) clearTimeout(timer);
      resolve({
        stdout: Buffer.concat(out),
        stderr: killed ? `[timeout] ${err.join("")}` : err.join(""),
        code: code ?? -1,
      });
    });
    if (options.input) {
      child.stdin.write(options.input);
      child.stdin.end();
    } else {
      child.stdin.end();
    }
  });
}

async function curlFetch(url: string): Promise<{
  body: Buffer;
  contentType: string;
  httpCode: number;
  finalUrl: string;
  error?: string;
}> {
  // -w writes metadata after body separated by sentinel
  const SENTINEL = "<<<META-SEP>>>";
  const { stdout, stderr, code } = await run(
    "curl",
    [
      "-sSL",
      "--max-time",
      "45",
      "--connect-timeout",
      "15",
      "-A",
      UA,
      "-H",
      "Accept-Language: es,en;q=0.8,pt;q=0.6,fr;q=0.4",
      "-H",
      "Accept: text/html,application/xhtml+xml,application/pdf,*/*",
      "-w",
      `${SENTINEL}%{content_type}\\n%{http_code}\\n%{url_effective}\\n`,
      url,
    ],
    { timeoutMs: 60_000 },
  );
  if (code !== 0) {
    return {
      body: Buffer.alloc(0),
      contentType: "",
      httpCode: 0,
      finalUrl: url,
      error: stderr || `curl exit ${code}`,
    };
  }
  const idx = stdout.lastIndexOf(Buffer.from(SENTINEL));
  if (idx === -1) {
    return {
      body: stdout,
      contentType: "",
      httpCode: 200,
      finalUrl: url,
    };
  }
  const body = stdout.subarray(0, idx);
  const meta = stdout.subarray(idx + SENTINEL.length).toString("utf8").trim().split("\n");
  const [contentType = "", httpCodeStr = "0", finalUrl = url] = meta;
  return {
    body,
    contentType: contentType.toLowerCase(),
    httpCode: parseInt(httpCodeStr, 10),
    finalUrl,
  };
}

async function extractPdfText(pdfBuffer: Buffer): Promise<{ text: string; error?: string }> {
  const tmp = path.join(tmpdir(), `dpt-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`);
  await fs.writeFile(tmp, pdfBuffer);
  try {
    const { stdout, stderr, code } = await run(
      "pdftotext",
      ["-layout", "-enc", "UTF-8", "-nopgbrk", tmp, "-"],
      { timeoutMs: 90_000 },
    );
    if (code !== 0) return { text: "", error: `pdftotext exit ${code}: ${stderr}` };
    return { text: stdout.toString("utf8") };
  } finally {
    fs.unlink(tmp).catch(() => {});
  }
}

function htmlToText(html: string): string {
  // Eliminar scripts/styles/templates/noscript
  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<template[\s\S]*?<\/template>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");

  // Reemplazos amigables para mantener estructura
  s = s
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*\/\s*(p|div|section|article|li|tr|h[1-6])\s*>/gi, "\n")
    .replace(/<\s*li\s*[^>]*>/gi, "\n• ")
    .replace(/<\s*\/?\s*[^>]+>/g, " ");

  // Decodificar entidades comunes
  s = s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&[a-z]+;/gi, " ");

  // Normalizar whitespace
  s = s.replace(/[ \t\f\v]+/g, " ");
  s = s.replace(/ *\n */g, "\n");

  // Eliminar líneas con sólo bullets/separadores o muy cortas sin letra
  const lines = s.split("\n");
  const kept: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (t === "" || t === "•" || t === "·" || t === "-") continue;
    if (t.length <= 2 && !/[a-záéíóúüñ]/i.test(t)) continue;
    kept.push(t);
  }
  // Reconstruir con párrafos separados por línea en blanco
  s = kept.join("\n");
  // Colapsar runs de blank lines
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function isLikelyBlockedHtml(text: string): boolean {
  const lower = text.toLowerCase().slice(0, 2000);
  return (
    lower.includes("attention required! | cloudflare") ||
    lower.includes("you are unable to access") ||
    lower.includes("just a moment...") ||
    lower.includes("access denied") ||
    lower.includes("forbidden") && lower.length < 1000
  );
}

function classifyContentType(
  contentType: string,
  url: string,
): "pdf" | "html" | "unknown" {
  const ct = contentType.toLowerCase();
  if (ct.includes("application/pdf")) return "pdf";
  if (ct.includes("text/html") || ct.includes("application/xhtml")) return "html";
  if (/\.pdf(\?|$)/i.test(url)) return "pdf";
  if (/\.html?(\?|$)/i.test(url)) return "html";
  return "unknown";
}

async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

async function loadManifest(): Promise<Manifest> {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8");
    return JSON.parse(raw) as Manifest;
  } catch {
    return {};
  }
}

async function saveManifest(m: Manifest) {
  const sorted: Manifest = {};
  for (const k of Object.keys(m).sort()) sorted[k] = m[k];
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + "\n", "utf8");
}

interface FichaInfo {
  slug: string;
  country: string;
  officialUrl: string;
  file: string;
}

async function loadFichas(args: Args): Promise<FichaInfo[]> {
  const files = await walk(REG_DIR);
  const out: FichaInfo[] = [];
  for (const f of files) {
    const raw = await fs.readFile(f, "utf8");
    const { data } = matter(raw);
    if (typeof data.slug !== "string" || typeof data.officialUrl !== "string") continue;
    if (args.country && data.country !== args.country) continue;
    if (args.slug && !data.slug.includes(args.slug)) continue;
    out.push({
      slug: data.slug,
      country: data.country,
      officialUrl: data.officialUrl,
      file: path.relative(ROOT, f),
    });
  }
  return args.limit ? out.slice(0, args.limit) : out;
}

async function processFicha(
  f: FichaInfo,
  manifest: Manifest,
  args: Args,
  failures: FailureLog[],
): Promise<"saved" | "skipped" | "failed"> {
  // Skip if already processed with same source URL
  const existing = manifest[f.slug];
  if (!args.force && existing && existing.source === f.officialUrl) {
    return "skipped";
  }

  const r = await curlFetch(f.officialUrl);
  if (r.error || r.httpCode === 0) {
    failures.push({
      slug: f.slug,
      source: f.officialUrl,
      reason: "network",
      details: r.error || `httpCode=${r.httpCode}`,
    });
    return "failed";
  }
  if (r.httpCode >= 400) {
    failures.push({
      slug: f.slug,
      source: f.officialUrl,
      reason: `http_${r.httpCode}`,
    });
    return "failed";
  }
  if (r.body.length < 200) {
    failures.push({
      slug: f.slug,
      source: f.officialUrl,
      reason: "empty_body",
      details: `${r.body.length} bytes`,
    });
    return "failed";
  }

  const kind = classifyContentType(r.contentType, r.finalUrl);
  let text = "";
  let sourceType: ManifestEntry["sourceType"] = "unknown";
  let notes: string | undefined;

  if (kind === "pdf") {
    const { text: t, error } = await extractPdfText(r.body);
    if (error || !t.trim()) {
      failures.push({
        slug: f.slug,
        source: f.officialUrl,
        reason: "pdf_extract_failed",
        details: error,
      });
      return "failed";
    }
    text = t;
    sourceType = "pdf";
  } else if (kind === "html") {
    const html = r.body.toString("utf8");
    if (isLikelyBlockedHtml(html)) {
      failures.push({
        slug: f.slug,
        source: f.officialUrl,
        reason: "html_blocked",
      });
      return "failed";
    }
    text = htmlToText(html);
    sourceType = "html";
    notes = "Extraído desde HTML; puede incluir navegación/pie del sitio";
  } else {
    // Try PDF magic bytes
    if (r.body.subarray(0, 4).toString("utf8") === "%PDF") {
      const { text: t, error } = await extractPdfText(r.body);
      if (error || !t.trim()) {
        failures.push({
          slug: f.slug,
          source: f.officialUrl,
          reason: "pdf_extract_failed",
          details: error,
        });
        return "failed";
      }
      text = t;
      sourceType = "pdf";
    } else {
      // Tratar como texto plano si parece ASCII
      const sample = r.body.subarray(0, 1024).toString("utf8");
      if (/^[\x09\x0a\x0d\x20-\x7e]*$/.test(sample)) {
        text = r.body.toString("utf8");
        sourceType = "text";
      } else {
        failures.push({
          slug: f.slug,
          source: f.officialUrl,
          reason: "unsupported_content_type",
          details: r.contentType,
        });
        return "failed";
      }
    }
  }

  // Normalizar whitespace básico para textos extraídos
  text = text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();

  if (text.length < 200) {
    failures.push({
      slug: f.slug,
      source: f.officialUrl,
      reason: "extracted_too_short",
      details: `${text.length} chars`,
    });
    return "failed";
  }

  // Guardar
  const outPath = path.join(TEXT_DIR, `${f.slug}.txt`);
  await ensureDir(path.dirname(outPath));
  await fs.writeFile(outPath, text, "utf8");
  manifest[f.slug] = {
    source: f.officialUrl,
    sourceType,
    fetchedAt: new Date().toISOString(),
    bytes: Buffer.byteLength(text, "utf8"),
    notes,
  };
  return "saved";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = await loadManifest();
  const fichas = await loadFichas(args);
  console.log(`Procesando ${fichas.length} fichas (force=${args.force})`);

  let saved = 0;
  let skipped = 0;
  let failed = 0;
  const failures: FailureLog[] = [];

  // Concurrencia controlada para no saturar
  const CONCURRENCY = 4;
  let cursor = 0;
  async function worker(workerId: number) {
    while (cursor < fichas.length) {
      const idx = cursor++;
      const f = fichas[idx];
      const label = `[${(idx + 1).toString().padStart(3)}/${fichas.length}]`;
      try {
        const status = await processFicha(f, manifest, args, failures);
        if (status === "saved") {
          saved++;
          const m = manifest[f.slug];
          console.log(
            `${label} ✓ ${f.slug}  (${m.sourceType}, ${(m.bytes / 1024).toFixed(1)} KB)`,
          );
        } else if (status === "skipped") {
          skipped++;
          console.log(`${label} · ${f.slug}  (cacheado)`);
        } else {
          failed++;
          const last = failures[failures.length - 1];
          console.log(
            `${label} ✗ ${f.slug}  (${last?.reason}${last?.details ? ": " + last.details.slice(0, 60) : ""})`,
          );
        }
      } catch (e) {
        failed++;
        failures.push({
          slug: f.slug,
          source: f.officialUrl,
          reason: "exception",
          details: (e as Error).message,
        });
        console.log(`${label} ✗ ${f.slug}  (exception)`);
      }
      // Persistir manifest cada 10 fichas para no perder progreso
      if ((saved + failed) % 10 === 0) {
        await saveManifest(manifest);
      }
    }
  }

  await Promise.all(
    Array.from({ length: CONCURRENCY }, (_, i) => worker(i)),
  );

  await saveManifest(manifest);

  // Guardar log de fallos para retry/manual
  const failuresPath = path.join(TEXT_DIR, "_failures.json");
  await fs.writeFile(failuresPath, JSON.stringify(failures, null, 2) + "\n", "utf8");

  console.log("\n=== Resumen ===");
  console.log(`  Guardados:  ${saved}`);
  console.log(`  Saltados:   ${skipped}`);
  console.log(`  Fallidos:   ${failed}`);
  console.log(`  Manifest:   ${path.relative(ROOT, MANIFEST_PATH)}`);
  console.log(`  Fallos:     ${path.relative(ROOT, failuresPath)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
