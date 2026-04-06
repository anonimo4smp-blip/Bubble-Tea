import type { Metadata } from "next";
import Footer from "@/components/Footer";
import FeaturedCities from "@/components/FeaturedCities";

export const metadata: Metadata = {
  title: "Ciudades | Bubble Tea España",
  description:
    "Explora las ciudades de Bubble Tea España y descubre las mejores guías de Madrid, Barcelona y Vigo.",
};

export default function CitiesPage() {
  return (
    <>
      <main className="pt-24">
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="section-kicker">Guías por ciudad</p>
            <h1 className="section-title section-title-lg mb-6">
              Dónde tomar bubble tea en España
            </h1>
            <p className="section-copy-lg">
              Reunimos nuestras ciudades de lanzamiento en una sola vista para
              que puedas elegir rápido tu próxima ruta de boba.
            </p>
          </div>
        </section>
        <FeaturedCities showHeaderLink={false} />
      </main>
      <Footer />
    </>
  );
}
