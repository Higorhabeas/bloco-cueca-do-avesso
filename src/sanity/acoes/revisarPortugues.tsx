import { Box, Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { useCallback, useState } from "react";
import type { DocumentActionComponent } from "sanity";

interface Problema {
  mensagem: string;
  trecho: string;
  sugestoes: string[];
}

/** Campos que não são texto escrito por pessoa (ids, links, marcações de formatação). */
const CHAVES_IGNORADAS = new Set([
  "_id",
  "_type",
  "_rev",
  "_key",
  "_ref",
  "_weak",
  "_createdAt",
  "_updatedAt",
  "current",
  "marks",
  "markDefs",
  "style",
  "listItem",
  "level",
  "asset",
  "hotspot",
  "crop",
  "whatsappNumero",
]);

function extrairTexto(valor: unknown, chave = ""): string[] {
  if (typeof valor === "string") {
    if (CHAVES_IGNORADAS.has(chave) || chave.toLowerCase().endsWith("url")) {
      return [];
    }
    return [valor];
  }
  if (Array.isArray(valor)) {
    return valor.flatMap((item) => extrairTexto(item));
  }
  if (valor && typeof valor === "object") {
    return Object.entries(valor).flatMap(([nome, conteudo]) =>
      CHAVES_IGNORADAS.has(nome) ? [] : extrairTexto(conteudo, nome),
    );
  }
  return [];
}

export const revisarPortuguesAction: DocumentActionComponent = (props) => {
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [problemas, setProblemas] = useState<Problema[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const documento = props.draft ?? props.published;

  const revisar = useCallback(async () => {
    setAberto(true);
    setCarregando(true);
    setErro(null);
    setProblemas(null);

    const texto = extrairTexto(documento).join("\n\n").trim();

    if (!texto) {
      setErro("Não há texto para revisar neste documento.");
      setCarregando(false);
      return;
    }

    try {
      const resposta = await fetch("/api/painel/revisar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      const dados = (await resposta.json()) as {
        problemas?: Problema[];
        mensagem?: string;
      };

      if (!resposta.ok) {
        setErro(dados.mensagem ?? "Não foi possível revisar agora.");
        return;
      }

      setProblemas(dados.problemas ?? []);
    } catch {
      setErro(
        "Não conseguimos falar com o serviço de revisão agora. Tente de novo em instantes.",
      );
    } finally {
      setCarregando(false);
    }
  }, [documento]);

  return {
    label: "Revisar português",
    onHandle: revisar,
    dialog: aberto && {
      type: "dialog" as const,
      header: "Revisão de português",
      width: "medium" as const,
      onClose: () => {
        setAberto(false);
        props.onComplete();
      },
      content: (
        <Box padding={4}>
          {carregando && (
            <Flex align="center" gap={3}>
              <Spinner muted />
              <Text size={1} muted>
                Lendo o texto...
              </Text>
            </Flex>
          )}

          {erro && (
            <Card padding={3} radius={2} tone="caution">
              <Text size={1}>{erro}</Text>
            </Card>
          )}

          {problemas?.length === 0 && (
            <Card padding={3} radius={2} tone="positive">
              <Text size={1}>
                Nenhum problema encontrado. O texto está pronto para publicar.
              </Text>
            </Card>
          )}

          {problemas && problemas.length > 0 && (
            <Stack gap={4}>
              <Text size={1} muted>
                {problemas.length === 1
                  ? "1 ponto para conferir:"
                  : `${problemas.length} pontos para conferir:`}
              </Text>
              {problemas.map((problema, indice) => (
                <Card key={indice} padding={3} radius={2} shadow={1} tone="caution">
                  <Stack gap={3}>
                    <Text size={1} weight="semibold">
                      {problema.trecho}
                    </Text>
                    <Text size={1}>{problema.mensagem}</Text>
                    {problema.sugestoes.length > 0 && (
                      <Text size={1} muted>
                        Trocar por: {problema.sugestoes.join("  ·  ")}
                      </Text>
                    )}
                  </Stack>
                </Card>
              ))}
              <Text size={0} muted>
                O corretor confere acentuação, digitação e crase. Concordância
                ainda precisa da sua leitura.
              </Text>
            </Stack>
          )}
        </Box>
      ),
    },
  };
};
