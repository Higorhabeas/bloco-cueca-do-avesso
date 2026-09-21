import Image from "next/image";

import { urlFor } from "@/sanity/image";
import type { Patrocinador } from "@/sanity/types";

/**
 * Logomarca do patrocinador com aviso de destino. O aviso aparece tanto no
 * passar do mouse quanto ao chegar pelo teclado, e o texto do link já diz
 * para onde leva, para quem usa leitor de tela.
 */
export function LogoPatrocinador({
  patrocinador,
  alturaDaCaixa = "h-20",
  larguraDaCaixa = "w-full",
}: {
  patrocinador: Patrocinador;
  alturaDaCaixa?: string;
  larguraDaCaixa?: string;
}) {
  const { nome, logo, site } = patrocinador;

  const miolo = logo?.asset ? (
    <Image
      src={urlFor(logo).width(400).fit("max").url()}
      alt={`Logomarca ${nome}`}
      fill
      sizes="200px"
      className="object-contain p-2"
    />
  ) : (
    <span className="flex h-full w-full items-center justify-center px-2 text-center text-xs font-semibold text-body-text-muted">
      {nome}
    </span>
  );

  const caixa = `relative ${alturaDaCaixa} ${larguraDaCaixa} rounded-xl bg-white ring-1 ring-black/5`;

  // Sem site cadastrado não há para onde ir: mostra a logo sem virar link.
  if (!site) {
    return (
      <div className={caixa} title={nome}>
        {miolo}
      </div>
    );
  }

  return (
    <a
      href={site}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`Visitar o site de ${nome} (abre em uma nova aba)`}
      className="group relative block focus:outline-none"
    >
      <span className={`${caixa} block transition group-hover:ring-brand group-focus-visible:ring-2 group-focus-visible:ring-brand`}>
        {miolo}
      </span>

      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max max-w-[14rem] -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-center text-xs font-medium text-paper opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        Clique para visitar o site de {nome}
      </span>
    </a>
  );
}
