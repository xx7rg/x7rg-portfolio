import Image from "next/image";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import type { LightSheetData } from "@/content/sheets/light-login";
import type { LightSheetCopy } from "@/i18n/types";
import styles from "./cord-geometry.module.css";

type CordGeometryProps = {
  data: LightSheetData;
  copy: LightSheetCopy["cord"]["geometry"];
  group: string;
};

const rad = (degrees: number) => (degrees * Math.PI) / 180;
const fixed = (value: number) => Number(value.toFixed(1));

/**
 * Um arrasto REAL do cordão, parado em ~30° (captura em 3×), com o desenho da geometria por cima: o pivô, a
 * vertical de repouso, o ângulo e o comprimento. Os números são os que o app tinha no instante da captura
 * (`--chain-angle` e `--chain-length`, lidos do DOM); o desenho só os localiza sobre a imagem. A captura
 * abre no visualizador sem o desenho, como evidência.
 */
export function CordGeometry({ data, copy, group }: CordGeometryProps) {
  const { view, pivot, rest, angle, length, restLength } = data.geometry;
  const theta = rad(angle);
  const cord = (rest * length) / restLength;
  const tip = { x: pivot.x + cord * Math.sin(theta), y: pivot.y + cord * Math.cos(theta) };
  const home = { x: pivot.x, y: pivot.y + rest };
  const arcR = 250;
  const arcEnd = { x: pivot.x + arcR * Math.sin(theta), y: pivot.y + arcR * Math.cos(theta) };

  return (
    <ZoomMedia id="light.cord" group={group} image={data.media.cordDrag} alt={copy.alt} radius={14} className={styles.figure}>
      <Image className={styles.photo} src={data.media.cordDrag} alt={copy.alt} sizes="(min-width: 700px) 340px, 92vw" quality={90} />
      <svg className={styles.svg} viewBox={`0 0 ${view.width} ${view.height}`} aria-hidden="true" focusable="false">
        {/* a vertical de repouso e o cordão em repouso (fantasma) */}
        <line className={styles.guide} x1={pivot.x} y1={pivot.y} x2={pivot.x} y2={home.y + 60} />
        <circle className={styles.ghost} cx={home.x} cy={home.y} r="26" />
        {/* o ângulo */}
        <path className={styles.arc} d={`M ${fixed(pivot.x)} ${fixed(pivot.y + arcR)} A ${arcR} ${arcR} 0 0 0 ${fixed(arcEnd.x)} ${fixed(arcEnd.y)}`} />
        <circle className={styles.pivot} cx={pivot.x} cy={pivot.y} r="11" />
        <circle className={styles.tip} cx={tip.x} cy={tip.y} r="6" />
        <text className={styles.value} x={pivot.x - 16} y={pivot.y + 292} textAnchor="end">
          {copy.angle}
        </text>
        <text className={styles.tag} x={pivot.x + 24} y={pivot.y - 18}>
          {copy.pivot}
        </text>
        <text className={styles.tag} x={home.x + 44} y={home.y + 74}>
          {copy.rest}
        </text>
        <text className={styles.tag} x={fixed(tip.x + 44)} y={fixed(tip.y + 16)}>
          {copy.length}
        </text>
        <text className={styles.code} x="44" y={view.height - 96}>
          {`--chain-angle: ${fixed(angle)}deg`}
        </text>
        <text className={styles.code} x="44" y={view.height - 44}>
          {`--chain-length: ${fixed(length)}%`}
        </text>
      </svg>
    </ZoomMedia>
  );
}
