import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import Icon from "@/components/Icon";
import { db } from "@/db";
import { cities } from "@/db/schema";
import { archiveCity, draftCity, publishCity, updateCity } from "../actions";
import { CityForm } from "../city-form";

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

export default async function EditCityPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const search = await searchParams;
  const cityId = parseInt(id);

  const [city] = await db
    .select()
    .from(cities)
    .where(eq(cities.id, cityId))
    .limit(1);

  if (!city) notFound();

  const badge = statusLabel[city.status];

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-container-lowest border-b border-surface-container-high px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/cities" className="btn btn-subtle btn-icon">
            <Icon name="arrow_back" className="text-xl" />
          </Link>
          <span className="font-serif italic text-xl text-on-background">
            Bubble Tea España{" "}
            <span className="text-on-surface-variant text-sm not-italic font-sans">
              / Ciudades / {city.name}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className={`badge ${badge.className}`}>{badge.text}</span>

          {city.status === "draft" && (
            <form action={publishCity}>
              <input type="hidden" name="id" value={city.id} />
              <button type="submit" className="btn btn-primary btn-sm">
                Publicar
              </button>
            </form>
          )}
          {city.status === "published" && (
            <form action={archiveCity}>
              <input type="hidden" name="id" value={city.id} />
              <button type="submit" className="btn btn-danger btn-sm">
                Archivar
              </button>
            </form>
          )}
          {city.status === "archived" && (
            <form action={draftCity}>
              <input type="hidden" name="id" value={city.id} />
              <button type="submit" className="btn btn-subtle btn-sm">
                Restaurar
              </button>
            </form>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-serif text-on-background mb-10">
          Editar {city.name}
        </h1>
        <CityForm
          city={city}
          action={updateCity}
          submitLabel="Guardar cambios"
          error={search.error}
        />
      </main>
    </div>
  );
}
