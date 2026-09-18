import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

import { decifrar } from "./cripto";

export interface ConfiguracaoEnvio {
  remetente: string | null;
  senha: string | null;
  origem: "studio" | "ambiente" | "nenhuma";
}

/** Sem CDN: credencial trocada no Studio precisa valer na hora, sem esperar cache. */
const clienteSemCache = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

/**
 * O que estiver cadastrado no Studio tem prioridade. As variáveis de ambiente
 * continuam valendo como reserva, útil em desenvolvimento e para destravar o
 * acesso caso o documento de configuração fique inconsistente.
 */
export async function obterConfiguracaoEnvio(): Promise<ConfiguracaoEnvio> {
  try {
    const doc = await clienteSemCache.fetch<{
      emailEnvio?: string;
      senhaEnvio?: string;
    } | null>(`*[_id == "configuracoesGerais"][0]{ emailEnvio, senhaEnvio }`);

    const remetente = doc?.emailEnvio?.trim();
    const senha = decifrar(doc?.senhaEnvio);

    if (remetente && senha) {
      return { remetente, senha, origem: "studio" };
    }
  } catch (erro) {
    console.error("[painel] não foi possível ler a configuração de envio", erro);
  }

  const remetenteAmbiente = process.env.GMAIL_USUARIO?.trim();
  const senhaAmbiente = process.env.GMAIL_SENHA_APP?.trim();

  if (remetenteAmbiente && senhaAmbiente) {
    return {
      remetente: remetenteAmbiente,
      senha: senhaAmbiente,
      origem: "ambiente",
    };
  }

  return {
    remetente: remetenteAmbiente ?? null,
    senha: null,
    origem: "nenhuma",
  };
}
