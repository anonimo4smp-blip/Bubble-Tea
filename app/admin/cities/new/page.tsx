import Link from "next/link";
import { CityForm } from "../city-form";
import { createCity } from "../actions";

export default async function NewCityPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-container-lowest border-b border-surface-container-high px-8 py-4 flex items-center gap-3">
        <Link
          href="/admin/cities"
          className="text-on-surface-variant hover:text-on-background transition-colors"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>
        <span className="font-serif italic text-xl text-on-background">
          Bubble Tea España{" "}
          <span className="text-on-surface-variant text-sm not-italic font-sans">
            / Ciudades / Nueva
          </span>
        </span>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-serif text-on-background mb-10">
          Nueva ciudad
        </h1>
        <CityForm
          action={createCity}
          submitLabel="Crear ciudad"
          error={params.error}
        />
      </main>
    </div>
  );
}
