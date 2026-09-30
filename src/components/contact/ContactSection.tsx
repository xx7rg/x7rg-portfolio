"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import x7rgShield from "@/assets/brand/x7rg-shield-display.png";
import { ArrowUpRightIcon, GithubIcon, InstagramIcon, LinkedinIcon, SendIcon } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { contact } from "@/content/contact";
import type { Dictionary } from "@/i18n/types";
import styles from "./contact.module.css";

const socials = [
  { name: "GitHub", href: contact.github, Icon: GithubIcon },
  { name: "LinkedIn", href: contact.linkedin, Icon: LinkedinIcon },
  { name: "Instagram", href: contact.instagram, Icon: InstagramIcon },
] as const;

/**
 * Revelar restrito: o bloco sobe e ganha opacidade uma vez, quando entra na tela — a mesma
 * técnica de AboutSection (própria, sem depender de outra superfície aprovada). Em link direto
 * (#contact), acima da dobra ou em prefers-reduced-motion, o estado final já é o inicial.
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
 * Contato: o fechamento editorial do portfólio, não uma ficha de currículo nem um formulário.
 * Uma frase grande carrega a seção; o e-mail é a ação principal (endereço sempre visível, não só
 * atrás de um ícone); GitHub/LinkedIn/Instagram são secundários; a assinatura final fecha a
 * página. Sem formulário, sem dado inventado (telefone, endereço, horário) — só os quatro canais
 * já aprovados, vindos de content/contact.ts (o mesmo usado pelo painel do retrato).
 */
export function ContactSection({ dict }: { dict: Dictionary }) {
  const { contact: copy, nav, a11y } = dict;

  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title" data-slug-section>
      <SectionLabel id="contact-title" Icon={SendIcon}>
        {nav.contact}
      </SectionLabel>

      <Reveal className={styles.reveal}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <p className={styles.statement}>{copy.statement}</p>
        <p className={styles.lead}>{copy.lead}</p>
      </Reveal>

      <Reveal className={styles.reveal}>
        <a className={styles.email} href={`mailto:${contact.email}`}>
          <span className={styles.emailCta}>{copy.emailCta}</span>
          <span className={styles.emailAddress}>
            {contact.email}
            <ArrowUpRightIcon aria-hidden="true" />
          </span>
        </a>
      </Reveal>

      <Reveal className={styles.reveal}>
        <ul className={styles.social} aria-label={a11y.socialNav}>
          {socials.map(({ name, href, Icon }) => (
            <li key={name}>
              <a
                className={styles.socialLink}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name}, ${a11y.newTab}`}
              >
                <Icon aria-hidden="true" />
                <span>{name}</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className={styles.reveal}>
        <div className={styles.closing}>
          <Image className={styles.closingShield} src={x7rgShield} alt="" sizes="40px" quality={90} />
          <p className={styles.closingText}>
            <span className={styles.closingName}>{copy.closing.name}</span>
            <span className={styles.closingRole}>{copy.closing.role}</span>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
