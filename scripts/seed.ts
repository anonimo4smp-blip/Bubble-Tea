import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  cities,
  shops,
  shopFeatures,
  shopHours,
  shopScores,
  seoPages,
} from "../db/schema";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
const db = drizzle(client);

// ─── Helper ──────────────────────────────────────────────────────────────────

function calcTotal(s: {
  quality: number;
  price: number;
  variety: number;
  experience: number;
  google: number;
  popularity: number;
}) {
  return +(
    s.quality * 0.35 +
    s.price * 0.15 +
    s.variety * 0.15 +
    s.experience * 0.1 +
    s.google * 0.15 +
    s.popularity * 0.1
  ).toFixed(1);
}

type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

const WEEKDAYS: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

function makeHours(
  shopId: number,
  weekdayOpen: string,
  weekdayClose: string,
  satOpen: string,
  satClose: string,
  sunOpen: string | null,
  sunClose: string | null
) {
  return WEEKDAYS.map((day) => {
    if (day === "sunday") {
      return {
        shopId,
        weekday: day,
        opensAt: sunOpen,
        closesAt: sunClose,
        isClosed: sunOpen === null,
      };
    }
    if (day === "saturday") {
      return {
        shopId,
        weekday: day,
        opensAt: satOpen,
        closesAt: satClose,
        isClosed: false,
      };
    }
    return {
      shopId,
      weekday: day,
      opensAt: weekdayOpen,
      closesAt: weekdayClose,
      isClosed: false,
    };
  });
}

// ─── City Data ───────────────────────────────────────────────────────────────

const citiesData = [
  {
    name: "Madrid",
    slug: "madrid",
    region: "Comunidad de Madrid",
    province: "Madrid",
    status: "published" as const,
    shortDescription:
      "La capital del bubble tea en España: más de 20 locales repartidos entre Usera, Malasaña, Gran Vía y Lavapiés.",
    longDescription:
      "Madrid se ha convertido en el epicentro del bubble tea en España. Desde el barrio chino de Usera hasta las calles hipster de Malasaña, la ciudad ofrece una variedad impresionante de locales especializados. Ya sea que busques un clásico brown sugar boba o una creación artesanal con frutas frescas, Madrid tiene un local para ti. Nuestra selección editorial cubre las mejores opciones calidad-precio, los locales más instagrameables y las joyas ocultas que solo los verdaderos amantes del bubble tea conocen.",
    seoTitle: "Bubble Tea en Madrid: Los Mejores Locales (2026)",
    seoDescription:
      "Descubre los mejores locales de bubble tea en Madrid. Guía editorial con ranking, precios, horarios y reseñas de más de 20 tiendas de té de burbujas.",
    keywordPrimary: "bubble tea madrid",
    latitudeCenter: 40.4168,
    longitudeCenter: -3.7038,
    publishedAt: new Date(),
  },
  {
    name: "Barcelona",
    slug: "barcelona",
    region: "Cataluña",
    province: "Barcelona",
    status: "published" as const,
    shortDescription:
      "Barcelona vibrante y cosmopolita: descubre más de 20 locales de bubble tea entre el Raval, Gràcia y L'Eixample.",
    longDescription:
      "Barcelona ha abrazado la cultura del bubble tea con entusiasmo mediterráneo. Desde franquicias internacionales hasta pequeños locales artesanales en el Raval, la oferta es tan diversa como la propia ciudad. El Eixample concentra las cadenas más conocidas, mientras que Gràcia esconde las propuestas más originales. Con el buen tiempo casi todo el año, Barcelona es perfecta para disfrutar de un boba helado mientras paseas por sus calles. Te presentamos nuestra selección editorial de los mejores locales.",
    seoTitle: "Bubble Tea en Barcelona: Los Mejores Locales (2026)",
    seoDescription:
      "Los mejores locales de bubble tea en Barcelona. Ranking editorial con precios, opiniones y horarios de más de 20 tiendas de té de burbujas.",
    keywordPrimary: "bubble tea barcelona",
    latitudeCenter: 41.3874,
    longitudeCenter: 2.1686,
    publishedAt: new Date(),
  },
  {
    name: "Vigo",
    slug: "vigo",
    region: "Galicia",
    province: "Pontevedra",
    status: "published" as const,
    shortDescription:
      "Vigo se suma a la fiebre del boba: 8 locales donde probar el mejor bubble tea de Galicia.",
    longDescription:
      "Vigo, la ciudad más poblada de Galicia, ha visto crecer su oferta de bubble tea en los últimos años. Aunque más compacta que Madrid o Barcelona, la ciudad ofrece opciones sorprendentes tanto en el centro como en la zona de Gran Vía y el Casco Vello. Desde locales especializados hasta cafeterías que han incorporado el boba a su carta, Vigo demuestra que el bubble tea no es solo cosa de grandes capitales. Descubre nuestra selección de los mejores sitios para tomar un boba en la ciudad olívica.",
    seoTitle: "Bubble Tea en Vigo: Los Mejores Locales (2026)",
    seoDescription:
      "Los mejores locales de bubble tea en Vigo. Guía editorial con ranking, precios y horarios de las mejores tiendas de té de burbujas en Galicia.",
    keywordPrimary: "bubble tea vigo",
    latitudeCenter: 42.2406,
    longitudeCenter: -8.7207,
    publishedAt: new Date(),
  },
];

// ─── Shop Data ───────────────────────────────────────────────────────────────

interface ShopSeed {
  name: string;
  slug: string;
  brandName?: string;
  isIndependent: boolean;
  address: string;
  postalCode: string;
  neighborhood: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  websiteUrl?: string;
  instagramUrl?: string;
  priceMin: number;
  priceMax: number;
  averagePrice: number;
  editorSummary: string;
  whyItStandsOut: string;
  recommendedOrder: string;
  features: {
    veganOptions: boolean;
    lactoseFreeOptions: boolean;
    glutenFreeOptions: boolean;
    takeaway: boolean;
    seating: boolean;
    wifi: boolean;
    studyFriendly: boolean;
    photoFriendly: boolean;
    petFriendly: boolean;
    wheelchairAccessible: boolean;
  };
  scores: {
    quality: number;
    price: number;
    variety: number;
    experience: number;
    google: number;
    popularity: number;
  };
  hours: {
    weekdayOpen: string;
    weekdayClose: string;
    satOpen: string;
    satClose: string;
    sunOpen: string | null;
    sunClose: string | null;
  };
}

// ──── MADRID SHOPS ───────────────────────────────────────────────────────────

