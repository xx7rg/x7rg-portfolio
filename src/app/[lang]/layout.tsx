import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { notFound } from "next/navigation";
import { BackgroundBeams } from "@/components/background/BackgroundBeams";
import { SiteNav, type NavId } from "@/components/site-nav/SiteNav";
import { homeSectionIds } from "@/content/sections";
import { getDictionary } from "@/i18n";
import { hasLocale, htmlLang, locales, openGraphLocale } from "@/i18n/config";
import { siteUrl } from "@/lib/site-url";
import "../globals.css";

/*
 * Archivo variável (pesos 100 a 900). O eixo de largura fica disponível, mas o site usa a
 * largura normal. JetBrains Mono não é carregada: não há identificador técnico para mostrar.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

/** Só os três idiomas existem: qualquer outro segmento devolve 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  colorScheme: "dark",
  // Mesmo valor do token --color-bg em globals.css.
  themeColor: "#0f0f0f",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    metadataBase: siteUrl(),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { pt: "/pt", en: "/en", es: "/es", "x-default": "/pt" },
    },
    openGraph: {
      type: "website",
      locale: openGraphLocale[lang],
      siteName: dict.meta.siteName,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${lang}`,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const nav: { id: NavId; label: string }[] = [
    { id: "top", label: dict.nav.home },
    ...homeSectionIds.map((id) => ({ id, label: dict.nav[id] })),
  ];

  return (
    <html lang={htmlLang[lang]} className={archivo.variable}>
      <body>
        <BackgroundBeams />
        <a className="skip-link" href="#main">
          {dict.a11y.skipToContent}
        </a>
        <SiteNav
          lang={lang}
          locale={htmlLang[lang]}
          nav={nav}
          labels={{
            primaryNav: dict.a11y.primaryNav,
            languageNav: dict.a11y.languageNav,
            menu: dict.a11y.menu,
            closeMenu: dict.a11y.closeMenu,
            goTop: dict.a11y.goTop,
          }}
        />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
