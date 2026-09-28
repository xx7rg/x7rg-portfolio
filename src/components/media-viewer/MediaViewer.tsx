"use client";

import Image, { type StaticImageData } from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon, ExpandIcon, ShrinkIcon } from "@/components/ui/icons";
import type { CaptionKey } from "@/content/media-captions";
import type { Crop } from "@/content/sheets/types";
import type { Dictionary } from "@/i18n/types";
import styles from "./media-viewer.module.css";

/*
 * Visualizador de mídia (lightbox) do portfólio. É um <dialog> nativo aberto com showModal():
 * o navegador dá o foco ao diálogo, torna o resto da página inerte e fecha com Esc. Por cima
 * disso o componente cuida do que o <dialog> não faz sozinho: a armadilha de foco (Tab e
 * Shift+Tab), o foco de volta ao item que abriu, as setas do teclado, o toque para trocar de
 * mídia e a alternância entre "ajustar à tela" e "tamanho real".
 *
 * As mídias de CONTEÚDO se registram pelo <ZoomMedia>. O grupo (uma folha de projeto) e a
 * ordem vêm do DOM: ao abrir, o visualizador lê os gatilhos do mesmo grupo na ordem em que
 * aparecem na página. Nada de alta resolução é baixado antes de o visualizador abrir: o
 * arquivo grande só é pedido quando a imagem entra no diálogo (e a vizinha, em seguida).
 */

export type ViewerItem = {
  id: CaptionKey;
  group: string;
  image: StaticImageData;
  /** Região da imagem que aparece no visualizador (por padrão, a imagem inteira). */
  crop?: Crop;
  alt: string;
  /** Fundo atrás de mídia com transparência (o logo), sem recolorir a mídia. */
  background?: string;
};

type Labels = Dictionary["viewer"];

type ViewerContext = {
  labels: Labels;
  register: (item: ViewerItem) => () => void;
  open: (id: CaptionKey, trigger: HTMLElement) => void;
};

const Context = createContext<ViewerContext | null>(null);

export function useMediaViewer(): ViewerContext {
  const value = useContext(Context);
  if (!value) throw new Error("ZoomMedia usado fora do MediaViewerProvider.");
  return value;
}

type Session = { ids: CaptionKey[]; index: number };

export function MediaViewerProvider({ labels, children }: { labels: Labels; children: ReactNode }) {
  const registry = useRef(new Map<CaptionKey, ViewerItem>());
  const triggerRef = useRef<HTMLElement | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const register = useCallback((item: ViewerItem) => {
    registry.current.set(item.id, item);
    return () => {
      if (registry.current.get(item.id) === item) registry.current.delete(item.id);
    };
  }, []);

  const open = useCallback((id: CaptionKey, trigger: HTMLElement) => {
    const item = registry.current.get(id);
    if (!item) return;
    // O grupo e a ordem são os do DOM: os gatilhos do mesmo projeto, de cima para baixo.
    const nodes = document.querySelectorAll<HTMLElement>(`[data-zoom-group="${CSS.escape(item.group)}"]`);
    const ids = Array.from(nodes)
      .map((node) => node.dataset.zoomId as CaptionKey)
      .filter((value, position, all) => registry.current.has(value) && all.indexOf(value) === position);
    triggerRef.current = trigger;
    setSession({ ids, index: Math.max(0, ids.indexOf(id)) });
  }, []);

  const getItem = useCallback((id: CaptionKey) => registry.current.get(id), []);

  const close = useCallback(() => {
    setSession(null);
    // O foco volta ao item que abriu o visualizador, sem rolar a página.
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const go = useCallback((delta: number) => {
    setSession((current) => {
      if (!current) return current;
      const total = current.ids.length;
      return { ...current, index: (current.index + delta + total) % total };
    });
  }, []);

  return (
    <Context.Provider value={{ labels, register, open }}>
      {children}
      <ViewerDialog
        session={session}
        labels={labels}
        getItem={getItem}
        onClose={close}
        onStep={go}
      />
    </Context.Provider>
  );
}

type ViewerDialogProps = {
  session: Session | null;
  labels: Labels;
  getItem: (id: CaptionKey) => ViewerItem | undefined;
  onClose: () => void;
  onStep: (delta: number) => void;
};

function ViewerDialog({ session, labels, getItem, onClose, onStep }: ViewerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = session !== null;
  const item = session ? getItem(session.ids[session.index]) : undefined;

  // O <dialog> abre e fecha conforme a sessão. O conteúdo só existe enquanto ela dura.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Pré-carrega as duas vizinhas: o "próxima" e o "anterior" não esperam a rede.
  const ids = session?.ids;
  const index = session?.index ?? 0;
  useEffect(() => {
    if (!ids || ids.length < 2) return;
    for (const delta of [-1, 1]) {
      const neighbour = getItem(ids[(index + delta + ids.length) % ids.length]);
      if (neighbour) new window.Image().src = neighbour.image.src;
    }
  }, [ids, index, getItem]);

  const total = ids?.length ?? 0;

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Tab") {
      // Armadilha de foco: o Tab dá a volta dentro do visualizador.
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled])"));
      if (controls.length === 0) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === event.currentTarget)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-label={labels.dialog}
      aria-describedby={item ? "media-viewer-caption" : undefined}
      onClose={onClose}
      onKeyDown={onKeyDown}
    >
      {session && item && (
        <ViewerBody
          item={item}
          index={session.index}
          total={total}
          labels={labels}
          onClose={onClose}
          onStep={onStep}
        />
      )}
    </dialog>
  );
}

