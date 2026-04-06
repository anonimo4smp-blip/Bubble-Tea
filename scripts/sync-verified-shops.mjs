import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const ROOT = process.cwd();
const VERIFIED_FILE = path.join(ROOT, "data", "verified-shops.json");

const CITY_COPY = {
  madrid: {
    shortDescription:
      "Madrid concentra una escena amplia de bubble tea con locales verificados entre Centro, Chamberí, Malasaña y Usera.",
    longDescription:
      "Madrid se ha consolidado como uno de los grandes focos del bubble tea en España. La oferta se reparte entre el centro histórico, ejes comerciales muy transitados y zonas con fuerte presencia de restauración asiática como Usera. Esta guía reúne únicamente locales verificados con datos revisados para ayudarte a comparar ubicaciones, horarios y estilos de carta sin depender de listados inflados o fichas desactualizadas.",
    seoTitle: "Bubble Tea en Madrid: locales verificados y ranking (2026)",
    seoDescription:
      "Guía de bubble tea en Madrid con locales verificados, mapa, horarios y ranking actualizado.",
  },
  barcelona: {
    shortDescription:
      "Barcelona reúne una escena muy activa de bubble tea entre Ciutat Vella, Eixample, Gràcia, Sant Martí y Les Corts.",
    longDescription:
      "Barcelona mezcla cadenas reconocidas, locales especializados y conceptos híbridos de bubble tea repartidos por Ciutat Vella, Eixample y otros barrios con mucha vida gastronómica. En esta página se muestran solo fichas verificadas para que puedas localizar con rapidez qué tiendas siguen operativas, dónde están y qué tipo de experiencia ofrecen.",
    seoTitle: "Bubble Tea en Barcelona: locales verificados y ranking (2026)",
    seoDescription:
      "Guía de bubble tea en Barcelona con locales verificados, mapa, horarios y ranking actualizado.",
  },
  vigo: {
    shortDescription:
      "Vigo mantiene una escena pequeña pero activa de bubble tea, concentrada entre el centro y Vialia.",
    longDescription:
      "La oferta de bubble tea en Vigo es más compacta que en Madrid o Barcelona, pero sigue creciendo entre locales especializados, propuestas en centros comerciales y cartas asiáticas con bebidas de tapioca. Esta guía prioriza exactitud antes que volumen: solo se publican fichas que hemos podido verificar con fuentes actuales y se retiran las que ya no siguen activas.",
    seoTitle: "Bubble Tea en Vigo: locales verificados y ranking (2026)",
    seoDescription:
      "Guía de bubble tea en Vigo con locales verificados, mapa, horarios y ranking actualizado.",
  },
};

function scoreFromRating(rating) {
  if (typeof rating !== "number" || Number.isNaN(rating)) return null;
  return Math.round(rating * 20 * 10) / 10;
}

function makeAuditNote(shop) {
  return `Verificado el ${new Date().toISOString().slice(0, 10)} · fuentes: ${shop.sourceUrls.join(
    " | "
  )}`;
}

