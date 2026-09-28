import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { SlugLine } from "@/components/registration";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import type { CaptionKey } from "@/content/media-captions";
import { projects } from "@/content/projects";
import type { AdrianoSheetData } from "@/content/sheets/adriano-reformas-vigo";
import type { AdrianoSheetCopy, Dictionary } from "@/i18n/types";
import { cx } from "@/lib/cx";
import styles from "./adriano-sheet.module.css";

const GROUP = "adriano-reformas-vigo";

type AdrianoSheetProps = {
  data: AdrianoSheetData;
  copy: AdrianoSheetCopy;
  shared: Dictionary["sheet"];
  newTab: string;
};

/**
 * Folha do Adriano Reformas Vigo: um trabalho REAL de cliente, então a folha é sóbria e de obra, não um experimento.
 * O papel é o creme do próprio site, o texto é o azul-obra e o acento é o laranja, as cores do guia de marca do
 * cliente. As capturas de desktop vêm numa moldura de janela de navegador (é o site, não uma imagem solta); as de
 * celular, em molduras estreitas. A folha descreve a ESTRUTURA e a implementação e não afirma resultados: nenhum
 * número de negócio, avaliação, tráfego ou conversão, e nenhum dado de contato do cliente.
 */
export function AdrianoSheet({ data, copy, shared, newTab }: AdrianoSheetProps) {
  const { media } = data;
  const project = projects.find((entry) => entry.slug === data.slug);
  const live = project && "live" in project ? project.live : undefined;
  const titleId = `${data.slug}-title`;
  const facts = [
    { label: shared.labels.type, value: copy.type },
    { label: shared.labels.year, value: data.year },
    { label: shared.labels.status, value: copy.status },
  ];
  const { client, experience, work, conversion, seo, build, responsive, images } = copy;

  /** Uma captura de desktop numa moldura de janela; abre no visualizador. */
  const browser = (id: CaptionKey, image: StaticImageData, alt: string, sizes: string, caption?: string) => (
    <figure className={styles.figure}>
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
                  <dd className={styles.factValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {browser("adriano.home", media.home, copy.opening.alt, "(min-width: 1100px) 780px, 96vw", copy.opening.caption)}
        </header>

        {section("client", client.title, client.lead, pairs(client.points))}

        {section(
          "experience",
          experience.title,
          experience.lead,
          <>
            <p className={styles.order}>{experience.order}</p>
            <div className={styles.duo}>
              {browser("adriano.services", media.services, experience.servicesAlt, "(min-width: 1100px) 380px, 96vw", experience.servicesCaption)}
              {browser("adriano.steps", media.steps, experience.stepsAlt, "(min-width: 1100px) 380px, 96vw", experience.stepsCaption)}
            </div>
          </>,
        )}

        {section(
          "work",
          work.title,
          work.lead,
          <>
            <p className={styles.note}>{work.filters}</p>
            <div className={styles.duo}>
              {browser("adriano.gallery", media.bath, work.bathAlt, "(min-width: 1100px) 380px, 96vw", work.bathCaption)}
              {browser("adriano.before", media.before, work.beforeAlt, "(min-width: 1100px) 380px, 96vw", work.beforeCaption)}
            </div>
            <div className={styles.split}>
              {browser("adriano.lightbox", media.lightbox, work.lightboxAlt, "(min-width: 1100px) 400px, 96vw", work.lightboxCaption)}
              <figure className={styles.figure}>
                <ZoomMedia id="adriano.about" group={GROUP} image={media.about} alt={work.aboutAlt} radius={14} className={styles.about}>
                  <Image className={styles.aboutImage} src={media.about} alt={work.aboutAlt} sizes="(min-width: 1100px) 340px, 92vw" quality={85} />
                </ZoomMedia>
                <figcaption className={styles.caption}>{work.aboutCaption}</figcaption>
              </figure>
            </div>
            <p className={styles.privacy}>{work.privacy}</p>
          </>,
        )}

        {section(
          "conversion",
          conversion.title,
          conversion.lead,
          <>
            {pairs(conversion.points)}
            <div className={styles.flow}>
              <figure className={styles.figure}>
                <ZoomMedia id="adriano.form" group={GROUP} image={media.form} alt={conversion.formAlt} radius={14} className={styles.formShot}>
                  <Image className={styles.formImage} src={media.form} alt={conversion.formAlt} sizes="(min-width: 1100px) 340px, 92vw" quality={85} />
                </ZoomMedia>
              </figure>
              <div className={styles.message}>
                <h5 className={styles.messageTitle}>{conversion.messageTitle}</h5>
                <ol className={styles.lines} lang="es">
                  {conversion.messageLines.map((line) => (
                    <li key={line} className={styles.line}>
                      {line}
                    </li>
                  ))}
                </ol>
                <p className={styles.note}>{conversion.note}</p>
                <Image className={styles.bar} src={media.mobile.bar} alt={conversion.barAlt} sizes="(min-width: 620px) 340px, 92vw" quality={90} />
              </div>
            </div>
          </>,
        )}

        {section(
          "seo",
          seo.title,
          seo.lead,
          <>
            <dl className={styles.checks}>
              {seo.items.map((item) => (
                <div key={item.label} className={styles.check}>
                  <dt className={styles.checkLabel}>{item.label}</dt>
                  <dd className={styles.checkBody}>{item.body}</dd>
                </div>
              ))}
            </dl>
            {browser("adriano.map", media.map, seo.mapAlt, "(min-width: 1100px) 780px, 96vw", seo.mapCaption)}
            <p className={styles.privacy}>{seo.limits}</p>
          </>,
        )}

        {section(
          "build",
          build.title,
          undefined,
          <>
            {pairs(build.items)}
            <p className={styles.stack}>{build.stack}</p>
          </>,
        )}

        {section(
          "responsive",
          responsive.title,
          responsive.lead,
          <>
            <div className={styles.phones}>
              {phone("adriano.mobile.home", media.mobile.home, responsive.homeAlt)}
              {phone("adriano.mobile.gallery", media.mobile.gallery, responsive.galleryAlt)}
              {phone("adriano.mobile.menu", media.mobile.menu, responsive.menuAlt)}
            </div>
            <p className={styles.caption}>{responsive.caption}</p>
          </>,
        )}

        {section(
          "images",
          images.title,
          images.lead,
          <>
            <dl className={styles.stats}>
              {images.stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <dd className={styles.statValue}>{stat.value}</dd>
                  <dt className={styles.statLabel}>{stat.label}</dt>
                </div>
              ))}
            </dl>
            <p className={styles.blockLead}>{images.body}</p>
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
          {live && (
            <ul className={styles.links}>
              <li>
                <a className={styles.link} href={live} target="_blank" rel="noopener noreferrer" aria-label={`${copy.demo}: ${data.name}, ${newTab}`}>
                  {copy.demo}
                  <ArrowUpRightIcon />
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}
