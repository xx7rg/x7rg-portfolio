import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

/** Permite indexação normal do portfólio público; a rota de QA (/dev/primitives) não é anunciada. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/dev/" },
    sitemap: new URL("/sitemap.xml", siteUrl()).toString(),
  };
}
