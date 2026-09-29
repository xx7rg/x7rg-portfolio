"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import rgOriginal from "@/assets/brand/history/rg-original.png";
import x7rgShield from "@/assets/brand/history/x7rg-shield.png";
import { ShieldIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/i18n/types";
import styles from "./brand-story.module.css";

/**
 * Revelar restrito: o bloco sobe e ganha opacidade uma vez, quando entra na tela — a mesma técnica
 * própria de AboutSection/ContactSection, reimplementada aqui para não acoplar esta seção a outra
 * superfície aprovada. Em link direto (#identity), acima da dobra ou em prefers-reduced-motion, o
 * estado final já é o inicial: sem JavaScript, tudo aparece.
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
 * A identidade: a narrativa editorial de rG a x7rG ENTERPRISE, contada com o material de marca
 * original de Rogério — não uma vitrine de logos nem um manual de marca. Cinco momentos, na ordem do
 * próprio relato dele: origem (a arte vermelha original, preservada como está), evolução (x, 7, rG),
 * ENTERPRISE (o que a palavra significa para ele) e identidade atual (o escudo, o momento visual mais
 * forte da seção, com os três conceitos públicos), e fechamento. Duas imagens reais entram — a logo
 * histórica e o escudo isolado — porque cada uma carrega algo que a outra não mostra; a composição
 * completa e a prancha de marca (também fornecidas) ficam como referência, sem entrar na página.
 */
export function BrandStorySection({ dict }: { dict: Dictionary }) {
  const { identity: copy } = dict;
  const { origin, evolution, enterprise, current, closing } = copy;

  return (
    <section id="identity" className={styles.section} aria-labelledby="identity-title" data-slug-section>
      <SectionLabel id="identity-title" Icon={ShieldIcon}>
        {copy.label}
      </SectionLabel>

      <Reveal className={styles.reveal}>
        <p className={styles.intro}>{copy.intro}</p>
      </Reveal>

      <Reveal className={styles.reveal}>
        <div className={styles.origin}>
          {/* onTouchStart vazio: sem isso, o Safari iOS não aplica :active a um <div> sem
              manipulador de toque próprio, e o zoom por toque (brand-story.module.css) não acende. */}
          <div className={styles.originPlate} onTouchStart={() => {}}>
            <Image className={styles.originImage} src={rgOriginal} alt={origin.markAlt} sizes="(max-width: 640px) 200px, 260px" quality={90} />
          </div>
          <div className={styles.originText}>
            <p className={styles.originBody}>{origin.lead}</p>
            <p className={styles.originBody}>{origin.inspiration}</p>
            <p className={styles.originTurn}>{origin.turn}</p>
            <p className={styles.originMark}>
              {origin.mark}
              <span className={styles.originMarkName}>{origin.markName}</span>
            </p>
            <p className={styles.originBody}>{origin.body}</p>
          </div>
        </div>
      </Reveal>

      <Reveal className={styles.reveal}>
        <div className={styles.evolution}>
          <p className={styles.evolutionLead}>{evolution.lead}</p>
          <ul className={styles.evolutionList}>
            <li className={styles.evolutionItem}>
              <span className={styles.evolutionSymbol}>{evolution.x.symbol}</span>
              <span className={styles.evolutionLabel}>{evolution.x.label}</span>
              <span className={styles.evolutionBody}>{evolution.x.body}</span>
            </li>
            <li className={styles.evolutionItem}>
              <span className={styles.evolutionSymbol} data-accent="true">
                {evolution.seven.symbol}
              </span>
              <span className={styles.evolutionLabel}>{evolution.seven.label}</span>
              <span className={styles.evolutionBody}>{evolution.seven.body}</span>
            </li>
            <li className={styles.evolutionItem}>
              <span className={styles.evolutionSymbol}>{evolution.rg.symbol}</span>
              <span className={styles.evolutionLabel}>{evolution.rg.label}</span>
              <span className={styles.evolutionBody}>{evolution.rg.body}</span>
            </li>
          </ul>
        </div>
      </Reveal>

      <Reveal className={styles.reveal}>
        <div className={styles.enterprise}>
          <p className={styles.enterpriseTurn}>{enterprise.turn}</p>
          <p className={styles.enterpriseWord}>{enterprise.word}</p>
          <p className={styles.enterpriseBody}>{enterprise.body}</p>
        </div>
      </Reveal>

      <Reveal className={styles.reveal}>
        <div className={styles.current}>
          <p className={styles.currentTurn}>{current.turn}</p>
          {/* onTouchStart vazio: mesmo motivo do originPlate acima. */}
          <div className={styles.shieldStage} onTouchStart={() => {}}>
            <Image className={styles.shieldImage} src={x7rgShield} alt={current.shieldAlt} sizes="(max-width: 640px) 220px, 340px" quality={90} priority={false} />
          </div>
          <p className={styles.currentLead}>{current.lead}</p>
          <p className={styles.values}>
            {current.values.map((value) => (
              <span key={value} className={styles.valueItem}>
                {value}.
              </span>
            ))}
          </p>
          <p className={styles.currentBody}>{current.body}</p>
        </div>
      </Reveal>

      <Reveal className={styles.reveal}>
        <p className={styles.closing}>
          <span>{closing.lines[0]}</span>
          <span>{closing.lines[1]}</span>
        </p>
        <p className={styles.closingName}>{closing.name}</p>
      </Reveal>
    </section>
  );
}
