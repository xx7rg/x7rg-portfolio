import type { Dictionary } from "@/i18n/types";
import { Badge } from "./Badge";
import styles from "./hero.module.css";

/**
 * Hero (coluna direita): uma camada pequena de identidade (nome e função) e, abaixo,
 * o manifesto em tipografia grande, com dois trechos em marca-texto. O nome é o
 * único <h1>; o manifesto é texto de apresentação, não um título.
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const [start, highlightA, middle, highlightB, end] = dict.hero.headline;

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title" data-slug-section>
      <div className={styles.identity}>
        <h1 id="hero-title" className={styles.name}>
          Rogério Gomes
        </h1>
        <p className={styles.role}>
          Developer{" "}
          {/* Se a linha quebrar, o × vai junto com "Graphic Designer" para a linha de baixo. */}
          <span className={styles.roleTail}>
            {/* O × é decorativo: leitores de tela ouvem "Developer e Graphic Designer". */}
            <span className={styles.times} aria-hidden="true">
              <svg viewBox="0 0 10 10" focusable="false">
                <path d="M1 1L9 9M9 1L1 9" />
              </svg>
            </span>
            <span className="sr-only">{dict.hero.roleJoin} </span>
            Graphic Designer
          </span>
        </p>
      </div>

      <p className={styles.headline}>
        {start}
        <span className={styles.highlightA}>{highlightA}</span>
        {middle}
        <span className={styles.highlightB}>{highlightB}</span>
        {end}
      </p>

      <Badge />
    </section>
  );
}