type ViewerBodyProps = {
  item: ViewerItem;
  index: number;
  total: number;
  labels: Labels;
  onClose: () => void;
  onStep: (delta: number) => void;
};

/** O conteúdo do visualizador. O zoom vale para UMA mídia: ao trocar, volta ao "ajustado". Os botões não são recriados, então o foco fica onde está. */
function ViewerBody({ item, index, total, labels, onClose, onStep }: ViewerBodyProps) {
  const [zoomedId, setZoomedId] = useState<CaptionKey | null>(null);
  const zoomed = zoomedId === item.id;
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const justSwiped = useRef(false);
  const many = total > 1;

  const { image } = item;
  const crop = item.crop ?? { x: 0, y: 0, w: image.width, h: image.height };
  const factor = image.width / crop.w;
  const density = typeof window === "undefined" ? 1 : Math.max(1, window.devicePixelRatio || 1);
  const caption = labels.captions[item.id];

  // Setas trocam de mídia, exceto no tamanho real, onde elas rolam a imagem.
  useEffect(() => {
    if (zoomed) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (!many) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onStep(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onStep(1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomed, many, onStep]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" || zoomed || !many) return;
    swipe.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    // Só um arrasto horizontal claro troca de mídia; o resto é toque.
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      justSwiped.current = true;
      window.setTimeout(() => (justSwiped.current = false), 300);
      onStep(dx < 0 ? 1 : -1);
    }
  };

  const toggleZoom = () => {
    if (!justSwiped.current) setZoomedId(zoomed ? null : item.id);
  };

  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <span className={styles.count} aria-hidden={!many}>
          {many ? `${index + 1} ${labels.of} ${total}` : ""}
        </span>
        <div className={styles.tools}>
          <button type="button" className={styles.tool} onClick={toggleZoom} aria-label={zoomed ? labels.fit : labels.actualSize}>
            {zoomed ? <ShrinkIcon /> : <ExpandIcon />}
          </button>
          <button type="button" className={styles.tool} onClick={onClose} aria-label={labels.close}>
            <CloseIcon />
          </button>
        </div>
      </header>

      {many && (
        <button type="button" className={`${styles.step} ${styles.prev}`} onClick={() => onStep(-1)} aria-label={labels.previous}>
          <ChevronLeftIcon />
        </button>
      )}

      <div
        className={styles.stage}
        data-zoomed={zoomed ? "" : undefined}
        onClick={(event) => {
          // O fundo escuro (fora da imagem) fecha; no tamanho real, o clique é da imagem.
          if (event.target === event.currentTarget && !zoomed) onClose();
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div
          key={item.id}
          className={styles.frame}
          style={
            {
              "--r": `${crop.w} / ${crop.h}`,
              "--rn": crop.w / crop.h,
              "--nw": crop.w / density,
              background: item.background,
            } as CSSProperties
          }
          onClick={toggleZoom}
        >
          <Image
            src={image}
            alt={item.alt}
            unoptimized
            loading="eager"
            draggable={false}
            style={{
              position: "absolute",
              maxWidth: "none",
              height: "auto",
              width: `${factor * 100}%`,
              left: `${-(crop.x / crop.w) * 100}%`,
              top: `${-(crop.y / crop.h) * 100}%`,
            }}
          />
        </div>
      </div>

      {many && (
        <button type="button" className={`${styles.step} ${styles.next}`} onClick={() => onStep(1)} aria-label={labels.next}>
          <ChevronRightIcon />
        </button>
      )}

      <p id="media-viewer-caption" className={styles.caption} aria-live="polite">
        {caption}
      </p>
    </div>
  );
}
