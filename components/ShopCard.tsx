import Link from "next/link";

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
  if (avg <= 4) return "€";
  if (avg <= 5.5) return "€€";
  return "€€€";
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
}: Props) {
  const tags = features
    ? featureTags.filter(({ key }) => (features as Record<string, boolean>)[key])
    : [];

  return (
    <Link
      href={`/${citySlug}/${slug}`}
      className="group bg-surface-container-lowest rounded-xl overflow-hidden editorial-shadow transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-surface-container">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={imageAlt ?? name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
              local_cafe
            </span>
          </div>
        )}

        {/* Position badge */}
        {position != null && (
          <div className="absolute top-3 left-3 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center text-lg font-serif font-bold">
            {position}
          </div>
        )}

        {/* Score badge */}
        {totalScore != null && (
          <div className="absolute top-3 right-3 bg-surface/80 glass-nav px-2.5 py-1 rounded-full">
            <span className="text-xs font-bold text-primary">
              {totalScore.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-on-background group-hover:text-primary transition-colors">
            {name}
          </h3>
          {averagePrice != null && (
            <span className="text-sm font-bold text-primary shrink-0">
              {priceLabel(averagePrice)}
            </span>
          )}
        </div>

        {neighborhood && (
          <p className="text-xs text-on-surface-variant mb-3">{neighborhood}</p>
        )}

        {editorSummary && (
          <p className="text-sm text-on-surface-variant leading-relaxed mb-4 line-clamp-2 flex-1">
            {editorSummary}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {tags.slice(0, 3).map(({ key, label }) => (
              <span
                key={key}
                className="bg-surface-container-highest px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight uppercase text-on-surface-variant"
              >
                {label}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] text-on-surface-variant font-semibold px-1">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
