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
      // A folga sai de env(safe-area-inset-*): em celular com barra de gestos
      // ou tela com canto arredondado, 20px fixos deixam o botão encostado.
      className="fixed bottom-[calc(1.25rem_+_env(safe-area-inset-bottom))] right-[calc(1.25rem_+_env(safe-area-inset-right))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
    >
      <span className="scale-150">
        <WhatsAppIcon />
      </span>
    </a>
  );
}
