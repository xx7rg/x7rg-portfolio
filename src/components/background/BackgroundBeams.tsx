"use client";

import { motion, useReducedMotion } from "motion/react";
import styles from "./background-beams.module.css";

/**
 * Camada atmosférica global, ÚNICA para o portfólio inteiro (Hero, Projetos, Sobre e Contato
 * passam por cima dela) — não um efeito por seção. Fixa na viewport, atrás de tudo, decorativa
 * (aria-hidden, sem pointer-events): nunca intercepta clique, seleção de texto, hover ou foco.
 *
 * O traçado (a família de curvas) NÃO se move: é sempre o mesmo desenho, quase invisível
 * (stroke-opacity ~0,05). O que se move é só o gradiente por cima de cada curva — um segmento
 * de luz ciano/violeta/roxo que percorre o traçado, com duração e atraso próprios por curva, dando
 * uma sensação assíncrona sem que a geometria em si ande pela tela.
 *
 * Nada de Math.random(): duração, atraso e curvatura de cada traçado vêm só do índice, por uma
 * conta fixa — o servidor e o cliente sempre calculam o mesmo valor, então não há divergência de
 * hidratação. `useReducedMotion` decide, só no cliente e depois da montagem, se o gradiente anima
 * ou fica parado num estado só; a regra global de prefers-reduced-motion (globals.css) cobre CSS,
 * não as animações do Motion, por isso a checagem explícita aqui.
 */

const BEAM_COUNT = 16;
const VIEW_W = 800;
const VIEW_H = 400;

/** Curva suave e determinística: só depende do índice, para ficar igual em toda montagem. */
function beamPath(index: number): string {
  const yStart = 20 + (index / (BEAM_COUNT - 1)) * (VIEW_H - 40);
  const direction = index % 2 === 0 ? 1 : -1;
  const bend = 46 + ((index * 13) % 70);
  const yMid = yStart + direction * bend;
  const yEnd = yStart - direction * bend * 0.4;
  return `M -60 ${yStart.toFixed(1)} C ${(VIEW_W * 0.32).toFixed(1)} ${yMid.toFixed(1)}, ${(VIEW_W * 0.68).toFixed(1)} ${yMid.toFixed(1)}, ${VIEW_W + 60} ${yEnd.toFixed(1)}`;
}

/** Duração (9–20s) e atraso (negativo: já em andamento) de cada feixe, só a partir do índice. */
function beamTiming(index: number): { duration: number; delay: number } {
  const duration = 9 + ((index * 7) % 12);
  const delay = -((index * 3.3) % duration);
  return { duration, delay };
}

const beams = Array.from({ length: BEAM_COUNT }, (_, index) => ({
  id: index,
  d: beamPath(index),
  ...beamTiming(index),
}));

export function BackgroundBeams() {
  const reduceMotion = useReducedMotion();

  return (
    <div className={styles.field} aria-hidden="true">
      <svg className={styles.beams} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" fill="none">
        {/* O campo inteiro, quase invisível: dá profundidade mesmo parado. */}
        <g className={styles.base}>
          {beams.map((beam) => (
            <path key={`base-${beam.id}`} d={beam.d} />
          ))}
        </g>

        {/* A mesma geometria, agora só com o gradiente que percorre cada curva por cima. */}
        {beams.map((beam) => (
          <path key={`beam-${beam.id}`} d={beam.d} stroke={`url(#beam-gradient-${beam.id})`} className={styles.beam} />
        ))}

        <defs>
          {beams.map((beam) =>
            reduceMotion ? (
              <linearGradient key={beam.id} id={`beam-gradient-${beam.id}`} x1="0%" x2="55%" y1="0%" y2="0%">
                <stop stopColor="#18CCFC" stopOpacity="0" />
                <stop offset="50%" stopColor="#6344F5" />
                <stop offset="100%" stopColor="#AE48FF" stopOpacity="0" />
              </linearGradient>
            ) : (
              <motion.linearGradient
                key={beam.id}
                id={`beam-gradient-${beam.id}`}
                gradientUnits="objectBoundingBox"
                initial={{ x1: "-20%", x2: "0%" }}
                animate={{ x1: ["-20%", "120%"], x2: ["0%", "150%"] }}
                transition={{
                  duration: beam.duration,
                  delay: beam.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <stop stopColor="#18CCFC" stopOpacity="0" />
                <stop offset="32.5%" stopColor="#6344F5" />
                <stop offset="100%" stopColor="#AE48FF" stopOpacity="0" />
              </motion.linearGradient>
            ),
          )}
        </defs>
      </svg>
    </div>
  );
}
