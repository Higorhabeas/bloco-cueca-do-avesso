import { isValidSignature } from "@sanity/webhook";
import { NextResponse, type NextRequest } from "next/server";

import { emailsPermitidos } from "@/lib/painel/acesso";
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
  // Campos do documento cru, caso o webhook seja criado sem projeção.
  _id?: string;
  _type?: string;
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
    titulo: corpo.titulo?.trim() || "(sem título)",
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

  let mudanca: MudancaDeConteudo | null;
  try {
    mudanca = normalizar(JSON.parse(corpoCru) as CorpoDoWebhook);
  } catch {
    return NextResponse.json({ mensagem: "Corpo inválido." }, { status: 400 });
  }

  if (!mudanca) {
    // Rascunho ou payload sem identificação: nada a avisar, mas não é erro.
    return NextResponse.json({ ignorado: true });
  }

  try {
    const resultado = await avisarAdministradores(
      mudanca,
      new URL(request.url).origin,
      await emailsPermitidos(),
    );
    return NextResponse.json(resultado);
  } catch (erro) {
    console.error("[webhook] falha ao avisar administradores", erro);
    return NextResponse.json(
      { mensagem: "Não foi possível enviar o aviso." },
      { status: 500 },
    );
  }
}
