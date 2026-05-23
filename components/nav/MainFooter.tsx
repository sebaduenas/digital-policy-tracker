"use client";

import Link from "next/link";
import { Mail, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function MainFooter() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = resolvedTheme || theme;

  return (
    <footer className="mt-20 border-t border-border bg-bg-sunken/40">
      <div className="px-4 sm:px-8 lg:px-10 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div className="md:col-span-1">
          <p className="font-display text-base font-medium">
            Policy Tracker LATAM
          </p>
          <p className="mt-2 text-fg-muted leading-relaxed text-xs">
            Mapa curado de la regulación de nuevas tecnologías en América
            Latina. Contenido bajo licencia CC BY 4.0.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-fg-muted md:col-span-1">
          <Link className="hover:text-fg" href="/metodologia">
            Metodología
          </Link>
          <Link className="hover:text-fg" href="/glosario">
            Glosario
          </Link>
          <Link className="hover:text-fg" href="/about">
            About
          </Link>
          <Link className="hover:text-fg" href="/tags">
            Tags
          </Link>
        </nav>
        <div className="flex md:justify-end gap-3 items-center text-fg-muted text-xs md:col-span-1">
          <a
            className="inline-flex items-center gap-1 hover:text-fg"
            href="mailto:contacto@policytracker.lat"
          >
            <Mail className="h-3.5 w-3.5" /> Contacto
          </a>
          <button
            type="button"
            onClick={() => setTheme(current === "dark" ? "light" : "dark")}
            aria-label="Cambiar tema"
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-fg-muted hover:text-fg hover:bg-bg-sunken transition-colors"
          >
            {mounted ? (
              current === "dark" ? (
                <>
                  <Sun className="h-3.5 w-3.5" /> Tema claro
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5" /> Tema oscuro
                </>
              )
            ) : (
              <span className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="px-4 sm:px-8 lg:px-10 py-3 text-[0.65rem] text-fg-muted flex flex-wrap justify-between items-center gap-2">
          <span>© {new Date().getFullYear()} Policy Tracker LATAM</span>
          <span>No constituye asesoría legal. Verifica fuentes oficiales.</span>
        </div>
      </div>
    </footer>
  );
}
