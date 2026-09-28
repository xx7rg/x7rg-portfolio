import Image from "next/image";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import type { PinAnchor, ProjectSheetData, ShowcaseScreen } from "@/content/sheets/types";
import type { ProjectSheetCopy } from "@/i18n/types";
import { cx } from "@/lib/cx";
import { ScreenPins } from "./proof-build";
import { ShowcaseReveal } from "./ShowcaseReveal";
import styles from "./showcase.module.css";

type ShowcaseProps = {
  media: ProjectSheetData["media"]["showcase"];
  alt: ProjectSheetCopy["mediaAlt"];
  /** Pinos do Proof; cada tela recebe só os seus. */
  pins: readonly PinAnchor[];
};

const layout: readonly { screen: ShowcaseScreen; sizes: string; order: number }[] = [
  { screen: "wide", sizes: "(min-width: 1100px) 480px, (min-width: 600px) 62vw, 92vw", order: 0 },
  { screen: "portrait", sizes: "(min-width: 600px) 250px, 62vw", order: 1 },
];

/**
 * A partida em duas disposições da mesma interface, sobre um palco escuro com a luz do
 * próprio jogo (ciano e magenta) vazando por trás, com moderação. O jogo é o protagonista:
 * as capturas entram inteiras, sem recorte e sem moldura de aparelho falsa. Em colunas
 * largas as telas ficam lado a lado, em alturas diferentes; em colunas estreitas empilham.
 */
export function Showcase({ media, alt, pins }: ShowcaseProps) {
  return (
    <div className={cx(styles.frame, "glass")}>
      <div className={styles.inner}>
        <ShowcaseReveal className={styles.reveal}>
          <div className={styles.glow} aria-hidden="true" />
          {layout.map(({ screen, sizes, order }) => (
            <figure
              key={screen}
              className={cx(styles.screen, styles[screen])}
              style={{ "--i": order } as React.CSSProperties}
            >
              <ZoomMedia
                id={screen === "wide" ? "neon.wide" : "neon.portrait"}
                group="neon-blockfall"
                image={media[screen]}
                alt={alt[screen]}
                radius={12}
              >
                <Image src={media[screen]} alt={alt[screen]} sizes={sizes} quality={90} />
              </ZoomMedia>
              <ScreenPins pins={pins.filter((pin) => pin.screen === screen)} />
            </figure>
          ))}
        </ShowcaseReveal>
      </div>
    </div>
  );
}
