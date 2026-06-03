import { NextResponse } from "next/server";
import { getIndex } from "@/lib/index";
import { toCSV } from "@/lib/csv";
import { loadOfficialText } from "@/lib/official-text";

export const dynamic = "force-static";
export const revalidate = false;

/**
 * Returns the full catalog as CSV with an `officialText` column containing
 * the raw extracted official text per ficha (when available).
 *
 * This is the "heavy" export aimed at researchers wanting to do text
 * analytics. The lightweight client-side CSV (built in the catalog) omits
 * the text column and is therefore much smaller.
 */
export async function GET() {
  const index = await getIndex();
  const textsBySlug = new Map<string, string>();
  await Promise.all(
    index
      .filter((r) => r.hasOfficialText)
      .map(async (r) => {
        const text = await loadOfficialText(r.slug);
        if (text) textsBySlug.set(r.slug, text);
      }),
  );
  const csv = toCSV(index, textsBySlug);
  const today = new Date().toISOString().slice(0, 10);
  const filename = `policy-tracker-latam-${today}-con-textos.csv`;
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
