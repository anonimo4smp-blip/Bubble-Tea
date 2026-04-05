"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { shops, shopFeatures, shopHours, shopScores } from "@/db/schema";
import { eq } from "drizzle-orm";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function str(formData: FormData, key: string): string | null {
  const v = (formData.get(key) as string)?.trim();
  return v || null;
}

function num(formData: FormData, key: string): number | null {
  const v = formData.get(key) as string;
  if (!v || v.trim() === "") return null;
  const n = parseFloat(v);
  return isNaN(n) ? null : n;
}

function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const SCORE_WEIGHTS = {
  qualityScore: 0.35,
  priceScore: 0.15,
  varietyScore: 0.15,
  experienceScore: 0.1,
  googleRatingScore: 0.15,
  popularityScore: 0.1,
} as const;

function computeTotalScore(scores: Record<string, number | null>): number | null {
  let total = 0;
  let hasAny = false;
  for (const [key, weight] of Object.entries(SCORE_WEIGHTS)) {
    const val = scores[key];
    if (val != null) {
      total += val * weight;
      hasAny = true;
    }
  }
  return hasAny ? Math.round(total * 100) / 100 : null;
}

export async function createShop(formData: FormData) {
  const name = str(formData, "name");
  const cityId = num(formData, "cityId");

  if (!name || !cityId) {
    redirect("/admin/shops/new?error=Nombre+y+ciudad+son+obligatorios");
  }

  const [shop] = await db
    .insert(shops)
    .values({
      name,
      slug: slugify(name),
      cityId,
      brandName: str(formData, "brandName"),
      isIndependent: bool(formData, "isIndependent"),
      address: str(formData, "address"),
      postalCode: str(formData, "postalCode"),
      neighborhood: str(formData, "neighborhood"),
      latitude: num(formData, "latitude"),
      longitude: num(formData, "longitude"),
      googleMapsUrl: str(formData, "googleMapsUrl"),
      websiteUrl: str(formData, "websiteUrl"),
      instagramUrl: str(formData, "instagramUrl"),
      tiktokUrl: str(formData, "tiktokUrl"),
      priceMin: num(formData, "priceMin"),
      priceMax: num(formData, "priceMax"),
      averagePrice: num(formData, "averagePrice"),
      editorSummary: str(formData, "editorSummary"),
      whyItStandsOut: str(formData, "whyItStandsOut"),
      recommendedOrder: str(formData, "recommendedOrder"),
    })
    .returning({ id: shops.id });

  const shopId = shop.id;

  // Features
  await db.insert(shopFeatures).values({
    shopId,
    veganOptions: bool(formData, "veganOptions"),
    lactoseFreeOptions: bool(formData, "lactoseFreeOptions"),
    glutenFreeOptions: bool(formData, "glutenFreeOptions"),
    takeaway: bool(formData, "takeaway"),
    seating: bool(formData, "seating"),
    wifi: bool(formData, "wifi"),
    studyFriendly: bool(formData, "studyFriendly"),
    photoFriendly: bool(formData, "photoFriendly"),
    petFriendly: bool(formData, "petFriendly"),
    wheelchairAccessible: bool(formData, "wheelchairAccessible"),
  });

  // Hours
  for (const day of WEEKDAYS) {
    const isClosed = bool(formData, `hours_${day}_closed`);
    await db.insert(shopHours).values({
      shopId,
      weekday: day,
      opensAt: isClosed ? null : str(formData, `hours_${day}_open`),
      closesAt: isClosed ? null : str(formData, `hours_${day}_close`),
      isClosed,
    });
  }

  // Scores
  const scores = {
    qualityScore: num(formData, "qualityScore"),
    priceScore: num(formData, "priceScore"),
    varietyScore: num(formData, "varietyScore"),
    experienceScore: num(formData, "experienceScore"),
    googleRatingScore: num(formData, "googleRatingScore"),
    popularityScore: num(formData, "popularityScore"),
  };
  await db.insert(shopScores).values({
    shopId,
    ...scores,
    totalScore: computeTotalScore(scores),
  });

  revalidatePath("/admin/shops");
  redirect("/admin/shops");
}

