import type { Metadata } from "next";
import { and, count, eq } from "drizzle-orm";
import Footer from "@/components/Footer";
import FeaturedCities from "@/components/FeaturedCities";
import { db } from "@/db";
import { cities, shops } from "@/db/schema";

export const metadata: Metadata = {
  title: "Ciudades | Bubble Tea España",
  description:
    "Explora las ciudades de Bubble Tea España y descubre las mejores guías de Madrid, Barcelona y Vigo.",
};

export default async function CitiesPage() {
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

  const featuredCities = publishedCities.map((city) => ({
    name: city.name,
    slug: city.slug,
    count: Number(city.shopCount),
    description: city.shortDescription ?? "",
  }));

  return (
    <>
      <main className="pt-24">
        <section className="px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="section-kicker">Guías por ciudad</p>
            <h1 className="section-title section-title-lg mb-6">
              Dónde tomar bubble tea en España
            </h1>
            <p className="section-copy-lg">
              Reunimos nuestras ciudades de lanzamiento en una sola vista para
              que puedas elegir rápido tu próxima ruta de boba.
            </p>
          </div>
        </section>
        <FeaturedCities cities={featuredCities} showHeaderLink={false} />
      </main>
      <Footer />
    </>
  );
}
