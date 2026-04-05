import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import {
  cities,
  shops,
  shopFeatures,
  shopHours,
  shopScores,
  shopImages,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { JsonLd, breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/jsonld";

type Props = {
  params: Promise<{ city: string; shopSlug: string }>;
};

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
    title: `${shop.name} — Bubble Tea en ${city.name}`,
    description:
      shop.editorSummary ??
      `Reseña editorial de ${shop.name} en ${city.name}. Precios, horarios, características y valoración.`,
    alternates: { canonical: `/${citySlug}/${shopSlug}` },
    openGraph: {
      title: `${shop.name} — Bubble Tea en ${city.name}`,
      description:
        shop.editorSummary ??
        `Reseña editorial de ${shop.name} en ${city.name}.`,
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

const FEATURE_LABELS: { key: string; label: string; icon: string }[] = [
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

  // Fetch all related data in parallel
  const [featuresArr, hoursArr, scoresArr, imagesArr] = await Promise.all([
    db
      .select()
      .from(shopFeatures)
      .where(eq(shopFeatures.shopId, shop.id))
      .limit(1),
    db.select().from(shopHours).where(eq(shopHours.shopId, shop.id)),
    db
      .select()
      .from(shopScores)
      .where(eq(shopScores.shopId, shop.id))
      .limit(1),
    db
      .select()
      .from(shopImages)
      .where(eq(shopImages.shopId, shop.id)),
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
      ? "€"
      : shop.averagePrice <= 5.5
        ? "€€"
        : "€€€"
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
          }),
        ]}
      />
      <main className="pt-24">
        {/* Breadcrumb */}
        <section className="px-6 mb-8">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-xs text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <Link
                href={`/${citySlug}`}
                className="hover:text-primary transition-colors"
              >
                {city.name}
              </Link>
              <span>/</span>
              <span className="text-on-background font-semibold">
                {shop.name}
              </span>
            </nav>
          </div>
        </section>

        {/* Hero image + title */}
        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Image gallery */}
            <div>
              {primaryImage ? (
                <div className="rounded-xl overflow-hidden h-80 lg:h-[450px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={primaryImage.imageUrl}
                    alt={primaryImage.altText ?? shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-surface-container h-80 lg:h-[450px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">
                    local_cafe
                  </span>
                </div>
              )}

              {/* Secondary images */}
              {images.length > 1 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {images.slice(1, 4).map((img) => (
                    <div
                      key={img.id}
                      className="rounded-lg overflow-hidden h-24"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.imageUrl}
                        alt={img.altText ?? shop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shop info */}
            <div>
              <div className="mb-6">
                {shop.isIndependent ? (
                  <span className="text-xs tracking-widest uppercase font-bold text-primary mb-2 block">
                    Local independiente
                  </span>
                ) : shop.brandName ? (
                  <span className="text-xs tracking-widest uppercase font-bold text-on-surface-variant mb-2 block">
                    {shop.brandName}
                  </span>
                ) : null}

                <h1 className="text-3xl md:text-5xl font-serif text-on-background mb-4">
                  {shop.name}
                </h1>

                {/* Score */}
                {scores?.totalScore != null && (
                  <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-lg">
                      star
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {scores.totalScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      / 100 puntuación editorial
                    </span>
                  </div>
                )}

                {shop.editorSummary && (
                  <p className="text-on-surface-variant leading-relaxed text-lg">
                    {shop.editorSummary}
                  </p>
                )}
              </div>

              {/* Price + Location */}
              <div className="space-y-3 mb-8">
                {shop.averagePrice != null && (
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">
                      payments
                    </span>
                    <span className="text-sm text-on-background">
                      {shop.priceMin != null && shop.priceMax != null
                        ? `${shop.priceMin.toFixed(1)}€ – ${shop.priceMax.toFixed(1)}€`
                        : `~${shop.averagePrice.toFixed(1)}€`}
                      <span className="text-on-surface-variant ml-1">
                        precio medio
                      </span>
                    </span>
                  </div>
                )}

                {shop.address && (
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">
                      location_on
                    </span>
                    <span className="text-sm text-on-background">
                      {shop.address}
                      {shop.neighborhood && ` · ${shop.neighborhood}`}
                    </span>
                  </div>
                )}

                {/* Social links */}
                <div className="flex items-center gap-4 pt-2">
                  {shop.googleMapsUrl && (
                    <a
                      href={shop.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">
                        map
                      </span>
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
                      <span className="material-symbols-outlined text-base">
                        photo_camera
                      </span>
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
                      <span className="material-symbols-outlined text-base">
                        language
                      </span>
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
                      <span className="material-symbols-outlined text-base">
                        movie
                      </span>
                      TikTok
                    </a>
                  )}
                </div>
              </div>

              {/* Features */}
              {activeFeatures.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {activeFeatures.map(({ key, label, icon }) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1.5 bg-primary-fixed text-on-primary-fixed px-3.5 py-2 rounded-full text-xs font-semibold"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {icon}
                      </span>
                      {label}
                    </span>
                  ))}
                </div>
              )}

              {/* Recommended order */}
              {shop.recommendedOrder && (
                <div className="bg-surface-container-low rounded-xl p-5 mb-8">
                  <p className="text-xs tracking-widest uppercase font-bold text-primary mb-2">
                    Pedido recomendado
                  </p>
                  <p className="text-on-background font-serif text-lg italic">
                    {shop.recommendedOrder}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Why it stands out */}
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

        {/* Scores + Hours */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Scores breakdown */}
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
                        <span className="font-bold text-on-background">
                          Total
                        </span>
                        <span className="text-2xl font-serif font-bold text-primary">
                          {scores.totalScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hours */}
            {hours.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif text-on-background mb-8">
                  Horarios
                </h2>
                <div className="space-y-3">
                  {hours.map((h) => (
                    <div
                      key={h.weekday}
                      className="flex justify-between text-sm py-2"
                    >
                      <span className="font-medium text-on-background">
                        {WEEKDAY_LABELS[h.weekday]}
                      </span>
                      {h.isClosed ? (
                        <span className="text-error font-medium">Cerrado</span>
                      ) : h.opensAt && h.closesAt ? (
                        <span className="text-on-surface-variant">
                          {h.opensAt} – {h.closesAt}
                        </span>
                      ) : (
                        <span className="text-on-surface-variant">—</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Back links */}
        <section className="px-6 py-12 bg-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
            <Link
              href={`/${citySlug}`}
              className="inline-flex items-center gap-2 text-tertiary font-bold hover:gap-4 transition-all"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
              Todos los locales en {city.name}
            </Link>
            <Link
              href={`/${citySlug}/mejores-bubble-tea`}
              className="inline-flex items-center gap-2 text-tertiary font-bold hover:gap-4 transition-all"
            >
              <span className="material-symbols-outlined text-sm">
                emoji_events
              </span>
              Ranking en {city.name}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
