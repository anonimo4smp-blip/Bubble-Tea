import Image from "next/image";
import Link from "next/link";

export default function EditorialBlock() {
  return (
    <section id="editorial" className="overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-7xl callout-editorial">
        <div className="absolute top-0 right-0 hidden h-full w-1/2 lg:block">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp0A0y8-fcPD48D4xToYCoYskuGXoTBtNilr5unnnkE_a5r793U1k04b9yYZbpecLtEcTEqw3VVpK01KtiysHJtXz6-JSZePRZa5G9jaGILdBsXlaYPccWpXAcYVEVieBs6Aa5PVLUi7EE8HpuZoHCtYIgEloNXjfqQrc-0_N89Dq9t-KGxGo-6OodNLhhniQWI_CLFZ-yODKO3UJv8dlKoaH9Ow6n6HQeHcZPbAg3PidYHvySi4aKO3vqzYxnI54l4zBQtiEnxAHX"
            alt="Fotografia editorial de matcha siendo batido en un cuenco de ceramica con luz natural"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-surface-container" />
        </div>

        <div className="relative z-10 lg:w-1/2">
          <h6 className="section-kicker">Editorial Culture</h6>
          <h2 className="section-title section-title-lg mb-8">
            Mas que Tapioca: Una Revolucion Urbana
          </h2>
          <div className="section-copy-lg space-y-6">
            <p>
              El bubble tea ha dejado de ser una moda pasajera en Espana para
              convertirse en un ritual contemporaneo. No se trata solo de azucar
              y color; es la maestria del te oolong, la temperatura exacta de la
              leche y la textura elastica de perlas hechas a mano.
            </p>
            <p>
              Nuestra guia explora la historia de los pioneros que trajeron
              estas recetas desde Taiwan, adaptandolas al paladar mediterraneo
              con frutas de temporada y endulzantes organicos.
            </p>
          </div>
          <Link
            href="/bubble-tea-en-espana"
            className="btn btn-subtle btn-sm mt-12"
          >
            Leer el reportaje completo
          </Link>
        </div>
      </div>
    </section>
  );
}
