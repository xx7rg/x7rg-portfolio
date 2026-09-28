import { ClipPlayer } from "@/components/checkout-sheet/ClipPlayer";
import { SlugLine } from "@/components/registration";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { projects } from "@/content/projects";
import type { LightSheetData } from "@/content/sheets/light-login";
import type { Dictionary, LightSheetCopy } from "@/i18n/types";
import { cx } from "@/lib/cx";
import { CordGeometry } from "./CordGeometry";
import { StateReveal } from "./StateReveal";
import styles from "./light-sheet.module.css";

const GROUP = "light-login";

type LightSheetProps = {
  data: LightSheetData;
  copy: LightSheetCopy;
  shared: Dictionary["sheet"];
  viewSource: string;
  newTab: string;
};

/**
 * Folha do Light Login: a luz é o estado da interface, então a folha é um sistema só. A abertura é a
 * comparação do MESMO quadro apagado e aceso (o abajur domina; o formulário é o que a luz libera); depois o
 * cordão, com a gravação real e a geometria; depois a acessibilidade, que é parte do conceito (apagar a luz
 * tira o formulário da ordem de Tab); por fim como é feito e o que o projeto não é. As capturas são do
 * projeto REAL. A cor do caso é o âmbar da própria lâmpada; a arte da cena foi gerada com IA e isso está no
 * crédito. O modo vertical do app não entra: a versão publicada distorce a arte nele.
 */
export function LightSheet({ data, copy, shared, viewSource, newTab }: LightSheetProps) {
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
  const { reveal, cord, access, build } = copy;

  return (
    <article className={cx(styles.sheet, "glass")} aria-labelledby={titleId}>
      <div className={styles.card}>
        {/* Abertura: a cena comparada, e só depois o texto. O abajur é o protagonista; o formulário, o que a luz libera. */}
        <header className={styles.stage}>
          <figure className={styles.reveal}>
            <StateReveal
              off={media.off}
              on={media.on}
              altOff={reveal.altOff}
              altOn={reveal.altOn}
              labels={{ group: reveal.group, range: reveal.range, off: reveal.off, on: reveal.on }}
              narrow={{ ratio: "1.1 / 1", position: "20% 50%" }}
              sizes="(min-width: 1100px) 760px, 96vw"
            />
            <figcaption className={styles.caption}>{reveal.caption}</figcaption>
          </figure>

          <div className={styles.intro}>
            <h3 id={titleId} className={styles.title}>
              {data.name}
            </h3>
            <div className={styles.introBody}>
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
          </div>
        </header>

        <section className={styles.block} aria-labelledby={`${data.slug}-cord`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-cord`} className={styles.blockTitle}>
              {cord.title}
            </h4>
            <p className={styles.blockLead}>{cord.lead}</p>
          </div>

          <figure className={styles.clip}>
            <ClipPlayer
              src={clip.src}
              poster={media.on}
              width={clip.width}
              height={clip.height}
              narrow={{ ratio: "1.1 / 1", position: "20% 50%" }}
              sizes="(min-width: 1100px) 700px, 92vw"
              labels={{ video: cord.videoLabel, play: cord.play, pause: cord.pause, replay: cord.replay }}
            />
            <figcaption className={styles.caption}>{cord.videoNote}</figcaption>
          </figure>

          <dl className={styles.answers}>
            {cord.answers.map((answer) => (
              <div key={answer.label} className={styles.answer}>
                <dt className={styles.answerLabel}>{answer.label}</dt>
                <dd className={styles.answerBody}>{answer.body}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.geometry}>
            <CordGeometry data={data} copy={cord.geometry} group={GROUP} />
            <ol className={styles.flow}>
              {cord.geometry.flow.map((step) => (
                <li key={step.label} className={styles.step}>
                  <h5 className={styles.stepLabel}>{step.label}</h5>
                  <p className={styles.stepBody}>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-access`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-access`} className={styles.blockTitle}>
              {access.title}
            </h4>
            <p className={styles.blockLead}>{access.lead}</p>
          </div>

          {/* A ordem de Tab de verdade, lida no projeto: com a luz acesa cinco paradas; apagada, só o cordão. */}
          <div className={styles.rows}>
            <div className={styles.row} data-light="on">
              <p className={styles.rowLabel}>{access.on.label}</p>
              <ol className={styles.stops}>
                {access.on.stops.map((stop) => (
                  <li key={stop} className={styles.stop}>
                    {stop}
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.row} data-light="off">
              <p className={styles.rowLabel}>{access.off.label}</p>
              <ol className={styles.stops}>
                <li className={styles.stop}>{access.off.stops[0]}</li>
                <li className={cx(styles.stop, styles.gone)}>{access.off.gone}</li>
              </ol>
            </div>
          </div>
          <p className={styles.note}>{access.stopsNote}</p>

          <dl className={styles.attrs}>
            {access.attrs.map((attr) => (
              <div key={attr.code} className={styles.attr}>
                <dt className={styles.attrCode}>
                  <code>{attr.code}</code>
                </dt>
                <dd className={styles.attrBody}>{attr.body}</dd>
              </div>
            ))}
          </dl>
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
                    aria-label={`${copy.demo}: ${data.name}, ${newTab}`}
                  >
                    {copy.demo}
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
