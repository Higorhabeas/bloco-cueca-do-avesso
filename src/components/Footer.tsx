import Link from "next/link";

import type { ConfiguracoesGerais, Patrocinador } from "@/sanity/types";

import { FaixaPatrocinadores } from "./FaixaPatrocinadores";
import { SocialIcons } from "./SocialIcons";

const FOOTER_LINKS = [
  { href: "/sobre", label: "Sobre o bloco" },
  { href: "/eventos", label: "Eventos" },
  { href: "/galeria", label: "Galeria" },
  { href: "/bateria", label: "Bateria" },
  { href: "/recados", label: "Recados" },
  { href: "/parceiros", label: "Nossos parceiros" },
];

export function Footer({
  config,
  patrocinadores,
}: {
  config: ConfiguracoesGerais | null;
  patrocinadores: Patrocinador[];
}) {
  const ano = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-topo text-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold">Cueca do Avesso</p>
          {config?.textoInstitucional && (
            <p className="mt-2 max-w-xs text-sm text-paper/80">
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
            <p className="mt-3 text-sm text-paper/80">Em breve.</p>
          )}
        </div>
      </div>

      <FaixaPatrocinadores lista={patrocinadores} />

      <div className="flex flex-col items-center gap-2 border-t border-white/10 px-4 py-4 text-center text-xs text-paper/80 sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p>© {ano} Cueca do Avesso. Feito com carinho pra rua.</p>
        <a
          href="/studio"
          target="_blank"
          rel="noopener noreferrer"
          className="transition hover:text-accent"
        >
          Área do organizador
          <span className="sr-only"> (abre em uma nova aba)</span>
        </a>
      </div>
    </footer>
  );
}
