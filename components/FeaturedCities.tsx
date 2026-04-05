import Link from "next/link";

const cities = [
  {
    name: "Madrid",
    count: "20 Locales",
    description:
      "Capital del bubble tea en Espana. Desde Malasana hasta Retiro, el epicentro de la innovacion en boba.",
    href: "/madrid",
    cta: "Ver bubble tea en Madrid",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop&auto=format&q=80",
    imageAlt:
      "Gran Via de Madrid al atardecer con sus edificios historicos iluminados",
  },
  {
    name: "Barcelona",
    count: "20 Locales",
    description:
      "Fusion costera y diseno. El Gotico esconde los secretos mejores guardados de los maestros del te.",
    href: "/barcelona",
    cta: "Ver bubble tea en Barcelona",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop&auto=format&q=80",
    imageAlt: "Vista panoramica de Barcelona con la Sagrada Familia al fondo",
  },
  {
    name: "Vigo",
    count: "8 Locales",
    description:
      "La vanguardia gallega. Pequena pero intensa, una escena que sorprende por su calidad organica.",
    href: "/vigo",
    cta: "Ver bubble tea en Vigo",
    image:
      "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&h=600&fit=crop&auto=format&q=80",
    imageAlt: "Costa gallega con vistas al mar y vegetacion verde",
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
              Explora las capitales del te en la peninsula. Curacion constante y
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
                <Link
                  href={city.href}
                  className="inline-flex items-center gap-2 text-tertiary font-bold tracking-tight group-hover:gap-4 transition-all"
                >
                  {city.cta}{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
