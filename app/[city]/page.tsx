import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { cities, shops, shopFeatures, shopScores, shopImages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ShopCard from "@/components/ShopCard";
import ShopFilters from "@/components/ShopFilters";
import ShopMap from "@/components/ShopMap";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/jsonld";

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ f?: string; p?: string; barrio?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const [city] = await db
    .select({ name: cities.name, seoTitle: cities.seoTitle, seoDescription: cities.seoDescription })
    .from(cities)
    .where(and(eq(cities.slug, slug), eq(cities.status, "published")))
    .limit(1);

  if (!city) return {};

  return {
    title: city.seoTitle ?? `Bubble Tea en ${city.name}`,
    description:
      city.seoDescription ??
      `Descubre los mejores locales de bubble tea en ${city.name}. Guía editorial con reseñas, filtros y mapa interactivo.`,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: city.seoTitle ?? `Bubble Tea en ${city.name}`,
      description:
        city.seoDescription ??
        `Descubre los mejores locales de bubble tea en ${city.name}.`,
    },
  };
}

// Feature filter mapping
const FEATURE_MAP: Record<string, string> = {
  vegan: "veganOptions",
  wifi: "wifi",
  study: "studyFriendly",
  photo: "photoFriendly",
  pet: "petFriendly",
  takeaway: "takeaway",
  accessible: "wheelchairAccessible",
};