export async function updateShop(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const name = str(formData, "name");
  const cityId = num(formData, "cityId");

  if (!name || !cityId) {
    redirect(`/admin/shops/${id}?error=Nombre+y+ciudad+son+obligatorios`);
  }

  await db
    .update(shops)
    .set({
      name,
      slug: slugify(name),
      cityId,
      brandName: str(formData, "brandName"),
      isIndependent: bool(formData, "isIndependent"),
      address: str(formData, "address"),
      postalCode: str(formData, "postalCode"),
      neighborhood: str(formData, "neighborhood"),
      latitude: num(formData, "latitude"),
      longitude: num(formData, "longitude"),
      googleMapsUrl: str(formData, "googleMapsUrl"),
      websiteUrl: str(formData, "websiteUrl"),
      instagramUrl: str(formData, "instagramUrl"),
      tiktokUrl: str(formData, "tiktokUrl"),
      priceMin: num(formData, "priceMin"),
      priceMax: num(formData, "priceMax"),
      averagePrice: num(formData, "averagePrice"),
      editorSummary: str(formData, "editorSummary"),
      whyItStandsOut: str(formData, "whyItStandsOut"),
      recommendedOrder: str(formData, "recommendedOrder"),
      updatedAt: new Date(),
    })
    .where(eq(shops.id, id));

  // Features — upsert
  const featureValues = {
    veganOptions: bool(formData, "veganOptions"),
    lactoseFreeOptions: bool(formData, "lactoseFreeOptions"),
    glutenFreeOptions: bool(formData, "glutenFreeOptions"),
    takeaway: bool(formData, "takeaway"),
    seating: bool(formData, "seating"),
    wifi: bool(formData, "wifi"),
    studyFriendly: bool(formData, "studyFriendly"),
    photoFriendly: bool(formData, "photoFriendly"),
    petFriendly: bool(formData, "petFriendly"),
    wheelchairAccessible: bool(formData, "wheelchairAccessible"),
  };

  const [existingFeatures] = await db
    .select({ id: shopFeatures.id })
    .from(shopFeatures)
    .where(eq(shopFeatures.shopId, id))
    .limit(1);

  if (existingFeatures) {
    await db
      .update(shopFeatures)
      .set(featureValues)
      .where(eq(shopFeatures.shopId, id));
  } else {
    await db.insert(shopFeatures).values({ shopId: id, ...featureValues });
  }

  // Hours — delete + re-insert
  await db.delete(shopHours).where(eq(shopHours.shopId, id));
  for (const day of WEEKDAYS) {
    const isClosed = bool(formData, `hours_${day}_closed`);
    await db.insert(shopHours).values({
      shopId: id,
      weekday: day,
      opensAt: isClosed ? null : str(formData, `hours_${day}_open`),
      closesAt: isClosed ? null : str(formData, `hours_${day}_close`),
      isClosed,
    });
  }

  // Scores — upsert
  const scores = {
    qualityScore: num(formData, "qualityScore"),
    priceScore: num(formData, "priceScore"),
    varietyScore: num(formData, "varietyScore"),
    experienceScore: num(formData, "experienceScore"),
    googleRatingScore: num(formData, "googleRatingScore"),
    popularityScore: num(formData, "popularityScore"),
  };
  const totalScore = computeTotalScore(scores);

  const [existingScores] = await db
    .select({ id: shopScores.id })
    .from(shopScores)
    .where(eq(shopScores.shopId, id))
    .limit(1);

  if (existingScores) {
    await db
      .update(shopScores)
      .set({ ...scores, totalScore, calculatedAt: new Date() })
      .where(eq(shopScores.shopId, id));
  } else {
    await db.insert(shopScores).values({ shopId: id, ...scores, totalScore });
  }

  revalidatePath("/admin/shops");
  redirect("/admin/shops");
}

export async function publishShop(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  await db
    .update(shops)
    .set({
      status: "published",
      publishedAt: new Date(),
      lastReviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(shops.id, id));
  revalidatePath("/admin/shops");
}

export async function archiveShop(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  await db
    .update(shops)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(shops.id, id));
  revalidatePath("/admin/shops");
}

export async function draftShop(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  await db
    .update(shops)
    .set({ status: "draft", updatedAt: new Date() })
    .where(eq(shops.id, id));
  revalidatePath("/admin/shops");
}
