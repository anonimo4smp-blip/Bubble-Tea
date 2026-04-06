import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <>
      <main className="pt-24 px-6">
        <div className="mx-auto max-w-2xl text-center py-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
            Error 404
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface mb-6">
            Esta página no existe
          </h1>
          <p className="text-on-surface-variant text-lg mb-10">
            Puede que el enlace esté roto o que la página haya sido movida.
            Prueba a volver al inicio para encontrar lo que buscas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn btn-primary">
              Volver al inicio
            </Link>
            <Link href="/ciudades" className="btn btn-subtle">
              Explorar ciudades
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
