"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

type Props = {
  className?: string;
};

export default function ShareButton({ className }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const shareUrl = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url: shareUrl,
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copia este enlace", shareUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        void handleShare();
      }}
      className={className}
      aria-label={copied ? "Enlace copiado" : "Compartir esta página"}
      title={copied ? "Enlace copiado" : "Compartir esta página"}
    >
      <Icon name="share" />
    </button>
  );
}
