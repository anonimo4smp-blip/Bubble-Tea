import Link from "next/link";
import { count, desc } from "drizzle-orm";
import Icon from "@/components/Icon";
import { db } from "@/db";
import { cities, shops } from "@/db/schema";
import { archiveCity, draftCity, publishCity } from "./actions";

const statusLabel: Record<string, { text: string; className: string }> = {
  draft: {
    text: "Borrador",
    className: "badge-neutral",
  },
  published: {
    text: "Publicada",
    className: "badge-primary",
  },
  archived: {
    text: "Archivada",
    className: "badge-danger",
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

  const shopCounts = await db
    .select({ cityId: shops.cityId, count: count() })
    .from(shops)
    .groupBy(shops.cityId);

  const countMap = new Map(shopCounts.map((s) => [s.cityId, s.count]));

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
              / Ciudades
            </span>
          </span>
        </div>
        <Link href="/admin/cities/new" className="btn btn-primary btn-sm">
          <Icon name="add" className="text-lg" />
          Nueva ciudad
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        {allCities.length === 0 ? (
          <div className="text-center py-20">
            <Icon
              name="location_city"
              className="text-5xl text-on-surface-variant/40 mb-4 block"
            />
            <p className="text-on-surface-variant mb-6">
              Aún no hay ciudades. Empieza creando la primera.
            </p>
            <Link href="/admin/cities/new" className="btn btn-primary btn-sm">
              <Icon name="add" className="text-lg" />
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
                  className="card-elevated p-6 flex items-center justify-between gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Link
                        href={`/admin/cities/${city.id}`}
                        className="text-lg font-bold text-on-background hover:text-primary transition-colors truncate"
                      >
                        {city.name}
                      </Link>
                      <span className={`badge ${badge.className}`}>
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
                        <button type="submit" className="btn btn-primary btn-xs">
                          Publicar
                        </button>
                      </form>
                    )}
                    {city.status === "published" && (
                      <form action={archiveCity}>
                        <input type="hidden" name="id" value={city.id} />
                        <button type="submit" className="btn btn-danger btn-xs">
                          Archivar
                        </button>
                      </form>
                    )}
                    {city.status === "archived" && (
                      <form action={draftCity}>
                        <input type="hidden" name="id" value={city.id} />
                        <button type="submit" className="btn btn-subtle btn-xs">
                          Restaurar
                        </button>
                      </form>
                    )}
                    <Link
                      href={`/admin/cities/${city.id}`}
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
