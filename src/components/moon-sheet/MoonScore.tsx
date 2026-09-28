import type { MoonSheetData, ScoreSegment } from "@/content/sheets/login-the-moon";
import type { MoonSheetCopy } from "@/i18n/types";
import { cx } from "@/lib/cx";
import styles from "./moon-sheet.module.css";

type MoonScoreProps = {
  score: MoonSheetData["score"];
  copy: MoonSheetCopy["sound"];
};

const pct = (value: number, span: number) => `${(value / span) * 100}%`;
const fmt = (n: number) => n.toFixed(2).replace(/\.?0+$/, "");

/**
 * A partitura do caso: dois gestos, cada um com a imagem que ele dispara e os sons que o código agenda, numa
 * mesma escala de segundos. Os números vêm de app/page.tsx e de globals.css do projeto (content/sheets/login-the-moon.ts).
 * As barras são desenho; o texto de cada trecho e o intervalo em segundos estão na página para quem não vê o desenho.
 */
export function MoonScore({ score, copy }: MoonScoreProps) {
  const { span, lanes } = score;
  const ticks = Array.from({ length: span + 1 }, (_, index) => index);

  const row = (segments: readonly ScoreSegment[], kind: "image" | "sound", name: string, marker: number | undefined, showMarkerLabel: boolean) => (
    <div className={styles.scoreRow} data-kind={kind}>
      <p className={styles.rowName}>{name}</p>
      <ul className={styles.plot}>
        {marker !== undefined && (
          <li className={styles.marker} style={{ left: pct(marker, span) }} aria-hidden={!showMarkerLabel}>
            {showMarkerLabel && <span className={styles.markerLabel}>{copy.granted}</span>}
          </li>
        )}
        {segments.map((segment) => {
          const left = pct(segment.from, span);
          const width = pct(segment.to - segment.from, span);
          const mode = segment.to <= span * 0.62 ? "after" : segment.from >= span * 0.34 ? "before" : "over";
          return (
            <li key={segment.key} className={styles.seg} data-mode={mode}>
              <span className={cx(styles.bar, kind === "image" && styles.barImage)} style={{ left, width }} aria-hidden="true" />
              <span className={styles.segLabel} style={mode === "after" ? { left: pct(segment.to, span) } : mode === "before" ? { right: `calc(100% - ${left})` } : { left }} data-side={mode}>
                {copy.segments[segment.key]}
                <span className="sr-only">
                  {" "}
                  {fmt(segment.from)}–{fmt(segment.to)} s
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className={styles.score}>
      {lanes.map((lane, index) => (
        <section key={lane.id} className={styles.lane} aria-label={copy.lanes[index]}>
          <h5 className={styles.laneTitle}>{copy.lanes[index]}</h5>
          {row(lane.image, "image", copy.rows[0], lane.marker, false)}
          {row(lane.sound, "sound", copy.rows[1], lane.marker, true)}
        </section>
      ))}
      <div className={styles.axis} aria-hidden="true">
        <span className={styles.axisName}>{copy.seconds}</span>
        <div className={styles.ticks}>
          {ticks.map((tick) => (
            <span key={tick} className={styles.tick} style={{ left: pct(tick, span) }}>
              {tick}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
