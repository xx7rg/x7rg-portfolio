import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { SlugLine } from "@/components/registration";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import type { CaptionKey } from "@/content/media-captions";
import { projects } from "@/content/projects";
import type { LucianeSheetData } from "@/content/sheets/luciane-correa-servicios";
import type { Dictionary, LucianeSheetCopy } from "@/i18n/types";
import { cx } from "@/lib/cx";
import styles from "./luciane-sheet.module.css";

const GROUP = "luciane-correa-servicios";

type LucianeSheetProps = {
  data: LucianeSheetData;
  copy: LucianeSheetCopy;
  shared: Dictionary["sheet"];
  viewSource: string;
  newTab: string;
};

/**
 * Folha do Luciane Correa Servicios: um trabalho REAL de cliente, com backend próprio na
 * Cloudflare (Functions + KV) por trás de um site de serviços editorial. A folha é sóbria e
 * editorial, como o próprio site: navy e marfim do guia de marca real do projeto (ideas.md do
 * repositório), com o dourado como acento — não uma paleta escolhida pelo portfólio. As capturas
 * de desktop vêm numa moldura de janela de navegador (é o site, não uma imagem solta); as de
 * celular, em molduras estreitas. A folha descreve a ESTRUTURA e a implementação e não afirma
 * resultados de negócio: nenhuma métrica de conversão, vendas ou SEO, e a seção de depoimentos
 * é honesta sobre a produção capturada ainda não ter nenhum publicado.
 */
export function LucianeSheet({ data, copy, shared, viewSource, newTab }: LucianeSheetProps) {
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
  const { context, visual, services, conversion, process, testimonials, build, responsive } = copy;

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
                  <dd className={styles.factValue}>
                    {fact.live && <span className={styles.factDot} aria-hidden="true" />}
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          {browser("luciane.about", media.about, copy.opening.alt, "(min-width: 1100px) 780px, 96vw", copy.opening.caption)}
        </header>

        {section("context", context.title, context.lead, browser("luciane.hero", media.hero, context.heroAlt, "(min-width: 1100px) 780px, 96vw", context.heroCaption))}

        {section("visual", visual.title, visual.lead, pairs(visual.points))}

        {section(
          "services",
          services.title,
          services.lead,
          <div className={styles.duo}>
            {browser("luciane.services", media.services, services.servicesAlt, "(min-width: 1100px) 380px, 96vw", services.servicesCaption)}
            {browser("luciane.packages", media.packages, services.packagesAlt, "(min-width: 1100px) 380px, 96vw", services.packagesCaption)}
          </div>,
        )}

        {section(
          "conversion",
          conversion.title,
          conversion.lead,
          <>
            {pairs(conversion.points)}
            {browser("luciane.quote", media.quote, conversion.quoteAlt, "(min-width: 1100px) 780px, 96vw", conversion.quoteCaption)}
          </>,
        )}

        {section("process", process.title, process.lead, browser("luciane.process", media.process, process.processAlt, "(min-width: 1100px) 780px, 96vw", process.processCaption))}

        {section(
          "testimonials",
          testimonials.title,
          testimonials.lead,
          <>
            {browser(
              "luciane.testimonials",
              media.testimonials,
              testimonials.testimonialsAlt,
              "(min-width: 1100px) 780px, 96vw",
              testimonials.testimonialsCaption,
            )}
            <p className={styles.note}>{testimonials.note}</p>
          </>,
        )}

        {section(
          "build",
          build.title,
          undefined,
          <>
            {pairs(build.items)}
            <p className={styles.stack}>{build.stack}</p>
            {browser("luciane.footer", media.footer, build.footerAlt, "(min-width: 1100px) 780px, 96vw", build.footerCaption)}
          </>,
        )}

        {section(
          "responsive",
          responsive.title,
          responsive.lead,
          <>
            <div className={styles.phones}>
              {phone("luciane.mobile.hero", media.mobile.hero, responsive.heroAlt)}
              {phone("luciane.mobile.content", media.mobile.content, responsive.contentAlt)}
              {phone("luciane.mobile.menu", media.mobile.menu, responsive.menuAlt)}
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
