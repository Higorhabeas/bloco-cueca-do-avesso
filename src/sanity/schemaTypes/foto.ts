import { defineField, defineType } from "sanity";

export default defineType({
  name: "foto",
  title: "Foto",
  type: "document",
  fields: [
    defineField({
      name: "imagem",
      title: "Imagem",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: "alt",
          title: "Descrição da imagem",
          type: "string",
          description: "Uma frase curta descrevendo a imagem, para acessibilidade.",
        }),
      ],
    }),
    defineField({
      name: "legenda",
      title: "Legenda",
      type: "string",
    }),
    defineField({
      name: "evento",
      title: "Evento",
      description: "A qual evento esta foto pertence. Ajuda a organizar a galeria.",
      type: "reference",
      to: [{ type: "evento" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "legenda", subtitle: "evento.titulo", media: "imagem" },
    prepare({ title, subtitle, media }) {
      return { title: title || "(sem legenda)", subtitle, media };
    },
  },
});
