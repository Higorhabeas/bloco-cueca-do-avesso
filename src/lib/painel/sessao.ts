import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export const COOKIE_SESSAO = "painel_sessao";
export const COOKIE_DESAFIO = "painel_desafio";

export const DURACAO_SESSAO_MS = 30 * 24 * 60 * 60 * 1000;
export const DURACAO_CODIGO_MS = 10 * 60 * 1000;
export const MAX_TENTATIVAS = 5;

export interface Sessao {
  email: string;
  exp: number;
}

export interface Desafio {
  email: string;
  codigoHash: string;
  exp: number;
  tentativas: number;
}

function segredoOuNulo(): string | null {
  const segredo = process.env.PAINEL_SEGREDO;
  return segredo && segredo.length >= 32 ? segredo : null;
}

function assinar(dados: string, segredo: string): string {
  return createHmac("sha256", segredo).update(dados).digest("base64url");
}

function comparar(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

/** Lança quando PAINEL_SEGREDO não está configurado, para a rota devolver um erro claro. */
export function criarToken(payload: Sessao | Desafio): string {
  const segredo = segredoOuNulo();
  if (!segredo) {
    throw new Error(
      "PAINEL_SEGREDO não está configurado (precisa de pelo menos 32 caracteres).",
    );
  }
  const corpo = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${corpo}.${assinar(corpo, segredo)}`;
}

/** Sem segredo configurado nada é considerado válido, então o acesso falha fechado. */
export function lerToken<T extends Sessao | Desafio>(
  token: string | undefined,
): T | null {
  const segredo = segredoOuNulo();
  if (!segredo || !token) return null;

  const [corpo, assinatura] = token.split(".");
  if (!corpo || !assinatura) return null;
  if (!comparar(assinatura, assinar(corpo, segredo))) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(corpo, "base64url").toString(),
    ) as T;
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

export function gerarCodigo(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashDoCodigo(email: string, codigo: string): string {
  const segredo = segredoOuNulo();
  if (!segredo) {
    throw new Error("PAINEL_SEGREDO não está configurado.");
  }
  return assinar(`${email}:${codigo}`, segredo);
}

export function codigoConfere(
  desafio: Desafio,
  email: string,
  codigo: string,
): boolean {
  return comparar(desafio.codigoHash, hashDoCodigo(email, codigo));
}
