import { client } from "./client";
import type {
  ConfiguracoesGerais,
  Evento,
  EventoSummary,
  Foto,
  HistoriaDoBloco,
  MembroBateria,
  Recado,
  RecadoSummary,
  Video,
} from "./types";

const eventoSummaryProjection = `{
  _id,
  titulo,
  "slug": slug.current,
  data,
  local,
  imagemCapa
}`;

export async function getEventos(): Promise<EventoSummary[]> {
  return client.fetch(
    `*[_type == "evento"] | order(data desc) ${eventoSummaryProjection}`,
  );
}

export async function getEventoBySlug(slug: string): Promise<Evento | null> {
  return client.fetch(
    `*[_type == "evento" && slug.current == $slug][0]{
      _id,
      titulo,
      "slug": slug.current,
      data,
      local,
      imagemCapa,
      descricao
    }`,
    { slug },
  );
}

export async function getRecados(limit?: number): Promise<RecadoSummary[]> {
  const range = limit ? `[0...${limit}]` : "";
  return client.fetch(
    `*[_type == "recado"] | order(dataPublicacao desc) ${range} {
      _id,
      titulo,
      "slug": slug.current,
      dataPublicacao,
      imagem
    }`,
  );
}

export async function getRecadoBySlug(slug: string): Promise<Recado | null> {
  return client.fetch(
    `*[_type == "recado" && slug.current == $slug][0]{
      _id,
      titulo,
      "slug": slug.current,
      dataPublicacao,
      imagem,
      texto,
      "eventoRelacionado": eventoRelacionado->${eventoSummaryProjection}
    }`,
    { slug },
  );
}

export async function getFotos(eventoSlug?: string): Promise<Foto[]> {
  const filter = eventoSlug
    ? `_type == "foto" && evento->slug.current == $eventoSlug`
    : `_type == "foto"`;
  return client.fetch(
    `*[${filter}] | order(_createdAt desc) {
      _id,
      imagem,
      legenda,
      "evento": evento->{titulo, "slug": slug.current}
    }`,
    eventoSlug ? { eventoSlug } : {},
  );
}

export async function getVideos(): Promise<Video[]> {
  return client.fetch(
    `*[_type == "video"] | order(_createdAt desc) {
      _id,
      titulo,
      url,
      capa,
      legenda,
      "evento": evento->{titulo, "slug": slug.current}
    }`,
  );
}

export async function getMembrosBateria(): Promise<MembroBateria[]> {
  return client.fetch(
    `*[_type == "membroBateria"] | order(coalesce(ordem, 999) asc, nomeApelido asc) {
      _id,
      foto,
      nomeApelido,
      funcao
    }`,
  );
}

export async function getHistoriaDoBloco(): Promise<HistoriaDoBloco | null> {
  return client.fetch(
    `*[_id == "historiaDoBloco"][0]{ titulo, texto, fotosAntigas }`,
  );
}

export async function getConfiguracoesGerais(): Promise<ConfiguracoesGerais | null> {
  return client.fetch(
    `*[_id == "configuracoesGerais"][0]{
      whatsappNumero,
      whatsappMensagemPadrao,
      instagramUrl,
      facebookUrl,
      textoInstitucional
    }`,
  );
}
