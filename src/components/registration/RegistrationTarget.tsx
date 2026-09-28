import { cx } from "@/lib/cx";
import styles from "./registration.module.css";

type RegistrationTargetProps = {
  /** "aligned": cruz e anel concêntricos. "misaligned": deslocados, como duas placas fora de registro. */
  state?: "aligned" | "misaligned";
  className?: string;
};

/**
 * Alvo de registro: a cruz pertence a uma placa e o anel à outra. Quando
 * coincidem, as placas estão em registro. Primitiva reservada: hoje só aparece
 * na folha de QA, porque a nova direção visual tirou o wordmark do hero.
 * Decorativo para leitores de tela: o significado vem do texto ao redor.
 */
export function RegistrationTarget({ state = "aligned", className }: RegistrationTargetProps) {
  return (
    <svg
      className={cx(styles.target, className)}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      data-registration={state}
    >
      <path className={styles.cross} d="M2 32H62M32 2V62" />
      <circle className={styles.ring} cx="32" cy="32" r="13" />
    </svg>
  );
}
