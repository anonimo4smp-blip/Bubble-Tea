import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-32 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-serif mb-12">
          ¿Dónde empezamos hoy?
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="/madrid" className="btn btn-primary btn-lg">
            Explorar Madrid
          </Link>
          <Link href="/barcelona" className="btn btn-secondary btn-lg">
            Explorar Barcelona
          </Link>
          <Link
            href="/madrid/mejores-bubble-tea"
            className="btn btn-contrast btn-lg"
          >
            Ver ranking 2026
          </Link>
        </div>
      </div>
    </section>
  );
}
