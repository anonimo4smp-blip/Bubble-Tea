import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Icon, { type IconName } from "@/components/Icon";
import { db } from "@/db";
import {
  cities,
  shopFeatures,
  shopHours,
  shopImages,
  shops,
  shopScores,
} from "@/db/schema";
import { JsonLd, breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/jsonld";
import { getPublishedShopParams } from "@/lib/static-params";

type Props = {
  params: Promise<{ city: string; shopSlug: string }>;
};

export async function generateStaticParams() {
  return getPublishedShopParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, shopSlug } = await params;

  const [city] = await db
    .select({ id: cities.id, name: cities.name })
    .from(cities)
    .where(and(eq(cities.slug, citySlug), eq(cities.status, "published")))
    .limit(1);

  if (!city) return {};

  const [shop] = await db
    .select({ name: shops.name, editorSummary: shops.editorSummary })
    .from(shops)
    .where(
      and(
        eq(shops.cityId, city.id),
        eq(shops.slug, shopSlug),
        eq(shops.status, "published")
      )
    )
    .limit(1);

  if (!shop) return {};

  return {
    title: `${shop.name} - Bubble Tea en ${city.name}`,
    description:
      shop.editorSummary ??
      `Reseña editorial de ${shop.name} en ${city.name}. Precios, horarios, características y valoración.`,
    alternates: { canonical: `/${citySlug}/${shopSlug}` },
    openGraph: {
      title: `${shop.name} - Bubble Tea en ${city.name}`,
      description:
        shop.editorSummary ?? `Reseña editorial de ${shop.name} en ${city.name}.`,
    },
  };
}

const WEEKDAY_LABELS: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

const WEEKDAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const FEATURE_LABELS: { key: string; label: string; icon: IconName }[] = [
  { key: "veganOptions", label: "Opciones veganas", icon: "eco" },
  { key: "lactoseFreeOptions", label: "Sin lactosa", icon: "water_drop" },
  { key: "glutenFreeOptions", label: "Sin gluten", icon: "grain" },
  { key: "takeaway", label: "Para llevar", icon: "takeout_dining" },
  { key: "seating", label: "Con asientos", icon: "chair" },
  { key: "wifi", label: "WiFi", icon: "wifi" },
  { key: "studyFriendly", label: "Para estudiar", icon: "menu_book" },
  { key: "photoFriendly", label: "Instagrameable", icon: "photo_camera" },
  { key: "petFriendly", label: "Pet-friendly", icon: "pets" },
  {
    key: "wheelchairAccessible",
    label: "Accesible",
    icon: "accessible",
  },
];

const SCORE_LABELS: { key: string; label: string; weight: string }[] = [
  { key: "qualityScore", label: "Calidad", weight: "35%" },
  { key: "priceScore", label: "Precio", weight: "15%" },
  { key: "varietyScore", label: "Variedad", weight: "15%" },
  { key: "experienceScore", label: "Experiencia", weight: "10%" },
  { key: "googleRatingScore", label: "Google", weight: "15%" },
  { key: "popularityScore", label: "Popularidad", weight: "10%" },
];

