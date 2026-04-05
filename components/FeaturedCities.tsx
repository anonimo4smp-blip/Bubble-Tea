const cities = [
  {
    name: "Madrid",
    count: "20 Locales",
    description:
      "Capital del bubble tea en España. Desde Malasaña hasta Retiro, el epicentro de la innovación en boba.",
    href: "/madrid",
    cta: "Ver bubble tea en Madrid",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop&auto=format&q=80",
    imageAlt: "Gran Vía de Madrid al atardecer con sus edificios históricos iluminados",
  },
  {
    name: "Barcelona",
    count: "20 Locales",
    description:
      "Fusión costera y diseño. El Gótico esconde los secretos mejores guardados de los maestros del té.",
    href: "/barcelona",
    cta: "Ver bubble tea en Barcelona",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop&auto=format&q=80",
    imageAlt: "Vista panorámica de Barcelona con la Sagrada Familia al fondo",
  },
  {
    name: "Vigo",
    count: "8 Locales",
    description:
      "La vanguardia gallega. Pequeña pero intensa, una escena que sorprende por su calidad orgánica.",
    href: "/vigo",
    cta: "Ver bubble tea en Vigo",
    image:
      "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&h=600&fit=crop&auto=format&q=80",
    imageAlt: "Costa gallega con vistas al mar y vegetación verde",
  },
];

export default function FeaturedCities() {
  return (
    <section id="ciudades" className="py-24 px-6 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-on-background mb-4 italic">
              Nuestros Destinos
            </h2>
            <p className="text-on-surface-variant max-w-md">
              Explora las capitales del té en la península. Curación constante y
              reportajes a pie de calle.
            </p>
          </div>
          <div className="hidden md:block">
            <span className="text-primary font-bold border-b-2 border-primary tracking-widest uppercase text-sm cursor-pointer">
              Ver todos los mapas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cities.map((city) => (
            <div
              key={city.name}
              className="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
            >
              <div className="h-80 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={city.image}
                  alt={city.imageAlt}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-serif">{city.name}</h3>
                  <span className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-xs font-bold">
                    {city.count}
                  </span>
                </div>
                <p className="text-on-surface-variant mb-8 text-sm leading-relaxed">
                  {city.description}
                </p>
                <a
                  href={city.href}
                  className="inline-flex items-center gap-2 text-tertiary font-bold tracking-tight group-hover:gap-4 transition-all"
                >
                  {city.cta}{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
