import { projectId } from "@/sanity/env";

/**
 * O webhook informa quem alterou apenas pelo ID (via `identity()` no GROQ).
 * Para saber o e-mail é preciso consultar a API de usuários do Sanity, que
 * exige token. Sem token ou sem ID, devolve null e ninguém é excluído do aviso.
 */
const cache = new Map<string, string | null>();

export async function emailDeQuemAlterou(
  autorId: string | undefined,
): Promise<string | null> {
  if (!autorId) return null;

  const emCache = cache.get(autorId);
  if (emCache !== undefined) return emCache;

  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    console.info(
      "[webhook] SANITY_API_TOKEN não configurado: quem editou também receberá o aviso.",
    );
    return null;
  }

  try {
    const resposta = await fetch(
      `https://${projectId}.api.sanity.io/v2022-04-29/users/${autorId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (!resposta.ok) {
      console.error(
        "[webhook] não foi possível identificar quem alterou:",
        resposta.status,
      );
      return null;
    }

    const dados = (await resposta.json()) as { email?: unknown };
    const email =
      typeof dados.email === "string" ? dados.email.trim().toLowerCase() : null;

    cache.set(autorId, email);
    return email;
  } catch (erro) {
    console.error("[webhook] falha ao consultar quem alterou", erro);
    return null;
  }
}
