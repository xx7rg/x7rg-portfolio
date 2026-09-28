"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ShowcaseRevealProps = {
  className?: string;
  children: ReactNode;
};

/**
 * Revelar restrito da composição: as telas sobem e a luz do fundo acende uma vez,
 * quando a composição entra na tela. Só acontece se ela ainda estiver abaixo da dobra
 * e se o visitante não pediu menos movimento; em link direto (#neon-blockfall) ou em
 * reduced-motion o estado final já é o estado inicial. Sem JavaScript, tudo aparece.
 */
export function ShowcaseReveal({ className, children }: ShowcaseRevealProps) {
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
