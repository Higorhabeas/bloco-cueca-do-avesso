import { defineField, defineType } from "sanity";

export default defineType({
  name: "recado",
  title: "Recado / Notícia",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Endereço no site",
      type: "slug",
      description: "Gerado a partir do título. Não precisa mexer.",
      options: { source: "titulo", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "dataPublicacao",
      title: "Data de publicação",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "texto",
      title: "Texto",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imagem",
      title: "Imagem (opcional)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descrição da imagem",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "eventoRelacionado",
      title: "Evento relacionado (opcional)",
      type: "reference",
      to: [{ type: "evento" }],
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "dataPublicacao", media: "imagem" },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString("pt-BR") : "",
        media,
      };
    },
  },
});
