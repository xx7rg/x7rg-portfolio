import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ColorBar, CropMarks, PlateMark, RegistrationTarget, SlugLine } from "@/components/registration";
import styles from "./primitives.module.css";

export const metadata: Metadata = { title: "Primitivas (QA)", robots: { index: false, follow: false } };

/**
 * Folha de QA das primitivas de Registration. Só existe em desenvolvimento:
 * em produção devolve 404. É texto de desenvolvedor, não conteúdo do site,
 * então não passa pelos dicionários.
 */
export default function PrimitivesPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Primitivas de Registration</h1>

      <section className={styles.block} aria-labelledby="qa-target">
        <h2 id="qa-target">Alvo de registro: alinhado e desalinhado</h2>
        <div className={styles.row}>
          <figure className={styles.figure}>
            <RegistrationTarget state="aligned" className={styles.bigTarget} />
            <figcaption>aligned</figcaption>
          </figure>
          <figure className={styles.figure}>
            <RegistrationTarget state="misaligned" className={styles.bigTarget} />
            <figcaption>misaligned</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="qa-plate">
        <h2 id="qa-plate">Marca de estado: duas placas quadradas</h2>
        <div className={styles.row}>
          <figure className={styles.figure}>
            <PlateMark state="aligned" className={styles.bigMark} />
            <figcaption>aligned</figcaption>
          </figure>
          <figure className={styles.figure}>
            <PlateMark state="misaligned" className={styles.bigMark} />
            <figcaption>misaligned</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="qa-crop">
        <h2 id="qa-crop">Marcas de corte ao redor de um artefato</h2>
        <div className={styles.cropHost}>
          <CropMarks>
            <div className={styles.artifact} />
          </CropMarks>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="qa-bar">
        <h2 id="qa-bar">Barra de cores (tokens do próprio site)</h2>
        <ColorBar
          label="Paleta do site"
          swatches={[
            { name: "fundo", value: "var(--color-bg)" },
            { name: "tinta", value: "var(--color-ink)" },
            { name: "ouro", value: "var(--color-gold)" },
          ]}
        />
      </section>

      <section className={styles.block} aria-labelledby="qa-slug">
        <h2 id="qa-slug">Linha de slug</h2>
        <SlugLine
          items={[
            { label: "Tipo", value: "exemplo de tipo" },
            { label: "Ano", value: "2026" },
            { label: "Estado", value: "exemplo de estado" },
          ]}
        />
      </section>

    </div>
  );
}
