import Link from "next/link";
import Icon from "@/components/Icon";

export type RankingPreviewItem = {
  position: number;
  name: string;
  location: string | null;
  priceLabel: string | null;
  tags: string[];
  href: string;
};

const badgeClasses = [
  "bg-primary text-on-primary",
  "bg-primary-container text-on-primary-container",
  "bg-secondary-container text-on-secondary-container",
];

export default function RankingPreview({ items = [] }: { items?: RankingPreviewItem[] }) {
  return (
    <section id="ranking" className="bg-surface px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="section-title section-title-md mb-4">
            El Olimpo del Boba: Madrid
          </h2>
          <p className="section-kicker mb-0 text-on-surface-variant">
            Actualizado: Abril 2026
          </p>
        </div>

        <div className="space-y-6">
          {items.map((item, index) => (
            <Link
              key={item.position}
              href={item.href}
              className="group flex flex-col items-center gap-8 p-6 card-soft-lg-hover md:flex-row"
            >
              <div
                className={`h-20 w-20 rounded-full ${badgeClasses[index] ?? badgeClasses[2]} flex shrink-0 items-center justify-center font-serif text-3xl`}
              >
                {item.position}
              </div>

              <div className="flex-grow text-center md:text-left">
                <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                  <h3 className="text-2xl font-bold text-on-background">
                    {item.name}
                  </h3>
                  {item.location ? (
                    <span className="text-sm font-medium text-on-surface-variant">
                      {item.location}
                    </span>
                  ) : null}
                  {item.priceLabel ? (
                    <span className="font-bold text-primary">{item.priceLabel}</span>
                  ) : null}
                </div>
                {item.tags.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                    {item.tags.map((tag) => (
                      <span key={tag} className="badge badge-neutral">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <span className="btn btn-subtle btn-icon">
                <Icon name="chevron_right" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
