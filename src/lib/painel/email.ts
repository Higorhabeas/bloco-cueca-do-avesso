import nodemailer from "nodemailer";

/**
 * Devolve `true` quando não havia Gmail configurado e o código ficou só no terminal.
 * Isso só acontece fora de produção: em produção, sem Gmail configurado, o envio falha.
 */
export async function enviarCodigoPorEmail(
  email: string,
  codigo: string,
): Promise<boolean> {
  const usuario = process.env.GMAIL_USUARIO;
  const senha = process.env.GMAIL_SENHA_APP;

  if (!usuario || !senha) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "GMAIL_USUARIO e GMAIL_SENHA_APP precisam estar configurados para enviar o código.",
      );
    }
    console.info(
      `\n[painel] Código de acesso para ${email}: ${codigo}\n(em produção isso vai por e-mail; aqui aparece no terminal porque o Gmail ainda não foi configurado)\n`,
    );
    return true;
  }

  const transporte = nodemailer.createTransport({
    service: "gmail",
    auth: { user: usuario, pass: senha },
  });

  await transporte.sendMail({
    from: `"Cueca do Avesso" <${usuario}>`,
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
