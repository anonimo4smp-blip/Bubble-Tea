"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";
import { useCompare, type ComparableShop } from "./CompareProvider";

const FEATURE_ROWS: { key: string; label: string; icon: IconName }[] = [
  { key: "veganOptions", label: "Vegano", icon: "eco" },
  { key: "lactoseFreeOptions", label: "Sin lactosa", icon: "water_drop" },
  { key: "glutenFreeOptions", label: "Sin gluten", icon: "grain" },
  { key: "takeaway", label: "Para llevar", icon: "takeout_dining" },
  { key: "seating", label: "Asientos", icon: "chair" },
  { key: "wifi", label: "WiFi", icon: "wifi" },
  { key: "studyFriendly", label: "Para estudiar", icon: "menu_book" },
  { key: "photoFriendly", label: "Instagrameable", icon: "photo_camera" },
  { key: "petFriendly", label: "Pet-friendly", icon: "pets" },
  { key: "wheelchairAccessible", label: "Accesible", icon: "accessible" },
];

function priceLabel(avg: number | null): string {
  if (avg == null) return "--";
  if (avg <= 4) return "EUR";
  if (avg <= 5.5) return "EUR EUR";
  return "EUR EUR EUR";
}

function FeatureCheck({ value }: { value: boolean }) {
  return value ? (
    <Icon name="verified" className="text-primary text-lg" title="Si" />
  ) : (
    <span className="text-sm text-on-surface-variant/30">--</span>
  );
}

function ShopHeader({ shop }: { shop: ComparableShop }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-container">
        {shop.imageUrl ? (
          <Image
            src={shop.imageUrl}
            alt={shop.imageAlt ?? shop.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon name="local_cafe" className="text-2xl text-on-surface-variant/30" />
          </div>
        )}
      </div>
      <div>
        <Link
          href={`/${shop.citySlug}/${shop.slug}`}
          className="text-sm font-bold text-on-background transition-colors hover:text-primary"
        >
          {shop.name}
        </Link>
        {shop.neighborhood && (
          <p className="mt-0.5 text-xs text-on-surface-variant">{shop.neighborhood}</p>
        )}
      </div>
    </div>
  );
}

function CompareRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid items-center gap-3 py-3 sm:gap-4"
      style={{ gridTemplateColumns: "90px 1fr" }}
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant sm:text-xs">
        {label}
      </span>
      <div
        className="grid gap-3 sm:gap-4"
        style={{ gridTemplateColumns: `repeat(var(--compare-cols), 1fr)` }}
      >
        {children}
      </div>
    </div>
  );
}

export default function CompareDrawer() {
  const { selected, drawerOpen, closeDrawer, clear } = useCompare();

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (!drawerOpen || selected.length < 2) return null;

  const colCount = selected.length;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        onClick={closeDrawer}
      />

      <div className="animate-in slide-in-from-bottom relative mt-auto flex max-h-[90vh] flex-col overflow-hidden rounded-t-3xl bg-surface">
        <div className="flex items-center justify-between border-b border-surface-container px-6 py-5">
          <h2 className="text-xl font-serif text-on-background">Comparar locales</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                clear();
                closeDrawer();
              }}
              className="text-xs font-semibold text-on-surface-variant transition-colors hover:text-error"
            >
              Limpiar todo
            </button>
            <button
              onClick={closeDrawer}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors hover:text-on-background"
              aria-label="Cerrar comparador"
            >
              <Icon name="close" className="text-lg" />
            </button>
          </div>
        </div>

        <div
          className="flex-1 overflow-y-auto px-6 py-6"
          style={{ "--compare-cols": colCount } as React.CSSProperties}
        >
          <div
            className="mb-8 grid gap-4"
            style={{ gridTemplateColumns: `90px repeat(${colCount}, 1fr)` }}
          >
            <div />
            {selected.map((shop) => (
              <ShopHeader key={shop.id} shop={shop} />
            ))}
          </div>

          <div className="divide-y divide-surface-container">
            <CompareRow label="Puntuacion">
              {selected.map((shop) => (
                <div key={shop.id} className="text-center">
                  {shop.totalScore != null ? (
                    <span className="text-lg font-bold text-primary">
                      {shop.totalScore.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-on-surface-variant/40">--</span>
                  )}
                </div>
              ))}
            </CompareRow>

            <CompareRow label="Precio">
              {selected.map((shop) => (
                <div key={shop.id} className="text-center">
                  <span className="text-sm font-bold text-on-background">
                    {priceLabel(shop.averagePrice)}
                  </span>
                  {shop.averagePrice != null && (
                    <p className="text-xs text-on-surface-variant">
                      ~{shop.averagePrice.toFixed(1)} EUR
                    </p>
                  )}
                </div>
              ))}
            </CompareRow>

            <CompareRow label="Barrio">
              {selected.map((shop) => (
                <div key={shop.id} className="text-center text-sm text-on-background">
                  {shop.neighborhood ?? "--"}
                </div>
              ))}
            </CompareRow>

            {FEATURE_ROWS.map(({ key, label }) => (
              <CompareRow key={key} label={label}>
                {selected.map((shop) => (
                  <div key={shop.id} className="flex justify-center">
                    <FeatureCheck
                      value={
                        shop.features
                          ? (shop.features as unknown as Record<string, boolean>)[key] ?? false
                          : false
                      }
                    />
                  </div>
                ))}
              </CompareRow>
            ))}
          </div>

          <div
            className="mt-8 grid gap-4"
            style={{ gridTemplateColumns: `90px repeat(${colCount}, 1fr)` }}
          >
            <div />
            {selected.map((shop) => (
              <div key={shop.id} className="text-center">
                <Link
                  href={`/${shop.citySlug}/${shop.slug}`}
                  className="btn btn-primary btn-xs"
                >
                  Ver ficha
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
