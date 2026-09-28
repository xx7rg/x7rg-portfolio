"use client";

import type { StaticImageData } from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { ExpandIcon } from "@/components/ui/icons";
import type { CaptionKey } from "@/content/media-captions";
import type { Crop } from "@/content/sheets/types";
import { cx } from "@/lib/cx";
import { useMediaViewer } from "./MediaViewer";
import styles from "./media-viewer.module.css";

type ZoomMediaProps = {
  /** Chave da legenda (dicionário) e identidade da mídia dentro do grupo. */
  id: CaptionKey;
  /** O projeto a que a mídia pertence: setas e "próxima" percorrem só o grupo. */
  group: string;
  /** O arquivo que o visualizador abre. Pode ser maior que o da página: só carrega ao abrir. */
  image: StaticImageData;
  /** Região da imagem a mostrar no visualizador (por padrão, a imagem inteira). */
  crop?: Crop;
  alt: string;
  background?: string;
  /** Raio de canto da mídia, para o anel de foco e a sombra acompanharem a borda. */
  radius?: number;
  /** Classes de layout do elemento que envolve a mídia (posição, largura, etc.). */
  className?: string;
  children: ReactNode;
};

/**
 * Torna uma mídia de CONTEÚDO inspecionável. A mídia continua sendo o filho, renderizada no
 * servidor como sempre; por cima dela fica um botão que cobre a área toda. O sinal de que
 * ela abre é discreto: cursor de ampliar, um ícone pequeno que aparece ao passar o mouse ou
 * focar (e fica visível em telas de toque). Mídia decorativa não usa este componente.
 */
export function ZoomMedia({ id, group, image, crop, alt, background, radius = 10, className, children }: ZoomMediaProps) {
  const viewer = useMediaViewer();
  const { register } = viewer;
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => register({ id, group, image, crop, alt, background }), [register, id, group, image, crop, alt, background]);

  return (
    <div className={cx(styles.zoom, className)} style={{ "--zr": `${radius}px` } as CSSProperties}>
      {children}
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-label={`${viewer.labels.open}: ${viewer.labels.captions[id]}`}
        data-zoom-group={group}
        data-zoom-id={id}
        onClick={() => triggerRef.current && viewer.open(id, triggerRef.current)}
      >
        <span className={styles.hint} aria-hidden="true">
          <ExpandIcon />
        </span>
      </button>
    </div>
  );
}
