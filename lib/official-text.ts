import { promises as fs } from "node:fs";
import path from "node:path";

const TEXTS_DIR = path.join(process.cwd(), "content", "texts");
const MANIFEST_PATH = path.join(TEXTS_DIR, "_manifest.json");

export interface OfficialTextMeta {
  source: string;
  sourceType: "pdf" | "html" | "text" | "manual" | "unknown";
  fetchedAt: string;
  bytes: number;
  notes?: string;
}

export interface OfficialText {
  text: string;
  meta: OfficialTextMeta;
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

export async function loadOfficialText(
  slug: string,
): Promise<OfficialText | null> {
  const manifest = await readManifest();
  const meta = manifest[slug];
  if (!meta) return null;
  const filePath = path.join(TEXTS_DIR, `${slug}.txt`);
  try {
    const text = await fs.readFile(filePath, "utf8");
    return { text, meta };
  } catch {
    return null;
  }
}

export async function listSlugsWithText(): Promise<string[]> {
  const manifest = await readManifest();
  return Object.keys(manifest);
}
