import { NextResponse, type NextRequest } from "next/server";

import { COOKIE_DESAFIO, COOKIE_SESSAO } from "@/lib/painel/sessao";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const resposta = NextResponse.redirect(new URL("/painel/login", request.url), {
    status: 303,
  });
  resposta.cookies.delete(COOKIE_SESSAO);
  resposta.cookies.delete(COOKIE_DESAFIO);
  return resposta;
}
