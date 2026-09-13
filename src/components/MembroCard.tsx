import Image from "next/image";

import { urlFor } from "@/sanity/image";
import type { MembroBateria } from "@/sanity/types";

export function MembroCard({ membro }: { membro: MembroBateria }) {
  const imagemUrl = membro.foto?.asset
    ? urlFor(membro.foto).width(400).height(400).fit("crop").url()
    : null;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-paper-muted ring-4 ring-accent sm:h-32 sm:w-32">
        {imagemUrl ? (
          <Image
            src={imagemUrl}
            alt={membro.foto.alt ?? membro.nomeApelido}
            fill
            sizes="128px"
            className="object-cover"
          />
        ) : (
          <span className="font-display text-2xl text-brand/40">
            {membro.nomeApelido.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-base font-semibold text-ink">
        {membro.nomeApelido}
      </p>
      <p className="text-sm text-brand">{membro.funcao}</p>
    </div>
  );
}
