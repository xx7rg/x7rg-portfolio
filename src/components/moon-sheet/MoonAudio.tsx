"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/recibo-sheet/icons";
import type { MoonSheetCopy } from "@/i18n/types";
import { cx } from "@/lib/cx";
import styles from "./moon-sheet.module.css";

type Which = "descent" | "submit";

type MoonAudioProps = {
  src: { descent: string; submit: string };
  copy: MoonSheetCopy["sound"]["samples"];
};

/**
 * As duas sequências de áudio do app, para ouvir. NADA toca sozinho e nada é baixado antes do clique: os elementos
 * de áudio têm `preload="none"` e o som só começa quando o visitante aperta o botão (que é um botão de verdade,
 * com estado pressionado). Só uma toca por vez; apertar de novo para. O som é o do código de Web Audio do próprio
 * projeto, renderizado offline (não é a página tocando ao vivo).
 */
/** Para e volta ao começo (fora do componente: só mexe no elemento de áudio, nunca no estado do React). */
function rewind(element: HTMLAudioElement | null) {
  if (!element) return;
  element.pause();
  element.currentTime = 0;
}

export function MoonAudio({ src, copy }: MoonAudioProps) {
  const descentRef = useRef<HTMLAudioElement>(null);
  const submitRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<Which | null>(null);

  useEffect(() => {
    const descent = descentRef.current;
    const submit = submitRef.current;
    return () => {
      descent?.pause();
      submit?.pause();
    };
  }, []);

  const toggle = (which: Which) => {
    const target = which === "descent" ? descentRef.current : submitRef.current;
    const other = which === "descent" ? submitRef.current : descentRef.current;
    if (!target) return;
    if (playing === which) {
      rewind(target);
      setPlaying(null);
      return;
    }
    rewind(other);
    rewind(target);
    setPlaying(which);
    void target.play().catch(() => setPlaying(null));
  };

  const item = (which: Which, label: string) => (
    <li key={which}>
      <button type="button" className={cx(styles.sample, playing === which && styles.samplePlaying)} aria-pressed={playing === which} onClick={() => toggle(which)}>
        <span className={styles.sampleIcon} aria-hidden="true">
          {playing === which ? <PauseIcon /> : <PlayIcon />}
        </span>
        <span className={styles.sampleText}>
          <span className={styles.sampleAction}>{playing === which ? copy.pause : copy.play}</span>
          <span className={styles.sampleName}>{label}</span>
        </span>
      </button>
      <audio ref={which === "descent" ? descentRef : submitRef} src={src[which]} preload="none" onEnded={() => setPlaying((current) => (current === which ? null : current))} />
    </li>
  );

  return (
    <div className={styles.samples}>
      <p className={styles.samplesLabel}>{copy.label}</p>
      <ul className={styles.sampleList}>
        {item("descent", copy.descent)}
        {item("submit", copy.submit)}
      </ul>
      <p className={styles.caption}>{copy.note}</p>
    </div>
  );
}
