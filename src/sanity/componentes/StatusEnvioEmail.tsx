import { Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { useEffect, useState } from "react";

interface Status {
  configurado: boolean;
  remetente: string | null;
  faltaSenha: boolean;
  origem: "studio" | "ambiente" | "nenhuma";
  emProducao: boolean;
}

export function StatusEnvioEmail() {
  const [status, setStatus] = useState<Status | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;

    fetch("/api/painel/status-email")
      .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject()))
      .then((dados: Status) => {
        if (ativo) setStatus(dados);
      })
      .catch(() => {
        if (ativo) setErro(true);
      });

    return () => {
      ativo = false;
    };
  }, []);

  if (erro) {
    return (
      <Card padding={3} radius={2} tone="caution" border>
        <Text size={1}>
          Não foi possível conferir o envio de e-mail agora. Recarregue a página.
        </Text>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card padding={3} radius={2} tone="transparent" border>
        <Flex align="center" gap={3}>
          <Spinner muted />
          <Text size={1} muted>
            Conferindo...
          </Text>
        </Flex>
      </Card>
    );
  }

  if (status.configurado) {
    return (
      <Card padding={3} radius={2} tone="positive" border>
        <Stack gap={2}>
          <Text size={1} weight="semibold">
            Envio de e-mail ativo
          </Text>
          <Text size={1}>
            Os avisos saem de <strong>{status.remetente}</strong>.
          </Text>
          {status.origem === "ambiente" && (
            <Text size={1} muted>
              Usando a configuração do servidor. Se preencher os campos abaixo,
              eles passam a valer no lugar.
            </Text>
          )}
        </Stack>
      </Card>
    );
  }

  return (
    <Card padding={3} radius={2} tone="caution" border>
      <Stack gap={3}>
        <Text size={1} weight="semibold">
          {status.faltaSenha
            ? "Falta a senha de app"
            : "Envio de e-mail ainda não configurado"}
        </Text>
        <Text size={1}>
          {status.faltaSenha
            ? `O endereço ${status.remetente} está cadastrado, mas ainda falta guardar a senha de app logo abaixo.`
            : "Preencha os dois campos abaixo para que os códigos e avisos passem a ser enviados."}
        </Text>
        {!status.emProducao && (
          <Text size={1} muted>
            Aqui no ambiente local o código de acesso aparece direto na tela de
            login, então dá para testar o painel mesmo sem isso.
          </Text>
        )}
      </Stack>
    </Card>
  );
}
