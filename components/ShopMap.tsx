"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

type Shop = {
  id: number;
  name: string;
  slug: string;
  latitude: number | null;
  longitude: number | null;
  neighborhood: string | null;
  averagePrice: number | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

type Props = {
  shops: Shop[];
  center: [number, number];
  citySlug: string;
};

type ShopWithCoords = Shop & {
  latitude: number;
  longitude: number;
};

type ShopMarker = ShopWithCoords & {
  displayLatitude: number;
  displayLongitude: number;
};

const OVERLAP_THRESHOLD = 0.00018;
const MARKER_OFFSET = 0.00016;

function buildMarkerPositions(shops: Shop[]): ShopMarker[] {
  const withCoords: ShopWithCoords[] = shops.filter(
    (shop): shop is ShopWithCoords =>
      shop.latitude != null && shop.longitude != null
  );

  const groups: ShopWithCoords[][] = [];

  for (const shop of withCoords) {
    const group = groups.find((candidate) =>
      candidate.some(
        (other) =>
          Math.abs(other.latitude - shop.latitude) <= OVERLAP_THRESHOLD &&
          Math.abs(other.longitude - shop.longitude) <= OVERLAP_THRESHOLD
      )
    );

    if (group) {
      group.push(shop);
    } else {
      groups.push([shop]);
    }
  }

  return groups.flatMap((group) => {
    if (group.length === 1) {
      const [shop] = group;
      return [
        {
          ...shop,
          displayLatitude: shop.latitude,
          displayLongitude: shop.longitude,
        },
      ];
    }

    return group.map((shop, index) => {
      const angle = (2 * Math.PI * index) / group.length;
      return {
        ...shop,
        displayLatitude: shop.latitude + Math.sin(angle) * MARKER_OFFSET,
        displayLongitude: shop.longitude + Math.cos(angle) * MARKER_OFFSET,
      };
    });
  });
}

function MapInner({ shops, center, citySlug }: Props) {
  const [L, setL] = useState<typeof import("react-leaflet") | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-surface-container">
        <span className="text-sm text-on-surface-variant">Cargando mapa...</span>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = L;
  const markerShops = buildMarkerPositions(shops);

  return (
    <div className="flex h-full flex-col">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        attributionControl={false}
        className="flex-1"
        style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markerShops.map((shop) => (
          <Marker
            key={shop.id}
            position={[shop.displayLatitude, shop.displayLongitude]}
          >
            <Popup maxWidth={200} minWidth={180}>
              <a
                href={`/${citySlug}/${shop.slug}`}
                className="block no-underline"
              >
                {shop.imageUrl && (
                  <div
                    style={{
                      position: "relative",
                      width: "180px",
                      height: "100px",
                      borderRadius: "6px",
                      marginBottom: "6px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={shop.imageUrl}
                      alt={shop.imageAlt ?? shop.name}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-sm font-bold text-primary hover:underline">
                  {shop.name}
                </span>
              </a>
              {shop.neighborhood && (
                <p className="mt-1 text-xs text-on-surface-variant">
                  {shop.neighborhood}
                </p>
              )}
              {shop.averagePrice != null && (
                <p className="mt-1 text-xs font-semibold">
                  ~{shop.averagePrice.toFixed(1)} EUR
                </p>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <p className="mt-2 text-[11px] text-on-surface-variant">
        Mapa base ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-primary"
        >
          OpenStreetMap contributors
        </a>
      </p>
    </div>
  );
}

const ShopMap = dynamic(() => Promise.resolve(MapInner), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-surface-container">
      <span className="text-sm text-on-surface-variant">Cargando mapa...</span>
    </div>
  ),
});

export default function ShopMapWrapper(props: Props) {
  return <ShopMap {...props} />;
}
