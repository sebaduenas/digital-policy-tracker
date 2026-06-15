"use client";

import Link from "next/link";
import { Mail, Linkedin } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export function MainFooter() {
  const { t, locale } = useLocale();

  return (
    <footer className="mt-20 border-t border-border bg-bg-sunken/40">
      <div className="px-4 sm:px-8 lg:px-10 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div className="md:col-span-1">
          <p className="font-display text-base font-medium">
            Policy Tracker LATAM
          </p>
          <p className="mt-2 text-fg-muted leading-relaxed text-xs">
            {t("footer.tagline")}
          </p>
          {locale === "en" && (
            <p className="mt-2 text-fg-muted/80 leading-relaxed text-[0.65rem] italic">
              {t("footer.contentNotice")}
            </p>
          )}
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-fg-muted md:col-span-1">
          <Link className="hover:text-fg" href="/metodologia">
            {t("nav.methodology")}
          </Link>
          <Link className="hover:text-fg" href="/glosario">
            {t("nav.glossary")}
          </Link>
          <Link className="hover:text-fg" href="/about">
            {t("nav.about")}
          </Link>
          <Link className="hover:text-fg" href="/tags">
            {t("nav.tags")}
          </Link>
        </nav>
        <div className="flex md:justify-end gap-3 items-center text-fg-muted text-xs md:col-span-1">
          <a
            className="inline-flex items-center gap-1 hover:text-fg"
            href="mailto:contacto@policytracker.lat"
          >
            <Mail className="h-3.5 w-3.5" /> {t("footer.contact")}
          </a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="px-4 sm:px-8 lg:px-10 py-3 text-[0.65rem] text-fg-muted flex flex-wrap justify-between items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Policy Tracker LATAM</span>
            <span className="text-fg-muted/40">·</span>
            <span>
              {t("footer.maintainer")}{" "}
              <a
                href="https://www.linkedin.com/in/sebastianduenas/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-fg hover:text-accent transition-colors font-medium"
              >
                Sebastián Dueñas Müller
                <Linkedin className="h-3 w-3" />
              </a>
            </span>
          </span>
          <span>{t("footer.disclaimer")}</span>
        </div>
      </div>
    </footer>
  );
}
