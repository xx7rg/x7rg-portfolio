"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import escudo from "@/assets/brand/escudo.png";
import styles from "./hero.module.css";

/*
 * O escudo do selo, montado no círculo como um emblema. O círculo é a moldura e fica ancorado (o anel de texto gira sozinho,
 * independente); o escudo ganha profundidade dentro dele e se ORIENTA para o ponteiro em vez de deslizar até ele:
 *  - a posição do ponteiro dentro do selo, normalizada pelo raio (-1 a 1), vira guinada e arfagem (rotateY e rotateX)
 *    em perspectiva (a perspectiva está em hero.module.css), com o transform-origin no centro (o emblema gira pelo miolo);
 *  - a translação é secundária (poucos px, só reforça) e há uma profundidade mínima (translateZ e uma escala quase
 *    imperceptível) enquanto o ponteiro está no selo;
 *  - a 72 px, um giro de poucos graus quase não muda a geometria, então uma luz MUITO sutil ajuda a ler a orientação:
 *    uma cópia mais clara do próprio escudo, revelada por uma máscara radial no lado do ponteiro, e uma cópia mais
 *    escura no lado oposto. Como são o mesmo PNG, a luz nunca sai da silhueta nem cobre os detalhes; ela cresce com o
 *    quanto o ponteiro está fora do centro (no centro é neutra) e em repouso, no toque e em movimento reduzido tem
 *    opacidade 0;
 *  - a resposta é CONTIDA: só existe com o ponteiro dentro do círculo (os eventos são do próprio selo, não da janela).
 *    Ao sair, tudo volta ao neutro;
 *  - um suavizador exponencial persegue o alvo (sem mola, sem quique, sem ultrapassar), um pouco mais ágil ao seguir
 *    do que ao voltar;
 *  - só mouse fino, e nunca com movimento reduzido. No toque o escudo fica parado e neutro.
 * É decorativo (o selo é aria-hidden): sem foco, sem alvo de clique. Nada usa estado do React por quadro: um laço
 * requestAnimationFrame escreve um transform e três variáveis CSS (compositor/pintura, sem layout) e para sozinho
 * quando chega ao alvo.
 */

/** Máximos da orientação, em graus (na borda do selo). */
const MAX_YAW = 9;
const MAX_PITCH = 8;
/** A translação é só reforço (px), a profundidade é mínima (px) e a escala, quase imperceptível. */
const MAX_SHIFT = 3;
const DEPTH = 7;
const SCALE_UP = 0.014;
/** A luz: quanto a máscara anda (pontos percentuais, para o lado do ponteiro) e a opacidade máxima das cópias. */
const SHEEN_TRAVEL = 34;
const SHEEN_OPACITY = 0.7;
/** Constantes de tempo (ms) do suavizador: ~95% em 3τ, ou seja ~0,22 s ao seguir e ~0,35 s ao voltar. */
const TAU_FOLLOW = 72;
const TAU_RETURN = 115;
/** Abaixo disto o escudo já está no alvo. */
const EPSILON = 0.02;

