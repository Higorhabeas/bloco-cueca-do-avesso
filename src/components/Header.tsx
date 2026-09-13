import Link from "next/link";

import type { ConfiguracoesGerais } from "@/sanity/types";

import { SocialIcons } from "./SocialIcons";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/eventos", label: "Eventos" },
  { href: "/galeria", label: "Galeria" },
  { href: "/bateria", label: "Bateria" },
  { href: "/recados", label: "Recados" },
];

export function Header({ config }: { config: ConfiguracoesGerais | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-paper sm:text-2xl"
        >
          Cueca do Avesso
        </Link>

        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-paper/90">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {config && <SocialIcons config={config} className="text-paper" />}
      </div>

      <nav aria-label="Navegação principal (celular)" className="md:hidden">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-white/10 px-4 py-2 text-xs font-medium text-paper/90">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition hover:text-accent">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
