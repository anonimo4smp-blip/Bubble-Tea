import { ImageResponse } from "next/og";
import { db } from "@/db";
import { cities, shops, shopScores } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "edge";
export const alt = "Bubble Tea España";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage({
  params,
}: {
  params: Promise<{ city: string; shopSlug: string }>;
}) {
  const { city: citySlug, shopSlug } = await params;

  const [city] = await db
    .select({ id: cities.id, name: cities.name })
    .from(cities)
    .where(and(eq(cities.slug, citySlug), eq(cities.status, "published")))
    .limit(1);

  if (!city) {
    return new ImageResponse(
      <div style={{ width: "100%", height: "100%", background: "#fff8f3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", color: "#1f1b14" }}>Bubble Tea España</div>,
      { ...size }
    );
  }

  const [shop] = await db
    .select({
      name: shops.name,
      neighborhood: shops.neighborhood,
      averagePrice: shops.averagePrice,
    })
    .from(shops)
    .where(
      and(
        eq(shops.cityId, city.id),
        eq(shops.slug, shopSlug),
        eq(shops.status, "published")
      )
    )
    .limit(1);

  const shopName = shop?.name ?? shopSlug;
  const location = [shop?.neighborhood, city.name].filter(Boolean).join(", ");

  const [scores] = shop
    ? await db
        .select({ totalScore: shopScores.totalScore })
        .from(shopScores)
        .where(
          eq(
            shopScores.shopId,
            (
              await db
                .select({ id: shops.id })
                .from(shops)
                .where(and(eq(shops.cityId, city.id), eq(shops.slug, shopSlug)))
                .limit(1)
            )[0].id
          )
        )
        .limit(1)
    : [null];

  const score = scores?.totalScore;
  const price = shop?.averagePrice;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #fff8f3 0%, #fcf2e7 50%, #f6ece1 100%)",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "#8fb339",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            🧋
          </div>
        </div>

        <div
          style={{
            fontSize: "60px",
            fontWeight: 700,
            color: "#1f1b14",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: "1000px",
          }}
        >
          {shopName}
        </div>

        <div
          style={{
            fontSize: "26px",
            color: "#444938",
            marginTop: "16px",
            textAlign: "center",
          }}
        >
          {location}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            marginTop: "32px",
          }}
        >
          {score != null && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
                background: "rgba(76, 103, 0, 0.1)",
                borderRadius: "999px",
                padding: "12px 28px",
              }}
            >
              <span style={{ fontSize: "36px", fontWeight: 700, color: "#4c6700" }}>
                {score.toFixed(1)}
              </span>
              <span style={{ fontSize: "18px", color: "#444938" }}>/100</span>
            </div>
          )}
          {price != null && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "6px",
                background: "rgba(254, 178, 137, 0.2)",
                borderRadius: "999px",
                padding: "12px 28px",
              }}
            >
              <span style={{ fontSize: "28px", fontWeight: 700, color: "#1f1b14" }}>
                ~{price.toFixed(1)}€
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: "16px",
            color: "#4c6700",
            marginTop: "28px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Bubble Tea España · Guía de Autor
        </div>

        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(254, 178, 137, 0.25)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(143, 179, 57, 0.2)",
            filter: "blur(60px)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
