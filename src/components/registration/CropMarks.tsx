import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./registration.module.css";

const corners = ["tl", "tr", "bl", "br"] as const;

type CropMarksProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Marcas de corte ao redor de um artefato (captura, vídeo, diagrama). Dizem
 * onde termina o artefato e começa o portfólio. Não usar em cantos de viewport
 * nem em elementos que não sejam mídia. O consumidor reserva espaço para as
 * marcas, que ficam fora do retângulo.
 */
export function CropMarks({ children, className }: CropMarksProps) {
  return (
    <div className={cx(styles.crop, className)}>
      {children}
      {corners.map((corner) => (
        <span key={corner} className={styles.mark} data-corner={corner} aria-hidden="true" />
      ))}
    </div>
  );
}
