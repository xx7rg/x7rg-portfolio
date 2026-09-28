"use client";

import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import styles from "./site-nav.module.css";

type DockIconProps = {
  /** Y do ponteiro (clientY), compartilhado por todos os ícones do dock; Infinity quando fora dele. */
  pointerY: MotionValue<number>;
  /** Só true com mouse fino e sem prefers-reduced-motion (decidido em SiteNav). */
  enabled: boolean;
  children: ReactNode;
};

/**
 * Um ícone do dock com ampliação por proximidade do ponteiro — a mesma ideia do FloatingDock (dock
 * do macOS), adaptada ao dock vertical existente: cada ícone só sabe a própria distância vertical
 * até o ponteiro (`pointerY` menos o próprio centro), então a mesma lógica serve para qualquer
 * quantidade de itens, sem depender da geometria horizontal do exemplo original.
 *
 * A escala anda num <span> INTERNO, não no <Link> que o contém: o alvo de clique/foco e a dica
 * (data-tip, no ::after do Link) continuam do tamanho normal, sem distorcer o texto da dica e sem
 * mudar a área de toque. Como é transform, não afeta o layout: os vizinhos não se realinham e o
 * dock não muda de tamanho — o ícone amplia por cima, sem empurrar nada.
 */
export function DockIcon({ pointerY, enabled, children }: DockIconProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const distance = useTransform(pointerY, (value) => {
    if (!enabled || !ref.current) return Infinity;
    const bounds = ref.current.getBoundingClientRect();
    return value - (bounds.top + bounds.height / 2);
  });
  /*
   * Curva estreita para um dock de 32px por ícone (não os [-150,0,150] do exemplo horizontal,
   * feito para ícones bem mais espaçados): a meio caminho para o vizinho (16px, a própria borda
   * entre dois ícones de 32px) a resposta já é pequena (1,18) e, no centro do vizinho (32px), quase
   * não sobra nada (1,04) — o ícone sob o ponteiro sempre domina, sem os dois parecerem "ativados"
   * ao mesmo tempo. Sete pontos, não três, para o degrau em volta do centro ficar íngreme.
   */
  const targetScale = useTransform(
    distance,
    [-48, -32, -16, 0, 16, 32, 48],
    [1, 1.04, 1.18, 1.55, 1.18, 1.04, 1],
  );
  const scale = useSpring(targetScale, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.span ref={ref} className={styles.dockIcon} style={enabled ? { scale } : undefined}>
      {children}
    </motion.span>
  );
}
