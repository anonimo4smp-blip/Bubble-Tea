import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const RAW_FILE = path.join(ROOT, "backups", "machitea-audit-2026-04-05.json");
const OUT_DIR = path.join(ROOT, "data");
const OUT_FILE = path.join(OUT_DIR, "verified-shops.json");

const CITY_TARGETS = {
  madrid: 20,
  barcelona: 20,
  vigo: 5,
};

const EXCLUDED_SOURCE_SLUGS = {
  madrid: ["leek-madrid-madrid"],
  barcelona: [],
  vigo: ["tea-talk---bubble-tea--coffee-vigo-pontevedra", "tea-talk-vigo-pontevedra"],
};

const CHAIN_RULES = [
  [/^1 cup/i, "1 CUP Coffee & Bubble Tea"],
  [/^18ctea/i, "18CTEA"],
  [/^buscat[eé]/i, "Buscaté"],
  [/^bubble piggy/i, "Bubble Piggy"],
  [/^bubbolitas/i, "Bubbolitas"],
  [/^coco/i, "CoCo Bubble Tea"],
  [/^cassava roots/i, "Cassava Roots"],
  [/^chashier/i, "Chashier Bubble Tea"],
  [/^puki/i, "Puki"],
  [/^xinxin tea/i, "Xinxin Tea"],
];

const COORDINATE_OVERRIDES = {
  "coco-fresh-tea-juice": { latitude: 40.4162989, longitude: -3.7075178 },
  "puki-vialia": { latitude: 42.2353353, longitude: -8.7103625 },
  "xinxin-tea": { latitude: 42.2381547, longitude: -8.7102802 },
  "tea-talk-vigo": { latitude: 42.2356465, longitude: -8.7206416 },
};

const ADDRESS_OVERRIDES = {
  "coco-fresh-tea-juice": {
    address: "C. Mayor, 30, Centro, 28013 Madrid",
    neighborhood: "Centro",
  },
  "crazy-tea": {
    address: "36202 Vigo, Pontevedra",
    neighborhood: null,
  },
};

const MANUAL_ACTIVE = {
  vigo: [
    {
      sourceUrls: [
        "https://www.turismo.gal/recurso/-/detalle/250904000053/puki?ctre=40000240&tp=1001549",
        "https://glovoapp.com/es/es/vigo/stores/puki-vigo",
        "https://www.reserva-restaurante-menu.es/puki-vigo",
      ],
      name: "Puki",
      slug: "puki-vialia",
      brandName: "Puki",
      isIndependent: true,
      address: "Praza Estación, 1, Local 116, 36201 Vigo, Pontevedra",
      postalCode: "36201",
      neighborhood: "Centro Comercial Vialia",
      phone: "+34696584738",
      websiteUrl: null,
      instagramUrl: null,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Puki%20Praza%20Estaci%C3%B3n%201%20Local%20116%20Vigo",
      rating: null,
      reviewCount: null,
      editorSummary:
        "Local de Vialia Vigo con carta propia de bubble tea en formato mediano y grande, además de su propuesta de pastelería artesanal.",
      whyItStandsOut: null,
      recommendedOrder: null,
      averagePrice: null,
      priceMin: null,
      priceMax: null,
      imageUrl: null,
      imageAlt: null,
      hours: weekdayHours("12:00", "18:00", false, false),
      features: {
        veganOptions: false,
        lactoseFreeOptions: false,
        glutenFreeOptions: false,
        takeaway: true,
        seating: false,
        wifi: false,
        studyFriendly: false,
        photoFriendly: true,
        petFriendly: false,
        wheelchairAccessible: true,
      },
      status: "published",
    },
    {
      sourceUrls: [
        "https://www.xinxinteavigo.es/",
        "https://www.paxinasgalegas.es/xinxin-tea-687200em.html",
        "https://www.reserva-restaurante-menu.es/xinxin-tea-vigo",
      ],
      name: "Xinxin Tea",
      slug: "xinxin-tea",
      brandName: "Xinxin Tea",
      isIndependent: true,
      address: "Rúa de García Barbón, 123, 36201 Vigo, Pontevedra",
      postalCode: "36201",
      neighborhood: "Fátima",
      phone: "+34886290922",
      websiteUrl: "https://www.xinxinteavigo.es/",
      instagramUrl: null,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Xinxin%20Tea%20R%C3%BAa%20de%20Garc%C3%ADa%20Barb%C3%B3n%20123%20Vigo",
      rating: 4.8,
      reviewCount: 60,
      editorSummary:
        "Restaurante asiático de García Barbón con carta propia de bubble tea, tés con leche, matcha y bebidas de fruta con tapioca y otros toppings.",
      whyItStandsOut: null,
      recommendedOrder: null,
      averagePrice: null,
      priceMin: null,
      priceMax: null,
      imageUrl: null,
      imageAlt: null,
      hours: weekdayHours("11:00", "23:00", false, false),
      features: {
        veganOptions: true,
        lactoseFreeOptions: false,
        glutenFreeOptions: false,
        takeaway: true,
        seating: true,
        wifi: true,
        studyFriendly: false,
        photoFriendly: false,
        petFriendly: false,
        wheelchairAccessible: true,
      },
      status: "published",
    },
  ],
};