const madridShops: ShopSeed[] = [
  {
    name: "Heekcaa",
    slug: "heekcaa",
    brandName: "Heekcaa",
    isIndependent: false,
    address: "Calle de la Montera, 24",
    postalCode: "28013",
    neighborhood: "Sol",
    latitude: 40.4192,
    longitude: -3.7011,
    googleMapsUrl: "https://maps.app.goo.gl/heekcaa-madrid",
    instagramUrl: "https://instagram.com/heekcaa_spain",
    priceMin: 4.5,
    priceMax: 6.5,
    averagePrice: 5.2,
    editorSummary:
      "Heekcaa ha conquistado el centro de Madrid con su propuesta de tés con queso cremoso que se han vuelto virales en TikTok. Su local en plena Montera es un imán para curiosos y fans del boba por igual.",
    whyItStandsOut:
      "Su cheese tea es de los mejores de la ciudad: una capa densa de queso cremoso ligeramente salado sobre tés de alta calidad. La presentación es impecable.",
    recommendedOrder: "Brown Sugar Cheese Tea con perlas de tapioca extra",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 88, price: 60, variety: 75, experience: 82, google: 85, popularity: 92 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:30", satOpen: "11:00", satClose: "22:00", sunOpen: "12:00", sunClose: "21:00" },
  },
  {
    name: "CoCo Fresh Tea & Juice",
    slug: "coco-fresh-tea-juice",
    brandName: "CoCo",
    isIndependent: false,
    address: "Calle del Arenal, 7",
    postalCode: "28013",
    neighborhood: "Sol",
    latitude: 40.4173,
    longitude: -3.7060,
    googleMapsUrl: "https://maps.app.goo.gl/coco-madrid",
    websiteUrl: "https://www.coco-tea.com",
    instagramUrl: "https://instagram.com/cocofreshteajuice",
    priceMin: 3.8,
    priceMax: 5.9,
    averagePrice: 4.5,
    editorSummary:
      "CoCo es una de las cadenas taiwanesas más reconocidas a nivel mundial y su local en el Arenal no decepciona. Consistencia, rapidez y una carta amplia que satisface tanto a novatos como a puristas.",
    whyItStandsOut:
      "La consistencia del producto es admirable: cada visita ofrece la misma calidad. Sus tés con leche clásicos están entre los más equilibrados de Madrid.",
    recommendedOrder: "CoCo Milk Tea con tapioca al 50% de azúcar",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 82, price: 72, variety: 85, experience: 75, google: 82, popularity: 88 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:00", satOpen: "11:00", satClose: "22:00", sunOpen: "11:30", sunClose: "21:00" },
  },
  {
    name: "Tiger Sugar",
    slug: "tiger-sugar",
    brandName: "Tiger Sugar",
    isIndependent: false,
    address: "Calle de Preciados, 42",
    postalCode: "28013",
    neighborhood: "Sol",
    latitude: 40.4200,
    longitude: -3.7050,
    googleMapsUrl: "https://maps.app.goo.gl/tigersugar-madrid",
    instagramUrl: "https://instagram.com/tigersugarspain",
    priceMin: 5.0,
    priceMax: 7.0,
    averagePrice: 5.8,
    editorSummary:
      "Las icónicas rayas de tigre de caramelo de azúcar moreno han llegado a Madrid. Tiger Sugar es puro espectáculo visual con un sabor que respalda la fama.",
    whyItStandsOut:
      "El Brown Sugar Boba Milk es visualmente hipnótico: las vetas de caramelo oscuro cayendo sobre la leche crean un efecto que justifica cada foto de Instagram.",
    recommendedOrder: "Brown Sugar Boba Milk con crema",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: false,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 85, price: 55, variety: 50, experience: 80, google: 88, popularity: 95 },
    hours: { weekdayOpen: "11:30", weekdayClose: "21:30", satOpen: "11:00", satClose: "22:00", sunOpen: "12:00", sunClose: "21:00" },
  },
  {
    name: "Tsaocaa",
    slug: "tsaocaa",
    brandName: "Tsaocaa",
    isIndependent: false,
    address: "Calle de Hortaleza, 58",
    postalCode: "28004",
    neighborhood: "Chueca",
    latitude: 40.4240,
    longitude: -3.6980,
    googleMapsUrl: "https://maps.app.goo.gl/tsaocaa-madrid",
    instagramUrl: "https://instagram.com/tsaocaa_spain",
    priceMin: 4.0,
    priceMax: 6.5,
    averagePrice: 5.0,
    editorSummary:
      "Tsaocaa apuesta por tés premium en un local moderno y acogedor en pleno Chueca. Su especialidad son los fruit teas con trozos reales de fruta fresca.",
    whyItStandsOut:
      "La frescura de sus fruit teas es difícil de igualar: usan fruta real cortada al momento. El local invita a quedarse con su decoración minimalista.",
    recommendedOrder: "Mango Pomelo Sago con perlas de tapioca",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 86, price: 65, variety: 80, experience: 78, google: 84, popularity: 80 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:00", satOpen: "11:00", satClose: "22:00", sunOpen: "12:00", sunClose: "21:00" },
  },
  {
    name: "Frankly Bubble Tea",
    slug: "frankly-bubble-tea-malasana",
    brandName: "Frankly",
    isIndependent: false,
    address: "Calle del Espíritu Santo, 15",
    postalCode: "28004",
    neighborhood: "Malasaña",
    latitude: 40.4260,
    longitude: -3.7050,
    googleMapsUrl: "https://maps.app.goo.gl/frankly-malasana",
    instagramUrl: "https://instagram.com/franklybubbletea",
    priceMin: 4.2,
    priceMax: 6.0,
    averagePrice: 4.8,
    editorSummary:
      "Frankly es una de las marcas que mejor ha entendido el mercado español. Su local de Malasaña combina buen producto con una estética urbana que encaja perfectamente en el barrio.",
    whyItStandsOut:
      "El equilibrio entre calidad y precio es excelente. Sus tés con leche tienen una base de té de verdad, no de polvo, y se nota en cada trago.",
    recommendedOrder: "Taro Milk Tea con perlas golden",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: true,
      petFriendly: true,
      wheelchairAccessible: true,
    },
    scores: { quality: 84, price: 75, variety: 78, experience: 85, google: 86, popularity: 82 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:00", satOpen: "10:30", satClose: "22:00", sunOpen: "11:00", sunClose: "21:00" },
  },
  {
    name: "Yi Fang Taiwan Fruit Tea",
    slug: "yi-fang",
    brandName: "Yi Fang",
    isIndependent: false,
    address: "Gran Vía, 31",
    postalCode: "28013",
    neighborhood: "Gran Vía",
    latitude: 40.4205,
    longitude: -3.7020,
    googleMapsUrl: "https://maps.app.goo.gl/yifang-madrid",
    websiteUrl: "https://www.yifangtea.com",
    instagramUrl: "https://instagram.com/yifangfruttea",
    priceMin: 4.5,
    priceMax: 6.8,
    averagePrice: 5.5,
    editorSummary:
      "La cadena taiwanesa Yi Fang se distingue por usar ingredientes naturales: miel real, frutas frescas y tés de hoja. Su local en Gran Vía es una parada obligatoria.",
    whyItStandsOut:
      "Cada bebida se prepara con ingredientes visiblemente naturales. El té negro con miel y perlas de tapioca es un estándar de oro que otros intentan replicar.",
    recommendedOrder: "Brown Sugar Pearl Latte con leche de avena",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: false,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 90, price: 58, variety: 72, experience: 70, google: 87, popularity: 85 },
    hours: { weekdayOpen: "10:30", weekdayClose: "21:30", satOpen: "10:30", satClose: "22:00", sunOpen: "11:00", sunClose: "21:00" },
  },
  {
    name: "Feng Cha",
    slug: "feng-cha",
    brandName: "Feng Cha",
    isIndependent: false,
    address: "Calle de Fuencarral, 92",
    postalCode: "28004",
    neighborhood: "Malasaña",
    latitude: 40.4280,
    longitude: -3.7020,
    googleMapsUrl: "https://maps.app.goo.gl/fengcha-madrid",
    instagramUrl: "https://instagram.com/fengcha.madrid",
    priceMin: 4.0,
    priceMax: 6.5,
    averagePrice: 5.0,
    editorSummary:
      "Feng Cha aporta un toque artístico al bubble tea con sus bebidas en tonos pastel y su decoración de inspiración oriental. Muy popular entre el público joven de Fuencarral.",
    whyItStandsOut:
      "La presentación es obra de arte: bebidas en colores degradados servidas en vasos de diseño. El sabor acompaña, especialmente en su línea de tés florales.",
    recommendedOrder: "Butterfly Pea Flower Tea con lychee jelly",
    features: {
      veganOptions: true,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 80, price: 65, variety: 82, experience: 88, google: 80, popularity: 78 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:00", satOpen: "11:00", satClose: "21:30", sunOpen: "12:00", sunClose: "20:30" },
  },
  {
    name: "T-ZON",
    slug: "t-zon-usera",
    brandName: "T-ZON",
    isIndependent: false,
    address: "Calle de Marcelo Usera, 88",
    postalCode: "28026",
    neighborhood: "Usera",
    latitude: 40.3858,
    longitude: -3.7100,
    googleMapsUrl: "https://maps.app.goo.gl/tzon-usera",
    priceMin: 3.0,
    priceMax: 5.0,
    averagePrice: 3.8,
    editorSummary:
      "En el corazón de Usera, T-ZON ofrece bubble tea auténtico a precios que desafían toda competencia. Si buscas la experiencia más genuina, este es tu sitio.",
    whyItStandsOut:
      "Precios imbatibles y autenticidad a raudales. Las perlas de tapioca están siempre en su punto perfecto: tiernas por fuera, con un corazón ligeramente firme.",
    recommendedOrder: "Classic Milk Tea con tapioca negra grande",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: false,
      petFriendly: false,
      wheelchairAccessible: false,
    },
    scores: { quality: 82, price: 92, variety: 70, experience: 60, google: 78, popularity: 72 },
    hours: { weekdayOpen: "10:00", weekdayClose: "21:00", satOpen: "10:00", satClose: "21:30", sunOpen: "10:30", sunClose: "21:00" },
  },
  {
    name: "Boba Garden",
    slug: "boba-garden",
    isIndependent: true,
    address: "Calle de Velarde, 20",
    postalCode: "28004",
    neighborhood: "Malasaña",
    latitude: 40.4265,
    longitude: -3.7035,
    googleMapsUrl: "https://maps.app.goo.gl/bobagarden-madrid",
    instagramUrl: "https://instagram.com/bobagarden.madrid",
    priceMin: 4.5,
    priceMax: 6.5,
    averagePrice: 5.2,
    editorSummary:
      "Un pequeño oasis de bubble tea artesanal en Malasaña. Boba Garden apuesta por ingredientes locales y recetas propias que no encontrarás en ninguna cadena.",
    whyItStandsOut:
      "Todo se elabora en el local: desde los siropes de frutas de temporada hasta las perlas de tapioca caseras. El resultado es un sabor fresco e inconfundible.",
    recommendedOrder: "Matcha Latte con perlas caseras de brown sugar",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: true,
      petFriendly: true,
      wheelchairAccessible: false,
    },
    scores: { quality: 92, price: 62, variety: 65, experience: 90, google: 90, popularity: 75 },
    hours: { weekdayOpen: "10:00", weekdayClose: "20:30", satOpen: "10:00", satClose: "21:00", sunOpen: "11:00", sunClose: "20:00" },
  },
  {
    name: "Mooboo",
    slug: "mooboo-sol",
    brandName: "Mooboo",
    isIndependent: false,
    address: "Calle del Carmen, 16",
    postalCode: "28013",
    neighborhood: "Sol",
    latitude: 40.4185,
    longitude: -3.7035,
    googleMapsUrl: "https://maps.app.goo.gl/mooboo-madrid",
    websiteUrl: "https://www.mooboo.co.uk",
    instagramUrl: "https://instagram.com/mooboo.spain",
    priceMin: 4.0,
    priceMax: 6.2,
    averagePrice: 4.8,
    editorSummary:
      "Mooboo, la cadena británica de bubble tea, trae su estilo colorido y divertido al centro de Madrid. Una carta extensa con opciones para todos los gustos.",
    whyItStandsOut:
      "La variedad de toppings es una de las más amplias de Madrid: desde perlas clásicas hasta popping boba de múltiples sabores y jelly de coco.",
    recommendedOrder: "Oolong Milk Tea con popping boba de mango",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 78, price: 70, variety: 90, experience: 75, google: 80, popularity: 82 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:30", satOpen: "10:30", satClose: "22:00", sunOpen: "11:00", sunClose: "21:00" },
  },
  {
    name: "Happy Lemon",
    slug: "happy-lemon",
    brandName: "Happy Lemon",
    isIndependent: false,
    address: "Calle de Atocha, 34",
    postalCode: "28012",
    neighborhood: "Lavapiés",
    latitude: 40.4120,
    longitude: -3.6990,
    googleMapsUrl: "https://maps.app.goo.gl/happylemon-madrid",
    websiteUrl: "https://www.happylemon.com",
    priceMin: 4.0,
    priceMax: 6.0,
    averagePrice: 4.8,
    editorSummary:
      "Happy Lemon es sinónimo de fiabilidad. Su local en Atocha ofrece una carta amplia donde los rock salt cheese teas roban protagonismo.",
    whyItStandsOut:
      "El Rock Salt Cheese Tea es su firma: una combinación adictiva de té frío coronado con crema de queso con sal marina. Diferente a todo lo demás.",
    recommendedOrder: "Rock Salt Cheese Green Tea",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 83, price: 68, variety: 76, experience: 72, google: 82, popularity: 78 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:00", satOpen: "11:00", satClose: "21:30", sunOpen: "11:30", sunClose: "20:30" },
  },
  {
    name: "Tea Mellow",
    slug: "tea-mellow",
    isIndependent: true,
    address: "Calle de San Bernardo, 56",
    postalCode: "28015",
    neighborhood: "Universidad",
    latitude: 40.4255,
    longitude: -3.7085,
    googleMapsUrl: "https://maps.app.goo.gl/teamellow-madrid",
    instagramUrl: "https://instagram.com/tea.mellow",
    priceMin: 3.5,
    priceMax: 5.5,
    averagePrice: 4.2,
    editorSummary:
      "Tea Mellow es el refugio perfecto para estudiantes universitarios: bubble tea de calidad, wifi estable y un ambiente relajado donde puedes quedarte horas.",
    whyItStandsOut:
      "El mejor local de Madrid para trabajar o estudiar con un boba en la mano. Precios razonables, enchufes por doquier y un matcha latte que rivaliza con cualquier cadena.",
    recommendedOrder: "Matcha Boba Latte frío",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: false,
      petFriendly: true,
      wheelchairAccessible: true,
    },
    scores: { quality: 80, price: 80, variety: 68, experience: 85, google: 84, popularity: 70 },
    hours: { weekdayOpen: "09:00", weekdayClose: "21:00", satOpen: "10:00", satClose: "21:00", sunOpen: "10:00", sunClose: "20:00" },
  },
  {
    name: "Bobapop",
    slug: "bobapop-lavapies",
    brandName: "Bobapop",
    isIndependent: false,
    address: "Calle de Lavapiés, 32",
    postalCode: "28012",
    neighborhood: "Lavapiés",
    latitude: 40.4090,
    longitude: -3.7005,
    googleMapsUrl: "https://maps.app.goo.gl/bobapop-lavapies",
    instagramUrl: "https://instagram.com/bobapop.es",
    priceMin: 3.5,
    priceMax: 5.5,
    averagePrice: 4.2,
    editorSummary:
      "Bobapop encaja como anillo al dedo en el ecléctico barrio de Lavapiés. Propuesta colorida, precios ajustados y un rollo desenfadado que invita a repetir.",
    whyItStandsOut:
      "Sus slushies de frutas con boba son perfectos para el verano madrileño. El local pequeño pero acogedor rezuma personalidad.",
    recommendedOrder: "Mango Slush con popping boba de fresa",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: false,
    },
    scores: { quality: 76, price: 82, variety: 74, experience: 72, google: 78, popularity: 74 },
    hours: { weekdayOpen: "11:30", weekdayClose: "21:00", satOpen: "11:00", satClose: "22:00", sunOpen: "12:00", sunClose: "20:30" },
  },
  {
    name: "Gong Cha Madrid",
    slug: "gong-cha-madrid",
    brandName: "Gong Cha",
    isIndependent: false,
    address: "Calle de Fuencarral, 45",
    postalCode: "28004",
    neighborhood: "Chueca",
    latitude: 40.4225,
    longitude: -3.7010,
    googleMapsUrl: "https://maps.app.goo.gl/gongcha-madrid",
    websiteUrl: "https://www.gong-cha.es",
    instagramUrl: "https://instagram.com/gongcha.spain",
    priceMin: 4.5,
    priceMax: 7.0,
    averagePrice: 5.5,
    editorSummary:
      "Gong Cha no necesita presentación: es una de las mayores cadenas de bubble tea del mundo y su local en Fuencarral mantiene el estándar internacional.",
    whyItStandsOut:
      "La personalización es su fuerte: nivel de azúcar, hielo, tipo de leche y toppings. Puedes crear tu bebida perfecta en cada visita.",
    recommendedOrder: "Earl Grey Milk Tea con tapioca al 30% de azúcar",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 85, price: 58, variety: 88, experience: 78, google: 86, popularity: 90 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:30", satOpen: "10:30", satClose: "22:00", sunOpen: "11:00", sunClose: "21:00" },
  },
  {
    name: "Panda Boba",
    slug: "panda-boba",
    isIndependent: true,
    address: "Calle de Bravo Murillo, 150",
    postalCode: "28020",
    neighborhood: "Tetuán",
    latitude: 40.4530,
    longitude: -3.6970,
    googleMapsUrl: "https://maps.app.goo.gl/pandaboba-madrid",
    instagramUrl: "https://instagram.com/pandaboba.madrid",
    priceMin: 3.5,
    priceMax: 5.0,
    averagePrice: 4.0,
    editorSummary:
      "Panda Boba es un hallazgo en Tetuán: un local familiar que sirve bubble tea honesto a precios justos. Nada pretencioso, todo sabor.",
    whyItStandsOut:
      "Los tés con leche son cremosos y generosos. Las perlas siempre frescas, nunca reposadas. Una joya de barrio que merece más reconocimiento.",
    recommendedOrder: "Classic Pearl Milk Tea tamaño grande",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: false,
      photoFriendly: false,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 78, price: 85, variety: 60, experience: 68, google: 80, popularity: 60 },
    hours: { weekdayOpen: "10:30", weekdayClose: "20:30", satOpen: "10:30", satClose: "21:00", sunOpen: "11:00", sunClose: "20:00" },
  },
  {
    name: "Sweet Boba Lab",
    slug: "sweet-boba-lab",
    isIndependent: true,
    address: "Calle de Pez, 27",
    postalCode: "28004",
    neighborhood: "Malasaña",
    latitude: 40.4245,
    longitude: -3.7060,
    googleMapsUrl: "https://maps.app.goo.gl/sweetbobalab-madrid",
    instagramUrl: "https://instagram.com/sweetbobalab",
    priceMin: 4.8,
    priceMax: 7.0,
    averagePrice: 5.8,
    editorSummary:
      "Sweet Boba Lab es el laboratorio de sabores más creativo de Madrid. Cada mes lanzan ediciones limitadas que mezclan bubble tea con repostería japonesa.",
    whyItStandsOut:
      "La creatividad no tiene límites: han hecho boba con sabor a tarta de queso, tiramisú y hasta crema catalana. Las ediciones limitadas generan colas.",
    recommendedOrder: "Edición del mes (pregunta en el local)",
    features: {
      veganOptions: true,
      lactoseFreeOptions: false,
      glutenFreeOptions: false,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: true,
      wheelchairAccessible: true,
    },
    scores: { quality: 88, price: 50, variety: 92, experience: 90, google: 85, popularity: 88 },
    hours: { weekdayOpen: "12:00", weekdayClose: "21:00", satOpen: "11:00", satClose: "22:00", sunOpen: "11:00", sunClose: "20:00" },
  },
  {
    name: "TP Tea",
    slug: "tp-tea",
    brandName: "TP Tea",
    isIndependent: false,
    address: "Calle de Alcalá, 72",
    postalCode: "28009",
    neighborhood: "Retiro",
    latitude: 40.4215,
    longitude: -3.6880,
    googleMapsUrl: "https://maps.app.goo.gl/tptea-madrid",
    websiteUrl: "https://www.tp-tea.com",
    priceMin: 4.5,
    priceMax: 6.5,
    averagePrice: 5.2,
    editorSummary:
      "TP Tea, del grupo Chun Shui Tang (los inventores del bubble tea), trae la receta original a Madrid. Si quieres probar el boba tal como lo concibieron, es aquí.",
    whyItStandsOut:
      "Beber en TP Tea es viajar al origen: son herederos directos de la primera tienda que puso tapioca en el té. La calidad del té base es extraordinaria.",
    recommendedOrder: "Classic Pearl Milk Tea (la receta original)",
    features: {
      veganOptions: false,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 92, price: 60, variety: 70, experience: 82, google: 88, popularity: 78 },
    hours: { weekdayOpen: "10:30", weekdayClose: "21:00", satOpen: "10:30", satClose: "21:30", sunOpen: "11:00", sunClose: "20:30" },
  },
  {
    name: "Cha-Cha Matcha",
    slug: "cha-cha-matcha",
    isIndependent: true,
    address: "Calle de Augusto Figueroa, 18",
    postalCode: "28004",
    neighborhood: "Chueca",
    latitude: 40.4220,
    longitude: -3.6965,
    googleMapsUrl: "https://maps.app.goo.gl/chachamatcha-madrid",
    instagramUrl: "https://instagram.com/chachamatcha.mad",
    priceMin: 4.5,
    priceMax: 6.8,
    averagePrice: 5.5,
    editorSummary:
      "Cha-Cha Matcha se especializa en bubble teas a base de matcha ceremonial japonés. Si eres fan del té verde, este es tu templo en Madrid.",
    whyItStandsOut:
      "El matcha es de grado ceremonial, no culinario: se nota en el color vibrante y el sabor umami. Las opciones con leche de avena son especialmente buenas.",
    recommendedOrder: "Ceremonial Matcha Boba con leche de avena",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 90, price: 55, variety: 55, experience: 88, google: 86, popularity: 72 },
    hours: { weekdayOpen: "09:30", weekdayClose: "20:30", satOpen: "10:00", satClose: "21:00", sunOpen: "10:00", sunClose: "20:00" },
  },
  {
    name: "Chang Tea Bar",
    slug: "chang-tea-bar",
    isIndependent: true,
    address: "Calle de la Abada, 12",
    postalCode: "28013",
    neighborhood: "Callao",
    latitude: 40.4198,
    longitude: -3.7045,
    googleMapsUrl: "https://maps.app.goo.gl/changtea-madrid",
    priceMin: 3.8,
    priceMax: 5.5,
    averagePrice: 4.5,
    editorSummary:
      "Chang Tea Bar es un local discreto junto a Callao que destaca por su bubble tea taiwanés tradicional. Sin adornos, sin pretensiones, solo buen té.",
    whyItStandsOut:
      "El enfoque purista es refrescante: pocos sabores pero ejecutados con precisión. El oolong milk tea es de los mejores que hemos probado en España.",
    recommendedOrder: "Oolong Milk Tea con tapioca",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: false,
      wifi: false,
      studyFriendly: false,
      photoFriendly: false,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 86, price: 75, variety: 48, experience: 62, google: 82, popularity: 65 },
    hours: { weekdayOpen: "11:00", weekdayClose: "20:30", satOpen: "11:00", satClose: "21:00", sunOpen: null, sunClose: null },
  },
  {
    name: "Latteó Bubble Tea",
    slug: "latteo-bubble-tea",
    isIndependent: true,
    address: "Calle de Narváez, 21",
    postalCode: "28009",
    neighborhood: "Ibiza",
    latitude: 40.4198,
    longitude: -3.6812,
    googleMapsUrl: "https://maps.app.goo.gl/latteo-madrid",
    instagramUrl: "https://instagram.com/latteo.bubbletea",
    priceMin: 4.0,
    priceMax: 6.0,
    averagePrice: 4.8,
    editorSummary:
      "Latteó fusiona café de especialidad con bubble tea en el barrio de Ibiza. Un concepto híbrido que funciona sorprendentemente bien.",
    whyItStandsOut:
      "El Dirty Boba (espresso sobre boba milk) es su creación estrella: la mejor fusión café-boba que hemos probado en Madrid.",
    recommendedOrder: "Dirty Boba (espresso + brown sugar milk + tapioca)",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: true,
      petFriendly: true,
      wheelchairAccessible: true,
    },
    scores: { quality: 84, price: 68, variety: 72, experience: 82, google: 84, popularity: 74 },
    hours: { weekdayOpen: "08:30", weekdayClose: "20:30", satOpen: "09:30", satClose: "21:00", sunOpen: "10:00", sunClose: "20:00" },
  },
];

