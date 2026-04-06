"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { CONTACT_EMAIL } from "@/lib/constants";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();
    if (!normalizedEmail) return;

    const subject = encodeURIComponent(
      "Quiero unirme a la newsletter de Bubble Tea España"
    );
    const body = encodeURIComponent(
      `Hola,\n\nQuiero apuntarme a la newsletter.\n\nEmail: ${normalizedEmail}\n`
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Tu email"
        className="form-control flex-grow"
      />
      <button
        type="submit"
        className="btn btn-primary btn-icon"
        aria-label="Solicitar alta en la newsletter"
      >
        <Icon name="send" />
      </button>
    </form>
  );
}
