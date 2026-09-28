import Image from "next/image";
import type { EvidenceShot } from "@/content/sheets/types";
import { cx } from "@/lib/cx";
import styles from "./crop-image.module.css";

type CropImageProps = {
  shot: EvidenceShot;
  alt: string;
  /** Largura em que a IMAGEM INTEIRA é desenhada (não a do recorte). */
  sizes: string;
  className?: string;
};

/**
 * Mostra um trecho de uma captura real como evidência. O recorte é só de
 * apresentação: a imagem inteira é carregada e posicionada dentro de uma caixa com
 * a proporção do trecho; o arquivo original não é editado.
 */
export function CropImage({ shot, alt, sizes, className }: CropImageProps) {
  const { image, crop } = shot;

  return (
    <div className={cx(styles.crop, className)} style={{ aspectRatio: `${crop.w} / ${crop.h}` }}>
      <Image
        src={image}
        alt={alt}
        sizes={sizes}
        quality={90}
        style={{
          position: "absolute",
          maxWidth: "none",
          height: "auto",
          width: `${(image.width / crop.w) * 100}%`,
          left: `${-(crop.x / crop.w) * 100}%`,
          top: `${-(crop.y / crop.h) * 100}%`,
        }}
      />
    </div>
  );
}
