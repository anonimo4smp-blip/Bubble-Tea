export default function Hero() {
  return (
    <header className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[921px] flex items-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Copy */}
        <div className="relative z-10">
          <span className="inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-bold tracking-widest uppercase mb-6">
            Guía Exclusiva 2025
          </span>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-on-background leading-[1.1] mb-8 tracking-tight">
            Descubre el{" "}
            <span className="italic text-primary">Mejor</span> Bubble Tea de
            España
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-lg mb-10 leading-relaxed">
            Una selección curada por expertos de los rincones más auténticos en
            Madrid, Barcelona y Vigo. Olvida las franquicias, vive la
            experiencia artesanal.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform">
              Explorar ciudades
            </button>
            <button className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all">
              Ranking Madrid
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-secondary-container/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl" />
          <div className="relative rounded-3xl overflow-hidden editorial-shadow transform rotate-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_QDsx6cbv7uYVuBzXgGtWC5VRpwLr6MEOqB6iFsF0tJ9brXx_sNt_Ht_Abus9XAmhfHk038WNKJzffFKr7P92DMkCK1rclHwq2UOC77BRyp0Pe3WJ_sQqvTKfDZCK8f-261KkrPhddtmP7YJCjiOH-Vvl89QFE7ooSEoTR7sZH3OHMUc8q_EbVR_j1f_yFcGmcPhrWbL9OLYsmSZw-keGDSgxktrSwUx11OkmsAC-zU0j_QxvHJ99t-blp2aH__Rdo4NfoXo6u_d9"
              alt="Matcha bubble tea premium en vaso minimalista"
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 p-6 glass-nav bg-white/10 rounded-2xl border border-white/20">
              <p className="text-white font-serif text-xl italic">
                &quot;La perfección en cada perla.&quot; — Guía de Autor
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
