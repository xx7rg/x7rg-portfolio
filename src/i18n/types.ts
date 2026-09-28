import type { CaptionKey } from "@/content/media-captions";
import type { ProjectSlug } from "@/content/projects";
import type { ColorName, Pair, ShowcaseScreen, Triple } from "@/content/sheets/types";

/** Capturas do projeto que têm texto alternativo: as duas do destaque e os dois recortes de evidência. */
export type MediaKey = ShowcaseScreen | "scenarios" | "scoreboard";

/** Título curto e uma ou duas frases: uma decisão ou uma anotação de Proof/Build. */
export type Note = { title: string; body: string };

/**
 * Texto de uma folha de projeto. As tuplas seguem a ordem dos dados neutros em
 * src/content/sheets: mesma quantidade de decisões, pinos e anotações.
 */
export type ProjectSheetCopy = {
  /** Tipo simples do projeto, sem stack. */
  type: string;
  /** Estado honesto, como está hoje. */
  status: string;
  /** Crédito curto; a divulgação completa de IA fica para Sobre e para o estudo de caso. */
  credit: string;
  /** Frase do ponto de partida. */
  startingPoint: string;
  iconAlt: string;
  /** Texto alternativo de cada captura: descreve o que ela mostra, no idioma da página. */
  mediaAlt: Record<MediaKey, string>;
  /** Legenda das capturas: diz que são reais e em que idioma está a interface. */
  mediaCaption: string;
  decisions: Pair<Note>;
  proof: Triple<Note>;
  build: Triple<Note>;
};

/** Cinco momentos: o fluxo de visita de nove telas é contado em cinco blocos. */
export type Five<T> = readonly [T, T, T, T, T];

/** Um momento do fluxo de visita: nome, quais passos cobre, legenda e texto alternativo da tela. */
export type FlowBeat = { label: string; steps: string; caption: string; alt: string };

/**
 * Texto da folha do AquaControl. O produto vem primeiro, em capturas reais (dados fictícios);
 * o texto explica em segundo lugar. Cada captura selecionada tem texto alternativo próprio
 * no idioma da página: ele diz por que a tela importa, não descreve cada controle.
 */
export type AquaSheetCopy = {
  type: string;
  status: string;
  /** Por que o projeto existe, em uma ou duas frases. */
  story: string;
  hero: {
    /** Tela dominante: painel do técnico. */
    alt: string;
    /** Tela de apoio, sobreposta: lista de visitas. */
    altBack: string;
    /** Diz que são telas reais e que os dados são fictícios. */
    caption: string;
  };
  flow: {
    title: string;
    lead: string;
    /** Rótulo acessível do grupo de abas do fluxo. */
    tablistLabel: string;
    beats: Five<FlowBeat>;
    /** Diálogo de segurança sobreposto ao terceiro momento. */
    insetAlt: string;
  };
  roles: {
    title: string;
    items: Triple<{ role: string; line: string; alt: string }>;
    usage: string;
  };
  management: {
    title: string;
    items: Triple<{ label: string; alt: string }>;
    line: string;
  };
  decisions: { title: string; items: readonly [Note, Note, Note, Note] };
  build: { title: string; items: Triple<{ label: string; body: string }> };
  /** Contexto operacional curto (limite de armazenamento e temporada), sem virar manchete. */
  context: string;
  credit: string;
  disclaimer: string;
};

/** Quatro itens: os quatro sabores (e as quatro placas) da Feito Pela Bya. */
export type Four<T> = readonly [T, T, T, T];

/**
 * Texto da folha da Feito Pela Bya: um caso de identidade visual, contado por imagens. O texto
 * é curto de propósito. As visualizações de produto e o logo têm execução assistida por IA, e a
 * folha diz isso em voz baixa (nunca chama de fotografia).
 */
