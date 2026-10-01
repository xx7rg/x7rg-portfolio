/**
 * Chaves das legendas do visualizador de mídia. Cada mídia de CONTEÚDO (captura real, arte da
 * marca) que pode ser ampliada tem uma chave; o texto da legenda vive no dicionário
 * (`dict.viewer.captions`), nos três idiomas. Mídia decorativa não entra aqui.
 */
export const captionKeys = [
  // Neon Blockfall
  "neon.wide",
  "neon.portrait",
  "neon.scenarios",
  "neon.scoreboard",
  // AquaControl
  "aqua.hero.main",
  "aqua.hero.back",
  "aqua.flow.1",
  "aqua.flow.2",
  "aqua.flow.3",
  "aqua.flow.4",
  "aqua.flow.5",
  "aqua.flow.inset",
  "aqua.role.technician",
  "aqua.role.supervisor",
  "aqua.role.admin",
  "aqua.mgmt.assignments",
  "aqua.mgmt.absences",
  "aqua.mgmt.reports",
  // Projetos compactos
  "adriano.1",
  "moon.1",
  "moon.2",
  "moon.3",
  "discord.1",
  // Login The Moon (além de moon.1 e moon.3, herdados da apresentação compacta)
  "moon.descent",
  "moon.mobile.idle",
  "moon.mobile.success",
  // Adriano Reformas Vigo (além de adriano.1, herdado da apresentação compacta)
  "adriano.home",
  "adriano.services",
  "adriano.steps",
  "adriano.gallery",
  "adriano.before",
  "adriano.lightbox",
  "adriano.about",
  "adriano.map",
  "adriano.form",
  "adriano.mobile.home",
  "adriano.mobile.gallery",
  "adriano.mobile.menu",
  // Light Login
  "light.cord",
  // Checkout
  "checkout.front",
  "checkout.back",
  "checkout.summary",
  "checkout.mobile",
  // Recibo Digital
  "recibo.hero",
  "recibo.mobile",
  "recibo.idle",
  "recibo.printing",
  "recibo.ready",
  "recibo.torn",
  // Feito Pela Bya
  "bya.logo",
  "bya.chocolate",
  "bya.maracuja",
  "bya.ninho",
  "bya.coco",
  "bya.site",
  "bya.share",
  // Luciane Correa Servicios
  "luciane.hero",
  "luciane.about",
  "luciane.services",
  "luciane.packages",
  "luciane.process",
  "luciane.testimonials",
  "luciane.quote",
  "luciane.footer",
  "luciane.mobile.hero",
  "luciane.mobile.content",
  "luciane.mobile.menu",
  // Matteo
  "matteo.night",
  "matteo.day",
  "matteo.atmosphereDay",
  "matteo.atmosphereDusk",
  "matteo.atmosphereNight",
  "matteo.countdown",
  "matteo.story",
  "matteo.gallery",
  "matteo.confirmation",
  "matteo.directions",
  "matteo.gifts",
  "matteo.mobile.hero",
  "matteo.mobile.navigation",
  "matteo.mobile.functional",
  // Formação & Credenciais (fase E2.2): os dois diplomas são derivados SANITIZADOS (sem RG/CPF/data
  // de nascimento/assinaturas do original) — os certificados de curso são páginas planas do PDF
  // original (esses nunca continham dado sensível).
  "credential.fam",
  "credential.universo",
  "credential.cft",
  "credential.enapPowerBi1",
  "credential.enapPowerBi2",
  "credential.enapSei1",
  "credential.enapSei2",
  "credential.enapNr121",
  "credential.enapNr122",
  "credential.kasolutionLogica",
  "credential.fgvTi",
] as const;

export type CaptionKey = (typeof captionKeys)[number];
