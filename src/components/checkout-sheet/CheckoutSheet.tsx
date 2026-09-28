import Image from "next/image";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { SlugLine } from "@/components/registration";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { projects } from "@/content/projects";
import type { CheckoutSheetData } from "@/content/sheets/checkout";
import type { CheckoutSheetCopy, Dictionary } from "@/i18n/types";
import { cx } from "@/lib/cx";
import { ClipPlayer } from "./ClipPlayer";
import styles from "./checkout-sheet.module.css";

const GROUP = "checkout";

type CheckoutSheetProps = {
  data: CheckoutSheetData;
  copy: CheckoutSheetCopy;
  shared: Dictionary["sheet"];
  viewSource: string;
  newTab: string;
};

/**
 * Folha do Checkout: o cartão é o protagonista. A abertura é montada em volta dele (o cartão real, com a
 * interface do protótipo aparecendo atrás); depois a relação entre o formulário e o cartão, com a gravação do
 * giro no CVV; o pedido, que lê o mesmo estado; o caminho até o comprovante, que é o fim do fluxo e não o
 * assunto; e, por fim, como é feito e o que o protótipo não é. As capturas são do protótipo REAL, com dados
 * de demonstração e a interface em português. A cor do caso é o azul-cobalto do próprio protótipo.
 */
