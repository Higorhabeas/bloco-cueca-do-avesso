import type {
  EventoSummary,
  NivelPatrocinio,
  Patrocinador,
} from "@/sanity/types";

/** Um patrocinador Master aparece no carrossel a cada tantos eventos. */
export const EVENTOS_ENTRE_PATROCINADORES = 3;

const ORDEM_NIVEL: Record<NivelPatrocinio, number> = {
  master: 0,
  ouro: 1,
  prata: 2,
  comum: 3,
};

export const NOME_NIVEL: Record<NivelPatrocinio, string> = {
  master: "Master",
  ouro: "Ouro",
  prata: "Prata",
  comum: "Comum",
};

export const NIVEIS_EM_ORDEM: NivelPatrocinio[] = [
  "master",
  "ouro",
  "prata",
  "comum",
];

/** Master primeiro, depois Ouro, Prata e Comum; dentro do nível, ordem alfabética. */
export function ordenarPorNivel(lista: Patrocinador[]): Patrocinador[] {
  return [...lista].sort((a, b) => {
    const diferenca =
      (ORDEM_NIVEL[a.nivel] ?? 99) - (ORDEM_NIVEL[b.nivel] ?? 99);
    return diferenca !== 0
      ? diferenca
      : a.nome.localeCompare(b.nome, "pt-BR");
  });
}

export function agruparPorNivel(
  lista: Patrocinador[],
): { nivel: NivelPatrocinio; patrocinadores: Patrocinador[] }[] {
  return NIVEIS_EM_ORDEM.map((nivel) => ({
    nivel,
    patrocinadores: lista.filter((p) => p.nivel === nivel),
  })).filter((grupo) => grupo.patrocinadores.length > 0);
}

export type SlideDoCarrossel =
  | { tipo: "evento"; chave: string; evento: EventoSummary }
  | { tipo: "patrocinador"; chave: string; patrocinador: Patrocinador };

/**
 * Intercala um patrocinador Master a cada três eventos. Os Master entram em
 * rodízio: todos aparecem uma vez antes de qualquer um repetir.
 */
export function montarSlidesDoCarrossel(
  eventos: EventoSummary[],
  masters: Patrocinador[],
): SlideDoCarrossel[] {
  const slides: SlideDoCarrossel[] = [];
  let usados = 0;

  eventos.forEach((evento, indice) => {
    slides.push({ tipo: "evento", chave: evento._id, evento });

    const fechouUmBloco =
      (indice + 1) % EVENTOS_ENTRE_PATROCINADORES === 0;

    if (fechouUmBloco && masters.length > 0) {
      const patrocinador = masters[usados % masters.length];
      slides.push({
        tipo: "patrocinador",
        // O mesmo Master pode voltar em carrosséis longos, então a chave leva a posição.
        chave: `${patrocinador._id}-${usados}`,
        patrocinador,
      });
      usados++;
    }
  });

  return slides;
}
