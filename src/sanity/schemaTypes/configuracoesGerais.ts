import { defineField, defineType } from "sanity";

import { CampoSenhaEnvio } from "../componentes/CampoSenhaEnvio";
import { StatusEnvioEmail } from "../componentes/StatusEnvioEmail";

export default defineType({
  name: "configuracoesGerais",
  title: "Configurações Gerais",
  type: "document",
  fields: [
    defineField({
      name: "whatsappNumero",
      title: "Número do WhatsApp",
      description: "Com código do país e DDD, só números. Exemplo: 5531999999999",
      type: "string",
    }),
    defineField({
      name: "whatsappMensagemPadrao",
      title: "Mensagem padrão do WhatsApp",
      description: "Texto que já vem preenchido quando alguém clica no botão de WhatsApp do site.",
      type: "string",
      initialValue: "Olá! Vim pelo site do Cueca do Avesso :)",
    }),
    defineField({
      name: "instagramUrl",
      title: "Link do Instagram",
      type: "url",
    }),
    defineField({
      name: "facebookUrl",
      title: "Link do Facebook (opcional)",
      type: "url",
    }),
    defineField({
      name: "textoInstitucional",
      title: "Texto institucional curto",
      description: "Frase de efeito usada na home e no rodapé.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "statusEnvioEmail",
      title: "Situação do envio de e-mail",
      type: "string",
      readOnly: true,
      components: { input: StatusEnvioEmail },
    }),
    defineField({
      name: "emailEnvio",
      title: "E-mail do bloco (remetente)",
      description:
        "Conta do Gmail que dispara os códigos de acesso e os avisos. É esse endereço que aparece como remetente.",
      type: "string",
      validation: (rule) =>
        rule.email().error("Digite um endereço de e-mail válido."),
    }),
    defineField({
      name: "senhaEnvio",
      title: "Senha de app do e-mail do bloco",
      description:
        "Fica embaralhada no banco de dados, nunca em texto puro. Só o servidor consegue desembaralhar na hora de enviar.",
      type: "string",
      components: { input: CampoSenhaEnvio },
    }),
    defineField({
      name: "emailsAdministradores",
      title: "E-mails dos administradores",
      description:
        "Quem está nesta lista pode entrar no painel (recebe o código de acesso) e é avisado quando algo é publicado, editado ou excluído. Tirar alguém daqui corta o acesso em até 1 minuto. Atenção: esta lista é pública, qualquer pessoa consegue lê-la — não inclua e-mails que você não queira expor. Lembre que a pessoa também precisa de convite no manage.sanity.io para conseguir editar o conteúdo.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "limiteAvisoArmazenamentoGB",
      title: "Avisar quando o armazenamento passar de (GB)",
      type: "number",
      initialValue: 4,
      description: "O plano gratuito do Sanity tem 5GB. Recomendamos avisar em 4GB.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Configurações Gerais" };
    },
  },
});
