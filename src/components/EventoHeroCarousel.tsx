"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { formatarDataEvento } from "@/lib/datas";
import type { EventoSummary } from "@/sanity/types";

import { ImagemEnquadrada } from "./ImagemEnquadrada";

const INTERVALO_AUTOPLAY_MS = 3000;

export function EventoHeroCarousel({ eventos }: { eventos: EventoSummary[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const [pausadoManual, setPausadoManual] = useState(false);
  const [pausadoInteracao, setPausadoInteracao] = useState(false);

  const irPara = useCallback((indice: number, total: number) => {
    const track = trackRef.current;
    if (!track) return;

    const indiceCircular = (indice + total) % total;
    const prefereMenosMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // scrollTo na própria faixa: scrollIntoView rolaria a página junto e a
    // jogaria de volta ao topo a cada troca automática.
    track.scrollTo({
      left: indiceCircular * track.clientWidth,
      behavior: prefereMenosMovimento ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const slideWidth = track.clientWidth;
      const indice = Math.round(track.scrollLeft / slideWidth);
      setIndiceAtivo(indice);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const autoplayAtivo =
    eventos.length > 1 && !pausadoManual && !pausadoInteracao;

  useEffect(() => {
    if (!autoplayAtivo) return;

    const temporizador = setTimeout(() => {
      irPara(indiceAtivo + 1, eventos.length);
    }, INTERVALO_AUTOPLAY_MS);

    return () => clearTimeout(temporizador);
  }, [autoplayAtivo, indiceAtivo, eventos.length, irPara]);

  if (eventos.length === 0) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      irPara(indiceAtivo + 1, eventos.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      irPara(indiceAtivo - 1, eventos.length);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPausadoInteracao(true)}
      onMouseLeave={() => setPausadoInteracao(false)}
      onFocus={() => setPausadoInteracao(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPausadoInteracao(false);
        }
      }}
    >
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Eventos em destaque"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {eventos.map((evento) => {
          return (
            <div
              key={evento._id}
              className="relative aspect-video w-full shrink-0 snap-start overflow-hidden bg-ink sm:aspect-21/9"
            >
              {evento.imagemCapa?.asset ? (
                <ImagemEnquadrada
                  imagem={evento.imagemCapa}
                  alt={evento.imagemCapa.alt ?? evento.titulo}
                  sizes="100vw"
                  largura={1600}
                  prioridade
                />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-brand to-brand-dark" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:px-6 sm:py-10">
                <p className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                  {formatarDataEvento(evento.data)}
                </p>
                <h2 className="font-display text-2xl font-bold text-paper drop-shadow sm:text-4xl">
                  {evento.titulo}
                </h2>
                {evento.local && (
                  <p className="text-paper/90 sm:text-lg">{evento.local}</p>
                )}
                <Link
                  href={`/eventos/${evento.slug}`}
                  className="mt-2 w-fit rounded-full bg-brand px-5 py-2 text-sm font-semibold text-paper transition hover:bg-brand-dark"
                >
                  Ver evento
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {eventos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => irPara(indiceAtivo - 1, eventos.length)}
            aria-label="Evento anterior"
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-paper transition hover:bg-ink/70 sm:left-4"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            onClick={() => irPara(indiceAtivo + 1, eventos.length)}
            aria-label="Próximo evento"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-paper transition hover:bg-ink/70 sm:right-4"
          >
            <span aria-hidden="true">›</span>
          </button>

          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {eventos.map((evento, indice) => (
              <button
                key={evento._id}
                type="button"
                onClick={() => irPara(indice, eventos.length)}
                aria-label={`Ir para o evento ${indice + 1} de ${eventos.length}`}
                aria-current={indice === indiceAtivo}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  indice === indiceAtivo ? "bg-accent" : "bg-paper/50"
                }`}
              />
            ))}

            <button
              type="button"
              onClick={() => setPausadoManual((atual) => !atual)}
              aria-label={
                pausadoManual
                  ? "Retomar troca automática de eventos"
                  : "Pausar troca automática de eventos"
              }
              aria-pressed={pausadoManual}
              className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink/50 text-paper transition hover:bg-ink/70"
            >
              <span aria-hidden="true" className="text-xs">
                {pausadoManual ? "▶" : "⏸"}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
