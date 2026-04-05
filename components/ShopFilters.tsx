"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const FEATURE_FILTERS = [
  { key: "vegan", label: "Vegano", icon: "eco" },
  { key: "wifi", label: "WiFi", icon: "wifi" },
  { key: "study", label: "Para estudiar", icon: "menu_book" },
  { key: "photo", label: "Instagrameable", icon: "photo_camera" },
  { key: "pet", label: "Pet-friendly", icon: "pets" },
  { key: "takeaway", label: "Para llevar", icon: "takeout_dining" },
  { key: "accessible", label: "Accesible", icon: "accessible" },
];

const PRICE_FILTERS = [
  { key: "1", label: "€ Económico" },
  { key: "2", label: "€€ Medio" },
  { key: "3", label: "€€€ Premium" },
];

export default function ShopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeFeatures = searchParams.get("f")?.split(",").filter(Boolean) ?? [];
  const activePrice = searchParams.get("p") ?? "";
  const activeNeighborhood = searchParams.get("barrio") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

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

  const hasFilters = activeFeatures.length > 0 || activePrice || activeNeighborhood;

  return (
    <div className="space-y-4">
      {/* Feature chips */}
      <div className="flex flex-wrap gap-2">
        {FEATURE_FILTERS.map(({ key, label, icon }) => {
          const active = activeFeatures.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggleFeature(key)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors ${
                active
                  ? "bg-primary-fixed text-on-primary-fixed"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{icon}</span>
              {label}
            </button>
          );
        })}
      </div>

      {/* Price chips */}
      <div className="flex flex-wrap gap-2">
        {PRICE_FILTERS.map(({ key, label }) => {
          const active = activePrice === key;
          return (
            <button
              key={key}
              onClick={() => togglePrice(key)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-colors ${
                active
                  ? "bg-primary-fixed text-on-primary-fixed"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {label}
            </button>
          );
        })}

        {hasFilters && (
          <button
            onClick={() => router.push(pathname, { scroll: false })}
            className="px-3.5 py-2 rounded-full text-xs font-semibold text-error bg-error/5 hover:bg-error/10 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
