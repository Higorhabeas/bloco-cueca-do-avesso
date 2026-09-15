import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { formatarDataEvento } from "@/lib/datas";
import { urlFor } from "@/sanity/image";
import { getRecadoBySlug } from "@/sanity/queries";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps<"/recados/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const recado = await getRecadoBySlug(slug);
  if (!recado) return {};
  return { title: recado.titulo };
}

export default async function RecadoPage({ params }: PageProps<"/recados/[slug]">) {
  const { slug } = await params;
  const recado = await getRecadoBySlug(slug);
  if (!recado) notFound();

  const imagemUrl = recado.imagem
    ? urlFor(recado.imagem).width(1200).height(675).fit("crop").url()
    : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/recados" className="text-sm font-semibold text-brand">
        ← Todos os recados
      </Link>

      <p className="mt-4 text-sm font-semibold text-body-text-muted">
        {formatarDataEvento(recado.dataPublicacao)}
      </p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink sm:text-4xl">
        {recado.titulo}
      </h1>

      {imagemUrl && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-paper-muted">
          <Image
            src={imagemUrl}
            alt={recado.imagem?.alt ?? recado.titulo}
            fill
            sizes="768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-6 max-w-prose">
        <PortableTextRenderer value={recado.texto} />
      </div>

      {recado.eventoRelacionado && (
        <Link
          href={`/eventos/${recado.eventoRelacionado.slug}`}
          className="mt-6 inline-block rounded-full border-2 border-brand px-5 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-paper"
        >
          Ver evento relacionado: {recado.eventoRelacionado.titulo}
        </Link>
      )}
    </article>
  );
}
