import { defineField, defineType } from "sanity";

export default defineType({
  name: "historiaDoBloco",
  title: "História do Bloco",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      initialValue: "Nossa História",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "texto",
      title: "Texto",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Descrição da imagem", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "fotosAntigas",
      title: "Fotos históricas",
      description: "Fotos antigas do bloco para ilustrar a linha do tempo.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Descrição da imagem", type: "string" }),
            defineField({ name: "ano", title: "Ano (opcional)", type: "string" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "História do Bloco" };
    },
  },
});
