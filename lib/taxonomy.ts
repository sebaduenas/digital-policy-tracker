export const COUNTRIES = {
  AR: { name: "Argentina", flag: "🇦🇷", region: "Cono Sur" },
  BO: { name: "Bolivia", flag: "🇧🇴", region: "Andina" },
  BR: { name: "Brasil", flag: "🇧🇷", region: "Cono Sur" },
  CL: { name: "Chile", flag: "🇨🇱", region: "Cono Sur" },
  CO: { name: "Colombia", flag: "🇨🇴", region: "Andina" },
  CR: { name: "Costa Rica", flag: "🇨🇷", region: "Centroamérica" },
  DO: { name: "República Dominicana", flag: "🇩🇴", region: "Caribe" },
  EC: { name: "Ecuador", flag: "🇪🇨", region: "Andina" },
  GT: { name: "Guatemala", flag: "🇬🇹", region: "Centroamérica" },
  MX: { name: "México", flag: "🇲🇽", region: "Norteamérica" },
  PA: { name: "Panamá", flag: "🇵🇦", region: "Centroamérica" },
  PE: { name: "Perú", flag: "🇵🇪", region: "Andina" },
  PY: { name: "Paraguay", flag: "🇵🇾", region: "Cono Sur" },
  SV: { name: "El Salvador", flag: "🇸🇻", region: "Centroamérica" },
  UY: { name: "Uruguay", flag: "🇺🇾", region: "Cono Sur" },
  VE: { name: "Venezuela", flag: "🇻🇪", region: "Andina" },
} as const;

export type CountryCode = keyof typeof COUNTRIES;

export const COUNTRY_CODES = Object.keys(COUNTRIES) as CountryCode[];

export const AREAS = {
  ia: {
    name: "Inteligencia Artificial",
    short: "IA",
    color: "var(--area-ia)",
    description:
      "Marcos normativos para sistemas de IA: clasificación de riesgo, transparencia, deberes de proveedores, gobernanza algorítmica y derechos de las personas afectadas.",
  },
  pdp: {
    name: "Protección de Datos Personales",
    short: "PDP",
    color: "var(--area-pdp)",
    description:
      "Regímenes de protección de datos personales, autoridades de aplicación, derechos ARCO, transferencias internacionales y régimen sancionatorio.",
  },
  ciberseguridad: {
    name: "Ciberseguridad",
    short: "Ciber",
    color: "var(--area-ciberseguridad)",
    description:
      "Estrategias y leyes de ciberseguridad, infraestructuras críticas, CSIRT, gestión de incidentes y delitos informáticos.",
  },
  "propiedad-intelectual": {
    name: "Propiedad Intelectual Digital",
    short: "PI",
    color: "var(--area-propiedad-intelectual)",
    description:
      "Derecho de autor en entornos digitales, software, bases de datos, marcas, patentes vinculadas a tecnología y excepciones para minería de datos.",
  },
  plataformas: {
    name: "Plataformas Digitales y Mercados",
    short: "Plataformas",
    color: "var(--area-plataformas)",
    description:
      "Regulación de intermediarios, responsabilidad por contenidos de terceros, deberes de transparencia, moderación y obligaciones para gigantes digitales.",
  },
  fintech: {
    name: "Fintech y Cripto Activos",
    short: "Fintech",
    color: "var(--area-fintech)",
    description:
      "Servicios financieros tecnológicos, open finance, sandboxes regulatorios y activos virtuales o criptomonedas.",
  },
  telecom: {
    name: "Telecomunicaciones e Infraestructura",
    short: "Telecom",
    color: "var(--area-telecom)",
    description:
      "Regulación de telecomunicaciones, neutralidad de red, despliegue de infraestructura digital y servicios universales.",
  },
  soberania: {
    name: "Soberanía Digital y Transferencias",
    short: "Soberanía",
    color: "var(--area-soberania)",
    description:
      "Localización de datos, transferencia internacional, cooperación regulatoria, restricciones por motivos de seguridad nacional y autonomía digital.",
  },
  "identidad-digital": {
    name: "Identidad Digital y Gobierno",
    short: "ID Digital",
    color: "var(--area-identidad-digital)",
    description:
      "Identidad digital, firma electrónica, interoperabilidad estatal y gobierno digital.",
  },
  "menores-online": {
    name: "Menores y Contenidos en Línea",
    short: "Menores",
    color: "var(--area-menores-online)",
    description:
      "Protección de niños, niñas y adolescentes en entornos digitales, verificación de edad, contenidos lesivos y diseños abusivos.",
  },
} as const;

export type Area = keyof typeof AREAS;
export const AREA_KEYS = Object.keys(AREAS) as Area[];

export const STATUSES = {
  vigente: { label: "Vigente", color: "var(--status-vigente)" },
  "vigencia-diferida": {
    label: "Vigencia diferida",
    color: "var(--status-vigencia-diferida)",
  },
  "proyecto-en-discusion": {
    label: "Proyecto en discusión",
    color: "var(--status-proyecto-en-discusion)",
  },
  "aprobado-pendiente-promulgacion": {
    label: "Aprobado, pendiente de promulgación",
    color: "var(--status-aprobado-pendiente-promulgacion)",
  },
  derogado: { label: "Derogado", color: "var(--status-derogado)" },
  "veto-pendiente": {
    label: "Veto pendiente",
    color: "var(--status-veto-pendiente)",
  },
  "reglamento-pendiente": {
    label: "Reglamento pendiente",
    color: "var(--status-reglamento-pendiente)",
  },
} as const;

export type Status = keyof typeof STATUSES;
export const STATUS_KEYS = Object.keys(STATUSES) as Status[];

export const NORM_TYPES = {
  ley: "Ley",
  dfl: "Decreto con fuerza de ley",
  "decreto-supremo": "Decreto supremo",
  reglamento: "Reglamento",
  circular: "Circular",
  "resolucion-exenta": "Resolución exenta",
  instruccion: "Instrucción",
  "norma-tecnica": "Norma técnica",
  estandar: "Estándar",
  constitucion: "Constitución",
  "tratado-internacional": "Tratado internacional",
  "proyecto-ley": "Proyecto de ley",
  "proyecto-reglamento": "Proyecto de reglamento",
} as const;

export type NormType = keyof typeof NORM_TYPES;
export const NORM_TYPE_KEYS = Object.keys(NORM_TYPES) as NormType[];

export const BRANCHES = {
  publico: "Público",
  privado: "Privado",
  administrativo: "Administrativo",
  penal: "Penal",
  internacional: "Internacional",
} as const;

export type Branch = keyof typeof BRANCHES;
