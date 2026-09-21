import { defineField, defineType } from "sanity";

export default defineType({
  name: "patrocinador",
  title: "Patrocinador",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome da empresa",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logomarca",
      description:
        "De preferência com fundo transparente (PNG) ou fundo branco. Quanto maior o arquivo, melhor fica na tela.",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "site",
      title: "Site da empresa",
      description:
        "Endereço completo, começando com https://. É para onde o visitante vai ao clicar na logomarca.",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "nivel",
      title: "Tipo de patrocínio",
      description:
        "Define a ordem de exibição no site. Os Master também aparecem no carrossel da página inicial.",
      type: "string",
      initialValue: "comum",
      options: {
        list: [
          { title: "Master", value: "master" },
          { title: "Ouro", value: "ouro" },
          { title: "Prata", value: "prata" },
          { title: "Comum", value: "comum" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "nome", subtitle: "nivel", media: "logo" },
    prepare({ title, subtitle, media }) {
      const rotulos: Record<string, string> = {
        master: "Master",
        ouro: "Ouro",
        prata: "Prata",
        comum: "Comum",
      };
      return {
        title,
        subtitle: rotulos[subtitle as string] ?? subtitle,
        media,
      };
    },
  },
});
