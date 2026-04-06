import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { db } from "@/db";
import {
  cities,
  shopFeatures,
  shopImages,
  shops,
  shopScores,
} from "@/db/schema";
import {
  JsonLd,
  breadcrumbJsonLd,
  collectionPageJsonLd,
  itemListJsonLd,
} from "@/lib/jsonld";
import { getPublishedCityParams } from "@/lib/static-params";

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  return getPublishedCityParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const [city] = await db
    .select({ name: cities.name })
    .from(cities)
    .where(and(eq(cities.slug, slug), eq(cities.status, "published")))
    .limit(1);

  if (!city) return {};

  return {
    title: `Mejores Bubble Tea en ${city.name} (2026) | Ranking Editorial`,
    description: `Ranking editorial de los mejores locales de bubble tea en ${city.name}. Puntuación basada en calidad, precio, variedad, experiencia y popularidad.`,
    alternates: { canonical: `/${slug}/mejores-bubble-tea` },
    openGraph: {
      title: `Mejores Bubble Tea en ${city.name} (2026)`,
      description: `Ranking editorial de los mejores locales de bubble tea en ${city.name}.`,
    },
  };
}

export default async function RankingPage({ params }: Props) {
  const { city: slug } = await params;

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
      averagePrice: shops.averagePrice,
      editorSummary: shops.editorSummary,
      whyItStandsOut: shops.whyItStandsOut,
      lastReviewedAt: shops.lastReviewedAt,
    })
    .from(shops)
    .where(and(eq(shops.cityId, city.id), eq(shops.status, "published")));

  const shopIds = publishedShops.map((s) => s.id);

  const allFeatures = shopIds.length ? await db.select().from(shopFeatures) : [];
  const featuresMap = new Map(
    allFeatures
      .filter((f) => shopIds.includes(f.shopId))
      .map((f) => [f.shopId, f])
  );

  const allScores = shopIds.length ? await db.select().from(shopScores) : [];
  const scoresMap = new Map(
    allScores
      .filter((s) => shopIds.includes(s.shopId))
      .map((s) => [s.shopId, s])
  );

  const allImages = shopIds.length ? await db.select().from(shopImages) : [];
  const imagesMap = new Map(
    allImages
      .filter((i) => shopIds.includes(i.shopId) && i.isPrimary)
      .map((i) => [i.shopId, i])
  );

  const now = new Date();
  const cutoff = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);

  const rankedShops = publishedShops
    .map((shop) => ({
      ...shop,
      features: featuresMap.get(shop.id) ?? null,
      scores: scoresMap.get(shop.id) ?? null,
      image: imagesMap.get(shop.id) ?? null,
    }))
    .filter(
      (shop) =>
        shop.scores?.totalScore != null &&
        shop.lastReviewedAt != null &&
        new Date(shop.lastReviewedAt) >= cutoff
    )
    .sort((a, b) => (b.scores!.totalScore ?? 0) - (a.scores!.totalScore ?? 0));

  const badgeColors = [
    "bg-primary text-on-primary",
    "bg-primary-container text-on-primary-container",
    "bg-secondary-container text-on-secondary-container",
  ];
  const rankingUrl = `/${slug}/mejores-bubble-tea`;
  const itemList = itemListJsonLd({
    name: `Ranking de bubble tea en ${city.name}`,
    description: `Listado ordenado de los mejores locales de bubble tea en ${city.name} segun metodologia editorial.`,
    url: rankingUrl,
    items: rankedShops.map((shop, index) => ({
      position: index + 1,
      name: shop.name,
      url: `/${slug}/${shop.slug}`,
      imageUrl: shop.image?.imageUrl ?? null,
    })),
  });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Inicio", href: "/" },
            { name: city.name, href: `/${slug}` },
            { name: "Ranking" },
          ]),
          collectionPageJsonLd({
            name: `Mejores Bubble Tea en ${city.name}`,
            description: `Ranking editorial de los mejores locales de bubble tea en ${city.name}.`,
            url: rankingUrl,
          }),
          ...(rankedShops.length > 0 ? [itemList] : []),
        ]}
      />
      <main className="pt-24">
        <section className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-8">
              <Link href="/" className="hover:text-primary transition-colors">
                Inicio
              </Link>
              <span>/</span>
              <Link href={`/${slug}`} className="hover:text-primary transition-colors">
                {city.name}
              </Link>
              <span>/</span>
              <span className="text-on-background font-semibold">Ranking</span>
            </nav>

            <div className="text-center mb-16">
              <p className="text-on-surface-variant tracking-widest uppercase text-xs font-bold mb-4">
                Ranking editorial · Actualizado 2026
              </p>
              <h1 className="text-4xl md:text-6xl font-serif text-on-background mb-6">
                Mejores Bubble Tea en <span className="italic">{city.name}</span>
              </h1>
              <p className="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                Puntuación editorial basada en calidad (35%), precio (15%),
                variedad (15%), experiencia (10%), rating Google (15%) y
                popularidad social (10%).
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto">
            {rankedShops.length === 0 ? (
              <div className="text-center py-20">
                <Icon
                  name="emoji_events"
                  className="text-5xl text-on-surface-variant/40 mb-4 block"
                />
                <p className="text-on-surface-variant mb-4">
                  Aun no hay suficientes locales evaluados para el ranking en{" "}
                  {city.name}.
                </p>
                <Link href={`/${slug}`} className="text-primary font-bold hover:underline">
                  Ver todos los locales
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {rankedShops.map((shop, index) => {
                  const position = index + 1;
                  const badge =
                    badgeColors[index] ??
                    "bg-surface-container text-on-surface-variant";
                  const scores = shop.scores!;

                  return (
                    <Link
                      key={shop.id}
                      href={`/${slug}/${shop.slug}`}
                      className="group card-soft-lg-hover p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8"
                    >
                      <div
                        className={`w-16 h-16 md:w-20 md:h-20 ${badge} rounded-full flex items-center justify-center text-2xl md:text-3xl font-serif shrink-0`}
                      >
                        {position}
                      </div>

                      {shop.image ? (
                        <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-xl md:block">
                          <Image
                            src={shop.image.imageUrl}
                            alt={shop.image.altText ?? shop.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ) : null}

                      <div className="flex-grow text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                          <h2 className="text-xl md:text-2xl font-bold text-on-background group-hover:text-primary transition-colors">
                            {shop.name}
                          </h2>
                          {shop.neighborhood && (
                            <span className="text-on-surface-variant text-sm">
                              {shop.neighborhood}
                            </span>
                          )}
                          {shop.averagePrice != null && (
                            <span className="text-primary font-bold text-sm">
                              ~{shop.averagePrice.toFixed(1)} EUR
                            </span>
                          )}
                        </div>
                        {shop.whyItStandsOut && (
                          <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 mb-3">
                            {shop.whyItStandsOut}
                          </p>
                        )}
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          {[
                            {
                              label: "Total",
                              value: scores.totalScore,
                              bold: true,
                            },
                            { label: "Calidad", value: scores.qualityScore },
                            { label: "Precio", value: scores.priceScore },
                            { label: "Variedad", value: scores.varietyScore },
                          ].map(
                            ({ label, value, bold }) =>
                              value != null && (
                                <span
                                  key={label}
                                  className={`text-xs ${
                                    bold
                                      ? "text-primary font-bold"
                                      : "text-on-surface-variant"
                                  }`}
                                >
                                  {label}:{" "}
                                  <span className="font-semibold">
                                    {value.toFixed(1)}
                                  </span>
                                </span>
                              )
                          )}
                        </div>
                      </div>

                      <div className="bg-surface-container-lowest p-3 rounded-full group-hover:bg-primary group-hover:text-on-primary transition-all shrink-0">
                        <Icon name="chevron_right" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="px-6 py-16 bg-surface-container-low text-center">
          <Link
            href={`/${slug}`}
            className="inline-flex items-center gap-2 text-tertiary font-bold hover:gap-4 transition-all"
          >
            <Icon name="arrow_back" className="text-sm" />
            Ver todos los locales en {city.name}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
