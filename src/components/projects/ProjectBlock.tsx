"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { ProjectSlug } from "@/content/projects";
import { CloseProjectButton } from "./ProjectControls";
import styles from "./projects.module.css";
import { useWork } from "./WorkController";

/** Duração da saída da prévia e da saída do caso. Iguais às das animações em projects.module.css. */
const LEAVE_MS = 180;
const CLOSE_MS = 160;

/**
 * As quatro fases de um projeto em destaque:
 *  - closed:  a faixa aparece; o projeto aberto está oculto (e não carrega mídia);
 *  - leaving: a faixa se despede (opacidade), pouco antes de o projeto entrar;
 *  - open:    o projeto aparece no lugar da faixa;
 *  - closing: o projeto se despede, pouco antes de a faixa voltar.
 * Link direto, Voltar e troca de projeto pulam as duas fases de despedida.
 */
type Phase = "closed" | "leaving" | "open" | "closing";

type ProjectBlockProps = {
  slug: ProjectSlug;
  name: string;
  /** "02 · Software operacional": o que aparece na barra do caso aberto. */
  eyebrow: string;
  labels: { close: string; backToIndex: string };
  /** A faixa fechada do projeto, renderizada no servidor. */
  preview: ReactNode;
  /** O que abre por dentro (folha completa ou apresentação compacta), renderizado no servidor. Fica no HTML mesmo fechado (só oculto). */
  children: ReactNode;
};

export function ProjectBlock({ slug, name, eyebrow, labels, preview, children }: ProjectBlockProps) {
  const work = useWork();
  const { settled } = work;
  const isOpen = work.state.slug === slug;
  const [phase, setPhase] = useState<Phase>("closed");
  const [wasOpen, setWasOpen] = useState(false);
  // As animações só rodam depois de uma escolha do visitante: a carga da página não anima.
  const [animated, setAnimated] = useState(false);

  // A fase deriva do estado durante a renderização (não num efeito): o DOM muda num só commit,
  // o que permite ao controlador medir e compensar a rolagem logo depois, sem depender de tempo.
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    const instant = isOpen ? work.state.openInstant : work.state.closeInstant;
    setPhase(isOpen ? (instant ? "open" : "leaving") : instant ? "closed" : "closing");
    if (!instant) setAnimated(true);
  }

  useEffect(() => {
    if (phase !== "leaving" && phase !== "closing") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 0 : phase === "leaving" ? LEAVE_MS : CLOSE_MS;
    const timer = window.setTimeout(() => setPhase(phase === "leaving" ? "open" : "closed"), delay);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === "open" || phase === "closed") settled(slug, phase);
  }, [phase, slug, settled]);

  return (
    <div id={slug} className={styles.block} data-project={slug} data-phase={phase} data-anim={animated ? "" : undefined}>
      <div className={styles.previewSlot} hidden={phase === "open" || phase === "closing"}>
        {preview}
      </div>
      <div
        id={`${slug}-case`}
        role="region"
        aria-label={name}
        tabIndex={-1}
        className={styles.caseSlot}
        hidden={phase === "closed" || phase === "leaving"}
      >
        {/* O Fechar fica à esquerda: o canto superior direito é do controle fixo de data e idioma. */}
        <div className={styles.caseBar}>
          <CloseProjectButton label={labels.close} />
          <span className={styles.caseEyebrow}>{eyebrow}</span>
        </div>
        {children}
        <div className={styles.caseFoot}>
          <CloseProjectButton label={labels.backToIndex} variant="foot" />
        </div>
      </div>
    </div>
  );
}
