import { NextResponse, type NextRequest } from "next/server";

import { podeAcessarPainel } from "@/lib/painel/acesso";
import {
  COOKIE_DESAFIO,
  COOKIE_SESSAO,
  DURACAO_SESSAO_MS,
  type Desafio,
  MAX_TENTATIVAS,
  codigoConfere,
  criarToken,
  lerToken,
} from "@/lib/painel/sessao";

export const runtime = "nodejs";

const PEDIR_NOVO_CODIGO = {
  mensagem: "Esse código expirou ou já foi usado. Peça um novo para continuar.",
  reiniciar: true,
};

export async function POST(request: NextRequest) {
  let codigo: string;
  try {
    const corpo = (await request.json()) as { codigo?: unknown };
    if (typeof corpo.codigo !== "string") {
      return NextResponse.json(
        { mensagem: "Digite o código que chegou por e-mail." },
        { status: 400 },
      );
    }
    codigo = corpo.codigo.replace(/\D/g, "");
  } catch {
    return NextResponse.json(
      { mensagem: "Não foi possível ler o pedido. Tente de novo." },
      { status: 400 },
    );
  }

  const desafio = lerToken<Desafio>(request.cookies.get(COOKIE_DESAFIO)?.value);

  if (!desafio || !("codigoHash" in desafio)) {
    return NextResponse.json(PEDIR_NOVO_CODIGO, { status: 400 });
  }

  // A permissão é reconferida aqui: se o e-mail saiu da lista depois do envio, o código não vale mais.
  if (!podeAcessarPainel(desafio.email)) {
    return NextResponse.json(PEDIR_NOVO_CODIGO, { status: 403 });
  }

  if (!codigoConfere(desafio, desafio.email, codigo)) {
    const tentativas = desafio.tentativas + 1;

    if (tentativas >= MAX_TENTATIVAS) {
      const resposta = NextResponse.json(PEDIR_NOVO_CODIGO, { status: 429 });
      resposta.cookies.delete(COOKIE_DESAFIO);
      return resposta;
    }

    const resposta = NextResponse.json(
      {
        mensagem: `Código não confere. Restam ${MAX_TENTATIVAS - tentativas} tentativas.`,
      },
      { status: 400 },
    );
    resposta.cookies.set(COOKIE_DESAFIO, criarToken({ ...desafio, tentativas }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.max(0, Math.floor((desafio.exp - Date.now()) / 1000)),
    });
    return resposta;
  }

  const resposta = NextResponse.json({ mensagem: "Tudo certo! Abrindo o painel." });
  resposta.cookies.set(
    COOKIE_SESSAO,
    criarToken({ email: desafio.email, exp: Date.now() + DURACAO_SESSAO_MS }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DURACAO_SESSAO_MS / 1000,
    },
  );
  resposta.cookies.delete(COOKIE_DESAFIO);
  return resposta;
}
