/*
 * Reintenta los fallos guardados en public/texts/_failures.json aplicando
 * estrategias específicas por razón:
 *
 *  - network (SSL cert, timeouts):
 *      curl con -k (insecure SSL) + timeouts mayores + --tlsv1.2 + --http1.1
 *  - http_403 (Cloudflare):
 *      headers tipo browser completos (Sec-Fetch-*, Accept-Language, Referer)
 *  - extracted_too_short (landing pages):
 *      buscar primer enlace .pdf en el HTML y seguirlo
 *  - pdf_extract_failed (PDFs problemáticos):
 *      pdfplumber → si vacío, OCR con tesseract (pdftoppm → tesseract por página)
 *
 * Idempotente: si el slug ya tiene texto válido en el manifest se salta.
 *
 * Uso:
 *   pnpm exec tsx scripts/retry-failed-texts.ts [--reason X] [--slug PATTERN]
 *                                                [--limit N] [--force]
 */
import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

const ROOT = process.cwd();
const TEXT_DIR = path.join(ROOT, "public", "texts");
const MANIFEST_PATH = path.join(TEXT_DIR, "_manifest.json");
const FAILURES_PATH = path.join(TEXT_DIR, "_failures.json");

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
  reason?: string;
  slug?: string;
  limit?: number;
  force: boolean;
}

function parseArgs(argv: string[]): Args {
  const out: Args = { force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--reason") out.reason = argv[++i];
    else if (a === "--slug") out.slug = argv[++i];
    else if (a === "--limit") out.limit = parseInt(argv[++i], 10);
    else if (a === "--force") out.force = true;
  }
  return out;
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

async function curlFetchWith(
  url: string,
  opts: { insecure?: boolean; browserHeaders?: boolean; timeoutMs?: number },
): Promise<{
  body: Buffer;
  contentType: string;
  httpCode: number;
  finalUrl: string;
  error?: string;
}> {
  const SENTINEL = "<<<META-SEP>>>";
  const args = [
    "-sSL",
    "--max-time",
    "90",
    "--connect-timeout",
    "20",
    "--http1.1",
    "--tlsv1.2",
    "-A",
    UA,
    "-H",
    "Accept-Language: es-419,es;q=0.9,en;q=0.7,pt;q=0.5,fr;q=0.3",
    "-H",
    "Accept: text/html,application/xhtml+xml,application/pdf,application/xml;q=0.9,*/*;q=0.8",
    "-H",
    "Accept-Encoding: gzip, deflate, br",
    "--compressed",
    "-w",
    `${SENTINEL}%{content_type}\\n%{http_code}\\n%{url_effective}\\n`,
  ];
  if (opts.insecure) args.unshift("-k");
  if (opts.browserHeaders) {
    args.push(
      "-H",
      "Sec-Ch-Ua: \"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
      "-H",
      "Sec-Ch-Ua-Mobile: ?0",
      "-H",
      'Sec-Ch-Ua-Platform: "macOS"',
      "-H",
      "Sec-Fetch-Dest: document",
      "-H",
      "Sec-Fetch-Mode: navigate",
      "-H",
      "Sec-Fetch-Site: none",
      "-H",
      "Sec-Fetch-User: ?1",
      "-H",
      "Upgrade-Insecure-Requests: 1",
      "-H",
      "Cache-Control: max-age=0",
      "-H",
      `Referer: ${new URL(url).origin}/`,
    );
  }
  args.push(url);
  const { stdout, stderr, code } = await run("curl", args, {
    timeoutMs: opts.timeoutMs ?? 120_000,
  });
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
    return { body: stdout, contentType: "", httpCode: 200, finalUrl: url };
  }
  const body = stdout.subarray(0, idx);
  const meta = stdout
    .subarray(idx + SENTINEL.length)
    .toString("utf8")
    .trim()
    .split("\n");
  const [contentType = "", httpCodeStr = "0", finalUrl = url] = meta;
  return {
    body,
    contentType: contentType.toLowerCase(),
    httpCode: parseInt(httpCodeStr, 10),
    finalUrl,
  };
}

