import type { Metadata } from "next";

import { EventoCard } from "@/components/EventoCard";
import { separarEventos } from "@/lib/datas";
import { getEventos } from "@/sanity/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Eventos",
  description: "Próximos e antigos eventos do bloco Cueca do Avesso.",
};

export default async function EventosPage() {
  const eventos = await getEventos();
  const { proximos, passados } = separarEventos(eventos);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
        Eventos
      </h1>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-ink">
          Próximos eventos
        </h2>
        {proximos.length > 0 ? (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proximos.map((evento) => (
              <EventoCard key={evento._id} evento={evento} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-body-text-muted">
            Nenhum evento marcado por enquanto. Fica de olho nas redes sociais!
          </p>
        )}
      </section>

      {passados.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-ink">
            Eventos passados
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {passados.map((evento) => (
              <EventoCard key={evento._id} evento={evento} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
