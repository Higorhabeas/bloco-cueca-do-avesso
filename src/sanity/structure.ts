import type { StructureResolver } from "sanity/structure";

const SINGLETON_TYPES = new Set(["historiaDoBloco", "configuracoesGerais"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Conteúdo")
    .items([
      S.documentTypeListItem("evento").title("Eventos"),
      S.documentTypeListItem("recado").title("Recados / Notícias"),
      S.documentTypeListItem("foto").title("Fotos"),
      S.documentTypeListItem("video").title("Vídeos"),
      S.documentTypeListItem("membroBateria").title("Bateria"),
      S.divider(),
      S.listItem()
        .title("História do Bloco")
        .child(
          S.document().schemaType("historiaDoBloco").documentId("historiaDoBloco"),
        ),
      S.listItem()
        .title("Configurações Gerais")
        .child(
          S.document()
            .schemaType("configuracoesGerais")
            .documentId("configuracoesGerais"),
        ),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? "") &&
          !["evento", "recado", "foto", "video", "membroBateria"].includes(item.getId() ?? ""),
      ),
    ]);
