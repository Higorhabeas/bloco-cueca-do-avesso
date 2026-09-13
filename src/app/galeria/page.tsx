import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FotoThumb } from "@/components/FotoThumb";
import { urlFor } from "@/sanity/image";
import { getEventos, getFotos, getVideos } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Galeria",
  description: "Fotos e vídeos das apresentações do Cueca do Avesso.",
};

export default async function GaleriaPage({
  searchParams,
}: PageProps<"/galeria">) {
  const params = await searchParams;
  const eventoFiltro =
    typeof params.evento === "string" ? params.evento : undefined;

  const [eventos, fotos, videos] = await Promise.all([
    getEventos(),
    getFotos(eventoFiltro),
    getVideos(),
  ]);

  const videosFiltrados = eventoFiltro
    ? videos.filter((video) => video.evento?.slug === eventoFiltro)
    : videos;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Galeria
      </h1>

      {eventos.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/galeria"
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              !eventoFiltro
                ? "bg-brand text-paper"
                : "bg-paper-muted text-body-text hover:bg-brand/10"
            }`}
          >
            Todos
          </Link>
          {eventos.map((evento) => (
            <Link
              key={evento._id}
              href={`/galeria?evento=${evento.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                eventoFiltro === evento.slug
                  ? "bg-brand text-paper"
                  : "bg-paper-muted text-body-text hover:bg-brand/10"
              }`}
            >
              {evento.titulo}
            </Link>
          ))}
        </div>
      )}

      <section className="mt-8">
        {fotos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {fotos.map((foto) => (
              <FotoThumb key={foto._id} foto={foto} />
            ))}
          </div>
        ) : (
          <p className="text-body-text-muted">Nenhuma foto por aqui ainda.</p>
        )}
      </section>

      {videosFiltrados.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Vídeos
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videosFiltrados.map((video) => {
              const capaUrl = video.capa
                ? urlFor(video.capa).width(640).height(360).fit("crop").url()
                : null;
              return (
                <a
                  key={video._id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
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
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
