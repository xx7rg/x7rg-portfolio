import Image from "next/image";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { projects } from "@/content/projects";
import type { DiscordSheetData } from "@/content/sheets/discord-camera-live";
import type { DiscordSheetCopy, Dictionary } from "@/i18n/types";
import { cx } from "@/lib/cx";
import styles from "./discord-sheet.module.css";

const GROUP = "discord-camera-live";

type DiscordSheetProps = {
  data: DiscordSheetData;
  copy: DiscordSheetCopy;
  shared: Dictionary["sheet"];
  viewSource: string;
  newTab: string;
};

/**
 * Folha do DiscordCameraLive: COMPACTA e transparente. É um fork, então a folha separa o que veio do original
 * (GoLiveBypass, de bezumiya) do que x7rG modificou, numa matriz de procedência, e só depois mostra um detalhe
 * técnico (a troca do app.asar e as opções da janela do Electron). Depois vêm os riscos, sem sensacionalismo, e o
 * crédito em três partes. A identidade é a do próprio aplicativo (o rosa do botão dele), subordinada ao sistema do
 * portfólio, sem o azul nem a marca do Discord: não é um produto do Discord.
 */
export function DiscordSheet({ data, copy, shared, viewSource, newTab }: DiscordSheetProps) {
  const project = projects.find((entry) => entry.slug === data.slug);
  const repo = project && "repo" in project ? project.repo : undefined;
  const titleId = `${data.slug}-title`;
  const facts = [
    { label: shared.labels.type, value: copy.type },
    { label: shared.labels.year, value: data.year },
    { label: shared.labels.status, value: copy.status },
  ];
  const { base, changes, inside, risks } = copy;

  return (
    <article className={cx(styles.sheet, "glass")} aria-labelledby={titleId}>
      <div className={styles.card}>
        <header className={styles.head}>
          <h3 id={titleId} className={styles.title}>
            {data.name}
          </h3>
          <div className={styles.headBody}>
          <div className={styles.intro}>
            <p className={styles.statement}>{copy.statement}</p>
            <dl className={styles.facts}>
              {facts.map((fact) => (
                <div key={fact.label} className={styles.fact}>
                  <dt className={styles.factLabel}>{fact.label}</dt>
                  <dd className={styles.factValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className={styles.shot}>
            <ZoomMedia id="discord.1" group={GROUP} image={data.media.app} alt={copy.shot.alt} radius={14} className={styles.shotZoom}>
              <Image className={styles.shotImage} src={data.media.app} alt={copy.shot.alt} sizes="(min-width: 620px) 240px, 70vw" quality={90} />
            </ZoomMedia>
            <figcaption className={styles.caption}>{copy.shot.caption}</figcaption>
          </figure>
          </div>
        </header>

        <section className={styles.block} aria-labelledby={`${data.slug}-base`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-base`} className={styles.blockTitle}>
              {base.title}
            </h4>
            <p className={styles.blockLead}>{base.lead}</p>
          </div>
          <dl className={styles.pairs}>
            {base.points.map((point) => (
              <div key={point.label} className={styles.pair}>
                <dt className={styles.pairLabel}>{point.label}</dt>
                <dd className={styles.pairBody}>{point.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-changes`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-changes`} className={styles.blockTitle}>
              {changes.title}
            </h4>
            <p className={styles.blockLead}>{changes.lead}</p>
          </div>
          <ul className={styles.matrix}>
            {changes.rows.map((row) => (
              <li key={row.area} className={styles.row} data-origin={row.origin}>
                <p className={styles.rowArea}>{row.area}</p>
                <p className={styles.rowOrigin}>{changes.origins[row.origin]}</p>
                <p className={styles.rowBody}>{row.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-inside`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-inside`} className={styles.blockTitle}>
              {inside.title}
            </h4>
            <p className={styles.blockLead}>{inside.lead}</p>
          </div>
          <div className={styles.flows}>
            <div className={cx(styles.flow, styles.flowBefore)}>
              <h5 className={styles.flowLabel}>{inside.before.label}</h5>
              <ol className={styles.steps}>
                {inside.before.steps.map((step) => (
                  <li key={step} className={styles.step}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className={cx(styles.flow, styles.flowAfter)}>
              <h5 className={styles.flowLabel}>{inside.after.label}</h5>
              <ol className={styles.steps}>
                {inside.after.steps.map((step) => (
                  <li key={step} className={styles.step}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <figure className={styles.code}>
            <figcaption className={styles.codeLabel}>{inside.code}</figcaption>
            <pre className={styles.pre} lang="ts">
              {data.code.map((line) => (
                <span key={line.sign + line.text} className={cx(styles.codeLine, line.sign === "+" ? styles.added : styles.removed)}>
                  <span className={styles.sign} aria-hidden="true">
                    {line.sign}
                  </span>
                  <span className="sr-only">{line.sign === "+" ? "+ " : "- "}</span>
                  {line.text}
                </span>
              ))}
            </pre>
          </figure>
          <p className={styles.caption}>{inside.note}</p>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-risks`}>
          <h4 id={`${data.slug}-risks`} className={styles.blockTitle}>
            {risks.title}
          </h4>
          <dl className={styles.pairs}>
            {risks.items.map((item) => (
              <div key={item.label} className={styles.pair}>
                <dt className={styles.pairLabel}>{item.label}</dt>
                <dd className={styles.pairBody}>{item.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.credit} aria-labelledby={`${data.slug}-credit`}>
          <h4 id={`${data.slug}-credit`} className={styles.creditTitle}>
            {shared.labels.credit}
          </h4>
          <dl className={styles.creditList}>
            {copy.credit.map((part) => (
              <div key={part.label} className={styles.creditItem}>
                <dt className={styles.creditLabel}>{part.label}</dt>
                <dd className={styles.creditBody}>{part.body}</dd>
              </div>
            ))}
          </dl>
          <ul className={styles.links}>
            <li>
              <a className={styles.link} href={data.original} target="_blank" rel="noopener noreferrer" aria-label={`${copy.original}: GoLiveBypass, ${newTab}`}>
                {copy.original}
                <ArrowUpRightIcon />
              </a>
            </li>
            {repo && (
              <li>
                <a className={styles.link} href={repo} target="_blank" rel="noopener noreferrer" aria-label={`${viewSource}: ${data.name}, ${newTab}`}>
                  {viewSource}
                  <ArrowUpRightIcon />
                </a>
              </li>
            )}
          </ul>
        </section>
      </div>
    </article>
  );
}
