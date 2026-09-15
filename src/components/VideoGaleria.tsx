"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { urlFor } from "@/sanity/image";
import type { Video } from "@/sanity/types";

function extrairIdYoutube(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const youtubeId = extrairIdYoutube(video.url);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflowOriginal;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-titulo"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-3xl overflow-hidden rounded-2xl bg-ink shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <h2
            id="video-modal-titulo"
            className="truncate font-display text-base font-semibold text-paper"
          >
            {video.titulo}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar vídeo"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper/10 text-paper transition hover:bg-paper/20"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {youtubeId ? (
          <div className="aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title={video.titulo}
              allow="accelerate; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-black/40 px-6 text-center text-paper">
            <p className="font-semibold">Não conseguimos exibir esse vídeo aqui.</p>
            <p className="text-sm text-paper/70">
              Abra no link original pra assistir.
            </p>
          </div>
        )}

        <div className="flex justify-end px-4 py-3">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-paper transition hover:bg-brand-dark"
          >
            {youtubeId ? "Abrir no YouTube" : "Abrir vídeo original"} ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export function VideoGaleria({ videos }: { videos: Video[] }) {
  const [videoAberto, setVideoAberto] = useState<Video | null>(null);

  if (videos.length === 0) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const capaUrl = video.capa
            ? urlFor(video.capa).width(640).height(360).fit("crop").url()
            : null;
          return (
            <button
              key={video._id}
              type="button"
              onClick={() => setVideoAberto(video)}
              aria-haspopup="dialog"
              className="group overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
            >
              <div className="relative aspect-video bg-ink">
                {capaUrl ? (
                  <Image
                    src={capaUrl}
                    alt={video.capa?.alt ?? video.titulo}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover opacity-90 transition group-hover:opacity-100"
                  />
                ) : null}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper/90 text-brand shadow">
                    ▶
                  </span>
                </span>
              </div>
              <div className="p-3">
                <p className="font-display text-sm font-semibold text-ink">
                  {video.titulo}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {videoAberto && (
        <VideoModal video={videoAberto} onClose={() => setVideoAberto(null)} />
      )}
    </>
  );
}
