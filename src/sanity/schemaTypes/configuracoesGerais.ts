import { defineField, defineType } from "sanity";

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
      name: "emailsAdministradores",
      title: "E-mails dos administradores",
      description: "Recebem aviso por e-mail sempre que algo for publicado, editado ou excluído, e quando o armazenamento estiver ficando cheio.",
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