type Pose = { rx: number; ry: number; tx: number; ty: number; tz: number; s: number; gx: number; gy: number; sh: number };
const NEUTRAL: Pose = { rx: 0, ry: 0, tx: 0, ty: 0, tz: 0, s: 0, gx: 50, gy: 50, sh: 0 };
/** Grandezas minúsculas pesam mais para entrar na mesma medida de "chegou". */
const WEIGHT: Partial<Record<keyof Pose, number>> = { s: 100, sh: 20 };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function BadgeShield() {
  const slot = useRef<HTMLSpanElement>(null);
  const body = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = body.current;
    const orbit = slot.current?.parentElement;
    if (!element || !orbit) return;

    // any-hover/any-pointer (não hover/pointer): em muitas máquinas Windows com tela sensível
    // ao toque, hover/pointer descrevem só o dispositivo PRIMÁRIO e podem voltar "none"/"coarse"
    // mesmo com um mouse de verdade plugado e em uso — bloqueando a interação por completo nessas
    // máquinas (era a causa raiz de "não aparece de forma consistente no navegador real": nenhum
    // ambiente de teste headless reporta tela de toque, então o bug nunca aparecia lá). Isso não
    // afrouxa a regra "só mouse fino": quem decide se a POSE muda por quadro é o pointerType real
    // de cada evento em onMove/target, que já exige "mouse". any-hover/any-pointer só evita que a
    // função fique presa em "false" por capacidade de toque secundária.
    const fine = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const enabled = () => fine.matches && !reduced.matches;

    let pointer: { x: number; y: number } | null = null;
    let current: Pose = { ...NEUTRAL };
    let frame = 0;
    let last = 0;

    /** O alvo a partir do ponteiro, e se o escudo está voltando ao neutro (ponteiro fora do selo). */
    const target = (): { pose: Pose; returning: boolean } => {
      if (!pointer || !enabled()) return { pose: NEUTRAL, returning: true };
      const box = orbit.getBoundingClientRect();
      const radius = box.width / 2;
      const nx = clamp((pointer.x - (box.left + radius)) / radius, -1, 1);
      const ny = clamp((pointer.y - (box.top + box.height / 2)) / radius, -1, 1);
      // Fora do círculo (os cantos da caixa) não há resposta.
      if (Math.hypot(nx, ny) > 1) return { pose: NEUTRAL, returning: true };
      return {
        pose: {
          ry: nx * MAX_YAW,
          rx: -ny * MAX_PITCH,
          tx: nx * MAX_SHIFT,
          ty: ny * MAX_SHIFT,
          tz: DEPTH,
          s: SCALE_UP,
          gx: 50 + nx * SHEEN_TRAVEL,
          gy: 50 + ny * SHEEN_TRAVEL,
          sh: clamp(Math.hypot(nx, ny) * 1.4, 0, 1),
        },
        returning: false,
      };
    };

    const paint = () => {
      const { rx, ry, tx, ty, tz, s, gx, gy, sh } = current;
      element.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, ${tz.toFixed(2)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${(1 + s).toFixed(4)})`;
      element.style.setProperty("--gx", `${gx.toFixed(1)}%`);
      element.style.setProperty("--gy", `${gy.toFixed(1)}%`);
      element.style.setProperty("--sheen", (sh * SHEEN_OPACITY).toFixed(3));
    };

    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min(now - last, 48) : 16;
      last = now;
      const { pose, returning } = target();
      const k = 1 - Math.exp(-dt / (returning ? TAU_RETURN : TAU_FOLLOW));
      let gap = 0;
      const next = { ...current };
      for (const key of Object.keys(next) as (keyof Pose)[]) {
        // O brilho só anda com o ponteiro: ao voltar, a posição dele fica onde estava e só a opacidade apaga.
        const goal = returning && (key === "gx" || key === "gy") ? current[key] : pose[key];
        next[key] += (goal - next[key]) * k;
        gap = Math.max(gap, Math.abs(goal - next[key]) * (WEIGHT[key] ?? 1));
      }
      current = gap < EPSILON ? { ...next, ...pose, ...(returning ? { gx: next.gx, gy: next.gy } : {}) } : next;
      paint();
      if (gap < EPSILON) {
        last = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !enabled()) return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const release = () => {
      pointer = null;
      schedule();
    };

    // Eventos só do selo: sair do círculo devolve o escudo ao neutro; nada escuta a página inteira.
    orbit.addEventListener("pointerenter", onMove, { passive: true });
    orbit.addEventListener("pointermove", onMove, { passive: true });
    orbit.addEventListener("pointerleave", release);
    orbit.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    reduced.addEventListener("change", release);
    fine.addEventListener("change", release);

    return () => {
      orbit.removeEventListener("pointerenter", onMove);
      orbit.removeEventListener("pointermove", onMove);
      orbit.removeEventListener("pointerleave", release);
      orbit.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
      reduced.removeEventListener("change", release);
      fine.removeEventListener("change", release);
      if (frame) cancelAnimationFrame(frame);
      element.style.transform = "";
      element.style.removeProperty("--gx");
      element.style.removeProperty("--gy");
      element.style.removeProperty("--sheen");
    };
  }, []);

  return (
    <span ref={slot} className={styles.shieldSlot}>
      <span ref={body} className={styles.shieldBody}>
        <Image className={styles.shield} src={escudo} alt="" sizes="72px" quality={90} priority draggable={false} />
        <Image className={styles.sheen} src={escudo} alt="" sizes="72px" quality={90} loading="eager" draggable={false} aria-hidden="true" />
        <Image className={styles.shade} src={escudo} alt="" sizes="72px" quality={90} loading="eager" draggable={false} aria-hidden="true" />
      </span>
    </span>
  );
}
