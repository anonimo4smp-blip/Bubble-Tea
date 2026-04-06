import type { MetadataRoute } from "next";
import { db } from "@/db";
import { cities, shops } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Published cities
  const publishedCities = await db
    .select({
      id: cities.id,
      slug: cities.slug,
      updatedAt: cities.updatedAt,
    })
    .from(cities)
    .where(eq(cities.status, "published"));

  const cityIdToSlug = new Map(publishedCities.map((c) => [c.id, c.slug]));

  // Published shops
  const publishedShops = await db
    .select({
      slug: shops.slug,
      updatedAt: shops.updatedAt,
      cityId: shops.cityId,
    })
    .from(shops)
    .where(eq(shops.status, "published"));

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/ciudades`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/bubble-tea-en-espana`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // City + ranking pages
  const cityPages: MetadataRoute.Sitemap = publishedCities.flatMap((city) => [
      {
        url: `${SITE_URL}/${city.slug}`,
        lastModified: city.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/${city.slug}/mejores-bubble-tea`,
        lastModified: city.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
    ]);

  // Shop detail pages
  const shopPages: MetadataRoute.Sitemap = publishedShops
    .filter((shop) => cityIdToSlug.has(shop.cityId))
    .map((shop) => ({
      url: `${SITE_URL}/${cityIdToSlug.get(shop.cityId)}/${shop.slug}`,
      lastModified: shop.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...cityPages, ...shopPages];
}
