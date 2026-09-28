import type { ComponentType, SVGProps } from "react";
import { cx } from "@/lib/cx";
import styles from "./section-label.module.css";

type SectionLabelProps = {
  id: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  children: string;
  /** Contagem discreta depois do título ("09"). Decorativa: a lista já diz quantos projetos há. */
  count?: string;
  className?: string;
};

/**
 * Rótulo de seção em pílula, com ícone. É o <h2> da seção: o rótulo curto e
 * discreto faz o papel de título, como nos portfólios de referência.
 */
export function SectionLabel({ id, Icon, children, count, className }: SectionLabelProps) {
  return (
    <h2 id={id} className={cx(styles.label, className)}>
      <Icon />
      {children}
      {count && (
        <span className={styles.count} aria-hidden="true">
          <span className={styles.slash}>/</span>
          {count}
        </span>
      )}
    </h2>
  );
}
