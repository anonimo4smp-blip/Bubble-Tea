/**
 * Calcula las puntuaciones editoriales por dimensión para todos los locales.
 *
 * Fórmula del ranking (CLAUDE.md):
 *   35% calidad | 15% precio | 15% variedad | 10% experiencia | 15% Google | 10% popularidad
 *
 * Heurísticas (hasta que haya revisión editorial manual):
 *   - qualityScore:       google rating normalizado + bonus por review volume
 *   - priceScore:         basado en averagePrice (rango 3-7€, menor = mejor puntuación)
 *   - varietyScore:       nº de features activas / 10 × 100, con floor
 *   - experienceScore:    features de experiencia (seating, wifi, study, photo, pet, accessible)
 *   - googleRatingScore:  rating × 20
 *   - popularityScore:    reviewCount normalizado (log scale) dentro de la ciudad
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { prepare: false });

// ── helpers ──────────────────────────────────────────────────────────────────

function clamp(v, lo = 0, hi = 100) {
  return Math.round(Math.min(hi, Math.max(lo, v)) * 10) / 10;
}

function googleRatingScore(rating) {
  if (rating == null) return null;
  return clamp(rating * 20);
}

function qualityScore(rating, reviewCount) {
  // Base: google rating normalizado (0-100)
  const base = rating != null ? rating * 20 : 50;
  // Bonus por volumen de reseñas (hasta +10): log10(reviews) * 3.3, cap 10
  const volumeBonus =
    reviewCount > 0 ? Math.min(10, Math.log10(reviewCount) * 3.3) : 0;
  return clamp(base + volumeBonus);
}

function priceScore(avgPrice) {
  // Sin dato → neutro
  if (avgPrice == null) return 60;
  // Rango esperado 3-7€. Más barato = mejor puntuación.
  // 3€ → 95, 5€ → 70, 7€ → 45
  return clamp(95 - (avgPrice - 3) * 12.5);
}

function varietyScore(features) {
  if (!features) return 40; // neutro sin dato
  const bools = [
    features.vegan_options,
    features.lactose_free_options,
    features.gluten_free_options,
    features.takeaway,
    features.seating,
    features.wifi,
    features.study_friendly,
    features.photo_friendly,
    features.pet_friendly,
    features.wheelchair_accessible,
  ];
  const count = bools.filter(Boolean).length;
  // 0 features → 30, 10 features → 100
  return clamp(30 + count * 7);
}

function experienceScore(features) {
  if (!features) return 45;
  // Features que influyen en la experiencia del local
  const expFeatures = [
    features.seating,
    features.wifi,
    features.study_friendly,
    features.photo_friendly,
    features.pet_friendly,
    features.wheelchair_accessible,
  ];
  const count = expFeatures.filter(Boolean).length;
  // 0 → 35, 6 → 95
  return clamp(35 + count * 10);
}

function popularityScore(reviewCount, maxReviewsInCity) {
  if (reviewCount == null || reviewCount === 0) return 30;
  if (maxReviewsInCity <= 0) return 50;
  // Log-scale normalization relative to city max
  const ratio =
    Math.log10(reviewCount + 1) / Math.log10(maxReviewsInCity + 1);
  return clamp(30 + ratio * 70);
}

function totalScore(q, pr, v, e, g, pop) {
  // weighted average using CLAUDE.md weights
  const vals = [
    { score: q, weight: 0.35 },
    { score: pr, weight: 0.15 },
    { score: v, weight: 0.15 },
    { score: e, weight: 0.10 },
    { score: g, weight: 0.15 },
    { score: pop, weight: 0.10 },
  ];
  let weightSum = 0;
  let scoreSum = 0;
  for (const { score, weight } of vals) {
    if (score != null) {
      scoreSum += score * weight;
      weightSum += weight;
    }
  }
  if (weightSum === 0) return null;
  return clamp(scoreSum / weightSum);
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Get all published shops with their features
  const shopsData = await sql`
    SELECT
      s.id, s.city_id, s.name, s.google_rating, s.google_review_count, s.average_price,
      f.vegan_options, f.lactose_free_options, f.gluten_free_options,
      f.takeaway, f.seating, f.wifi, f.study_friendly, f.photo_friendly,
      f.pet_friendly, f.wheelchair_accessible
    FROM shops s
    LEFT JOIN shop_features f ON f.shop_id = s.id
    WHERE s.status = 'published'
    ORDER BY s.city_id, s.id
  `;

  // Compute max reviewCount per city for popularity normalization
  const maxReviews = {};
  for (const shop of shopsData) {
    const rc = shop.google_review_count ?? 0;
    maxReviews[shop.city_id] = Math.max(maxReviews[shop.city_id] ?? 0, rc);
  }

  let updated = 0;
  for (const shop of shopsData) {
    const g = googleRatingScore(shop.google_rating);
    const q = qualityScore(shop.google_rating, shop.google_review_count ?? 0);
    const pr = priceScore(shop.average_price);
    const v = varietyScore(shop);
    const e = experienceScore(shop);
    const pop = popularityScore(
      shop.google_review_count,
      maxReviews[shop.city_id]
    );
    const total = totalScore(q, pr, v, e, g, pop);

    await sql`
      UPDATE shop_scores SET
        quality_score = ${q},
        price_score = ${pr},
        variety_score = ${v},
        experience_score = ${e},
        google_rating_score = ${g},
        popularity_score = ${pop},
        total_score = ${total},
        calculated_at = ${new Date()}
      WHERE shop_id = ${shop.id}
    `;

    console.log(
      `${shop.name.padEnd(40)} Q=${q} P=${pr} V=${v} E=${e} G=${g} Pop=${pop} → Total=${total}`
    );
    updated++;
  }

  console.log(`\n✓ ${updated} locales actualizados.`);
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
