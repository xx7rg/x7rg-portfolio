import Image from "next/image";
import { ClipPlayer } from "@/components/checkout-sheet/ClipPlayer";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { SlugLine } from "@/components/registration";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { projects } from "@/content/projects";
import type { MoonSheetData } from "@/content/sheets/login-the-moon";
import type { Dictionary, MoonSheetCopy } from "@/i18n/types";
import { cx } from "@/lib/cx";
import { MoonAudio } from "./MoonAudio";
import { MoonScore } from "./MoonScore";
import styles from "./moon-sheet.module.css";

const GROUP = "login-the-moon";

type MoonSheetProps = {
  data: MoonSheetData;
  copy: MoonSheetCopy;
  shared: Dictionary["sheet"];
  viewSource: string;
  newTab: string;
};

/**
 * Folha do Login The Moon: um login comum que vira a chegada a uma cena lunar. Em vez de cartões com capturas, a
 * folha é uma noite só: a cena real sangra até as bordas e se dissolve no fundo; os quadros da descida se emendam
 * como um filme; o botão de entrar aparece em três estados; e o som é lido como uma partitura. A cor do caso é o
 * azul-lunar do próprio app. O primeiro toque (o pouso) e o envio (o carregamento) são gestos SEPARADOS no app, e
 * a folha os mostra separados. A silhueta da bicicleta aparece só como está no botão do app.
 */
