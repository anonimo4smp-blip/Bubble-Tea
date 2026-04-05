import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { cities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CityForm } from "../city-form";
import { updateCity, publishCity, archiveCity, draftCity } from "../actions";

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
          <Link
            href="/admin/cities"
            className="text-on-surface-variant hover:text-on-background transition-colors"
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
          </Link>
          <span className="font-serif italic text-xl text-on-background">
            Bubble Tea España{" "}
            <span className="text-on-surface-variant text-sm not-italic font-sans">
              / Ciudades / {city.name}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}
          >
            {badge.text}
          </span>

          {city.status === "draft" && (
            <form action={publishCity}>
              <input type="hidden" name="id" value={city.id} />
              <button
                type="submit"
                className="text-sm font-semibold text-primary hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-primary/5"
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
                className="text-sm font-semibold text-error hover:opacity-70 transition-opacity px-3 py-1.5 rounded-lg hover:bg-error/5"
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
