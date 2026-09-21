import Link from "next/link";

import { CarrosselPrincipal } from "@/components/CarrosselPrincipal";
import { EventoCard } from "@/components/EventoCard";
import { FotoGaleria } from "@/components/FotoGaleria";
import { MembroCard } from "@/components/MembroCard";
import { RecadoCard } from "@/components/RecadoCard";
import { separarEventos } from "@/lib/datas";
import { montarSlidesDoCarrossel } from "@/lib/patrocinadores";
import {
  getEventos,
  getFotos,
  getHistoriaDoBloco,
  getMembrosBateria,
  getPatrocinadores,
  getRecados,
} from "@/sanity/queries";

export const revalidate = 60;

const EVENTOS_NO_CARROSSEL = 5;

export default async function HomePage() {
  const [eventos, recados, fotos, membros, historia, patrocinadores] =
    await Promise.all([
      getEventos(),
      getRecados(3),
      getFotos(),
      getMembrosBateria(),
      getHistoriaDoBloco(),
      getPatrocinadores(),
    ]);

  // O que ainda vai acontecer lidera, do mais próximo para o mais distante; o
  // resto do carrossel é completado com os eventos passados mais recentes.
  // Assim o próximo evento sempre aparece primeiro, e cadastrar um evento novo
  // empurra o mais antigo para fora sozinho.
  const { proximos, passados } = separarEventos(eventos);
  const destaques = [...proximos, ...passados].slice(0, EVENTOS_NO_CARROSSEL);

  const noCarrossel = new Set(destaques.map((evento) => evento._id));
  const outrosProximos = proximos.filter((evento) => !noCarrossel.has(evento._id));

  const slides = montarSlidesDoCarrossel(
    destaques,
    patrocinadores.filter((p) => p.nivel === "master"),
  );

  return (
    <div className="flex flex-col">
      <CarrosselPrincipal slides={slides} />

      {destaques.length === 0 && (
        <div className="bg-linear-to-br from-brand to-brand-dark px-4 py-20 text-center text-paper sm:px-6">
          <h1 className="font-display text-3xl font-bold sm:text-5xl">
            Cueca do Avesso
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-paper/90">
            O bloco de rua que vira o carnaval pelo avesso. Fique de olho nos
            próximos eventos!
          </p>
        </div>
      )}

      {historia && (
        <section className="mx-auto w-full max-w-6xl px-4 py-12 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
            {historia.titulo}
          </h2>
          <Link
            href="/sobre"
            className="mt-4 inline-block rounded-full border-2 border-brand px-5 py-2 text-sm font-semibold text-brand transition hover:bg-brand hover:text-paper"
          >
            Conhecer nossa história
          </Link>
        </section>
      )}

      {outrosProximos.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Próximos eventos
            </h2>
            <Link href="/eventos" className="text-sm font-semibold text-brand">
              Ver todos <span className="sr-only">os eventos</span>→
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outrosProximos.slice(0, 3).map((evento) => (
              <EventoCard key={evento._id} evento={evento} />
            ))}
          </div>
        </section>
      )}

      {recados.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Últimos recados
            </h2>
            <Link href="/recados" className="text-sm font-semibold text-brand">
              Ver todos <span className="sr-only">os recados</span>→
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {recados.map((recado) => (
              <RecadoCard key={recado._id} recado={recado} />
            ))}
          </div>
        </section>
      )}

      {fotos.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Galeria
            </h2>
            <Link href="/galeria" className="text-sm font-semibold text-brand">
              Ver galeria completa →
            </Link>
          </div>
          <FotoGaleria
            fotos={fotos.slice(0, 8)}
            classeGrade="grid grid-cols-2 gap-3 sm:grid-cols-4"
          />
        </section>
      )}

      {membros.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              Ala da Bateria
            </h2>
            <Link href="/bateria" className="text-sm font-semibold text-brand">
              Ver todos <span className="sr-only">os membros da bateria</span>→
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
            {membros.slice(0, 6).map((membro) => (
              <MembroCard key={membro._id} membro={membro} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
