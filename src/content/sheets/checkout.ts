import type { StaticImageData } from "next/image";
import cardBack from "@/assets/projects/checkout/card-back.webp";
import cardFront from "@/assets/projects/checkout/card-front.webp";
import approved from "@/assets/projects/checkout/approved.webp";
import flipPoster from "@/assets/projects/checkout/flip-poster.webp";
import interfaceShot from "@/assets/projects/checkout/interface.webp";
import mobile from "@/assets/projects/checkout/mobile.webp";
import overview from "@/assets/projects/checkout/overview.webp";
import receipt from "@/assets/projects/checkout/receipt.webp";
import summary from "@/assets/projects/checkout/summary.webp";

/**
 * Checkout: dados que não dependem de idioma. As imagens são REAIS, capturadas do protótipo publicado
 * (GitHub Pages) sem tocar no projeto:
 *  - `cardFront` e `cardBack`: o cartão isolado em 4× (fundo transparente: o resto da página foi tornado
 *    transparente só na sessão do navegador, e os campos ocultos no instante da captura);
 *  - `interface`, `summary` e `mobile`: a tela preenchida (2×), o resumo do pedido com o cupom aplicado
 *    e o celular com o cartão virado (3×);
 *  - `approved`: a maquininha com o comprovante, no fim do fluxo;
 *  - `strip`: as duas capturas antigas do repositório (`docs/screenshots`), que continuam sendo a imagem da
 *    faixa fechada. Ficam fora da folha: a de comprovante mostra um texto de uma versão anterior e as duas
 *    trazem o cursor do mouse.
 * As gravações (`public/media/checkout/*.mp4`) são do mesmo protótipo, quadro a quadro a 30 fps com o
 * relógio das animações CSS controlado. Os mestres ficam em \`IMG rg/project-captures/\`.
 */

export type CheckoutClip = { readonly src: string; readonly width: number; readonly height: number };

export type CheckoutSheetData = {
  slug: "checkout";
  name: string;
  year: string;
  media: {
    cardFront: StaticImageData;
    cardBack: StaticImageData;
    interface: StaticImageData;
    summary: StaticImageData;
    mobile: StaticImageData;
    flipPoster: StaticImageData;
    approved: StaticImageData;
    strip: { overview: StaticImageData; receipt: StaticImageData };
  };
  clips: { flip: CheckoutClip; pay: CheckoutClip };
};

export const checkout: CheckoutSheetData = {
  slug: "checkout",
  name: "Checkout",
  year: "2026",
  media: {
    cardFront,
    cardBack,
    interface: interfaceShot,
    summary,
    mobile,
    flipPoster,
    approved,
    strip: { overview, receipt },
  },
  clips: {
    flip: { src: "/media/checkout/card-flip.mp4", width: 1232, height: 504 },
    pay: { src: "/media/checkout/payment-flow.mp4", width: 1080, height: 840 },
  },
};
