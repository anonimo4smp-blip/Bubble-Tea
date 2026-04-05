import Link from "next/link";
import { db } from "@/db";
import { cities, shops } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { publishCity, archiveCity, draftCity } from "./actions";

const statusLabel: Record<string, { text: string; className: string }> = {
  draft: {
    text: "Borrador",
    className: "bg-surface-container text-on-surface-variant",
  },
  published: {
    text: "Publicada",
    className: "bg-primary-container/30 text-primary",
  },
  archived: {
    text: "Archivada",
    className: "bg-error/10 text-error",
  },
};

export default async function CitiesPage() {
  const allCities = await db
    .select({
      id: cities.id,
      name: cities.name,
      slug: cities.slug,
      status: cities.status,
      region: cities.region,
      updatedAt: cities.updatedAt,
    })
    .from(cities)
    .orderBy(desc(cities.updatedAt));

  // Get shop counts per city
  const shopCounts = await db
    .select({ cityId: shops.cityId, count: count() })
    .from(shops)
    .groupBy(shops.cityId);

  const countMap = new Map(shopCounts.map((s) => [s.cityId, s.count]));

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
              / Ciudades
            </span>
          </span>
        </div>
        <Link
          href="/admin/cities/new"
          className="inline-flex items-center gap-2 bg-primary text-on-primary rounded-full px-5 py-2.5 font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nueva ciudad
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        {allCities.length === 0 ? (
          <div className="text-center py-20">
            <span
              className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4 block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_city
            </span>
            <p className="text-on-surface-variant mb-6">
              Aún no hay ciudades. Empieza creando la primera.
            </p>
            <Link
              href="/admin/cities/new"
              className="inline-flex items-center gap-2 bg-primary text-on-primary rounded-full px-5 py-2.5 font-bold text-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nueva ciudad
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {allCities.map((city) => {
              const badge = statusLabel[city.status];
              const shops = countMap.get(city.id) ?? 0;
              return (
                <div
                  key={city.id}
                  className="bg-surface-container-lowest rounded-xl p-6 editorial-shadow flex items-center justify-between gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Link
                        href={`/admin/cities/${city.id}`}
                        className="text-lg font-bold text-on-background hover:text-primary transition-colors truncate"
                      >
                        {city.name}
                      </Link>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}
                      >
                        {badge.text}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      /{city.slug}
                      {city.region && ` · ${city.region}`} · {shops}{" "}
                      {shops === 1 ? "local" : "locales"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {city.status === "draft" && (
                      <form action={publishCity}>
                        <input type="hidden" name="id" value={city.id} />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-primary hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-primary/5"
                        >
                          Publicar
                        </button>
                      </form>
                    )}
                    {city.status === "published" && (
                      <form action={archiveCity}>
                        <input type="hidden" name="id" value={city.id} />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-error hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-error/5"
                        >
                          Archivar
                        </button>
                      </form>
                    )}
                    {city.status === "archived" && (
                      <form action={draftCity}>
                        <input type="hidden" name="id" value={city.id} />
                        <button
                          type="submit"
                          className="text-xs font-semibold text-on-surface-variant hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-surface-container"
                        >
                          Restaurar
                        </button>
                      </form>
                    )}
                    <Link
                      href={`/admin/cities/${city.id}`}
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
