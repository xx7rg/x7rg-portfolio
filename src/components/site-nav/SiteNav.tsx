"use client";

import { useMotionValue } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type SVGProps,
} from "react";
import NeonBorder from "@/components/effects/NeonBorder";
import {
  ArrowUpIcon,
  CloseIcon,
  FolderIcon,
  HomeIcon,
  MenuIcon,
  RouteIcon,
  SendIcon,
  ShieldIcon,
  UserIcon,
} from "@/components/ui/icons";
import { localeLabels, locales, pathForLocale, type Locale } from "@/i18n/config";
import { cx } from "@/lib/cx";
import { getProjectHash, getServerProjectHash, subscribeProjectHash } from "@/lib/project-hash";
import { Clock } from "./Clock";
import { DockIcon } from "./DockIcon";
import styles from "./site-nav.module.css";

export type NavId = "top" | "projects" | "about" | "identity" | "journey" | "contact";

const icons: Record<NavId, ComponentType<SVGProps<SVGSVGElement>>> = {
  top: HomeIcon,
  projects: FolderIcon,
  about: UserIcon,
  identity: ShieldIcon,
  journey: RouteIcon,
  contact: SendIcon,
};

type SiteNavProps = {
  lang: Locale;
  /** Tag BCP 47 para a data e a hora (pt-BR, en, es). */
  locale: string;
  nav: readonly { id: NavId; label: string }[];
  labels: {
    primaryNav: string;
    languageNav: string;
    menu: string;
    closeMenu: string;
    goTop: string;
  };
};

/*
 * NeonBorder (Originkit, fonte de Rogério em src/components/effects/NeonBorder.tsx): borda fina
 * iluminada, ouro do próprio sistema x7rG (não o verde padrão do componente), só nas três
 * superfícies flutuantes do lado direito — pílula de idioma, dock de 6 ícones, botão de voltar ao
 * topo — e só no desktop (1100px+), onde essas superfícies existem nesta forma. `pointerEvents:
 * "none"` é o que deixa clique/hover/foco dos controles por baixo intactos; sem isso a borda (que
 * cobre a área toda, embora só pinte a moldura) roubaria o ponteiro dos ícones. As três instâncias
 * usam velocidades próximas mas DIFERENTES (não iguais, não aleatórias) só para não animarem em
 * lockstep mecânico umas com as outras.
 *
 * O valor precisa ser um hex/rgb literal, não var(--color-gold): o componente monta o gradiente
 * do brilho em JS (withAlpha, para variar a opacidade ao longo do arco) fazendo regex na própria
 * string da cor — uma custom property não bate em nenhum dos dois padrões e cai no cinza-preto
 * padrão dele (o efeito de "formiga preta" reportado por Rogério era exatamente isso: cor nenhuma
 * reconhecida, só o brilho quase-transparente do fallback). Valor pedido por Rogério: #CC9149.
 * thickness/borderSize/glow subiram (2→3 / 10→14 / 35→55) para o trecho aceso ler como uma
 * varredura de luz macia — maior e mais suave — em vez de um traço fino quase invisível.
 */
const NEON_GOLD = "#CC9149";

const neonOverlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
};

function NeonEdge({ speed, reducedMotion }: { speed: number; reducedMotion: boolean }) {
  return (
    <NeonBorder
      color={NEON_GOLD}
      rounded={100}
      thickness={3}
      borderSize={14}
      glow={55}
      movement="continuous"
      speed={reducedMotion ? 0 : speed}
      style={neonOverlayStyle}
    />
  );
}

type LanguagePillProps = {
  lang: Locale;
  pathname: string;
  /** "#about" quando há uma seção ativa, ou "#aquacontrol" com um projeto aberto, para o idioma novo abrir no mesmo lugar. */
  hash: string;
  label: string;
  onNavigate?: () => void;
  className?: string;
  /** Só a pílula fixa do desktop recebe o NeonBorder; a cópia dentro do menu do celular, não. */
  neon?: ReactNode;
};

