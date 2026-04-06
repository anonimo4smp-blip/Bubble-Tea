import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import Icon from "@/components/Icon";
import { db } from "@/db";
import { cities, shops } from "@/db/schema";
import { archiveShop, draftShop, publishShop } from "./actions";

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

export default async function ShopsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const params = await searchParams;
  const cityFilter = params.city ? parseInt(params.city) : null;

  const allCities = await db
    .select({ id: cities.id, name: cities.name })
    .from(cities)
    .orderBy(cities.name);

  const cityMap = new Map(allCities.map((c) => [c.id, c.name]));

  const query = db
    .select({
      id: shops.id,
      name: shops.name,
      slug: shops.slug,
      status: shops.status,
      cityId: shops.cityId,
      neighborhood: shops.neighborhood,
      averagePrice: shops.averagePrice,
      updatedAt: shops.updatedAt,
    })
    .from(shops)
    .orderBy(desc(shops.updatedAt));

  const allShops = cityFilter
    ? await query.where(eq(shops.cityId, cityFilter))
    : await query;

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-container-lowest border-b border-surface-container-high px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="btn btn-subtle btn-icon">
            <Icon name="arrow_back" className="text-xl" />
          </Link>
          <span className="font-serif italic text-xl text-on-background">
            Bubble Tea España{" "}
            <span className="text-on-surface-variant text-sm not-italic font-sans">
              / Locales
            </span>
          </span>
        </div>
        <Link href="/admin/shops/new" className="btn btn-primary btn-sm">
          <Icon name="add" className="text-lg" />
          Nuevo local
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        {allCities.length > 0 && (
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/admin/shops"
              className={`chip ${!cityFilter ? "chip-active" : "chip-neutral"}`}
            >
              Todas
            </Link>
            {allCities.map((c) => (
              <Link
                key={c.id}
                href={`/admin/shops?city=${c.id}`}
                className={`chip ${cityFilter === c.id ? "chip-active" : "chip-neutral"}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {allShops.length === 0 ? (
          <div className="text-center py-20">
            <Icon
              name="storefront"
              className="text-5xl text-on-surface-variant/40 mb-4 block"
            />
            <p className="text-on-surface-variant mb-6">
              {cityFilter
                ? "No hay locales en esta ciudad."
                : "Aún no hay locales. Empieza creando el primero."}
            </p>
            <Link href="/admin/shops/new" className="btn btn-primary btn-sm">
              <Icon name="add" className="text-lg" />
              Nuevo local
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {allShops.map((shop) => {
              const badge = statusLabel[shop.status] ?? statusLabel.draft;
              return (
                <div
                  key={shop.id}
                  className="card-elevated p-6 flex items-center justify-between gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Link
                        href={`/admin/shops/${shop.id}`}
                        className="text-lg font-bold text-on-background hover:text-primary transition-colors truncate"
                      >
                        {shop.name}
                      </Link>
                      <span className={`badge shrink-0 ${badge.className}`}>
                        {badge.text}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      {cityMap.get(shop.cityId) ?? "-"}
                      {shop.neighborhood && ` · ${shop.neighborhood}`}
                      {shop.averagePrice != null &&
                        ` · ~${shop.averagePrice.toFixed(1)} €`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {shop.status === "draft" && (
                      <form action={publishShop}>
                        <input type="hidden" name="id" value={shop.id} />
                        <button type="submit" className="btn btn-primary btn-xs">
                          Publicar
                        </button>
                      </form>
                    )}
                    {shop.status === "published" && (
                      <form action={archiveShop}>
                        <input type="hidden" name="id" value={shop.id} />
                        <button type="submit" className="btn btn-danger btn-xs">
                          Archivar
                        </button>
                      </form>
                    )}
                    {(shop.status === "archived" ||
                      shop.status === "needs_update") && (
                      <form action={draftShop}>
                        <input type="hidden" name="id" value={shop.id} />
                        <button type="submit" className="btn btn-subtle btn-xs">
                          Restaurar
                        </button>
                      </form>
                    )}
                    <Link
                      href={`/admin/shops/${shop.id}`}
                      className="btn btn-subtle btn-xs"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
