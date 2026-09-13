import { defineField, defineType } from "sanity";

export default defineType({
  name: "membroBateria",
  title: "Membro da Bateria",
  type: "document",
  fields: [
    defineField({
      name: "foto",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nomeApelido",
      title: "Nome / Apelido",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "funcao",
      title: "Função",
      description: "Exemplos: Surdo de Segunda, Caixa, Repique, Rainha de Bateria, Mestre de Bateria.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ordem",
      title: "Ordem de exibição",
      description: "Números menores aparecem primeiro. Deixe em branco para ordem alfabética.",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Ordem de exibição",
      name: "ordemAsc",
      by: [{ field: "ordem", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "nomeApelido", subtitle: "funcao", media: "foto" },
  },
});
