const ranking = [
  {
    position: 1,
    name: "Zen Tea Art",
    location: "Malasaña, Madrid",
    price: "€€",
    tags: ["Vegano", "Para estudiar", "Bonito para fotos"],
    badgeClass: "bg-primary text-on-primary",
  },
  {
    position: 2,
    name: "Boba Lab",
    location: "Chueca, Madrid",
    price: "€€€",
    tags: ["Fruta Natural", "Minimalista"],
    badgeClass: "bg-primary-container text-on-primary-container",
  },
  {
    position: 3,
    name: "Oasis Milk Bar",
    location: "Salamanca, Madrid",
    price: "€",
    tags: ["Tradicional", "Take away"],
    badgeClass: "bg-secondary-container text-on-secondary-container",
  },
];

export default function RankingPreview() {
  return (
    <section id="ranking" className="py-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-on-background mb-4">
            El Olimpo del Boba: Madrid
          </h2>
          <p className="text-on-surface-variant tracking-widest uppercase text-xs font-bold">
            Actualizado: Enero 2025
          </p>
        </div>

        <div className="space-y-6">
          {ranking.map((item) => (
            <div
              key={item.position}
              className="group bg-surface-container-low p-6 rounded-2xl flex flex-col md:flex-row items-center gap-8 hover:bg-surface-container transition-colors border border-outline-variant/10"
            >
              <div
                className={`w-20 h-20 ${item.badgeClass} rounded-full flex items-center justify-center text-3xl font-serif shrink-0`}
              >
                {item.position}
              </div>

              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                  <h3 className="text-2xl font-bold text-on-background">
                    {item.name}
                  </h3>
                  <span className="text-on-surface-variant text-sm font-medium">
                    {item.location}
                  </span>
                  <span className="text-primary font-bold">{item.price}</span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-surface-container-highest px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button className="bg-surface-container-lowest p-4 rounded-full border border-outline-variant/20 group-hover:bg-primary group-hover:text-on-primary transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
