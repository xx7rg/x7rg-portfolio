import Image, { type StaticImageData } from "next/image";
import blogPqdt from "@/assets/journey/companies/20blogpqdt.png";
import alteraOcyan from "@/assets/journey/companies/altera-ocyan-fpso.avif";
import atento from "@/assets/journey/companies/atento.svg";
import bfe from "@/assets/journey/companies/bfe.png";
import eqs from "@/assets/journey/companies/eqs.png";
import exercitoBrasileiro from "@/assets/journey/companies/exercito-brasileiro.png";
import foresea from "@/assets/journey/companies/foresea.png";
import gaeco from "@/assets/journey/companies/gaeco.png";
import mppr from "@/assets/journey/companies/mppr.png";
import nexa from "@/assets/journey/companies/nexa.webp";
import odebrecht from "@/assets/journey/companies/odebrecht.jpg";
import petrobras from "@/assets/journey/companies/petrobras.png";
import sonda from "@/assets/journey/companies/sonda.png";
import spread from "@/assets/journey/companies/spread.png";
import { RouteIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/i18n/types";
import { cx } from "@/lib/cx";
import styles from "./journey.module.css";

type LogoKey = keyof Dictionary["journey"]["logos"];
/**
 * Ajuste óptico, não matemático: wordmarks largos e simples (`wide`) recebem mais largura para
 * ganhar presença; brasões compactos e detalhados (`tall`) recebem mais altura para não sumirem
 * ao lado de uma marca plana. Sem isso, o mesmo max-height para todos deixaria os wordmarks bem
 * mais finos que os brasões (ver .logoWide/.logoTall em journey.module.css).
 */
type Optical = "wide" | "tall" | "square";

const opticalClass: Record<Optical, string> = {
  wide: styles.logoWide,
  tall: styles.logoTall,
  square: styles.logoSquare,
};

const companies: readonly { key: LogoKey; src: StaticImageData; optical?: Optical }[] = [
  { key: "blogPqdt", src: blogPqdt, optical: "tall" },
  { key: "alteraOcyan", src: alteraOcyan, optical: "wide" },
  { key: "atento", src: atento, optical: "wide" },
  { key: "bfe", src: bfe, optical: "tall" },
  { key: "exercitoBrasileiro", src: exercitoBrasileiro, optical: "tall" },
  { key: "gaeco", src: gaeco },
  { key: "nexa", src: nexa, optical: "wide" },
  { key: "mppr", src: mppr },
  { key: "odebrecht", src: odebrecht },
  { key: "petrobras", src: petrobras },
  { key: "sonda", src: sonda },
  { key: "spread", src: spread },
  { key: "foresea", src: foresea },
  { key: "eqs", src: eqs, optical: "wide" },
] as const;

/**
 * Trajetória: um letreiro contínuo com logos de empresas que fizeram parte do caminho profissional
 * de Rogério — atmosférico, não uma lista de clientes. Cada item é um logo (com ajuste óptico
 * próprio) + o nome da empresa por baixo, com um traço dourado discreto como assinatura x7rG. A
 * trilha usa duas cópias da lista lado a lado para o loop contínuo em CSS puro (translateX de 0 a
 * -50%); só a primeira cópia entra na árvore de acessibilidade, a segunda é aria-hidden.
 */
export function JourneySection({ dict }: { dict: Dictionary }) {
  const { journey: copy } = dict;

  return (
    <section id="journey" className={styles.section} aria-labelledby="journey-title" data-slug-section>
      <SectionLabel id="journey-title" Icon={RouteIcon}>
        {copy.label}
      </SectionLabel>

      <div className={styles.intro}>
        <p className={styles.title}>{copy.title}</p>
        <p className={styles.lead}>{copy.lead}</p>
      </div>

      <div className={styles.viewport}>
        <div className={styles.track}>
          <ul className={styles.set} aria-label={copy.companiesLabel}>
            {companies.map(({ key, src, optical }) => (
              <li key={key} className={styles.item}>
                <div className={styles.stage}>
                  <Image
                    className={cx(styles.logo, optical && opticalClass[optical])}
                    src={src}
                    alt={copy.logos[key]}
                    sizes="190px"
                    quality={90}
                  />
                </div>
                <span className={styles.name}>{copy.logos[key]}</span>
              </li>
            ))}
          </ul>
          <ul className={styles.set} aria-hidden="true">
            {companies.map(({ key, src, optical }) => (
              <li key={`dup-${key}`} className={styles.item}>
                <div className={styles.stage}>
                  <Image
                    className={cx(styles.logo, optical && opticalClass[optical])}
                    src={src}
                    alt=""
                    sizes="190px"
                    quality={90}
                  />
                </div>
                <span className={styles.name}>{copy.logos[key]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
