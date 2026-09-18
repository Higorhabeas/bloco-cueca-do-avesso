import nodemailer from "nodemailer";

import { obterConfiguracaoEnvio } from "./configuracaoEnvio";

/**
 * Devolve `true` quando não havia remetente configurado e o código ficou só no
 * terminal. Isso só acontece fora de produção: em produção, sem configuração,
 * o envio falha em vez de expor o código.
 */
export async function enviarCodigoPorEmail(
  email: string,
  codigo: string,
): Promise<boolean> {
  const { remetente, senha } = await obterConfiguracaoEnvio();

  if (!remetente || !senha) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "O e-mail do bloco e a senha de app precisam estar cadastrados em Configurações Gerais para enviar o código.",
      );
    }
    console.info(
      `\n[painel] Código de acesso para ${email}: ${codigo}\n(em produção isso vai por e-mail; aqui aparece no terminal porque o remetente ainda não foi cadastrado)\n`,
    );
    return true;
  }

  const transporte = nodemailer.createTransport({
    service: "gmail",
    auth: { user: remetente, pass: senha },
  });

  await transporte.sendMail({
    from: `"Cueca do Avesso" <${remetente}>`,
    to: email,
    subject: `${codigo} é o seu código de acesso ao painel`,
    text: [
      "Olá!",
      "",
      `Seu código de acesso ao painel do Cueca do Avesso é: ${codigo}`,
      "",
      "Ele vale por 10 minutos e só pode ser usado uma vez.",
      "Se não foi você que pediu, pode ignorar este e-mail.",
    ].join("\n"),
  });

  return false;
}
