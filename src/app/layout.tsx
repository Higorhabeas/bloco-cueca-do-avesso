import type { Metadata, Viewport } from "next";
import { Fredoka, Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { getConfiguracoesGerais, getPatrocinadores } from "@/sanity/queries";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Cueca do Avesso",
    template: "%s | Cueca do Avesso",
  },
  description:
    "Bloco de carnaval de rua Cueca do Avesso: eventos, fotos, recados e tudo sobre o nosso carnaval.",
};

export const viewport: Viewport = {
  // Mesmo roxo do cabeçalho: no celular a barra do navegador deixa de destoar
  // e a página parece começar no topo da tela.
  themeColor: "#8b008b",
  // O site só tem tema claro. Sem dizer isso, o navegador em modo escuro
  // inverte campos de formulário e barras de rolagem por conta própria.
  colorScheme: "light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [config, patrocinadores] = await Promise.all([
    getConfiguracoesGerais(),
    getPatrocinadores(),
  ]);

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-body-text">
        <a
          href="#conteudo-principal"
          className="sr-only-focusable fixed left-4 top-4 z-50 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-paper"
        >
          Pular para o conteúdo
        </a>
        <Header config={config} />
        <main id="conteudo-principal" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer config={config} patrocinadores={patrocinadores} />
        <WhatsAppFloatingButton config={config} />
      </body>
    </html>
  );
}
