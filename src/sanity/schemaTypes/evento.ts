import { defineField, defineType } from "sanity";

export default defineType({
  name: "evento",
  title: "Evento",
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
      name: "data",
      title: "Data e hora",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "local",
      title: "Local",
      type: "string",
    }),
    defineField({
      name: "descricao",
      title: "Descrição",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "imagemCapa",
      title: "Imagem de capa",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descrição da imagem",
          type: "string",
          description: "Uma frase curta descrevendo a imagem, para acessibilidade.",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "local", media: "imagemCapa" },
  },
});
