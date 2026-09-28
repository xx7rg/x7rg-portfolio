import type { StaticImageData } from "next/image";
import flavorChocolate from "@/assets/feito-pela-bya/flavor-chocolate.webp";
import flavorCoco from "@/assets/feito-pela-bya/flavor-coco.webp";
import flavorMaracuja from "@/assets/feito-pela-bya/flavor-maracuja.webp";
import flavorNinho from "@/assets/feito-pela-bya/flavor-ninho.webp";
import logo from "@/assets/feito-pela-bya/logo.webp";
import share from "@/assets/feito-pela-bya/share.webp";
import siteHome from "@/assets/feito-pela-bya/site-home.webp";
import type { ProjectSlug } from "../projects";
import type { EvidenceShot, Triple } from "./types";

type Quad<T> = readonly [T, T, T, T];

export type ByaSheetData = {
  slug: ProjectSlug;
  name: string;
  year: string;
  /** Site público da marca (verificado no levantamento). */
  siteUrl: string;
  siteHost: string;
  media: {
    logo: StaticImageData;
    /** Chocolate, Maracujá, Ninho e Coco: a ordem do mosaico. */
    flavors: Quad<StaticImageData>;
    site: StaticImageData;
    share: StaticImageData;
  };
  /** Detalhes do logo final: o laço, o B e o lettering. Recortes só de apresentação. */
  logoDetails: Triple<EvidenceShot>;
  /** Avental, cartão da marca e fita em B, tirados das visualizações de produto. */
  applications: Triple<EvidenceShot>;
  /** Placas de sabor: Chocolate, Maracujá, Ninho (com o selo) e Coco. */
  plaques: Quad<EvidenceShot>;
  /** Cores do site (variáveis de CSS convertidas de oklch, então aproximadas) e o dourado medido no logo. */
  palette: {
    plum: string;
    plumSoft: string;
    raspberry: string;
    cream: string;
    blush: string;
    gold: string;
  };
};

/*
 * Fonte: content/projects/feito-pela-bya.md e a auditoria de mídia. Os mestres ficam no projeto
 * do site (Marya/*.png) e, para a recaptura do site, em `IMG rg/feito-pela-bya-captures/`; aqui
 * estão cópias WebP de entrega. Os recortes (em pixels do arquivo) são só de apresentação: a
 * imagem nunca é editada.
 *
 * Usadas: LOGO_BYA (variante "Trufas artesanais", a das aplicações), as quatro cenas de produto
 * (geradas ou assistidas por IA), uma recaptura segura do site e o cartão de compartilhamento.
 * Fora de propósito: LogoG e Gourmet_png (quadriculado gravado), os vídeos (marca d'água do
 * gerador e defeito no Coco), dist/public, a marca x7rG dos documentos e o apple-touch-icon.
 */
export const feitoPelaBya: ByaSheetData = {
  slug: "feito-pela-bya",
  name: "Feito Pela Bya",
  year: "2026",
  siteUrl: "https://feitopelabya.pages.dev",
  siteHost: "feitopelabya.pages.dev",
  media: {
    logo,
    flavors: [flavorChocolate, flavorMaracuja, flavorNinho, flavorCoco],
    site: siteHome,
    share,
  },
  logoDetails: [
    // O laço e o topo da caixa (1254×1254).
    { image: logo, crop: { x: 230, y: 108, w: 565, h: 425 } },
    // A fita que forma o B, com o começo do lettering.
    { image: logo, crop: { x: 690, y: 250, w: 520, h: 650 } },
    // O selo creme inteiro: "Feito pela", "Bya" e a faixa de "Trufas artesanais".
    { image: logo, crop: { x: 170, y: 590, w: 940, h: 600 } },
  ],
  applications: [
    // O logo no avental (cena do Maracujá, 1122×1402).
    { image: flavorMaracuja, crop: { x: 215, y: 10, w: 560, h: 560 } },
    // O cartão da marca, com o laço de fita (cena do Ninho, 1122×1402).
    { image: flavorNinho, crop: { x: 640, y: 300, w: 480, h: 480 } },
    // A fita marrom e rosa que forma o B (cena do Chocolate, 1003×1568).
    { image: flavorChocolate, crop: { x: 603, y: 1075, w: 400, h: 400 } },
  ],
  plaques: [
    { image: flavorChocolate, crop: { x: 46, y: 1288, w: 560, h: 280 } },
    { image: flavorMaracuja, crop: { x: 384, y: 1082, w: 640, h: 320 } },
    { image: flavorNinho, crop: { x: 300, y: 1082, w: 640, h: 320 } },
    { image: flavorCoco, crop: { x: 185, y: 1288, w: 560, h: 280 } },
  ],
  palette: {
    plum: "#1e0918",
    plumSoft: "#4f3345",
    raspberry: "#c26c96",
    cream: "#ffede4",
    blush: "#f6d6c9",
    gold: "#c9954a",
  },
};
