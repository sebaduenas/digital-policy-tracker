"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Copy, Check, Download, Share2, Printer } from "lucide-react";
import type { Regulation } from "@/lib/schemas/regulation";
import { toAPA, toBibTeX, toRIS } from "@/lib/citations";

export function CitationButtons({ reg }: { reg: Regulation }) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = async (kind: "apa" | "bibtex" | "ris") => {
    const text =
      kind === "apa"
        ? toAPA(reg)
        : kind === "bibtex"
          ? toBibTeX(reg)
          : toRIS(reg);
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
  };

  const handleDownload = (
    kind: "bibtex" | "ris",
    text: string,
    ext: string,
    mime: string,
  ) => {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reg.id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: reg.shortTitle, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied("link");
      window.setTimeout(() => setCopied(null), 1800);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="font-medium mb-3 text-sm">Citar esta ficha</h4>
      <div className="flex flex-wrap gap-2">
        <Button variant="soft" size="sm" onClick={() => handleCopy("apa")}>
          {copied === "apa" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied === "apa" ? "APA copiada" : "Copiar APA"}
        </Button>
        <Button
          variant="soft"
          size="sm"
          onClick={() =>
            handleDownload(
              "bibtex",
              toBibTeX(reg),
              "bib",
              "application/x-bibtex",
            )
          }
        >
          <Download className="h-3.5 w-3.5" />
          BibTeX
        </Button>
        <Button
          variant="soft"
          size="sm"
          onClick={() =>
            handleDownload("ris", toRIS(reg), "ris", "application/x-research-info-systems")
          }
        >
          <Download className="h-3.5 w-3.5" />
          RIS
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          {copied === "link" ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Share2 className="h-3.5 w-3.5" />
          )}
          {copied === "link" ? "Enlace copiado" : "Compartir"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" />
          Imprimir / PDF
        </Button>
      </div>
      <p className="mt-3 text-xs text-fg-muted leading-relaxed">
        Cita sugerida:{" "}
        <span className="text-fg font-mono text-[0.7rem]">{toAPA(reg)}</span>
      </p>
    </div>
  );
}
