import type { CSSProperties, ReactNode } from "react";
import type { ProjectSlug } from "@/content/projects";
import { ArrowRightIcon } from "@/components/ui/icons";
import { cx } from "@/lib/cx";
import { OpenProjectButton } from "./ProjectControls";
import type { StripFamily, StripSide } from "./registry";
import { StripFx } from "./StripFx";
import { StripVisual } from "./StripVisual";
import styles from "./project-strip.module.css";

type ProjectStripProps = {
  slug: ProjectSlug;
  /** "01", "02"...: a posição do projeto na lista. */
  number: string;
  name: string;
  /** O título, que pode levar o tratamento tipográfico do projeto (o itálico da Bya). */
  title: ReactNode;
  category: string;
  year?: string;
  statement: string;
  openLabel: string;
  /** As duas cores do projeto, medidas nos próprios materiais dele: a de identidade e a da luz de borda. */
  accent: string;
  accent2: string;
  /** A família de composição e o lado do texto (ver `stripComposition`). */
  family: StripFamily;
  side: StripSide;
  className?: string;
};

/**
 * Uma faixa de projeto FECHADA. Um só sistema: número, categoria e ano, o título, uma frase, e uma imagem
 * REAL que entra pelas bordas e some no fundo da faixa. A composição segue uma de quatro famílias
 * (`family`/`side`) e cada projeto tem a própria imagem (StripVisual) e a própria cor; o que é comum é o
 * espaçamento, a tipografia, o comportamento e a hierarquia. Nada aqui manda o visitante para fora: o clique
 * abre o projeto.
 * A faixa inteira é a área de clique de UM botão real (::after esticado), então há uma só parada de Tab.
 */
export function ProjectStrip({
  slug,
  number,
  name,
  title,
  category,
  year,
  statement,
  openLabel,
  accent,
  accent2,
  family,
  side,
  className,
}: ProjectStripProps) {
  const titleId = `${slug}-strip-title`;

  return (
    <StripFx
      slug={slug}
      className={cx(styles.strip, styles[family], side === "end" && styles.textEnd, className)}
      style={{ "--acc": accent, "--acc2": accent2 } as CSSProperties}
      labelledBy={titleId}
    >
      <div className={styles.visual} data-vis="">
        <StripVisual slug={slug} />
      </div>

      <div className={styles.copy}>
        <p className={styles.meta}>
          <span className={styles.num}>{number}</span>
          <span className={styles.cat}>{category}</span>
          {year && <span className={styles.year}>{year}</span>}
        </p>
        <h3 id={titleId} className={styles.title}>
          {title}
        </h3>
        <div className={styles.more}>
          <p className={styles.statement}>{statement}</p>
          <OpenProjectButton slug={slug} name={name} label={openLabel} short={openLabel.split(" ")[0]} />
        </div>
        <span className={styles.go} aria-hidden="true">
          <ArrowRightIcon />
        </span>
      </div>
    </StripFx>
  );
}
