"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon, ReplayIcon } from "./icons";
import styles from "./printing-clip.module.css";

type PrintingClipProps = {
  src: string;
  poster: StaticImageData;
  width: number;
  height: number;
  labels: { video: string; play: string; pause: string; replay: string };
};

type Status = "idle" | "playing" | "paused" | "ended";

/**
 * A gravação da impressão, sem áudio. Nada é baixado com a página: o vídeo tem `preload="none"` e só
 * carrega quando toca; até lá, o que se vê é a imagem do recibo pronto. Ele toca UMA vez, sozinho, quando
 * entra na tela, e só se o visitante não pediu menos movimento nem economia de dados; no resto, fica na
 * imagem até alguém apertar o botão. O botão é real e sempre visível: reproduz, pausa e repete. A informação
 * da sequência também está no texto ao lado, então nada depende de assistir.
 */
export function PrintingClip({ src, poster, width, height, labels }: PrintingClipProps) {
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);
  const auto = useRef(true);

  useEffect(() => {
    const el = video.current;
    const box = frame.current;
    if (!el || !box) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    if (reduced || saveData) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || !auto.current) return;
        auto.current = false;
        observer.disconnect();
        void el.play().catch(() => undefined);
      },
      { threshold: 0.6 },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    auto.current = false;
    if (status === "ended") el.currentTime = 0;
    if (el.paused || el.ended) void el.play().catch(() => undefined);
    else el.pause();
  };

  const action = status === "playing" ? labels.pause : status === "ended" ? labels.replay : labels.play;
  const Glyph = status === "playing" ? PauseIcon : status === "ended" ? ReplayIcon : PlayIcon;

  return (
    <div ref={frame} className={styles.frame} style={{ aspectRatio: `${width} / ${height}` }} data-started={started ? "" : undefined}>
      {/* O poster é uma imagem preguiçosa (o projeto fechado não a baixa) por baixo do vídeo, que só aparece ao tocar. */}
      <Image className={styles.poster} src={poster} alt="" sizes="340px" quality={90} />
      <video
        ref={video}
        className={styles.video}
        src={src}
        width={width}
        height={height}
        muted
        playsInline
        preload="none"
        aria-label={labels.video}
        onPlay={() => setStatus("playing")}
        onPlaying={() => setStarted(true)}
        onPause={() => setStatus((current) => (current === "ended" ? current : "paused"))}
        onEnded={() => setStatus("ended")}
      />
      <button type="button" className={styles.control} onClick={toggle}>
        <Glyph />
        {action}
      </button>
    </div>
  );
}
