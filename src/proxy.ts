import { NextResponse, type NextRequest } from "next/server";

import { podeAcessarPainel } from "@/lib/painel/acesso";
import { COOKIE_SESSAO, type Sessao, lerToken } from "@/lib/painel/sessao";

export async function proxy(request: NextRequest) {
  const sessao = lerToken<Sessao>(request.cookies.get(COOKIE_SESSAO)?.value);

  // Reconfere a lista a cada acesso: tirar alguém do Studio derruba a sessão dela.
  if (sessao && "email" in sessao && (await podeAcessarPainel(sessao.email))) {
    return NextResponse.next();
  }

  const destino = new URL("/painel/login", request.url);
  destino.searchParams.set("voltar", request.nextUrl.pathname);
  return NextResponse.redirect(destino);
}

export const config = {
  matcher: ["/studio", "/studio/:path*"],
};