const MANUAL_CLOSED = {
  vigo: [
    {
      sourceUrls: [
        "https://www.paxinasgalegas.es/tea-talk-711961em.html",
        "https://metropolitano.gal/enfoque/vigo-se-despide-de-uno-de-sus-espacios-gastronomicos-mas-trendy-del-centro/",
      ],
      name: "Tea Talk - Bubble Tea & Coffee",
      slug: "tea-talk-vigo",
      brandName: "Tea Talk",
      isIndependent: false,
      address: "Rda. de Don Bosco, 64 Bajo, 36202 Vigo, Pontevedra",
      postalCode: "36202",
      neighborhood: "Areal - Vigo Centro",
      phone: null,
      websiteUrl: "https://teatalkvigo.es/",
      instagramUrl: null,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Tea%20Talk%20Ronda%20de%20Don%20Bosco%2064%20Vigo",
      rating: null,
      reviewCount: null,
      editorSummary:
        "Antigua tetería especializada en bubble tea del centro de Vigo. Páxinas Galegas y prensa local la señalan como cerrada en 2025.",
      whyItStandsOut: null,
      recommendedOrder: null,
      averagePrice: null,
      priceMin: null,
      priceMax: null,
      imageUrl: null,
      imageAlt: null,
      hours: [],
      features: {
        veganOptions: false,
        lactoseFreeOptions: false,
        glutenFreeOptions: false,
        takeaway: false,
        seating: false,
        wifi: false,
        studyFriendly: false,
        photoFriendly: false,
        petFriendly: false,
        wheelchairAccessible: false,
      },
      status: "cerrado_definitivo",
    },
  ],
};

function weekdayHours(opensAt, closesAt, sundayClosed = false, saturdayClosed = false) {
  return [
    ["monday", false],
    ["tuesday", false],
    ["wednesday", false],
    ["thursday", false],
    ["friday", false],
    ["saturday", saturdayClosed],
    ["sunday", sundayClosed],
  ].map(([weekday, isClosed]) => ({
    weekday,
    opensAt: isClosed ? null : opensAt,
    closesAt: isClosed ? null : closesAt,
    isClosed,
  }));
}

