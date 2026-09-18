import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

const PREFIXO = "v1";

/**
 * Deriva a chave de criptografia do mesmo segredo que assina os cookies do painel,
 * para não exigir uma segunda variável de ambiente.
 */
function chave(): Buffer {
  const segredo = process.env.PAINEL_SEGREDO;
  if (!segredo || segredo.length < 32) {
    throw new Error(
      "PAINEL_SEGREDO não está configurado (precisa de pelo menos 32 caracteres).",
    );
  }
  return createHash("sha256").update(`${segredo}:envio-de-email`).digest();
}

export function cifrar(textoPuro: string): string {
  const iv = randomBytes(12);
  const cifrador = createCipheriv("aes-256-gcm", chave(), iv);
  const conteudo = Buffer.concat([
    cifrador.update(textoPuro, "utf8"),
    cifrador.final(),
  ]);
  return [
    PREFIXO,
    iv.toString("base64url"),
    cifrador.getAuthTag().toString("base64url"),
    conteudo.toString("base64url"),
  ].join(":");
}

/** Devolve null quando o valor não é decifrável (segredo trocado, valor corrompido). */
export function decifrar(valor: string | undefined): string | null {
  if (!valor) return null;

  const [prefixo, ivB64, tagB64, conteudoB64] = valor.split(":");
  if (prefixo !== PREFIXO || !ivB64 || !tagB64 || !conteudoB64) return null;

  try {
    const decifrador = createDecipheriv(
      "aes-256-gcm",
      chave(),
      Buffer.from(ivB64, "base64url"),
    );
    decifrador.setAuthTag(Buffer.from(tagB64, "base64url"));
    return Buffer.concat([
      decifrador.update(Buffer.from(conteudoB64, "base64url")),
      decifrador.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}

export function pareceCifrado(valor: string | undefined): boolean {
  return Boolean(valor?.startsWith(`${PREFIXO}:`));
}
