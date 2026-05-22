import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  RegulationFrontmatterSchema,
  type Regulation,
} from "@/lib/schemas/regulation";

const CONTENT_DIR = path.join(process.cwd(), "content", "regulations");

let cache: Regulation[] | null = null;

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const res = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(res);
      if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md"))
        return [res];
      return [];
    }),
  );
  return files.flat();
}

export async function loadRegulations(): Promise<Regulation[]> {
  if (cache && process.env.NODE_ENV === "production") return cache;

  const files = await walk(CONTENT_DIR);
  const regulations: Regulation[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const { data, content } = matter(raw);
    const parsed = RegulationFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      errors.push(
        `[${path.relative(process.cwd(), file)}] ${parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ")}`,
      );
      continue;
    }
    regulations.push({
      ...(parsed.data as Regulation),
      body: content.trim(),
      filePath: path.relative(process.cwd(), file),
    });
  }

  if (errors.length) {
    console.error("Content validation errors:\n" + errors.join("\n"));
    throw new Error(
      `Hay ${errors.length} ficha(s) inválida(s). Revisa los frontmatters.`,
    );
  }

  regulations.sort((a, b) => {
    const dateA = a.publicationDate || a.introductionDate || "0000";
    const dateB = b.publicationDate || b.introductionDate || "0000";
    return dateB.localeCompare(dateA);
  });

  cache = regulations;
  return regulations;
}

export async function getRegulationBySlug(
  slug: string,
): Promise<Regulation | undefined> {
  const all = await loadRegulations();
  return all.find((r) => r.slug === slug);
}

export async function getRegulationById(
  id: string,
): Promise<Regulation | undefined> {
  const all = await loadRegulations();
  return all.find((r) => r.id === id);
}
