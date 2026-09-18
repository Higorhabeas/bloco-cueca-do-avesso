import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

/** Evita consultar o Sanity a cada request do Studio. Tirar alguém da lista leva até isso para valer. */
const VALIDADE_CACHE_MS = 30_000;

const clienteSemCache = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

let cache: { lista: string[]; expiraEm: number } | null = null;

export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Lista de emergência, fora do Studio. Serve para não trancar ninguém do lado de
 * fora caso o documento de configuração fique vazio ou inacessível.
 */
function emailsDeEmergencia(): string[] {
  return (process.env.PAINEL_EMAILS_PERMITIDOS ?? "")
    .split(",")
    .map(normalizarEmail)
    .filter(Boolean);
}

async function emailsDoStudio(): Promise<string[]> {
  try {
    const lista = await clienteSemCache.fetch<string[] | null>(
      `*[_id == "configuracoesGerais"][0].emailsAdministradores`,
    );
    return (lista ?? []).map(normalizarEmail).filter(Boolean);
  } catch (erro) {
    console.error("[painel] não foi possível ler a lista de administradores", erro);
    return [];
  }
}

export async function emailsPermitidos(): Promise<string[]> {
  if (cache && cache.expiraEm > Date.now()) return cache.lista;

  const lista = [
    ...new Set([...(await emailsDoStudio()), ...emailsDeEmergencia()]),
  ];
  cache = { lista, expiraEm: Date.now() + VALIDADE_CACHE_MS };
  return lista;
}

export async function podeAcessarPainel(email: string): Promise<boolean> {
  return (await emailsPermitidos()).includes(normalizarEmail(email));
}
