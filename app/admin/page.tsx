import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { signOut } from "@/app/admin/actions";
import Icon from "@/components/Icon";
import { db } from "@/db";
import { cities, shops } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

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
      <header className="bg-surface-container-lowest border-b border-surface-container-high px-8 py-4 flex justify-between items-center">
        <span className="font-serif italic text-xl text-on-background">
          Bubble Tea España{" "}
          <span className="text-on-surface-variant text-sm not-italic font-sans">
            / Admin
          </span>
        </span>
        <div className="flex items-center gap-6">
          <span className="text-sm text-on-surface-variant">{user?.email}</span>
          <form action={signOut}>
            <button type="submit" className="btn btn-subtle btn-xs">
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

        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { label: "Ciudades", value: cityCount.count },
            { label: "Locales totales", value: shopCount.count },
            { label: "Publicados", value: publishedCount.count },
          ].map((stat) => (
            <div key={stat.label} className="card-elevated p-6">
              <p className="text-4xl font-serif font-bold text-on-background mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-on-surface-variant uppercase tracking-widest font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Link href="/admin/cities" className="group card-soft-hover p-8">
            <Icon
              name="location_city"
              className="text-3xl text-primary mb-4 block"
            />
            <h2 className="text-xl font-bold text-on-background mb-2 group-hover:text-primary transition-colors">
              Ciudades
            </h2>
            <p className="text-sm text-on-surface-variant">
              Añade, edita y publica ciudades. Gestiona SEO y coordenadas.
            </p>
          </Link>

          <Link href="/admin/shops" className="group card-soft-hover p-8">
            <Icon
              name="storefront"
              className="text-3xl text-primary mb-4 block"
            />
            <h2 className="text-xl font-bold text-on-background mb-2 group-hover:text-primary transition-colors">
              Locales
            </h2>
            <p className="text-sm text-on-surface-variant">
              Gestiona fichas de locales, scores, horarios e imágenes.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
