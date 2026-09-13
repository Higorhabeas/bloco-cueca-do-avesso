import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FotoThumb } from "@/components/FotoThumb";
import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { formatarDataEvento } from "@/lib/datas";
import { urlFor } from "@/sanity/image";
import { getEventoBySlug, getFotos } from "@/sanity/queries";

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

  const fotos = await getFotos(slug);
  const imagemUrl = evento.imagemCapa
    ? urlFor(evento.imagemCapa).width(1600).height(900).fit("crop").url()
    : null;

  return (
    <article>
      <div className="relative aspect-video w-full bg-paper-muted sm:aspect-21/9">
        {imagemUrl && (
          <Image
            src={imagemUrl}
            alt={evento.imagemCapa?.alt ?? evento.titulo}
            fill
            priority
            sizes="100vw"
            className="object-cover"
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
          <div className="mt-6">
            <PortableTextRenderer value={evento.descricao} />
          </div>
        )}
      </div>

      {fotos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Fotos deste evento
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {fotos.map((foto) => (
              <FotoThumb key={foto._id} foto={foto} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
