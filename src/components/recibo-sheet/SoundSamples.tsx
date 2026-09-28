"use client";

import { useEffect, useRef, useState } from "react";
import type { ReciboSheetData } from "@/content/sheets/recibo-digital";
import { SpeakerIcon, StopIcon } from "./icons";
import styles from "./sound-samples.module.css";

type SoundSamplesProps = {
  sounds: ReciboSheetData["sounds"];
  labels: { printer: string; chime: string; stop: string; note: string };
};

type Playing = "printer" | "chime" | null;

/** A gravação toca mais baixo que no app (0,8): aqui o som é uma amostra, não a experiência. */
const PRINTER_VOLUME = 0.55;

/**
 * Duas amostras de som, SÓ quando o visitante aperta o botão (nada toca sozinho e nada é baixado antes):
 *  - a impressora: a gravação original do projeto, carregada no primeiro clique;
 *  - o blim: os mesmos dois tons do app, sintetizados na hora com Web Audio (o contexto nasce no clique).
 * Apertar de novo (ou o outro botão) para o som que está tocando.
 */
export function SoundSamples({ sounds, labels }: SoundSamplesProps) {
  const [playing, setPlaying] = useState<Playing>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const context = useRef<AudioContext | null>(null);
  const nodes = useRef<OscillatorNode[]>([]);
  const timer = useRef(0);

  const stop = () => {
    window.clearTimeout(timer.current);
    if (audio.current) {
      audio.current.pause();
      audio.current.currentTime = 0;
    }
    for (const node of nodes.current) {
      try {
        node.stop();
      } catch {
        /* já parou */
      }
    }
    nodes.current = [];
    setPlaying(null);
  };

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      audio.current?.pause();
      void context.current?.close();
    },
    [],
  );

  const playPrinter = () => {
    if (playing === "printer") return stop();
    stop();
    if (!audio.current) {
      audio.current = new Audio(sounds.printer);
      audio.current.volume = PRINTER_VOLUME;
      audio.current.addEventListener("ended", () => setPlaying((current) => (current === "printer" ? null : current)));
    }
    setPlaying("printer");
    void audio.current.play().catch(() => setPlaying(null));
  };

  const playChime = () => {
    if (playing === "chime") return stop();
    stop();
    const { frequencies, stagger, duration, peak } = sounds.chime;
    context.current ??= new AudioContext();
    const ctx = context.current;
    void ctx.resume();
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    gain.connect(ctx.destination);
    nodes.current = frequencies.map((frequency, index) => {
      const oscillator = ctx.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, now + index * stagger);
      oscillator.connect(gain);
      oscillator.start(now + index * stagger);
      oscillator.stop(now + duration);
      return oscillator;
    });
    setPlaying("chime");
    timer.current = window.setTimeout(() => setPlaying(null), duration * 1000 + 40);
  };

  return (
    <div className={styles.root}>
      <div className={styles.buttons}>
        <button type="button" className={styles.button} data-playing={playing === "printer" ? "" : undefined} onClick={playPrinter}>
          {playing === "printer" ? <StopIcon /> : <SpeakerIcon />}
          {playing === "printer" ? labels.stop : labels.printer}
        </button>
        <button type="button" className={styles.button} data-playing={playing === "chime" ? "" : undefined} onClick={playChime}>
          {playing === "chime" ? <StopIcon /> : <SpeakerIcon />}
          {playing === "chime" ? labels.stop : labels.chime}
        </button>
      </div>
      <p className={styles.note}>{labels.note}</p>
    </div>
  );
}