function LanguagePill({ lang, pathname, hash, label, onNavigate, className, neon }: LanguagePillProps) {
  return (
    <nav className={cx(styles.lang, className)} aria-label={label}>
      {locales.map((code) => {
        const { code: shortCode, name } = localeLabels[code];

        if (code === lang) {
          return (
            <span key={code} className={cx(styles.langItem, styles.langCurrent)} lang={code} aria-current="true">
              {shortCode}
            </span>
          );
        }

        return (
          <Link
            key={code}
            href={`${pathForLocale(pathname, code)}${hash}`}
            className={styles.langItem}
            lang={code}
            hrefLang={code}
            aria-label={`${shortCode}, ${name}`}
            onClick={onNavigate}
          >
            {shortCode}
          </Link>
        );
      })}
      {neon}
    </nav>
  );
}

/**
 * Navegação e utilidades do site, sem barra de topo:
 *  - desktop: dock vertical em vidro (com rótulos ao passar o mouse ou focar) e uma
 *    cápsula fixa com data/hora e idioma;
 *  - celular: data/hora e idioma no topo, e botões flutuantes de menu e de voltar ao
 *    topo. O menu é um <dialog> nativo (foco preso, Esc fecha, foco volta ao botão).
 * A seção ativa vem de um IntersectionObserver sobre os elementos [data-slug-section].
 */
