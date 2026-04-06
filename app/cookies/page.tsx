import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookies | Bubble Tea España",
  description:
    "Información básica sobre cookies y analítica en Bubble Tea España.",
};

export default function CookiesPage() {
  return (
    <>
      <main className="pt-24 px-6 pb-24">
        <section className="max-w-3xl mx-auto">
          <p className="section-kicker">Cookies</p>
          <h1 className="section-title section-title-lg mb-8">
            Política de cookies
          </h1>
          <div className="space-y-6 section-copy-lg">
            <p>
              Bubble Tea España usa herramientas de medición y SEO para entender
              qué ciudades y páginas resultan más útiles. Intentamos mantener
              una analítica ligera y respetuosa con la privacidad.
            </p>
            <p>
              Si en el futuro añadimos herramientas que requieran un aviso más
              detallado o gestión granular del consentimiento, actualizaremos
              esta página para reflejarlo con claridad.
            </p>
            <p>
              Mientras tanto, esta política resume el uso básico del sitio y su
              propósito editorial.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
