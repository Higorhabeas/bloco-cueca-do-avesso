import Link from "next/link";

import { formatarDataCurta } from "@/lib/datas";
import type { RecadoSummary } from "@/sanity/types";

import { ImagemEnquadrada } from "./ImagemEnquadrada";

export function RecadoCard({ recado }: { recado: RecadoSummary }) {
  return (
    <Link
      href={`/recados/${recado.slug}`}
      className="group flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md sm:flex-col sm:p-0 sm:pb-4"
    >
      {recado.imagem?.asset && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-paper-muted sm:h-40 sm:w-full sm:rounded-b-none sm:rounded-t-2xl">
          <ImagemEnquadrada
            imagem={recado.imagem}
            alt={recado.imagem.alt ?? recado.titulo}
            sizes="(min-width: 640px) 33vw, 80px"
            largura={640}
            classeDaImagem="transition duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col gap-1 sm:px-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-body-text-muted">
          {formatarDataCurta(recado.dataPublicacao)}
        </p>
        <h3 className="font-display text-base font-semibold text-ink">
          {recado.titulo}
        </h3>
      </div>
    </Link>
  );
}
