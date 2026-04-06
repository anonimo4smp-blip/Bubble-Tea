import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { cities, shops } from "@/db/schema";

export async function getPublishedCityParams(): Promise<{ city: string }[]> {
  const publishedCities = await db
    .select({ city: cities.slug })
    .from(cities)
    .where(eq(cities.status, "published"));

  return publishedCities;
}

export async function getPublishedShopParams(): Promise<
  { city: string; shopSlug: string }[]
> {
  const publishedShops = await db
    .select({
      city: cities.slug,
      shopSlug: shops.slug,
    })
    .from(shops)
    .innerJoin(cities, eq(shops.cityId, cities.id))
    .where(
      and(eq(shops.status, "published"), eq(cities.status, "published"))
    );

  return publishedShops;
}
