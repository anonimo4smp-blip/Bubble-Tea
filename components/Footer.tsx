export default function Footer() {
  return (
    <footer className="w-full pt-16 pb-8 px-8 bg-stone-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="col-span-1">
          <div className="text-xl font-serif text-lime-900 mb-6">
            Bubble Tea España
          </div>
          <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
            La primera guía de autor dedicada exclusivamente a la excelencia del
            té de burbujas en territorio español.
          </p>
        </div>

        {/* Cities */}
        <div>
          <h4 className="font-serif text-lg mb-6 text-lime-800">Ciudades</h4>
          <ul className="space-y-4">
            {["Madrid", "Barcelona", "Vigo"].map((city) => (
              <li key={city}>
                <a
                  href={`/${city.toLowerCase()}`}
                  className="text-stone-500 hover:text-lime-600 transition-colors text-sm"
                >
                  {city}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-serif text-lg mb-6 text-lime-800">Recursos</h4>
          <ul className="space-y-4">
            {[
              { label: "Privacidad", href: "/privacidad" },
              { label: "Cookies", href: "/cookies" },
              { label: "Contacto", href: "/contacto" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-stone-500 hover:text-lime-600 transition-colors text-sm"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-serif text-lg mb-6 text-lime-800">Newsletter</h4>
          <p className="text-xs text-stone-500 mb-4">
            Recibe las aperturas más exclusivas antes que nadie.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Tu email"
              className="bg-surface-variant border-none rounded-lg text-sm flex-grow px-3 py-2 outline-none focus:ring-1 focus:ring-primary/30"
            />
            <button className="bg-primary text-on-primary p-2 rounded-lg">
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-stone-500 text-xs">
          © 2025 Bubble Tea España. La Guía de Autor.
        </p>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-stone-400 cursor-pointer hover:text-primary transition-colors">
            language
          </span>
          <span className="material-symbols-outlined text-stone-400 cursor-pointer hover:text-primary transition-colors">
            share
          </span>
          <span className="material-symbols-outlined text-stone-400 cursor-pointer hover:text-primary transition-colors">
            podcasts
          </span>
        </div>
      </div>
    </footer>
  );
}
