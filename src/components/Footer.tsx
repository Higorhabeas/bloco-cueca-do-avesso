import Link from "next/link";

import type { ConfiguracoesGerais } from "@/sanity/types";

import { SocialIcons } from "./SocialIcons";

const FOOTER_LINKS = [
  { href: "/sobre", label: "Sobre o bloco" },
  { href: "/eventos", label: "Eventos" },
  { href: "/galeria", label: "Galeria" },
  { href: "/bateria", label: "Bateria" },
  { href: "/recados", label: "Recados" },
];

export function Footer({ config }: { config: ConfiguracoesGerais | null }) {
  const ano = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold">Cueca do Avesso</p>
          {config?.textoInstitucional && (
            <p className="mt-2 max-w-xs text-sm text-paper/70">
              {config.textoInstitucional}
            </p>
          )}
        </div>

        <nav aria-label="Links do rodapé">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Navegue
          </p>
          <ul className="mt-3 space-y-2 text-sm text-paper/80">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Redes sociais
          </p>
          {config ? (
            <SocialIcons config={config} className="mt-3" />
          ) : (
            <p className="mt-3 text-sm text-paper/60">Em breve.</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-paper/60 sm:px-6">
        © {ano} Cueca do Avesso. Feito com carinho pra rua.
      </div>
    </footer>
  );
}
