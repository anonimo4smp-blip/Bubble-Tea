import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/constants";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bubble Tea España | La Guía de Autor",
    template: "%s | Bubble Tea España",
  },
  description:
    "La primera guía de autor dedicada exclusivamente a la excelencia del té de burbujas en territorio español. Descubre los mejores locales en Madrid, Barcelona y Vigo.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Bubble Tea España",
    title: "Bubble Tea España | La Guía de Autor",
    description:
      "La primera guía de autor dedicada exclusivamente a la excelencia del té de burbujas en territorio español.",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          defer
          data-domain="bubbleteaespana.com"
          src="https://plausible.io/js/script.js"
        ></script>
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GSC_VERIFICATION}
          />
        )}
      </head>
      <body className="bg-surface text-on-surface antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-on-primary focus:shadow-lg"
        >
          Saltar al contenido
        </a>
        <Navbar />
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
