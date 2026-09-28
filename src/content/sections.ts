/**
 * Âncoras da home. Os ids são neutros quanto ao idioma, então o seletor de
 * idioma consegue levar à mesma seção só trocando o prefixo (/pt#about, /en#about).
 */
export const homeSectionIds = ["projects", "about", "identity", "journey", "contact"] as const;
export type HomeSectionId = (typeof homeSectionIds)[number];
