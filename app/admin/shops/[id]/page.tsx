import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import Icon from "@/components/Icon";
import { db } from "@/db";
import { cities, shopFeatures, shopHours, shopScores, shops } from "@/db/schema";
import { archiveShop, draftShop, publishShop, updateShop } from "../actions";
import { ShopForm } from "../shop-form";

const statusLabel: Record<string, { text: string; className: string }> = {
  draft: {
    text: "Borrador",
    className: "badge-neutral",
  },
  published: {
    text: "Publicado",
    className: "badge-primary",
  },
  needs_update: {
    text: "Necesita revisión",
    className: "badge-secondary",
  },
  archived: {
    text: "Archivado",
    className: "badge-danger",
  },
  cerrado_temporal: {
    text: "Cerrado temporal",
    className: "badge-neutral",
  },
  cerrado_definitivo: {
    text: "Cerrado definitivo",
    className: "badge-danger",
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

  const [shop] = await db.select().from(shops).where(eq(shops.id, shopId)).limit(1);
  if (!shop) notFound();

  const [features] = await db
    .select()
    .from(shopFeatures)
    .where(eq(shopFeatures.shopId, shopId))
    .limit(1);

  const hours = await db.select().from(shopHours).where(eq(shopHours.shopId, shopId));

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
          <Link href="/admin/shops" className="btn btn-subtle btn-icon">
            <Icon name="arrow_back" className="text-xl" />
          </Link>
          <span className="font-serif italic text-xl text-on-background">
            Bubble Tea España{" "}
            <span className="text-on-surface-variant text-sm not-italic font-sans">
              / Locales / {shop.name}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`badge ${badge.className}`}>{badge.text}</span>

          {shop.status === "draft" && (
            <form action={publishShop}>
              <input type="hidden" name="id" value={shop.id} />
              <button type="submit" className="btn btn-primary btn-sm">
                Publicar
              </button>
            </form>
          )}
          {shop.status === "published" && (
            <form action={archiveShop}>
              <input type="hidden" name="id" value={shop.id} />
              <button type="submit" className="btn btn-danger btn-sm">
                Archivar
              </button>
            </form>
          )}
          {(shop.status === "archived" || shop.status === "needs_update") && (
            <form action={draftShop}>
              <input type="hidden" name="id" value={shop.id} />
              <button type="submit" className="btn btn-subtle btn-sm">
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
