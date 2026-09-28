import Image from "next/image";
import type { CSSProperties } from "react";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { compact } from "@/content/compact";
import { projects, type CompactSlug } from "@/content/projects";
import type { Dictionary } from "@/i18n/types";
import { cx } from "@/lib/cx";
import styles from "./compact-project.module.css";

type CompactProjectProps = {
  slug: CompactSlug;
  dict: Dictionary;
};

/**
 * A apresentação interna compacta dos projetos sem estudo de caso completo. É a mesma casca das folhas
 * (moldura de vidro e cartão escuro), mas só com o que está documentado: o título, a imagem principal
 * REAL (inspecionável), uma frase, as capturas de apoio, as tecnologias declaradas no README público e,
 * por último e em segundo plano, os links externos. Quando um projeto ganhar conteúdo (papel, decisões,
 * mais mídia), ele é promovido a caso e passa a ter folha própria; esta estrutura não muda.
 */
export function CompactProject({ slug, dict }: CompactProjectProps) {
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) return null;

  const data = compact[slug];
  const copy = dict.work.items[slug];
  const captions = dict.viewer.captions;
  const [main, ...rest] = data.shots;
  const titleId = `${slug}-title`;
  const live = "live" in project ? project.live : undefined;
  const repo = "repo" in project ? project.repo : undefined;
  const newTab = dict.a11y.newTab;

  return (
    <article className={cx(styles.sheet, "glass")} style={{ "--acc": data.accent } as CSSProperties} aria-labelledby={titleId}>
      <div className={styles.card}>
        <header className={styles.head}>
          <h3 id={titleId} className={styles.title}>
            {project.name}
          </h3>
          <p className={styles.category}>
            <span className={styles.dot} aria-hidden="true" />
            {copy.category}
          </p>
        </header>

        <div className={styles.stage}>
          <ZoomMedia
            id={main.key}
            group={slug}
            image={main.image}
            alt={captions[main.key]}
            radius={12}
            className={styles.hero}
          >
            <Image
              className={styles.heroImage}
              src={main.image}
              alt={captions[main.key]}
              sizes="(min-width: 1100px) 700px, 92vw"
              quality={90}
              style={main.image.width <= 600 ? { maxInlineSize: `${main.image.width}px` } : undefined}
            />
          </ZoomMedia>
        </div>

        <p className={styles.statement}>{copy.statement}</p>

        {rest.length > 0 && (
          <ul className={styles.shots}>
            {rest.map((shot) => (
              <li key={shot.key}>
                <ZoomMedia id={shot.key} group={slug} image={shot.image} alt={captions[shot.key]} radius={10}>
                  <Image
                    className={styles.shotImage}
                    src={shot.image}
                    alt={captions[shot.key]}
                    sizes="(min-width: 700px) 340px, 46vw"
                    quality={85}
                  />
                </ZoomMedia>
              </li>
            ))}
          </ul>
        )}

        <div className={styles.foot}>
          <section className={styles.tech} aria-label={dict.work.technologies}>
            <h4 className={styles.techTitle}>{dict.work.technologies}</h4>
            <ul className={styles.chips}>
              {data.tech.map((name) => (
                <li key={name} className={styles.chip}>
                  {name}
                </li>
              ))}
            </ul>
          </section>

          {(live || repo) && (
            <ul className={styles.links}>
              {live && (
                <li>
                  <a
                    className={styles.link}
                    href={live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${dict.work.visitSite}: ${project.name}, ${newTab}`}
                  >
                    {dict.work.visitSite}
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
                    aria-label={`${dict.work.viewSource}: ${project.name}, ${newTab}`}
                  >
                    {dict.work.viewSource}
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