async function extractPdfTextPoppler(buf: Buffer): Promise<string> {
  const tmp = path.join(tmpdir(), `dpt-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`);
  await fs.writeFile(tmp, buf);
  try {
    const { stdout, code } = await run(
      "pdftotext",
      ["-layout", "-enc", "UTF-8", "-nopgbrk", tmp, "-"],
      { timeoutMs: 120_000 },
    );
    if (code !== 0) return "";
    return stdout.toString("utf8");
  } finally {
    fs.unlink(tmp).catch(() => {});
  }
}

async function extractPdfTextPdfplumber(buf: Buffer): Promise<string> {
  const tmp = path.join(tmpdir(), `dpt-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`);
  await fs.writeFile(tmp, buf);
  try {
    const py = `
import sys, json
import pdfplumber
out = []
with pdfplumber.open(sys.argv[1]) as pdf:
    for page in pdf.pages:
        t = page.extract_text() or ""
        if t.strip(): out.append(t)
print("\\n\\n".join(out))
`;
    const { stdout, code } = await run("python3", ["-c", py, tmp], {
      timeoutMs: 180_000,
    });
    if (code !== 0) return "";
    return stdout.toString("utf8");
  } finally {
    fs.unlink(tmp).catch(() => {});
  }
}

async function extractPdfTextOCR(buf: Buffer): Promise<string> {
  // pdftoppm para convertir cada página a PNG y luego tesseract OCR.
  const stem = path.join(tmpdir(), `dpt-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const pdfPath = `${stem}.pdf`;
  await fs.writeFile(pdfPath, buf);
  try {
    // Renderizar páginas a PNG (-r 200 dpi para mejor OCR)
    const { code } = await run(
      "pdftoppm",
      ["-r", "200", "-png", pdfPath, stem],
      { timeoutMs: 240_000 },
    );
    if (code !== 0) return "";
    // Encontrar PNGs generados
    const dir = path.dirname(stem);
    const base = path.basename(stem);
    const entries = await fs.readdir(dir);
    const pages = entries
      .filter((n) => n.startsWith(base) && n.endsWith(".png"))
      .sort();
    let text = "";
    for (const page of pages) {
      const pagePath = path.join(dir, page);
      const { stdout, code: c } = await run(
        "tesseract",
        [pagePath, "-", "-l", "spa+por+eng", "--psm", "1"],
        { timeoutMs: 120_000 },
      );
      if (c === 0) text += stdout.toString("utf8") + "\n\n";
      await fs.unlink(pagePath).catch(() => {});
    }
    return text;
  } finally {
    fs.unlink(pdfPath).catch(() => {});
  }
}

function htmlToText(html: string): string {
  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<template[\s\S]*?<\/template>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  s = s
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*\/\s*(p|div|section|article|li|tr|h[1-6])\s*>/gi, "\n")
    .replace(/<\s*li\s*[^>]*>/gi, "\n• ")
    .replace(/<\s*\/?\s*[^>]+>/g, " ");
  s = s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&[a-z]+;/gi, " ");
  s = s.replace(/[ \t\f\v]+/g, " ").replace(/ *\n */g, "\n");
  const lines = s.split("\n");
  const kept: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (t === "" || t === "•" || t === "·" || t === "-") continue;
    if (t.length <= 2 && !/[a-záéíóúüñ]/i.test(t)) continue;
    kept.push(t);
  }
  s = kept.join("\n").replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function findPdfLinks(html: string, baseUrl: string): string[] {
  const links = new Set<string>();
  const re = /href\s*=\s*["']([^"']+\.pdf[^"']*)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      links.add(new URL(m[1], baseUrl).toString());
    } catch {}
  }
  return Array.from(links);
}

function normalizeText(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

async function tryPdfExtraction(buf: Buffer): Promise<{
  text: string;
  method: "pdftotext" | "pdfplumber" | "ocr" | "none";
}> {
  let text = await extractPdfTextPoppler(buf);
  if (text.trim().length > 200) return { text, method: "pdftotext" };
  text = await extractPdfTextPdfplumber(buf);
  if (text.trim().length > 200) return { text, method: "pdfplumber" };
  // OCR como último recurso
  text = await extractPdfTextOCR(buf);
  if (text.trim().length > 200) return { text, method: "ocr" };
  return { text: "", method: "none" };
}

async function processFailure(
  f: FailureLog,
  manifest: Manifest,
): Promise<{
  ok: boolean;
  reason?: string;
  details?: string;
  sourceType?: ManifestEntry["sourceType"];
  notes?: string;
  text?: string;
}> {
  // Re-mapeo: ciertos reasons emitidos por una pasada previa de retry deben
  // ser tratados como el caso original equivalente.
  const REASON_REMAP: Record<string, string> = {
    no_pdf_link_in_landing: "extracted_too_short",
    not_pdf: "extracted_too_short",
    empty_body: "http_403",
    unknown_reason: "extracted_too_short",
  };
  const reason = REASON_REMAP[f.reason] ?? f.reason;

  // Network → reintentar con -k (insecure SSL) + timeouts grandes
  if (reason === "network") {
    const r = await curlFetchWith(f.source, {
      insecure: true,
      browserHeaders: true,
      timeoutMs: 150_000,
    });
    if (r.error || r.httpCode === 0) {
      return { ok: false, reason: "network", details: r.error };
    }
    if (r.httpCode >= 400) return { ok: false, reason: `http_${r.httpCode}` };

    const ct = r.contentType;
    if (ct.includes("pdf") || r.body.subarray(0, 4).toString("utf8") === "%PDF") {
      const { text, method } = await tryPdfExtraction(r.body);
      if (text) {
        return {
          ok: true,
          sourceType: "pdf",
          text: normalizeText(text),
          notes: method === "ocr" ? "Texto extraído por OCR" : undefined,
        };
      }
      return { ok: false, reason: "pdf_extract_failed" };
    }
    const html = r.body.toString("utf8");
    const text = htmlToText(html);
    if (text.length < 200) {
      return { ok: false, reason: "extracted_too_short", details: `${text.length} chars` };
    }
    return {
      ok: true,
      sourceType: "html",
      text: normalizeText(text),
      notes: "Extraído desde HTML; puede incluir navegación/pie del sitio",
    };
  }

  // http_403 → headers tipo browser
  if (reason === "http_403") {
    const r = await curlFetchWith(f.source, {
      insecure: true,
      browserHeaders: true,
      timeoutMs: 60_000,
    });
    if (r.httpCode === 403)
      return { ok: false, reason: "http_403", details: "still blocked" };
    if (r.httpCode >= 400)
      return { ok: false, reason: `http_${r.httpCode}` };
    if (r.error || r.body.length < 200)
      return { ok: false, reason: "empty_body" };
    const html = r.body.toString("utf8");
    const text = htmlToText(html);
    if (text.length < 200)
      return { ok: false, reason: "extracted_too_short", details: `${text.length} chars` };
    return {
      ok: true,
      sourceType: "html",
      text: normalizeText(text),
    };
  }

  // extracted_too_short → buscar PDF link en el HTML y seguirlo
  if (reason === "extracted_too_short") {
    const r = await curlFetchWith(f.source, {
      insecure: true,
      browserHeaders: true,
    });
    if (r.error || r.httpCode >= 400)
      return { ok: false, reason: "network", details: r.error };
    const html = r.body.toString("utf8");
    const pdfLinks = findPdfLinks(html, r.finalUrl);
    if (pdfLinks.length === 0) {
      // Reintentar con HTML simple — quizá ahora hay más contenido
      const text = htmlToText(html);
      if (text.length >= 500) {
        return {
          ok: true,
          sourceType: "html",
          text: normalizeText(text),
          notes: "Extraído desde HTML; puede incluir navegación/pie del sitio",
        };
      }
      return {
        ok: false,
        reason: "no_pdf_link_in_landing",
        details: `${text.length} chars and 0 PDF links`,
      };
    }
    // Seguir el primer PDF link
    for (const pdfUrl of pdfLinks.slice(0, 3)) {
      const p = await curlFetchWith(pdfUrl, {
        insecure: true,
        browserHeaders: true,
      });
      if (p.error || p.httpCode >= 400) continue;
      if (p.body.length < 1000) continue;
      const { text, method } = await tryPdfExtraction(p.body);
      if (text) {
        return {
          ok: true,
          sourceType: "pdf",
          text: normalizeText(text),
          notes: `PDF descubierto en landing (${pdfUrl}); ${method === "ocr" ? "OCR" : "texto"}`,
        };
      }
    }
    return {
      ok: false,
      reason: "pdf_extract_failed",
      details: `Tried ${pdfLinks.length} PDF link(s)`,
    };
  }

  // pdf_extract_failed → reintentar download + tryPdfExtraction (pdfplumber + OCR)
  if (reason === "pdf_extract_failed") {
    const r = await curlFetchWith(f.source, {
      insecure: true,
      browserHeaders: true,
      timeoutMs: 120_000,
    });
    if (r.error || r.httpCode >= 400)
      return { ok: false, reason: "network", details: r.error };
    if (r.body.subarray(0, 4).toString("utf8") !== "%PDF") {
      return { ok: false, reason: "not_pdf" };
    }
    const { text, method } = await tryPdfExtraction(r.body);
    if (text) {
      return {
        ok: true,
        sourceType: "pdf",
        text: normalizeText(text),
        notes: method === "ocr" ? "Texto extraído por OCR" : `Extracción via ${method}`,
      };
    }
    return { ok: false, reason: "pdf_extract_failed" };
  }

  return { ok: false, reason: "unknown_reason" };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifestRaw = await fs.readFile(MANIFEST_PATH, "utf8");
  const manifest: Manifest = JSON.parse(manifestRaw);
  const failuresRaw = await fs.readFile(FAILURES_PATH, "utf8");
  let failures: FailureLog[] = JSON.parse(failuresRaw);
  let candidates = failures;
  if (args.reason) candidates = candidates.filter((f) => f.reason === args.reason);
  if (args.slug) candidates = candidates.filter((f) => f.slug.includes(args.slug!));
  if (args.limit) candidates = candidates.slice(0, args.limit);

  console.log(`Reintentando ${candidates.length} fallos`);
  const recovered: string[] = [];
  const stillFailing: FailureLog[] = [];

  // Concurrencia menor porque algunos hacen OCR (CPU)
  const CONCURRENCY = 3;
  let cursor = 0;
  async function worker() {
    while (cursor < candidates.length) {
      const idx = cursor++;
      const f = candidates[idx];
      const label = `[${(idx + 1).toString().padStart(3)}/${candidates.length}]`;
      try {
        const result = await processFailure(f, manifest);
        if (result.ok && result.text && result.sourceType) {
          const outPath = path.join(TEXT_DIR, `${f.slug}.txt`);
          await fs.mkdir(path.dirname(outPath), { recursive: true });
          await fs.writeFile(outPath, result.text, "utf8");
          manifest[f.slug] = {
            source: f.source,
            sourceType: result.sourceType,
            fetchedAt: new Date().toISOString(),
            bytes: Buffer.byteLength(result.text, "utf8"),
            notes: result.notes,
          };
          recovered.push(f.slug);
          console.log(
            `${label} ✓ ${f.slug}  (${result.sourceType}, ${(Buffer.byteLength(result.text) / 1024).toFixed(1)} KB${result.notes ? ", " + result.notes : ""})`,
          );
        } else {
          stillFailing.push({
            slug: f.slug,
            source: f.source,
            reason: result.reason || "unknown",
            details: result.details,
          });
          console.log(
            `${label} ✗ ${f.slug}  (${result.reason}${result.details ? ": " + result.details.slice(0, 60) : ""})`,
          );
        }
      } catch (e) {
        stillFailing.push({
          slug: f.slug,
          source: f.source,
          reason: "exception",
          details: (e as Error).message,
        });
        console.log(`${label} ✗ ${f.slug}  (exception)`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  // Persistir manifest
  const sorted: Manifest = {};
  for (const k of Object.keys(manifest).sort()) sorted[k] = manifest[k];
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + "\n", "utf8");

  // Actualizar _failures.json eliminando los recuperados
  const recoveredSet = new Set(recovered);
  const updatedFailures = failures
    .filter((f) => !recoveredSet.has(f.slug))
    .map((f) => stillFailing.find((s) => s.slug === f.slug) ?? f);
  await fs.writeFile(FAILURES_PATH, JSON.stringify(updatedFailures, null, 2) + "\n", "utf8");

  console.log("\n=== Resumen ===");
  console.log(`  Recuperados: ${recovered.length}`);
  console.log(`  Aún fallan:  ${stillFailing.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
