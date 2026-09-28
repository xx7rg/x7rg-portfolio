import Image from "next/image";
import type { EvidenceShot } from "@/content/sheets/types";
import { cx } from "@/lib/cx";
import styles from "./bya-crop.module.css";

/** Largura da coluna de projetos no desktop, em px (a mesma que o ProductShot do AquaControl usa). */
const COLUMN = 690;
/** Fração aproximada da janela que a coluna ocupa em telas menores. */
const COLUMN_VW = 92;

type ByaCropProps = {
  shot: EvidenceShot;
  /** Fração da largura da coluna que o recorte ocupa (0 a 1). Só escolhe o tamanho a baixar. */
  span: number;
  /** Sem `alt`, o recorte é decorativo e some para leitores de tela (a informação já está no texto). */
  alt?: string;
  className?: string;
};

/**
 * Trecho de uma imagem real, recortado só na apresentação: a imagem inteira é carregada e
 * posicionada numa caixa com a proporção do recorte, então o arquivo nunca é editado. A caixa é
 * transparente, porque o logo tem transparência e o fundo (creme ou ameixa) vem do contêiner.
 */
export function ByaCrop({ shot, span, alt, className }: ByaCropProps) {
  const { image, crop } = shot;
  const factor = image.width / crop.w;
  // `sizes` é a largura em que a IMAGEM INTEIRA é desenhada, não a do recorte.
  const sizes = `(min-width: 1100px) ${Math.round(factor * COLUMN * span)}px, ${Math.round(factor * COLUMN_VW * span)}vw`;

  return (
    <div
      className={cx(styles.crop, className)}
      style={{ aspectRatio: `${crop.w} / ${crop.h}` }}
      aria-hidden={alt ? undefined : true}
    >
      <Image
        src={image}
        alt={alt ?? ""}
        sizes={sizes}
        quality={90}
        style={{
          position: "absolute",
          maxWidth: "none",
          height: "auto",
          width: `${factor * 100}%`,
          left: `${-(crop.x / crop.w) * 100}%`,
          top: `${-(crop.y / crop.h) * 100}%`,
        }}
      />
    </div>
  );
}
