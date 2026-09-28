/**
 * Domínio de produção; localhost fora dela. Usado por metadados, robots e sitemap.
 * SITE_URL: variável de build configurada manualmente (necessária no Cloudflare Workers
 * Builds, que — ao contrário do Cloudflare Pages clássico — não injeta automaticamente
 * nenhuma variável com a URL de produção; ver Settings > Variables and Secrets do projeto).
 * VERCEL_PROJECT_PRODUCTION_URL (Vercel) é só o host; CF_PAGES_URL (Cloudflare Pages clássico)
 * já vem completa e é estável na branch de produção.
 */
export function siteUrl(): URL {
  const manual = process.env.SITE_URL;
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const cfPagesUrl = process.env.CF_PAGES_URL;
  if (manual) return new URL(manual);
  if (vercelHost) return new URL(`https://${vercelHost}`);
  if (cfPagesUrl) return new URL(cfPagesUrl);
  return new URL("http://localhost:3000");
}
