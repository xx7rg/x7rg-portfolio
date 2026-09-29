/**
 * O catálogo do portfólio: TRABALHOS, não uma lista de repositórios. Um único sistema de descoberta:
 * os nove projetos aparecem como faixas da mesma família e abrem DENTRO do portfólio. Repositórios de
 * apoio (política de privacidade, perfil, github.io, só implantação ou só documentação) não entram.
 * A ordem do array é a ordem na página; nenhum layout assume qual projeto vem primeiro.
 * Os nomes são nomes próprios e valem em qualquer idioma.
 *
 * `kind` diz o que abre por dentro:
 *  - "case":    um estudo de caso completo (uma folha em components/*-sheet), com mídia inspecionável;
 *  - "compact": a apresentação compacta (components/projects/CompactProject.tsx), alimentada por
 *               content/compact.ts. Promover um compacto a caso é: escrever a folha, mudar o `kind` e
 *               acrescentar um `case` em components/projects/registry.tsx. Nada mais muda.
 *
 * Só links PÚBLICOS entram aqui (`repo`, `live`), e só dentro do projeto aberto: a superfície de
 * descoberta nunca leva o visitante para fora. Links verificados no perfil público do GitHub (HTTP 200).
 * Repositórios privados, como o do AquaControl, nunca aparecem. Sem descrição inventada: o texto de cada
 * projeto vem do README ou da descrição pública do repositório e do que a captura mostra.
 */

export type ProjectKind = "case" | "compact";

export type ProjectEntry = {
  slug: string;
  name: string;
  kind: ProjectKind;
  /** Só quando o ano está documentado (os três estudos de caso). */
  year?: string;
  /** Repositório público no GitHub. */
  repo?: string;
  /** Site ou demonstração publicados. */
  live?: string;
};

const GITHUB = "https://github.com/xx7rg";

export const projects = [
  { slug: "neon-blockfall", name: "Neon Blockfall", kind: "case", year: "2026" },
  { slug: "aquacontrol", name: "AquaControl", kind: "case", year: "2026" },
  { slug: "feito-pela-bya", name: "Feito Pela Bya", kind: "case", year: "2026" },
  {
    slug: "adriano-reformas-vigo",
    name: "Adriano Reformas Vigo",
    kind: "case",
    // Sem `repo`: é um projeto de cliente e o código-fonte público expõe telefone/e-mail reais dele e uma
    // nota de dado legal pendente (FIX-016). O portfólio já evita mostrar isso nas próprias capturas; não faz
    // sentido oferecer uma saída direta para o mesmo dado por outro caminho. O site ao vivo continua linkado.
    // O repositório em si não foi tocado: segue público, só a saída promocional do portfólio foi removida.
    // O domínio próprio do cliente (o .es e o www redirecionam para ele); a Vercel é só a hospedagem por baixo.
    live: "https://adrianoreformas.com/",
  },
  {
    slug: "luciane-correa-servicios",
    name: "Luciane Correa Servicios",
    kind: "case",
    year: "2026",
    repo: `${GITHUB}/luciane-correa-servicios`,
    live: "https://luciane-correa-servicios.pages.dev/",
  },
  {
    slug: "login-the-moon",
    name: "Login The Moon",
    kind: "case",
    repo: `${GITHUB}/Login-The-Moon`,
    live: "https://xx7rg.github.io/Login-The-Moon/",
  },
  {
    slug: "light-login",
    name: "Light Login",
    kind: "case",
    repo: `${GITHUB}/Light-Login`,
    live: "https://xx7rg.github.io/Light-Login/",
  },
  {
    slug: "checkout",
    name: "Checkout",
    kind: "case",
    repo: `${GITHUB}/Checkout`,
    live: "https://xx7rg.github.io/Checkout/",
  },
  {
    slug: "recibo-digital",
    name: "Recibo Digital",
    kind: "case",
    repo: `${GITHUB}/Recibo-Digital`,
    // O Worker publicado (HTTP 200). O projeto não tem GitHub Pages (404), então esse endereço nunca entra.
    live: "https://recibo-digital.contato-rgsantos.workers.dev",
  },
  // `live: undefined` mantém o tipo de `live` como string opcional para a apresentação compacta enquanto este é o único compacto.
  { slug: "discord-camera-live", name: "DiscordCameraLive", kind: "compact", repo: `${GITHUB}/DiscordCameraLive`, live: undefined },
] as const satisfies readonly ProjectEntry[];

export type ProjectSlug = (typeof projects)[number]["slug"];
export type CaseSlug = Extract<(typeof projects)[number], { kind: "case" }>["slug"];
export type CompactSlug = Extract<(typeof projects)[number], { kind: "compact" }>["slug"];
