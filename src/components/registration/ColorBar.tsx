import { cx } from "@/lib/cx";
import styles from "./registration.module.css";

export type Swatch = {
  name: string;
  /** Qualquer cor CSS válida, tirada dos tokens reais do projeto. */
  value: string;
};

type ColorBarProps = {
  swatches: readonly Swatch[];
  /** Nome acessível da paleta, no idioma da página. */
  label: string;
  className?: string;
};

/**
 * Barra de cores como nas provas de impressão: mostra a paleta REAL de um
 * projeto, no lugar de uma fileira de tecnologias. A informação também está
 * em texto, para não depender só da cor.
 */
export function ColorBar({ swatches, label, className }: ColorBarProps) {
  return (
    <ul className={cx(styles.colorBar, className)} aria-label={label}>
      {swatches.map((swatch) => (
        <li key={swatch.name} className={styles.swatch} style={{ backgroundColor: swatch.value }}>
          <span className="sr-only">
            {swatch.name}, {swatch.value}
          </span>
        </li>
      ))}
    </ul>
  );
}
