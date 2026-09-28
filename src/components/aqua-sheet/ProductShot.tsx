import Image from "next/image";
import type { CSSProperties } from "react";
import type { Crop } from "@/content/sheets/types";
import type { ProductShotData } from "@/content/sheets/aquacontrol";
import { cx } from "@/lib/cx";
import styles from "./product-shot.module.css";

/** Largura máxima da coluna de projetos no desktop (o cartão da folha), em px. */
const COLUMN = 760;
/** Fração aproximada da janela que a coluna ocupa em telas menores. */
const COLUMN_VW = 94;

type ProductShotProps = {
  shot: ProductShotData;
  alt: string;
  /** Fração da largura da coluna que esta captura ocupa (0 a 1). Só serve para escolher o tamanho a baixar. */
  span: number;
  className?: string;
  /** Recorte de apoio: a mesma informação já está na imagem principal e no texto. */
  decorative?: boolean;
};

function cropVars(image: ProductShotData["image"], crop: Crop, suffix: "" | "-n") {
  return {
    [`--ar${suffix}`]: `${crop.w} / ${crop.h}`,
    [`--w${suffix}`]: `${(image.width / crop.w) * 100}%`,
    [`--l${suffix}`]: `${-(crop.x / crop.w) * 100}%`,
    [`--t${suffix}`]: `${-(crop.y / crop.h) * 100}%`,
  };
}

/**
 * Uma captura real do produto, recortada só na apresentação: a imagem inteira é carregada e
 * posicionada dentro de uma caixa com a proporção do recorte, então o arquivo nunca é editado.
 * Em coluna larga usa `crop`; em coluna estreita (container query) usa `narrow`, se houver, para
 * a interface não encolher até o texto perder o sentido.
 */
export function ProductShot({ shot, alt, span, className, decorative }: ProductShotProps) {
  const { image, crop } = shot;
  const narrow = shot.narrow ?? crop;

  // `sizes` é a largura em que a IMAGEM INTEIRA é desenhada, não a do recorte.
  const wideFactor = image.width / crop.w;
  const narrowFactor = image.width / narrow.w;
  const sizes = [
    `(min-width: 1100px) ${Math.round(COLUMN * span * wideFactor)}px`,
    `(min-width: 600px) ${Math.round(COLUMN_VW * span * wideFactor)}vw`,
    `${Math.round(COLUMN_VW * span * narrowFactor)}vw`,
  ].join(", ");

  const style = { ...cropVars(image, crop, ""), ...cropVars(image, narrow, "-n") } as CSSProperties;

  return (
    <div className={cx(styles.shot, className)} style={style} aria-hidden={decorative ? true : undefined}>
      <Image src={image} alt={decorative ? "" : alt} sizes={sizes} quality={90} />
    </div>
  );
}