export type ByaSheetCopy = {
  type: string;
  status: string;
  /** Quem fez o quê, em uma ou duas frases. */
  story: string;
  logoAlt: string;
  detail: {
    title: string;
    lead: string;
    /** O laço, o B e o lettering, nesta ordem. */
    labels: Triple<string>;
  };
  language: {
    title: string;
    lead: string;
    /** Ameixa, ameixa suave, framboesa, creme e rosé claro, nesta ordem. */
    palette: readonly [string, string, string, string, string];
    /** Nome da tipografia mostrada no campo ameixa. */
    typeName: string;
  };
  flavors: {
    /** Título em duas partes: a segunda vai em itálico serifado, como no wordmark do site. */
    title: Pair<string>;
    lead: string;
    /** Frase do quarto quadro do mosaico. */
    cell: string;
    /** Divulgação de IA: discreta, mas clara. */
    ai: string;
    /** Chocolate, Maracujá, Ninho e Coco, nesta ordem (a ordem do mosaico). */
    items: Four<{ name: string; alt: string }>;
  };
  applications: {
    title: string;
    lead: string;
    /** Avental, cartão da marca e fita em B, nesta ordem. */
    items: Triple<string>;
    plaques: string;
  };
  digital: {
    title: string;
    lead: string;
    siteAlt: string;
    shareAlt: string;
    shareLabel: string;
    link: string;
  };
  credit: string;
  note: string;
};

/**
 * Texto da folha do Light Login: um experimento de interface em que a luz é o estado. A abertura compara o
 * MESMO quadro com a luz apagada e acesa; o cordão tem duas respostas (arrastar e alternar); e a
 * acessibilidade faz parte do conceito (o formulário sai da ordem de Tab com a luz apagada). Os nomes das
 * paradas do Tab são os do próprio app, em português, e não são traduzidos.
 */
export type LightSheetCopy = {
  type: string;
  status: string;
  statement: string;
  reveal: { group: string; range: string; off: string; on: string; altOff: string; altOn: string; caption: string };
  cord: {
    title: string;
    lead: string;
    videoLabel: string;
    play: string;
    pause: string;
    replay: string;
    videoNote: string;
    /** Arrastar e alternar, nesta ordem. */
    answers: Pair<{ label: string; body: string }>;
    geometry: { alt: string; pivot: string; rest: string; angle: string; length: string; flow: Four<{ label: string; body: string }> };
  };
  access: {
    title: string;
    lead: string;
    on: { label: string; stops: Five<string> };
    off: { label: string; stops: readonly [string]; gone: string };
    stopsNote: string;
    attrs: Four<{ code: string; body: string }>;
  };
  build: { title: string; items: Triple<{ label: string; body: string }> };
  limits: { title: string; body: string };
  credit: string;
  /** Rótulo do link para a experiência publicada. */
  demo: string;
};

/** Os trechos do desenho do som e da imagem da folha do Login The Moon (o que cada barra é). */
export type MoonSegment =
  | "visualDescent"
  | "visualLoading"
  | "engine"
  | "pressure"
  | "impact"
  | "settle"
  | "activation"
  | "movement"
  | "swell"
  | "chord";

/** De onde vem cada linha da matriz do DiscordCameraLive: do original, dos dois ou das mudanças de x7rG. */
export type DiscordOrigin = "upstream" | "both" | "x7rg";

/**
 * Texto da folha do DiscordCameraLive: um FORK do GoLiveBypass (criado por bezumiya, GPL-3.0-or-later), mantido por
 * x7rG. A folha separa o herdado do que x7rG modificou (levantado por diff contra a v1.1.5 do original), diz os riscos
 * (Termos de Serviço do Discord) sem sensacionalismo e nunca chama Rogério de criador do projeto. É COMPACTA de propósito.
 */
export type DiscordSheetCopy = {
  type: string;
  status: string;
  statement: string;
  shot: { alt: string; caption: string };
  base: { title: string; lead: string; points: Four<{ label: string; body: string }> };
  changes: {
    title: string;
    lead: string;
    origins: Record<DiscordOrigin, string>;
    rows: readonly { area: string; origin: DiscordOrigin; body: string }[];
  };
  inside: {
    title: string;
    lead: string;
    before: { label: string; steps: readonly string[] };
    after: { label: string; steps: readonly string[] };
    code: string;
    note: string;
  };
  risks: { title: string; items: Five<{ label: string; body: string }> };
  /** Projeto original, x7rG e IA/ativos, nesta ordem. */
  credit: Triple<{ label: string; body: string }>;
  /** Rótulo do link para o projeto original. */
  original: string;
};

