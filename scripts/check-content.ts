import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  cities,
  shops,
  shopFeatures,
  shopScores,
  shopHours,
  shopImages,
} from "../db/schema";
import { eq, count } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

async function main() {
  const allCities = await db
    .select({
      id: cities.id,
      name: cities.name,
      slug: cities.slug,
      status: cities.status,
    })
    .from(cities);
  console.log(`=== CIUDADES (${allCities.length}) ===`);
  allCities.forEach((c) => console.log(JSON.stringify(c)));

  console.log("\n=== TIENDAS POR CIUDAD ===");
  for (const city of allCities) {
    const cityShops = await db
      .select({
        id: shops.id,
        name: shops.name,
        status: shops.status,
        address: shops.address,
        averagePrice: shops.averagePrice,
        editorSummary: shops.editorSummary,
        neighborhood: shops.neighborhood,
      })
      .from(shops)
      .where(eq(shops.cityId, city.id));
    console.log(`${city.name}: ${cityShops.length} tiendas`);
    cityShops.forEach((s) =>
      console.log(
        `  ${s.name} [${s.status}] addr=${!!s.address} price=${s.averagePrice} summary=${s.editorSummary ? s.editorSummary.substring(0, 40) + "..." : "NO"} barrio=${s.neighborhood || "NO"}`
      )
    );
  }

  const [f] = await db.select({ total: count() }).from(shopFeatures);
  const [sc] = await db.select({ total: count() }).from(shopScores);
  const [h] = await db.select({ total: count() }).from(shopHours);
  const [im] = await db.select({ total: count() }).from(shopImages);
  console.log(
    `\nFeatures: ${f.total} | Scores: ${sc.total} | Hours: ${h.total} | Images: ${im.total}`
  );

  await client.end();
}

main();
