import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { shops, cities, shopFeatures, shopHours, shopScores } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ShopForm } from "../shop-form";
import { updateShop, publishShop, archiveShop, draftShop } from "../actions";

const statusLabel: Record<string, { text: string; className: string }> = {
  draft: {
    text: "Borrador",
    className: "bg-surface-container text-on-surface-variant",
  },
  published: {
    text: "Publicado",
    className: "bg-primary-container/30 text-primary",
  },
  needs_update: {
    text: "Necesita revisión",
    className: "bg-secondary-container/40 text-on-background",
  },
  archived: {
    text: "Archivado",
    className: "bg-error/10 text-error",
  },
  cerrado_temporal: {
    text: "Cerrado temporal",
    className: "bg-surface-container-high text-on-surface-variant",
  },
  cerrado_definitivo: {
    text: "Cerrado definitivo",
    className: "bg-error/20 text-error",
  },
};

export default async function EditShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const search = await searchParams;
  const shopId = parseInt(id);

  const [shop] = await db
    .select()
    .from(shops)
    .where(eq(shops.id, shopId))
    .limit(1);

  if (!shop) notFound();

  const [features] = await db
    .select()
    .from(shopFeatures)
    .where(eq(shopFeatures.shopId, shopId))
    .limit(1);

  const hours = await db
    .select()
    .from(shopHours)
    .where(eq(shopHours.shopId, shopId));

  const [scores] = await db
    .select()
    .from(shopScores)
    .where(eq(shopScores.shopId, shopId))
    .limit(1);

  const cityOptions = await db
    .select({ id: cities.id, name: cities.name })
    .from(cities)
    .orderBy(cities.name);

  const badge = statusLabel[shop.status] ?? statusLabel.draft;

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-container-lowest border-b border-surface-container-high px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/shops"
            className="text-on-surface-variant hover:text-on-background transition-colors"
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
          </Link>
          <span className="font-serif italic text-xl text-on-background">
            Bubble Tea España{" "}
            <span className="text-on-surface-variant text-sm not-italic font-sans">
              / Locales / {shop.name}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}
          >
            {badge.text}
          </span>

          {shop.status === "draft" && (
            <form action={publishShop}>
              <input type="hidden" name="id" value={shop.id} />
              <button
                type="submit"
                className="text-sm font-semibold text-primary hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-primary/5"
              >
                Publicar
              </button>
            </form>
          )}
          {shop.status === "published" && (
            <form action={archiveShop}>
              <input type="hidden" name="id" value={shop.id} />
              <button
                type="submit"
                className="text-sm font-semibold text-error hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-error/5"
              >
                Archivar
              </button>
            </form>
          )}
          {(shop.status === "archived" || shop.status === "needs_update") && (
            <form action={draftShop}>
              <input type="hidden" name="id" value={shop.id} />
              <button
                type="submit"
                className="text-sm font-semibold text-on-surface-variant hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-surface-container"
              >
                Restaurar
              </button>
            </form>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-serif text-on-background mb-10">
          Editar {shop.name}
        </h1>
        <ShopForm
          shop={shop}
          features={features}
          hours={hours}
          scores={scores}
          cityOptions={cityOptions}
          action={updateShop}
          submitLabel="Guardar cambios"
          error={search.error}
        />
      </main>
    </div>
  );
}
