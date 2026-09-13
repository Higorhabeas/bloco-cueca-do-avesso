import type { Metadata } from "next";

import { MembroCard } from "@/components/MembroCard";
import { getMembrosBateria } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ala da Bateria",
  description: "Conheça os integrantes da bateria do Cueca do Avesso.",
};

export default async function BateriaPage() {
  const membros = await getMembrosBateria();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Ala da Bateria
      </h1>
      <p className="mt-2 max-w-2xl text-body-text-muted">
        O coração pulsante do nosso desfile.
      </p>

      {membros.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {membros.map((membro) => (
            <MembroCard key={membro._id} membro={membro} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-body-text-muted">
          A bateria ainda não foi cadastrada por aqui.
        </p>
      )}
    </div>
  );
}
