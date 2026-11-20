"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Patrocinador } from "@/sanity/types";

import { LogoPatrocinador } from "./LogoPatrocinador";

const INTERVALO_MS = 3000;
/** Largura de cada logo e o espaço entre elas, em pixels, para calcular quantas cabem. */
const LARGURA_ITEM = 104;
const ESPACO = 16;

export function FaixaPatrocinadores({ lista }: { lista: Patrocinador[] }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [cabemNaLinha, setCabemNaLinha] = useState(1);
  const [inicio, setInicio] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [pausadoManual, setPausadoManual] = useState(false);

  // Quantas logos cabem depende da largura da tela, então é medido e re-medido.
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;

    const medir = () => {
      const largura = area.clientWidth;
      const quantas = Math.floor(
        (largura + ESPACO) / (LARGURA_ITEM + ESPACO),
      );
      setCabemNaLinha(Math.max(1, quantas));
    };

    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(area);
    return () => observador.disconnect();
  }, []);

  // Só há fila andando quando não cabe todo mundo na linha de uma vez.
  const temFila = lista.length > cabemNaLinha;
  const rodando = temFila && !pausado && !pausadoManual;

  useEffect(() => {
    if (!rodando) return;

    const temporizador = setTimeout(() => {
      // Avança a fila pelo tamanho da janela; ao passar do fim, recomeça do início.
      setInicio((atual) => (atual + cabemNaLinha) % lista.length);
    }, INTERVALO_MS);

    return () => clearTimeout(temporizador);
  }, [rodando, inicio, cabemNaLinha, lista.length]);

  const visiveis = useMemo(() => {
    if (lista.length === 0) return [];
    const quantas = Math.min(cabemNaLinha, lista.length);
    return Array.from(
      { length: quantas },
      (_, posicao) => lista[(inicio + posicao) % lista.length],
    );
  }, [lista, inicio, cabemNaLinha]);

  if (lista.length === 0) return null;

  return (
    <div
      className="border-t border-white/10 px-4 py-4 sm:px-6"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) {
          setPausado(false);
        }
      }}
    >
      <div className="mb-3 flex items-center justify-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          Nossos parceiros
        </p>
        {/* Parar a fila não pode depender de mouse ou de teclado: quem navega
            de outro jeito também precisa de um jeito de segurar o movimento. */}
        {temFila && (
          <button
            type="button"
            onClick={() => setPausadoManual((atual) => !atual)}
            aria-label={
              pausadoManual
                ? "Retomar a troca dos parceiros"
                : "Pausar a troca dos parceiros"
            }
            aria-pressed={pausadoManual}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-paper/15 text-paper transition hover:bg-paper/30"
          >
            <span aria-hidden="true" className="text-[9px] leading-none">
              {pausadoManual ? "▶" : "⏸"}
            </span>
          </button>
        )}
      </div>

      <div
        ref={areaRef}
        className="mx-auto flex max-w-6xl items-center justify-center gap-4"
      >
        {visiveis.map((patrocinador) => (
          <div key={patrocinador._id} className="w-[104px] shrink-0">
            <LogoPatrocinador
              patrocinador={patrocinador}
              alturaDaCaixa="h-14"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
