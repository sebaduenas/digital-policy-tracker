/*
 * Registra textos agregados manualmente al manifest.
 *
 * Flujo esperado:
 *   1. Pones un archivo .txt en public/texts/{cc}/{slug}.txt
 *   2. Opcionalmente: un sidecar public/texts/{cc}/{slug}.source.txt con
 *      la URL que usaste para conseguir el texto (una línea). Si no existe
 *      el sidecar, se usa la URL original que tiene _failures.json.
 *   3. Corres: pnpm exec tsx scripts/register-manual-texts.ts
 *
 * El script:
 *  - Encuentra .txt en public/texts/** que NO estén en el manifest.
 *  - Para cada uno, busca el slug en _failures.json para tomar la URL
 *    original (o usa el sidecar si existe).
 *  - Lo registra en _manifest.json con sourceType: "manual" y fecha actual.
 *  - Lo remueve de _failures.json.
 *  - Imprime un resumen.
 *
 * Flags:
 *   --dry-run     muestra qué haría sin escribir.
 *   --source-type pdf|html|text|manual  (default: manual)
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TEXT_DIR = path.join(ROOT, "public", "texts");
const MANIFEST_PATH = path.join(TEXT_DIR, "_manifest.json");
const FAILURES_PATH = path.join(TEXT_DIR, "_failures.json");

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
  dryRun: boolean;
  sourceType: ManifestEntry["sourceType"];
}

function parseArgs(argv: string[]): Args {
  const out: Args = { dryRun: false, sourceType: "manual" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--source-type") {
      const v = argv[++i] as ManifestEntry["sourceType"];
      if (["pdf", "html", "text", "manual"].includes(v)) out.sourceType = v;
    }
  }
  return out;
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return walk(p);
      if (e.name.endsWith(".txt") && !e.name.endsWith(".source.txt")) return [p];
      return [];
    }),
  );
  return files.flat();
}

async function readJson<T>(p: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifest = await readJson<Manifest>(MANIFEST_PATH, {});
  let failures = await readJson<FailureLog[]>(FAILURES_PATH, []);
  const failuresBySlug = new Map(failures.map((f) => [f.slug, f]));

  const files = await walk(TEXT_DIR);
  const added: string[] = [];
  const skipped: string[] = [];

  for (const file of files) {
    const rel = path.relative(TEXT_DIR, file);
    const slug = rel.replace(/\.txt$/, "");
    if (manifest[slug]) {
      skipped.push(slug);
      continue;
    }
    const stats = await fs.stat(file);
    if (stats.size < 100) {
      console.log(`✗ ${slug}  (archivo muy pequeño, ${stats.size} bytes)`);
      continue;
    }
    // Buscar URL: sidecar o failures.json
    let source = "";
    const sidecarPath = file.replace(/\.txt$/, ".source.txt");
    try {
      const raw = await fs.readFile(sidecarPath, "utf8");
      source = raw.trim().split("\n")[0].trim();
    } catch {
      source = failuresBySlug.get(slug)?.source ?? "";
    }
    if (!source) {
      console.log(`✗ ${slug}  (sin URL: ni sidecar ni failures.json)`);
      continue;
    }
    const entry: ManifestEntry = {
      source,
      sourceType: args.sourceType,
      fetchedAt: new Date().toISOString(),
      bytes: stats.size,
      notes: "Carga manual",
    };
    if (!args.dryRun) {
      manifest[slug] = entry;
      // Borrar sidecar para mantener limpia la carpeta
      try {
        await fs.unlink(sidecarPath);
      } catch {}
    }
    added.push(slug);
    console.log(`✓ ${slug}  (${(stats.size / 1024).toFixed(1)} KB)`);
  }

  if (added.length > 0 && !args.dryRun) {
    // Persistir manifest ordenado
    const sorted: Manifest = {};
    for (const k of Object.keys(manifest).sort()) sorted[k] = manifest[k];
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(sorted, null, 2) + "\n", "utf8");
    // Quitar de failures
    const addedSet = new Set(added);
    failures = failures.filter((f) => !addedSet.has(f.slug));
    await fs.writeFile(FAILURES_PATH, JSON.stringify(failures, null, 2) + "\n", "utf8");
  }

  console.log("\n=== Resumen ===");
  console.log(`  Registrados: ${added.length}`);
  console.log(`  Ya estaban:  ${skipped.length}`);
  console.log(`  Restantes en _failures.json: ${failures.length - (args.dryRun ? 0 : 0)}`);
  if (args.dryRun) console.log("  (dry-run — no se escribió nada)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
