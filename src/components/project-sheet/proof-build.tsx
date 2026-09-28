"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Dictionary, Note } from "@/i18n/types";
import styles from "./proof-build.module.css";

/*
 * Proof / Build: dois modos sobre o MESMO material. O estado vive num contexto porque
 * as três partes ficam em lugares diferentes da folha: os pinos sobre as capturas, os
 * botões abaixo delas e as anotações abaixo dos botões. As partes de servidor (as
 * imagens) entram como filhos e continuam sendo renderizadas no servidor.
 */

type Mode = "proof" | "build";
const modes = ["proof", "build"] as const;

type ProofBuildState = { mode: Mode; select: (next: Mode) => void };
const ProofBuildContext = createContext<ProofBuildState | null>(null);

function useProofBuild(): ProofBuildState {
  const value = useContext(ProofBuildContext);
  if (!value) throw new Error("Proof/Build: componente usado fora do ProofBuildProvider.");
  return value;
}

export function ProofBuildProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("proof");
  // A transição só toca depois da primeira escolha: a carga da página não anima.
  const [touched, setTouched] = useState(false);

  const select = (next: Mode) => {
    setTouched(true);
    setMode(next);
  };

  return (
    <ProofBuildContext.Provider value={{ mode, select }}>
      <div className={styles.root} data-touched={touched ? "" : undefined}>
        {children}
      </div>
    </ProofBuildContext.Provider>
  );
}

type ToggleProps = {
  /** Prefixo dos ids (o slug do projeto). */
  id: string;
  labels: Dictionary["sheet"]["proofBuild"];
};

/** Dois botões com aria-pressed. Cada um controla o painel de anotações do seu modo. */
export function ProofBuildToggle({ id, labels }: ToggleProps) {
  const { mode, select } = useProofBuild();

  return (
    <div className={styles.control} role="group" aria-label={labels.group}>
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          className={styles.toggle}
          aria-pressed={mode === m}
          aria-controls={`${id}-panel-${m}`}
          onClick={() => select(m)}
        >
          {labels[m]}
        </button>
      ))}
    </div>
  );
}

type ScreenPinsProps = {
  /** Pinos desta captura: número da anotação e posição em % da própria captura. */
  pins: readonly { note: number; x: number; y: number }[];
};

/**
 * Pinos sobre UMA captura. Só aparecem no modo Proof e só em colunas largas; são
 * decoração posicional (aria-hidden): as anotações em texto são a fonte da informação.
 */
export function ScreenPins({ pins }: ScreenPinsProps) {
  const { mode } = useProofBuild();
  if (pins.length === 0) return null;

  return (
    <ol className={styles.pins} hidden={mode !== "proof"} aria-hidden="true" data-pins>
      {pins.map((pin) => (
        <li key={pin.note} className={styles.pin} style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
          {pin.note}
        </li>
      ))}
    </ol>
  );
}

type PanelsProps = {
  id: string;
  labels: Dictionary["sheet"]["proofBuild"];
  notes: Record<Mode, readonly Note[]>;
  /** Evidência opcional dentro de uma anotação do Proof (índice da anotação, base 0). */
  proofEvidence?: Readonly<Record<number, ReactNode>>;
};

/**
 * As três anotações do modo ativo, sempre visíveis em lista numerada. No Build não
 * há pinos: engenharia não aparece na tela, e um pino ali afirmaria o que a imagem
 * não prova. A legenda do modo diz isso.
 */
export function ProofBuildPanels({ id, labels, notes, proofEvidence }: PanelsProps) {
  const { mode } = useProofBuild();

  return (
    <>
      {modes.map((m) => (
        <div key={m} id={`${id}-panel-${m}`} className={styles.panel} hidden={mode !== m}>
          <p className={styles.caption}>{m === "proof" ? labels.proofCaption : labels.buildCaption}</p>
          <ol className={styles.notes} role="list">
            {notes[m].map((note, index) => (
              <li key={note.title} className={styles.note}>
                <div className={styles.noteHead}>
                  <span className={styles.num} aria-hidden="true">
                    {index + 1}
                  </span>
                  <p className={styles.noteTitle}>{note.title}</p>
                </div>
                <p className={styles.noteBody}>{note.body}</p>
                {m === "proof" && proofEvidence?.[index] ? (
                  <div className={styles.evidence}>{proofEvidence[index]}</div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </>
  );
}
