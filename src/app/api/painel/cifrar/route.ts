import { NextResponse, type NextRequest } from "next/server";

import { podeAcessarPainel } from "@/lib/painel/acesso";
import { cifrar } from "@/lib/painel/cripto";
import { COOKIE_SESSAO, type Sessao, lerToken } from "@/lib/painel/sessao";

export const runtime = "nodejs";

/**
 * Recebe a senha digitada no Studio e devolve a versão cifrada, que é o que o
 * Studio guarda no documento. A senha em texto puro nunca chega ao dataset.
 */
export async function POST(request: NextRequest) {
  const sessao = lerToken<Sessao>(request.cookies.get(COOKIE_SESSAO)?.value);
  if (!sessao || !("email" in sessao) || !podeAcessarPainel(sessao.email)) {
    return NextResponse.json(
      { mensagem: "Sua sessão do painel expirou. Entre de novo." },
      { status: 401 },
    );
  }

  let senha: string;
  try {
    const corpo = (await request.json()) as { senha?: unknown };
    if (typeof corpo.senha !== "string" || !corpo.senha.trim()) {
      return NextResponse.json(
        { mensagem: "Digite a senha de app para salvar." },
        { status: 400 },
      );
    }
    senha = corpo.senha.trim();
  } catch {
    return NextResponse.json(
      { mensagem: "Não foi possível ler o pedido." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json({ cifrado: cifrar(senha) });
  } catch (erro) {
    console.error("[painel] falha ao cifrar a senha de envio", erro);
    return NextResponse.json(
      {
        mensagem:
          "O servidor está sem a chave de segurança configurada. Avise quem cuida do site.",
      },
      { status: 500 },
    );
  }
}
