"use client";

import Icon from "@/components/Icon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const FEATURE_FILTERS = [
  { key: "vegan", label: "Vegano", icon: "eco" },
  { key: "wifi", label: "WiFi", icon: "wifi" },
  { key: "study", label: "Para estudiar", icon: "menu_book" },
  { key: "photo", label: "Instagrameable", icon: "photo_camera" },
  { key: "pet", label: "Pet-friendly", icon: "pets" },
  { key: "takeaway", label: "Para llevar", icon: "takeout_dining" },
  { key: "accessible", label: "Accesible", icon: "accessible" },
] as const;

const PRICE_FILTERS = [
  { key: "1", label: "Económico" },
  { key: "2", label: "Medio" },
  { key: "3", label: "Premium" },
] as const;

export default function ShopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFeatures = searchParams.get("f")?.split(",").filter(Boolean) ?? [];
  const activePrice = searchParams.get("p") ?? "";
  const activeNeighborhood = searchParams.get("barrio") ?? "";

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggleFeature = (key: string) => {
    const current = new Set(activeFeatures);
    if (current.has(key)) {
      current.delete(key);
    } else {
      current.add(key);
    }
    updateParams("f", Array.from(current).join(","));
  };

  const togglePrice = (key: string) => {
    updateParams("p", activePrice === key ? "" : key);
  };

  const hasFilters =
    activeFeatures.length > 0 || Boolean(activePrice) || Boolean(activeNeighborhood);

  return (
    <div className="space-y-4" role="search" aria-label="Filtros de locales">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros por característica">
        {FEATURE_FILTERS.map(({ key, label, icon }) => {
          const active = activeFeatures.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggleFeature(key)}
              aria-pressed={active}
              className={`chip ${
                active
                  ? "chip-active"
                  : "chip-neutral"
              }`}
            >
              <Icon name={icon} className="text-sm" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros por precio">
        {PRICE_FILTERS.map(({ key, label }) => {
          const active = activePrice === key;
          return (
            <button
              key={key}
              onClick={() => togglePrice(key)}
              aria-pressed={active}
              className={`chip ${active ? "chip-active" : "chip-neutral"}`}
            >
              {label}
            </button>
          );
        })}

        {hasFilters && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="chip chip-danger"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
