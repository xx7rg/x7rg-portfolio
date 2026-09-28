export const locales = ["pt", "en", "es"] as const;
export type Locale = (typeof locales)[number];

/** Português é o idioma padrão; "/" redireciona para "/pt" (ver next.config.ts). */
export const defaultLocale: Locale = "pt";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Valor do atributo `lang` do <html>. O português usa a variante do Brasil. */
export const htmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
};

/** Rótulos do seletor. Sempre na própria língua e sempre na ordem PT, EN, ES. */
export const localeLabels: Record<Locale, { code: string; name: string }> = {
  pt: { code: "PT", name: "Português" },
  en: { code: "EN", name: "English" },
  es: { code: "ES", name: "Español" },
};

/** Valor de `og:locale` por idioma. */
export const openGraphLocale: Record<Locale, string> = {
  pt: "pt_BR",
  en: "en_US",
  es: "es_ES",
};

/**
 * Troca o primeiro segmento (idioma) de um pathname e preserva o resto,
 * para que o seletor leve ao equivalente da página atual.
 */
export function pathForLocale(pathname: string, target: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  const rest = hasLocale(segments[0] ?? "") ? segments.slice(1) : segments;
  return `/${[target, ...rest].join("/")}`;
}
