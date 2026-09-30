import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { SlugLine } from "@/components/registration";
import type { CaptionKey } from "@/content/media-captions";
import type { MatteoSheetData } from "@/content/sheets/matteo";
import type { Dictionary, MatteoSheetCopy } from "@/i18n/types";
import { cx } from "@/lib/cx";
import styles from "./matteo-sheet.module.css";

const GROUP = "matteo";

type MatteoSheetProps = {
  data: MatteoSheetData;
  copy: MatteoSheetCopy;
  shared: Dictionary["sheet"];
};

/**
 * Folha do Matteo: projeto AUTORAL (não de cliente), então não há link de código-fonte nem de
 * demonstração ao vivo — o repositório é privado e a produção é uma página de evento real,
 * compartilhada só com quem foi convidado, não um endereço para divulgação pública. O domínio
 * aparece só como texto inerte na moldura de navegador (a mesma convenção visual dos outros
 * casos), nunca como link clicável. Todas as capturas vêm do conjunto de 12 mídias aprovadas
 * (as únicas que não expõem data+local exatos juntos, RSVP/Pix reais ou mapa preciso). O universo
 * visual é inspirado em "O Pequeno Príncipe", tratado como referência temática, nunca como autoria
 * ou afiliação com a obra.
 */
export function MatteoSheet({ data, copy, shared }: MatteoSheetProps) {
  const { media } = data;
  const titleId = `${data.slug}-title`;
  const facts = [
    { label: shared.labels.type, value: copy.type },
    { label: shared.labels.year, value: data.year },
    { label: shared.labels.status, value: copy.status, live: true },
  ];
  const { fromInvitation, atmosphere, experience, visual, beyond, build, responsive } = copy;

  /** Uma captura de desktop numa moldura de janela; abre no visualizador. */
  const browser = (id: CaptionKey, image: StaticImageData, alt: string, sizes: string, caption?: string, className?: string) => (
    <figure className={cx(styles.figure, className)}>
      <div className={styles.browser}>
        <div className={styles.chrome} aria-hidden="true">
          <span className={styles.dots} />
          <span className={styles.address}>{data.address}</span>
        </div>
        <ZoomMedia id={id} group={GROUP} image={image} alt={alt} radius={0} className={styles.shot}>
          <Image className={styles.shotImage} src={image} alt={alt} sizes={sizes} quality={85} />
        </ZoomMedia>
      </div>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );

  const phone = (id: CaptionKey, image: StaticImageData, alt: string) => (
    <ZoomMedia id={id} group={GROUP} image={image} alt={alt} radius={16} className={styles.phone}>
      <Image className={styles.phoneImage} src={image} alt={alt} sizes="(min-width: 620px) 220px, 44vw" quality={85} />
    </ZoomMedia>
  );

  const section = (key: string, title: string, lead: string | undefined, children: ReactNode) => (
    <section className={styles.block} aria-labelledby={`${data.slug}-${key}`}>
      <div className={styles.blockHead}>
        <h4 id={`${data.slug}-${key}`} className={styles.blockTitle}>
          {title}
        </h4>
        {lead && <p className={styles.blockLead}>{lead}</p>}
      </div>
      {children}
    </section>
  );

  const pairs = (items: readonly { label: string; body: string }[]) => (
    <dl className={styles.pairs}>
      {items.map((item) => (
        <div key={item.label} className={styles.pair}>
          <dt className={styles.pairLabel}>{item.label}</dt>
          <dd className={styles.pairBody}>{item.body}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <article className={cx(styles.sheet, "glass")} aria-labelledby={titleId}>
      <div className={styles.card}>
        <header className={styles.opening}>
          <div className={styles.intro}>
            <h3 id={titleId} className={styles.title}>
              {data.name}
            </h3>
            <p className={styles.statement}>{copy.statement}</p>
            <dl className={styles.facts}>
              {facts.map((fact) => (
                <div key={fact.label} className={styles.fact}>
                  <dt className={styles.factLabel}>{fact.label}</dt>
                  <dd className={styles.factValue}>
                    {fact.live && <span className={styles.factDot} aria-hidden="true" />}
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          {browser("matteo.night", media.night, copy.opening.alt, "(min-width: 1100px) 780px, 96vw", copy.opening.caption)}
        </header>

        {section(
          "invitation",
          fromInvitation.title,
          fromInvitation.lead,
          browser("matteo.day", media.day, fromInvitation.alt, "(min-width: 1100px) 780px, 96vw", fromInvitation.caption),
        )}

        {section(
          "atmosphere",
          atmosphere.title,
          atmosphere.lead,
          <div className={styles.atmosphere}>
            {browser("matteo.atmosphereDay", media.day, atmosphere.dayAlt, "(min-width: 1100px) 500px, 96vw", atmosphere.dayCaption, styles.atmosphereWide)}
            {browser("matteo.atmosphereDusk", media.dusk, atmosphere.duskAlt, "(min-width: 1100px) 320px, 70vw", atmosphere.duskCaption, styles.atmosphereNarrow)}
            {browser(
              "matteo.atmosphereNight",
              media.night,
              atmosphere.nightAlt,
              "(min-width: 1100px) 500px, 96vw",
              atmosphere.nightCaption,
              styles.atmosphereWide,
            )}
          </div>,
        )}

        {section(
          "experience",
          experience.title,
          experience.lead,
          <div className={styles.duo}>
            {browser("matteo.countdown", media.countdown, experience.countdownAlt, "(min-width: 1100px) 380px, 96vw", experience.countdownCaption)}
            {browser("matteo.story", media.story, experience.storyAlt, "(min-width: 1100px) 380px, 96vw", experience.storyCaption)}
          </div>,
        )}

        {section(
          "visual",
          visual.title,
          visual.lead,
          <>
            {browser("matteo.gallery", media.gallery, visual.galleryAlt, "(min-width: 1100px) 780px, 96vw", visual.galleryCaption)}
            <p className={styles.note}>{visual.note}</p>
          </>,
        )}

        {section(
          "beyond",
          beyond.title,
          beyond.lead,
          <div className={styles.trio}>
            {browser("matteo.confirmation", media.confirmation, beyond.confirmationAlt, "(min-width: 1100px) 340px, 96vw", beyond.confirmationCaption)}
            {browser("matteo.directions", media.directions, beyond.directionsAlt, "(min-width: 1100px) 340px, 96vw", beyond.directionsCaption)}
            {browser("matteo.gifts", media.gifts, beyond.giftsAlt, "(min-width: 1100px) 340px, 96vw", beyond.giftsCaption)}
          </div>,
        )}

        {section("build", build.title, undefined, <>{pairs(build.items)}<p className={styles.stack}>{build.stack}</p></>)}

        {section(
          "responsive",
          responsive.title,
          responsive.lead,
          <>
            <div className={styles.phones}>
              {phone("matteo.mobile.hero", media.mobile.hero, responsive.heroAlt)}
              {phone("matteo.mobile.navigation", media.mobile.navigation, responsive.navigationAlt)}
              {phone("matteo.mobile.functional", media.mobile.functional, responsive.functionalAlt)}
            </div>
            <p className={styles.caption}>{responsive.caption}</p>
          </>,
        )}

        <section className={styles.limits} aria-labelledby={`${data.slug}-limits`}>
          <h4 id={`${data.slug}-limits`} className={styles.limitsTitle}>
            {copy.limits.title}
          </h4>
          <p className={styles.limitsBody}>{copy.limits.body}</p>
        </section>

        <div className={styles.credit}>
          <SlugLine items={[{ label: shared.labels.credit, value: copy.credit, wide: true }]} />
        </div>
      </div>
    </article>
  );
}
