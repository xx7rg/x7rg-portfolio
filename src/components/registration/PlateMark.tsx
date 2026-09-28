import { cx } from "@/lib/cx";
import styles from "./registration.module.css";

type PlateMarkProps = {
  /** "aligned": as duas placas coincidem. "misaligned": deslocadas, como uma prova fora de registro. */
  state?: "aligned" | "misaligned";
  className?: string;
};

/**
 * Marca de estado de duas placas quadradas, para sinalizar um item de conteúdo
 * (não uma imagem) que está em registro ou fora dele. "Fora de registro" quer
 * dizer planejado ou tentado, mas não concluído. Não é o alvo de registro do
 * hero: aquele continua reservado. Sempre acompanhada de texto que diz o que
 * o estado significa; sozinha, é decorativa para leitores de tela.
 */
export function PlateMark({ state = "aligned", className }: PlateMarkProps) {
  return (
    <svg
      className={cx(styles.plateMark, className)}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      data-registration={state}
    >
      <rect className={styles.plateB} x="2" y="2" width="9" height="9" rx="2" />
      <rect className={styles.plateA} x="2" y="2" width="9" height="9" rx="2" />
    </svg>
  );
}
