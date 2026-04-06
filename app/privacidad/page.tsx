import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacidad | Bubble Tea España",
  description:
    "Información básica sobre privacidad y tratamiento de datos en Bubble Tea España.",
};

export default function PrivacyPage() {
  return (
    <>
      <main className="pt-24 px-6 pb-24">
        <section className="max-w-3xl mx-auto">
          <p className="section-kicker">Privacidad</p>
          <h1 className="section-title section-title-lg mb-8">
            Política de privacidad
          </h1>
          <div className="space-y-6 section-copy-lg">
            <p>
              Bubble Tea España es una guía editorial. Intentamos recoger solo
              los datos mínimos necesarios para operar el sitio y responder a
              mensajes que lleguen por correo.
            </p>
            <p>
              No ofrecemos cuentas públicas en el MVP, así que no almacenamos
              perfiles de usuario ni reseñas de visitantes. Si nos escribes por
              correo, utilizaremos tu dirección únicamente para responder a tu
              mensaje.
            </p>
            <p>
              Para dudas relacionadas con privacidad o para solicitar una
              corrección, puedes escribir a{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
