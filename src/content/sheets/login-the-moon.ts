import type { StaticImageData } from "next/image";
import arrival from "@/assets/projects/login-the-moon/scene-arrival.webp";
import buttonIdle from "@/assets/projects/login-the-moon/button-idle.webp";
import buttonLoading from "@/assets/projects/login-the-moon/button-loading.webp";
import buttonSuccess from "@/assets/projects/login-the-moon/button-success.webp";
import descent1 from "@/assets/projects/login-the-moon/descent-1.webp";
import descent2 from "@/assets/projects/login-the-moon/descent-2.webp";
import descent3 from "@/assets/projects/login-the-moon/descent-3.webp";
import descent4 from "@/assets/projects/login-the-moon/descent-4.webp";
import mobileIdle from "@/assets/projects/login-the-moon/mobile-idle.webp";
import mobileSuccess from "@/assets/projects/login-the-moon/mobile-success.webp";
import sceneDescent from "@/assets/projects/login-the-moon/scene-descent.webp";
import sceneIdle from "@/assets/projects/login-the-moon/scene-idle.webp";
import type { MoonSegment } from "@/i18n/types";

/**
 * Login The Moon: dados que não dependem de idioma. Tudo é REAL, capturado do projeto publicado (GitHub Pages)
 * sem tocar nele, numa sessão controlada do navegador: o app roda de verdade e só o RELÓGIO é dirigido (as
 * animações CSS e os temporizadores de 3,6 s do app avançam a 30 quadros por segundo), com o AudioContext
 * neutralizado só na sessão e o cursor desenhado por cima. As capturas e a gravação são da MESMA sequência
 * (o primeiro toque em 2,1 s; o envio em 4,6 s): os quadros da descida são recortes das capturas em 2×.
 *  - `scene`, `arrival`, `descent`: a cena inteira parada, no login, na chegada e no meio da descida;
 *  - `frames`: quatro recortes em torno da nave (1,2, 2,1, 3,0 e 4,6 s depois do primeiro toque);
 *  - `buttons`: o botão parado, enviando (a bicicleta em voo) e com o acesso concedido;
 *  - `mobile`: 390 × 844 em 3×, o layout do próprio app.
 * O áudio das amostras é o do PRÓPRIO app: o mesmo código de Web Audio rodou na página publicada com um
 * OfflineAudioContext (a sequência do envio sem o primeiro toque, a do pouso sem o envio), e o volume foi
 * normalizado. A arte da cena e a imagem da nave não entram como arquivos: as capturas já as contêm.
 * A silhueta da bicicleta (imagem gerada com IA) aparece só como está no botão do app, em tamanho natural.
 * Os mestres ficam em `IMG rg/project-captures/`.
 */

export type ScoreSegment = { key: MoonSegment; from: number; to: number };
export type ScoreLane = { id: "touch" | "submit"; image: readonly ScoreSegment[]; sound: readonly ScoreSegment[]; marker?: number };

export type MoonSheetData = {
  slug: "login-the-moon";
  name: string;
  year: string;
  media: {
    scene: StaticImageData;
    arrival: StaticImageData;
    descent: StaticImageData;
    frames: readonly [StaticImageData, StaticImageData, StaticImageData, StaticImageData];
    buttons: readonly [StaticImageData, StaticImageData, StaticImageData];
    mobile: { idle: StaticImageData; success: StaticImageData };
  };
  clip: { src: string; width: number; height: number };
  audio: { descent: string; submit: string };
  /**
   * Os tempos que o CÓDIGO do app agenda, em segundos. Toque: a descida visual (0,6 s de atraso + 6,4 s) e o som
   * (começa 0,62 s depois do toque). Envio: o carregamento (3,6 s) e o som (começa em 0,02 s). Lidos de
   * app/page.tsx (setValueAtTime, exponentialRamp, start/stop) e de globals.css (animation).
   */
  score: { span: number; lanes: readonly [ScoreLane, ScoreLane] };
};

export const loginTheMoon: MoonSheetData = {
  slug: "login-the-moon",
  name: "Login The Moon",
  year: "2026",
  media: {
    scene: sceneIdle,
    arrival,
    descent: sceneDescent,
    frames: [descent1, descent2, descent3, descent4],
    buttons: [buttonIdle, buttonLoading, buttonSuccess],
    mobile: { idle: mobileIdle, success: mobileSuccess },
  },
  clip: { src: "/media/login-the-moon/narrative.mp4", width: 1280, height: 758 },
  audio: { descent: "/media/login-the-moon/descent.mp3", submit: "/media/login-the-moon/submit.mp3" },
  score: {
    span: 7,
    lanes: [
      {
        id: "touch",
        image: [{ key: "visualDescent", from: 0.6, to: 7 }],
        sound: [
          { key: "engine", from: 0.62, to: 6.82 },
          { key: "pressure", from: 0.62, to: 6.72 },
          { key: "impact", from: 5.96, to: 6.54 },
          { key: "settle", from: 6.2, to: 6.73 },
        ],
      },
      {
        id: "submit",
        image: [{ key: "visualLoading", from: 0, to: 3.6 }],
        sound: [
          { key: "activation", from: 0.02, to: 0.62 },
          { key: "movement", from: 0.12, to: 2.67 },
          { key: "swell", from: 1.17, to: 2.97 },
          { key: "chord", from: 3.04, to: 3.93 },
        ],
        marker: 3.6,
      },
    ],
  },
};