async function syncShop(tx, rowId, shop, publishedAt) {
  const reviewScore = scoreFromRating(shop.rating);

  await tx`
    update shops
    set
      name = ${shop.name},
      slug = ${shop.slug},
      brand_name = ${shop.brandName ?? null},
      is_independent = ${shop.isIndependent},
      status = ${shop.status},
      address = ${shop.address ?? null},
      postal_code = ${shop.postalCode ?? null},
      neighborhood = ${shop.neighborhood ?? null},
      latitude = ${shop.latitude ?? null},
      longitude = ${shop.longitude ?? null},
      google_maps_url = ${shop.googleMapsUrl ?? null},
      google_rating = ${shop.rating ?? null},
      google_review_count = ${shop.reviewCount ?? null},
      website_url = ${shop.websiteUrl ?? null},
      instagram_url = ${shop.instagramUrl ?? null},
      tiktok_url = ${null},
      price_min = ${shop.priceMin ?? null},
      price_max = ${shop.priceMax ?? null},
      average_price = ${shop.averagePrice ?? null},
      editor_summary = ${shop.editorSummary ?? null},
      why_it_stands_out = ${shop.whyItStandsOut ?? null},
      recommended_order = ${shop.recommendedOrder ?? null},
      last_reviewed_at = ${new Date()},
      published_at = ${publishedAt},
      updated_at = ${new Date()}
    where id = ${rowId}
  `;

  await tx`delete from shop_features where shop_id = ${rowId}`;
  await tx`
    insert into shop_features (
      shop_id,
      vegan_options,
      lactose_free_options,
      gluten_free_options,
      takeaway,
      seating,
      wifi,
      study_friendly,
      photo_friendly,
      pet_friendly,
      wheelchair_accessible
    ) values (
      ${rowId},
      ${Boolean(shop.features?.veganOptions)},
      ${Boolean(shop.features?.lactoseFreeOptions)},
      ${Boolean(shop.features?.glutenFreeOptions)},
      ${Boolean(shop.features?.takeaway)},
      ${Boolean(shop.features?.seating)},
      ${Boolean(shop.features?.wifi)},
      ${Boolean(shop.features?.studyFriendly)},
      ${Boolean(shop.features?.photoFriendly)},
      ${Boolean(shop.features?.petFriendly)},
      ${Boolean(shop.features?.wheelchairAccessible)}
    )
  `;

  await tx`delete from shop_hours where shop_id = ${rowId}`;
  for (const hour of shop.hours ?? []) {
    await tx`
      insert into shop_hours (shop_id, weekday, opens_at, closes_at, is_closed)
      values (
        ${rowId},
        ${hour.weekday},
        ${hour.opensAt ?? null},
        ${hour.closesAt ?? null},
        ${hour.isClosed}
      )
    `;
  }

  await tx`delete from shop_scores where shop_id = ${rowId}`;
  await tx`
    insert into shop_scores (
      shop_id,
      quality_score,
      price_score,
      variety_score,
      experience_score,
      google_rating_score,
      popularity_score,
      total_score,
      score_version,
      calculated_at
    ) values (
      ${rowId},
      ${null},
      ${null},
      ${null},
      ${null},
      ${reviewScore},
      ${null},
      ${reviewScore},
      ${1},
      ${new Date()}
    )
  `;

  await tx`delete from shop_images where shop_id = ${rowId}`;
  if (shop.imageUrl) {
    await tx`
      insert into shop_images (shop_id, image_url, alt_text, is_primary, sort_order)
      values (
        ${rowId},
        ${shop.imageUrl},
        ${shop.imageAlt ?? shop.name},
        ${true},
        ${0}
      )
    `;
  }
}

async function main() {
  const verified = JSON.parse(await fs.readFile(VERIFIED_FILE, "utf8"));
  const sql = postgres(process.env.DATABASE_URL, { prepare: false });

  try {
    await sql.begin(async (tx) => {
      for (const [citySlug, publishedShops] of Object.entries(verified.cities)) {
        const cityRows = await tx`select * from cities where slug = ${citySlug} limit 1`;
        const city = cityRows[0];
        if (!city) {
          throw new Error(`City not found: ${citySlug}`);
        }

        const closedShops = verified.closedShops?.[citySlug] ?? [];
        const finalShops = [...publishedShops, ...closedShops];

        const existingShops = await tx`
          select * from shops
          where city_id = ${city.id}
          order by id asc
        `;

        if (existingShops.length < finalShops.length) {
          throw new Error(
            `Not enough existing rows in ${citySlug}: have ${existingShops.length}, need ${finalShops.length}`
          );
        }

        const cityCopy = CITY_COPY[citySlug];
        await tx`
          update cities
          set
            short_description = ${cityCopy.shortDescription},
            long_description = ${cityCopy.longDescription},
            seo_title = ${cityCopy.seoTitle},
            seo_description = ${cityCopy.seoDescription},
            status = ${"published"},
            published_at = ${city.published_at ?? new Date()},
            updated_at = ${new Date()}
          where id = ${city.id}
        `;

        await tx`
          update shops
          set
            slug = concat('sync-', id, '-', slug),
            updated_at = ${new Date()}
          where city_id = ${city.id}
        `;

        for (let index = 0; index < finalShops.length; index += 1) {
          const targetRow = existingShops[index];
          const shop = finalShops[index];
          const publishedAt =
            shop.status === "published"
              ? targetRow.published_at ?? new Date()
              : targetRow.published_at;

          await syncShop(tx, targetRow.id, shop, publishedAt);
          console.log(
            `${citySlug} :: ${targetRow.id} -> ${shop.name} [${shop.status}] :: ${makeAuditNote(
              shop
            )}`
          );
        }

        for (let index = finalShops.length; index < existingShops.length; index += 1) {
          const leftover = existingShops[index];
          await tx`
            update shops
            set
              status = ${"archived"},
              updated_at = ${new Date()},
              last_reviewed_at = ${new Date()}
            where id = ${leftover.id}
          `;
          await tx`delete from shop_images where shop_id = ${leftover.id}`;
        }
      }
    });
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
