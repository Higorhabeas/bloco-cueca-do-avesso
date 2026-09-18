import { NextResponse, type NextRequest } from "next/server";

import { podeAcessarPainel } from "@/lib/painel/acesso";
import { COOKIE_SESSAO, type Sessao, lerToken } from "@/lib/painel/sessao";

export const runtime = "nodejs";

/**
 * O bloco escreve em tom informal de propósito, então sugestões de estilo
 * (como trocar "pra" por "para") só atrapalhariam. Erro de fato continua aparecendo.
 */
const TIPO_ESTILO = "style";

const LIMITE_CARACTERES = 18_000;

interface RespostaLanguageTool {
  matches: {
    message: string;
    offset: number;
    length: number;
    replacements: { value: string }[];
    context: { text: string; offset: number; length: number };
    rule: { issueType?: string };
  }[];
}

export interface ProblemaEncontrado {
  mensagem: string;
  trecho: string;
  contexto: string;
  sugestoes: string[];
}

export async function POST(request: NextRequest) {
  const sessao = lerToken<Sessao>(request.cookies.get(COOKIE_SESSAO)?.value);
  if (!sessao || !("email" in sessao) || !(await podeAcessarPainel(sessao.email))) {
    return NextResponse.json(
      { mensagem: "Sua sessão do painel expirou. Entre de novo para revisar." },
      { status: 401 },
    );
  }

  let texto: string;
  try {
    const corpo = (await request.json()) as { texto?: unknown };
    if (typeof corpo.texto !== "string" || !corpo.texto.trim()) {
      return NextResponse.json(
        { mensagem: "Não há texto para revisar neste documento." },
        { status: 400 },
      );
    }
    texto = corpo.texto.slice(0, LIMITE_CARACTERES);
  } catch {
    return NextResponse.json(
      { mensagem: "Não foi possível ler o texto enviado." },
      { status: 400 },
    );
  }

  let dados: RespostaLanguageTool;
  try {
    const resposta = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ text: texto, language: "pt-BR" }),
    });

    if (!resposta.ok) {
      return NextResponse.json(
        {
          mensagem:
            "O serviço de revisão está ocupado no momento. Tente de novo em um minuto.",
        },
        { status: 503 },
      );
    }

    dados = (await resposta.json()) as RespostaLanguageTool;
  } catch {
    return NextResponse.json(
      {
        mensagem:
          "Não conseguimos falar com o serviço de revisão agora. Tente de novo em instantes.",
      },
      { status: 503 },
    );
  }

  const problemas: ProblemaEncontrado[] = dados.matches
    .filter((match) => match.rule.issueType !== TIPO_ESTILO)
    .map((match) => ({
      mensagem: match.message,
      trecho: texto.slice(match.offset, match.offset + match.length),
      contexto: match.context.text,
      sugestoes: match.replacements.slice(0, 4).map((r) => r.value),
    }));

  return NextResponse.json({ problemas });
}
