"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { formatarDataEvento } from "@/lib/datas";
import { urlFor } from "@/sanity/image";
import type { EventoSummary } from "@/sanity/types";

export function EventoHeroCarousel({ eventos }: { eventos: EventoSummary[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  const irPara = useCallback((indice: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[indice] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
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

  if (eventos.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {eventos.map((evento) => {
          const imagemUrl = evento.imagemCapa
            ? urlFor(evento.imagemCapa).width(1600).height(900).fit("crop").url()
            : null;

          return (
            <div
              key={evento._id}
              className="relative aspect-video w-full shrink-0 snap-start sm:aspect-21/9"
            >
              {imagemUrl ? (
                <Image
                  src={imagemUrl}
                  alt={evento.imagemCapa?.alt ?? evento.titulo}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
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
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          {eventos.map((evento, indice) => (
            <button
              key={evento._id}
              type="button"
              onClick={() => irPara(indice)}
              aria-label={`Ir para o evento ${indice + 1}`}
              aria-current={indice === indiceAtivo}
              className={`h-2.5 w-2.5 rounded-full transition ${
                indice === indiceAtivo ? "bg-accent" : "bg-paper/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
