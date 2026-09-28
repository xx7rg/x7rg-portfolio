"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PauseIcon, PlayIcon, ReplayIcon } from "@/components/recibo-sheet/icons";
import styles from "./clip-player.module.css";

type ClipPlayerProps = {
  src: string;
  poster: StaticImageData;
  width: number;
  height: number;
  /** Largura máxima da moldura (CSS), para o mesmo componente servir ao clipe largo e ao quase quadrado. */
  maxWidth?: string;
  /** Em coluna estreita, o enquadramento muda (proporção e ponto de corte) para o assunto não encolher até sumir. */
  narrow?: { ratio: string; position: string };
  /** `sizes` da imagem de poster. */
  sizes: string;
  labels: { video: string; play: string; pause: string; replay: string };
};

type Status = "idle" | "playing" | "paused" | "ended";

/**
 * Uma gravação do protótipo, sem áudio. Nada é baixado com a página: o vídeo tem `preload="none"` e só carrega
 * quando toca; até lá o que se vê é a imagem de poster (preguiçosa, por baixo do vídeo). Ele toca UMA vez,
 * sozinho, quando entra na tela, e só se o visitante não pediu menos movimento nem economia de dados; no resto,
 * fica na imagem até alguém apertar o botão. O botão é real e sempre visível: reproduz, pausa e repete. O que a
 * gravação mostra também está no texto ao lado, então nada depende de assistir.
 */
export function ClipPlayer({ src, poster, width, height, maxWidth, narrow, sizes, labels }: ClipPlayerProps) {
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
    <div
      ref={frame}
      className={styles.frame}
      style={
        {
          "--ar": `${width} / ${height}`,
          "--ar-n": narrow?.ratio ?? `${width} / ${height}`,
          "--pos-n": narrow?.position ?? "50% 50%",
          "--clip-max": maxWidth ?? "none",
        } as CSSProperties
      }
      data-started={started ? "" : undefined}
    >
      <Image className={styles.poster} src={poster} alt="" sizes={sizes} quality={90} />
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
