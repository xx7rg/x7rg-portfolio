"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import styles from "./state-reveal.module.css";

type StateRevealProps = {
  off: StaticImageData;
  on: StaticImageData;
  altOff: string;
  altOn: string;
  labels: { group: string; range: string; off: string; on: string };
  /** Em coluna estreita, o enquadramento se fecha no abajur (proporção e ponto de corte). */
  narrow: { ratio: string; position: string };
  sizes: string;
  /** Onde a divisória começa, em % da largura: por padrão, no meio do abajur. */
  initial?: number;
};

const clamp = (value: number) => Math.min(100, Math.max(0, value));

/**
 * O MESMO quadro com a luz apagada e acesa, lado a lado, separados por uma divisória. As duas imagens são
 * capturas reais do projeto na mesma janela, então o abajur, o cordão e o formulário caem no mesmo lugar: o
 * que muda é só o estado. À esquerda da divisória vale "apagado"; à direita, "aceso". A divisória se arrasta
 * com o ponteiro ou o dedo (a rolagem vertical continua livre) e com o teclado, por um controle deslizante de
 * verdade, então nada depende do mouse. É uma comparação de duas capturas, não uma reconstrução do app.
 */
export function StateReveal({ off, on, altOff, altOn, labels, narrow, sizes, initial = 24 }: StateRevealProps) {
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [position, setPosition] = useState(initial);

  const moveTo = (clientX: number) => {
    const box = frame.current?.getBoundingClientRect();
    if (!box || box.width === 0) return;
    setPosition(clamp(((clientX - box.left) / box.width) * 100));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(event.clientX);
  };
  const stop = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const shown = Math.round(position);

  return (
    <div
      ref={frame}
      className={styles.frame}
      style={
        {
          "--ar": `${on.width} / ${on.height}`,
          "--ar-n": narrow.ratio,
          "--pos-n": narrow.position,
          "--p": `${position}%`,
        } as CSSProperties
      }
      role="group"
      aria-label={labels.group}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
    >
      <Image className={styles.layer} src={off} alt={altOff} fill sizes={sizes} quality={90} draggable={false} />
      <div className={styles.onWrap}>
        <Image className={styles.layer} src={on} alt={altOn} fill sizes={sizes} quality={90} draggable={false} />
      </div>

      <span className={styles.line} aria-hidden="true">
        <span className={styles.grip} />
      </span>
      <span className={`${styles.tag} ${styles.tagOff}`} aria-hidden="true">
        {labels.off}
      </span>
      <span className={`${styles.tag} ${styles.tagOn}`} aria-hidden="true">
        {labels.on}
      </span>

      <input
        type="range"
        className={styles.range}
        min={0}
        max={100}
        step={1}
        value={shown}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={labels.range}
        aria-valuetext={`${labels.off} ${shown}%, ${labels.on} ${100 - shown}%`}
      />
    </div>
  );
}
