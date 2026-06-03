import { promises as fs } from "node:fs";
import path from "node:path";

// Texts live in /public/texts so they are served as static assets
// (/texts/{slug}.txt) and can also be read at build-time / by server routes
// without being inlined into every SSG HTML page.
const TEXTS_DIR = path.join(process.cwd(), "public", "texts");
const MANIFEST_PATH = path.join(TEXTS_DIR, "_manifest.json");

export interface OfficialTextMeta {
  source: string;
  sourceType: "pdf" | "html" | "text" | "manual" | "unknown";
  fetchedAt: string;
  bytes: number;
  notes?: string;
}

type Manifest = Record<string, OfficialTextMeta>;

let manifestCache: Manifest | null = null;

async function readManifest(): Promise<Manifest> {
  if (manifestCache) return manifestCache;
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8");
    manifestCache = JSON.parse(raw) as Manifest;
  } catch {
    manifestCache = {};
  }
  return manifestCache;
}

/** Returns metadata only. The text itself is served lazily from /texts/{slug}.txt. */
export async function loadOfficialTextMeta(
  slug: string,
): Promise<OfficialTextMeta | null> {
  const manifest = await readManifest();
  return manifest[slug] ?? null;
}

/** Reads the raw text from disk. Use only in server routes (CSV export, etc.). */
export async function loadOfficialText(slug: string): Promise<string | null> {
  const filePath = path.join(TEXTS_DIR, `${slug}.txt`);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

export async function listSlugsWithText(): Promise<string[]> {
  const manifest = await readManifest();
  return Object.keys(manifest);
}
