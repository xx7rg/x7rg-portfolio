import { ProjectBlock } from "@/components/projects/ProjectBlock";
import { ProjectStrip } from "@/components/projects/ProjectStrip";
import { renderProject, stripAccent, stripAccent2, stripClass, stripComposition, stripTitle } from "@/components/projects/registry";
import { WorkController } from "@/components/projects/WorkController";
import { FolderIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { projects } from "@/content/projects";
import type { Dictionary } from "@/i18n/types";
import styles from "./projects.module.css";

/**
 * Projetos selecionados: UM sistema de descoberta para os nove trabalhos. Cada um é uma faixa fechada da
 * mesma família (imagem real, número, categoria, título, uma frase) e abre DENTRO do portfólio, no lugar da
 * faixa: os estudos de caso completos e as apresentações compactas usam o mesmo mecanismo. O visitante não
 * sai daqui por nenhum link; os links externos vivem dentro de cada projeto aberto. O catálogo vem de
 * src/content/projects.ts; nada aqui assume quais projetos existem nem em que ordem. Todos ficam no HTML,
 * só ocultos: o conteúdo continua legível para busca e leitores de tela, e sem JavaScript o CSS abaixo os mostra.
 */
export function ProjectsSection({ dict }: { dict: Dictionary }) {
  const labels = { close: dict.work.close, backToIndex: dict.work.backToIndex };

  return (
    <section id="projects" className={styles.section} aria-labelledby="projects-title" data-slug-section>
      <SectionLabel id="projects-title" Icon={FolderIcon} count={String(projects.length).padStart(2, "0")}>
        {dict.work.title}
      </SectionLabel>

      <WorkController viewer={dict.viewer}>
        <div className={styles.list} data-strip-list="">
          {projects.map((project, index) => {
            const number = String(index + 1).padStart(2, "0");
            const copy = dict.work.items[project.slug];
            return (
              <ProjectBlock
                key={project.slug}
                slug={project.slug}
                name={project.name}
                eyebrow={`${number} · ${copy.category}`}
                labels={labels}
                preview={
                  <ProjectStrip
                    slug={project.slug}
                    number={number}
                    name={project.name}
                    title={stripTitle(project.slug, project.name)}
                    category={copy.category}
                    year={"year" in project ? project.year : undefined}
                    statement={copy.statement}
                    openLabel={dict.work.open}
                    accent={stripAccent(project.slug)}
                    accent2={stripAccent2(project.slug)}
                    {...stripComposition(project.slug)}
                    className={stripClass(project.slug)}
                  />
                }
              >
                {renderProject(project.slug, dict)}
              </ProjectBlock>
            );
          })}
        </div>
      </WorkController>

      {/* Sem JavaScript não há como abrir um projeto: as faixas somem e os projetos aparecem abertos, um abaixo do outro. */}
      <noscript>
        <style>{"[data-project] [hidden]{display:grid!important}[data-project] [class*=previewSlot]{display:none!important}"}</style>
      </noscript>
    </section>
  );
}
