"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { cities } from "@/db/schema";
import { eq } from "drizzle-orm";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createCity(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    redirect("/admin/cities/new?error=El+nombre+es+obligatorio");
  }

  const slug = slugify(name);

  await db.insert(cities).values({
    name,
    slug,
    region: (formData.get("region") as string)?.trim() || null,
    province: (formData.get("province") as string)?.trim() || null,
    shortDescription:
      (formData.get("shortDescription") as string)?.trim() || null,
    longDescription:
      (formData.get("longDescription") as string)?.trim() || null,
    seoTitle: (formData.get("seoTitle") as string)?.trim() || null,
    seoDescription:
      (formData.get("seoDescription") as string)?.trim() || null,
    keywordPrimary:
      (formData.get("keywordPrimary") as string)?.trim() || null,
    latitudeCenter: formData.get("latitudeCenter")
      ? parseFloat(formData.get("latitudeCenter") as string)
      : null,
    longitudeCenter: formData.get("longitudeCenter")
      ? parseFloat(formData.get("longitudeCenter") as string)
      : null,
  });

  revalidatePath("/admin/cities");
  redirect("/admin/cities");
}

export async function updateCity(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    redirect(`/admin/cities/${id}?error=El+nombre+es+obligatorio`);
  }

  await db
    .update(cities)
    .set({
      name,
      slug: slugify(name),
      region: (formData.get("region") as string)?.trim() || null,
      province: (formData.get("province") as string)?.trim() || null,
      shortDescription:
        (formData.get("shortDescription") as string)?.trim() || null,
      longDescription:
        (formData.get("longDescription") as string)?.trim() || null,
      seoTitle: (formData.get("seoTitle") as string)?.trim() || null,
      seoDescription:
        (formData.get("seoDescription") as string)?.trim() || null,
      keywordPrimary:
        (formData.get("keywordPrimary") as string)?.trim() || null,
      latitudeCenter: formData.get("latitudeCenter")
        ? parseFloat(formData.get("latitudeCenter") as string)
        : null,
      longitudeCenter: formData.get("longitudeCenter")
        ? parseFloat(formData.get("longitudeCenter") as string)
        : null,
      updatedAt: new Date(),
    })
    .where(eq(cities.id, id));

  revalidatePath("/admin/cities");
  redirect("/admin/cities");
}

export async function publishCity(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  await db
    .update(cities)
    .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
    .where(eq(cities.id, id));
  revalidatePath("/admin/cities");
}

export async function archiveCity(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  await db
    .update(cities)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(cities.id, id));
  revalidatePath("/admin/cities");
}

export async function draftCity(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  await db
    .update(cities)
    .set({ status: "draft", updatedAt: new Date() })
    .where(eq(cities.id, id));
  revalidatePath("/admin/cities");
}
