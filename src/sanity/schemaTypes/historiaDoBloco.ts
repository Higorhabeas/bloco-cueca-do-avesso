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
      name: "imagemTitulo",
      title: "Imagem do título (opcional)",
      description:
        "Se preencher, esta imagem aparece na página no lugar do título escrito. O título acima continua valendo para a aba do navegador, para buscas e para quem usa leitor de tela.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descrição da imagem",
          description:
            "O que está escrito ou representado na imagem. É lido por quem não enxerga. Em branco, usamos o título acima.",
          type: "string",
        }),
        defineField({
          name: "legenda",
          title: "Legenda (opcional)",
          description: "Texto curto exibido logo abaixo da imagem.",
          type: "string",
        }),
      ],
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
