import Image from "next/image";

import { urlFor } from "@/sanity/image";
import type { SanityImage } from "@/sanity/types";

/**
 * Mostra a imagem inteira, sem recorte, funcionando igual para retrato e paisagem.
 * A sobra do enquadramento é preenchida por uma cópia ampliada e desfocada da
 * própria imagem, em vez de barras vazias.
 *
 * Precisa de um elemento pai com `position: relative` e altura definida.
 */
export function ImagemEnquadrada({
  imagem,
  alt,
  sizes,
  largura = 1200,
  prioridade = false,
  classeDaImagem = "",
}: {
  imagem: SanityImage;
  alt: string;
  sizes: string;
  largura?: number;
  prioridade?: boolean;
  classeDaImagem?: string;
}) {
  // fit("max") só reduz: preserva a imagem inteira, seja ela deitada ou em pé.
  const url = urlFor(imagem).width(largura).fit("max").url();

  return (
    <>
      {/* Mesma URL da imagem da frente, então o navegador baixa uma vez só. */}
      <Image
        src={url}
        alt=""
        aria-hidden="true"
        fill
        priority={prioridade}
        sizes={sizes}
        className="scale-110 object-cover blur-2xl"
      />
      <Image
        src={url}
        alt={alt}
        fill
        priority={prioridade}
        sizes={sizes}
        className={`object-contain ${classeDaImagem}`}
      />
    </>
  );
}
