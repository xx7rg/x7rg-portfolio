import { cx } from "@/lib/cx";
import styles from "./registration.module.css";

export type SlugItem = {
  label: string;
  value: string;
  /** Texto corrido (um crédito): ocupa a linha inteira em vez de uma coluna. */
  wide?: boolean;
};

type SlugLineProps = {
  items: readonly SlugItem[];
  className?: string;
};

/**
 * Linha de slug / especificação: metadados de uma folha (tipo, ano, estado)
 * como a ficha de uma prova impressa. Rótulo e valor em colunas, sem
 * separadores de pontuação.
 */
export function SlugLine({ items, className }: SlugLineProps) {
  return (
    <dl className={cx(styles.slugLine, "type-meta", className)}>
      {items.map((item) => (
        <div key={item.label} className={cx(styles.slugItem, item.wide && styles.slugItemWide)}>
          <dt className={styles.slugLabel}>{item.label}</dt>
          <dd className={styles.slugValue}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
