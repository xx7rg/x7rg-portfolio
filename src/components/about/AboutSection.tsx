"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import BlockTextReveal from "@/components/effects/BlockTextReveal";
import { UserIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/i18n/types";
import styles from "./about.module.css";

type AiHighlightKey = keyof Dictionary["about"]["aiImpact"]["highlights"];

/** Ordem fixa em que as quatro frases aparecem destacadas, nas três línguas. */
const AI_HIGHLIGHT_ORDER: readonly AiHighlightKey[] = ["ai", "tools", "force", "solutions"];

/** Alterna os dois tons da marca-texto do Hero (--hl-1/--hl-2), no mesmo ritmo que ele já usa. */
const AI_HIGHLIGHT_TONE: Record<AiHighlightKey, "a" | "b"> = {
  ai: "a",
  tools: "b",
  force: "a",
  solutions: "b",
};

/**
 * O BlockTextReveal fornecido não expõe "terminei" (sem onComplete, sem prop de loop) — a duração
 * real é `(2200 / (speed/25)) * (timeline/0.85)`, e timeline cresce com o número de linhas
 * (variável por largura de tela). Com speed=40 e até ~8 linhas (mais que o parágrafo já ocupa em
 * qualquer largura testada, 1440 a 390), a revelação real nunca passa de ~2,1s; 2600ms é a folga
 * segura adotada aqui. Passar do tempo real só atrasaria o início da pausa de leitura, nunca corta
 * a revelação no meio.
 */
const AI_REVEAL_MS = 2600;
/** Quanto tempo o parágrafo completo (já revelado, com os 4 destaques elegantes) fica parado antes de reiniciar. */
const AI_HOLD_MS = 10000;

/**
 * Recorta o parágrafo de IA em trechos simples e trechos em destaque, na ordem em que aparecem —
 * o parágrafo inteiro é sempre este mesmo texto semântico, animado ou não. Casa por `indexOf`
 * simples, na mesma ordem fixa de AI_HIGHLIGHT_ORDER; se uma frase não for encontrada (a tradução
 * mudou e o dicionário ficou fora de sincronia), ela é ignorada e o texto segue corrido.
 */
function splitAiImpact(text: string, highlights: Dictionary["about"]["aiImpact"]["highlights"]) {
  const segments: { text: string; key?: AiHighlightKey }[] = [];
  let cursor = 0;
  for (const key of AI_HIGHLIGHT_ORDER) {
    const phrase = highlights[key];
    const index = text.indexOf(phrase, cursor);
    if (index === -1) continue;
    if (index > cursor) segments.push({ text: text.slice(cursor, index) });
    segments.push({ text: phrase, key });
    cursor = index + phrase.length;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Repetição do BlockTextReveal em si (não um efeito imitando ele): troca a `key` do componente, o
 * que força o React a desmontar e remontar a instância real fornecida por Rogério, disparando a
 * própria revelação de entrada dela de novo. `phase` diz qual dos dois estados renderizar: "reveal"
 * (o BlockTextReveal de verdade — SEM a prop `highlight`, então ele nunca desenha a caixa retangular
 * atrás de palavra nenhuma, só a revelação de linha em si) enquanto a revelação roda, e "rest" (o
 * parágrafo estático com a marca-texto do Hero) depois que ela termina. Só duas fases — nunca uma
 * terceira. `key` e `phase` moram no MESMO estado e mudam juntos, num único setState dentro do
 * próprio timeout que fecha o ciclo — não há reset manual separado fora de um timeout (evita a
 * leitura/escrita de ref durante a renderização, que essa versão do eslint recusa).
 *
 * Sair da tela cancela os dois cronômetros pendentes (sem remontar nem trocar de fase longe da
 * vista); o efeito depende de `visible`, então voltar rearma os dois cronômetros inteiros a partir
 * desse instante — o texto permanece exatamente como estava (nunca some nem pisca) e, no pior caso,
 * a leitura em "rest" só fica parada um pouco mais que os ~10s antes do próximo reinício.
 */
function useAiImpactReplay(enabled: boolean, ref: RefObject<HTMLDivElement | null>) {
  const [cycle, setCycle] = useState<{ key: number; phase: "reveal" | "rest" }>({ key: 0, phase: "reveal" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)), {
      threshold: 0.35,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, ref]);

  useEffect(() => {
    if (!enabled || !visible) return;
    const toRest = window.setTimeout(() => setCycle((current) => ({ ...current, phase: "rest" })), AI_REVEAL_MS);
    const toNext = window.setTimeout(
      () => setCycle((current) => ({ key: current.key + 1, phase: "reveal" })),
      AI_REVEAL_MS + AI_HOLD_MS,
    );
    return () => {
      window.clearTimeout(toRest);
      window.clearTimeout(toNext);
    };
  }, [enabled, visible, cycle.key]);

  return cycle;
}

/**
 * Revelar restrito: o bloco sobe e ganha opacidade uma vez, quando entra na tela — a mesma técnica
 * do Showcase de projeto (ShowcaseReveal), reimplementada aqui para a seção Sobre não depender de um
 * componente de outra superfície aprovada. Em link direto (#about), acima da dobra ou em
 * prefers-reduced-motion, o estado final já é o estado inicial: sem JavaScript, tudo aparece.
 */
function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.dataset.reveal = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.dataset.reveal = "shown";
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Sobre: quem é Rogério, o raciocínio por trás dos projetos do portfólio, como tecnologia, design e
 * produto se encontram no processo dele, e a base profissional por trás da x7rG ENTERPRISE. Não é um
 * currículo: sem tabela de formação, sem cartões de habilidade, sem linha do tempo. A tese que abre a
 * seção já existia (saiu do hero antes de esta seção ter conteúdo); o resto é editorial e contínuo.
 */
export function AboutSection({ dict }: { dict: Dictionary }) {
  const { about, nav } = dict;
  const { identity, process, ai, foundation, aiImpact } = about;
  const reducedMotion = usePrefersReducedMotion();
  const aiImpactRef = useRef<HTMLDivElement>(null);
  const aiImpactCycle = useAiImpactReplay(!reducedMotion, aiImpactRef);
  const aiImpactSegments = splitAiImpact(aiImpact.text, aiImpact.highlights);

  return (
    <section id="about" className={styles.section} aria-labelledby="about-title" data-slug-section>
      <SectionLabel id="about-title" Icon={UserIcon}>
        {nav.about}
      </SectionLabel>

      <Reveal className={styles.reveal}>
        <p className={styles.thesis}>{about.thesis}</p>
      </Reveal>

      <Reveal className={styles.reveal}>
        <div className={styles.identity}>
          <h3 className={styles.identityName}>
            {identity.name}
            <span className={styles.identityRole}>{identity.role}</span>
          </h3>
          <p className={styles.identityBody}>{identity.intro}</p>
          <p className={styles.identityBody}>{identity.origins}</p>
        </div>
      </Reveal>

      <Reveal className={styles.reveal}>
        <div className={styles.process}>
          <h3 className={styles.processTitle}>{process.title}</h3>
          <p className={styles.processLead}>{process.lead}</p>
          <ol className={styles.processSteps}>
            {process.steps.map((step, index) => (
              <li key={step} className={styles.processStep} style={{ "--i": index } as CSSProperties}>
                <span className={styles.processIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.processWord}>{step}</span>
                <span className={styles.processArrow} aria-hidden="true">
                  →
                </span>
              </li>
            ))}
          </ol>
          <p className={styles.processNote}>{process.note}</p>
        </div>
      </Reveal>

      <Reveal className={styles.reveal}>
        <p className={styles.ai}>{ai.body}</p>
      </Reveal>

      <Reveal className={styles.reveal}>
        <div className={styles.foundation}>
          <p className={styles.foundationLead}>{foundation.lead}</p>
          <ul className={styles.foundationList}>
            {foundation.items.map((item) => (
              <li key={item.area} className={styles.foundationItem}>
                <span className={styles.foundationArea}>{item.area}</span>
                {item.place && <span className={styles.foundationPlace}>{item.place}</span>}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal className={styles.reveal}>
        <div className={styles.aiImpact} ref={aiImpactRef}>
          <span className={styles.aiQuote} aria-hidden="true">
            “
          </span>
          {reducedMotion || aiImpactCycle.phase === "rest" ? (
            <p className={styles.aiImpactStatic}>
              {aiImpactSegments.map((segment, index) =>
                segment.key ? (
                  <span
                    key={index}
                    className={AI_HIGHLIGHT_TONE[segment.key] === "a" ? styles.aiImpactMarkA : styles.aiImpactMarkB}
                  >
                    {segment.text}
                  </span>
                ) : (
                  segment.text
                ),
              )}
            </p>
          ) : (
            <BlockTextReveal
              key={aiImpactCycle.key}
              text={aiImpact.text}
              font={{
                fontSize: "clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)",
                fontWeight: 400,
                lineHeight: 1.6,
                letterSpacing: "normal",
              }}
              align="left"
              textColor="var(--ink-2)"
              blockColor="var(--hl-1)"
              revealType="lines"
              direction="left"
              rounded={0}
              speed={40}
              highlight={[]}
            />
          )}
        </div>
      </Reveal>

      <Reveal className={styles.reveal}>
        <p className={styles.closing}>{about.closing}</p>
      </Reveal>
    </section>
  );
}
