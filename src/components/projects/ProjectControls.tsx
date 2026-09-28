"use client";

import { ArrowRightIcon, ArrowUpIcon, CloseIcon } from "@/components/ui/icons";
import type { ProjectSlug } from "@/content/projects";
import { cx } from "@/lib/cx";
import stripStyles from "./project-strip.module.css";
import styles from "./projects.module.css";
import { useWork } from "./WorkController";

type OpenProjectButtonProps = {
  slug: ProjectSlug;
  /** O nome do projeto: entra no nome acessível ("Abrir projeto: AquaControl"). */
  name: string;
  label: string;
  /** O convite curto que se vê ("Abrir"); o nome acessível continua sendo o completo. */
  short?: string;
};

/**
 * O botão de abrir da faixa. Um único botão real (uma parada de Tab) cuja área se estica sobre
 * a faixa inteira, então ela toda é clicável sem virar um link falso. Abre o projeto DENTRO do portfólio.
 */
export function OpenProjectButton({ slug, name, label, short }: OpenProjectButtonProps) {
  const { state, open } = useWork();

  return (
    <button
      id={`${slug}-open`}
      type="button"
      className={stripStyles.cta}
      aria-expanded={state.slug === slug}
      aria-controls={`${slug}-case`}
      aria-label={`${label}: ${name}`}
      onClick={() => open(slug)}
    >
      <span>{short ?? label}</span>
      <ArrowRightIcon />
    </button>
  );
}

type CloseProjectButtonProps = {
  label: string;
  /** "foot" é o botão do fim do caso: a volta ao índice, depois de ler tudo. */
  variant?: "bar" | "foot";
};

export function CloseProjectButton({ label, variant = "bar" }: CloseProjectButtonProps) {
  const { close } = useWork();

  return (
    <button type="button" className={cx(styles.close, variant === "foot" && styles.closeFoot)} onClick={close}>
      {variant === "bar" ? <CloseIcon /> : <ArrowUpIcon />}
      <span>{label}</span>
    </button>
  );
}