/**
 * Texto da folha do Adriano Reformas Vigo: um site REAL de cliente, para um negócio de reformas em Vigo. O caso
 * descreve a estrutura e a implementação (conversão por WhatsApp e telefone, SEO local, galeria, imagens) e NÃO
 * afirma resultados: o site não mede tráfego, posicionamento nem conversão, e os números de demonstração que ele
 * já exibiu não entram. Nada aqui traz telefone, e-mail ou endereço do cliente. A interface capturada está em espanhol.
 */
export type AdrianoSheetCopy = {
  type: string;
  status: string;
  statement: string;
  opening: { alt: string; caption: string };
  client: { title: string; lead: string; points: Triple<{ label: string; body: string }> };
  experience: { title: string; lead: string; order: string; servicesAlt: string; stepsAlt: string; servicesCaption: string; stepsCaption: string };
  work: {
    title: string;
    lead: string;
    filters: string;
    bathAlt: string;
    beforeAlt: string;
    lightboxAlt: string;
    aboutAlt: string;
    bathCaption: string;
    beforeCaption: string;
    lightboxCaption: string;
    aboutCaption: string;
    privacy: string;
  };
  conversion: {
    title: string;
    lead: string;
    points: Four<{ label: string; body: string }>;
    formAlt: string;
    barAlt: string;
    messageTitle: string;
    /** As linhas da mensagem que o formulário monta (em espanhol, como o app envia). */
    messageLines: Four<string>;
    note: string;
  };
  seo: {
    title: string;
    lead: string;
    items: readonly [
      { label: string; body: string },
      { label: string; body: string },
      { label: string; body: string },
      { label: string; body: string },
      { label: string; body: string },
      { label: string; body: string },
    ];
    mapAlt: string;
    mapCaption: string;
    limits: string;
  };
  build: { title: string; items: Four<{ label: string; body: string }>; stack: string };
  responsive: { title: string; lead: string; homeAlt: string; galleryAlt: string; menuAlt: string; barAlt: string; caption: string };
  images: { title: string; lead: string; stats: Triple<{ value: string; label: string }>; body: string };
  limits: { title: string; body: string };
  credit: string;
  /** Rótulo do link para o site publicado. */
  demo: string;
};

/**
 * Texto da folha do Login The Moon: um login comum que vira a chegada a uma cena lunar. O primeiro toque põe a nave
 * para descer; o envio do formulário encena o carregamento e o sucesso. A interface capturada está em inglês (é a
 * do app); o texto do portfólio é traduzido. Nada aqui afirma autenticação real: qualquer e-mail com senha serve.
 */
export type MoonSheetCopy = {
  type: string;
  status: string;
  statement: string;
  stage: { alt: string; caption: string };
  sequence: {
    title: string;
    lead: string;
    videoLabel: string;
    play: string;
    pause: string;
    replay: string;
    videoNote: string;
    /** Primeiro toque, envio e chegada, nesta ordem. */
    beats: Triple<{ label: string; time: string; body: string }>;
  };
  descent: {
    title: string;
    lead: string;
    /** Quatro quadros, da nave alta ao assentamento. */
    frames: Four<{ time: string; alt: string }>;
    caption: string;
    layers: { title: string; body: string };
  };
  button: {
    title: string;
    lead: string;
    /** Parado, enviando e acesso, nesta ordem. */
    states: Triple<{ label: string; alt: string }>;
    /** Nota sobre a origem da silhueta da bicicleta (o nome do campo é histórico). */
    homage: string;
  };
  sound: {
    title: string;
    lead: string;
    /** Imagem e som, nesta ordem. */
    rows: Pair<string>;
    /** Primeiro toque e envio, nesta ordem. */
    lanes: Pair<string>;
    segments: Record<MoonSegment, string>;
    granted: string;
    seconds: string;
    samples: { label: string; descent: string; submit: string; play: string; pause: string; note: string };
  };
  build: { title: string; items: Five<{ label: string; body: string }>; stack: string };
  responsive: { title: string; lead: string; idleAlt: string; successAlt: string; caption: string };
  limits: { title: string; body: string };
  credit: string;
  /** Rótulo do link para a experiência publicada. */
  demo: string;
};

