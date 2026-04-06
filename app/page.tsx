import { and, count, desc, eq } from "drizzle-orm";
import Hero from "@/components/Hero";
import FeaturedCities from "@/components/FeaturedCities";
import RankingPreview from "@/components/RankingPreview";
import ValueProps from "@/components/ValueProps";
import HowItWorks from "@/components/HowItWorks";
import EditorialBlock from "@/components/EditorialBlock";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/constants";
import { db } from "@/db";
import { cities, shopFeatures, shops, shopScores } from "@/db/schema";

type PreviewFeatureKey =
  | "takeaway"
  | "seating"
  | "wheelchairAccessible"
  | "photoFriendly"
  | "wifi"
  | "veganOptions";

const FEATURE_LABELS: [PreviewFeatureKey, string][] = [
  ["takeaway", "Para llevar"],
  ["seating", "Con asientos"],
  ["wheelchairAccessible", "Accesible"],
  ["photoFriendly", "Fotogénico"],
  ["wifi", "WiFi"],
  ["veganOptions", "Vegano"],
];

function priceLabel(value: number | null) {
  if (value == null) return null;
  if (value <= 4) return "EUR";
  if (value <= 5.5) return "EUR EUR";
  return "EUR EUR EUR";
}

export default async function Home() {
  const publishedCities = await db
    .select({
      id: cities.id,
      name: cities.name,
      slug: cities.slug,
      shortDescription: cities.shortDescription,
      shopCount: count(shops.id),
    })
    .from(cities)
    .leftJoin(shops, and(eq(shops.cityId, cities.id), eq(shops.status, "published")))
    .where(eq(cities.status, "published"))
    .groupBy(cities.id)
    .orderBy(cities.id);

  const [madrid] = await db
    .select({ id: cities.id })
    .from(cities)
    .where(eq(cities.slug, "madrid"))
    .limit(1);

  const rankingRows = madrid
    ? await db
        .select({
          id: shops.id,
          name: shops.name,
          slug: shops.slug,
          neighborhood: shops.neighborhood,
          averagePrice: shops.averagePrice,
          totalScore: shopScores.totalScore,
          takeaway: shopFeatures.takeaway,
          seating: shopFeatures.seating,
          wheelchairAccessible: shopFeatures.wheelchairAccessible,
          photoFriendly: shopFeatures.photoFriendly,
          wifi: shopFeatures.wifi,
          veganOptions: shopFeatures.veganOptions,
        })
        .from(shops)
        .leftJoin(shopScores, eq(shopScores.shopId, shops.id))
        .leftJoin(shopFeatures, eq(shopFeatures.shopId, shops.id))
        .where(and(eq(shops.cityId, madrid.id), eq(shops.status, "published")))
        .orderBy(desc(shopScores.totalScore), desc(shops.id))
        .limit(3)
    : [];

  const featuredCities = publishedCities.map((city) => ({
    name: city.name,
    slug: city.slug,
    count: Number(city.shopCount),
    description: city.shortDescription ?? "",
  }));

  const rankingItems = rankingRows.map((row, index) => {
    const tags = FEATURE_LABELS.filter(([key]) => Boolean(row[key]))
      .slice(0, 3)
      .map(([, label]) => label);

    return {
      position: index + 1,
      name: row.name,
      location: row.neighborhood ? `${row.neighborhood}, Madrid` : "Madrid",
      priceLabel: priceLabel(row.averagePrice),
      tags,
      href: `/madrid/${row.slug}`,
    };
  });

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bubble Tea España",
    url: SITE_URL,
    description:
      "La primera guía de autor dedicada exclusivamente a la excelencia del té de burbujas en territorio español.",
    inLanguage: "es",
  };

  return (
    <>
      <JsonLd data={[websiteJsonLd, breadcrumbJsonLd([{ name: "Inicio" }])]} />
      <main>
        <Hero />
        <FeaturedCities cities={featuredCities} />
        <RankingPreview items={rankingItems} />
        <ValueProps />
        <HowItWorks />
        <EditorialBlock />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
