import { en } from "./dictionaries/en";
import { es } from "./dictionaries/es";
import { pt } from "./dictionaries/pt";
import type { Locale } from "./config";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = { pt, en, es };

/** Três idiomas fixos e pequenos: objetos síncronos bastam, sem carregamento dinâmico. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
