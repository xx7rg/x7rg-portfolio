import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { ShowcaseReveal } from "@/components/project-sheet/ShowcaseReveal";
import { SlugLine } from "@/components/registration";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import type { ByaSheetData } from "@/content/sheets/feito-pela-bya";
import type { ByaSheetCopy, Dictionary } from "@/i18n/types";
import { cx } from "@/lib/cx";
import type { CaptionKey } from "@/content/media-captions";
import { ByaCrop } from "./ByaCrop";
import { playfair } from "./playfair";
import styles from "./bya-sheet.module.css";

const GROUP = "feito-pela-bya";
const flavorKeys: readonly CaptionKey[] = ["bya.chocolate", "bya.maracuja", "bya.ninho", "bya.coco"];

type ByaSheetProps = {
  data: ByaSheetData;
  copy: ByaSheetCopy;
  shared: Dictionary["sheet"];
  /** "abre em nova aba", para o link do site. */
  newTab: string;
};

const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

/**
 * Folha da Feito Pela Bya: um caso de identidade visual, contado por imagens. Ordem: identidade
 * (o logo, grande, sobre o ameixa) → o B (detalhes reais do logo final) → linguagem visual →
 * os quatro sabores como uma série → aplicações → o site → crédito. Não é um caso de software: não
 * há problema, fluxo nem engenharia. O palco é ameixa; o creme dá contraste; o framboesa é o único
 * acento de projeto. O dourado do portfólio segue global e o da marca só aparece em filetes.
 */
