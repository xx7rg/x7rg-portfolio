import { Playfair_Display } from "next/font/google";

/*
 * Playfair Display é a tipografia dos títulos do site da Bya (confirmada no CSS do site). Entra só
 * na folha e na prévia da Bya, em duas fontes variáveis (normal e itálico), para o wordmark e os
 * títulos de seção. O resto do portfólio segue a própria tipografia. `preload: false` não disputa
 * a primeira pintura. Fica num módulo próprio para a folha e a prévia compartilharem a MESMA
 * instância (uma só requisição de fonte).
 */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
});
