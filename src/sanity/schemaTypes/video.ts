import { defineField, defineType } from "sanity";

export default defineType({
  name: "video",
  title: "Vídeo",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Link do vídeo",
      description: "Cole aqui o link do YouTube, Instagram ou outro serviço. Não faça upload do arquivo de vídeo.",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "capa",
      title: "Imagem de capa (opcional)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "legenda",
      title: "Legenda",
      type: "string",
    }),
    defineField({
      name: "evento",
      title: "Evento",
      type: "reference",
      to: [{ type: "evento" }],
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "evento.titulo", media: "capa" },
  },
});
