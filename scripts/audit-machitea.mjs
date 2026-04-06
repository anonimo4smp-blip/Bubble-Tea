import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "backups");
const OUT_FILE = path.join(OUT_DIR, "machitea-audit-2026-04-05.json");

const CITY_CONFIG = [
  {
    key: "madrid",
    cityName: "Madrid",
    provinceName: "Madrid",
    localityPath: "https://machitea.es/localidades/Madrid/1/",
    target: 24,
    manualSeeds: [
      "https://machitea.es/1-cup-coffee--bubble-tea-madrid-madrid/",
      "https://machitea.es/chashier-bubble-tea-madrid-madrid-madrid/",
      "https://machitea.es/h25-bubble-tea-madrid-madrid/",
      "https://machitea.es/blue-blue-madrid-madrid/",
      "https://machitea.es/lecha-madrid-madrid/",
      "https://machitea.es/flora-tea-madrid-madrid/",
      "https://machitea.es/muua-madrid-madrid/",
      "https://machitea.es/t4-run-run-chicken-madrid-madrid/",
    ],
  },
  {
    key: "barcelona",
    cityName: "Barcelona",
    provinceName: "Barcelona",
    localityPath: "https://machitea.es/localidades/Barcelona/1/",
    target: 24,
    manualSeeds: [
      "https://machitea.es/18ctea-barcelona-barcelona/",
      "https://machitea.es/18ctea-gracia-barcelona-barcelona/",
      "https://machitea.es/sweetea-bubble-tea-barcelona-barcelona/",
      "https://machitea.es/velvet-boba-barcelona-barcelona/",
      "https://machitea.es/here-bubbletea-barcelona-barcelona/",
      "https://machitea.es/kyomi-tea-barcelona-barcelona/",
      "https://machitea.es/qtea-barcelona-barcelona/",
      "https://machitea.es/youcha-barcelona-barcelona/",
      "https://machitea.es/t4-bubble-tea-bcn-barcelona-barcelona/",
      "https://machitea.es/machi-machi-barcelona-barcelona/",
      "https://machitea.es/bubble-piggy-barcelona-barcelona/",
      "https://machitea.es/zenzoo-barcelona-barcelona/",
    ],
  },
  {
    key: "vigo",
    cityName: "Vigo",
    provinceName: "Pontevedra",
    localityPath: "https://machitea.es/localidades/Vigo/1/",
    target: 10,
    manualSeeds: [
      "https://machitea.es/burbujeate-vigo-pontevedra/",
      "https://machitea.es/chachatea-vigo-pontevedra/",
      "https://machitea.es/tea-talk-vigo-pontevedra/",
      "https://machitea.es/crazy-tea-vigo-pontevedra/",
    ],
  },
];

function stripHtml(value) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&Ntilde;/g, "Ñ")
    .replace(/&uuml;/g, "ü")
    .replace(/&Uuml;/g, "Ü")
    .replace(/&#x27;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function toAbsoluteUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `https://machitea.es${url}`;
  return `https://machitea.es/${url}`;
}

function normalizeSlug(url) {
  return url
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/|\/$/g, "");
}

function parsePostalCode(address) {
  const match = address?.match(/\b\d{5}\b/);
  return match ? match[0] : null;
}

function parseNeighborhood(address, cityName) {
  if (!address) return null;
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return null;

  const postalCode = parsePostalCode(address);
  const lastIndex = parts.findIndex((part) => postalCode && part.includes(postalCode));
  const candidateIndex = lastIndex > 0 ? lastIndex - 1 : parts.length - 2;
  const candidate = parts[candidateIndex];
  if (!candidate) return null;
  if (candidate.toLowerCase() === cityName.toLowerCase()) return null;
  return candidate;
}

