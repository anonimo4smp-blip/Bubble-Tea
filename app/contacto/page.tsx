import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contacto | Bubble Tea España",
  description:
    "Ponte en contacto con Bubble Tea España para correcciones, sugerencias editoriales o nuevas aperturas.",
};

export default function ContactPage() {
  return (
    <>
      <main className="pt-24 px-6 pb-24">
        <section className="max-w-3xl mx-auto">
          <p className="section-kicker">Contacto</p>
          <h1 className="section-title section-title-lg mb-8">Escríbenos</h1>
          <div className="space-y-6 section-copy-lg">
            <p>
              Si quieres corregir la ficha de un local, avisarnos de una nueva
              apertura o compartir una sugerencia editorial, este es el canal.
            </p>
            <p>
              También puedes escribirnos si quieres unirte a la newsletter o
              proponer una ciudad para la siguiente fase del proyecto.
            </p>
          </div>

          <div className="callout-panel mt-10">
            <p className="section-kicker mb-3 text-sm">Email</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="section-title text-2xl hover:text-primary transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
