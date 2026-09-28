import Image from "next/image";
import type { CSSProperties } from "react";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { CropImage } from "@/components/project-sheet/CropImage";
import { SlugLine } from "@/components/registration";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { projects } from "@/content/projects";
import type { ReciboSheetData } from "@/content/sheets/recibo-digital";
import type { Dictionary, ReciboSheetCopy } from "@/i18n/types";
import { cx } from "@/lib/cx";
import { PrintingClip } from "./PrintingClip";
import { SoundSamples } from "./SoundSamples";
import styles from "./recibo-sheet.module.css";

const GROUP = "recibo-digital";
/** A cor de identidade do projeto: o dourado da impressora, medido na captura. */
const ACCENT = "#c09040";

type ReciboSheetProps = {
  data: ReciboSheetData;
  copy: ReciboSheetCopy;
  shared: Dictionary["sheet"];
  viewSource: string;
  newTab: string;
};

/**
 * Folha do Recibo Digital: uma experiência, então a ordem segue o que acontece. A abertura mostra o
 * recibo (o protagonista) já impresso; depois os quatro estados de UMA máquina de estados, cada um com as
 * cinco saídas que ele controla; depois o momento da impressão, com a gravação real e o som (só a pedido);
 * por fim como é feito, o que o projeto não é e o crédito. Os dados do recibo são de demonstração e a
 * interface capturada está em espanhol: as duas coisas são ditas na legenda da abertura e nos limites.
 */
