"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

type Shop = {
  id: number;
  name: string;
  slug: string;
  latitude: number | null;
  longitude: number | null;
  neighborhood: string | null;
  averagePrice: number | null;
};

type Props = {
  shops: Shop[];
  center: [number, number];
  citySlug: string;
};

function MapInner({ shops, center, citySlug }: Props) {
  const [L, setL] = useState<typeof import("react-leaflet") | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    import("react-leaflet").then((mod) => {
      setL(mod);
      setReady(true);
    });

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!ready || !L) {
    return (
      <div className="w-full h-full bg-surface-container rounded-xl flex items-center justify-center">
        <span className="text-on-surface-variant text-sm">Cargando mapa…</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = L;

  const shopsWithCoords = shops.filter(
    (s) => s.latitude != null && s.longitude != null
  );

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shopsWithCoords.map((shop) => (
        <Marker
          key={shop.id}
          position={[shop.latitude!, shop.longitude!]}
        >
          <Popup>
            <a
              href={`/${citySlug}/${shop.slug}`}
              className="font-bold text-sm text-primary hover:underline"
            >
              {shop.name}
            </a>
            {shop.neighborhood && (
              <p className="text-xs text-on-surface-variant mt-1">
                {shop.neighborhood}
              </p>
            )}
            {shop.averagePrice != null && (
              <p className="text-xs font-semibold mt-1">
                ~{shop.averagePrice.toFixed(1)}€
              </p>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

// Dynamic import to avoid SSR issues with Leaflet
const ShopMap = dynamic(() => Promise.resolve(MapInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface-container rounded-xl flex items-center justify-center">
      <span className="text-on-surface-variant text-sm">Cargando mapa…</span>
    </div>
  ),
});

export default function ShopMapWrapper(props: Props) {
  return <ShopMap {...props} />;
}
