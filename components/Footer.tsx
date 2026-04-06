import Link from "next/link";
import Icon from "@/components/Icon";
import ShareButton from "@/components/ShareButton";

export default function Footer() {
  return (
    <footer aria-label="Pie de página" className="w-full pt-16 pb-8 px-8 bg-stone-100">
      <nav aria-label="Navegación del pie de página" className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
        <div className="col-span-1">
          <Link
            href="/"
            className="inline-block text-xl font-serif text-lime-900 mb-6 hover:text-primary transition-colors"
          >
            Bubble Tea España
          </Link>
          <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
            La primera guía de autor dedicada exclusivamente a la excelencia del
            té de burbujas en territorio español.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6 text-lime-800">Ciudades</h4>
          <ul className="space-y-4">
            {["Madrid", "Barcelona", "Vigo"].map((city) => (
              <li key={city}>
                <Link
                  href={`/${city.toLowerCase()}`}
                  className="text-stone-500 hover:text-lime-600 transition-colors text-sm"
                >
                  {city}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6 text-lime-800">Recursos</h4>
          <ul className="space-y-4">
            {[
              { label: "Ciudades", href: "/ciudades" },
              { label: "Privacidad", href: "/privacidad" },
              { label: "Cookies", href: "/cookies" },
              { label: "Contacto", href: "/contacto" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-stone-500 hover:text-lime-600 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6 text-lime-800">Contacto</h4>
          <p className="text-xs text-stone-500 mb-4 leading-relaxed">
            ¿Conoces un local que deberíamos incluir? ¿Quieres colaborar con
            nosotros?
          </p>
          <Link
            href="/contacto"
            className="btn btn-primary btn-sm inline-flex"
          >
            Escríbenos
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-stone-500 text-xs">
          © 2026 Bubble Tea España. La Guía de Autor.
        </p>
        <div className="flex gap-6">
          <Link
            href="/bubble-tea-en-espana"
            className="btn btn-subtle btn-icon"
            aria-label="Leer la guía editorial"
            title="Leer la guía editorial"
          >
            <Icon name="language" />
          </Link>
          <ShareButton className="btn btn-subtle btn-icon" />
          <Link
            href="/contacto"
            className="btn btn-subtle btn-icon"
            aria-label="Ir a contacto"
            title="Ir a contacto"
          >
            <Icon name="send" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
