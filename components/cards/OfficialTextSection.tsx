import { FileText, ExternalLink } from "lucide-react";
import type { OfficialTextMeta } from "@/lib/schemas/regulation";

const SOURCE_TYPE_LABEL: Record<OfficialTextMeta["sourceType"], string> = {
  pdf: "PDF",
  html: "HTML",
  text: "Texto plano",
  manual: "Carga manual",
  unknown: "Desconocido",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function OfficialTextSection({
  text,
  meta,
}: {
  text: string;
  meta: OfficialTextMeta;
}) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const lineCount = text.split("\n").length;
  return (
    <section className="mt-10 pt-6 border-t border-border">
      <details className="group rounded-lg border border-border bg-bg-elevated/40 overflow-hidden">
        <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between gap-3 hover:bg-bg-elevated transition-colors">
          <span className="flex items-center gap-2 text-sm font-medium text-fg">
            <FileText className="h-4 w-4 text-accent" />
            Texto oficial
            <span className="text-xs font-normal text-fg-muted">
              · {wordCount.toLocaleString("es")} palabras · {formatBytes(meta.bytes)}
            </span>
          </span>
          <span className="text-xs text-fg-muted group-open:rotate-180 transition-transform">
            ▾
          </span>
        </summary>
        <div className="border-t border-border bg-bg-sunken/40">
          <div className="px-4 py-2 text-[0.7rem] text-fg-muted flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              Origen:{" "}
              <a
                href={meta.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline inline-flex items-center gap-0.5"
              >
                {SOURCE_TYPE_LABEL[meta.sourceType]} oficial
                <ExternalLink className="h-3 w-3" />
              </a>
            </span>
            <span>·</span>
            <span>Extraído el {meta.fetchedAt.slice(0, 10)}</span>
            <span>·</span>
            <span>{lineCount.toLocaleString("es")} líneas</span>
            {meta.notes && (
              <>
                <span>·</span>
                <span title={meta.notes}>{meta.notes}</span>
              </>
            )}
          </div>
          <pre className="px-4 py-3 max-h-[60vh] overflow-auto text-xs leading-relaxed text-fg whitespace-pre-wrap font-mono scrollbar-thin">
            {text}
          </pre>
          <div className="px-4 py-2 border-t border-border bg-bg-sunken/60 text-[0.7rem] text-fg-muted">
            El texto extraído es una reproducción automatizada del documento
            oficial enlazado y puede contener imperfecciones de formato. Para
            usos jurídicos remítase siempre a la versión publicada en la fuente
            oficial.
          </div>
        </div>
      </details>
    </section>
  );
}
