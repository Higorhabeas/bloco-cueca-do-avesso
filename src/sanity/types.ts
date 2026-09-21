import type { PortableTextBlock } from "@portabletext/types";

export interface SanityImage {
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: { x: number; y: number; width: number; height: number };
  alt?: string;
}

export interface EventoSummary {
  _id: string;
  titulo: string;
  slug: string;
  data: string;
  local?: string;
  imagemCapa?: SanityImage;
}

export interface Evento extends EventoSummary {
  descricao?: PortableTextBlock[];
}

export interface RecadoSummary {
  _id: string;
  titulo: string;
  slug: string;
  dataPublicacao: string;
  imagem?: SanityImage;
}

export interface Recado extends RecadoSummary {
  texto: PortableTextBlock[];
  eventoRelacionado?: EventoSummary;
}

export interface Foto {
  _id: string;
  imagem: SanityImage;
  legenda?: string;
  evento?: { titulo: string; slug: string };
}

export interface Video {
  _id: string;
  titulo: string;
  url: string;
  capa?: SanityImage;
  legenda?: string;
  evento?: { titulo: string; slug: string };
}

export type NivelPatrocinio = "master" | "ouro" | "prata" | "comum";

export interface Patrocinador {
  _id: string;
  nome: string;
  logo: SanityImage;
  site?: string;
  nivel: NivelPatrocinio;
}

export interface MembroBateria {
  _id: string;
  foto: SanityImage;
  nomeApelido: string;
  funcao: string;
}

export interface HistoriaDoBloco {
  titulo: string;
  texto?: PortableTextBlock[];
  fotosAntigas?: (SanityImage & { ano?: string })[];
}

export interface ConfiguracoesGerais {
  whatsappNumero?: string;
  whatsappMensagemPadrao?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  textoInstitucional?: string;
}