function repairText(value) {
  if (!value) return value;
  let current = value;
  for (let i = 0; i < 3; i += 1) {
    if (!/[ÃÂÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(current)) {
      break;
    }
    const repaired = Buffer.from(current, "latin1").toString("utf8");
    if (repaired === current || repaired.includes("�")) {
      break;
    }
    current = repaired;
  }
  return current
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return repairText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function parsePostalCode(address) {
  return address?.match(/\b\d{5}\b/)?.[0] ?? null;
}

function normalizeNeighborhood(value, cityName) {
  const fixed = repairText(value);
  if (!fixed) return null;
  if (fixed.toLowerCase() === cityName.toLowerCase()) return null;
  return fixed;
}

function normalizeAddress(rawAddress, cityName, provinceName, name) {
  let value = repairText(rawAddress);
  if (!value) return null;

  value = value
    .replace(/邮政编码:?\s*/gi, "")
    .replace(/\s+,/g, ",")
    .replace(/^ES\s+[A-Za-zÀ-ÿ]+\s+[A-Za-zÀ-ÿ]+,\s*/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const postalCode = parsePostalCode(value);
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);

  if (parts[0]?.toLowerCase() === cityName.toLowerCase() && parts.length >= 3) {
    const district = parts[1];
    const streetParts = parts.slice(2).filter((part) => part !== name && !part.includes(postalCode ?? ""));
    const street = streetParts.join(", ");
    value = [street, district, postalCode ? `${postalCode} ${cityName}` : cityName]
      .filter(Boolean)
      .join(", ");
  }

  if (/^\d{5},\s*/.test(value)) {
    value = value.replace(/^(\d{5}),\s*([^,]+),\s*([^,]+),\s*(.+)$/i, "$4, $3, $1 $2");
  }

  if (!value.toLowerCase().includes(cityName.toLowerCase())) {
    value = `${value}, ${cityName}`;
  }

  if (
    provinceName &&
    provinceName.toLowerCase() !== cityName.toLowerCase() &&
    !value.toLowerCase().includes(provinceName.toLowerCase())
  ) {
    value = `${value}, ${provinceName}`;
  }

  return value.replace(/\s+/g, " ").trim();
}

function inferBrandName(name) {
  for (const [pattern, brandName] of CHAIN_RULES) {
    if (pattern.test(name)) return brandName;
  }
  return null;
}

function cleanupSlug(rawSlug, citySlug, provinceName) {
  const provinceSlug = slugify(provinceName);
  const suffix = `-${citySlug}-${provinceSlug}`;
  if (rawSlug.endsWith(suffix)) {
    return rawSlug.slice(0, -suffix.length);
  }
  return rawSlug;
}

function toMapsSearchUrl(name, address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${name} ${address}`.trim()
  )}`;
}

function deriveScore(rating) {
  if (typeof rating !== "number" || Number.isNaN(rating)) return null;
  return Math.round(rating * 20 * 10) / 10;
}

async function geocodeAddress(address) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" +
    encodeURIComponent(address);
  const response = await fetch(url, {
    headers: {
      "User-Agent": "BubbleTeaEspana/1.0 (data cleanup)",
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data[0] ?? null;
}

function normalizeRawVenue(citySlug, cityName, provinceName, venue) {
  const fixedName = repairText(venue.name);
  if (!fixedName || fixedName === "Machitea" || !venue.address) return null;

  const fixedAddress = normalizeAddress(venue.address, cityName, provinceName, fixedName);
  if (!fixedAddress) return null;

  const postalCode = venue.postalCode ?? parsePostalCode(fixedAddress);
  let neighborhood =
    normalizeNeighborhood(venue.neighborhood, cityName) ??
    normalizeNeighborhood(
      fixedAddress
        .split(",")
        .map((part) => part.trim())
        .find((part) => !part.match(/\d{5}/) && !part.includes(cityName)),
      cityName
    );

  const baseSlug = cleanupSlug(slugify(venue.slug || fixedName), citySlug, provinceName);
  const brandName = inferBrandName(fixedName);
  const addressOverride = ADDRESS_OVERRIDES[baseSlug];

  return {
    sourceUrls: [venue.sourceUrl],
    name: fixedName,
    slug: baseSlug || slugify(fixedName),
    brandName,
    isIndependent: !brandName,
    address: addressOverride?.address ?? fixedAddress,
    postalCode,
    neighborhood: addressOverride?.neighborhood ?? neighborhood,
    phone: repairText(venue.phone) || null,
    websiteUrl: null,
    instagramUrl: null,
    googleMapsUrl: toMapsSearchUrl(fixedName, fixedAddress),
    latitude: venue.latitude ?? null,
    longitude: venue.longitude ?? null,
    rating: typeof venue.rating === "number" ? venue.rating : null,
    reviewCount: typeof venue.reviewCount === "number" ? venue.reviewCount : null,
    editorSummary: repairText(venue.editorSummary) || null,
    whyItStandsOut: null,
    recommendedOrder: null,
    averagePrice: null,
    priceMin: null,
    priceMax: null,
    imageUrl: venue.imageUrl ?? null,
    imageAlt: venue.imageUrl ? `${fixedName} en ${cityName}` : null,
    hours: venue.hours ?? [],
    features: {
      veganOptions: Boolean(venue.features?.veganOptions),
      lactoseFreeOptions: Boolean(venue.features?.lactoseFreeOptions),
      glutenFreeOptions: Boolean(venue.features?.glutenFreeOptions),
      takeaway: Boolean(venue.features?.takeaway),
      seating: Boolean(venue.features?.seating),
      wifi: Boolean(venue.features?.wifi),
      studyFriendly: Boolean(venue.features?.studyFriendly),
      photoFriendly: Boolean(venue.features?.photoFriendly),
      petFriendly: Boolean(venue.features?.petFriendly),
      wheelchairAccessible: Boolean(venue.features?.wheelchairAccessible),
    },
    status: "published",
  };
}

function uniqueBySlug(shops) {
  const used = new Set();
  return shops.filter((shop) => {
    const key = shop.slug;
    if (used.has(key)) return false;
    used.add(key);
    return true;
  });
}

async function ensureCoordinates(shop) {
  const override = COORDINATE_OVERRIDES[shop.slug];
  if (override) {
    return {
      ...shop,
      latitude: override.latitude,
      longitude: override.longitude,
    };
  }
  if (shop.latitude != null && shop.longitude != null) {
    return shop;
  }
  const geo = await geocodeAddress(shop.address);
  if (!geo) return shop;
  return {
    ...shop,
    latitude: geo.lat ? Number(geo.lat) : shop.latitude,
    longitude: geo.lon ? Number(geo.lon) : shop.longitude,
  };
}

async function buildCity(citySlug, rawVenues, cityName, provinceName) {
  const normalized = rawVenues
    .filter((venue) => !EXCLUDED_SOURCE_SLUGS[citySlug].includes(venue.slug))
    .map((venue) => normalizeRawVenue(citySlug, cityName, provinceName, venue))
    .filter(Boolean);

  const deduped = uniqueBySlug(normalized)
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, CITY_TARGETS[citySlug]);

  const manual = MANUAL_ACTIVE[citySlug] ?? [];
  const combined = uniqueBySlug([...manual, ...deduped]).slice(0, CITY_TARGETS[citySlug]);

  const enriched = [];
  for (const shop of combined) {
    // Keep the geocoder lightweight and deterministic.
    enriched.push(await ensureCoordinates(shop));
  }

  return enriched.map((shop) => ({
    ...shop,
    googleScore: deriveScore(shop.rating),
  }));
}

async function main() {
  const raw = JSON.parse(await fs.readFile(RAW_FILE, "utf8"));

  const cities = {
    madrid: await buildCity("madrid", raw.madrid, "Madrid", "Madrid"),
    barcelona: await buildCity("barcelona", raw.barcelona, "Barcelona", "Barcelona"),
    vigo: await buildCity("vigo", raw.vigo, "Vigo", "Pontevedra"),
  };

  const payload = {
    generatedAt: new Date().toISOString(),
    cities,
    closedShops: MANUAL_CLOSED,
  };

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(payload, null, 2), "utf8");

  for (const [citySlug, shops] of Object.entries(cities)) {
    console.log(`${citySlug}: ${shops.length} shops`);
    for (const shop of shops) {
      console.log(`  - ${shop.name}`);
    }
  }

  console.log(`Saved verified data to ${OUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
