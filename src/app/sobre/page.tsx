import type { Metadata } from "next";
import Image from "next/image";

import { PortableTextRenderer } from "@/components/PortableTextRenderer";
import { urlFor } from "@/sanity/image";
import { getHistoriaDoBloco } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sobre",
  description: "A história do bloco de carnaval Cueca do Avesso.",
};

export default async function SobrePage() {
  const historia = await getHistoriaDoBloco();

  if (!historia) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Nossa História
        </h1>
        <p className="mt-4 text-body-text-muted">
          Em breve contamos toda a nossa história por aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        {historia.titulo}
      </h1>

      {historia.texto && (
        <div className="mt-6">
          <PortableTextRenderer value={historia.texto} />
        </div>
      )}

      {historia.fotosAntigas && historia.fotosAntigas.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">
            Linha do tempo
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {historia.fotosAntigas.map((foto, indice) => {
              const url = urlFor(foto).width(500).height(500).fit("crop").url();
              return (
                <figure key={indice} className="overflow-hidden rounded-xl">
                  <div className="relative aspect-square bg-paper-muted">
                    <Image
                      src={url}
                      alt={foto.alt ?? historia.titulo}
                      fill
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {foto.ano && (
                    <figcaption className="mt-1 text-center text-xs font-semibold text-body-text-muted">
                      {foto.ano}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
