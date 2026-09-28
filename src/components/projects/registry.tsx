import type { ReactNode } from "react";
import { AdrianoSheet } from "@/components/adriano-sheet/AdrianoSheet";
import { AquaSheet } from "@/components/aqua-sheet/AquaSheet";
import { ByaSheet } from "@/components/bya-sheet/ByaSheet";
import { DiscordSheet } from "@/components/discord-sheet/DiscordSheet";
import { playfair } from "@/components/bya-sheet/playfair";
import { ProjectSheet } from "@/components/project-sheet/ProjectSheet";
import { CheckoutSheet } from "@/components/checkout-sheet/CheckoutSheet";
import { LightSheet } from "@/components/light-sheet/LightSheet";
import { MoonSheet } from "@/components/moon-sheet/MoonSheet";
import { ReciboSheet } from "@/components/recibo-sheet/ReciboSheet";
import { compact } from "@/content/compact";
import type { CompactSlug, ProjectSlug } from "@/content/projects";
import { adrianoReformasVigo } from "@/content/sheets/adriano-reformas-vigo";
import { aquacontrol } from "@/content/sheets/aquacontrol";
import { checkout } from "@/content/sheets/checkout";
import { discordCameraLive } from "@/content/sheets/discord-camera-live";
import { feitoPelaBya } from "@/content/sheets/feito-pela-bya";
import { lightLogin } from "@/content/sheets/light-login";
import { loginTheMoon } from "@/content/sheets/login-the-moon";
import { neonBlockfall } from "@/content/sheets/neon-blockfall";
import { reciboDigital } from "@/content/sheets/recibo-digital";
import type { Dictionary } from "@/i18n/types";
import { CompactProject } from "./CompactProject";

/*
 * O que é próprio de cada projeto: o que abre por dentro e o tratamento da faixa. Os seis estudos de caso
 * abrem a folha completa; os demais abrem a apresentação compacta (CompactProject). Promover um compacto
 * a caso: escrever a folha, mudar `kind` em content/projects.ts e acrescentar um `case` aqui.
 * ProjectsSection não muda.
 */

/** O que abre dentro do projeto: a folha completa ou a apresentação compacta. Fica no HTML mesmo fechado. */
export function renderProject(slug: ProjectSlug, dict: Dictionary): ReactNode {
  switch (slug) {
    case "neon-blockfall":
      return <ProjectSheet data={neonBlockfall} copy={dict.projects["neon-blockfall"]} shared={dict.sheet} />;
    case "aquacontrol":
      return <AquaSheet data={aquacontrol} copy={dict.projects.aquacontrol} shared={dict.sheet} />;
    case "feito-pela-bya":
      return (
        <ByaSheet
          data={feitoPelaBya}
          copy={dict.projects["feito-pela-bya"]}
          shared={dict.sheet}
          newTab={dict.a11y.newTab}
        />
      );
    case "light-login":
      return (
        <LightSheet
          data={lightLogin}
          copy={dict.projects["light-login"]}
          shared={dict.sheet}
          viewSource={dict.work.viewSource}
          newTab={dict.a11y.newTab}
        />
      );
    // O DiscordCameraLive continua `compact` em content/projects.ts (o tipo do CompactProject depende de haver um compacto),
    // mas abre esta folha compacta própria: é um fork e a folha separa o herdado do que x7rG modificou.
    case "discord-camera-live":
      return (
        <DiscordSheet
          data={discordCameraLive}
          copy={dict.projects["discord-camera-live"]}
          shared={dict.sheet}
          viewSource={dict.work.viewSource}
          newTab={dict.a11y.newTab}
        />
      );
    case "adriano-reformas-vigo":
      return (
        <AdrianoSheet
          data={adrianoReformasVigo}
          copy={dict.projects["adriano-reformas-vigo"]}
          shared={dict.sheet}
          newTab={dict.a11y.newTab}
        />
      );
    case "login-the-moon":
      return (
        <MoonSheet
          data={loginTheMoon}
          copy={dict.projects["login-the-moon"]}
          shared={dict.sheet}
          viewSource={dict.work.viewSource}
          newTab={dict.a11y.newTab}
        />
      );
    case "checkout":
      return (
        <CheckoutSheet
          data={checkout}
          copy={dict.projects.checkout}
          shared={dict.sheet}
          viewSource={dict.work.viewSource}
          newTab={dict.a11y.newTab}
        />
      );
    case "recibo-digital":
      return (
        <ReciboSheet
          data={reciboDigital}
          copy={dict.projects["recibo-digital"]}
          shared={dict.sheet}
          viewSource={dict.work.viewSource}
          newTab={dict.a11y.newTab}
        />
      );
    default:
      return <CompactProject slug={slug as CompactSlug} dict={dict} />;
  }
}