// ──── BARCELONA SHOPS ────────────────────────────────────────────────────────

const barcelonaShops: ShopSeed[] = [
  {
    name: "Gong Cha Barcelona",
    slug: "gong-cha-barcelona",
    brandName: "Gong Cha",
    isIndependent: false,
    address: "La Rambla, 78",
    postalCode: "08002",
    neighborhood: "Raval",
    latitude: 41.3802,
    longitude: 2.1734,
    googleMapsUrl: "https://maps.app.goo.gl/gongcha-bcn",
    websiteUrl: "https://www.gong-cha.es",
    instagramUrl: "https://instagram.com/gongcha.spain",
    priceMin: 4.5,
    priceMax: 7.0,
    averagePrice: 5.5,
    editorSummary:
      "Gong Cha ocupa un local privilegiado en La Rambla. La personalización total de sus bebidas lo convierte en una parada imprescindible para turistas y locales por igual.",
    whyItStandsOut:
      "El volumen de personalización es inigualable: cinco niveles de azúcar, cuatro de hielo, múltiples bases de té y una decena de toppings.",
    recommendedOrder: "Dirty Brown Sugar Milk Tea al 30% de azúcar",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 84, price: 58, variety: 90, experience: 78, google: 85, popularity: 92 },
    hours: { weekdayOpen: "10:30", weekdayClose: "22:00", satOpen: "10:00", satClose: "22:30", sunOpen: "10:30", sunClose: "21:30" },
  },
  {
    name: "Tiger Sugar Barcelona",
    slug: "tiger-sugar-barcelona",
    brandName: "Tiger Sugar",
    isIndependent: false,
    address: "Carrer de Pelai, 28",
    postalCode: "08001",
    neighborhood: "Raval",
    latitude: 41.3838,
    longitude: 2.1688,
    googleMapsUrl: "https://maps.app.goo.gl/tigersugar-bcn",
    instagramUrl: "https://instagram.com/tigersugarspain",
    priceMin: 5.0,
    priceMax: 7.0,
    averagePrice: 5.8,
    editorSummary:
      "Tiger Sugar aterriza en Barcelona con su fotogénica firma de rayas de azúcar moreno. El local cerca de Plaça Catalunya es imán de influencers.",
    whyItStandsOut:
      "Nadie hace el brown sugar boba tan fotogénico. Las vetas oscuras sobre la leche blanca son hipnóticas y el sabor a caramelo intenso es adictivo.",
    recommendedOrder: "Brown Sugar Boba Milk con crema extra",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: false,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 84, price: 55, variety: 48, experience: 82, google: 86, popularity: 94 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:30", satOpen: "11:00", satClose: "22:00", sunOpen: "11:30", sunClose: "21:00" },
  },
  {
    name: "CoCo Barcelona",
    slug: "coco-barcelona",
    brandName: "CoCo",
    isIndependent: false,
    address: "Passeig de Gràcia, 55",
    postalCode: "08007",
    neighborhood: "Eixample",
    latitude: 41.3935,
    longitude: 2.1645,
    googleMapsUrl: "https://maps.app.goo.gl/coco-bcn",
    websiteUrl: "https://www.coco-tea.com",
    priceMin: 3.8,
    priceMax: 5.9,
    averagePrice: 4.5,
    editorSummary:
      "CoCo en Passeig de Gràcia mantiene el estándar de la cadena taiwanesa: rápido, fiable y con una carta que no abruma pero siempre satisface.",
    whyItStandsOut:
      "La relación calidad-precio es de las mejores del Eixample. Sus slushies de fruta son perfectos para el calor barcelonés.",
    recommendedOrder: "Passion Fruit QQ con tapioca y jelly",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 80, price: 75, variety: 84, experience: 72, google: 82, popularity: 86 },
    hours: { weekdayOpen: "10:30", weekdayClose: "21:30", satOpen: "10:30", satClose: "22:00", sunOpen: "11:00", sunClose: "21:00" },
  },
  {
    name: "Tsaocaa Barcelona",
    slug: "tsaocaa-barcelona",
    brandName: "Tsaocaa",
    isIndependent: false,
    address: "Carrer d'Aribau, 68",
    postalCode: "08011",
    neighborhood: "Eixample",
    latitude: 41.3885,
    longitude: 2.1595,
    googleMapsUrl: "https://maps.app.goo.gl/tsaocaa-bcn",
    instagramUrl: "https://instagram.com/tsaocaa_spain",
    priceMin: 4.0,
    priceMax: 6.5,
    averagePrice: 5.0,
    editorSummary:
      "Tsaocaa llega al Eixample con sus fruit teas de fruta fresca que ya triunfan en Madrid. El local amplio y luminoso es una bienvenida sorpresa.",
    whyItStandsOut:
      "Fruta cortada al momento y una selección de tés premium que se nota en cada sorbo. El mango sago es un postre líquido espectacular.",
    recommendedOrder: "Fresh Mango Sago con tapioca de coco",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 86, price: 65, variety: 82, experience: 80, google: 84, popularity: 78 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:00", satOpen: "11:00", satClose: "21:30", sunOpen: "12:00", sunClose: "20:30" },
  },
  {
    name: "Bubbleology",
    slug: "bubbleology",
    brandName: "Bubbleology",
    isIndependent: false,
    address: "Carrer del Portal de l'Àngel, 15",
    postalCode: "08002",
    neighborhood: "Gòtic",
    latitude: 41.3848,
    longitude: 2.1740,
    googleMapsUrl: "https://maps.app.goo.gl/bubbleology-bcn",
    websiteUrl: "https://www.bubbleology.co.uk",
    instagramUrl: "https://instagram.com/bubbleology",
    priceMin: 4.5,
    priceMax: 6.5,
    averagePrice: 5.2,
    editorSummary:
      "Bubbleology, la marca británica con estética de laboratorio, ocupa una ubicación inmejorable en Portal de l'Àngel. Sus cocktail teas son únicos en Barcelona.",
    whyItStandsOut:
      "La estética de laboratorio científico (tubos de ensayo, fórmulas en la pared) convierte pedir un boba en una experiencia temática divertida.",
    recommendedOrder: "Mojitea (cocktail tea de mojito sin alcohol) con boba",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 78, price: 62, variety: 85, experience: 88, google: 80, popularity: 84 },
    hours: { weekdayOpen: "10:30", weekdayClose: "21:30", satOpen: "10:00", satClose: "22:00", sunOpen: "11:00", sunClose: "21:00" },
  },
  {
    name: "Mango Mango",
    slug: "mango-mango-bcn",
    isIndependent: true,
    address: "Carrer de Joaquín Costa, 35",
    postalCode: "08001",
    neighborhood: "Raval",
    latitude: 41.3825,
    longitude: 2.1660,
    googleMapsUrl: "https://maps.app.goo.gl/mangomango-bcn",
    instagramUrl: "https://instagram.com/mangomango.bcn",
    priceMin: 3.5,
    priceMax: 5.5,
    averagePrice: 4.2,
    editorSummary:
      "Mango Mango es una joya escondida en el Raval que se especializa en bebidas de frutas tropicales con tapioca. Sabor auténtico y precios honestos.",
    whyItStandsOut:
      "Las bebidas de frutas tropicales son explosivas: mango, maracuyá, lychee, todo fresco. El local humilde esconde sabores que rivalizan con las grandes cadenas.",
    recommendedOrder: "Triple Tropical (mango, maracuyá y lychee) con tapioca",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: false,
      petFriendly: false,
      wheelchairAccessible: false,
    },
    scores: { quality: 82, price: 85, variety: 70, experience: 65, google: 82, popularity: 70 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:00", satOpen: "11:00", satClose: "21:30", sunOpen: "12:00", sunClose: "20:00" },
  },
  {
    name: "Sweet Lab BCN",
    slug: "sweet-lab-bcn",
    isIndependent: true,
    address: "Carrer de Verdi, 40",
    postalCode: "08012",
    neighborhood: "Gràcia",
    latitude: 41.4045,
    longitude: 2.1565,
    googleMapsUrl: "https://maps.app.goo.gl/sweetlab-bcn",
    instagramUrl: "https://instagram.com/sweetlab.bcn",
    priceMin: 4.8,
    priceMax: 7.0,
    averagePrice: 5.5,
    editorSummary:
      "Sweet Lab es el taller creativo de boba en Gràcia. Sus creaciones de autor cambian con las estaciones y siempre sorprenden.",
    whyItStandsOut:
      "Las ediciones estacionales son una razón para volver cada mes: han logrado sabores como horchata boba, crema catalana tea y turrón milk tea en Navidad.",
    recommendedOrder: "Creación estacional del mes",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: false,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: true,
      petFriendly: true,
      wheelchairAccessible: true,
    },
    scores: { quality: 90, price: 52, variety: 88, experience: 90, google: 88, popularity: 82 },
    hours: { weekdayOpen: "10:30", weekdayClose: "20:30", satOpen: "10:00", satClose: "21:30", sunOpen: "10:30", sunClose: "20:00" },
  },
  {
    name: "Heekcaa Barcelona",
    slug: "heekcaa-barcelona",
    brandName: "Heekcaa",
    isIndependent: false,
    address: "Carrer de Ferran, 32",
    postalCode: "08002",
    neighborhood: "Gòtic",
    latitude: 41.3810,
    longitude: 2.1760,
    googleMapsUrl: "https://maps.app.goo.gl/heekcaa-bcn",
    instagramUrl: "https://instagram.com/heekcaa_spain",
    priceMin: 4.5,
    priceMax: 6.5,
    averagePrice: 5.2,
    editorSummary:
      "El cheese tea de Heekcaa ha conquistado el Gòtic. Su crema de queso sobre tés premium es adictiva y el local tiene un encanto especial.",
    whyItStandsOut:
      "La crema de queso es densa, ligeramente salada y con un toque dulce que complementa cualquier base de té. En Barcelona, nadie lo hace mejor.",
    recommendedOrder: "Peach Oolong Cheese Tea",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 87, price: 62, variety: 74, experience: 80, google: 84, popularity: 88 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:30", satOpen: "10:30", satClose: "22:00", sunOpen: "11:00", sunClose: "21:00" },
  },
  {
    name: "T-Express",
    slug: "t-express",
    isIndependent: true,
    address: "Carrer de Blai, 18",
    postalCode: "08004",
    neighborhood: "Poble Sec",
    latitude: 41.3730,
    longitude: 2.1638,
    googleMapsUrl: "https://maps.app.goo.gl/texpress-bcn",
    priceMin: 3.2,
    priceMax: 5.0,
    averagePrice: 3.8,
    editorSummary:
      "T-Express es la opción económica del Poble Sec: bubble tea rápido, barato y sorprendentemente bueno para su precio.",
    whyItStandsOut:
      "Los precios más bajos del centro de Barcelona sin sacrificar calidad. El servicio es ultrarrápido y las perlas siempre están en su punto.",
    recommendedOrder: "Jasmine Milk Tea con perlas grandes",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: false,
      wifi: false,
      studyFriendly: false,
      photoFriendly: false,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 74, price: 92, variety: 60, experience: 55, google: 76, popularity: 68 },
    hours: { weekdayOpen: "10:00", weekdayClose: "21:00", satOpen: "10:00", satClose: "21:30", sunOpen: "11:00", sunClose: "20:00" },
  },
  {
    name: "Boba Guys BCN",
    slug: "boba-guys-bcn",
    isIndependent: true,
    address: "Carrer de Torrent de l'Olla, 55",
    postalCode: "08012",
    neighborhood: "Gràcia",
    latitude: 41.4020,
    longitude: 2.1580,
    googleMapsUrl: "https://maps.app.goo.gl/bobaguys-bcn",
    instagramUrl: "https://instagram.com/bobaguys.bcn",
    priceMin: 4.5,
    priceMax: 6.5,
    averagePrice: 5.2,
    editorSummary:
      "Boba Guys apuesta por ingredientes orgánicos y leches vegetales premium en Gràcia. El paraíso para los amantes del boba conscientes con lo que consumen.",
    whyItStandsOut:
      "Todo orgánico: tés de origen único, leche de avena Oatly, siropes artesanales. Para quien busca un boba limpio y premium, es la mejor opción.",
    recommendedOrder: "Single Origin Assam Milk Tea con avena y tapioca",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: true,
      petFriendly: true,
      wheelchairAccessible: true,
    },
    scores: { quality: 92, price: 55, variety: 65, experience: 88, google: 90, popularity: 76 },
    hours: { weekdayOpen: "09:30", weekdayClose: "20:30", satOpen: "10:00", satClose: "21:00", sunOpen: "10:00", sunClose: "20:00" },
  },
  {
    name: "Yi Fang Barcelona",
    slug: "yi-fang-barcelona",
    brandName: "Yi Fang",
    isIndependent: false,
    address: "Rambla de Catalunya, 42",
    postalCode: "08007",
    neighborhood: "Eixample",
    latitude: 41.3910,
    longitude: 2.1635,
    googleMapsUrl: "https://maps.app.goo.gl/yifang-bcn",
    websiteUrl: "https://www.yifangtea.com",
    priceMin: 4.5,
    priceMax: 6.8,
    averagePrice: 5.5,
    editorSummary:
      "Yi Fang eleva el estándar en el Eixample con sus ingredientes naturales de Taiwan. La miel auténtica y las frutas frescas marcan la diferencia.",
    whyItStandsOut:
      "Cuando dicen natural, lo dicen en serio: miel real, frutas recién cortadas, tés de hoja. Es el anti-polvo-artificial por excelencia.",
    recommendedOrder: "Aiyu Lemon with Chia Seeds",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: false,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 90, price: 58, variety: 72, experience: 72, google: 86, popularity: 82 },
    hours: { weekdayOpen: "10:30", weekdayClose: "21:30", satOpen: "10:30", satClose: "22:00", sunOpen: "11:00", sunClose: "21:00" },
  },
  {
    name: "Feng Cha Barcelona",
    slug: "feng-cha-barcelona",
    brandName: "Feng Cha",
    isIndependent: false,
    address: "Carrer del Consell de Cent, 280",
    postalCode: "08011",
    neighborhood: "Eixample",
    latitude: 41.3880,
    longitude: 2.1620,
    googleMapsUrl: "https://maps.app.goo.gl/fengcha-bcn",
    instagramUrl: "https://instagram.com/fengcha.bcn",
    priceMin: 4.0,
    priceMax: 6.5,
    averagePrice: 5.0,
    editorSummary:
      "Feng Cha trae su estética de colores pastel y tés florales al Eixample. Un local que podría ser un set de fotos de Instagram.",
    whyItStandsOut:
      "Los tés de flor de mariposa cambian de color al añadir limón: el efecto wow está garantizado y el sabor floral es delicado y auténtico.",
    recommendedOrder: "Butterfly Pea Lemon Tea con aloe vera",
    features: {
      veganOptions: true,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 80, price: 65, variety: 80, experience: 86, google: 80, popularity: 76 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:00", satOpen: "11:00", satClose: "21:30", sunOpen: "12:00", sunClose: "20:30" },
  },
  {
    name: "Boba House",
    slug: "boba-house",
    isIndependent: true,
    address: "Carrer de Rec, 24",
    postalCode: "08003",
    neighborhood: "Born",
    latitude: 41.3855,
    longitude: 2.1825,
    googleMapsUrl: "https://maps.app.goo.gl/bobahouse-bcn",
    instagramUrl: "https://instagram.com/bobahouse.bcn",
    priceMin: 4.2,
    priceMax: 6.0,
    averagePrice: 5.0,
    editorSummary:
      "Boba House combina boba con dulces asiáticos en el Born. Un espacio íntimo donde cada bebida se prepara con mimo artesanal.",
    whyItStandsOut:
      "Los mochi frescos que acompañan al boba son hechos a mano en el local. La combinación mochi + boba es una experiencia completa.",
    recommendedOrder: "Hojicha Latte con tapioca + set de 3 mochi",
    features: {
      veganOptions: true,
      lactoseFreeOptions: false,
      glutenFreeOptions: false,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: false,
    },
    scores: { quality: 88, price: 64, variety: 68, experience: 85, google: 86, popularity: 74 },
    hours: { weekdayOpen: "10:00", weekdayClose: "20:00", satOpen: "10:00", satClose: "21:00", sunOpen: "10:30", sunClose: "19:30" },
  },
  {
    name: "Chatime Barcelona",
    slug: "chatime-barcelona",
    brandName: "Chatime",
    isIndependent: false,
    address: "Carrer de Pau Claris, 90",
    postalCode: "08010",
    neighborhood: "Eixample",
    latitude: 41.3920,
    longitude: 2.1690,
    googleMapsUrl: "https://maps.app.goo.gl/chatime-bcn",
    websiteUrl: "https://www.chatime.com",
    priceMin: 4.0,
    priceMax: 6.5,
    averagePrice: 5.0,
    editorSummary:
      "Chatime, una de las cadenas más grandes del mundo, ofrece consistencia taiwanesa en pleno Eixample. El local moderno y amplio es perfecto para una pausa.",
    whyItStandsOut:
      "La experiencia es fiable y reconfortante: sabes exactamente qué esperar y siempre cumple. Su Hazelnut Chocolate es un postre líquido irresistible.",
    recommendedOrder: "Hazelnut Chocolate Milk Tea con perlas",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 82, price: 65, variety: 84, experience: 76, google: 82, popularity: 80 },
    hours: { weekdayOpen: "10:30", weekdayClose: "21:30", satOpen: "10:30", satClose: "22:00", sunOpen: "11:00", sunClose: "21:00" },
  },
  {
    name: "Bobaful",
    slug: "bobaful",
    isIndependent: true,
    address: "Carrer de la Diputació, 215",
    postalCode: "08011",
    neighborhood: "Eixample",
    latitude: 41.3870,
    longitude: 2.1610,
    googleMapsUrl: "https://maps.app.goo.gl/bobaful-bcn",
    instagramUrl: "https://instagram.com/bobaful.bcn",
    priceMin: 3.8,
    priceMax: 5.5,
    averagePrice: 4.5,
    editorSummary:
      "Bobaful es la apuesta económica del Eixample con boba de calidad y un diseño colorido que levanta el ánimo. Perfecto para el día a día.",
    whyItStandsOut:
      "La mejor relación calidad-precio del Eixample. El local es pequeño pero está decorado con tanto color que es imposible no sonreír.",
    recommendedOrder: "Taro Milk Tea tamaño grande con extra perlas",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 76, price: 80, variety: 72, experience: 74, google: 78, popularity: 72 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:00", satOpen: "11:00", satClose: "21:30", sunOpen: "12:00", sunClose: "20:30" },
  },
  {
    name: "Tea Top Barcelona",
    slug: "tea-top-barcelona",
    brandName: "Tea Top",
    isIndependent: false,
    address: "Avinguda del Portal de l'Àngel, 28",
    postalCode: "08002",
    neighborhood: "Gòtic",
    latitude: 41.3850,
    longitude: 2.1735,
    googleMapsUrl: "https://maps.app.goo.gl/teatop-bcn",
    priceMin: 4.0,
    priceMax: 6.0,
    averagePrice: 4.8,
    editorSummary:
      "Tea Top, la cadena taiwanesa fundada en 2005, ofrece una carta centrada en tés de alta calidad. Su Tie Guan Yin boba es revelación.",
    whyItStandsOut:
      "A diferencia de otras cadenas, Tea Top se centra en la calidad del té base: oolongs, jasmines y verdes de hoja suelta que se notan desde el primer sorbo.",
    recommendedOrder: "Tie Guan Yin Pearl Milk Tea",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 88, price: 68, variety: 75, experience: 72, google: 84, popularity: 76 },
    hours: { weekdayOpen: "10:30", weekdayClose: "21:30", satOpen: "10:30", satClose: "22:00", sunOpen: "11:00", sunClose: "21:00" },
  },
  {
    name: "Cha Cha Boba",
    slug: "cha-cha-boba",
    isIndependent: true,
    address: "Carrer del Parlament, 42",
    postalCode: "08015",
    neighborhood: "Sant Antoni",
    latitude: 41.3775,
    longitude: 2.1585,
    googleMapsUrl: "https://maps.app.goo.gl/chachaboba-bcn",
    instagramUrl: "https://instagram.com/chachaboba.bcn",
    priceMin: 4.0,
    priceMax: 6.0,
    averagePrice: 4.8,
    editorSummary:
      "Cha Cha Boba une bubble tea con la energía del mercado de Sant Antoni. Un local acogedor con terraza que atrae a vecinos del barrio.",
    whyItStandsOut:
      "La terraza es la estrella: disfrutar un boba viendo pasar la vida del barrio de Sant Antoni es un placer sencillo pero maravilloso.",
    recommendedOrder: "Rose Oolong Milk Tea con tapioca",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: true,
      wheelchairAccessible: true,
    },
    scores: { quality: 82, price: 70, variety: 68, experience: 84, google: 82, popularity: 70 },
    hours: { weekdayOpen: "10:00", weekdayClose: "21:00", satOpen: "10:00", satClose: "22:00", sunOpen: "10:30", sunClose: "20:30" },
  },
  {
    name: "One Zo Barcelona",
    slug: "one-zo-barcelona",
    brandName: "One Zo",
    isIndependent: false,
    address: "Carrer de Balmes, 78",
    postalCode: "08007",
    neighborhood: "Eixample",
    latitude: 41.3915,
    longitude: 2.1590,
    googleMapsUrl: "https://maps.app.goo.gl/onezo-bcn",
    websiteUrl: "https://www.onezo.com.tw",
    priceMin: 4.5,
    priceMax: 6.5,
    averagePrice: 5.2,
    editorSummary:
      "One Zo es famosa mundialmente por sus perlas de tapioca artesanales hechas al momento. Si eres fan de las perlas, no encontrarás nada mejor.",
    whyItStandsOut:
      "Las perlas se hacen delante de ti con ingredientes naturales (taro, matcha, brown sugar). La frescura marca una diferencia abismal.",
    recommendedOrder: "Brown Sugar Pearl Milk con perlas tricolor",
    features: {
      veganOptions: true,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 90, price: 60, variety: 72, experience: 85, google: 88, popularity: 84 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:00", satOpen: "11:00", satClose: "21:30", sunOpen: "11:30", sunClose: "20:30" },
  },
  {
    name: "Boba Boba BCN",
    slug: "boba-boba-bcn",
    isIndependent: true,
    address: "Carrer de Provença, 268",
    postalCode: "08008",
    neighborhood: "Eixample",
    latitude: 41.3955,
    longitude: 2.1625,
    googleMapsUrl: "https://maps.app.goo.gl/bobaboba-bcn",
    priceMin: 3.5,
    priceMax: 5.5,
    averagePrice: 4.2,
    editorSummary:
      "Boba Boba es un secreto del Eixample Dret: precios contenidos, carta sencilla pero bien ejecutada y un ambiente de barrio que engancha.",
    whyItStandsOut:
      "La sencillez es su fuerza: pocos sabores pero todos consistentes. Las perlas de tapioca son de las más tiernas de Barcelona.",
    recommendedOrder: "Classic Black Tea Boba tamaño grande",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: false,
      photoFriendly: false,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 78, price: 82, variety: 55, experience: 70, google: 80, popularity: 64 },
    hours: { weekdayOpen: "11:00", weekdayClose: "20:30", satOpen: "11:00", satClose: "21:00", sunOpen: null, sunClose: null },
  },
  {
    name: "Boba Planet",
    slug: "boba-planet",
    isIndependent: true,
    address: "Carrer de Blai, 40",
    postalCode: "08004",
    neighborhood: "Poble Sec",
    latitude: 41.3735,
    longitude: 2.1645,
    googleMapsUrl: "https://maps.app.goo.gl/bobaplanet-bcn",
    priceMin: 3.5,
    priceMax: 5.5,
    averagePrice: 4.5,
    editorSummary:
      "Boba Planet aterriza en la animada Carrer de Blai con una propuesta fresca: bubble teas frutales con base de té verde japonés y toppings artesanales hechos en casa cada mañana.",
    whyItStandsOut:
      "Los toppings caseros marcan la diferencia: perlas de lychee, gelatina de yuzu y crema de coco que no encontrarás en cadenas. El local pequeño pero luminoso invita a probar algo nuevo cada visita.",
    recommendedOrder: "Yuzu Green Tea con perlas de lychee y espuma de coco",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 82, price: 78, variety: 74, experience: 76, google: 82, popularity: 70 },
    hours: { weekdayOpen: "11:00", weekdayClose: "21:00", satOpen: "11:00", satClose: "22:00", sunOpen: "12:00", sunClose: "20:00" },
  },
];

