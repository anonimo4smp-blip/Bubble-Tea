import { SITE_URL } from "./constants";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

// ─── Breadcrumb helpers ─────────────────────────────────────────────────────

type Crumb = { name: string; href?: string };

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };
}

// ─── CollectionPage (city listings, ranking) ────────────────────────────────

export function collectionPageJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${url}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Bubble Tea España",
      url: SITE_URL,
    },
  };
}

export function itemListJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description?: string;
  url: string;
  items: {
    position: number;
    name: string;
    url: string;
    imageUrl?: string | null;
  }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    ...(description ? { description } : {}),
    url: `${SITE_URL}${url}`,
    numberOfItems: items.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      item: {
        "@type": "LocalBusiness",
        name: item.name,
        url: `${SITE_URL}${item.url}`,
        ...(item.imageUrl ? { image: item.imageUrl } : {}),
      },
    })),
  };
}

// ─── FAQPage ────────────────────────────────────────────────────────────────

export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}

// ─── LocalBusiness (shop detail) ────────────────────────────────────────────

export function localBusinessJsonLd({
  name,
  description,
  url,
  address,
  latitude,
  longitude,
  priceRange,
  imageUrl,
  aggregateRating,
  ratingCount,
}: {
  name: string;
  description?: string | null;
  url: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  priceRange?: string | null;
  imageUrl?: string | null;
  aggregateRating?: number | null;
  ratingCount?: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}${url}`,
    name,
    ...(description ? { description } : {}),
    url: `${SITE_URL}${url}`,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: address,
            addressCountry: "ES",
          },
        }
      : {}),
    ...(latitude != null && longitude != null
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude,
            longitude,
          },
        }
      : {}),
    ...(priceRange ? { priceRange } : {}),
    ...(aggregateRating != null && ratingCount != null && ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (aggregateRating / 20).toFixed(1), // 0-100 → 0-5
            bestRating: "5",
            worstRating: "1",
            ratingCount,
          },
        }
      : {}),
  };
}