export function ByaSheet({ data, copy, shared, newTab }: ByaSheetProps) {
  const { media } = data;
  const titleId = `${data.slug}-title`;
  const words = data.name.split(" ");
  const accent = words.pop();
  const brand = words.join(" ");
  const facts = [
    { label: shared.labels.type, value: copy.type },
    { label: shared.labels.year, value: data.year },
    { label: shared.labels.status, value: copy.status, live: true },
  ];
  const palette = [
    { name: copy.language.palette[0], hex: data.palette.plum, tone: styles.swatchPlum },
    { name: copy.language.palette[1], hex: data.palette.plumSoft, tone: styles.swatchSoft },
    { name: copy.language.palette[2], hex: data.palette.raspberry, tone: styles.swatchRose },
    { name: copy.language.palette[3], hex: data.palette.cream, tone: styles.swatchCream },
    { name: copy.language.palette[4], hex: data.palette.blush, tone: styles.swatchBlush },
  ];

  return (
    <article className={cx(styles.sheet, "glass", playfair.variable)} aria-labelledby={titleId}>
      <div className={styles.card}>
        <header className={styles.head}>
          <h3 id={titleId} className={styles.title}>
            {brand} <em>{accent}</em>
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

        {/* A abertura é a marca: o logo grande e sozinho sobre o ameixa, sem cartão branco. */}
        <ShowcaseReveal className={cx(styles.reveal, styles.opening)}>
          <ZoomMedia
            id="bya.logo"
            group={GROUP}
            image={media.logo}
            alt={copy.logoAlt}
            background="#23111f"
            radius={14}
            className={styles.logoZoom}
          >
            <Image
              className={styles.logo}
              src={media.logo}
              alt={copy.logoAlt}
              sizes="(min-width: 1100px) 460px, 80vw"
              quality={90}
            />
          </ZoomMedia>
        </ShowcaseReveal>

        <p className={styles.story}>{copy.story}</p>

        <section className={styles.block} aria-labelledby={`${data.slug}-detail`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-detail`} className={styles.blockTitle}>
              {copy.detail.title}
            </h4>
            <p className={styles.lead}>{copy.detail.lead}</p>
          </div>
          <ShowcaseReveal className={cx(styles.reveal, styles.detailPanel)}>
            <figure className={cx(styles.detailCell, styles.detailB, styles.rv)} style={stagger(0)}>
              <ByaCrop shot={data.logoDetails[1]} span={0.55} />
              <figcaption className={styles.detailLabel}>{copy.detail.labels[1]}</figcaption>
            </figure>
            <figure className={cx(styles.detailCell, styles.rv)} style={stagger(1)}>
              <ByaCrop shot={data.logoDetails[0]} span={0.4} />
              <figcaption className={styles.detailLabel}>{copy.detail.labels[0]}</figcaption>
            </figure>
            <figure className={cx(styles.detailCell, styles.rv)} style={stagger(2)}>
              <ByaCrop shot={data.logoDetails[2]} span={0.4} />
              <figcaption className={styles.detailLabel}>{copy.detail.labels[2]}</figcaption>
            </figure>
          </ShowcaseReveal>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-language`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-language`} className={styles.blockTitle}>
              {copy.language.title}
            </h4>
            <p className={styles.lead}>{copy.language.lead}</p>
          </div>
          <ShowcaseReveal className={cx(styles.reveal, styles.swatches)}>
            {palette.map((swatch, index) => (
              <div key={swatch.hex} className={cx(styles.swatch, swatch.tone, styles.rv)} style={stagger(index)}>
                {index === 0 && (
                  <span className={styles.specimen} aria-hidden="true">
                    Bya
                  </span>
                )}
                <span className={styles.swatchName}>{swatch.name}</span>
                <span className={styles.swatchHex}>{swatch.hex}</span>
                {index === 0 && <span className={styles.swatchType}>{copy.language.typeName}</span>}
              </div>
            ))}
          </ShowcaseReveal>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-flavors`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-flavors`} className={styles.blockTitle}>
              {copy.flavors.title[0]} <em>{copy.flavors.title[1]}</em>
            </h4>
            <p className={styles.lead}>{copy.flavors.lead}</p>
          </div>
          <ShowcaseReveal className={cx(styles.reveal, styles.mosaic)}>
            {copy.flavors.items.map((item, index) => (
              <Fragment key={item.name}>
                {/* Um quadro do mosaico é uma frase, no lugar de uma quinta imagem: fica antes do Coco. */}
                {index === 3 && (
                  <div className={cx(styles.cell, styles.cellText, styles.rv)} style={stagger(3)}>
                    <p>{copy.flavors.cell}</p>
                  </div>
                )}
                <FlavorCell index={index} name={item.name} alt={item.alt} src={media.flavors[index]} lead={index === 0} />
              </Fragment>
            ))}
          </ShowcaseReveal>
          <p className={styles.ai}>{copy.flavors.ai}</p>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-applications`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-applications`} className={styles.blockTitle}>
              {copy.applications.title}
            </h4>
            <p className={styles.lead}>{copy.applications.lead}</p>
          </div>
          <ShowcaseReveal className={cx(styles.reveal, styles.apps)}>
            {data.applications.map((shot, index) => (
              <figure key={copy.applications.items[index]} className={cx(styles.app, styles.zoom, styles.rv)} style={stagger(index)}>
                <ByaCrop shot={shot} span={0.33} />
                <figcaption className={styles.appLabel}>{copy.applications.items[index]}</figcaption>
              </figure>
            ))}
            <div className={styles.plaqueBlock}>
              <p className={styles.appLabel}>{copy.applications.plaques}</p>
              <div className={styles.plaques} aria-hidden="true">
                {data.plaques.map((shot, index) => (
                  <ByaCrop key={index} shot={shot} span={0.25} className={cx(styles.plaque, styles.zoom, styles.rv)} />
                ))}
              </div>
            </div>
          </ShowcaseReveal>
        </section>

        <section className={styles.block} aria-labelledby={`${data.slug}-digital`}>
          <div className={styles.blockHead}>
            <h4 id={`${data.slug}-digital`} className={styles.blockTitle}>
              {copy.digital.title}
            </h4>
            <p className={styles.lead}>{copy.digital.lead}</p>
          </div>
          <ShowcaseReveal className={cx(styles.reveal, styles.digital)}>
            <div className={cx(styles.siteFrame, styles.rv)}>
              <ZoomMedia id="bya.site" group={GROUP} image={media.site} alt={copy.digital.siteAlt} radius={14}>
                <Image
                  className={styles.siteImage}
                  src={media.site}
                  alt={copy.digital.siteAlt}
                  sizes="(min-width: 1100px) 690px, 92vw"
                  quality={90}
                />
              </ZoomMedia>
            </div>
            <div className={cx(styles.digitalRow, styles.rv)} style={stagger(1)}>
              <figure className={styles.share}>
                <ZoomMedia id="bya.share" group={GROUP} image={media.share} alt={copy.digital.shareAlt} radius={12}>
                  <Image
                    className={styles.shareImage}
                    src={media.share}
                    alt={copy.digital.shareAlt}
                    sizes="150px"
                    quality={90}
                  />
                </ZoomMedia>
                <figcaption className={styles.appLabel}>{copy.digital.shareLabel}</figcaption>
              </figure>
              <a
                className={styles.link}
                href={data.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${copy.digital.link}, ${data.siteHost}, ${newTab}`}
              >
                <span className={styles.linkText}>
                  {copy.digital.link}
                  <span className={styles.linkHost}>{data.siteHost}</span>
                </span>
                <ArrowUpRightIcon aria-hidden="true" />
              </a>
            </div>
          </ShowcaseReveal>
        </section>

        <div className={styles.credit}>
          <SlugLine items={[{ label: shared.labels.credit, value: copy.credit, wide: true }]} />
          <p className={styles.note}>{copy.note}</p>
        </div>
      </div>
    </article>
  );
}

type FlavorCellProps = {
  index: number;
  name: string;
  alt: string;
  src: ByaSheetData["media"]["flavors"][number];
  lead: boolean;
};

/** Uma cena de produto do mosaico: retrato preenchendo o quadro, com o nome do sabor. */
function FlavorCell({ index, name, alt, src, lead }: FlavorCellProps) {
  return (
    <figure className={cx(styles.cell, styles.zoom, styles.rv, lead && styles.cellLead)} style={stagger(index)}>
      <ZoomMedia id={flavorKeys[index]} group={GROUP} image={src} alt={alt} radius={12} className={styles.cellZoom}>
        <Image
          className={styles.cellImage}
          src={src}
          alt={alt}
          fill
          sizes={lead ? "(min-width: 1100px) 345px, (min-width: 560px) 46vw, 92vw" : "(min-width: 1100px) 170px, 44vw"}
          quality={90}
        />
      </ZoomMedia>
      <figcaption className={styles.cellName}>{name}</figcaption>
    </figure>
  );
}
