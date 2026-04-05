import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { shops, shopImages } from "../db/schema";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

// Curated Unsplash photo IDs — bubble tea, boba, tea shops, cafés
const PHOTO_IDS = [
  "photo-1558857563-b371033873b8", // bubble tea close-up
  "photo-1525803377221-3e8b5e53e169", // boba tea
  "photo-1556679343-c7306c1976bc", // tea drinks
  "photo-1541167760496-1628856ab772", // colorful drinks
  "photo-1534353473418-4cfa6c56fd38", // cafe interior
  "photo-1554118811-1e0d58224f24", // cozy cafe
  "photo-1559305616-3f99cd43e353", // cafe seating
  "photo-1509042239860-f550ce710b93", // coffee shop
  "photo-1495474472287-4d71bcdd2085", // cafe atmosphere
  "photo-1501339847302-ac426a4a7cbb", // drinks on table
  "photo-1572442388796-11668a67e53d", // asian tea
  "photo-1563805042-7684c019e1cb", // colorful beverages
  "photo-1544787219-7f47ccb76574", // tea preparation
  "photo-1558618666-fcd25c85f82e", // matcha drink
  "photo-1497935586351-b67a49e012bf", // tea cups
  "photo-1517701604599-bb29b565090c", // cafe counter
  "photo-1521017432531-fbd92d768814", // tea shop
  "photo-1504753793650-d4a2b783c15e", // drinks variety
  "photo-1546069901-ba9599a7e63c", // asian drinks
  "photo-1551024709-8f23befc6f87", // iced tea
  "photo-1498804103079-a6351b050096", // modern cafe
  "photo-1559925393-8be0ec4767c8", // outdoor cafe
  "photo-1453614512568-c4024d13c247", // warm cafe
  "photo-1507914464562-6ff4ac29692f", // tea pouring
  "photo-1560807707-8cc77767d783", // boba drinks
  "photo-1536935338788-846bb9981813", // fruit tea
  "photo-1571934811356-5cc061b6821f", // cafe decor
  "photo-1445116572660-236099ec97a0", // coffee house
  "photo-1466027449885-7bdf0c14d5c1", // minimal cafe
  "photo-1521295121783-8a321d551ad2", // tea set
  "photo-1517248135467-4c7edcad34c4", // restaurant interior
  "photo-1559329007-40df8a9345d8", // cafe bar
  "photo-1528605248644-14dd04022da1", // group at cafe
  "photo-1514432324607-a09d9b4aefda", // artisan drinks
  "photo-1485182708500-e8f1f318ba72", // cold drinks
  "photo-1493770348161-369560ae357d", // food photography
  "photo-1528698827591-e19cef1a992c", // tea shop interior
  "photo-1531947398206-70a4ee0f0233", // smoothie
  "photo-1470338950318-40e1c2a4f23e", // cafe lifestyle
  "photo-1414235077428-338989a2e8c0", // beverages
  "photo-1529892485617-25f63e7be1e8", // tea leaves
  "photo-1565958011703-44f9829ba187", // dessert drinks
  "photo-1524512094891-1a10bf91c55c", // modern interior
  "photo-1551218808-94e220e084d2", // iced beverages
  "photo-1514066558159-fc8c737ef259", // fruit smoothie
  "photo-1577590835286-1cdd50c825d4", // japanese tea
  "photo-1567880905822-56f8e06fe630", // trendy cafe
  "photo-1542181961-9590d0c79dab", // warm drinks
];

function unsplashUrl(photoId: string, w = 800, h = 600): string {
  return `https://images.unsplash.com/${photoId}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

async function main() {
  // Get all shops
  const allShops = await db
    .select({ id: shops.id, name: shops.name, slug: shops.slug })
    .from(shops)
    .orderBy(shops.id);

  console.log(`Found ${allShops.length} shops. Inserting images...`);

  // Delete existing images first
  await db.delete(shopImages);
  console.log("Cleared existing images.");

  let photoIdx = 0;

  for (const shop of allShops) {
    // Each shop gets 1 primary + 2 secondary images (3 total)
    const primaryId = PHOTO_IDS[photoIdx % PHOTO_IDS.length];
    const secondaryId1 = PHOTO_IDS[(photoIdx + 1) % PHOTO_IDS.length];
    const secondaryId2 = PHOTO_IDS[(photoIdx + 2) % PHOTO_IDS.length];

    await db.insert(shopImages).values([
      {
        shopId: shop.id,
        imageUrl: unsplashUrl(primaryId),
        altText: `Interior y bebidas de ${shop.name}`,
        isPrimary: true,
        sortOrder: 0,
      },
      {
        shopId: shop.id,
        imageUrl: unsplashUrl(secondaryId1, 400, 300),
        altText: `Bubble tea en ${shop.name}`,
        isPrimary: false,
        sortOrder: 1,
      },
      {
        shopId: shop.id,
        imageUrl: unsplashUrl(secondaryId2, 400, 300),
        altText: `Ambiente de ${shop.name}`,
        isPrimary: false,
        sortOrder: 2,
      },
    ]);

    photoIdx += 3; // Offset so each shop gets different photos
    console.log(`  ✓ ${shop.name} (3 images)`);
  }

  console.log(`\nDone! Inserted ${allShops.length * 3} images for ${allShops.length} shops.`);
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
