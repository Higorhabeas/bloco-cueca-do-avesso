import type { Metadata } from "next";
import { Fredoka, Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { getConfiguracoesGerais } from "@/sanity/queries";

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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const config = await getConfiguracoesGerais();

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-body-text">
        <Header config={config} />
        <main className="flex-1">{children}</main>
        <Footer config={config} />
        <WhatsAppFloatingButton config={config} />
      </body>
    </html>
  );
}
