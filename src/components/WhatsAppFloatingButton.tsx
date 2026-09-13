import type { ConfiguracoesGerais } from "@/sanity/types";

import { WhatsAppIcon } from "./SocialIcons";

export function WhatsAppFloatingButton({
  config,
}: {
  config: ConfiguracoesGerais | null;
}) {
  if (!config?.whatsappNumero) return null;

  const href = `https://wa.me/${config.whatsappNumero}?text=${encodeURIComponent(
    config.whatsappMensagemPadrao ?? "",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
    >
      <span className="scale-150">
        <WhatsAppIcon />
      </span>
    </a>
  );
}