export function MoonSheet({ data, copy, shared, viewSource, newTab }: MoonSheetProps) {
  const { media, clip } = data;
  const project = projects.find((entry) => entry.slug === data.slug);
  const live = project && "live" in project ? project.live : undefined;
  const repo = project && "repo" in project ? project.repo : undefined;
  const titleId = `${data.slug}-title`;
  const facts = [
    { label: shared.labels.type, value: copy.type },
    { label: shared.labels.year, value: data.year },
    { label: shared.labels.status, value: copy.status, live: true },
  ];
  const { sequence, descent, button, sound, build, responsive } = copy;
  const narrow = { ratio: "1.1 / 1", position: "74% 55%" };

  return (
    <article className={cx(styles.sheet, "glass")} aria-labelledby={titleId}>
      <div className={styles.card}>
        {/* Abertura: a cena real sangra até as bordas e se dissolve no fundo da folha; o título fica sobre o chão lunar. */}
        <header className={styles.stage}>
          <ZoomMedia id="moon.1" group={GROUP} image={media.scene} alt={copy.stage.alt} radius={0} className={styles.stageMedia}>
            <Image className={styles.stageImage} src={media.scene} alt={copy.stage.alt} sizes="(min-width: 1100px) 780px, 100vw" quality={85} />
          </ZoomMedia>
          <div className={styles.intro}>
            <h3 id={titleId} className={styles.title}>
              {data.name}
            </h3>
            <p className={styles.statement}>{copy.statement}</p>
            <ul className={styles.facts}>
              {facts.map((fact) => (
                <li key={fact.label} className={styles.fact}>
                  <span className="sr-only">{fact.label}: </span>
                  {fact.live && <span className={styles.factDot} aria-hidden="true" />}
                  {fact.value}
                </li>
              ))}
            </ul>
          </div>
        </header>
        <p className={cx(styles.caption, styles.stageCaption)}>{copy.stage.caption}</p>

        <section className={styles.block} aria-labelledby={`${data.slug}-sequence`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-sequence`} className={styles.blockTitle}>
              {sequence.title}
            </h4>
            <p className={styles.blockLead}>{sequence.lead}</p>
          </div>

          <figure className={styles.clip}>
            <ClipPlayer
              src={clip.src}
              poster={media.scene}
              width={clip.width}
              height={clip.height}
              narrow={narrow}
              sizes="(min-width: 1100px) 740px, 96vw"
              labels={{ video: sequence.videoLabel, play: sequence.play, pause: sequence.pause, replay: sequence.replay }}
            />
            <figcaption className={styles.caption}>{sequence.videoNote}</figcaption>
          </figure>

          <ol className={styles.beats}>
            {sequence.beats.map((beat) => (
              <li key={beat.label} className={styles.beat}>
                <p className={styles.beatTime}>{beat.time}</p>
                <h5 className={styles.beatLabel}>{beat.label}</h5>
                <p className={styles.beatBody}>{beat.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-descent`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-descent`} className={styles.blockTitle}>
              {descent.title}
            </h4>
            <p className={styles.blockLead}>{descent.lead}</p>
          </div>

          {/* Quatro quadros da mesma gravação, emendados como um filme: as bordas se dissolvem umas nas outras. */}
          <ol className={styles.film}>
            {descent.frames.map((frame, index) => {
              const image = media.frames[index]!;
              const tile = <Image className={styles.frame} src={image} alt={frame.alt} sizes="(min-width: 620px) 190px, 46vw" quality={85} />;
              return (
                <li key={frame.time} className={styles.filmItem}>
                  {index === 1 ? (
                    <ZoomMedia id="moon.descent" group={GROUP} image={media.descent} alt={frame.alt} radius={6} className={styles.frameZoom}>
                      {tile}
                    </ZoomMedia>
                  ) : index === 3 ? (
                    <ZoomMedia id="moon.3" group={GROUP} image={media.arrival} alt={frame.alt} radius={6} className={styles.frameZoom}>
                      {tile}
                    </ZoomMedia>
                  ) : (
                    <div className={styles.frameZoom}>{tile}</div>
                  )}
                  <p className={styles.frameTime}>{frame.time}</p>
                </li>
              );
            })}
          </ol>
          <p className={styles.caption}>{descent.caption}</p>

          <div className={styles.layers}>
            <h5 className={styles.layersTitle}>{descent.layers.title}</h5>
            <p className={styles.layersBody}>{descent.layers.body}</p>
          </div>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-button`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-button`} className={styles.blockTitle}>
              {button.title}
            </h4>
            <p className={styles.blockLead}>{button.lead}</p>
          </div>

          <ol className={styles.states}>
            {button.states.map((state, index) => (
              <li key={state.label} className={styles.state} data-state={index}>
                <p className={styles.stateLabel}>{state.label}</p>
                <Image className={styles.stateImage} src={media.buttons[index]!} alt={state.alt} sizes="(min-width: 620px) 360px, 88vw" quality={85} />
              </li>
            ))}
          </ol>
          <p className={styles.homage}>{button.homage}</p>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-sound`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-sound`} className={styles.blockTitle}>
              {sound.title}
            </h4>
            <p className={styles.blockLead}>{sound.lead}</p>
          </div>
          <MoonScore score={data.score} copy={sound} />
          <MoonAudio src={data.audio} copy={sound.samples} />
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-build`}>
          <h4 id={`${data.slug}-build`} className={styles.blockTitle}>
            {build.title}
          </h4>
          <dl className={styles.build}>
            {build.items.map((item) => (
              <div key={item.label} className={styles.buildItem}>
                <dt className={styles.buildLabel}>{item.label}</dt>
                <dd className={styles.buildBody}>{item.body}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.stack}>{build.stack}</p>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-mobile`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-mobile`} className={styles.blockTitle}>
              {responsive.title}
            </h4>
            <p className={styles.blockLead}>{responsive.lead}</p>
          </div>
          <div className={styles.phones}>
            <ZoomMedia id="moon.mobile.idle" group={GROUP} image={media.mobile.idle} alt={responsive.idleAlt} radius={18} className={styles.phone}>
              <Image className={styles.phoneImage} src={media.mobile.idle} alt={responsive.idleAlt} sizes="(min-width: 620px) 240px, 44vw" quality={85} />
            </ZoomMedia>
            <ZoomMedia id="moon.mobile.success" group={GROUP} image={media.mobile.success} alt={responsive.successAlt} radius={18} className={styles.phone}>
              <Image className={styles.phoneImage} src={media.mobile.success} alt={responsive.successAlt} sizes="(min-width: 620px) 240px, 44vw" quality={85} />
            </ZoomMedia>
          </div>
          <p className={styles.caption}>{responsive.caption}</p>
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
                  <a className={styles.link} href={live} target="_blank" rel="noopener noreferrer" aria-label={`${copy.demo}: ${data.name}, ${newTab}`}>
                    {copy.demo}
                    <ArrowUpRightIcon />
                  </a>
                </li>
              )}
              {repo && (
                <li>
                  <a className={styles.link} href={repo} target="_blank" rel="noopener noreferrer" aria-label={`${viewSource}: ${data.name}, ${newTab}`}>
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
