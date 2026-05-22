import type { Regulation } from "@/lib/schemas/regulation";
import {
  COUNTRIES,
  NORM_TYPES,
  BRANCHES,
  type Branch,
  type CountryCode,
} from "@/lib/taxonomy";
import { formatDate } from "@/lib/utils";
import { ExternalLink, BookOpen } from "lucide-react";
import Link from "next/link";

export function RegulationDetailSidebar({ reg }: { reg: Regulation }) {
  const country = COUNTRIES[reg.country as CountryCode];
  return (
    <aside className="space-y-5 text-sm">
      <Block title="Identificación">
        <Row label="ID">{reg.id}</Row>
        <Row label="Cita">{reg.citation}</Row>
        <Row label="Tipo">{NORM_TYPES[reg.normType as keyof typeof NORM_TYPES]}</Row>
      </Block>

      <Block title="Jurisdicción">
        <Row label="País">
          <Link
            href={`/paises/${reg.country.toLowerCase()}`}
            className="hover:text-accent"
          >
            {country?.flag} {country?.name}
          </Link>
        </Row>
        {reg.applicationScope && (
          <Row label="Ámbito">{reg.applicationScope}</Row>
        )}
      </Block>

      <Block title="Vigencia">
        {reg.publicationDate && (
          <Row label="Publicación">{formatDate(reg.publicationDate)}</Row>
        )}
        {reg.effectiveDate && (
          <Row label="Entrada en vigor">{formatDate(reg.effectiveDate)}</Row>
        )}
        {reg.introductionDate && (
          <Row label="Ingreso a tramitación">
            {formatDate(reg.introductionDate)}
          </Row>
        )}
        {reg.lastStatusChange && (
          <Row label="Último cambio">{formatDate(reg.lastStatusChange)}</Row>
        )}
      </Block>

      {reg.legislativeFile && (
        <Block title="Tramitación">
          {reg.legislativeFile.boletinNumber && (
            <Row label="Boletín">{reg.legislativeFile.boletinNumber}</Row>
          )}
          {reg.legislativeFile.chamberOfOrigin && (
            <Row label="Cámara">{reg.legislativeFile.chamberOfOrigin}</Row>
          )}
          {reg.legislativeFile.currentStage && (
            <Row label="Etapa">{reg.legislativeFile.currentStage}</Row>
          )}
          {reg.legislativeFile.url && (
            <Row label="Expediente">
              <a
                className="inline-flex items-center gap-1 text-accent hover:underline"
                href={reg.legislativeFile.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver tramitación <ExternalLink className="h-3 w-3" />
              </a>
            </Row>
          )}
        </Block>
      )}

      {reg.enforcingAuthority && reg.enforcingAuthority.length > 0 && (
        <Block title="Autoridad de aplicación">
          <ul className="space-y-1 text-fg">
            {reg.enforcingAuthority.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </Block>
      )}

      {reg.branches && reg.branches.length > 0 && (
        <Block title="Rama del derecho">
          <p className="text-fg">
            {reg.branches
              .map((b) => BRANCHES[b as Branch] ?? b)
              .join(", ")}
          </p>
        </Block>
      )}

      <Block title="Recursos">
        <a
          href={reg.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-accent hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Texto oficial
        </a>
        {reg.pdfUrl && (
          <div className="mt-1">
            <a
              href={reg.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              PDF oficial
            </a>
          </div>
        )}
      </Block>

      {reg.sources && reg.sources.length > 0 && (
        <Block title="Fuentes">
          <ul className="space-y-2 text-xs">
            {reg.sources.map((s, i) => (
              <li key={i}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline inline-flex items-start gap-1"
                >
                  <BookOpen className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>{s.title}</span>
                </a>
                <p className="text-fg-muted ml-4">
                  {s.author ? `${s.author} · ` : ""}
                  {s.type} · accedido {s.accessedOn}
                </p>
              </li>
            ))}
          </ul>
        </Block>
      )}

      <Block title="Curaduría">
        <Row label="Editor">{reg.editor}</Row>
        <Row label="Confianza">
          <span
            className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-xs"
            style={{
              backgroundColor:
                reg.confidenceLevel === "alto"
                  ? "rgb(22 163 74 / 0.1)"
                  : reg.confidenceLevel === "medio"
                    ? "rgb(202 138 4 / 0.1)"
                    : "rgb(220 38 38 / 0.1)",
              color:
                reg.confidenceLevel === "alto"
                  ? "rgb(22 163 74)"
                  : reg.confidenceLevel === "medio"
                    ? "rgb(202 138 4)"
                    : "rgb(220 38 38)",
            }}
          >
            {reg.confidenceLevel.toUpperCase()}
          </span>
        </Row>
        <Row label="Versión">{reg.version}</Row>
        <Row label="Actualizada">{formatDate(reg.lastUpdated)}</Row>
      </Block>
    </aside>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-bg-elevated/40 p-4">
      <h4 className="text-[0.65rem] uppercase tracking-wider text-fg-muted font-medium mb-2.5">
        {title}
      </h4>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[0.7rem] text-fg-muted">{label}</span>
      <span className="text-fg leading-snug">{children}</span>
    </div>
  );
}
