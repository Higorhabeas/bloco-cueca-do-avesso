import Image from "next/image";
import Link from "next/link";

import { formatarDataEvento } from "@/lib/datas";
import { urlFor } from "@/sanity/image";
import type { EventoSummary } from "@/sanity/types";

export function EventoCard({ evento }: { evento: EventoSummary }) {
  const imagemUrl = evento.imagemCapa
    ? urlFor(evento.imagemCapa).width(640).height(480).fit("crop").url()
    : null;

  return (
    <Link
      href={`/eventos/${evento.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-paper-muted">
        {imagemUrl ? (
          <Image
            src={imagemUrl}
            alt={evento.imagemCapa?.alt ?? evento.titulo}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-lg text-brand/40">
            Cueca do Avesso
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-sm font-semibold text-brand">
          {formatarDataEvento(evento.data)}
        </p>
        <h3 className="font-display text-lg font-semibold text-ink">
          {evento.titulo}
        </h3>
        {evento.local && (
          <p className="text-sm text-body-text-muted">{evento.local}</p>
        )}
      </div>
    </Link>
  );
}
