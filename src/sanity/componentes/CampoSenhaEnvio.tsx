import { Button, Card, Flex, Stack, Text, TextInput } from "@sanity/ui";
import { useState } from "react";
import { type StringInputProps, set, unset } from "sanity";

/**
 * A senha digitada fica só no estado local deste componente. O que vai para o
 * documento (e, portanto, para o dataset público) é sempre a versão cifrada
 * devolvida pelo servidor.
 */
export function CampoSenhaEnvio(props: StringInputProps) {
  const { value, onChange, readOnly } = props;
  const [editando, setEditando] = useState(!value);
  const [senha, setSenha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    setSalvando(true);
    setErro(null);

    try {
      const resposta = await fetch("/api/painel/cifrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });
      const dados = (await resposta.json()) as {
        cifrado?: string;
        mensagem?: string;
      };

      if (!resposta.ok || !dados.cifrado) {
        setErro(dados.mensagem ?? "Não foi possível guardar a senha agora.");
        return;
      }

      onChange(set(dados.cifrado));
      setSenha("");
      setEditando(false);
    } catch {
      setErro("Não conseguimos falar com o servidor. Tente de novo.");
    } finally {
      setSalvando(false);
    }
  }

  function remover() {
    onChange(unset());
    setSenha("");
    setEditando(true);
    setErro(null);
  }

  if (!editando) {
    return (
      <Card padding={3} radius={2} tone="positive" border>
        <Stack gap={3}>
          <Text size={1} weight="semibold">
            Senha guardada: ••••••••••••••••
          </Text>
          <Text size={1} muted>
            Ela fica embaralhada no banco de dados. Nem eu nem ninguém consegue
            ler de volta por aqui — se esquecer, é só cadastrar outra.
          </Text>
          {!readOnly && (
            <Flex gap={2}>
              <Button
                text="Trocar senha"
                mode="ghost"
                onClick={() => setEditando(true)}
              />
              <Button
                text="Remover"
                mode="bleed"
                tone="critical"
                onClick={remover}
              />
            </Flex>
          )}
        </Stack>
      </Card>
    );
  }

  return (
    <Stack gap={3}>
      <TextInput
        type="password"
        value={senha}
        placeholder="Cole aqui os 16 caracteres da senha de app"
        readOnly={readOnly}
        onChange={(evento) => setSenha(evento.currentTarget.value)}
      />

      <Flex gap={2}>
        <Button
          text={salvando ? "Guardando..." : "Guardar senha"}
          tone="primary"
          disabled={salvando || senha.trim().length === 0 || readOnly}
          onClick={salvar}
        />
        {value && (
          <Button
            text="Cancelar"
            mode="bleed"
            onClick={() => {
              setSenha("");
              setEditando(false);
              setErro(null);
            }}
          />
        )}
      </Flex>

      {erro && (
        <Card padding={3} radius={2} tone="critical" border>
          <Text size={1}>{erro}</Text>
        </Card>
      )}

      <Text size={1} muted>
        A senha de app é criada na Conta Google, em Segurança &gt; Verificação em
        duas etapas &gt; Senhas de app. Não use a senha normal da conta.
      </Text>
    </Stack>
  );
}
