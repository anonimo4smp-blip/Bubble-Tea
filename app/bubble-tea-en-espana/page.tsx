import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Bubble Tea en España | Guía Editorial",
  description:
    "Una mirada editorial a la escena del bubble tea en España: cultura, evolución y claves para encontrar los mejores locales.",
};

export default function EditorialGuidePage() {
  return (
    <>
      <main className="px-6 pb-24 pt-24">
        <article className="mx-auto max-w-4xl">
          <p className="section-kicker">Guía editorial</p>
          <h1 className="section-title section-title-lg mb-8">
            Bubble Tea en España: de tendencia a ritual urbano
          </h1>

          <div className="section-copy-lg space-y-6">
            <p>
              El bubble tea ya no vive solo en la novedad. En ciudades como
              Madrid, Barcelona y Vigo empieza a consolidarse una escena propia:
              locales con identidad, recetas mejor trabajadas y una clientela
              que distingue entre una bebida vistosa y una taza realmente bien
              construida.
            </p>
            <p>
              Lo que más nos interesa no es la franquicia repetida, sino el
              detalle: el equilibrio del té base, la textura de la tapioca, la
              frescura de la fruta, el tipo de leche y el contexto del local.
              Un buen bubble tea no se queda en lo dulce; tiene estructura,
              aroma y carácter.
            </p>
            <p>
              En Bubble Tea España trabajamos cada ciudad como una guía
              independiente porque la experiencia cambia muchísimo según el
              barrio, el tipo de clientela y la propuesta de cada tienda. No es
              lo mismo un local rápido para llevar en pleno centro que un
              espacio pensado para sentarse, estudiar o compartir bebidas de
              autor.
            </p>
            <p>
              Por eso nuestro enfoque es editorial. Priorizamos criterios
              concretos: calidad de producto, consistencia, precio, ambiente,
              variedad y señales externas de popularidad. El objetivo no es
              hacer una lista infinita, sino ayudarte a elegir bien.
            </p>
          </div>

          <section className="callout-panel mt-16">
            <h2 className="section-title mb-5 text-2xl md:text-3xl">
              Qué vas a encontrar en la guía
            </h2>
            <ul className="section-copy space-y-3">
              <li>Rankings por ciudad con metodología visible.</li>
              <li>Fichas de locales con precio, horarios y enlaces útiles.</li>
              <li>Filtros por estilo de local, opciones veganas y ambiente.</li>
              <li>Una selección pensada para descubrir, no para saturarte.</li>
            </ul>
          </section>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/ciudades" className="btn btn-primary btn-md">
              Ver ciudades
            </Link>
            <Link
              href="/madrid/mejores-bubble-tea"
              className="btn btn-secondary btn-md"
            >
              Ver ranking de Madrid
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
