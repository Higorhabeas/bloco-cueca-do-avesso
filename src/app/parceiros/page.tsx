import type { Metadata } from "next";

import { LogoPatrocinador } from "@/components/LogoPatrocinador";
import { agruparPorNivel } from "@/lib/patrocinadores";
import { getPatrocinadores } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nossos Parceiros",
  description:
    "As empresas que patrocinam o bloco de carnaval Cueca do Avesso.",
};

/** Patrocínios mais altos ganham logo maior e menos colunas. */
const GRADE_POR_NIVEL: Record<string, string> = {
  master: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
  ouro: "grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4",
  prata: "grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5",
  comum: "grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6",
};

const ALTURA_POR_NIVEL: Record<string, string> = {
  master: "h-36",
  ouro: "h-28",
  prata: "h-24",
  comum: "h-20",
};

export default async function ParceirosPage() {
  const patrocinadores = await getPatrocinadores();
  const grupos = agruparPorNivel(patrocinadores);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Nossos Parceiros
      </h1>
      <p className="mt-2 max-w-prose text-body-text-muted">
        Quem ajuda a colocar o Cueca do Avesso na rua. Clique numa logomarca
        para conhecer a empresa.
      </p>

      {grupos.length === 0 ? (
        <p className="mt-8 text-body-text-muted">
          Ainda não temos patrocinadores cadastrados. Quer apoiar o bloco? Fale
          com a gente.
        </p>
      ) : (
        // O nível não é exibido: quem visita vê só a hierarquia pelo tamanho
        // da logomarca. Saber quem é Master ou Prata é assunto de quem cadastra.
        grupos.map(({ nivel, patrocinadores: doNivel }) => (
          <div key={nivel} className={`mt-6 ${GRADE_POR_NIVEL[nivel]}`}>
            {doNivel.map((patrocinador) => (
              <LogoPatrocinador
                key={patrocinador._id}
                patrocinador={patrocinador}
                alturaDaCaixa={ALTURA_POR_NIVEL[nivel]}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
