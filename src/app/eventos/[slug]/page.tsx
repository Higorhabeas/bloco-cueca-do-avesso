import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FotoGaleria } from "@/components/FotoGaleria";
import { ImagemEnquadrada } from "@/components/ImagemEnquadrada";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { VideoGaleria } from "@/components/VideoGaleria";
import { formatarDataEvento } from "@/lib/datas";
import { getEventoBySlug, getFotos, getVideos } from "@/sanity/queries";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps<"/eventos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const evento = await getEventoBySlug(slug);
  if (!evento) return {};
  return { title: evento.titulo };
}

export default async function EventoPage({ params }: PageProps<"/eventos/[slug]">) {
  const { slug } = await params;
  const evento = await getEventoBySlug(slug);
  if (!evento) notFound();

  const [fotos, videos] = await Promise.all([getFotos(slug), getVideos(slug)]);

  return (
    <article>
      <div className="relative aspect-video w-full overflow-hidden bg-ink sm:aspect-21/9">
        {evento.imagemCapa?.asset && (
          <ImagemEnquadrada
            imagem={evento.imagemCapa}
            alt={evento.imagemCapa.alt ?? evento.titulo}
            sizes="100vw"
            largura={1600}
            prioridade
          />
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link href="/eventos" className="text-sm font-semibold text-brand">
          ← Todos os eventos
        </Link>

        <p className="mt-4 w-fit rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
          {formatarDataEvento(evento.data)}
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">
          {evento.titulo}
        </h1>
        {evento.local && (
          <p className="mt-1 text-lg text-body-text-muted">{evento.local}</p>
        )}

        {evento.descricao && (
          <div className="mt-6 max-w-prose">
            <PortableTextRenderer value={evento.descricao} />
          </div>
        )}
      </div>

      {fotos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Fotos deste evento
          </h2>
          <FotoGaleria
            fotos={fotos}
            classeGrade="grid grid-cols-2 gap-3 sm:grid-cols-4"
          />
        </section>
      )}

      {videos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Vídeos deste evento
          </h2>
          <VideoGaleria videos={videos} />
        </section>
      )}
    </article>
  );
}
