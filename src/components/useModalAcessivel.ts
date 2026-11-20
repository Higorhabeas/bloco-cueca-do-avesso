"use client";

import { useEffect, useRef } from "react";

const FOCAVEIS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  // O player do YouTube entra na ordem de tabulação como qualquer outro
  // elemento; de fora, ele conta como um só.
  "iframe",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * O comportamento que todo modal precisa ter e que é fácil esquecer: trancar a
 * rolagem da página, fechar no Esc, levar o foco para dentro, prender o Tab
 * enquanto estiver aberto e devolver o foco a quem abriu, ao fechar.
 *
 * Devolve a ref para pendurar no elemento que delimita o modal.
 */
export function useModalAcessivel(aoFechar: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fecharRef = useRef(aoFechar);

  // Sem dependências: mantém a ref apontando para o fechar mais recente sem
  // obrigar o efeito de baixo a remontar e roubar o foco de novo.
  useEffect(() => {
    fecharRef.current = aoFechar;
  });

  useEffect(() => {
    const container = containerRef.current;
    // Quem estava com o foco antes: é para cá que ele volta ao fechar.
    const origem = document.activeElement as HTMLElement | null;

    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focaveis = () =>
      Array.from(container?.querySelectorAll<HTMLElement>(FOCAVEIS) ?? []);

    focaveis()[0]?.focus();

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        fecharRef.current();
        return;
      }
      if (evento.key !== "Tab") return;

      const lista = focaveis();
      if (lista.length === 0) return;

      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];
      const atual = document.activeElement;
      const foraDoModal = !container?.contains(atual);

      // Sem isto o Tab escapa do modal e passeia pela página atrás dele.
      if (evento.shiftKey && (atual === primeiro || foraDoModal)) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && (atual === ultimo || foraDoModal)) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.body.style.overflow = overflowOriginal;
      document.removeEventListener("keydown", aoTeclar);
      origem?.focus();
    };
  }, []);

  return containerRef;
}