/** A cor de identidade de cada projeto: medida nos materiais dele (jogo, aplicativo, marca e capturas). */
export function stripAccent(slug: ProjectSlug): string {
  switch (slug) {
    case "neon-blockfall":
      return "#65efff";
    case "aquacontrol":
      return "#4fb3d3";
    case "feito-pela-bya":
      return "#d48aad";
    case "recibo-digital":
      return "#c09040";
    case "checkout":
      return "#5090ff";
    case "light-login":
      return "#f0b070";
    default:
      return compact[slug as CompactSlug].accent;
  }
}

/** O título da faixa. Na Bya ele leva o wordmark do site: "Feito Pela" em romano e "Bya" em itálico. */
export function stripTitle(slug: ProjectSlug, name: string): ReactNode {
  if (slug !== "feito-pela-bya") return name;
  const words = name.split(" ");
  const accent = words.pop();
  return (
    <>
      {words.join(" ")} <em>{accent}</em>
    </>
  );
}

/** A segunda cor do projeto (luz de borda e atmosfera): também medida nos materiais dele. */
export function stripAccent2(slug: ProjectSlug): string {
  switch (slug) {
    case "neon-blockfall":
      return "#ff2ea6";
    case "aquacontrol":
      return "#0a7ea4";
    case "feito-pela-bya":
      return "#c26c96";
    case "adriano-reformas-vigo":
      return "#f6a86b";
    case "login-the-moon":
      return "#6b72f1";
    case "light-login":
      return "#d5904a";
    case "checkout":
      return "#3348d6";
    case "recibo-digital":
      return "#daaf66";
    case "discord-camera-live":
      return "#4d57cc";
  }
}

export type StripFamily = "split" | "reverse" | "bleed" | "object";
export type StripSide = "start" | "end";

/**
 * A composição da faixa fechada. Quatro famílias, não nove desenhos: divisão (texto à esquerda, mídia à
 * direita), reverso (mídia à esquerda, texto à direita), sangria (a mídia atravessa a faixa e o texto fica
 * sobre o degradê) e objeto (um elemento isolado no espaço negativo). `side` diz de que lado fica o TEXTO.
 * Tipografia, espaçamento, borda, movimento e interação são os mesmos em todas.
 */
export function stripComposition(slug: ProjectSlug): { family: StripFamily; side: StripSide } {
  switch (slug) {
    case "neon-blockfall":
    case "checkout":
      return { family: "split", side: "start" };
    case "aquacontrol":
    case "login-the-moon":
      return { family: "reverse", side: "end" };
    case "adriano-reformas-vigo":
    case "light-login":
      return { family: "bleed", side: "start" };
    case "recibo-digital":
      return { family: "object", side: "end" };
    default:
      return { family: "object", side: "start" };
  }
}

/** Classe extra da faixa: na Bya, a variável da fonte serifada da marca. */
export function stripClass(slug: ProjectSlug): string | undefined {
  return slug === "feito-pela-bya" ? playfair.variable : undefined;
}
