import Link from "next/link";
import Icon from "@/components/Icon";
import { db } from "@/db";
import { cities } from "@/db/schema";
import { createShop } from "../actions";
import { ShopForm } from "../shop-form";

export default async function NewShopPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  const cityOptions = await db
    .select({ id: cities.id, name: cities.name })
    .from(cities)
    .orderBy(cities.name);

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface-container-lowest border-b border-surface-container-high px-8 py-4 flex items-center gap-3">
        <Link href="/admin/shops" className="btn btn-subtle btn-icon">
          <Icon name="arrow_back" className="text-xl" />
        </Link>
        <span className="font-serif italic text-xl text-on-background">
          Bubble Tea España{" "}
          <span className="text-on-surface-variant text-sm not-italic font-sans">
            / Locales / Nuevo
          </span>
        </span>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-serif text-on-background mb-10">
          Nuevo local
        </h1>
        <ShopForm
          cityOptions={cityOptions}
          action={createShop}
          submitLabel="Crear local"
          error={params.error}
        />
      </main>
    </div>
  );
}