export function SiteNav({ lang, locale, nav, labels }: SiteNavProps) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeId, setActiveId] = useState<NavId>("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Ampliação por proximidade: só com mouse fino e sem prefers-reduced-motion (o mesmo par de
  // consultas do selo do hero). Falso por padrão (também no primeiro render do cliente, antes do
  // efeito rodar) para o servidor e o cliente concordarem.
  const [dockMagnify, setDockMagnify] = useState(false);
  const pointerY = useMotionValue(Infinity);
  // NeonBorder: só existe nesta forma no desktop (1100px+); velocidade cai a 0 (borda parada, sem
  // o loop de movimento) com prefers-reduced-motion. Independente do par fine-pointer/dockMagnify:
  // a borda deve aparecer com qualquer tipo de ponteiro, só não com telas estreitas.
  const [neonReady, setNeonReady] = useState({ desktop: false, reducedMotion: false });

  // Seção ativa: qual seção está cruzando o meio do viewport.
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-slug-section]");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id as NavId);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  // O botão de voltar ao topo do celular só aparece depois de rolar um pouco.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ampliação por proximidade só em mouse fino e sem prefers-reduced-motion; some sozinha se
  // qualquer uma das duas condições mudar (ex.: o visitante liga "reduzir movimento" no meio da
  // visita, ou pluga/desconecta um mouse num híbrido).
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setDockMagnify(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  // NeonBorder: reage a largura (mesmo ponto de corte do dock, 1100px) e a prefers-reduced-motion.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1100px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setNeonReady({ desktop: desktop.matches, reducedMotion: reduced.matches });
    update();
    desktop.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  // Se a tela crescer até o layout de desktop com o menu aberto, fecha o diálogo.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1100px)");
    const closeOnDesktop = () => {
      if (query.matches) dialogRef.current?.close();
    };
    query.addEventListener("change", closeOnDesktop);
    return () => query.removeEventListener("change", closeOnDesktop);
  }, []);

  // O <ul> escreve a própria posição do ponteiro; cada DockIcon só lê a distância até o seu
  // próprio centro. Sair da lista (não do dock inteiro: o botão de subir fica de fora de propósito)
  // devolve todos ao tamanho normal.
  const onDockPointerMove = (event: ReactPointerEvent<HTMLUListElement>) => {
    if (event.pointerType === "mouse") pointerY.set(event.clientY);
  };
  const onDockPointerLeave = () => pointerY.set(Infinity);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setMenuOpen(true);
  };
  const closeMenu = () => dialogRef.current?.close();
  const goTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  // Com um projeto aberto, o idioma novo abre o MESMO projeto (/pt#neon-blockfall -> /en#neon-blockfall).
  const projectHash = useSyncExternalStore(subscribeProjectHash, getProjectHash, getServerProjectHash);
  const hash = projectHash || (activeId === "top" ? "" : `#${activeId}`);

  return (
    <>
      <div className={styles.utility}>
        <Clock locale={locale} className={styles.clock} />
      </div>

      {/*
       * Idioma como utilidade GLOBAL independente do relógio (não mais filha de .utility):
       * mesmo visual do controle aprovado do desktop (vidro + NeonBorder dourado), só a
       * posição muda por viewport — ver .langMain em site-nav.module.css. Reprovado por
       * Rogério no iPhone físico quando (a) o visual virou uma pílula sólida/cinza diferente
       * do desktop (agora: mesmo fundo de vidro, mesma borda, mesmo NeonBorder sempre, não só
       * no desktop) e (b) ela cobria a imagem do escudo na seção Identidade (agora: logo
       * abaixo do relógio, fora do range horizontal das duas imagens da Identidade — ver
       * comentário de posição no CSS para a medição e para o único resíduo de sobreposição
       * que restou, com o ícone do GitHub do ProfilePanel).
       * Sem cópia dentro do <dialog> do menu: abrir/fechar o menu não duplica nem reposiciona
       * nada, este nó só fica coberto enquanto o <dialog> (modal, top layer nativo) está
       * aberto — do mesmo jeito que o botão de voltar ao topo já fica — e volta ao mesmo
       * lugar exato ao fechar.
       */}
      <LanguagePill
        lang={lang}
        pathname={pathname}
        hash={hash}
        label={labels.languageNav}
        className={styles.langMain}
        neon={<NeonEdge speed={3} reducedMotion={neonReady.reducedMotion} />}
      />

      <nav className={styles.dock} aria-label={labels.primaryNav}>
        <div className={styles.dockListFrame}>
          <ul
            className={cx(styles.dockList, "glass")}
            onPointerMove={onDockPointerMove}
            onPointerLeave={onDockPointerLeave}
          >
            {nav.map((item) => {
              const NavIcon = icons[item.id];
              return (
                <li key={item.id}>
                  <Link
                    href={`/${lang}#${item.id}`}
                    className={styles.dockLink}
                    data-tip={item.label}
                    aria-label={item.label}
                    aria-current={activeId === item.id ? "location" : undefined}
                  >
                    <DockIcon pointerY={pointerY} enabled={dockMagnify}>
                      <NavIcon />
                    </DockIcon>
                  </Link>
                </li>
              );
            })}
          </ul>
          {neonReady.desktop && <NeonEdge speed={3.6} reducedMotion={neonReady.reducedMotion} />}
        </div>
        <button
          type="button"
          className={cx(styles.round, styles.dockTop, "glass")}
          data-tip={labels.goTop}
          aria-label={labels.goTop}
          onClick={goTop}
        >
          <ArrowUpIcon />
          {neonReady.desktop && <NeonEdge speed={4.2} reducedMotion={neonReady.reducedMotion} />}
        </button>
      </nav>

      <div className={styles.floating} data-scrolled={scrolled ? "" : undefined}>
        <button
          type="button"
          className={cx(styles.round, "glass")}
          aria-label={labels.menu}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={openMenu}
        >
          <MenuIcon />
        </button>
        <button
          type="button"
          className={cx(styles.round, styles.floatTop, "glass")}
          aria-label={labels.goTop}
          tabIndex={scrolled ? 0 : -1}
          onClick={goTop}
        >
          <ArrowUpIcon />
        </button>
      </div>

      <dialog
        id="site-menu"
        ref={dialogRef}
        className={styles.dialog}
        aria-label={labels.menu}
        onClose={() => setMenuOpen(false)}
      >
        <div className={styles.dialogInner}>
          <div className={styles.dialogTop}>
            <button
              type="button"
              className={cx(styles.round, "glass")}
              aria-label={labels.closeMenu}
              onClick={closeMenu}
            >
              <CloseIcon />
            </button>
          </div>

          <nav className={styles.dialogNav} aria-label={labels.primaryNav}>
            {nav.map((item) => {
              const NavIcon = icons[item.id];
              return (
                <Link
                  key={item.id}
                  href={`/${lang}#${item.id}`}
                  className={styles.dialogLink}
                  aria-current={activeId === item.id ? "location" : undefined}
                  onClick={closeMenu}
                >
                  <NavIcon />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </dialog>
    </>
  );
}
