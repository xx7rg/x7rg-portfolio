/**
 * Domínio de produção; localhost fora dela. Usado por metadados, robots e sitemap.
 * VERCEL_PROJECT_PRODUCTION_URL (Vercel) é só o host; CF_PAGES_URL (Cloudflare Pages) já vem
 * completa e é estável na branch de produção (só varia por deployment em branches de preview).
 */
export function siteUrl(): URL {
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const cfPagesUrl = process.env.CF_PAGES_URL;
  if (vercelHost) return new URL(`https://${vercelHost}`);
  if (cfPagesUrl) return new URL(cfPagesUrl);
  return new URL("http://localhost:3000");
}
