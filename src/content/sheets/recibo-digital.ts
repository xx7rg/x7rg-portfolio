import type { StaticImageData } from "next/image";
import hero from "@/assets/projects/recibo-digital/hero.webp";
import idle from "@/assets/projects/recibo-digital/idle.webp";
import mobile from "@/assets/projects/recibo-digital/mobile.webp";
import printing from "@/assets/projects/recibo-digital/printing.webp";
import ready from "@/assets/projects/recibo-digital/ready.webp";
import torn from "@/assets/projects/recibo-digital/torn.webp";
import type { CaptionKey } from "../media-captions";
import type { EvidenceShot } from "./types";

/**
 * Recibo Digital: dados que não dependem de idioma. As imagens são REAIS:
 *  - os quatro estados são as capturas dos `docs/screenshots` do repositório (1280×900), recortadas só na
 *    apresentação na coluna da máquina, na MESMA escala: por isso o papel cresce de verdade de um estado
 *    para o outro. Cada recorte termina acima da linha de apoio que o app mostra sob os botões;
 *  - `hero` e `mobile` foram capturados da experiência publicada (Worker), sem tocar no projeto: desktop em 2×
 *    e celular em 390 px de largura, ambos no estado "pronto";
 *  - a gravação (`public/media/recibo-digital/printing-sequence.mp4`) é da mesma experiência, quadro a quadro
 *    a 30 fps com o relógio das animações CSS controlado; o áudio da impressora é a gravação original do
 *    projeto (`printer-print.wav`, 1,9 s), feita por Rogério.
 * Os mestres ficam em `IMG rg/project-captures/`.
 */

export type ReciboStateId = "idle" | "printing" | "ready" | "torn";

export type ReciboState = {
  readonly id: ReciboStateId;
  readonly caption: CaptionKey;
  readonly shot: EvidenceShot;
};

/** A coluna da máquina nos 1280×900: 520 px de largura, com o topo 16 px acima da impressora. */
const column = (y: number, h: number) => ({ x: 380, y, w: 520, h });

export type ReciboSheetData = {
  slug: "recibo-digital";
  name: string;
  year: string;
  media: {
    hero: StaticImageData;
    mobile: StaticImageData;
    states: readonly [ReciboState, ReciboState, ReciboState, ReciboState];
  };
  video: { src: string; width: number; height: number };
  sounds: {
    printer: string;
    /** O blim do app: dois tons senoidais, escalonados em 0,1 s, com envelope de 0,72 s. */
    chime: { frequencies: readonly [number, number]; stagger: number; duration: number; peak: number };
  };
};

export const reciboDigital: ReciboSheetData = {
  slug: "recibo-digital",
  name: "Recibo Digital",
  year: "2026",
  media: {
    hero,
    mobile,
    states: [
      { id: "idle", caption: "recibo.idle", shot: { image: idle, crop: column(420, 209) } },
      { id: "printing", caption: "recibo.printing", shot: { image: printing, crop: column(420, 380) } },
      { id: "ready", caption: "recibo.ready", shot: { image: ready, crop: column(420, 480) } },
      // A captura do estado cortado saiu rolada 62 px: o recorte acompanha o deslocamento e termina antes da linha de apoio.
      { id: "torn", caption: "recibo.torn", shot: { image: torn, crop: column(358, 209) } },
    ],
  },
  video: { src: "/media/recibo-digital/printing-sequence.mp4", width: 856, height: 1026 },
  sounds: {
    printer: "/media/recibo-digital/printer-print.wav",
    chime: { frequencies: [880, 1318.5], stagger: 0.1, duration: 0.72, peak: 0.16 },
  },
};
