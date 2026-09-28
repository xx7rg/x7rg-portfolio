"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import type { CaptionKey } from "@/content/media-captions";
import { appRegion, type ProductShotData } from "@/content/sheets/aquacontrol";
import type { FlowBeat } from "@/i18n/types";
import { cx } from "@/lib/cx";
import { ProductShot } from "./ProductShot";
import styles from "./workflow-story.module.css";

const flowKeys: readonly CaptionKey[] = ["aqua.flow.1", "aqua.flow.2", "aqua.flow.3", "aqua.flow.4", "aqua.flow.5"];

type WorkflowStoryProps = {
  idPrefix: string;
  tablistLabel: string;
  beats: readonly FlowBeat[];
  /** Uma captura por momento, todas com a mesma proporção. */
  shots: readonly ProductShotData[];
  /** Diálogo de segurança, sobreposto ao terceiro momento. */
  inset: ProductShotData;
  insetAlt: string;
  /** Índice do momento que recebe o diálogo. */
  insetOn: number;
};

/**
 * O fluxo de visita de nove passos, contado em cinco momentos com capturas reais. Uma captura
 * grande por vez (legível), em vez de nove cartões pequenos. Abas de verdade: setas, Home e End
 * movem a seleção; sem animação automática; a troca só esmaece e respeita reduced-motion.
 */
export function WorkflowStory({
  idPrefix,
  tablistLabel,
  beats,
  shots,
  inset,
  insetAlt,
  insetOn,
}: WorkflowStoryProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus: boolean) => {
    const next = (index + beats.length) % beats.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        select(index + 1, true);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        select(index - 1, true);
        break;
      case "Home":
        event.preventDefault();
        select(0, true);
        break;
      case "End":
        event.preventDefault();
        select(beats.length - 1, true);
        break;
    }
  };

  // Todas as capturas do fluxo têm a mesma proporção: a caixa usa a do primeiro momento.
  const first = shots[0];
  const narrow = first.narrow ?? first.crop;
  const viewStyle = {
    "--ar": `${first.crop.w} / ${first.crop.h}`,
    "--ar-n": `${narrow.w} / ${narrow.h}`,
  } as CSSProperties;

  return (
    <div className={styles.story}>
      <div role="tablist" aria-label={tablistLabel} className={styles.tabs}>
        {beats.map((beat, index) => (
          <button
            key={beat.label}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`${idPrefix}-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            className={styles.tab}
            data-active={index === active ? "" : undefined}
            data-done={index <= active ? "" : undefined}
            onClick={() => select(index, false)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span className={styles.tabLabel}>{beat.label}</span>
            <span className={styles.tabSteps}>{beat.steps}</span>
          </button>
        ))}
      </div>

      <div className={styles.stage}>
        <div className={styles.view} style={viewStyle}>
          {beats.map((beat, index) => {
            const isActive = index === active;
            return (
              <div
                key={beat.label}
                role="tabpanel"
                id={`${idPrefix}-panel-${index}`}
                aria-labelledby={`${idPrefix}-tab-${index}`}
                className={styles.panel}
                data-active={isActive ? "" : undefined}
                inert={!isActive}
              >
                <ZoomMedia
                  id={flowKeys[index]}
                  group="aquacontrol"
                  image={shots[index].image}
                  crop={appRegion}
                  alt={beat.alt}
                  className={styles.frame}
                >
                  <ProductShot shot={shots[index]} alt={beat.alt} span={0.94} />
                </ZoomMedia>
                {index === insetOn && (
                  <ZoomMedia
                    id="aqua.flow.inset"
                    group="aquacontrol"
                    image={inset.image}
                    crop={appRegion}
                    alt={insetAlt}
                    radius={8}
                    className={cx(styles.frame, styles.inset)}
                  >
                    <ProductShot shot={inset} alt={insetAlt} span={0.42} />
                  </ZoomMedia>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className={styles.caption} aria-live="polite">
        <span className={styles.captionSteps}>{beats[active].steps}</span>
        {beats[active].caption}
      </p>
    </div>
  );
}
