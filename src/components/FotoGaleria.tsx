"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { urlFor } from "@/sanity/image";
import type { Foto } from "@/sanity/types";

import { ImagemEnquadrada } from "./ImagemEnquadrada";

function legendaDa(foto: Foto): string {
  return foto.imagem?.alt ?? foto.legenda ?? "Foto do bloco";
}

function Ampliada({
  fotos,
  indice,
  aoFechar,
  aoNavegar,
}: {
  fotos: Foto[];
  indice: number;
  aoFechar: () => void;
  aoNavegar: (novoIndice: number) => void;
}) {
  const botaoFecharRef = useRef<HTMLButtonElement>(null);
  const foto = fotos[indice];
  const total = fotos.length;

  const irPara = useCallback(
    (destino: number) => aoNavegar((destino + total) % total),
    [aoNavegar, total],
  );

  useEffect(() => {
    botaoFecharRef.current?.focus();
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") aoFechar();
      if (evento.key === "ArrowRight") irPara(indice + 1);
      if (evento.key === "ArrowLeft") irPara(indice - 1);
    };
    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.body.style.overflow = overflowOriginal;
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aoFechar, irPara, indice]);

  const url = urlFor(foto.imagem).width(1800).fit("max").url();

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/90 p-4"
      onClick={aoFechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Foto ampliada: ${legendaDa(foto)}`}
        onClick={(evento) => evento.stopPropagation()}
        className="flex w-full max-w-5xl flex-col items-center gap-3"
      >
        <div className="flex w-full items-center justify-between gap-4">
          <p className="text-sm text-paper/80">
            {indice + 1} de {total}
          </p>
          <button
            ref={botaoFecharRef}
            type="button"
            onClick={aoFechar}
            aria-label="Fechar foto"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-paper transition hover:bg-paper/25"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="relative h-[72vh] w-full">
          <Image
            src={url}
            alt={legendaDa(foto)}
            fill
            sizes="90vw"
            priority
            className="object-contain"
          />
        </div>

        {foto.legenda && (
          <p className="max-w-prose text-center text-sm text-paper/90">
            {foto.legenda}
          </p>
        )}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(evento) => {
              evento.stopPropagation();
              irPara(indice - 1);
            }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/10 text-2xl text-paper transition hover:bg-paper/25 sm:left-6"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            onClick={(evento) => {
              evento.stopPropagation();
              irPara(indice + 1);
            }}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/10 text-2xl text-paper transition hover:bg-paper/25 sm:right-6"
          >
            <span aria-hidden="true">›</span>
          </button>
        </>
      )}
    </div>
  );
}

export function FotoGaleria({
  fotos,
  classeGrade,
}: {
  fotos: Foto[];
  classeGrade: string;
}) {
  const [ampliada, setAmpliada] = useState<number | null>(null);

  const comImagem = fotos.filter((foto) => foto.imagem?.asset);
  if (comImagem.length === 0) return null;

  return (
    <>
      <div className={classeGrade}>
        {comImagem.map((foto, indice) => (
          <button
            key={foto._id}
            type="button"
            onClick={() => setAmpliada(indice)}
            aria-haspopup="dialog"
            className="group relative aspect-square overflow-hidden rounded-xl bg-paper-muted"
          >
            <ImagemEnquadrada
              imagem={foto.imagem}
              alt={legendaDa(foto)}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              largura={700}
              classeDaImagem="transition duration-300 group-hover:scale-105"
            />
            {foto.legenda && (
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/80 to-transparent px-3 py-2 text-left text-xs text-paper opacity-0 transition group-hover:opacity-100">
                {foto.legenda}
              </span>
            )}
          </button>
        ))}
      </div>

      {ampliada !== null && (
        <Ampliada
          fotos={comImagem}
          indice={ampliada}
          aoFechar={() => setAmpliada(null)}
          aoNavegar={setAmpliada}
        />
      )}
    </>
  );
}
