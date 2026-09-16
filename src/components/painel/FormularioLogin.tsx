"use client";

import { useRef, useState } from "react";

type Etapa = "email" | "codigo";

export function FormularioLogin({ voltar }: { voltar: string }) {
  const [etapa, setEtapa] = useState<Etapa>("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [recado, setRecado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const campoCodigoRef = useRef<HTMLInputElement>(null);

  async function pedirCodigo(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    setRecado(null);

    try {
      const resposta = await fetch("/api/painel/codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const dados = (await resposta.json()) as {
        mensagem: string;
        codigoLocal?: string;
      };

      if (!resposta.ok) {
        setErro(dados.mensagem);
        return;
      }

      setRecado(
        dados.codigoLocal
          ? `Ambiente local, sem e-mail configurado ainda: use o código ${dados.codigoLocal}.`
          : dados.mensagem,
      );
      setEtapa("codigo");
      requestAnimationFrame(() => campoCodigoRef.current?.focus());
    } catch {
      setErro("Não conseguimos falar com o servidor. Tente de novo em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  async function entrar(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);

    try {
      const resposta = await fetch("/api/painel/entrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });
      const dados = (await resposta.json()) as {
        mensagem: string;
        reiniciar?: boolean;
      };

      if (!resposta.ok) {
        setErro(dados.mensagem);
        if (dados.reiniciar) {
          setEtapa("email");
          setCodigo("");
          setRecado(null);
        }
        return;
      }

      window.location.href = voltar;
    } catch {
      setErro("Não conseguimos falar com o servidor. Tente de novo em instantes.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
      <h1 className="font-display text-2xl font-bold text-ink">
        Acesso ao painel
      </h1>
      <p className="mt-2 text-sm text-body-text-muted">
        Esta área é do pessoal que cuida do site. Enviamos um código para o seu
        e-mail para confirmar que é você.
      </p>

      {etapa === "email" ? (
        <form onSubmit={pedirCodigo} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-ink">
              Seu e-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              className="rounded-xl border border-black/15 bg-paper px-4 py-2.5 text-base outline-none focus:border-brand"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="rounded-full bg-brand px-5 py-2.5 font-semibold text-paper transition hover:bg-brand-dark disabled:opacity-60"
          >
            {enviando ? "Enviando..." : "Receber código"}
          </button>
        </form>
      ) : (
        <form onSubmit={entrar} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="codigo" className="text-sm font-semibold text-ink">
              Código de 6 dígitos
            </label>
            <input
              id="codigo"
              ref={campoCodigoRef}
              type="text"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={codigo}
              onChange={(evento) =>
                setCodigo(evento.target.value.replace(/\D/g, ""))
              }
              className="rounded-xl border border-black/15 bg-paper px-4 py-2.5 text-center text-2xl tracking-[0.4em] outline-none focus:border-brand"
            />
            <p className="text-xs text-body-text-muted">
              O código vale por 10 minutos.
            </p>
          </div>

          <button
            type="submit"
            disabled={enviando || codigo.length < 6}
            className="rounded-full bg-brand px-5 py-2.5 font-semibold text-paper transition hover:bg-brand-dark disabled:opacity-60"
          >
            {enviando ? "Conferindo..." : "Entrar no painel"}
          </button>

          <button
            type="button"
            onClick={() => {
              setEtapa("email");
              setCodigo("");
              setErro(null);
              setRecado(null);
            }}
            className="text-sm font-semibold text-brand underline underline-offset-2"
          >
            Usar outro e-mail
          </button>
        </form>
      )}

      <div aria-live="polite" className="mt-4 empty:mt-0">
        {recado && !erro && (
          <p className="rounded-xl bg-paper-muted px-4 py-3 text-sm text-body-text">
            {recado}
          </p>
        )}
        {erro && (
          <p className="rounded-xl bg-brand/10 px-4 py-3 text-sm font-medium text-brand-dark">
            {erro}
          </p>
        )}
      </div>
    </div>
  );
}
