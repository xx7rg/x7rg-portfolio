import Image from "next/image";
import { ByaCrop } from "@/components/bya-sheet/ByaCrop";
import type { ProjectSlug } from "@/content/projects";
import { compact } from "@/content/compact";
import byaLogoStrip from "@/assets/feito-pela-bya/logo-strip.webp";
import { checkout } from "@/content/sheets/checkout";
import { lightLogin } from "@/content/sheets/light-login";
import { appRegion, aquacontrol } from "@/content/sheets/aquacontrol";
import { neonBlockfall } from "@/content/sheets/neon-blockfall";
import { reciboDigital } from "@/content/sheets/recibo-digital";
import styles from "./strip-visual.module.css";

/*
 * A imagem de cada faixa, com a mídia REAL do projeto e uma composição própria (nada de miniatura em
 * cartão). São decorativas aqui (alt vazio): o texto da faixa diz o que o projeto é, e o projeto aberto
 * tem a mídia para inspecionar. Como o projeto fechado não baixa mídia, estas são as únicas imagens do
 * índice. Cada camada tem uma profundidade (`--d`) que o ponteiro usa para deslocá-la um pouco. O tamanho
 * e a posição de cada uma estão em strip-visual.module.css, junto com a família da faixa (registry.tsx).
 *  - Neon Blockfall (divisão): a tela do jogo e o celular à frente, sangrando pelas bordas;
 *  - AquaControl (reverso): o painel e a lista de visitas, a interface clara do aplicativo no palco grafite;
 *  - Feito Pela Bya (objeto): o logo, sozinho, sobre o ameixa da marca;
 *  - Adriano (sangria): o site entra pela direita em duas camadas (a mesma captura, ao fundo escurecida e à frente nítida);
 *  - Login The Moon (reverso): a lua, o cenário e o cartão do login;
 *  - Light Login (sangria): o abajur no centro da faixa e o cartão do login atrás dele;
 *  - Checkout (divisão): a visão geral e a confirmação, em camadas;
 *  - Recibo Digital (objeto): a folha clara, com a impressora e o recibo saindo pela borda;
 *  - DiscordCameraLive (objeto): a janela do aplicativo, de pé, no escuro.
 */
const layer = (depth: number) => ({ "--d": depth }) as React.CSSProperties;

export function StripVisual({ slug }: { slug: ProjectSlug }) {
  switch (slug) {
    case "neon-blockfall": {
      const { wide, portrait } = neonBlockfall.media.showcase;
      return (
        <div className={`${styles.stage} ${styles.neon}`}>
          <div className={styles.neonGlow} aria-hidden="true" />
          <Image className={styles.neonWide} style={layer(9)} src={wide} alt="" sizes="(min-width: 1100px) 480px, 80vw" quality={75} />
          <Image className={styles.neonPortrait} style={layer(18)} src={portrait} alt="" sizes="(min-width: 1100px) 170px, 26vw" quality={75} />
        </div>
      );
    }
    case "aquacontrol":
      return (
        <div className={`${styles.stage} ${styles.aqua}`}>
          <ByaCrop shot={{ image: aquacontrol.media.hero.main.image, crop: appRegion }} span={0.5} className={styles.aquaMain} />
          <ByaCrop shot={{ image: aquacontrol.media.hero.back.image, crop: appRegion }} span={0.3} className={styles.aquaBack} />
        </div>
      );
    case "feito-pela-bya":
      // Variante própria (420x420, ~34KB) em vez de feitoPelaBya.media.logo (1254x1254,
      // ~309KB, usado no caso aberto): aqui a imagem nunca passa de 210px/46vw, e a
      // exportação estática serve o arquivo original sem redimensionar (images.unoptimized
      // no next.config.ts) — sem essa variante, o índice fechado baixava 9x mais bytes do
      // que o exibido precisa.
      return (
        <div className={`${styles.stage} ${styles.bya}`}>
          <Image className={styles.byaLogo} style={layer(10)} src={byaLogoStrip} alt="" sizes="(min-width: 1100px) 210px, 46vw" quality={75} />
        </div>
      );
    case "adriano-reformas-vigo":
      return (
        <div className={`${styles.stage} ${styles.adriano}`}>
          <Image className={styles.adrianoBack} style={layer(4)} src={compact[slug].shots[0].image} alt="" sizes="(min-width: 1100px) 720px, 96vw" quality={70} />
          <Image className={styles.adrianoShot} style={layer(11)} src={compact[slug].shots[0].image} alt="" sizes="(min-width: 1100px) 720px, 96vw" quality={70} />
        </div>
      );
    case "login-the-moon":
      return (
        <div className={`${styles.stage} ${styles.moon}`}>
          <Image className={styles.cover} style={layer(8)} src={compact[slug].shots[0].image} alt="" sizes="(min-width: 1100px) 560px, 100vw" quality={75} />
        </div>
      );
    case "light-login":
      return (
        <div className={`${styles.stage} ${styles.light}`}>
          <Image className={styles.cover} style={layer(8)} src={lightLogin.media.strip} alt="" sizes="(min-width: 1100px) 620px, 100vw" quality={75} />
        </div>
      );
    case "checkout":
      return (
        <div className={`${styles.stage} ${styles.checkout}`}>
          <Image className={styles.checkoutMain} style={layer(8)} src={checkout.media.strip.overview} alt="" sizes="(min-width: 1100px) 440px, 74vw" quality={75} />
          <Image className={styles.checkoutBack} style={layer(16)} src={checkout.media.strip.receipt} alt="" sizes="(min-width: 1100px) 270px, 44vw" quality={75} />
        </div>
      );
    case "recibo-digital":
      return (
        <div className={`${styles.stage} ${styles.recibo}`}>
          <Image className={styles.reciboShot} style={layer(9)} src={reciboDigital.media.states[2].shot.image} alt="" sizes="(min-width: 1100px) 520px, 150vw" quality={75} />
        </div>
      );
    case "discord-camera-live":
      return (
        <div className={`${styles.stage} ${styles.discord}`}>
          <Image className={styles.discordApp} style={layer(12)} src={compact[slug].shots[0].image} alt="" sizes="(min-width: 1100px) 170px, 44vw" quality={80} />
        </div>
      );
  }
}
