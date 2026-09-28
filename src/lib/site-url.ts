/** Domínio de produção na Vercel; localhost fora dela. Usado por metadados, robots e sitemap. */
export function siteUrl(): URL {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return new URL(host ? `https://${host}` : "http://localhost:3000");
}
