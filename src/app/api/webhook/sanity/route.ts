import { isValidSignature } from "@sanity/webhook";
import { NextResponse, type NextRequest } from "next/server";

import { emailsPermitidos } from "@/lib/painel/acesso";
import { emailDeQuemAlterou } from "@/lib/painel/autorDaMudanca";
import { convidarNovosAdministradores } from "@/lib/painel/convites";
import {
  type MudancaDeConteudo,
  type Operacao,
  avisarAdministradores,
} from "@/lib/painel/notificacao";

export const runtime = "nodejs";

const CABECALHO_ASSINATURA = "sanity-webhook-signature";

interface CorpoDoWebhook {
  operacao?: string;
  id?: string;
  tipo?: string;
  titulo?: string;
  slug?: string;
  /** ID de quem alterou, vindo de `identity()` na projeção do webhook. */
  autor?: string;
  // Campos do documento cru, caso o webhook seja criado sem projeção.
  _id?: string;
  _type?: string;
  nome?: string;
}

function normalizar(corpo: CorpoDoWebhook): MudancaDeConteudo | null {
  const id = corpo.id ?? corpo._id;
  const tipo = corpo.tipo ?? corpo._type;
  if (!id || !tipo) return null;

  // Rascunhos são salvos a cada tecla digitada: avisar sobre eles inundaria as caixas.
  if (id.startsWith("drafts.")) return null;

  const operacoes: Operacao[] = ["criacao", "edicao", "exclusao"];
  const operacao = operacoes.includes(corpo.operacao as Operacao)
    ? (corpo.operacao as Operacao)
    : "edicao";

  return {
    operacao,
    tipo,
    titulo: (corpo.titulo ?? corpo.nome)?.trim() || "(sem título)",
    slug: corpo.slug,
  };
}

export async function POST(request: NextRequest) {
  const segredo = process.env.SANITY_WEBHOOK_SECRET;
  if (!segredo) {
    console.error("[webhook] SANITY_WEBHOOK_SECRET não configurado");
    return NextResponse.json(
      { mensagem: "Webhook não configurado no servidor." },
      { status: 500 },
    );
  }

  // O corpo precisa ser verificado como texto cru: reserializar o JSON muda
  // a formatação e a assinatura deixa de bater.
  const corpoCru = await request.text();
  const assinatura = request.headers.get(CABECALHO_ASSINATURA);

  if (!assinatura || !(await isValidSignature(corpoCru, assinatura, segredo))) {
    return NextResponse.json({ mensagem: "Assinatura inválida." }, { status: 401 });
  }

  let corpo: CorpoDoWebhook;
  let mudanca: MudancaDeConteudo | null;
  try {
    corpo = JSON.parse(corpoCru) as CorpoDoWebhook;
    mudanca = normalizar(corpo);
  } catch {
    return NextResponse.json({ mensagem: "Corpo inválido." }, { status: 400 });
  }

  if (!mudanca) {
    // Rascunho ou payload sem identificação: nada a avisar, mas não é erro.
    return NextResponse.json({ ignorado: true });
  }

  // Mexer na lista de administradores convida quem ainda não é membro do
  // projeto, para que tudo seja gerenciado pelo Studio.
  let convidados: string[] = [];
  if (mudanca.tipo === "configuracoesGerais") {
    try {
      convidados = (await convidarNovosAdministradores()).convidados;
    } catch (erro) {
      console.error("[webhook] falha ao convidar administradores", erro);
    }
  }

  try {
    // Quem fez a alteração não precisa ser avisado dela.
    const autor = await emailDeQuemAlterou(corpo.autor);
    const destinatarios = (await emailsPermitidos()).filter(
      (email) => email !== autor,
    );

    const resultado = await avisarAdministradores(
      mudanca,
      new URL(request.url).origin,
      destinatarios,
    );
    return NextResponse.json({
      ...resultado,
      autorExcluido: Boolean(autor),
      ...(convidados.length > 0 ? { convidados } : {}),
    });
  } catch (erro) {
    console.error("[webhook] falha ao avisar administradores", erro);
    return NextResponse.json(
      { mensagem: "Não foi possível enviar o aviso." },
      { status: 500 },
    );
  }
}
