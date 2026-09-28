"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type StripFxProps = {
  slug: string;
  className?: string;
  style?: CSSProperties;
  labelledBy: string;
  children: ReactNode;
};

/*
 * A atenção da rolagem é UMA só. Com as faixas sobrepostas, a região de atenção (uma faixa estreita no meio
 * da tela) pode tocar duas ao mesmo tempo: fica ativa a que tem o centro mais perto do meio da tela.
 */
const attentive = new Set<HTMLElement>();

function settleActive() {
  const mid = window.innerHeight / 2;
  let best: HTMLElement | null = null;
  let bestDistance = Infinity;
  for (const strip of attentive) {
    const box = strip.getBoundingClientRect();
    const distance = Math.abs((box.top + box.bottom) / 2 - mid);
    if (distance < bestDistance) {
      best = strip;
      bestDistance = distance;
    }
  }
  for (const strip of attentive) strip.toggleAttribute("data-active", strip === best);
}

/*
 * O PONTEIRO. Com mouse, a faixa sob o ponteiro EXPANDE para baixo (o CSS faz a altura e a revelação a partir de
 * `data-hover`). Expandir muda o layout, e um layout que muda sob um ponteiro parado é a receita do vaivém, então
 * UM coordenador decide qual faixa está sob o ponteiro, em vez de cada faixa ouvir o próprio pointerenter:
 *  - INTENÇÃO: a troca só vale depois de um instante com o ponteiro parado na mesma faixa, então varrer a lista
 *    com o mouse não abre e fecha cada faixa no caminho;
 *  - ROLAGEM: durante a rolagem nada muda (a rolagem nunca é tocada nem ganha altura sob os dedos); ao acabar, o
 *    que está sob o ponteiro é reavaliado;
 *  - ASSENTAMENTO: depois de uma troca, reavalia uma vez quando a transição de altura termina, porque as faixas
 *    de baixo se moveram sob o ponteiro parado.
 * Só a faixa atual recebe o paralaxe. Toque e ponteiros que não são mouse fino não passam por aqui.
 */
type Entry = { el: HTMLElement; setHover: (on: boolean) => void; setParallax: (nx: number, ny: number) => void };

const entries = new Set<Entry>();
const INTENT_MS = 90;
const SCROLL_IDLE_MS = 260;
const SETTLE_MS = 560;

let pointer: { x: number; y: number } | null = null;
let current: Entry | null = null;
let scrolling = false;
let intentTimer = 0;
let scrollTimer = 0;
let settleTimer = 0;
let frame = 0;
let installed = false;
let reducedMotion = false;

function entryOf(x: number, y: number): Entry | null {
  const strip = document.elementFromPoint(x, y)?.closest("[data-strip]");
  if (!strip) return null;
  for (const entry of entries) if (entry.el === strip) return entry;
  return null;
}

/*
 * A faixa sob o ponteiro. O vão entre faixas (uns 10 px) não é de ninguém, e um ponteiro parado nele fecharia a faixa
 * expandida: as de baixo subiriam e o ponteiro cairia numa terceira. Por isso o vão pertence à faixa vizinha (se uma delas
 * é a atual, ela fica; senão, a de cima): o ponteiro só troca de faixa ao entrar de fato em outra.
 */
const GAP_REACH = [6, 12];

function entryUnder(): Entry | null {
  if (!pointer) return null;
  const direct = entryOf(pointer.x, pointer.y);
  if (direct) return direct;
  const near: Entry[] = [];
  for (const reach of GAP_REACH) {
    for (const dy of [-reach, reach]) {
      const entry = entryOf(pointer.x, pointer.y + dy);
      if (entry) near.push(entry);
    }
    if (near.length) break;
  }
  if (current && near.includes(current)) return current;
  return near[0] ?? null;
}

/** Quem foi visto sob o ponteiro na última amostra e ainda não foi confirmado. */
let candidate: Entry | null | undefined;

function later() {
  intentTimer = window.setTimeout(() => {
    intentTimer = 0;
    evaluate();
  }, INTENT_MS);
}

function evaluate() {
  if (scrolling) return;
  const target = entryUnder();
  if (target === current) {
    candidate = undefined;
    return;
  }
  // A troca só vale se a mesma faixa (ou a saída) for vista em duas amostras seguidas.
  if (target !== candidate) {
    candidate = target;
    window.clearTimeout(intentTimer);
    later();
    return;
  }
  candidate = undefined;
  current?.setHover(false);
  current?.setParallax(0, 0);
  target?.setHover(true);
  current = target;
  document.querySelector("[data-strip-list]")?.toggleAttribute("data-hovering", target !== null);
  window.clearTimeout(settleTimer);
  settleTimer = window.setTimeout(evaluate, SETTLE_MS);
}

