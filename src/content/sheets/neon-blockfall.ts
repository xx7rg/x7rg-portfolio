import icon from "@/assets/neon-blockfall/icon.svg";
import gameplayPortrait from "@/assets/neon-blockfall/gameplay-portrait.jpeg";
import gameplayWide from "@/assets/neon-blockfall/gameplay-wide.jpeg";
import scenarios from "@/assets/neon-blockfall/scenarios.jpeg";
import scoreboard from "@/assets/neon-blockfall/scoreboard.jpeg";
import type { ProjectSheetData } from "./types";

/**
 * Folha do Neon Blockfall na home. Fonte: content/projects/neon-blockfall.md e as
 * capturas reais feitas pelo autor em `IMG rg/` (cópias sem edição em src/assets).
 *
 * Cores: verificadas no código do jogo (repositório privado), não inventadas.
 *  - fundo, texto, ciano e magenta: variáveis de `:root` em client/src/index.css
 *  - ouro: borda da peça SPARK (game/pieces.ts) e efeito de "perfect clear"
 *
 * Mídia usada (4 de 6 capturas):
 *  - gameplay-wide     : partida na disposição larga (arena + painéis + botões)
 *  - gameplay-portrait : partida na disposição em retrato (arena + botões grandes)
 *  - scenarios         : ajustes; o recorte mostra os quatro cenários visuais
 *  - scoreboard        : gaveta do placar; o recorte mostra o "Top local" (placar do aparelho)
 * Não usadas: a segunda tela de ajustes (repete a `scenarios`, rolada mais abaixo) e a
 * tela de fim de partida (quase toda preta, com o título de tracking colado).
 *
 * As telas estão em espanhol porque o aparelho estava em es-ES; isso é dito na legenda.
 */
export const neonBlockfall: ProjectSheetData = {
  slug: "neon-blockfall",
  name: "Neon Blockfall",
  year: "2026",
  icon,
  media: {
    showcase: { wide: gameplayWide, portrait: gameplayPortrait },
    evidence: {
      // Os quatro cartões de cenário (Mega City, Orbital Ring, Quantum Core, Data Vault).
      scenarios: { image: scenarios, crop: { x: 88, y: 815, w: 848, h: 248 } },
      // "Top local · este dispositivo": as cinco partidas guardadas no aparelho.
      scoreboard: { image: scoreboard, crop: { x: 1000, y: 52, w: 586, h: 445 } },
    },
  },
  palette: [
    { name: "background", value: "#050914" },
    { name: "cyan", value: "#65efff" },
    { name: "magenta", value: "#ff2ea6" },
    { name: "gold", value: "#ffd45a" },
    { name: "ink", value: "#eaf7ff" },
  ],
  // A primeira decisão está implementada; a segunda (ranking online) não foi concluída.
  decisions: ["done", "unfinished"],
  /*
   * Pinos do Proof, em % da captura, medidos sobre as imagens reais. Ficam na borda direita
   * dos painéis, para não cobrir números nem rótulos:
   *  1 Sistema neon        -> painel "01 / Puntos" (cantos chanfrados, rótulo mono, números)
   *  2 Fases e cenários    -> painel "Fase / Líneas / Siguiente fase en 8 líneas"
   *  3 Controles por toque -> topo da grade dos seis botões grandes
   * Os cenários não aparecem na composição; a evidência deles é o recorte dentro da anotação 2.
   * Modificadores de fase (sobrecarga, pulso, blackout) não estão em nenhuma captura: só texto.
   */
  pins: {
    proof: [
      { note: 1, screen: "wide", x: 90.1, y: 19 },
      { note: 2, screen: "wide", x: 90.1, y: 65.4 },
      { note: 3, screen: "portrait", x: 50, y: 68.3 },
    ],
  },
};
