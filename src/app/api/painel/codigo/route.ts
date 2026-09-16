import { NextResponse } from "next/server";

import { normalizarEmail, podeAcessarPainel } from "@/lib/painel/acesso";
import { enviarCodigoPorEmail } from "@/lib/painel/email";
import {
  COOKIE_DESAFIO,
  DURACAO_CODIGO_MS,
  criarToken,
  gerarCodigo,
  hashDoCodigo,
} from "@/lib/painel/sessao";

export const runtime = "nodejs";

/**
 * Responde igual para e-mail autorizado ou não, para não revelar quem administra o site.
 */
const RESPOSTA_NEUTRA = {
  mensagem:
    "Se esse e-mail tiver acesso ao painel, o código chega na caixa de entrada em instantes.",
};

export async function POST(request: Request) {
  let email: string;
  try {
    const corpo = (await request.json()) as { email?: unknown };
    if (typeof corpo.email !== "string") {
      return NextResponse.json(
        { mensagem: "Informe um e-mail para continuar." },
        { status: 400 },
      );
    }
    email = normalizarEmail(corpo.email);
  } catch {
    return NextResponse.json(
      { mensagem: "Não foi possível ler o pedido. Tente de novo." },
      { status: 400 },
    );
  }

  if (!podeAcessarPainel(email)) {
    return NextResponse.json(RESPOSTA_NEUTRA);
  }

  const codigo = gerarCodigo();

  let token: string;
  let ficouSoNoTerminal: boolean;
  try {
    token = criarToken({
      email,
      codigoHash: hashDoCodigo(email, codigo),
      exp: Date.now() + DURACAO_CODIGO_MS,
      tentativas: 0,
    });
    ficouSoNoTerminal = await enviarCodigoPorEmail(email, codigo);
  } catch (erro) {
    console.error("[painel] falha ao preparar o código de acesso", erro);
    return NextResponse.json(
      {
        mensagem:
          "O envio de e-mail ainda não está configurado no servidor. Avise quem cuida do site.",
      },
      { status: 500 },
    );
  }

  const resposta = NextResponse.json({
    ...RESPOSTA_NEUTRA,
    // Só fora de produção e só quando não há Gmail configurado, para dar para testar localmente.
    ...(ficouSoNoTerminal ? { codigoLocal: codigo } : {}),
  });
  resposta.cookies.set(COOKIE_DESAFIO, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACAO_CODIGO_MS / 1000,
  });
  return resposta;
}
