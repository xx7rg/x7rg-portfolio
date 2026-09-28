import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site-url";

// Exigido por output: "export" (Cloudflare Pages): confirma que a rota é estática.
export const dynamic = "force-static";

/** Só as três páginas públicas do portfólio (/pt, /en, /es); a rota de QA não entra. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const languages = Object.fromEntries(locales.map((lang) => [lang, new URL(`/${lang}`, base).toString()]));

  return locales.map((lang) => ({
    url: new URL(`/${lang}`, base).toString(),
    lastModified: new Date(),
    alternates: { languages },
  }));
}
