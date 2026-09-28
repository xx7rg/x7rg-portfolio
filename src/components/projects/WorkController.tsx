"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MediaViewerProvider } from "@/components/media-viewer/MediaViewer";
import { projects, type ProjectSlug } from "@/content/projects";
import { HISTORY_EVENT } from "@/lib/project-hash";
import type { Dictionary } from "@/i18n/types";

/*
 * O estado de "qual projeto está aberto". A URL é a fonte da verdade: a âncora de qualquer um dos nove
 * projetos (#neon-blockfall, #aquacontrol, #login-the-moon...) abre o projeto; qualquer outra âncora (ou
 * nenhuma) é o índice. Estudos de caso e apresentações compactas usam o mesmo mecanismo.
 *
 * Só UM caso completo fica aberto por vez. Abrir outro fecha o anterior na hora (sem animação, para
 * a página não pular) e mantém o bloco clicado parado na tela, depois o alinha ao topo com uma
 * rolagem suave. Fechar restaura a prévia no mesmo lugar.
 *
 * Histórico: abrir a partir do índice cria UMA entrada (pushState); trocar de projeto só a
 * substitui (replaceState), então nenhuma interação vira spam. Fechar volta uma entrada quando ela
 * foi criada aqui (Fechar = Voltar); numa entrada vinda de um link direto, só troca a âncora para
 * #projects. O Voltar/Avançar do navegador reabre e fecha os projetos sem recarregar.
 */

type Phase = "open" | "closed";
type Align = { slug: ProjectSlug; anchorTop: number | null; scroll: "smooth" | "instant" | "ifNeeded" | null };

export type OpenState = {
  slug: ProjectSlug | null;
  /** O projeto que abre aparece já aberto (link direto, Voltar), sem a transição. */
  openInstant: boolean;
  /** O projeto que fecha some na hora (troca de projeto, Voltar), sem a transição. */
  closeInstant: boolean;
  seq: number;
};

type Work = {
  state: OpenState;
  open: (slug: ProjectSlug) => void;
  close: () => void;
  /** Chamado por cada bloco quando termina de abrir ou de fechar; cuida de foco e rolagem. */
  settled: (slug: ProjectSlug, phase: Phase) => void;
};

const WorkContext = createContext<Work | null>(null);

export function useWork(): Work {
  const value = useContext(WorkContext);
  if (!value) throw new Error("Projeto usado fora do WorkController.");
  return value;
}

const slugs: readonly string[] = projects.map((project) => project.slug);

