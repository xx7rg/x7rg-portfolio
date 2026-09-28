import type { StaticImageData } from "next/image";
import cordDrag from "@/assets/projects/light-login/cord-drag.webp";
import home from "@/assets/projects/light-login/home.webp";
import stateOff from "@/assets/projects/light-login/state-off.webp";
import stateOn from "@/assets/projects/light-login/state-on.webp";

/**
 * Light Login: dados que não dependem de idioma. As imagens são REAIS, capturadas do projeto (`on` e `off` do
 * publicado no GitHub Pages; `cordDrag` e a gravação da versão com o sentido do cordão corrigido), com o
 * AudioContext neutralizado só na sessão do navegador (o som não aparece em imagem) e toques simulados:
 *  - `on` e `off`: a MESMA janela (1536×909, 2×), uma logo após a outra: o abajur, o cordão e o formulário
 *    ficam na mesma posição, então as duas se alinham pixel a pixel. O estado apagado é o do próprio app
 *    (filtro de brilho e véu radial), não uma sobreposição do portfólio;
 *  - `cordDrag`: um arrasto real para a direita parado em ~30°, com a ponta do cordão à direita, recortado em 3×
 *    em volta do cordão; os números do desenho (pivô, ângulo, comprimento) vêm do DOM no instante da captura;
 *  - `strip`: a captura antiga (`home.webp`), que continua sendo a imagem da faixa fechada.
 * A gravação (`public/media/light-login/cord-interaction.mp4`) é da versão corrigida do app, quadro a quadro a 30 fps com o
 * relógio das animações CSS e dos temporizadores do app (190 ms e 570 ms) controlados.
 * A arte da cena (`lamp-scene-v2.png`) e as imagens sociais NÃO entram no bundle do portfólio: as capturas já a
 * contêm. Os mestres ficam em `IMG rg/project-captures/`.
 */

export type LightSheetData = {
  slug: "light-login";
  name: string;
  year: string;
  media: {
    on: StaticImageData;
    off: StaticImageData;
    cordDrag: StaticImageData;
    strip: StaticImageData;
  };
  clip: { src: string; width: number; height: number };
  /** O arrasto da captura `cordDrag`, em pixels da imagem (3×): o desenho do ângulo é feito sobre estes números. */
  geometry: {
    view: { width: number; height: number };
    pivot: { x: number; y: number };
    /** Comprimento de repouso do cordão (68% da altura do botão), em pixels da imagem. */
    rest: number;
    /** Ângulo do arrasto, em graus, e comprimento como o app o expõe (--chain-length). */
    angle: number;
    length: number;
    restLength: number;
  };
};

export const lightLogin: LightSheetData = {
  slug: "light-login",
  name: "Light Login",
  year: "2026",
  media: { on: stateOn, off: stateOff, cordDrag, strip: home },
  clip: { src: "/media/light-login/cord-interaction.mp4", width: 1280, height: 758 },
  geometry: {
    view: { width: 1080, height: 1200 },
    pivot: { x: 507.9, y: 196.2 },
    rest: 380.1,
    angle: 30.34,
    length: 80.87,
    restLength: 68,
  },
};
