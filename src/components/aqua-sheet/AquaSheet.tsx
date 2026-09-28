import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { ShowcaseReveal } from "@/components/project-sheet/ShowcaseReveal";
import { SlugLine } from "@/components/registration";
import type { CaptionKey } from "@/content/media-captions";
import { appRegion, type AquaSheetData } from "@/content/sheets/aquacontrol";
import type { AquaSheetCopy, Dictionary } from "@/i18n/types";
import { cx } from "@/lib/cx";
import { ProductShot } from "./ProductShot";
import { WorkflowStory } from "./WorkflowStory";
import styles from "./aqua-sheet.module.css";

const GROUP = "aquacontrol";
const roleKeys: readonly CaptionKey[] = ["aqua.role.technician", "aqua.role.supervisor", "aqua.role.admin"];
const mgmtKeys: readonly CaptionKey[] = ["aqua.mgmt.assignments", "aqua.mgmt.absences", "aqua.mgmt.reports"];

type AquaSheetProps = {
  data: AquaSheetData;
  copy: AquaSheetCopy;
  shared: Dictionary["sheet"];
};

/**
 * Folha do AquaControl: primeiro o produto, depois a explicação. Ordem: identidade → o produto
 * real (abertura) → por que existe → o fluxo de visita → os três perfis → coordenação → decisões
 * de engenharia e contexto → crédito. As capturas são do app REAL, em tablet, com dados
 * fictícios; o cartão segue o sistema do site (grafite, ouro) e a interface clara do app aparece
 * emoldurada, sem recolorir nem filtrar. O azul-petróleo do app (#0a7ea4, medido nas capturas)
 * é o único acento de projeto, e só em detalhes.
 */
