"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Locale = "es" | "en";

type Dict = Record<string, string>;

const ES: Dict = {
  // Nav
  "nav.catalog": "Catálogo",
  "nav.countries": "Países",
  "nav.areas": "Materias",
  "nav.compare": "Comparar",
  "nav.dashboard": "Dashboard",
  "nav.tags": "Tags",
  "nav.methodology": "Metodología",
  "nav.glossary": "Glosario",
  "nav.about": "About",
  "nav.start": "Inicio",
  "nav.search": "Buscar normas…",
  "nav.menu": "Menú",
  "nav.openCatalog": "Abrir catálogo",
  // Hero
  "hero.title.before": "Tracker de regulación tecnológica para",
  "hero.title.accent": "LATAM",
  "hero.subtitle":
    "Normas, decretos y proyectos de ley sobre IA, datos personales, ciberseguridad, fintech, entre otros, en América Latina.",
  "hero.cta.primary": "Abrir catálogo",
  "hero.cta.secondary": "Comparar normas",
  // Country strip
  "country.title.before": "20 jurisdicciones",
  "country.title.accent": "en una sola vista",
  "country.title.suffix": ".",
  "country.subtitle":
    "Desde el Río Grande hasta Tierra del Fuego, con foco en jurisdicciones de mayor producción normativa tecnológica.",
  // Help section
  "help.title.before": "Una plataforma para",
  "help.title.accent": "toda la regulación",
  "help.title.suffix": ".",
  "help.subtitle":
    "Diseñada para investigadores, abogados, policy makers y periodistas que necesitan referencias verificables y comparadas.",
  "help.cards.catalog.title": "Catálogo filtrable",
  "help.cards.catalog.desc":
    "Filtra por país, área, estado, tipo normativo y búsqueda fuzzy.",
  "help.cards.compare.title": "Comparador de normas",
  "help.cards.compare.desc":
    "Selecciona hasta 4 normas y visualízalas en columnas alineadas.",
  "help.cards.country.title": "Vista por jurisdicción",
  "help.cards.country.desc":
    "Cada país con sus normas, autoridades de aplicación y fuentes oficiales.",
  "help.cards.areas.title": "10 materias curadas",
  "help.cards.areas.desc":
    "IA, datos personales, ciberseguridad, plataformas, fintech y más.",
  // Sections home
  "home.annotated": "Fichas comentadas",
  "home.areas": "Materias",
  "home.recent": "Últimas regulaciones publicadas",
  "home.viewAll": "Ver todas",
  "home.fullCatalog": "Catálogo completo",
  // Card labels
  "card.state": "Estado",
  "card.matter": "Materia",
  "card.annotated": "anotada",
  // Footer
  "footer.tagline":
    "Mapa curado de la regulación de nuevas tecnologías en América Latina. Contenido bajo licencia CC BY 4.0.",
  "footer.contact": "Contacto",
  "footer.themeLight": "Tema claro",
  "footer.themeDark": "Tema oscuro",
  "footer.disclaimer":
    "No constituye asesoría legal. Verifica fuentes oficiales.",
  "footer.contentNotice": "El contenido de las fichas se mantiene en su idioma fuente.",
  "footer.maintainer": "Creado y mantenido por",
  // Locale toggle
  "locale.aria": "Cambiar idioma",
};

const EN: Dict = {
  // Nav
  "nav.catalog": "Catalog",
  "nav.countries": "Countries",
  "nav.areas": "Topics",
  "nav.compare": "Compare",
  "nav.dashboard": "Dashboard",
  "nav.tags": "Tags",
  "nav.methodology": "Methodology",
  "nav.glossary": "Glossary",
  "nav.about": "About",
  "nav.start": "Home",
  "nav.search": "Search regulations…",
  "nav.menu": "Menu",
  "nav.openCatalog": "Open catalog",
  // Hero
  "hero.title.before": "Tech policy tracker for",
  "hero.title.accent": "LATAM",
  "hero.subtitle":
    "Laws, decrees and bills on AI, data protection, cybersecurity, fintech and more across Latin America.",
  "hero.cta.primary": "Open catalog",
  "hero.cta.secondary": "Compare regulations",
  // Country strip
  "country.title.before": "20 jurisdictions",
  "country.title.accent": "in one view",
  "country.title.suffix": ".",
  "country.subtitle":
    "From the Rio Grande to Tierra del Fuego, focused on jurisdictions with the most tech-related regulatory output.",
  // Help section
  "help.title.before": "One platform for",
  "help.title.accent": "all the regulation",
  "help.title.suffix": ".",
  "help.subtitle":
    "Designed for researchers, lawyers, policy makers and journalists who need verifiable, comparative references.",
  "help.cards.catalog.title": "Filterable catalog",
  "help.cards.catalog.desc":
    "Filter by country, topic, status, type and fuzzy search.",
  "help.cards.compare.title": "Regulation comparator",
  "help.cards.compare.desc":
    "Select up to 4 regulations and view them in aligned columns.",
  "help.cards.country.title": "View by jurisdiction",
  "help.cards.country.desc":
    "Each country with its regulations, enforcing authorities and official sources.",
  "help.cards.areas.title": "10 curated topics",
  "help.cards.areas.desc":
    "AI, data protection, cybersecurity, platforms, fintech and more.",
  // Sections home
  "home.annotated": "Annotated fichas",
  "home.areas": "Topics",
  "home.recent": "Most recently published",
  "home.viewAll": "View all",
  "home.fullCatalog": "Full catalog",
  // Card labels
  "card.state": "Status",
  "card.matter": "Topic",
  "card.annotated": "annotated",
  // Footer
  "footer.tagline":
    "Curated map of tech regulation across Latin America. Content under CC BY 4.0 license.",
  "footer.contact": "Contact",
  "footer.themeLight": "Light theme",
  "footer.themeDark": "Dark theme",
  "footer.disclaimer":
    "Not legal advice. Always verify with official sources.",
  "footer.contentNotice": "Ficha content remains in its source language.",
  "footer.maintainer": "Built and maintained by",
  // Locale toggle
  "locale.aria": "Change language",
};

const DICTS: Record<Locale, Dict> = { es: ES, en: EN };

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof typeof ES) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const saved = window.localStorage.getItem("locale");
    if (saved === "es" || saved === "en") {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem("locale", l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: keyof typeof ES) => DICTS[locale][key] ?? ES[key] ?? String(key),
    [locale],
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Fallback durante SSR sin provider
    return {
      locale: "es",
      setLocale: () => {},
      t: (key) => ES[key as keyof typeof ES] ?? String(key),
    };
  }
  return ctx;
}