// ──── VIGO SHOPS ─────────────────────────────────────────────────────────────

const vigoShops: ShopSeed[] = [
  {
    name: "Boba Vigo",
    slug: "boba-vigo",
    isIndependent: true,
    address: "Rúa do Príncipe, 38",
    postalCode: "36202",
    neighborhood: "Casco Vello",
    latitude: 42.2380,
    longitude: -8.7245,
    googleMapsUrl: "https://maps.app.goo.gl/bobavigo",
    instagramUrl: "https://instagram.com/boba.vigo",
    priceMin: 3.5,
    priceMax: 5.5,
    averagePrice: 4.2,
    editorSummary:
      "Boba Vigo fue el primer local especializado en bubble tea de la ciudad. Pionero y referente, sigue siendo la primera recomendación para cualquier vigués.",
    whyItStandsOut:
      "El mérito de abrir camino: introdujeron el concepto en Vigo y han sabido mantener la calidad y actualizar la carta sin perder su esencia.",
    recommendedOrder: "Taro Milk Tea con perlas de tapioca",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 84, price: 78, variety: 72, experience: 80, google: 84, popularity: 82 },
    hours: { weekdayOpen: "11:00", weekdayClose: "20:30", satOpen: "11:00", satClose: "21:00", sunOpen: "12:00", sunClose: "20:00" },
  },
  {
    name: "Té de Burbujas",
    slug: "te-de-burbujas",
    isIndependent: true,
    address: "Gran Vía de Vigo, 12",
    postalCode: "36204",
    neighborhood: "Gran Vía",
    latitude: 42.2350,
    longitude: -8.7130,
    googleMapsUrl: "https://maps.app.goo.gl/tedeburbujas-vigo",
    instagramUrl: "https://instagram.com/tedeburbujas.vigo",
    priceMin: 3.8,
    priceMax: 5.8,
    averagePrice: 4.5,
    editorSummary:
      "Té de Burbujas apuesta por la claridad: nombre directo, producto directo. Un local luminoso en Gran Vía con una carta bien pensada.",
    whyItStandsOut:
      "La mejor selección de toppings de Vigo: perlas clásicas, popping boba, jelly de coco, aloe vera, pudding. La personalización rivaliza con las cadenas de Madrid.",
    recommendedOrder: "Brown Sugar Milk Tea con pudding y perlas",
    features: {
      veganOptions: true,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 80, price: 72, variety: 82, experience: 76, google: 80, popularity: 74 },
    hours: { weekdayOpen: "11:00", weekdayClose: "20:30", satOpen: "11:00", satClose: "21:00", sunOpen: null, sunClose: null },
  },
  {
    name: "Mochi & Boba",
    slug: "mochi-and-boba",
    isIndependent: true,
    address: "Rúa de Urzáiz, 58",
    postalCode: "36201",
    neighborhood: "Centro",
    latitude: 42.2365,
    longitude: -8.7195,
    googleMapsUrl: "https://maps.app.goo.gl/mochiboba-vigo",
    instagramUrl: "https://instagram.com/mochi.boba.vigo",
    priceMin: 4.0,
    priceMax: 6.0,
    averagePrice: 4.8,
    editorSummary:
      "Mochi & Boba combina repostería japonesa con bubble tea en el corazón comercial de Vigo. Un concepto que ha calado hondo entre el público joven.",
    whyItStandsOut:
      "Los mochi rellenos artesanales acompañados de un boba crean una experiencia completa. El local es pequeño pero exquisitamente decorado.",
    recommendedOrder: "Matcha Latte Boba + set de 2 mochi de fresa",
    features: {
      veganOptions: true,
      lactoseFreeOptions: false,
      glutenFreeOptions: false,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: false,
    },
    scores: { quality: 86, price: 65, variety: 68, experience: 85, google: 86, popularity: 78 },
    hours: { weekdayOpen: "11:00", weekdayClose: "20:00", satOpen: "11:00", satClose: "21:00", sunOpen: "12:00", sunClose: "19:30" },
  },
  {
    name: "Bubble Galicia",
    slug: "bubble-galicia",
    isIndependent: true,
    address: "Rúa de Rosalía de Castro, 22",
    postalCode: "36201",
    neighborhood: "Centro",
    latitude: 42.2370,
    longitude: -8.7220,
    googleMapsUrl: "https://maps.app.goo.gl/bubblegalicia-vigo",
    instagramUrl: "https://instagram.com/bubble.galicia",
    priceMin: 3.5,
    priceMax: 5.0,
    averagePrice: 4.0,
    editorSummary:
      "Bubble Galicia le pone acento local al bubble tea: ingredientes gallegos como miel de eucalipto y leche fresca de vaca de la zona dan un toque único.",
    whyItStandsOut:
      "La apuesta por producto local es genuina: miel gallega, leche de ganaderos cercanos y mermeladas artesanales en sus fruit teas. Sabor a Galicia en cada vaso.",
    recommendedOrder: "Honey Milk Tea con miel de eucalipto gallega",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: false,
      petFriendly: true,
      wheelchairAccessible: true,
    },
    scores: { quality: 88, price: 82, variety: 60, experience: 78, google: 82, popularity: 70 },
    hours: { weekdayOpen: "10:00", weekdayClose: "20:00", satOpen: "10:00", satClose: "20:30", sunOpen: null, sunClose: null },
  },
  {
    name: "Ocha Tea House",
    slug: "ocha-tea-house",
    isIndependent: true,
    address: "Rúa de Colón, 15",
    postalCode: "36201",
    neighborhood: "Centro",
    latitude: 42.2385,
    longitude: -8.7205,
    googleMapsUrl: "https://maps.app.goo.gl/ochatea-vigo",
    priceMin: 3.5,
    priceMax: 5.5,
    averagePrice: 4.2,
    editorSummary:
      "Ocha Tea House es una casa de té reconvertida que ha incorporado el bubble tea a su carta de tés japoneses y chinos. Tradición con un toque moderno.",
    whyItStandsOut:
      "La calidad del té base es excepcional: importan directamente de Japón y China. El ambiente zen y tranquilo es perfecto para desconectar.",
    recommendedOrder: "Gyokuro Milk Tea con perlas de matcha",
    features: {
      veganOptions: true,
      lactoseFreeOptions: true,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: true,
      photoFriendly: true,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 90, price: 72, variety: 65, experience: 88, google: 86, popularity: 65 },
    hours: { weekdayOpen: "10:00", weekdayClose: "20:00", satOpen: "10:00", satClose: "20:30", sunOpen: "11:00", sunClose: "19:00" },
  },
  {
    name: "Happy Boba Vigo",
    slug: "happy-boba-vigo",
    isIndependent: true,
    address: "Rúa da Cesteiros, 8",
    postalCode: "36202",
    neighborhood: "Casco Vello",
    latitude: 42.2375,
    longitude: -8.7260,
    googleMapsUrl: "https://maps.app.goo.gl/happyboba-vigo",
    priceMin: 3.0,
    priceMax: 4.5,
    averagePrice: 3.5,
    editorSummary:
      "Happy Boba es el local más económico de Vigo: precios de barrio para un producto digno. Perfecto para estudiantes y descubridores del boba.",
    whyItStandsOut:
      "Los precios más bajos de Vigo sin sensación de estar sacrificando calidad. Ideal para quienes quieren probar el bubble tea sin gastar mucho.",
    recommendedOrder: "Classic Milk Tea tamaño grande",
    features: {
      veganOptions: false,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: false,
      wifi: false,
      studyFriendly: false,
      photoFriendly: false,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 70, price: 92, variety: 55, experience: 58, google: 74, popularity: 62 },
    hours: { weekdayOpen: "11:00", weekdayClose: "20:00", satOpen: "11:00", satClose: "20:30", sunOpen: null, sunClose: null },
  },
  {
    name: "Neko Boba",
    slug: "neko-boba",
    isIndependent: true,
    address: "Rúa do Progreso, 45",
    postalCode: "36202",
    neighborhood: "Casco Vello",
    latitude: 42.2390,
    longitude: -8.7235,
    googleMapsUrl: "https://maps.app.goo.gl/nekoboba-vigo",
    instagramUrl: "https://instagram.com/nekoboba.vigo",
    priceMin: 3.8,
    priceMax: 5.5,
    averagePrice: 4.5,
    editorSummary:
      "Neko Boba fusiona la estética kawaii con el bubble tea. El local temático de gatos es un imán para los amantes de la cultura japonesa en Vigo.",
    whyItStandsOut:
      "La temática de gatos (con gato residente incluido) hace que cada visita sea una experiencia. Los vasos con diseños felinos son coleccionables.",
    recommendedOrder: "Strawberry Milk Tea con popping boba de fresa",
    features: {
      veganOptions: true,
      lactoseFreeOptions: false,
      glutenFreeOptions: true,
      takeaway: true,
      seating: true,
      wifi: true,
      studyFriendly: false,
      photoFriendly: true,
      petFriendly: true,
      wheelchairAccessible: false,
    },
    scores: { quality: 78, price: 72, variety: 70, experience: 90, google: 84, popularity: 80 },
    hours: { weekdayOpen: "11:30", weekdayClose: "20:30", satOpen: "11:00", satClose: "21:00", sunOpen: "12:00", sunClose: "20:00" },
  },
  {
    name: "Asia Tea Vigo",
    slug: "asia-tea-vigo",
    isIndependent: true,
    address: "Rúa de García Barbón, 70",
    postalCode: "36201",
    neighborhood: "Centro",
    latitude: 42.2340,
    longitude: -8.7175,
    googleMapsUrl: "https://maps.app.goo.gl/asiatea-vigo",
    priceMin: 3.5,
    priceMax: 5.2,
    averagePrice: 4.0,
    editorSummary:
      "Asia Tea es un restaurante asiático que ha desarrollado una carta de bubble tea sorprendentemente completa. El boba aquí es un complemento perfecto para la comida.",
    whyItStandsOut:
      "La posibilidad de combinar una comida asiática con un buen boba de postre en el mismo local. La carta de tés es más amplia de lo esperado.",
    recommendedOrder: "Thai Milk Tea con tapioca (ideal como postre)",
    features: {
      veganOptions: true,
      lactoseFreeOptions: false,
      glutenFreeOptions: false,
      takeaway: true,
      seating: true,
      wifi: false,
      studyFriendly: false,
      photoFriendly: false,
      petFriendly: false,
      wheelchairAccessible: true,
    },
    scores: { quality: 76, price: 78, variety: 72, experience: 70, google: 78, popularity: 68 },
    hours: { weekdayOpen: "12:00", weekdayClose: "22:30", satOpen: "12:00", satClose: "23:00", sunOpen: "12:00", sunClose: "22:00" },
  },
];

