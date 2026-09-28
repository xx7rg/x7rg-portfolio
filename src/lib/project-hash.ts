import { projects } from "@/content/projects";

/*
 * A âncora do projeto aberto (#aquacontrol...), lida da URL. O seletor de idioma usa isto para levar o
 * visitante ao MESMO projeto no outro idioma (/pt#neon-blockfall -> /en#neon-blockfall). pushState e
 * replaceState não disparam eventos, então quem muda a URL (WorkController) avisa por HISTORY_EVENT.
 */
export const HISTORY_EVENT = "x7rg:history";

const slugs: readonly string[] = projects.map((project) => project.slug);

export function subscribeProjectHash(notify: () => void): () => void {
  window.addEventListener("popstate", notify);
  window.addEventListener("hashchange", notify);
  window.addEventListener(HISTORY_EVENT, notify);
  return () => {
    window.removeEventListener("popstate", notify);
    window.removeEventListener("hashchange", notify);
    window.removeEventListener(HISTORY_EVENT, notify);
  };
}

/** "#aquacontrol" se um projeto está na URL; senão, "". */
export function getProjectHash(): string {
  const hash = window.location.hash;
  return slugs.includes(hash.slice(1)) ? hash : "";
}

export const getServerProjectHash = (): string => "";
