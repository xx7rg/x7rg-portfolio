import type { StaticImageData } from "next/image";
import app from "@/assets/projects/discord-camera-live/app.webp";

/**
 * DiscordCameraLive: dados que não dependem de idioma. É um FORK do GoLiveBypass (bezumiya, GPL-3.0-or-later), mantido
 * por x7rG; o caso é COMPACTO de propósito e tudo aqui foi conferido no repositório (xx7rG/DiscordCameraLive) e por diff
 * contra a v1.1.5 do original (bezumiya/GoLiveBypass), a versão em que o fork se baseia:
 *  - herdado sem mudança de lógica: o plugin (só nome e texto de sobre), a API em Go e o standalone (só nomes);
 *  - x7rG: endurecimento do Electron (webPreferences, preload por contextBridge, CSP), troca do app.asar por
 *    staging + rollback, validação de entradas do IPC, CI e Dependabot, documentação (cinco guias, SECURITY.md) e a
 *    release v1.1.5 (exe, AppImage, dmg/zip); nome e marca (emblema x7rG);
 *  - não é do Rogério e não é afirmado como dele: a ideia, o plugin, a API, os instaladores e a interface original.
 * A única imagem é a captura REAL da janela do aplicativo, do próprio repositório (489 × 569). Nada é fabricado: o
 * diagrama da troca do app.asar é desenhado pelo portfólio a partir do código e diz que é do portfólio; as linhas do
 * "antes e depois" são as reais do diff de electron/main.ts. NÃO se usa o GIF de instalação do repositório (é do
 * original e mostra o desktop pessoal de quem o gravou).
 */

export type CodeLine = { sign: "-" | "+"; text: string };

export type DiscordSheetData = {
  slug: "discord-camera-live";
  name: string;
  year: string;
  media: { app: StaticImageData };
  /** O projeto original, para o link de crédito. */
  original: string;
  /** As opções da janela (webPreferences) em electron/main.ts: original (-) e fork (+). */
  code: readonly CodeLine[];
};

export const discordCameraLive: DiscordSheetData = {
  slug: "discord-camera-live",
  name: "DiscordCameraLive",
  year: "2026",
  media: { app },
  original: "https://github.com/bezumiya/GoLiveBypass",
  code: [
    { sign: "-", text: "nodeIntegration: true," },
    { sign: "-", text: "contextIsolation: false," },
    { sign: "+", text: "nodeIntegration: false," },
    { sign: "+", text: "contextIsolation: true," },
    { sign: "+", text: "sandbox: true," },
  ],
};