export default async function ShopDetailPage({ params }: Props) {
  const { city: citySlug, shopSlug } = await params;

  const [city] = await db
    .select()
    .from(cities)
    .where(and(eq(cities.slug, citySlug), eq(cities.status, "published")))
    .limit(1);

  if (!city) notFound();

  const [shop] = await db
    .select()
    .from(shops)
    .where(
      and(
        eq(shops.cityId, city.id),
        eq(shops.slug, shopSlug),
        eq(shops.status, "published")
      )
    )
    .limit(1);

  if (!shop) notFound();

  const [featuresArr, hoursArr, scoresArr, imagesArr] = await Promise.all([
    db.select().from(shopFeatures).where(eq(shopFeatures.shopId, shop.id)).limit(1),
    db.select().from(shopHours).where(eq(shopHours.shopId, shop.id)),
    db.select().from(shopScores).where(eq(shopScores.shopId, shop.id)).limit(1),
    db.select().from(shopImages).where(eq(shopImages.shopId, shop.id)),
  ]);

  const features = featuresArr[0] ?? null;
  const hours = hoursArr.sort(
    (a, b) => WEEKDAY_ORDER.indexOf(a.weekday) - WEEKDAY_ORDER.indexOf(b.weekday)
  );
  const scores = scoresArr[0] ?? null;
  const images = imagesArr.sort((a, b) => a.sortOrder - b.sortOrder);
  const primaryImage = images.find((i) => i.isPrimary) ?? images[0] ?? null;

  const activeFeatures = features
    ? FEATURE_LABELS.filter(
        ({ key }) => (features as unknown as Record<string, boolean>)[key]
      )
    : [];

  const priceRange = shop.averagePrice
    ? shop.averagePrice <= 4
      ? "EUR"
      : shop.averagePrice <= 5.5
        ? "EUR EUR"
        : "EUR EUR EUR"
    : undefined;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", href: "/" },
            { name: city.name, href: `/${citySlug}` },
            { name: shop.name },
          ]),
          localBusinessJsonLd({
            name: shop.name,
            description: shop.editorSummary,
            url: `/${citySlug}/${shopSlug}`,
            address: shop.address,
            latitude: shop.latitude,
            longitude: shop.longitude,
            priceRange,
            imageUrl: primaryImage?.imageUrl,
            aggregateRating: scores?.totalScore,
            ratingCount: shop.googleReviewCount,
          }),
        ]}
      />
      <main className="pt-24">
        <section className="px-6 mb-8">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-xs text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <Link href={`/${citySlug}`} className="hover:text-primary transition-colors">
                {city.name}
              </Link>
              <span>/</span>
              <span className="text-on-background font-semibold">{shop.name}</span>
            </nav>
          </div>
        </section>

        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              {primaryImage ? (
                <div className="relative h-80 overflow-hidden rounded-xl lg:h-[450px]">
                  <Image
                    src={primaryImage.imageUrl}
                    alt={primaryImage.altText ?? shop.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-surface-container h-80 lg:h-[450px] flex items-center justify-center">
                  <Icon name="local_cafe" className="text-6xl text-on-surface-variant/30" />
                </div>
              )}

              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {images.slice(1, 4).map((img) => (
                    <div key={img.id} className="relative h-24 overflow-hidden rounded-lg">
                      <Image
                        src={img.imageUrl}
                        alt={img.altText ?? shop.name}
                        fill
                        sizes="(max-width: 1024px) 33vw, 160px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-6">
                {shop.isIndependent ? (
                  <span className="section-kicker mb-2">Local independiente</span>
                ) : shop.brandName ? (
                  <span className="section-kicker mb-2 text-on-surface-variant">
                    {shop.brandName}
                  </span>
                ) : null}

                <h1 className="text-3xl md:text-5xl font-serif text-on-background mb-4">
                  {shop.name}
                </h1>

                {scores?.totalScore != null && (
                  <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                    <Icon name="star" className="text-primary text-lg" />
                    <span className="text-lg font-bold text-primary">
                      {scores.totalScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      / 100 puntuación editorial
                    </span>
                  </div>
                )}

                {shop.editorSummary && (
                  <p className="section-copy text-lg">{shop.editorSummary}</p>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {shop.averagePrice != null && (
                  <div className="flex items-center gap-3">
                    <Icon name="payments" className="text-on-surface-variant text-xl" />
                    <span className="text-sm text-on-background">
                      {shop.priceMin != null && shop.priceMax != null
                        ? `${shop.priceMin.toFixed(1)} EUR - ${shop.priceMax.toFixed(1)} EUR`
                        : `~${shop.averagePrice.toFixed(1)} EUR`}
                      <span className="text-on-surface-variant ml-1">
                        precio medio
                      </span>
                    </span>
                  </div>
                )}

                {shop.address && (
                  <div className="flex items-center gap-3">
                    <Icon name="location_on" className="text-on-surface-variant text-xl" />
                    <span className="text-sm text-on-background">
                      {shop.address}
                      {shop.neighborhood && ` · ${shop.neighborhood}`}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                  {shop.googleMapsUrl && (
                    <a
                      href={shop.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Icon name="map" className="text-base" />
                      Google Maps
                    </a>
                  )}
                  {shop.instagramUrl && (
                    <a
                      href={shop.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Icon name="photo_camera" className="text-base" />
                      Instagram
                    </a>
                  )}
                  {shop.websiteUrl && (
                    <a
                      href={shop.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Icon name="language" className="text-base" />
                      Web
                    </a>
                  )}
                  {shop.tiktokUrl && (
                    <a
                      href={shop.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <Icon name="movie" className="text-base" />
                      TikTok
                    </a>
                  )}
                </div>
              </div>

              {activeFeatures.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {activeFeatures.map(({ key, label, icon }) => (
                    <span key={key} className="chip chip-active">
                      <Icon name={icon} className="text-sm" />
                      {label}
                    </span>
                  ))}
                </div>
              )}

              {shop.recommendedOrder && (
                <div className="card-soft p-5 mb-8">
                  <p className="section-kicker mb-2">Pedido recomendado</p>
                  <p className="text-on-background font-serif text-lg italic">
                    {shop.recommendedOrder}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {shop.whyItStandsOut && (
          <section className="px-6 py-16 bg-surface-container-low">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-serif text-on-background mb-6 italic">
                ¿Por qué destaca?
              </h2>
              <p className="text-on-surface-variant leading-relaxed text-lg whitespace-pre-line">
                {shop.whyItStandsOut}
              </p>
            </div>
          </section>
        )}

        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {scores && (
              <div>
                <h2 className="text-2xl font-serif text-on-background mb-8">
                  Puntuación editorial
                </h2>
                <div className="space-y-4">
                  {SCORE_LABELS.map(({ key, label, weight }) => {
                    const value = (scores as Record<string, number | null>)[key];
                    if (value == null) return null;
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-on-background font-medium">
                            {label}{" "}
                            <span className="text-on-surface-variant font-normal">
                              ({weight})
                            </span>
                          </span>
                          <span className="font-bold text-primary">
                            {value.toFixed(0)}
                          </span>
                        </div>
                        <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {scores.totalScore != null && (
                    <div className="pt-4 border-t border-surface-container-high">
                      <div className="flex justify-between">
                        <span className="font-bold text-on-background">Total</span>
                        <span className="text-2xl font-serif font-bold text-primary">
                          {scores.totalScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {hours.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif text-on-background mb-8">Horarios</h2>
                <div className="space-y-3">
                  {hours.map((h) => (
                    <div key={h.weekday} className="flex justify-between text-sm py-2">
                      <span className="font-medium text-on-background">
                        {WEEKDAY_LABELS[h.weekday]}
                      </span>
                      {h.isClosed ? (
                        <span className="text-error font-medium">Cerrado</span>
                      ) : h.opensAt && h.closesAt ? (
                        <span className="text-on-surface-variant">
                          {h.opensAt} - {h.closesAt}
                        </span>
                      ) : (
                        <span className="text-on-surface-variant">-</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="px-6 py-12 bg-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
            <Link
              href={`/${citySlug}`}
              className="inline-flex items-center gap-2 text-tertiary font-bold hover:gap-4 transition-all"
            >
              <Icon name="arrow_back" className="text-sm" />
              Todos los locales en {city.name}
            </Link>
            <Link
              href={`/${citySlug}/mejores-bubble-tea`}
              className="inline-flex items-center gap-2 text-tertiary font-bold hover:gap-4 transition-all"
            >
              <Icon name="emoji_events" className="text-sm" />
              Ranking en {city.name}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