function slugFromHash(hash: string): ProjectSlug | null {
  let value = hash.replace(/^#/, "");
  try {
    value = decodeURIComponent(value);
  } catch {
    /* âncora malformada: trata como índice */
  }
  return slugs.includes(value) ? (value as ProjectSlug) : null;
}

/** pushState/replaceState não disparam eventos: quem depende da URL (o seletor de idioma) escuta este aviso. */
const announceHistory = () => window.dispatchEvent(new Event(HISTORY_EVENT));

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Leva o topo do bloco à parte de cima da tela. `ifNeeded` só rola se ele estiver fora da faixa útil. */
function alignBlock(slug: ProjectSlug, mode: "smooth" | "instant" | "ifNeeded") {
  const element = document.getElementById(slug);
  if (!element) return;
  if (mode === "ifNeeded") {
    const top = element.getBoundingClientRect().top;
    if (top >= 0 && top < window.innerHeight * 0.55) return;
  }
  element.scrollIntoView({ block: "start", behavior: mode === "smooth" && !reducedMotion() ? "smooth" : "instant" });
}

type WorkControllerProps = {
  viewer: Dictionary["viewer"];
  children: ReactNode;
};

export function WorkController({ viewer, children }: WorkControllerProps) {
  // Renderização inicial idêntica no servidor e no cliente: tudo fechado. O link direto abre depois.
  const [state, setState] = useState<OpenState>({ slug: null, openInstant: true, closeInstant: true, seq: 0 });
  const current = useRef<ProjectSlug | null>(null);
  const plan = useRef<Align | null>(null);
  const awaiting = useRef<{ slug: ProjectSlug; phase: Phase } | null>(null);

  const apply = useCallback(
    (
      slug: ProjectSlug | null,
      options: { openInstant: boolean; closeInstant: boolean; align: Align | null },
    ) => {
      current.current = slug;
      plan.current = options.align;
      setState((previous) => ({
        slug,
        openInstant: options.openInstant,
        closeInstant: options.closeInstant,
        seq: previous.seq + 1,
      }));
    },
    [],
  );

  const open = useCallback(
    (slug: ProjectSlug) => {
      const previous = current.current;
      if (previous === slug) {
        alignBlock(slug, "smooth");
        return;
      }
      const anchorTop = document.getElementById(slug)?.getBoundingClientRect().top ?? null;
      const hash = `#${slug}`;
      if (window.location.hash !== hash) {
        // Do índice: uma entrada nova. De outro projeto: a mesma entrada, com outra âncora.
        if (previous === null) window.history.pushState({ wk: 1 }, "", hash);
        else window.history.replaceState({ wk: window.history.state?.wk ?? 1 }, "", hash);
        announceHistory();
      }
      awaiting.current = { slug, phase: "open" };
      apply(slug, {
        openInstant: false,
        closeInstant: true,
        align: { slug, anchorTop, scroll: "smooth" },
      });
    },
    [apply],
  );

  const close = useCallback(() => {
    const previous = current.current;
    if (!previous) return;
    awaiting.current = { slug: previous, phase: "closed" };
    if (window.history.state?.wk) window.history.back();
    else {
      window.history.replaceState(null, "", "#projects");
      announceHistory();
    }
    apply(null, { openInstant: true, closeInstant: false, align: null });
  }, [apply]);

  // Voltar/Avançar, âncoras dentro da página e o link direto inicial: a URL manda no estado.
  useEffect(() => {
    const sync = () => {
      const target = slugFromHash(window.location.hash);
      if (target === current.current) return;
      const previous = current.current;
      awaiting.current = null;
      apply(target, {
        openInstant: true,
        closeInstant: true,
        align: target
          ? { slug: target, anchorTop: null, scroll: "instant" }
          : previous
            ? { slug: previous, anchorTop: null, scroll: "ifNeeded" }
            : null,
      });
    };
    sync();
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [apply]);

  // Depois que o DOM já refletiu o novo estado: mantém o bloco clicado parado e, se pedido, o alinha.
  useLayoutEffect(() => {
    const pending = plan.current;
    if (!pending) return;
    plan.current = null;
    const element = document.getElementById(pending.slug);
    if (!element) return;
    if (pending.anchorTop !== null) {
      const delta = element.getBoundingClientRect().top - pending.anchorTop;
      if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: "instant" });
    }
    // O layout já está atualizado (estamos depois do commit): não precisa esperar um quadro.
    if (pending.scroll) alignBlock(pending.slug, pending.scroll);
  }, [state.seq]);

  const settled = useCallback((slug: ProjectSlug, phase: Phase) => {
    const expected = awaiting.current;
    if (!expected || expected.slug !== slug || expected.phase !== phase) return;
    awaiting.current = null;
    if (phase === "open") {
      // Quem abriu pelo teclado ou pelo toque continua dentro do caso: o foco vai para ele.
      document.getElementById(`${slug}-case`)?.focus({ preventScroll: true });
      alignBlock(slug, "ifNeeded");
    } else {
      alignBlock(slug, "ifNeeded");
      document.getElementById(`${slug}-open`)?.focus({ preventScroll: true });
    }
  }, []);

  const value = useMemo<Work>(() => ({ state, open, close, settled }), [state, open, close, settled]);

  return (
    <WorkContext.Provider value={value}>
      <MediaViewerProvider labels={viewer}>{children}</MediaViewerProvider>
    </WorkContext.Provider>
  );
}
