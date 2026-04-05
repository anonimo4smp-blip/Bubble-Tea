import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-32 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-serif mb-12">
          Donde empezamos hoy?
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/madrid"
            className="px-10 py-5 bg-primary text-on-primary rounded-full font-bold text-lg hover:shadow-2xl transition-all"
          >
            Explorar Madrid
          </Link>
          <Link
            href="/barcelona"
            className="px-10 py-5 bg-secondary text-on-secondary rounded-full font-bold text-lg hover:shadow-2xl transition-all"
          >
            Explorar Barcelona
          </Link>
          <Link
            href="/madrid/mejores-bubble-tea"
            className="px-10 py-5 bg-on-background text-surface rounded-full font-bold text-lg hover:shadow-2xl transition-all"
          >
            Ver Ranking 2025
          </Link>
        </div>
      </div>
    </section>
  );
}
