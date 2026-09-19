import nodemailer from "nodemailer";

import { obterConfiguracaoEnvio } from "./configuracaoEnvio";

export type Operacao = "criacao" | "edicao" | "exclusao";

export interface MudancaDeConteudo {
  operacao: Operacao;
  tipo: string;
  titulo: string;
  slug?: string;
}

/** Gênero e número de cada tipo, para o particípio concordar ("Foto excluída"). */
const TIPOS: Record<string, { nome: string; feminino?: true; plural?: true }> = {
  evento: { nome: "Evento" },
  recado: { nome: "Recado" },
  foto: { nome: "Foto", feminino: true },
  video: { nome: "Vídeo" },
  membroBateria: { nome: "Integrante da bateria" },
  historiaDoBloco: { nome: "História do bloco", feminino: true },
  configuracoesGerais: {
    nome: "Configurações gerais",
    feminino: true,
    plural: true,
  },
};

const VERBOS: Record<Operacao, string> = {
  criacao: "publicou",
  edicao: "editou",
  exclusao: "excluiu",
};

const PARTICIPIOS: Record<Operacao, string> = {
  criacao: "publicad",
  edicao: "editad",
  exclusao: "excluíd",
};

function concordar(operacao: Operacao, tipo: { feminino?: true; plural?: true }) {
  return (
    PARTICIPIOS[operacao] + (tipo.feminino ? "a" : "o") + (tipo.plural ? "s" : "")
  );
}

/** Caminho público do conteúdo, quando ele aparece no site. */
function caminhoNoSite(mudanca: MudancaDeConteudo): string | null {
  switch (mudanca.tipo) {
    case "evento":
      return mudanca.slug ? `/eventos/${mudanca.slug}` : "/eventos";
    case "recado":
      return mudanca.slug ? `/recados/${mudanca.slug}` : "/recados";
    case "foto":
    case "video":
      return "/galeria";
    case "membroBateria":
      return "/bateria";
    case "historiaDoBloco":
      return "/sobre";
    default:
      return null;
  }
}

export function montarAviso(mudanca: MudancaDeConteudo, origem: string) {
  const info = TIPOS[mudanca.tipo] ?? { nome: mudanca.tipo };
  const tipo = info.nome;
  const verbo = VERBOS[mudanca.operacao];
  const assunto = `${tipo} ${concordar(mudanca.operacao, info)}: ${mudanca.titulo}`;

  const caminho = caminhoNoSite(mudanca);
  const linhas = [
    `Alguém ${verbo} conteúdo no site do Cueca do Avesso.`,
    "",
    `${tipo}: ${mudanca.titulo}`,
  ];

  if (mudanca.operacao !== "exclusao" && caminho) {
    linhas.push("", `Ver no site: ${origem}${caminho}`);
  }

  linhas.push(
    "",
    `Painel: ${origem}/studio`,
    "",
    "Você recebe este aviso porque seu e-mail está na lista de administradores,",
    "em Configurações Gerais no painel.",
  );

  return { assunto, texto: linhas.join("\n") };
}

export async function avisarAdministradores(
  mudanca: MudancaDeConteudo,
  origem: string,
  destinatarios: string[],
) {
  if (destinatarios.length === 0) return { enviado: false, motivo: "sem destinatários" };

  const { remetente, senha } = await obterConfiguracaoEnvio();
  if (!remetente || !senha) {
    return { enviado: false, motivo: "envio de e-mail não configurado" };
  }

  const { assunto, texto } = montarAviso(mudanca, origem);

  const transporte = nodemailer.createTransport({
    service: "gmail",
    auth: { user: remetente, pass: senha },
  });

  await transporte.sendMail({
    from: `"Cueca do Avesso" <${remetente}>`,
    // Em cópia oculta: um administrador não precisa ver o e-mail dos outros.
    bcc: destinatarios,
    subject: assunto,
    text: texto,
  });

  return { enviado: true, destinatarios: destinatarios.length };
}
