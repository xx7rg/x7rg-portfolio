import type { StaticImageData } from "next/image";
import heroDesktop from "@/assets/luciane-correa-servicios/01-hero-desktop.webp";
import aboutDesktop from "@/assets/luciane-correa-servicios/02-about-luciane-desktop.webp";
import servicesDesktop from "@/assets/luciane-correa-servicios/03-services-desktop.webp";
import packagesDesktop from "@/assets/luciane-correa-servicios/04-packages-desktop.webp";
import processDesktop from "@/assets/luciane-correa-servicios/05-process-desktop.webp";
import testimonialsDesktop from "@/assets/luciane-correa-servicios/06-testimonials-desktop.webp";
import quoteDesktop from "@/assets/luciane-correa-servicios/07-quote-contact-desktop.webp";
import footerDesktop from "@/assets/luciane-correa-servicios/08-footer-desktop.webp";
import heroMobile from "@/assets/luciane-correa-servicios/09-hero-mobile.webp";
import contentMobile from "@/assets/luciane-correa-servicios/10-content-mobile.webp";
import mobileMenu from "@/assets/luciane-correa-servicios/11-mobile-menu.webp";

/**
 * Luciane Correa Servicios: dados que não dependem de idioma. As onze imagens são capturas REAIS
 * da produção ao vivo (https://luciane-correa-servicios.pages.dev/), feitas em 1440×1000 (desktop)
 * e 390×844 (mobile), otimizadas para WebP sem alterar composição, proporção ou conteúdo. A
 * captura de depoimentos mostra o estado real de produção no momento da captura: o formulário de
 * avaliação existe e funciona, mas nenhum depoimento público havia sido publicado ainda — por
 * isso ela é tratada como mídia secundária, nunca como prova social fabricada.
 */

export type LucianeSheetData = {
  slug: "luciane-correa-servicios";
  name: string;
  year: string;
  /** Domínio mostrado na moldura de navegador das capturas de desktop. */
  address: string;
  media: {
    hero: StaticImageData;
    about: StaticImageData;
    services: StaticImageData;
    packages: StaticImageData;
    process: StaticImageData;
    testimonials: StaticImageData;
    quote: StaticImageData;
    footer: StaticImageData;
    mobile: { hero: StaticImageData; content: StaticImageData; menu: StaticImageData };
  };
};

export const lucianeCorreaServicios: LucianeSheetData = {
  slug: "luciane-correa-servicios",
  name: "Luciane Correa Servicios",
  year: "2026",
  address: "luciane-correa-servicios.pages.dev",
  media: {
    hero: heroDesktop,
    about: aboutDesktop,
    services: servicesDesktop,
    packages: packagesDesktop,
    process: processDesktop,
    testimonials: testimonialsDesktop,
    quote: quoteDesktop,
    footer: footerDesktop,
    mobile: { hero: heroMobile, content: contentMobile, menu: mobileMenu },
  },
};
