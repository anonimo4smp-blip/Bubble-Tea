import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <header aria-label="Presentación de Bubble Tea España" className="relative flex min-h-[921px] items-center overflow-hidden px-6 pb-20 pt-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="relative z-10">
          <span className="section-kicker-pill">Guía Exclusiva 2026</span>
          <h1 className="section-title mb-8 text-6xl leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
            Descubre el <span className="italic text-primary">Mejor</span>{" "}
            Bubble Tea de España
          </h1>
          <p className="section-copy mb-10 max-w-lg text-lg md:text-xl">
            Una selección verificada de locales y cartas activas en Madrid,
            Barcelona y Vigo. Guía editorial para encontrar bubble tea real, no
            fichas infladas ni listados desactualizados.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#ciudades" className="btn btn-primary btn-lg">
              Explorar ciudades
            </Link>
            <Link href="/madrid/mejores-bubble-tea" className="btn btn-secondary btn-lg">
              Ranking Madrid
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-secondary-container/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-primary-container/20 blur-3xl" />
          <div className="relative h-[600px] rotate-2 overflow-hidden rounded-3xl editorial-shadow">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_QDsx6cbv7uYVuBzXgGtWC5VRpwLr6MEOqB6iFsF0tJ9brXx_sNt_Ht_Abus9XAmhfHk038WNKJzffFKr7P92DMkCK1rclHwq2UOC77BRyp0Pe3WJ_sQqvTKfDZCK8f-261KkrPhddtmP7YJCjiOH-Vvl89QFE7ooSEoTR7sZH3OHMUc8q_EbVR_j1f_yFcGmcPhrWbL9OLYsmSZw-keGDSgxktrSwUx11OkmsAC-zU0j_QxvHJ99t-blp2aH__Rdo4NfoXo6u_d9"
              alt="Matcha bubble tea premium en vaso minimalista"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              preload
              className="object-cover"
            />
            <div className="glass-callout absolute bottom-6 left-6 right-6 p-6">
              <p className="font-serif text-xl italic text-white">
                &quot;La perfección en cada perla.&quot; - Guía de Autor
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
