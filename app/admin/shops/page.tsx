import Link from "next/link";
import { db } from "@/db";
import { shops, cities } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { publishShop, archiveShop, draftShop } from "./actions";

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

  let query = db
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
          <Link
            href="/admin"
            className="text-on-surface-variant hover:text-on-background transition-colors"
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
          </Link>
          <span className="font-serif italic text-xl text-on-background">
            Bubble Tea España{" "}
            <span className="text-on-surface-variant text-sm not-italic font-sans">
              / Locales
            </span>
          </span>
        </div>
        <Link
          href="/admin/shops/new"
          className="inline-flex items-center gap-2 bg-primary text-on-primary rounded-full px-5 py-2.5 font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nuevo local
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        {/* City filter */}
        {allCities.length > 0 && (
          <div className="flex items-center gap-2 mb-8">
            <Link
              href="/admin/shops"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                !cityFilter
                  ? "bg-primary-fixed text-on-background"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              Todas
            </Link>
            {allCities.map((c) => (
              <Link
                key={c.id}
                href={`/admin/shops?city=${c.id}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  cityFilter === c.id
                    ? "bg-primary-fixed text-on-background"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {allShops.length === 0 ? (
          <div className="text-center py-20">
            <span
              className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4 block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              storefront
            </span>
            <p className="text-on-surface-variant mb-6">
              {cityFilter
                ? "No hay locales en esta ciudad."
                : "Aún no hay locales. Empieza creando el primero."}
            </p>
            <Link
              href="/admin/shops/new"
              className="inline-flex items-center gap-2 bg-primary text-on-primary rounded-full px-5 py-2.5 font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-lg">add</span>
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
                  className="bg-surface-container-lowest rounded-xl p-6 editorial-shadow flex items-center justify-between gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Link
                        href={`/admin/shops/${shop.id}`}
                        className="text-lg font-bold text-on-background hover:text-primary transition-colors truncate"
                      >
                        {shop.name}
                      </Link>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${badge.className}`}
                      >
                        {badge.text}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      {cityMap.get(shop.cityId) ?? "—"}
                      {shop.neighborhood && ` · ${shop.neighborhood}`}
                      {shop.averagePrice != null &&
                        ` · ~${shop.averagePrice.toFixed(1)}€`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {shop.status === "draft" && (
                      <form action={publishShop}>
                        <input type="hidden" name="id" value={shop.id} />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-primary hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-primary/5"
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
                          className="text-xs font-semibold text-error hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-error/5"
                        >
                          Archivar
                        </button>
                      </form>
                    )}
                    {(shop.status === "archived" ||
                      shop.status === "needs_update") && (
                      <form action={draftShop}>
                        <input type="hidden" name="id" value={shop.id} />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-on-surface-variant hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-surface-container"
                        >
                          Restaurar
                        </button>
                      </form>
                    )}
                    <Link
                      href={`/admin/shops/${shop.id}`}
                      className="text-xs font-semibold text-on-surface-variant hover:text-on-background transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-container"
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