export function CheckoutSheet({ data, copy, shared, viewSource, newTab }: CheckoutSheetProps) {
  const { media, clips } = data;
  const project = projects.find((entry) => entry.slug === data.slug);
  const live = project && "live" in project ? project.live : undefined;
  const repo = project && "repo" in project ? project.repo : undefined;
  const titleId = `${data.slug}-title`;
  const facts = [
    { label: shared.labels.type, value: copy.type },
    { label: shared.labels.year, value: data.year },
    { label: shared.labels.status, value: copy.status, live: true },
  ];
  const { live: cardCopy, order, flow, build } = copy;

  return (
    <article className={cx(styles.sheet, "glass")} aria-labelledby={titleId}>
      <div className={styles.card}>
        {/* Abertura: título e posicionamento de um lado; do outro, o cartão real sobre a interface do protótipo. */}
        <header className={styles.stage}>
          <div className={styles.intro}>
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
            <p className={styles.statement}>{copy.statement}</p>
          </div>

          <div className={styles.visual}>
            <div className={styles.ui} aria-hidden="true">
              <Image
                className={styles.uiImage}
                src={media.interface}
                alt=""
                sizes="(min-width: 1100px) 640px, 90vw"
                quality={90}
              />
            </div>
            <Image
              className={styles.cardImage}
              src={media.cardFront}
              alt={copy.opening.cardAlt}
              sizes="(min-width: 1100px) 400px, (min-width: 620px) 44vw, 92vw"
              quality={90}
            />
          </div>
        </header>
        <p className={styles.caption}>{copy.opening.caption}</p>

        <section className={styles.block} aria-labelledby={`${data.slug}-live`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-live`} className={styles.blockTitle}>
              {cardCopy.title}
            </h4>
            <p className={styles.blockLead}>{cardCopy.lead}</p>
          </div>

          <figure className={styles.clip}>
            <ClipPlayer
              src={clips.flip.src}
              poster={media.flipPoster}
              width={clips.flip.width}
              height={clips.flip.height}
              narrow={{ ratio: "1.05 / 1", position: "0% 50%" }}
              sizes="(min-width: 1100px) 680px, 92vw"
              labels={{
                video: cardCopy.videoLabel,
                play: cardCopy.play,
                pause: cardCopy.pause,
                replay: cardCopy.replay,
              }}
            />
            <figcaption className={styles.caption}>{cardCopy.videoNote}</figcaption>
          </figure>

          <div className={styles.liveRow}>
            <div className={styles.pairCol}>
              {/* Frente e verso: o mesmo cartão em dois estados, para entender o giro sem precisar do movimento. */}
              <div className={styles.pair}>
                <ZoomMedia
                  id="checkout.front"
                  group={GROUP}
                  image={media.cardFront}
                  alt={cardCopy.front.alt}
                  radius={24}
                  className={cx(styles.face, styles.faceFront)}
                >
                  <Image className={styles.faceImage} src={media.cardFront} alt={cardCopy.front.alt} sizes="(min-width: 700px) 300px, 62vw" quality={90} />
                </ZoomMedia>
                <ZoomMedia
                  id="checkout.back"
                  group={GROUP}
                  image={media.cardBack}
                  alt={cardCopy.back.alt}
                  radius={24}
                  className={cx(styles.face, styles.faceBack)}
                >
                  <Image className={styles.faceImage} src={media.cardBack} alt={cardCopy.back.alt} sizes="(min-width: 700px) 300px, 62vw" quality={90} />
                </ZoomMedia>
              </div>

              <dl className={styles.fields}>
                {cardCopy.fields.map((field) => (
                  <div key={field.label} className={styles.field}>
                    <dt className={styles.fieldLabel}>{field.label}</dt>
                    <dd className={styles.fieldBody}>{field.body}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <ZoomMedia
              id="checkout.mobile"
              group={GROUP}
              image={media.mobile}
              alt={cardCopy.mobile.alt}
              radius={16}
              className={cx(styles.frame, styles.phone)}
            >
              <Image className={styles.fill} src={media.mobile} alt={cardCopy.mobile.alt} sizes="(min-width: 700px) 210px, 46vw" quality={90} />
            </ZoomMedia>
          </div>
          <p className={styles.rule}>{cardCopy.rule}</p>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-order`}>
          <h4 id={`${data.slug}-order`} className={styles.blockTitle}>
            {order.title}
          </h4>
          <div className={styles.order}>
            <div className={styles.orderText}>
              <p className={styles.blockLead}>{order.lead}</p>
              <dl className={styles.ledger}>
                {order.ledger.map((row, index) => (
                  <div key={row.label} className={cx(styles.ledgerRow, index === order.ledger.length - 1 && styles.ledgerTotal)}>
                    <dt className={styles.ledgerLabel}>{row.label}</dt>
                    <dd className={styles.ledgerValue}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ZoomMedia
              id="checkout.summary"
              group={GROUP}
              image={media.summary}
              alt={order.summaryAlt}
              radius={14}
              className={cx(styles.frame, styles.summary)}
            >
              <Image className={styles.fill} src={media.summary} alt={order.summaryAlt} sizes="(min-width: 700px) 260px, 62vw" quality={90} />
            </ZoomMedia>
          </div>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-flow`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-flow`} className={styles.blockTitle}>
              {flow.title}
            </h4>
            <p className={styles.blockLead}>{flow.lead}</p>
          </div>
          <div className={styles.flow}>
            <div className={styles.flowText}>
              <ol className={styles.states}>
                {flow.states.map((state, index) => (
                  <li key={state.code} className={styles.state} data-step={index + 1}>
                    <code className={styles.code}>{state.code}</code>
                    <p className={styles.stateBody}>{state.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <figure className={styles.clip}>
              <ClipPlayer
                src={clips.pay.src}
                poster={media.approved}
                width={clips.pay.width}
                height={clips.pay.height}
                sizes="(min-width: 1100px) 360px, 92vw"
                labels={{
                  video: flow.videoLabel,
                  play: cardCopy.play,
                  pause: cardCopy.pause,
                  replay: cardCopy.replay,
                }}
              />
              <figcaption className={styles.caption}>{flow.videoNote}</figcaption>
            </figure>
          </div>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-build`}>
          <h4 id={`${data.slug}-build`} className={styles.blockTitle}>
            {build.title}
          </h4>
          <dl className={styles.relations}>
            {build.items.map((item) => (
              <div key={item.code} className={styles.relation}>
                <dt className={styles.relationCode}>
                  <code>{item.code}</code>
                </dt>
                <dd className={styles.relationBody}>{item.body}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.tech}>{build.flip}</p>
          <p className={styles.tech}>{build.stack}</p>
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
