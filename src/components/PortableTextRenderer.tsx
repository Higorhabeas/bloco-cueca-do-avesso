import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";

import { urlFor } from "@/sanity/image";
import type { SanityImage } from "@/sanity/types";
import type { PortableTextBlock } from "@portabletext/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mb-3 mt-8 font-display text-2xl font-semibold text-ink">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-6 font-display text-xl font-semibold text-ink">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-4 border-brand pl-4 italic text-body-text-muted">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-1 pl-6">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand underline underline-offset-2"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: { value: SanityImage }) => {
      const url = urlFor(value).width(1200).fit("max").url();
      return (
        <span className="my-6 block overflow-hidden rounded-xl">
          <Image
            src={url}
            alt={value.alt ?? ""}
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
          />
        </span>
      );
    },
  },
};

export function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
