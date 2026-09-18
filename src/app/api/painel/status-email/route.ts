import { NextResponse, type NextRequest } from "next/server";

import { podeAcessarPainel } from "@/lib/painel/acesso";
import { obterConfiguracaoEnvio } from "@/lib/painel/configuracaoEnvio";
import { COOKIE_SESSAO, type Sessao, lerToken } from "@/lib/painel/sessao";

export const runtime = "nodejs";

/**
 * Informa se o envio de e-mail está pronto e qual endereço envia.
 * A senha nunca sai daqui — só o endereço, que já aparece como remetente
 * em todo e-mail enviado de qualquer forma.
 */
export async function GET(request: NextRequest) {
  const sessao = lerToken<Sessao>(request.cookies.get(COOKIE_SESSAO)?.value);
  if (!sessao || !("email" in sessao) || !(await podeAcessarPainel(sessao.email))) {
    return NextResponse.json({ mensagem: "Sessão expirada." }, { status: 401 });
  }

  const { remetente, senha, origem } = await obterConfiguracaoEnvio();

  return NextResponse.json({
    configurado: Boolean(remetente && senha),
    remetente: remetente ?? null,
    faltaSenha: Boolean(remetente) && !senha,
    origem,
    emProducao: process.env.NODE_ENV === "production",
  });
}
