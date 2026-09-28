import type { StaticImageData } from "next/image";
import adrianoHome from "@/assets/projects/adriano-reformas-vigo/home.webp";
import discordApp from "@/assets/projects/discord-camera-live/app.webp";
import moonGranted from "@/assets/projects/login-the-moon/granted.webp";
import moonLanding from "@/assets/projects/login-the-moon/landing.webp";
import moonLogin from "@/assets/projects/login-the-moon/login.webp";
import type { CaptionKey } from "./media-captions";
import type { CompactSlug } from "./projects";

/**
 * Os projetos compactos: as imagens são REAIS (capturas dos próprios projetos) e o resto é só o que
 * está documentado. Nada aqui é inventado:
 *  - `accent`: a cor saturada mais frequente da captura principal (medida na imagem);
 *  - `tech`: só o que o README público do repositório declara (adriano: badges HTML/CSS/JS;
 *    login-the-moon: Next.js, React, TypeScript; discord: TypeScript);
 *  - papel de Rogério: ainda sem confirmação por projeto, então não aparece (o campo `role` existe na
 *    estrutura do texto quando houver).
 * Capturas: login-the-moon vem dos `docs/` do repositório; adriano-reformas-vigo foi capturado do site
 * publicado; discord-camera-live é a janela do app.
 * Os arquivos são cópias WebP de entrega; os mestres ficam nos repositórios e em `IMG rg/project-captures/`.
 */

export type CompactShot = { readonly key: CaptionKey; readonly image: StaticImageData };

export type CompactData = {
  readonly accent: string;
  readonly tech: readonly string[];
  /** A primeira é a principal; as demais entram numa fileira de apoio. */
  readonly shots: readonly [CompactShot, ...CompactShot[]];
};

// O Login The Moon e o Adriano Reformas Vigo viraram casos, mas as faixas deles continuam lendo a captura principal daqui (StripVisual e a cor da faixa).
export const compact: Record<CompactSlug | "login-the-moon" | "adriano-reformas-vigo", CompactData> = {
  "adriano-reformas-vigo": {
    accent: "#ff8020",
    tech: ["HTML", "CSS", "JavaScript"],
    shots: [{ key: "adriano.1", image: adrianoHome }],
  },
  "login-the-moon": {
    accent: "#8090ff",
    tech: ["Next.js", "React", "TypeScript"],
    shots: [
      { key: "moon.1", image: moonLogin },
      { key: "moon.2", image: moonLanding },
      { key: "moon.3", image: moonGranted },
    ],
  },
  "discord-camera-live": {
    accent: "#f0c8c8",
    tech: ["TypeScript"],
    shots: [{ key: "discord.1", image: discordApp }],
  },
};
