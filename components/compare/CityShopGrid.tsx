"use client";

import ShopCard from "@/components/ShopCard";
import CompareToggle from "./CompareToggle";
import CompareBar from "./CompareBar";
import CompareDrawer from "./CompareDrawer";
import { CompareProvider, type ComparableShop } from "./CompareProvider";

type ShopData = {
  id: number;
  name: string;
  slug: string;
  neighborhood: string | null;
  averagePrice: number | null;
  editorSummary: string | null;
  totalScore: number | null;
  imageUrl: string | null;
  imageAlt: string | null;
  features: {
    veganOptions: boolean;
    wifi: boolean;
    studyFriendly: boolean;
    photoFriendly: boolean;
    petFriendly: boolean;
    takeaway: boolean;
    seating: boolean;
    lactoseFreeOptions: boolean;
    glutenFreeOptions: boolean;
    wheelchairAccessible: boolean;
  } | null;
};

type Props = {
  shops: ShopData[];
  citySlug: string;
};

export default function CityShopGrid({ shops, citySlug }: Props) {
  return (
    <CompareProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {shops.map((shop) => {
          const comparable: ComparableShop = {
            id: shop.id,
            name: shop.name,
            slug: shop.slug,
            citySlug,
            neighborhood: shop.neighborhood,
            averagePrice: shop.averagePrice,
            editorSummary: shop.editorSummary,
            totalScore: shop.totalScore,
            imageUrl: shop.imageUrl,
            imageAlt: shop.imageAlt,
            features: shop.features,
          };

          return (
            <ShopCard
              key={shop.id}
              name={shop.name}
              slug={shop.slug}
              citySlug={citySlug}
              neighborhood={shop.neighborhood}
              averagePrice={shop.averagePrice}
              editorSummary={shop.editorSummary}
              totalScore={shop.totalScore}
              features={shop.features}
              imageUrl={shop.imageUrl}
              imageAlt={shop.imageAlt}
              compareButton={<CompareToggle shop={comparable} />}
            />
          );
        })}
      </div>
      <CompareBar />
      <CompareDrawer />
    </CompareProvider>
  );
}