/**
 * Texto da folha do Checkout: um protótipo de interface. O cartão é o protagonista (ele lê o formulário e
 * vira no CVV); o pedido e o comprovante entram como o resto do mesmo estado. A interface capturada está
 * em português; os dados do cartão e do pedido são de demonstração.
 */
export type CheckoutSheetCopy = {
  type: string;
  status: string;
  statement: string;
  opening: { cardAlt: string; caption: string };
  live: {
    title: string;
    lead: string;
    videoLabel: string;
    play: string;
    pause: string;
    replay: string;
    videoNote: string;
    /** Número, nome, validade e CVV, nesta ordem. */
    fields: Four<{ label: string; body: string }>;
    rule: string;
    front: { alt: string };
    back: { alt: string };
    mobile: { alt: string };
  };
  order: {
    title: string;
    lead: string;
    ledger: Triple<{ label: string; value: string }>;
    summaryAlt: string;
  };
  flow: {
    title: string;
    lead: string;
    states: Triple<{ code: string; body: string }>;
    videoLabel: string;
    videoNote: string;
  };
  build: {
    title: string;
    items: Four<{ code: string; body: string }>;
    flip: string;
    stack: string;
  };
  limits: { title: string; body: string };
  credit: string;
  /** Rótulo do link para a demonstração publicada. */
  demo: string;
};

/** Um estado da impressora: o que ele é, como se chega a ele, o que a captura mostra e as cinco saídas que ele controla. */
export type ReciboStateCopy = {
  title: string;
  /** Como o app chega a este estado ("clique em Imprimir"). */
  trigger: string;
  alt: string;
  /** Papel, LED, neon, som e ações, na ordem de `states.outputLabels`. */
  outputs: Five<string>;
};

/**
 * Texto da folha do Recibo Digital. Uma experiência de interface, não um produto: o texto conta o ritual
 * (o papel, o som, a luz), mostra os quatro estados de uma máquina de estados só e diz com clareza o que o
 * projeto não é. A interface capturada está em espanhol; os dados do recibo são de demonstração.
 */
export type ReciboSheetCopy = {
  type: string;
  status: string;
  story: string;
  hero: { alt: string; altMobile: string; caption: string };
  states: {
    title: string;
    lead: string;
    outputLabels: Five<string>;
    items: Four<ReciboStateCopy>;
    loop: string;
    note: string;
  };
  moment: {
    title: string;
    lead: string;
    videoLabel: string;
    play: string;
    pause: string;
    replay: string;
    videoNote: string;
    timeline: Four<{ time: string; text: string }>;
    sound: { title: string; lead: string; printer: string; chime: string; stop: string; note: string };
  };
  build: {
    title: string;
    items: Triple<Note>;
    stackTitle: string;
    stack: Five<{ label: string; body: string }>;
    server: string;
  };
  limits: { title: string; body: string };
  credit: string;
  /** Rótulo do link para a experiência publicada. */
  experience: string;
};

/**
 * Contrato de todo o texto do site. Cada idioma implementa este tipo, então o
 * compilador acusa qualquer chave ausente em PT, EN ou ES.
 */
