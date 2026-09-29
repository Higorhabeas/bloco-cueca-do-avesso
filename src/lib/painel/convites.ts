import { projectId } from "@/sanity/env";

import { emailsPermitidos, normalizarEmail } from "./acesso";

const API_GLOBAL = "https://api.sanity.io/v2021-06-07";
const API_DO_PROJETO = `https://${projectId}.api.sanity.io/v2022-04-29`;

/** Quem é convidado pode editar conteúdo, mas não mexe em quem tem acesso. */
const PAPEL_DO_CONVITE = "editor";

function cabecalho(token: string) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * E-mails que já são membros do projeto ou têm convite pendente. Convidar de
 * novo não é recusado pelo Sanity, então sem esta checagem a pessoa receberia
 * um convite a cada vez que as configurações fossem salvas.
 */
async function emailsJaNoProjeto(tokenLeitura: string): Promise<Set<string>> {
  const conhecidos = new Set<string>();

  const projeto = await fetch(`${API_GLOBAL}/projects/${projectId}`, {
    headers: cabecalho(tokenLeitura),
  });

  if (projeto.ok) {
    const dados = (await projeto.json()) as {
      members?: { id: string; isRobot?: boolean }[];
    };
    const pessoas = (dados.members ?? []).filter((m) => !m.isRobot);

    // Os membros vêm só com id; o e-mail precisa ser buscado um a um.
    const emails = await Promise.all(
      pessoas.map(async (membro) => {
        const r = await fetch(`${API_DO_PROJETO}/users/${membro.id}`, {
          headers: cabecalho(tokenLeitura),
        });
        if (!r.ok) return null;
        const u = (await r.json()) as { email?: unknown };
        return typeof u.email === "string" ? u.email : null;
      }),
    );

    for (const email of emails) {
      if (email) conhecidos.add(normalizarEmail(email));
    }
  }

  const convites = await fetch(
    `${API_GLOBAL}/invitations/project/${projectId}`,
    { headers: cabecalho(tokenLeitura) },
  );

  if (convites.ok) {
    const lista = (await convites.json()) as unknown;
    for (const convite of Array.isArray(lista) ? lista : []) {
      const email = (convite as { email?: unknown })?.email;
      if (typeof email === "string") conhecidos.add(normalizarEmail(email));
    }
  }

  return conhecidos;
}

export interface ResultadoDosConvites {
  convidados: string[];
  motivo?: string;
}

/**
 * Convida para o projeto Sanity quem está na lista de administradores e ainda
 * não é membro. Assim o presidente do bloco cuida de tudo pelo Studio, sem
 * precisar abrir o painel da conta do Sanity.
 *
 * Só adiciona: tirar alguém da lista corta o acesso ao painel na hora, mas a
 * remoção do projeto continua sendo uma decisão manual e deliberada.
 */
export async function convidarNovosAdministradores(): Promise<ResultadoDosConvites> {
  const tokenLeitura = process.env.SANITY_API_TOKEN;
  const tokenConvites = process.env.SANITY_TOKEN_CONVITES;

  if (!tokenLeitura || !tokenConvites) {
    return { convidados: [], motivo: "tokens de convite não configurados" };
  }

  const desejados = await emailsPermitidos();
  if (desejados.length === 0) return { convidados: [], motivo: "lista vazia" };

  const jaEstao = await emailsJaNoProjeto(tokenLeitura);
  const faltantes = desejados.filter((email) => !jaEstao.has(email));

  const convidados: string[] = [];
  for (const email of faltantes) {
    const resposta = await fetch(
      `${API_GLOBAL}/invitations/project/${projectId}`,
      {
        method: "POST",
        headers: {
          ...cabecalho(tokenConvites),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role: PAPEL_DO_CONVITE }),
        redirect: "manual",
      },
    );

    if (resposta.ok) {
      convidados.push(email);
    } else {
      console.error(
        `[convites] não foi possível convidar ${email}:`,
        resposta.status,
        (await resposta.text()).slice(0, 200),
      );
    }
  }

  return { convidados };
}
