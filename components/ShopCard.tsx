import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";

type Props = {
  name: string;
  slug: string;
  citySlug: string;
  neighborhood: string | null;
  averagePrice: number | null;
  editorSummary: string | null;
  totalScore: number | null;
  features: {
    veganOptions: boolean;
    wifi: boolean;
    studyFriendly: boolean;
    photoFriendly: boolean;
    petFriendly: boolean;
    takeaway: boolean;
  } | null;
  imageUrl: string | null;
  imageAlt: string | null;
  position?: number;
  compareButton?: React.ReactNode;
};

const featureTags: { key: string; label: string }[] = [
  { key: "veganOptions", label: "Vegano" },
  { key: "wifi", label: "WiFi" },
  { key: "studyFriendly", label: "Para estudiar" },
  { key: "photoFriendly", label: "Instagrameable" },
  { key: "petFriendly", label: "Pet-friendly" },
  { key: "takeaway", label: "Para llevar" },
];

function priceLabel(avg: number | null): string {
  if (avg == null) return "";
  if (avg <= 4) return "EUR";
  if (avg <= 5.5) return "EUR EUR";
  return "EUR EUR EUR";
}

export default function ShopCard({
  name,
  slug,
  citySlug,
  neighborhood,
  averagePrice,
  editorSummary,
  totalScore,
  features,
  imageUrl,
  imageAlt,
  position,
  compareButton,
}: Props) {
  const tags = features
    ? featureTags.filter(({ key }) => (features as Record<string, boolean>)[key])
    : [];

  return (
    <Link
      href={`/${citySlug}/${slug}`}
      className="group card-elevated-hover flex flex-col overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden bg-surface-container">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon
              name="local_cafe"
              className="text-4xl text-on-surface-variant/30"
            />
          </div>
        )}

        {position != null && (
          <div className="absolute top-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-serif text-lg font-bold text-on-primary">
            {position}
          </div>
        )}

        {totalScore != null && (
          <div className="glass-nav badge badge-neutral absolute top-3 right-3 bg-surface/80">
            <span className="text-primary">{totalScore.toFixed(1)}</span>
          </div>
        )}

        {compareButton && <div className="absolute right-3 bottom-3">{compareButton}</div>}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-on-background transition-colors group-hover:text-primary">
            {name}
          </h3>
          {averagePrice != null && (
            <span className="shrink-0 text-sm font-bold text-primary">
              {priceLabel(averagePrice)}
            </span>
          )}
        </div>

        {neighborhood && (
          <p className="mb-3 text-xs text-on-surface-variant">{neighborhood}</p>
        )}

        {editorSummary && (
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-on-surface-variant">
            {editorSummary}
          </p>
        )}

        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map(({ key, label }) => (
              <span key={key} className="badge badge-neutral">
                {label}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="badge badge-neutral">+{tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