export function AquaSheet({ data, copy, shared }: AquaSheetProps) {
  const { media } = data;
  const titleId = `${data.slug}-title`;
  const facts = [
    { label: shared.labels.type, value: copy.type },
    { label: shared.labels.year, value: data.year },
    { label: shared.labels.status, value: copy.status, live: true },
  ];

  return (
    <article className={cx(styles.sheet, "glass")} aria-labelledby={titleId}>
      <div className={styles.card}>
        <header className={styles.head}>
          <h3 id={titleId} className={styles.title}>
            {data.name}
          </h3>
          <ul className={styles.facts}>
            {facts.map((fact) => (
              <li key={fact.label} className={styles.fact}>
                {/* O rótulo (Tipo, Ano, Estado) fica para leitores de tela; a pílula mostra só o valor. */}
                <span className="sr-only">{fact.label}: </span>
                {fact.live && <span className={styles.factDot} aria-hidden="true" />}
                {fact.value}
              </li>
            ))}
          </ul>
        </header>

        {/* O produto real, logo na abertura: a tela dominante e uma segunda, sobreposta. */}
        <figure className={styles.hero}>
          <ShowcaseReveal className={styles.stage}>
            <div className={styles.heroInner}>
              <ZoomMedia
                id="aqua.hero.main"
                group={GROUP}
                image={media.hero.main.image}
                crop={appRegion}
                alt={copy.hero.alt}
                className={cx(styles.frame, styles.layerMain)}
              >
                <ProductShot shot={media.hero.main} alt={copy.hero.alt} span={0.88} />
              </ZoomMedia>
              <ZoomMedia
                id="aqua.hero.back"
                group={GROUP}
                image={media.hero.back.image}
                crop={appRegion}
                alt={copy.hero.altBack}
                className={cx(styles.frame, styles.layerBack)}
              >
                <ProductShot shot={media.hero.back} alt={copy.hero.altBack} span={0.52} />
              </ZoomMedia>
            </div>
          </ShowcaseReveal>
          <figcaption className={styles.heroCaption}>{copy.hero.caption}</figcaption>
        </figure>

        <p className={styles.story}>{copy.story}</p>

        <section className={styles.block} aria-labelledby={`${data.slug}-flow`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-flow`} className={styles.blockTitle}>
              {copy.flow.title}
            </h4>
            <p className={styles.blockLead}>{copy.flow.lead}</p>
          </div>
          <WorkflowStory
            idPrefix={`${data.slug}-flow`}
            tablistLabel={copy.flow.tablistLabel}
            beats={copy.flow.beats}
            shots={media.flow}
            inset={media.flowInset}
            insetAlt={copy.flow.insetAlt}
            insetOn={2}
          />
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-roles`}>
          <h4 id={`${data.slug}-roles`} className={styles.blockTitle}>
            {copy.roles.title}
          </h4>
          <ul className={styles.roles}>
            {copy.roles.items.map((item, index) => (
              <li key={item.role} className={styles.role}>
                <ZoomMedia
                  id={roleKeys[index]}
                  group={GROUP}
                  image={media.roles[index].image}
                  crop={appRegion}
                  alt={item.alt}
                  className={styles.frame}
                >
                  <ProductShot shot={media.roles[index]} alt={item.alt} span={0.32} />
                </ZoomMedia>
                <h5 className={styles.roleName}>{item.role}</h5>
                <p className={styles.roleLine}>{item.line}</p>
              </li>
            ))}
          </ul>
          <p className={styles.usage}>{copy.roles.usage}</p>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-management`}>
          <h4 id={`${data.slug}-management`} className={styles.blockTitle}>
            {copy.management.title}
          </h4>
          <div className={styles.management}>
            <figure className={cx(styles.mgmtItem, styles.mgmtMain)}>
              <ZoomMedia
                id={mgmtKeys[0]}
                group={GROUP}
                image={media.management[0].image}
                crop={appRegion}
                alt={copy.management.items[0].alt}
                className={styles.frame}
              >
                <ProductShot shot={media.management[0]} alt={copy.management.items[0].alt} span={1} />
              </ZoomMedia>
              <figcaption className={styles.mgmtLabel}>{copy.management.items[0].label}</figcaption>
            </figure>
            <figure className={styles.mgmtItem}>
              <ZoomMedia
                id={mgmtKeys[1]}
                group={GROUP}
                image={media.management[1].image}
                crop={appRegion}
                alt={copy.management.items[1].alt}
                className={styles.frame}
              >
                <ProductShot shot={media.management[1]} alt={copy.management.items[1].alt} span={0.5} />
              </ZoomMedia>
              <figcaption className={styles.mgmtLabel}>{copy.management.items[1].label}</figcaption>
            </figure>
            <figure className={styles.mgmtItem}>
              <ZoomMedia
                id={mgmtKeys[2]}
                group={GROUP}
                image={media.management[2].image}
                crop={appRegion}
                alt={copy.management.items[2].alt}
                className={styles.frame}
              >
                <ProductShot shot={media.management[2]} alt={copy.management.items[2].alt} span={0.5} />
              </ZoomMedia>
              <figcaption className={styles.mgmtLabel}>{copy.management.items[2].label}</figcaption>
            </figure>
          </div>
          <p className={styles.mgmtLine}>{copy.management.line}</p>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-decisions`}>
          <h4 id={`${data.slug}-decisions`} className={styles.blockTitle}>
            {copy.decisions.title}
          </h4>
          <ul className={styles.decisions}>
            {copy.decisions.items.map((decision) => (
              <li key={decision.title} className={styles.decision}>
                <h5 className={styles.decisionTitle}>{decision.title}</h5>
                <p className={styles.decisionBody}>{decision.body}</p>
              </li>
            ))}
          </ul>

          <div className={styles.buildBlock}>
            <h5 className={styles.buildTitle}>{copy.build.title}</h5>
            <dl className={styles.build}>
              {copy.build.items.map((item) => (
                <div key={item.label} className={styles.buildItem}>
                  <dt className={styles.buildLabel}>{item.label}</dt>
                  <dd className={styles.buildBody}>{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className={styles.context}>{copy.context}</p>
        </section>

        <div className={styles.credit}>
          <SlugLine items={[{ label: shared.labels.credit, value: copy.credit, wide: true }]} />
          <p className={styles.disclaimer}>{copy.disclaimer}</p>
        </div>
      </div>
    </article>
  );
}
