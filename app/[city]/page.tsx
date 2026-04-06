import type { Metadata } from "next";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import ShopFilters from "@/components/ShopFilters";
import ShopMap from "@/components/ShopMap";
import CityShopGrid from "@/components/compare/CityShopGrid";
import { db } from "@/db";
import { cities, seoPages, shopFeatures, shopImages, shops, shopScores } from "@/db/schema";
import { JsonLd, breadcrumbJsonLd, collectionPageJsonLd, faqPageJsonLd } from "@/lib/jsonld";
import { getPublishedCityParams } from "@/lib/static-params";

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ f?: string; p?: string; barrio?: string }>;
};

export async function generateStaticParams() {
  return getPublishedCityParams();
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const search = await searchParams;
  const hasFilters = !!(search.f || search.p || search.barrio);

  const [city] = await db
    .select({
      name: cities.name,
      seoTitle: cities.seoTitle,
      seoDescription: cities.seoDescription,
    })
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
    ...(hasFilters ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: city.seoTitle ?? `Bubble Tea en ${city.name}`,
      description:
        city.seoDescription ??
        `Descubre los mejores locales de bubble tea en ${city.name}.`,
    },
  };
}

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

  const shopIds = publishedShops.map((s) => s.id);

  const allFeaturesAll = shopIds.length ? await db.select().from(shopFeatures) : [];
  const featuresMap = new Map(
    allFeaturesAll
      .filter((f) => shopIds.includes(f.shopId))
      .map((f) => [f.shopId, f])
  );

  const allScoresAll = shopIds.length ? await db.select().from(shopScores) : [];
  const scoresMap = new Map(
    allScoresAll
      .filter((s) => shopIds.includes(s.shopId))
      .map((s) => [s.shopId, s])
  );

  const allImagesAll = shopIds.length ? await db.select().from(shopImages) : [];
  const imagesMap = new Map(
    allImagesAll
      .filter((i) => shopIds.includes(i.shopId) && i.isPrimary)
      .map((i) => [i.shopId, i])
  );

  const activeFeatures = search.f?.split(",").filter(Boolean) ?? [];
  const activePrice = search.p ?? "";
  const activeNeighborhood = search.barrio ?? "";

  let filteredShops = publishedShops.map((shop) => {
    const image = imagesMap.get(shop.id) ?? null;
    return {
      ...shop,
      features: featuresMap.get(shop.id) ?? null,
      scores: scoresMap.get(shop.id) ?? null,
      image,
      imageUrl: image?.imageUrl ?? null,
      imageAlt: image?.altText ?? null,
    };
  });

  if (activeFeatures.length > 0) {
    filteredShops = filteredShops.filter((shop) => {
      if (!shop.features) return false;
      return activeFeatures.every((f) => {
        const dbKey = FEATURE_MAP[f];
        return dbKey && (shop.features as unknown as Record<string, boolean>)[dbKey];
      });
    });
  }

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

  if (activeNeighborhood) {
    filteredShops = filteredShops.filter(
      (shop) => shop.neighborhood?.toLowerCase() === activeNeighborhood.toLowerCase()
    );
  }

  filteredShops.sort(
    (a, b) => (b.scores?.totalScore ?? 0) - (a.scores?.totalScore ?? 0)
  );

  const mapCenter: [number, number] = [
    city.latitudeCenter ?? 40.4168,
    city.longitudeCenter ?? -3.7038,
  ];

  const [seoPage] = await db
    .select({ faqJson: seoPages.faqJson })
    .from(seoPages)
    .where(and(eq(seoPages.entityType, "city"), eq(seoPages.entityId, city.id)))
    .limit(1);

  const faqs: { q: string; a: string }[] = seoPage?.faqJson
    ? JSON.parse(seoPage.faqJson)
    : [];

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
          ...(faqs.length > 0 ? [faqPageJsonLd(faqs)] : []),
        ]}
      />
      <main className="pt-24">
        <section className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-8">
              <Link href="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <span className="text-on-background font-semibold">{city.name}</span>
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
                  <p className="text-xs text-on-surface-variant mt-1">locales</p>
                </div>
                <Link href={`/${slug}/mejores-bubble-tea`} className="btn btn-primary btn-md">
                  <Icon name="emoji_events" className="text-lg" />
                  Ver ranking
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <ShopFilters />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                {filteredShops.length === 0 ? (
                  <div className="text-center py-20">
                    <Icon
                      name="search_off"
                      className="text-5xl text-on-surface-variant/40 mb-4 block"
                    />
                    <p className="text-on-surface-variant">
                      No hay locales con estos filtros. Prueba a limpiar los filtros.
                    </p>
                  </div>
                ) : (
                  <CityShopGrid
                    citySlug={slug}
                    shops={filteredShops.map((shop) => ({
                      id: shop.id,
                      name: shop.name,
                      slug: shop.slug,
                      neighborhood: shop.neighborhood,
                      averagePrice: shop.averagePrice,
                      editorSummary: shop.editorSummary,
                      totalScore: shop.scores?.totalScore ?? null,
                      imageUrl: shop.image?.imageUrl ?? null,
                      imageAlt: shop.image?.altText ?? null,
                      features: shop.features
                        ? {
                            veganOptions: shop.features.veganOptions,
                            wifi: shop.features.wifi,
                            studyFriendly: shop.features.studyFriendly,
                            photoFriendly: shop.features.photoFriendly,
                            petFriendly: shop.features.petFriendly,
                            takeaway: shop.features.takeaway,
                            seating: shop.features.seating,
                            lactoseFreeOptions: shop.features.lactoseFreeOptions,
                            glutenFreeOptions: shop.features.glutenFreeOptions,
                            wheelchairAccessible: shop.features.wheelchairAccessible,
                          }
                        : null,
                    }))}
                  />
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 h-[500px]">
                  <ShopMap shops={filteredShops} center={mapCenter} citySlug={slug} />
                </div>
              </div>
            </div>
          </div>
        </section>

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

        {faqs.length > 0 && (
          <section className="px-6 py-20">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-serif text-on-background mb-10 italic">
                Preguntas frecuentes
              </h2>
              <dl className="space-y-6">
                {faqs.map((faq, i) => (
                  <div key={i}>
                    <dt className="text-on-background font-bold text-lg mb-2">
                      {faq.q}
                    </dt>
                    <dd className="text-on-surface-variant leading-relaxed">
                      {faq.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