export function ReciboSheet({ data, copy, shared, viewSource, newTab }: ReciboSheetProps) {
  const { media } = data;
  const project = projects.find((entry) => entry.slug === data.slug);
  const live = project && "live" in project ? project.live : undefined;
  const repo = project && "repo" in project ? project.repo : undefined;
  const titleId = `${data.slug}-title`;
  const facts = [
    { label: shared.labels.type, value: copy.type },
    { label: shared.labels.year, value: data.year },
    { label: shared.labels.status, value: copy.status, live: true },
  ];
  const { states } = copy;

  return (
    <article className={cx(styles.sheet, "glass")} style={{ "--rc": ACCENT } as CSSProperties} aria-labelledby={titleId}>
      <div className={styles.card}>
        <header className={styles.head}>
          <h3 id={titleId} className={styles.title}>
            {data.name}
          </h3>
          <ul className={styles.facts}>
            {facts.map((fact) => (
              <li key={fact.label} className={styles.fact}>
                <span className="sr-only">{fact.label}: </span>
                {fact.live && <span className={styles.factDot} aria-hidden="true" />}
                {fact.value}
              </li>
            ))}
          </ul>
        </header>

        {/* O recibo, já impresso, no palco escuro: a tela do desktop e, sobreposta, a do celular. */}
        <figure className={styles.opening}>
          <div className={styles.stage}>
            <div className={styles.stageInner}>
              <ZoomMedia
                id="recibo.hero"
                group={GROUP}
                image={media.hero}
                alt={copy.hero.alt}
                radius={12}
                className={cx(styles.frame, styles.layerMain)}
              >
                <Image
                  className={styles.fill}
                  src={media.hero}
                  alt={copy.hero.alt}
                  sizes="(min-width: 1100px) 340px, (min-width: 560px) 46vw, 88vw"
                  quality={90}
                />
              </ZoomMedia>
              <ZoomMedia
                id="recibo.mobile"
                group={GROUP}
                image={media.mobile}
                alt={copy.hero.altMobile}
                radius={12}
                className={cx(styles.frame, styles.layerBack)}
              >
                <Image
                  className={styles.fill}
                  src={media.mobile}
                  alt={copy.hero.altMobile}
                  sizes="(min-width: 1100px) 150px, 24vw"
                  quality={90}
                />
              </ZoomMedia>
            </div>
          </div>
          <figcaption className={styles.caption}>{copy.hero.caption}</figcaption>
        </figure>

        <p className={styles.story}>{copy.story}</p>

        <section className={styles.block} aria-labelledby={`${data.slug}-states`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-states`} className={styles.blockTitle}>
              {states.title}
            </h4>
            <p className={styles.blockLead}>{states.lead}</p>
          </div>

          <ol className={styles.rail}>
            {media.states.map((state, index) => {
              const item = states.items[index];
              return (
                <li key={state.id} className={styles.state}>
                  <div className={styles.stateHead}>
                    <h5 className={styles.stateName}>{item.title}</h5>
                    <p className={styles.stateMeta}>
                      <code className={styles.code}>{state.id}</code>
                      <span>{item.trigger}</span>
                    </p>
                  </div>
                  <ZoomMedia
                    id={state.caption}
                    group={GROUP}
                    image={state.shot.image}
                    crop={state.shot.crop}
                    alt={item.alt}
                    radius={10}
                    className={cx(styles.frame, styles.tile)}
                  >
                    <CropImage shot={state.shot} alt={item.alt} sizes="(min-width: 700px) 400px, 340px" />
                  </ZoomMedia>
                  <dl className={styles.outputs}>
                    {states.outputLabels.map((label, row) => (
                      <div key={label} className={styles.output}>
                        <dt className={styles.outputLabel}>{label}</dt>
                        <dd className={styles.outputValue}>{item.outputs[row]}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              );
            })}
          </ol>

          <p className={styles.loop}>{states.loop}</p>
          <p className={styles.note}>{states.note}</p>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-moment`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-moment`} className={styles.blockTitle}>
              {copy.moment.title}
            </h4>
            <p className={styles.blockLead}>{copy.moment.lead}</p>
          </div>

          <div className={styles.moment}>
            <figure className={styles.clip}>
              <PrintingClip
                src={data.video.src}
                poster={media.hero}
                width={data.video.width}
                height={data.video.height}
                labels={{
                  video: copy.moment.videoLabel,
                  play: copy.moment.play,
                  pause: copy.moment.pause,
                  replay: copy.moment.replay,
                }}
              />
              <figcaption className={styles.caption}>{copy.moment.videoNote}</figcaption>
            </figure>

            <div className={styles.momentText}>
              <ol className={styles.timeline}>
                {copy.moment.timeline.map((step) => (
                  <li key={step.time} className={styles.step}>
                    <span className={styles.time}>{step.time}</span>
                    <p className={styles.stepText}>{step.text}</p>
                  </li>
                ))}
              </ol>

              <div className={styles.sound}>
                <h5 className={styles.soundTitle}>{copy.moment.sound.title}</h5>
                <p className={styles.soundLead}>{copy.moment.sound.lead}</p>
                <SoundSamples sounds={data.sounds} labels={copy.moment.sound} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-build`}>
          <h4 id={`${data.slug}-build`} className={styles.blockTitle}>
            {copy.build.title}
          </h4>
          <ul className={styles.decisions}>
            {copy.build.items.map((item) => (
              <li key={item.title} className={styles.decision}>
                <h5 className={styles.decisionTitle}>{item.title}</h5>
                <p className={styles.decisionBody}>{item.body}</p>
              </li>
            ))}
          </ul>

          <div className={styles.stackBlock}>
            <h5 className={styles.decisionTitle}>{copy.build.stackTitle}</h5>
            <dl className={styles.stack}>
              {copy.build.stack.map((item) => (
                <div key={item.label} className={styles.stackItem}>
                  <dt className={styles.stackLabel}>{item.label}</dt>
                  <dd className={styles.stackBody}>{item.body}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.server}>{copy.build.server}</p>
          </div>
        </section>

        <section className={styles.limits} aria-labelledby={`${data.slug}-limits`}>
          <h4 id={`${data.slug}-limits`} className={styles.limitsTitle}>
            {copy.limits.title}
          </h4>
          <p className={styles.limitsBody}>{copy.limits.body}</p>
        </section>

        <div className={styles.credit}>
          <SlugLine items={[{ label: shared.labels.credit, value: copy.credit, wide: true }]} />
          {(live || repo) && (
            <ul className={styles.links}>
              {live && (
                <li>
                  <a
                    className={styles.link}
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${copy.experience}: ${data.name}, ${newTab}`}
                  >
                    {copy.experience}
                    <ArrowUpRightIcon />
                  </a>
                </li>
              )}
              {repo && (
                <li>
                  <a
                    className={styles.link}
                    href={repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${viewSource}: ${data.name}, ${newTab}`}
                  >
                    {viewSource}
                    <ArrowUpRightIcon />
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