function parseHours(html) {
  const weekdayMap = {
    Lunes: "monday",
    Martes: "tuesday",
    Miércoles: "wednesday",
    Miercoles: "wednesday",
    Jueves: "thursday",
    Viernes: "friday",
    Sábado: "saturday",
    Sabado: "saturday",
    Domingo: "sunday",
  };

  const sectionMatch = html.match(/<h2 class="text-xl font-bold text-black mb-2">Horario<\/h2>\s*<div>([\s\S]*?)<\/div>\s*<\/div>/i);
  if (!sectionMatch) return [];

  const lines = [...sectionMatch[1].matchAll(/<li>([^:]+):\s*([^<]+)<\/li>/gi)];
  return lines
    .map(([, label, value]) => {
      const weekday = weekdayMap[stripHtml(label)];
      if (!weekday) return null;
      const cleanValue = stripHtml(value);
      if (/cerrado/i.test(cleanValue)) {
        return { weekday, opensAt: null, closesAt: null, isClosed: true };
      }
      const rangeMatch = cleanValue.match(/(\d{2}:\d{2})\s*[–-]\s*(\d{2}:\d{2})/);
      return {
        weekday,
        opensAt: rangeMatch ? rangeMatch[1] : null,
        closesAt: rangeMatch ? rangeMatch[2] : null,
        isClosed: !rangeMatch,
      };
    })
    .filter(Boolean);
}

function parseFeatures(html) {
  const text = stripHtml(html).toLowerCase();
  return {
    takeaway: /para llevar/.test(text),
    seating: /(comer all[ií]|consumir en el local|ambiente acogedor|terraza|relajarte en nuestro local|espacio acogedor)/.test(text),
    wheelchairAccessible: /(sillas de ruedas|accesible)/.test(text),
    veganOptions: /vegano/.test(text),
    lactoseFreeOptions: /sin lactosa/.test(text),
    glutenFreeOptions: /sin gluten/.test(text),
    wifi: /wifi/.test(text),
    studyFriendly: /estudiar/.test(text),
    photoFriendly: /(instagram|instagrameable|instagrameable|fotogénico|fotogenico)/.test(text),
    petFriendly: /(pet-friendly|pet friendly|mascotas)/.test(text),
  };
}

function parseMapsData(html) {
  const placeHref =
    html.match(/href="(https:\/\/www\.google\.com\/maps\/place\/[^"]+)"/i)?.[1] ??
    html.match(/href="(https:\/\/maps\.app\.goo\.gl\/[^"]+)"/i)?.[1] ??
    null;
  const iframeSrc =
    html.match(/<iframe[^>]+src="(https:\/\/www\.google\.com\/maps\/embed\/[^"]+)"/i)?.[1] ??
    null;
  const mapsUrl = placeHref ?? iframeSrc;

  let latitude = null;
  let longitude = null;
  if (mapsUrl) {
    const latLngMatch = mapsUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (latLngMatch) {
      latitude = Number(latLngMatch[1]);
      longitude = Number(latLngMatch[2]);
    }
  }

  return { mapsUrl, latitude, longitude };
}

function parseVenuePage(url, html, cityConfig) {
  const title = stripHtml(html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "");
  if (!title) return null;

  const titleMatch = title.match(/^(.*?)\s+en\s+([^,]+),\s*([^|<]+)$/i);
  const name = stripHtml(titleMatch?.[1] ?? title);
  const cityName = stripHtml(titleMatch?.[2] ?? cityConfig.cityName);
  const provinceName = stripHtml(titleMatch?.[3] ?? cityConfig.provinceName);

  if (cityName.toLowerCase() !== cityConfig.cityName.toLowerCase()) {
    return null;
  }

  const metaDescription = stripHtml(
    html.match(/<meta name="description" content="([^"]+)"/i)?.[1] ?? ""
  );

  const address =
    stripHtml(
      html.match(/<li><strong>Dirección:<\/strong>\s*([^<]+)<\/li>/i)?.[1] ?? ""
    ) || null;
  const postalCode = parsePostalCode(address);
  const neighborhood = parseNeighborhood(address, cityName);

  const phone = stripHtml(
    html.match(/href="tel:([^"]+)"/i)?.[1] ?? ""
  ) || null;

  const rating = Number.parseFloat(
    html.match(/<p class="text-4xl font-bold mt-0 mb-0">(\d+(?:\.\d+)?)<\/p>/i)?.[1] ??
      ""
  );
  const reviewCount = Number.parseInt(
    html.match(/Nº Reseñas[\s\S]*?<p class="text-4xl font-bold mt-0 mb-0">(\d+)<\/p>/i)?.[1] ??
      "",
    10
  );

  const imagePath =
    html.match(/<img[^>]+src="(\/imagenes\/teterias\/[^"]+)"/i)?.[1] ?? null;
  const imageUrl = imagePath ? toAbsoluteUrl(imagePath) : null;

  const hours = parseHours(html);
  const features = parseFeatures(html);
  const { mapsUrl, latitude, longitude } = parseMapsData(html);

  const relatedUrls = [...html.matchAll(/<a href="(\/[^"]+-(?:madrid|barcelona|vigo)-[^"]*\/)"/gi)]
    .map((match) => toAbsoluteUrl(match[1]))
    .filter(Boolean);

  const descriptionBlocks = [...html.matchAll(/<div><p>([\s\S]*?)<\/p><\/div>/gi)];
  const longDescription = stripHtml(descriptionBlocks[0]?.[1] ?? metaDescription);

  return {
    sourceUrl: url,
    source: "machitea",
    slug: normalizeSlug(url),
    name,
    cityName,
    provinceName,
    address,
    postalCode,
    neighborhood,
    latitude,
    longitude,
    googleMapsUrl: mapsUrl,
    websiteUrl: null,
    instagramUrl: null,
    phone,
    rating: Number.isFinite(rating) ? rating : null,
    reviewCount: Number.isFinite(reviewCount) ? reviewCount : null,
    editorSummary: longDescription || metaDescription || null,
    whyItStandsOut: null,
    recommendedOrder: null,
    averagePrice: null,
    priceMin: null,
    priceMax: null,
    imageUrl,
    hours,
    features,
    relatedUrls: [...new Set(relatedUrls)],
  };
}

