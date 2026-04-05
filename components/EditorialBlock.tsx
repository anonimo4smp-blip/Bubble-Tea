export default function EditorialBlock() {
  return (
    <section id="editorial" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto bg-surface-container rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
        {/* Background image */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp0A0y8-fcPD48D4xToYCoYskuGXoTBtNilr5unnnkE_a5r793U1k04b9yYZbpecLtEcTEqw3VVpK01KtiysHJtXz6-JSZePRZa5G9jaGILdBsXlaYPccWpXAcYVEVieBs6Aa5PVLUi7EE8HpuZoHCtYIgEloNXjfqQrc-0_N89Dq9t-KGxGo-6OodNLhhniQWI_CLFZ-yODKO3UJv8dlKoaH9Ow6n6HQeHcZPbAg3PidYHvySi4aKO3vqzYxnI54l4zBQtiEnxAHX"
            alt="Fotografía editorial de matcha siendo batido en un cuenco de cerámica con luz natural"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-surface-container" />
        </div>

        {/* Content */}
        <div className="relative z-10 lg:w-1/2">
          <h6 className="tracking-widest uppercase text-xs font-bold text-primary mb-6">
            Editorial Culture
          </h6>
          <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
            Más que Tapioca: Una Revolución Urbana
          </h2>
          <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed">
            <p>
              El bubble tea ha dejado de ser una moda pasajera en España para
              convertirse en un ritual contemporáneo. No se trata solo de azúcar
              y color; es la maestría del té oolong, la temperatura exacta de la
              leche y la textura elástica de perlas hechas a mano.
            </p>
            <p>
              Nuestra guía explora la historia de los pioneros que trajeron estas
              recetas desde Taiwán, adaptándolas al paladar mediterráneo con
              frutas de temporada y endulzantes orgánicos.
            </p>
          </div>
          <button className="mt-12 text-on-background font-bold border-b-2 border-on-background pb-1 hover:text-primary hover:border-primary transition-all">
            Leer el reportaje completo
          </button>
        </div>
      </div>
    </section>
  );
}
