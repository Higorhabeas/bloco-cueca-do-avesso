import type { Foto } from "@/sanity/types";

import { ImagemEnquadrada } from "./ImagemEnquadrada";

export function FotoThumb({ foto }: { foto: Foto }) {
  if (!foto.imagem?.asset) return null;

  return (
    <figure className="group relative aspect-square overflow-hidden rounded-xl bg-paper-muted">
      <ImagemEnquadrada
        imagem={foto.imagem}
        alt={foto.imagem.alt ?? foto.legenda ?? "Foto do bloco"}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        largura={700}
        classeDaImagem="transition duration-300 group-hover:scale-105"
      />
      {foto.legenda && (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-3 py-2 text-xs text-paper opacity-0 transition group-hover:opacity-100">
          {foto.legenda}
        </figcaption>
      )}
    </figure>
  );
}
