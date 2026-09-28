import { BadgeShield } from "./BadgeShield";
import styles from "./hero.module.css";

/**
 * Selo circular: texto girando em volta do escudo da marca (o logo real, no centro). Decorativo, portanto oculto de
 * leitores de tela; a rotação do anel some em prefers-reduced-motion pela regra global. O anel fica sempre ancorado:
 * só o escudo responde ao ponteiro (BadgeShield), e só com mouse fino.
 */
export function Badge() {
  return (
    <div className={styles.badge} data-orbit="" aria-hidden="true">
      <svg className={styles.ring} viewBox="0 0 200 200" focusable="false">
        <defs>
          <path id="badge-ring" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1 -148 0" />
        </defs>
        <text className={styles.ringText}>
          <textPath href="#badge-ring" textLength="458" lengthAdjust="spacing">
            DEVELOPER · GRAPHIC DESIGNER · x7rG ·{" "}
          </textPath>
        </text>
      </svg>
      <BadgeShield />
    </div>
  );
}
