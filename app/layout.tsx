import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppShell } from "@/components/AppShell";
import { getIndex } from "@/lib/index";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
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
  authors: [{ name: "Sebastián Dueñas Müller" }],
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
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
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
      className={`${inter.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell index={index}>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
