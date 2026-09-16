import type { Metadata } from "next";

import { FormularioLogin } from "@/components/painel/FormularioLogin";

export const metadata: Metadata = {
  title: "Acesso ao painel",
  robots: { index: false, follow: false },
};

export default async function LoginPainelPage({
  searchParams,
}: PageProps<"/painel/login">) {
  const params = await searchParams;
  const destino =
    typeof params.voltar === "string" && params.voltar.startsWith("/studio")
      ? params.voltar
      : "/studio";

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16">
      <FormularioLogin voltar={destino} />
    </div>
  );
}
