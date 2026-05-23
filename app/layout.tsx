import type { Metadata, Viewport } from "next";
import { Roboto, Roboto_Slab, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppShell } from "@/components/AppShell";
import { getIndex } from "@/lib/index";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://policytracker.lat",
  ),
  title: {
    default: "Digital Policy Tracker LATAM",
    template: "%s · Digital Policy Tracker LATAM",
  },
  description:
    "Mapa interactivo y curado de la regulación de nuevas tecnologías en América Latina: IA, datos personales, ciberseguridad, plataformas, fintech y más.",
  keywords: [
    "regulación tecnológica",
    "LATAM",
    "inteligencia artificial",
    "protección de datos",
    "ciberseguridad",
    "policy tracker",
    "América Latina",
  ],
  authors: [{ name: "Policy Tracker LATAM" }],
  openGraph: {
    type: "website",
    locale: "es_CL",
    title: "Digital Policy Tracker LATAM",
    description:
      "Mapa curado de la regulación tecnológica en América Latina. Curaduría académica, datos abiertos, comparado.",
    siteName: "Digital Policy Tracker LATAM",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#10121C" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const index = await getIndex();

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${roboto.variable} ${robotoSlab.variable} ${mono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell index={index}>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