function parseListingUrls(html, cityConfig) {
  const regex = new RegExp(
    `href="(\\/[^"]*-${cityConfig.key}-${cityConfig.provinceName.toLowerCase()}\\/)"`
      .replace(/[\u00C0-\u017F]/g, (char) => char.normalize("NFD").replace(/[\u0300-\u036f]/g, "")),
    "gi"
  );
  const matches = [...html.matchAll(regex)];
  const urls = matches.map((match) => toAbsoluteUrl(match[1]));

  if (urls.length > 0) return [...new Set(urls)];

  return [...html.matchAll(/href="(\/[^"]+\/)"/gi)]
    .map((match) => match[1])
    .filter((href) => !href.startsWith("/localidades/") && !href.startsWith("/provincias/") && !href.startsWith("/page/") && href !== "/")
    .map((href) => toAbsoluteUrl(href))
    .filter((href) => href.toLowerCase().includes(`-${cityConfig.key}-`));
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; BubbleTeaEspanaAudit/1.0)",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }

  return response.text();
}

async function collectLocalityUrls(cityConfig) {
  const collected = new Set(cityConfig.manualSeeds);
  const seenPages = new Set();
  const queue = [cityConfig.localityPath];

  while (queue.length > 0 && collected.size < cityConfig.target) {
    const url = queue.shift();
    if (!url || seenPages.has(url)) continue;
    seenPages.add(url);

    const html = await fetchHtml(url);
    for (const venueUrl of parseListingUrls(html, cityConfig)) {
      collected.add(venueUrl);
    }

    const nextPage = html.match(
      /<a href="(\/localidades\/[^"]+\/\d+\/)"[^>]*aria-label="Next page"/i
    )?.[1];
    if (nextPage) {
      queue.push(toAbsoluteUrl(nextPage));
    }
  }

  return [...collected];
}

async function crawlCity(cityConfig) {
  const venueUrls = await collectLocalityUrls(cityConfig);
  const queue = [...venueUrls];
  const seen = new Set();
  const venues = [];

  while (queue.length > 0 && venues.length < cityConfig.target) {
    const url = queue.shift();
    if (!url || seen.has(url)) continue;
    seen.add(url);

    try {
      const html = await fetchHtml(url);
      const venue = parseVenuePage(url, html, cityConfig);
      if (!venue) continue;
      venues.push(venue);

      for (const relatedUrl of venue.relatedUrls) {
        if (!seen.has(relatedUrl)) {
          queue.push(relatedUrl);
        }
      }
    } catch (error) {
      venues.push({
        sourceUrl: url,
        source: "machitea",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return venues;
}

async function main() {
  const results = {};

  for (const cityConfig of CITY_CONFIG) {
    results[cityConfig.key] = await crawlCity(cityConfig);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(results, null, 2), "utf8");

  for (const [city, venues] of Object.entries(results)) {
    const ok = venues.filter((venue) => !venue.error).length;
    const broken = venues.filter((venue) => venue.error).length;
    console.log(`${city}: ${ok} venues, ${broken} failed`);
  }

  console.log(`Saved audit data to ${OUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
