import type { StaticImageData } from "next/image";
import about from "@/assets/projects/adriano-reformas-vigo/about-photos.webp";
import form from "@/assets/projects/adriano-reformas-vigo/form.webp";
import galleryBath from "@/assets/projects/adriano-reformas-vigo/gallery-bath.webp";
import galleryBefore from "@/assets/projects/adriano-reformas-vigo/gallery-before.webp";
import lightbox from "@/assets/projects/adriano-reformas-vigo/lightbox.webp";
import map from "@/assets/projects/adriano-reformas-vigo/map.webp";
import mobileBar from "@/assets/projects/adriano-reformas-vigo/mobile-bar.webp";
import mobileGallery from "@/assets/projects/adriano-reformas-vigo/mobile-gallery.webp";
import mobileHome from "@/assets/projects/adriano-reformas-vigo/mobile-home.webp";
import mobileMenu from "@/assets/projects/adriano-reformas-vigo/mobile-menu.webp";
import siteHome from "@/assets/projects/adriano-reformas-vigo/site-home.webp";
import siteServices from "@/assets/projects/adriano-reformas-vigo/site-services.webp";
import siteSteps from "@/assets/projects/adriano-reformas-vigo/site-steps.webp";

/**
 * Adriano Reformas Vigo: dados que não dependem de idioma. As imagens são REAIS, capturadas do site publicado sem
 * tocar nele, numa sessão controlada do navegador. O endereço do site é o domínio próprio do cliente
 * (adrianoreformas.com; o .es redireciona para ele); as capturas foram feitas na implantação da Vercel que o serve,
 * com conteúdo idêntico byte a byte. Regras de privacidade e de honestidade:
 *  - nenhuma captura inclui a faixa de indicadores logo abaixo da abertura (os números de demonstração e o
 *    contador de "obra em curso"), o cartão de contato direto (telefone e e-mail) nem o rodapé: as capturas da
 *    abertura terminam antes da faixa e o formulário é fotografado sozinho;
 *  - a galeria só aparece filtrada (Baños, Antes de empezar, Cocinas): as três fotos de fachada e de rua ficam de fora;
 *  - as fotos são das obras do cliente e aparecem dentro das capturas do site, não como arquivos soltos.
 * As de desktop são de uma janela de 1440 px em 2×; as de celular são de uma tela de 390 px emulada, com a barra
 * fixa de baixo numa captura à parte (uma janela estreita de 390 px), porque no celular emulado o cartão de
 * avaliações do site (539 px de largura) alarga a página e desloca essa barra para fora da tela.
 * Os mestres ficam em `IMG rg/project-captures/adriano-*`.
 */

export type AdrianoSheetData = {
  slug: "adriano-reformas-vigo";
  name: string;
  year: string;
  media: {
    home: StaticImageData;
    services: StaticImageData;
    steps: StaticImageData;
    bath: StaticImageData;
    before: StaticImageData;
    lightbox: StaticImageData;
    about: StaticImageData;
    map: StaticImageData;
    form: StaticImageData;
    mobile: { home: StaticImageData; gallery: StaticImageData; menu: StaticImageData; bar: StaticImageData };
  };
  /** O endereço mostrado na moldura das capturas de desktop (o do site publicado). */
  address: string;
};

export const adrianoReformasVigo: AdrianoSheetData = {
  slug: "adriano-reformas-vigo",
  name: "Adriano Reformas Vigo",
  year: "2026",
  media: {
    home: siteHome,
    services: siteServices,
    steps: siteSteps,
    bath: galleryBath,
    before: galleryBefore,
    lightbox,
    about,
    map,
    form,
    mobile: { home: mobileHome, gallery: mobileGallery, menu: mobileMenu, bar: mobileBar },
  },
  address: "adrianoreformas.com",
};
