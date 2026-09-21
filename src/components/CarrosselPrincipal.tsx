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
import type { SlideDoCarrossel } from "@/lib/patrocinadores";

import { ImagemEnquadrada } from "./ImagemEnquadrada";
import { LogoPatrocinador } from "./LogoPatrocinador";

const INTERVALO_AUTOPLAY_MS = 3000;

export function CarrosselPrincipal({ slides }: { slides: SlideDoCarrossel[] }) {
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
      setIndiceAtivo(Math.round(track.scrollLeft / slideWidth));
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const autoplayAtivo =
    slides.length > 1 && !pausadoManual && !pausadoInteracao;

  useEffect(() => {
    if (!autoplayAtivo) return;

    const temporizador = setTimeout(() => {
      irPara(indiceAtivo + 1, slides.length);
    }, INTERVALO_AUTOPLAY_MS);

    return () => clearTimeout(temporizador);
  }, [autoplayAtivo, indiceAtivo, slides.length, irPara]);

  if (slides.length === 0) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      irPara(indiceAtivo + 1, slides.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      irPara(indiceAtivo - 1, slides.length);
    }
  };

  const rotuloDoSlide = (slide: SlideDoCarrossel) =>
    slide.tipo === "evento" ? slide.evento.titulo : slide.patrocinador.nome;

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
        aria-label="Eventos em destaque e patrocinadores"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide) => (
          <div
            key={slide.chave}
            className="relative aspect-video w-full shrink-0 snap-start overflow-hidden bg-ink sm:aspect-14/3"
          >
            {slide.tipo === "evento" ? (
              <>
                {slide.evento.imagemCapa?.asset ? (
                  <ImagemEnquadrada
                    imagem={slide.evento.imagemCapa}
                    alt={slide.evento.imagemCapa.alt ?? slide.evento.titulo}
                    sizes="100vw"
                    largura={1600}
                    prioridade
                  />
                ) : (
                  <div className="h-full w-full bg-linear-to-br from-brand to-brand-dark" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-4 sm:px-6 sm:py-6">
                  <p className="w-fit rounded-full bg-accent px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-ink">
                    {formatarDataEvento(slide.evento.data)}
                  </p>
                  <h2 className="font-display text-xl font-bold text-paper drop-shadow sm:text-3xl">
                    {slide.evento.titulo}
                  </h2>
                  {slide.evento.local && (
                    <p className="text-sm text-paper/90 sm:text-base">
                      {slide.evento.local}
                    </p>
                  )}
                  <Link
                    href={`/eventos/${slide.evento.slug}`}
                    className="mt-1 w-fit rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-paper transition hover:bg-brand-dark"
                  >
                    Ver evento
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="h-full w-full bg-linear-to-br from-brand-dark via-topo to-ink" />
                {/* Logo à direita para não ficar atrás do texto, que fica embaixo à
                    esquerda. No desktop, afastada o suficiente para a seta não encostar. */}
                <div className="absolute inset-y-0 right-4 flex items-center sm:right-20">
                  <div className="w-36 sm:w-56">
                    <LogoPatrocinador
                      patrocinador={slide.patrocinador}
                      alturaDaCaixa="h-20 sm:h-28"
                    />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-4 sm:px-6 sm:py-6">
                  <p className="w-fit rounded-full bg-accent px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-ink">
                    Patrocinador Master
                  </p>
                  <h2 className="max-w-[55%] font-display text-xl font-bold text-paper drop-shadow sm:text-3xl">
                    {slide.patrocinador.nome}
                  </h2>
                  <Link
                    href="/parceiros"
                    className="mt-1 w-fit rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-paper transition hover:bg-brand-dark"
                  >
                    Nossos parceiros
                  </Link>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => irPara(indiceAtivo - 1, slides.length)}
            aria-label="Anterior"
            className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-paper transition hover:bg-ink/70 sm:left-4 sm:flex"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            onClick={() => irPara(indiceAtivo + 1, slides.length)}
            aria-label="Próximo"
            className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-paper transition hover:bg-ink/70 sm:right-4 sm:flex"
          >
            <span aria-hidden="true">›</span>
          </button>

          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {slides.map((slide, indice) => (
              <button
                key={slide.chave}
                type="button"
                onClick={() => irPara(indice, slides.length)}
                aria-label={`Ir para ${rotuloDoSlide(slide)}`}
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
                  ? "Retomar troca automática"
                  : "Pausar troca automática"
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
