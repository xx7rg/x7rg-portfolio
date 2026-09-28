"use client";

import { useSyncExternalStore } from "react";

type ClockProps = {
  /** Tag BCP 47 do idioma da página (pt-BR, en, es). */
  locale: string;
  className?: string;
};

// O relógio muda a cada minuto; o snapshot é o índice do minuto, um número estável entre leituras.
const subscribe = (notify: () => void) => {
  const id = window.setInterval(notify, 15_000);
  return () => window.clearInterval(id);
};
const getMinute = () => Math.floor(Date.now() / 60_000);
// No servidor (e na hidratação) não há hora do visitante: 0 renderiza só o espaço reservado.
const getServerMinute = () => 0;

/**
 * Data e hora locais DO VISITANTE, no idioma da página. É um detalhe de utilidade,
 * não uma informação sobre o Rogério. Só aparece depois de hidratar, então nunca
 * diverge do HTML do servidor.
 */
export function Clock({ locale, className }: ClockProps) {
  const minute = useSyncExternalStore(subscribe, getMinute, getServerMinute);

  if (minute === 0) return <span className={className} aria-hidden="true" data-clock="pending" />;

  const now = new Date(minute * 60_000);
  const date = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short" }).format(now);
  const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(now);

  return (
    <time className={className} dateTime={now.toISOString()} data-clock="ready">
      <span>{date}</span>
      <span>{time}</span>
    </time>
  );
}