export type Dictionary = {
  meta: {
    title: string;
    description: string;
    siteName: string;
  };
  a11y: {
    skipToContent: string;
    primaryNav: string;
    languageNav: string;
    socialNav: string;
    /** Botão que abre a navegação no celular. */
    menu: string;
    closeMenu: string;
    goTop: string;
    /** Acrescentado ao nome de um link externo. */
    newTab: string;
  };
  nav: {
    home: string;
    projects: string;
    about: string;
    identity: string;
    journey: string;
    contact: string;
  };
  hero: {
    /** Palavra lida por leitores de tela no lugar do "×" do cargo. */
    roleJoin: string;
    /**
     * Manifesto em cinco partes: texto, destaque, texto, destaque, texto. Os dois
     * destaques recebem o marca-texto; juntas, as partes formam uma frase só.
     */
    headline: readonly [string, string, string, string, string];
  };
  /** Painel do retrato: saudação, apresentação, estado e ações. */
  profile: {
    portraitAlt: string;
    greeting: string;
    intro: string;
    /** Estado factual e atual de um projeto (não uma promessa de disponibilidade). */
    status: string;
    cta: string;
    projectsLink: string;
  };
  /** Título da seção de projetos da home (o rótulo curto da navegação está em `nav`). */
  work: {
    title: string;
    /** Abrir a apresentação do projeto DENTRO do portfólio (nunca um link externo). */
    open: string;
    close: string;
    backToIndex: string;
    /** Links externos: só aparecem dentro do projeto aberto, depois de o visitante entender o trabalho. */
    visitSite: string;
    viewSource: string;
    technologies: string;
    /** Categoria e uma frase de cada projeto. Vêm do README/descrição pública do repositório e do que a captura mostra. */
    items: Record<ProjectSlug, { category: string; statement: string }>;
  };
  /** Visualizador de mídia (lightbox): controles e legendas das mídias de conteúdo. */
  viewer: {
    dialog: string;
    open: string;
    close: string;
    previous: string;
    next: string;
    /** "3 de 14". */
    of: string;
    actualSize: string;
    fit: string;
    captions: Record<CaptionKey, string>;
  };
  /**
   * Seção Sobre: identidade, processo de trabalho, transparência sobre IA e
   * formação. `thesis` é o texto que já existia (saiu do hero, aprovado antes
   * desta seção existir); o resto é conteúdo novo desta fase.
   */
  about: {
    /** Abertura editorial da seção: o elemento dominante ao entrar nela. */
    thesis: string;
    identity: {
      name: string;
      /** Ex.: "Criador da x7rG ENTERPRISE", ao lado do nome. */
      role: string;
      intro: string;
      /** De onde vêm os projetos quando não partem de uma especificação formal. */
      origins: string;
    };
    process: {
      title: string;
      lead: string;
      /** Sequência tipográfica, não sete cartões: só a palavra de cada etapa. */
      steps: readonly [string, string, string, string, string, string, string];
      note: string;
    };
    /** Divulgação transparente e profissional do papel da IA no processo. */
    ai: {
      body: string;
    };
    foundation: {
      lead: string;
      /** `place` pode ficar vazio quando a linha é só uma formação técnica, sem instituição citada. */
      items: readonly { area: string; place: string }[];
    };
    /**
     * Declaração editorial sobre a IA como força transformadora (economia/sociedade em geral) —
     * diferente de `ai.body`, que é sobre o uso pessoal de IA por Rogério no próprio processo.
     * `text` é o parágrafo inteiro, como uma única frase corrida (entra direto no
     * BlockTextReveal fornecido por Rogério, que faz a revelação de entrada; o ciclo contínuo do
     * destaque entre as quatro frases é código nosso, por cima). `highlights` traz as quatro
     * frases que recebem o ciclo, exatamente como aparecem dentro de `text` (o componente casa
     * por palavra exata). Uma cor só, o ouro do próprio sistema (--accent) — não é por conceito.
     */
    aiImpact: {
      text: string;
      highlights: {
        ai: string;
        tools: string;
        force: string;
        solutions: string;
      };
    };
    closing: string;
  };
  /**
   * Seção "A identidade": a narrativa editorial de rG a x7rG ENTERPRISE, contada com o material de
   * marca original de Rogério — não uma vitrine de logos nem um manual de marca. Cinco momentos, nesta
   * ordem: origem (a arte vermelha original), evolução (x, 7, rG), ENTERPRISE (o que a palavra significa
   * para Rogério) e identidade atual (o escudo, o momento visual mais forte da seção), e fechamento.
   */
  identity: {
    /** Rótulo da seção, na pílula do título, como em Sobre e Contato. */
    label: string;
    /** Abertura editorial: a frase que anuncia a jornada da seção. */
    intro: string;
    origin: {
      lead: string;
      /** A única pessoa citada nominalmente entre as admiradas: contexto, não homenagem. */
      inspiration: string;
      turn: string;
      /** "rG", sem tradução. */
      mark: string;
      markName: string;
      markAlt: string;
      body: string;
    };
    evolution: {
      lead: string;
      x: { symbol: string; label: string; body: string };
      seven: { symbol: string; label: string; body: string };
      rg: { symbol: string; label: string; body: string };
    };
    enterprise: {
      turn: string;
      /** "ENTERPRISE", sem tradução. */
      word: string;
      body: string;
    };
    current: {
      turn: string;
      lead: string;
      /** Luta, Persistência, Lealdade, nesta ordem — os três conceitos públicos do escudo. */
      values: readonly [string, string, string];
      body: string;
      shieldAlt: string;
    };
    closing: {
      /** "A identidade evoluiu." / "A origem continua a mesma.", nesta ordem. */
      lines: readonly [string, string];
      name: string;
    };
  };
  /**
   * Seção Trajetória: um letreiro contínuo e discreto com logos de empresas que fizeram parte do
   * caminho profissional de Rogério — não uma lista de clientes, não uma linha do tempo de cargos e
   * datas. `logos` dá o texto alternativo de cada marca, na ordem em que aparecem na trilha; nomes
   * próprios (o texto que a própria marca exibe) não são traduzidos.
   */
  journey: {
    /** Rótulo da seção, na pílula do título, como em Sobre e Contato. */
    label: string;
    title: string;
    lead: string;
    /** Nome do grupo de logos, para quem usa leitor de tela (a trilha duplicada fica aria-hidden). */
    companiesLabel: string;
    /** Ordem da trilha: 20blogpqdt, Altera & Ocyan, Atento, BFE, Exército, GAECO, Nexa, MPPR, Odebrecht, Petrobras, Sonda, Spread, Foresea, EQS. */
    logos: {
      blogPqdt: string;
      alteraOcyan: string;
      atento: string;
      bfe: string;
      exercitoBrasileiro: string;
      gaeco: string;
      nexa: string;
      mppr: string;
      odebrecht: string;
      petrobras: string;
      sonda: string;
      spread: string;
      foresea: string;
      eqs: string;
    };
  };
  /**
   * Seção Contato: o fechamento editorial do portfólio, não um formulário nem uma
   * ficha de currículo. O endereço de e-mail e os links (GitHub/LinkedIn/Instagram)
   * vêm de content/contact.ts, não daqui — aqui só o texto.
   */
  contact: {
    /** Pequena marca acima da frase principal: "x7rG ENTERPRISE". */
    eyebrow: string;
    /** A frase que fecha o portfólio: o elemento dominante da seção. */
    statement: string;
    lead: string;
    /** Rótulo do link de e-mail; o endereço em si aparece ao lado, sempre visível. */
    emailCta: string;
    closing: { name: string; role: string };
  };
  /** Vocabulário comum a todas as folhas de projeto. */
  sheet: {
    labels: { type: string; year: string; status: string; credit: string };
    proofBuild: {
      /** Nome do grupo de botões. */
      group: string;
      /** Rótulos do botão. "Proof" e "Build" ficam em inglês nos três idiomas (ver a decisão no relatório). */
      proof: string;
      build: string;
      /** Uma linha que diz o que cada modo mostra. */
      proofCaption: string;
      buildCaption: string;
    };
    colorBarLabel: string;
    colors: Record<ColorName, string>;
    /** Texto ao lado da marca de desalinhamento numa decisão não concluída. */
    unfinished: string;
  };
  projects: {
    "neon-blockfall": ProjectSheetCopy;
    aquacontrol: AquaSheetCopy;
    "feito-pela-bya": ByaSheetCopy;
    "recibo-digital": ReciboSheetCopy;
    checkout: CheckoutSheetCopy;
    "light-login": LightSheetCopy;
    "login-the-moon": MoonSheetCopy;
    "adriano-reformas-vigo": AdrianoSheetCopy;
    "discord-camera-live": DiscordSheetCopy;
  };
};
