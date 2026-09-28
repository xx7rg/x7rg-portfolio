import Image from "next/image";
import { ZoomMedia } from "@/components/media-viewer/ZoomMedia";
import { ColorBar, PlateMark, SlugLine } from "@/components/registration";
import type { ProjectSheetData } from "@/content/sheets/types";
import type { Dictionary, ProjectSheetCopy } from "@/i18n/types";
import { cx } from "@/lib/cx";
import { CropImage } from "./CropImage";
import { ProofBuildPanels, ProofBuildProvider, ProofBuildToggle } from "./proof-build";
import { Showcase } from "./Showcase";
import styles from "./project-sheet.module.css";

type ProjectSheetProps = {
  data: ProjectSheetData;
  copy: ProjectSheetCopy;
  shared: Dictionary["sheet"];
};

/**
 * Folha de projeto da home: um cartão de vidro, na ordem em que o visitante precisa
 * das coisas. Identidade (nome, tipo, ano, estado) → impacto visual (o jogo, em
 * capturas reais) → contexto (o ponto de partida) → Proof/Build → decisões.
 * Recebe dados neutros de idioma e o texto já no idioma da página. As cores do
 * projeto entram só no palco das capturas e no ícone; o cartão segue o sistema do site.
 */
export function ProjectSheet({ data, copy, shared }: ProjectSheetProps) {
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
          <Image className={styles.icon} src={data.icon} alt={copy.iconAlt} width={56} height={56} />
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
          <p className={styles.story}>{copy.startingPoint}</p>
        </header>

        <ProofBuildProvider>
          <Showcase media={data.media.showcase} alt={copy.mediaAlt} pins={data.pins.proof} />

          <div className={styles.mediaMeta}>
            <p className={styles.mediaCaption}>{copy.mediaCaption}</p>
            <ColorBar
              className={styles.palette}
              label={shared.colorBarLabel}
              swatches={data.palette.map((color) => ({
                name: shared.colors[color.name],
                value: color.value,
              }))}
            />
          </div>

          <ProofBuildToggle id={data.slug} labels={shared.proofBuild} />
          <ProofBuildPanels
            id={data.slug}
            labels={shared.proofBuild}
            notes={{ proof: copy.proof, build: copy.build }}
            proofEvidence={{
              // Anotação 2 (Fases e cenários): o recorte dos quatro cenários é a evidência dos cenários.
              1: (
                <ZoomMedia
                  id="neon.scenarios"
                  group="neon-blockfall"
                  image={data.media.evidence.scenarios.image}
                  alt={copy.mediaAlt.scenarios}
                  radius={12}
                >
                  <CropImage
                    shot={data.media.evidence.scenarios}
                    alt={copy.mediaAlt.scenarios}
                    sizes="(min-width: 700px) 260px, 340px"
                  />
                </ZoomMedia>
              ),
            }}
          />
        </ProofBuildProvider>

        <ul className={styles.decisions}>
          {copy.decisions.map((decision, index) => {
            const unfinished = data.decisions[index] === "unfinished";
            return (
              <li key={decision.title} className={styles.decision}>
                {unfinished && (
                  <p className={styles.unfinished}>
                    <PlateMark state="misaligned" />
                    {shared.unfinished}
                  </p>
                )}
                <h4 className={styles.decisionTitle}>{decision.title}</h4>
                <p className={styles.decisionBody}>{decision.body}</p>
                {/* A decisão não concluída (ranking online) mostra o que existe hoje: o placar do aparelho. */}
                {unfinished && (
                  <ZoomMedia
                    id="neon.scoreboard"
                    group="neon-blockfall"
                    image={data.media.evidence.scoreboard.image}
                    alt={copy.mediaAlt.scoreboard}
                    radius={14}
                    className={styles.decisionEvidence}
                  >
                    <CropImage
                      shot={data.media.evidence.scoreboard}
                      alt={copy.mediaAlt.scoreboard}
                      sizes="900px"
                    />
                  </ZoomMedia>
                )}
              </li>
            );
          })}
        </ul>

        <SlugLine
          className={styles.credit}
          items={[{ label: shared.labels.credit, value: copy.credit, wide: true }]}
        />
      </div>
    </article>
  );
}