export default async function CityPage({ params, searchParams }: Props) {
  const { city: slug } = await params;
  const search = await searchParams;

  const [city] = await db
    .select()
    .from(cities)
    .where(and(eq(cities.slug, slug), eq(cities.status, "published")))
    .limit(1);

  if (!city) notFound();

  // Get all published shops for this city with features, scores, and primary image
  const publishedShops = await db
    .select({
      id: shops.id,
      name: shops.name,
      slug: shops.slug,
      neighborhood: shops.neighborhood,
      latitude: shops.latitude,
      longitude: shops.longitude,
      averagePrice: shops.averagePrice,
      editorSummary: shops.editorSummary,
    })
    .from(shops)
    .where(and(eq(shops.cityId, city.id), eq(shops.status, "published")));

  // Fetch features, scores, and images for all shops
  const shopIds = publishedShops.map((s) => s.id);

  const allFeatures = shopIds.length
    ? await db.select().from(shopFeatures).where(
        // Use OR for each shopId
        shopIds.length === 1
          ? eq(shopFeatures.shopId, shopIds[0])
          : eq(shopFeatures.shopId, shopIds[0]) // will be filtered below
      )
    : [];

  // For multiple shops, fetch all features and filter in JS
  const allFeaturesAll = shopIds.length
    ? await db.select().from(shopFeatures)
    : [];
  const featuresMap = new Map(
    allFeaturesAll
      .filter((f) => shopIds.includes(f.shopId))
      .map((f) => [f.shopId, f])
  );

  const allScoresAll = shopIds.length
    ? await db.select().from(shopScores)
    : [];
  const scoresMap = new Map(
    allScoresAll
      .filter((s) => shopIds.includes(s.shopId))
      .map((s) => [s.shopId, s])
  );

  const allImagesAll = shopIds.length
    ? await db.select().from(shopImages)
    : [];
  const imagesMap = new Map(
    allImagesAll
      .filter((i) => shopIds.includes(i.shopId) && i.isPrimary)
      .map((i) => [i.shopId, i])
  );

  // Parse filters
  const activeFeatures = search.f?.split(",").filter(Boolean) ?? [];
  const activePrice = search.p ?? "";
  const activeNeighborhood = search.barrio ?? "";

  // Apply filters
  let filteredShops = publishedShops.map((shop) => ({
    ...shop,
    features: featuresMap.get(shop.id) ?? null,
    scores: scoresMap.get(shop.id) ?? null,
    image: imagesMap.get(shop.id) ?? null,
  }));

  // Feature filters
  if (activeFeatures.length > 0) {
    filteredShops = filteredShops.filter((shop) => {
      if (!shop.features) return false;
      return activeFeatures.every((f) => {
        const dbKey = FEATURE_MAP[f];
        return dbKey && (shop.features as unknown as Record<string, boolean>)[dbKey];
      });
    });
  }

  // Price filter
  if (activePrice) {
    filteredShops = filteredShops.filter((shop) => {
      if (shop.averagePrice == null) return false;
      if (activePrice === "1") return shop.averagePrice <= 4;
      if (activePrice === "2")
        return shop.averagePrice > 4 && shop.averagePrice <= 5.5;
      if (activePrice === "3") return shop.averagePrice > 5.5;
      return true;
    });
  }

  // Neighborhood filter
  if (activeNeighborhood) {
    filteredShops = filteredShops.filter(
      (shop) =>
        shop.neighborhood?.toLowerCase() === activeNeighborhood.toLowerCase()
    );
  }

  // Sort by total score descending
  filteredShops.sort(
    (a, b) => (b.scores?.totalScore ?? 0) - (a.scores?.totalScore ?? 0)
  );

  // Get unique neighborhoods for reference
  const neighborhoods = [
    ...new Set(
      publishedShops
        .map((s) => s.neighborhood)
        .filter((n): n is string => n != null)
    ),
  ].sort();

  const mapCenter: [number, number] = [
    city.latitudeCenter ?? 40.4168,
    city.longitudeCenter ?? -3.7038,
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", href: "/" },
            { name: city.name },
          ]),
          collectionPageJsonLd({
            name: `Bubble Tea en ${city.name}`,
            description:
              city.seoDescription ??
              `Descubre los mejores locales de bubble tea en ${city.name}.`,
            url: `/${slug}`,
          }),
        ]}
      />
      <main className="pt-24">
        {/* Hero */}
        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-8">
              <Link href="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <span className="text-on-background font-semibold">
                {city.name}
              </span>
            </nav>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif text-on-background mb-4 italic">
                  Bubble Tea en {city.name}
                </h1>
                {city.shortDescription && (
                  <p className="text-on-surface-variant max-w-xl leading-relaxed">
                    {city.shortDescription}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <span className="text-3xl font-serif font-bold text-primary">
                    {publishedShops.length}
                  </span>
                  <p className="text-xs text-on-surface-variant mt-1">
                    locales
                  </p>
                </div>
                <Link
                  href={`/${slug}/mejores-bubble-tea`}
                  className="bg-primary text-on-primary rounded-full px-6 py-3 font-bold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">
                    emoji_events
                  </span>
                  Ver ranking
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Filters + Grid + Map */}
        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            {/* Filters */}
            <div className="mb-10">
              <ShopFilters />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Shop grid */}
              <div className="lg:col-span-2">
                {filteredShops.length === 0 ? (
                  <div className="text-center py-20">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4 block">
                      search_off
                    </span>
                    <p className="text-on-surface-variant">
                      No hay locales con estos filtros. Prueba a limpiar los
                      filtros.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredShops.map((shop) => (
                      <ShopCard
                        key={shop.id}
                        name={shop.name}
                        slug={shop.slug}
                        citySlug={slug}
                        neighborhood={shop.neighborhood}
                        averagePrice={shop.averagePrice}
                        editorSummary={shop.editorSummary}
                        totalScore={shop.scores?.totalScore ?? null}
                        features={
                          shop.features
                            ? {
                                veganOptions: shop.features.veganOptions,
                                wifi: shop.features.wifi,
                                studyFriendly: shop.features.studyFriendly,
                                photoFriendly: shop.features.photoFriendly,
                                petFriendly: shop.features.petFriendly,
                                takeaway: shop.features.takeaway,
                              }
                            : null
                        }
                        imageUrl={shop.image?.imageUrl ?? null}
                        imageAlt={shop.image?.altText ?? null}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Map sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 h-[500px]">
                  <ShopMap
                    shops={filteredShops}
                    center={mapCenter}
                    citySlug={slug}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Long description */}
        {city.longDescription && (
          <section className="px-6 py-20 bg-surface-container-low">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-serif text-on-background mb-8 italic">
                Guía de Bubble Tea en {city.name}
              </h2>
              <div className="prose prose-stone text-on-surface-variant leading-relaxed whitespace-pre-line">
                {city.longDescription}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
