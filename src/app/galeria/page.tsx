import type { Metadata } from "next";
import Link from "next/link";

import { FotoGaleria } from "@/components/FotoGaleria";
import { VideoGaleria } from "@/components/VideoGaleria";
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
    getVideos(eventoFiltro),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Galeria
      </h1>

      {eventos.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/galeria"
            aria-current={!eventoFiltro ? "true" : undefined}
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
              aria-current={eventoFiltro === evento.slug ? "true" : undefined}
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
          <FotoGaleria
            fotos={fotos}
            classeGrade="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          />
        ) : (
          <p className="text-body-text-muted">Nenhuma foto por aqui ainda.</p>
        )}
      </section>

      {videos.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Vídeos
          </h2>
          <VideoGaleria videos={videos} />
        </section>
      )}
    </div>
  );
}