/** Amostra o ponteiro no máximo a cada INTENT_MS, sem ficar presa enquanto o mouse se move. */
function schedule() {
  if (!intentTimer) later();
}

function paintParallax() {
  frame = 0;
  if (!pointer || !current || reducedMotion) return;
  const box = current.el.getBoundingClientRect();
  const nx = Math.max(-1, Math.min(1, ((pointer.x - box.left) / box.width) * 2 - 1));
  const ny = Math.max(-1, Math.min(1, ((pointer.y - box.top) / box.height) * 2 - 1));
  current.setParallax(nx, ny);
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType !== "mouse") return;
  pointer = { x: event.clientX, y: event.clientY };
  schedule();
  if (!frame) frame = requestAnimationFrame(paintParallax);
}

function onPointerOut(event: PointerEvent) {
  // O ponteiro saiu da janela.
  if (event.relatedTarget) return;
  pointer = null;
  schedule();
}

function onScroll() {
  scrolling = true;
  window.clearTimeout(scrollTimer);
  scrollTimer = window.setTimeout(() => {
    scrolling = false;
    candidate = undefined;
    evaluate();
  }, SCROLL_IDLE_MS);
}

/** Abrir um projeto esconde a faixa sem "pointerleave": quem abriu desfaz a expansão. */
function release() {
  current?.setHover(false);
  current?.setParallax(0, 0);
  current = null;
  candidate = undefined;
  document.querySelector("[data-strip-list]")?.removeAttribute("data-hovering");
}

function install() {
  if (installed) return;
  installed = true;
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerout", onPointerOut, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
}

function uninstall() {
  installed = false;
  document.removeEventListener("pointermove", onPointerMove);
  document.removeEventListener("pointerout", onPointerOut);
  window.removeEventListener("scroll", onScroll);
  window.clearTimeout(intentTimer);
  intentTimer = 0;
  window.clearTimeout(scrollTimer);
  window.clearTimeout(settleTimer);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

/**
 * A camada de interação de uma faixa de projeto. O conteúdo (imagens, texto, botão) é renderizado no
 * servidor e entra como `children`; aqui só há comportamento, e nada disso é necessário para usar a
 * faixa (teclado, toque e leitor de tela funcionam pelo botão dentro dela):
 *  - ATIVIDADE: um IntersectionObserver marca `data-active` na faixa que está na região de atenção
 *    (uma faixa estreita no meio da tela). É a atenção implícita da rolagem e só muda a cor e a imagem, nunca a
 *    altura: a rolagem nunca é tocada.
 *  - REVELAÇÃO: faixas abaixo da dobra na carga entram uma vez (opacidade e uns poucos pixels),
 *    quando se aproximam. Em link direto ou com movimento reduzido, já nascem no estado final.
 *  - PONTEIRO (só mouse): `data-hover` expande a faixa (ver o coordenador acima).
 */
export function StripFx({ slug, className, style, labelledBy, children }: StripFxProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Atividade: a faixa estreita no meio da tela (48% de cada lado ignorado) é a região de atenção; settleActive() garante uma só ativa.
    el.setAttribute("data-js", "");
    const attention = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) attentive.add(el);
        else {
          attentive.delete(el);
          el.removeAttribute("data-active");
        }
        settleActive();
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    attention.observe(el);

    // Revelação: só se ainda estiver abaixo da dobra, e uma única vez.
    let reveal: IntersectionObserver | null = null;
    if (!reducedMotion && el.getBoundingClientRect().top > window.innerHeight) {
      el.setAttribute("data-reveal", "armed");
      reveal = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          el.setAttribute("data-reveal", "shown");
          reveal?.disconnect();
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
      );
      reveal.observe(el);
    }

    // Ponteiro: só mouse fino.
    const entry: Entry = {
      el,
      setHover: (on) => el.toggleAttribute("data-hover", on),
      setParallax: (nx, ny) => {
        el.style.setProperty("--px", nx.toFixed(3));
        el.style.setProperty("--py", ny.toFixed(3));
      },
    };
    const host = el.parentElement ?? el;
    if (finePointer) {
      entries.add(entry);
      install();
      host.addEventListener("click", release);
    }

    return () => {
      attention.disconnect();
      attentive.delete(el);
      reveal?.disconnect();
      host.removeEventListener("click", release);
      if (entries.delete(entry)) {
        if (current === entry) release();
        if (entries.size === 0) uninstall();
      }
    };
  }, []);

  return (
    <article ref={ref} className={className} style={style} data-strip={slug} aria-labelledby={labelledBy}>
      {children}
    </article>
  );
}
