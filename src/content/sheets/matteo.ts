import type { StaticImageData } from "next/image";
import heroDay from "@/assets/matteo/01-hero-day-desktop.webp";
import heroDusk from "@/assets/matteo/02-hero-dusk-desktop.webp";
import heroNight from "@/assets/matteo/03-hero-night-desktop.webp";
import countdown from "@/assets/matteo/04-countdown-desktop.webp";
import story from "@/assets/matteo/05-story-desktop.webp";
import gallery from "@/assets/matteo/07-gallery-desktop.webp";
import confirmation from "@/assets/matteo/12-confirmation-desktop.webp";
import directions from "@/assets/matteo/13-directions-desktop.webp";
import gifts from "@/assets/matteo/14-gifts-desktop.webp";
import heroMobile from "@/assets/matteo/09-hero-mobile.webp";
import navigationMobile from "@/assets/matteo/10-navigation-mobile.webp";
import functionalMobile from "@/assets/matteo/15-functional-mobile.webp";

/**
 * Matteo: dados que não dependem de idioma. As doze imagens são capturas REAIS da produção
 * (rodada localmente para a captura, mesmo código publicado), feitas em 1440 de largura (desktop)
 * e 390 (mobile), otimizadas para WebP sem alterar composição, proporção ou conteúdo. Só as
 * capturas explicitamente aprovadas entram aqui — nenhuma referência que exponha data e local
 * exatos juntos, formulário/Pix reais, mapa preciso ou dado de família.
 */

export type MatteoSheetData = {
  slug: "matteo";
  name: string;
  year: string;
  /** Domínio mostrado na moldura de navegador das capturas de desktop (texto inerte, sem link). */
  address: string;
  media: {
    day: StaticImageData;
    dusk: StaticImageData;
    night: StaticImageData;
    countdown: StaticImageData;
    story: StaticImageData;
    gallery: StaticImageData;
    confirmation: StaticImageData;
    directions: StaticImageData;
    gifts: StaticImageData;
    mobile: { hero: StaticImageData; navigation: StaticImageData; functional: StaticImageData };
  };
};

export const matteo: MatteoSheetData = {
  slug: "matteo",
  name: "Matteo",
  year: "2026",
  address: "matteo-1-ano.pages.dev",
  media: {
    day: heroDay,
    dusk: heroDusk,
    night: heroNight,
    countdown,
    story,
    gallery,
    confirmation,
    directions,
    gifts,
    mobile: { hero: heroMobile, navigation: navigationMobile, functional: functionalMobile },
  },
};
