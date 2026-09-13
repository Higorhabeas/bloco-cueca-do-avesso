import type { ConfiguracoesGerais } from "@/sanity/types";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77a4.9 4.9 0 0 1 1.77-1.15c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.87.04-1.34.18-1.66.3-.42.16-.72.36-1.03.67-.31.31-.51.61-.67 1.03-.12.32-.26.79-.3 1.66C4.24 8.51 4.23 8.83 4.23 12s.01 3.49.06 4.54c.04.87.18 1.34.3 1.66.16.42.36.72.67 1.03.31.31.61.51 1.03.67.32.12.79.26 1.66.3 1.05.05 1.37.06 4.05.06s3-.01 4.05-.06c.87-.04 1.34-.18 1.66-.3.42-.16.72-.36 1.03-.67.31-.31.51-.61.67-1.03.12-.32.26-.79.3-1.66.05-1.05.06-1.37.06-4.54s-.01-3.49-.06-4.54c-.04-.87-.18-1.34-.3-1.66a2.76 2.76 0 0 0-.67-1.03 2.76 2.76 0 0 0-1.03-.67c-.32-.12-.79-.26-1.66-.3C15 3.81 14.68 3.8 12 3.8Zm0 3.06a5.14 5.14 0 1 1 0 10.28 5.14 5.14 0 0 1 0-10.28Zm0 1.8a3.34 3.34 0 1 0 0 6.68 3.34 3.34 0 0 0 0-6.68Zm5.34-1.98a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M13.5 21v-7.6h2.55l.38-2.96h-2.93V8.55c0-.86.24-1.44 1.47-1.44h1.57V4.46A21 21 0 0 0 14.3 4.3c-2.24 0-3.78 1.37-3.78 3.87v2.16H8v2.97h2.52V21h2.98Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12.03 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.47 1.33 4.98L2 22l5.2-1.36a9.93 9.93 0 0 0 4.83 1.23h.01c5.5 0 9.96-4.46 9.96-9.96S17.53 2 12.03 2Zm0 18.22a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.09.81.82-3.01-.2-.31a8.24 8.24 0 1 1 6.96 3.84Zm4.52-6.17c-.25-.12-1.46-.72-1.68-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.04 0 1.2.88 2.37 1 2.53.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.51.59.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.28Z" />
    </svg>
  );
}

export function SocialIcons({
  config,
  className = "",
}: {
  config: Pick<ConfiguracoesGerais, "instagramUrl" | "facebookUrl" | "whatsappNumero" | "whatsappMensagemPadrao">;
  className?: string;
}) {
  const whatsappHref = config.whatsappNumero
    ? `https://wa.me/${config.whatsappNumero}?text=${encodeURIComponent(
        config.whatsappMensagemPadrao ?? "",
      )}`
    : null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {config.instagramUrl && (
        <a
          href={config.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram do Cueca do Avesso"
          className="transition hover:text-accent"
        >
          <InstagramIcon />
        </a>
      )}
      {config.facebookUrl && (
        <a
          href={config.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook do Cueca do Avesso"
          className="transition hover:text-accent"
        >
          <FacebookIcon />
        </a>
      )}
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp do Cueca do Avesso"
          className="transition hover:text-accent"
        >
          <WhatsAppIcon />
        </a>
      )}
    </div>
  );
}

export { WhatsAppIcon };
