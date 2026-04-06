import { ImageResponse } from "next/og";
import { db } from "@/db";
import { cities, shops } from "@/db/schema";
import { and, eq, count } from "drizzle-orm";

export const runtime = "edge";
export const alt = "Bubble Tea España";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;

  const [city] = await db
    .select({ name: cities.name })
    .from(cities)
    .where(and(eq(cities.slug, slug), eq(cities.status, "published")))
    .limit(1);

  const [shopCount] = city
    ? await db
        .select({ count: count() })
        .from(shops)
        .where(
          and(
            eq(shops.cityId, (await db.select({ id: cities.id }).from(cities).where(eq(cities.slug, slug)).limit(1))[0].id),
            eq(shops.status, "published")
          )
        )
    : [{ count: 0 }];

  const cityName = city?.name ?? slug;
  const total = shopCount?.count ?? 0;

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
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#8fb339",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            🧋
          </div>
        </div>

        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#1f1b14",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: "900px",
          }}
        >
          Bubble Tea en {cityName}
        </div>

        <div
          style={{
            fontSize: "28px",
            color: "#4c6700",
            marginTop: "20px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Guía de Autor
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#444938",
            marginTop: "24px",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          {total} locales verificados y evaluados
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
