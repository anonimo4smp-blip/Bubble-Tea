import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  timestamp,
  pgEnum,
  serial,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const cityStatusEnum = pgEnum("city_status", [
  "draft",
  "published",
  "archived",
]);

export const shopStatusEnum = pgEnum("shop_status", [
  "draft",
  "published",
  "needs_update",
  "archived",
  "cerrado_temporal",
  "cerrado_definitivo",
]);

export const entityTypeEnum = pgEnum("entity_type", [
  "city",
  "shop",
  "ranking",
]);

export const weekdayEnum = pgEnum("weekday", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

// ─── Cities ───────────────────────────────────────────────────────────────────

export const cities = pgTable(
  "cities",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    region: text("region"),
    province: text("province"),
    status: cityStatusEnum("status").notNull().default("draft"),
    shortDescription: text("short_description"),
    longDescription: text("long_description"),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    keywordPrimary: text("keyword_primary"),
    latitudeCenter: real("latitude_center"),
    longitudeCenter: real("longitude_center"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("cities_slug_idx").on(t.slug)]
);

// ─── Shops ────────────────────────────────────────────────────────────────────

export const shops = pgTable(
  "shops",
  {
    id: serial("id").primaryKey(),
    cityId: integer("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    brandName: text("brand_name"),
    isIndependent: boolean("is_independent").notNull().default(true),
    status: shopStatusEnum("status").notNull().default("draft"),
    address: text("address"),
    postalCode: text("postal_code"),
    neighborhood: text("neighborhood"),
    latitude: real("latitude"),
    longitude: real("longitude"),
    googleMapsUrl: text("google_maps_url"),
    googleRating: real("google_rating"),
    googleReviewCount: integer("google_review_count"),
    websiteUrl: text("website_url"),
    instagramUrl: text("instagram_url"),
    tiktokUrl: text("tiktok_url"),
    priceMin: real("price_min"),
    priceMax: real("price_max"),
    averagePrice: real("average_price"),
    editorSummary: text("editor_summary"),
    whyItStandsOut: text("why_it_stands_out"),
    recommendedOrder: text("recommended_order"),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("shops_city_slug_idx").on(t.cityId, t.slug),
    index("shops_city_id_idx").on(t.cityId),
    index("shops_status_idx").on(t.status),
  ]
);

// ─── Shop Features ────────────────────────────────────────────────────────────

export const shopFeatures = pgTable("shop_features", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id")
    .notNull()
    .unique()
    .references(() => shops.id, { onDelete: "cascade" }),
  veganOptions: boolean("vegan_options").notNull().default(false),
  lactoseFreeOptions: boolean("lactose_free_options").notNull().default(false),
  glutenFreeOptions: boolean("gluten_free_options").notNull().default(false),
  takeaway: boolean("takeaway").notNull().default(false),
  seating: boolean("seating").notNull().default(false),
  wifi: boolean("wifi").notNull().default(false),
  studyFriendly: boolean("study_friendly").notNull().default(false),
  photoFriendly: boolean("photo_friendly").notNull().default(false),
  petFriendly: boolean("pet_friendly").notNull().default(false),
  wheelchairAccessible: boolean("wheelchair_accessible").notNull().default(false),
});

// ─── Shop Hours ───────────────────────────────────────────────────────────────

export const shopHours = pgTable(
  "shop_hours",
  {
    id: serial("id").primaryKey(),
    shopId: integer("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    weekday: weekdayEnum("weekday").notNull(),
    opensAt: text("opens_at"), // "HH:MM"
    closesAt: text("closes_at"), // "HH:MM"
    isClosed: boolean("is_closed").notNull().default(false),
  },
  (t) => [uniqueIndex("shop_hours_shop_weekday_idx").on(t.shopId, t.weekday)]
);

// ─── Shop Scores ──────────────────────────────────────────────────────────────

export const shopScores = pgTable("shop_scores", {
  id: serial("id").primaryKey(),
  shopId: integer("shop_id")
    .notNull()
    .unique()
    .references(() => shops.id, { onDelete: "cascade" }),
  // Each dimension: 0-100
  qualityScore: real("quality_score"),       // 35% weight
  priceScore: real("price_score"),           // 15% weight
  varietyScore: real("variety_score"),       // 15% weight
  experienceScore: real("experience_score"), // 10% weight
  googleRatingScore: real("google_rating_score"), // 15% weight
  popularityScore: real("popularity_score"), // 10% weight
  // Computed: sum of (dimension * weight)
  totalScore: real("total_score"),
  scoreVersion: integer("score_version").notNull().default(1),
  calculatedAt: timestamp("calculated_at", { withTimezone: true }).defaultNow(),
});

// ─── Shop Images ──────────────────────────────────────────────────────────────

export const shopImages = pgTable(
  "shop_images",
  {
    id: serial("id").primaryKey(),
    shopId: integer("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    altText: text("alt_text"),
    isPrimary: boolean("is_primary").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("shop_images_shop_id_idx").on(t.shopId)]
);

// ─── SEO Pages ────────────────────────────────────────────────────────────────

export const seoPages = pgTable(
  "seo_pages",
  {
    id: serial("id").primaryKey(),
    entityType: entityTypeEnum("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    title: text("title"),
    metaDescription: text("meta_description"),
    h1: text("h1"),
    introText: text("intro_text"),
    faqJson: text("faq_json"), // JSON string: [{q, a}]
    canonicalUrl: text("canonical_url"),
    ogTitle: text("og_title"),
    ogDescription: text("og_description"),
    ogImage: text("og_image"),
  },
  (t) => [
    uniqueIndex("seo_pages_entity_idx").on(t.entityType, t.entityId),
  ]
);

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    entityType: entityTypeEnum("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    action: text("action").notNull(), // e.g. "published", "updated", "archived"
    performedBy: text("performed_by").notNull(), // admin user email
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("audit_logs_entity_idx").on(t.entityType, t.entityId)]
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const citiesRelations = relations(cities, ({ many }) => ({
  shops: many(shops),
}));

export const shopsRelations = relations(shops, ({ one, many }) => ({
  city: one(cities, { fields: [shops.cityId], references: [cities.id] }),
  features: one(shopFeatures, { fields: [shops.id], references: [shopFeatures.shopId] }),
  hours: many(shopHours),
  scores: one(shopScores, { fields: [shops.id], references: [shopScores.shopId] }),
  images: many(shopImages),
}));

export const shopFeaturesRelations = relations(shopFeatures, ({ one }) => ({
  shop: one(shops, { fields: [shopFeatures.shopId], references: [shops.id] }),
}));

export const shopHoursRelations = relations(shopHours, ({ one }) => ({
  shop: one(shops, { fields: [shopHours.shopId], references: [shops.id] }),
}));

export const shopScoresRelations = relations(shopScores, ({ one }) => ({
  shop: one(shops, { fields: [shopScores.shopId], references: [shops.id] }),
}));

export const shopImagesRelations = relations(shopImages, ({ one }) => ({
  shop: one(shops, { fields: [shopImages.shopId], references: [shops.id] }),
}));
