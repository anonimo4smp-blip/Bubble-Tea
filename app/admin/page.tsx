import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/login/actions";
import { db } from "@/db";
import { cities, shops } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [cityCount] = await db.select({ count: count() }).from(cities);
  const [shopCount] = await db.select({ count: count() }).from(shops);
  const [publishedCount] = await db
    .select({ count: count() })
    .from(shops)
    .where(eq(shops.status, "published"));

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <header className="bg-surface-container-lowest border-b border-surface-container-high px-8 py-4 flex justify-between items-center">
        <span className="font-serif italic text-xl text-on-background">
          Bubble Tea España <span className="text-on-surface-variant text-sm not-italic font-sans">/ Admin</span>
        </span>
        <div className="flex items-center gap-6">
          <span className="text-sm text-on-surface-variant">{user?.email}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-semibold text-tertiary hover:opacity-70 transition-opacity"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-serif text-on-background mb-2">
          Panel editorial
        </h1>
        <p className="text-on-surface-variant mb-10">
          Gestiona ciudades, locales y contenido SEO.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { label: "Ciudades", value: cityCount.count },
            { label: "Locales totales", value: shopCount.count },
            { label: "Publicados", value: publishedCount.count },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container-lowest rounded-xl p-6 editorial-shadow"
            >
              <p className="text-4xl font-serif font-bold text-on-background mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-on-surface-variant uppercase tracking-widest font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Nav cards */}
        <div className="grid grid-cols-2 gap-6">
          <a
            href="/admin/cities"
            className="group bg-surface-container-low rounded-xl p-8 hover:bg-surface-container transition-colors"
          >
            <span
              className="material-symbols-outlined text-3xl text-primary mb-4 block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              location_city
            </span>
            <h2 className="text-xl font-bold text-on-background mb-2 group-hover:text-primary transition-colors">
              Ciudades
            </h2>
            <p className="text-sm text-on-surface-variant">
              Añade, edita y publica ciudades. Gestiona SEO y coordenadas.
            </p>
          </a>

          <a
            href="/admin/shops"
            className="group bg-surface-container-low rounded-xl p-8 hover:bg-surface-container transition-colors"
          >
            <span
              className="material-symbols-outlined text-3xl text-primary mb-4 block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              storefront
            </span>
            <h2 className="text-xl font-bold text-on-background mb-2 group-hover:text-primary transition-colors">
              Locales
            </h2>
            <p className="text-sm text-on-surface-variant">
              Gestiona fichas de locales, scores, horarios e imágenes.
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}
