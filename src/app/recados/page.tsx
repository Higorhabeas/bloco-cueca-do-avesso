import type { Metadata } from "next";

import { RecadoCard } from "@/components/RecadoCard";
import { getRecados } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Recados",
  description: "Avisos e notícias do bloco Cueca do Avesso.",
};

export default async function RecadosPage() {
  const recados = await getRecados();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Recados
      </h1>

      {recados.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recados.map((recado) => (
            <RecadoCard key={recado._id} recado={recado} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-body-text-muted">Nenhum recado publicado ainda.</p>
      )}
    </div>
  );
}