// ─── Main Seed Function ──────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Starting seed...\n");

  // Insert cities
  const insertedCities = await db
    .insert(cities)
    .values(citiesData)
    .returning({ id: cities.id, slug: cities.slug });
  console.log(`✅ ${insertedCities.length} cities inserted`);

  const cityMap = new Map(insertedCities.map((c) => [c.slug, c.id]));

  const allShopSets: [string, ShopSeed[]][] = [
    ["madrid", madridShops],
    ["barcelona", barcelonaShops],
    ["vigo", vigoShops],
  ];

  for (const [citySlug, shopList] of allShopSets) {
    const cityId = cityMap.get(citySlug)!;
    console.log(`\n📍 Seeding ${citySlug} (${shopList.length} shops)...`);

    for (const shop of shopList) {
      const now = new Date();

      // Insert shop
      const [inserted] = await db
        .insert(shops)
        .values({
          cityId,
          name: shop.name,
          slug: shop.slug,
          brandName: shop.brandName || null,
          isIndependent: shop.isIndependent,
          status: "published",
          address: shop.address,
          postalCode: shop.postalCode,
          neighborhood: shop.neighborhood,
          latitude: shop.latitude,
          longitude: shop.longitude,
          googleMapsUrl: shop.googleMapsUrl,
          websiteUrl: shop.websiteUrl || null,
          instagramUrl: shop.instagramUrl || null,
          priceMin: shop.priceMin,
          priceMax: shop.priceMax,
          averagePrice: shop.averagePrice,
          editorSummary: shop.editorSummary,
          whyItStandsOut: shop.whyItStandsOut,
          recommendedOrder: shop.recommendedOrder,
          lastReviewedAt: now,
          publishedAt: now,
        })
        .returning({ id: shops.id });

      const shopId = inserted.id;

      // Insert features
      await db.insert(shopFeatures).values({
        shopId,
        ...shop.features,
      });

      // Insert scores
      const total = calcTotal(shop.scores);
      await db.insert(shopScores).values({
        shopId,
        qualityScore: shop.scores.quality,
        priceScore: shop.scores.price,
        varietyScore: shop.scores.variety,
        experienceScore: shop.scores.experience,
        googleRatingScore: shop.scores.google,
        popularityScore: shop.scores.popularity,
        totalScore: total,
      });

      // Insert hours
      const hoursData = makeHours(
        shopId,
        shop.hours.weekdayOpen,
        shop.hours.weekdayClose,
        shop.hours.satOpen,
        shop.hours.satClose,
        shop.hours.sunOpen,
        shop.hours.sunClose
      );
      await db.insert(shopHours).values(hoursData);

      console.log(`  ✓ ${shop.name} (score: ${total})`);
    }
  }

  // Insert SEO pages for cities
  for (const [citySlug, cityId] of cityMap.entries()) {
    const cityData = citiesData.find((c) => c.slug === citySlug)!;

    // City page SEO
    await db.insert(seoPages).values({
      entityType: "city",
      entityId: cityId,
      title: cityData.seoTitle,
      metaDescription: cityData.seoDescription,
      h1: `Bubble Tea en ${cityData.name}`,
      introText: cityData.longDescription,
      faqJson: JSON.stringify([
        {
          q: `¿Dónde tomar bubble tea en ${cityData.name}?`,
          a: `En ${cityData.name} encontrarás decenas de locales especializados en bubble tea. Los barrios con mayor concentración son ${
            citySlug === "madrid"
              ? "Sol, Malasaña, Chueca, Usera y Lavapiés"
              : citySlug === "barcelona"
              ? "Raval, Gòtic, Eixample y Gràcia"
              : "el centro, Gran Vía y el Casco Vello"
          }.`,
        },
        {
          q: `¿Cuánto cuesta un bubble tea en ${cityData.name}?`,
          a: `El precio medio de un bubble tea en ${cityData.name} oscila entre ${
            citySlug === "vigo" ? "3,50€ y 5,50€" : "4€ y 6,50€"
          }, dependiendo del local y el tamaño.`,
        },
        {
          q: `¿Cuál es el mejor bubble tea de ${cityData.name}?`,
          a: `Consulta nuestro ranking editorial actualizado con los mejores locales de bubble tea en ${cityData.name}, evaluados por calidad, precio, variedad y experiencia.`,
        },
      ]),
    });

    // Ranking page SEO
    await db.insert(seoPages).values({
      entityType: "ranking",
      entityId: cityId,
      title: `Los Mejores Bubble Tea de ${cityData.name} — Ranking ${new Date().getFullYear()}`,
      metaDescription: `Ranking editorial de los mejores locales de bubble tea en ${cityData.name}. Evaluamos calidad, precio, variedad y experiencia para ayudarte a elegir.`,
      h1: `Los Mejores Bubble Tea de ${cityData.name}`,
      introText: `Nuestro ranking editorial de los mejores locales de bubble tea en ${cityData.name}, actualizado en ${new Date().getFullYear()}. Evaluamos cada local en persona y puntuamos calidad del producto, precio, variedad de carta, experiencia en el local, valoración en Google y popularidad en redes.`,
    });
  }

  console.log("\n✅ SEO pages inserted");
  console.log("\n🎉 Seed completed successfully!");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
