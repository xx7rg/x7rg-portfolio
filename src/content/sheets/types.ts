import type { StaticImageData } from "next/image";
import type { ProjectSlug } from "../projects";

/** Coleções de tamanho fixo: o compilador impede um terceiro pino de decisão ou uma terceira decisão. */
export type Triple<T> = readonly [T, T, T];
export type Pair<T> = readonly [T, T];
/** Nenhuma a três itens: o teto de pinos na folha é três. */
export type UpToThree<T> = readonly [] | readonly [T] | readonly [T, T] | Triple<T>;

/** Nomes de cor que o dicionário sabe traduzir. Cada projeto usa os seus. */
export type ColorName = "background" | "ink" | "cyan" | "magenta" | "gold";

/** Telas de destaque da composição principal. */
export type ShowcaseScreen = "wide" | "portrait";

/** Recorte de apresentação de uma captura, em pixels da imagem original. O arquivo não é editado. */
export type Crop = { readonly x: number; readonly y: number; readonly w: number; readonly h: number };

/** Uma captura real, com o recorte (opcional) que a apresenta como evidência. */
export type EvidenceShot = { readonly image: StaticImageData; readonly crop: Crop };

/**
 * Pino sobre uma das telas do destaque. `x` e `y` são porcentagens da captura
 * (não da composição), então continuam certos se a composição mudar de tamanho.
 * Só existe pino onde a captura realmente mostra o que a anotação afirma.
 */
export type PinAnchor = {
  /** Número da anotação de Proof (1 a 3) à qual o pino pertence. */
  readonly note: 1 | 2 | 3;
  readonly screen: ShowcaseScreen;
  readonly x: number;
  readonly y: number;
};

/**
 * Dados de uma folha de projeto que NÃO dependem de idioma. O texto vive nos
 * dicionários (`dict.projects[slug]`), na mesma ordem das tuplas daqui.
 */
export type ProjectSheetData = {
  slug: ProjectSlug;
  name: string;
  year: string;
  icon: StaticImageData;
  /**
   * Mídia do projeto: capturas REAIS do jogo. Não há mais estado "pendente": uma folha
   * só é montada quando existe mídia real, e os textos alternativos vêm do dicionário.
   */
  media: {
    /** Composição principal: a mesma partida em duas disposições da interface. */
    showcase: Record<ShowcaseScreen, StaticImageData>;
    /** Recortes usados como evidência dentro de uma anotação ou de uma decisão. */
    evidence: { scenarios: EvidenceShot; scoreboard: EvidenceShot };
  };
  /** Cores verificadas no código do projeto, na ordem da barra. */
  palette: readonly { name: ColorName; value: string }[];
  /** Estado de cada decisão: "unfinished" recebe a marca de desalinhamento e a evidência do placar local. */
  decisions: Pair<"done" | "unfinished">;
  /** Pinos do modo Proof. O modo Build não tem pinos: engenharia não aparece na tela. */
  pins: { proof: UpToThree<PinAnchor> };
};
