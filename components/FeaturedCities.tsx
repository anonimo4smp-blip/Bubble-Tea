import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";

export type FeaturedCity = {
  name: string;
  slug: string;
  count: number;
  description: string;
};

type Props = {
  cities?: FeaturedCity[];
  headerLinkHref?: string;
  headerLinkLabel?: string;
  showHeaderLink?: boolean;
};

const cityVisuals: Record<
  string,
  { image: string; imageAlt: string; fallbackDescription: string }
> = {
  madrid: {
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop&auto=format&q=80",
    imageAlt:
      "Gran Via de Madrid al atardecer con sus edificios historicos iluminados",
    fallbackDescription:
      "Capital del bubble tea en España, con una escena amplia entre Centro, Chamberí y Usera.",
  },
  barcelona: {
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop&auto=format&q=80",
    imageAlt:
      "Vista panoramica de Barcelona con la Sagrada Familia al fondo",
    fallbackDescription:
      "Fusion costera y diseno entre Ciutat Vella, Eixample, Gracia y Sant Marti.",
  },
  vigo: {
    image:
      "https://images.unsplash.com/photo-1509840841025-9088ba78a826?w=800&h=600&fit=crop&auto=format&q=80",
    imageAlt: "Costa gallega con vistas al mar y vegetacion verde",
    fallbackDescription:
      "Escena pequena pero activa entre el centro de Vigo, Vialia y algunas cartas asiaticas especializadas.",
  },
};

export default function FeaturedCities({
  cities = [],
  headerLinkHref = "/ciudades",
  headerLinkLabel = "Ver todas las ciudades",
  showHeaderLink = true,
}: Props) {
  const resolvedCities = cities.map((city) => {
    const visual = cityVisuals[city.slug] ?? cityVisuals.vigo;
    return {
      ...city,
      countLabel: `${city.count} Locales`,
      description: city.description || visual.fallbackDescription,
      href: `/${city.slug}`,
      cta: `Ver bubble tea en ${city.name}`,
      image: visual.image,
      imageAlt: visual.imageAlt,
    };
  });

  return (
    <section id="ciudades" className="bg-surface-container-low px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h2 className="section-title section-title-md mb-4 italic">
              Nuestros Destinos
            </h2>
            <p className="section-copy max-w-md">
              Explora las capitales del te en la peninsula. Curacion constante y
              reportajes a pie de calle.
            </p>
          </div>
          {showHeaderLink ? (
            <div className="hidden md:block">
              <Link
                href={headerLinkHref}
                className="btn btn-subtle btn-xs uppercase tracking-widest"
              >
                {headerLinkLabel}
              </Link>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {resolvedCities.map((city) => (
            <div
              key={city.name}
              className="group relative overflow-hidden card-elevated-hover duration-500 hover:-translate-y-2"
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={city.image}
                  alt={city.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                />
              </div>
              <div className="p-8">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <h3 className="section-title text-2xl">{city.name}</h3>
                  <span className="badge badge-accent">{city.countLabel}</span>
                </div>
                <p className="section-copy mb-8 text-sm">{city.description}</p>
                <Link
                  href={city.href}
                  className="inline-flex items-center gap-2 font-bold tracking-tight text-tertiary transition-all group-hover:gap-4"
                >
                  {city.cta} <Icon name="arrow_forward" className="text-sm" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
