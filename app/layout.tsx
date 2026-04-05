import type { Metadata } from "next";
import { Noto_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/constants";
import Navbar from "@/components/Navbar";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

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
    <html
      lang="es"
      className={`${notoSerif.variable} ${plusJakartaSans.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        {/* Plausible Analytics */}
        <script
          defer
          data-domain="bubbleteaespana.com"
          src="https://plausible.io/js/script.js"
        />
        {/* Google Search Console verification — replace content with actual code */}
        {process.env.NEXT_PUBLIC_GSC_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GSC_VERIFICATION}
          />
        )}
      </head>
      <body className="bg-surface text-on-surface antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
