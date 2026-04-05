import Hero from "@/components/Hero";
import FeaturedCities from "@/components/FeaturedCities";
import RankingPreview from "@/components/RankingPreview";
import ValueProps from "@/components/ValueProps";
import HowItWorks from "@/components/HowItWorks";
import EditorialBlock from "@/components/EditorialBlock";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { JsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/constants";

export default function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bubble Tea España",
    url: SITE_URL,
    description:
      "La primera guía de autor dedicada exclusivamente a la excelencia del té de burbujas en territorio español.",
    inLanguage: "es",
  };

  return (
    <>
      <JsonLd data={[websiteJsonLd, breadcrumbJsonLd([{ name: "Inicio" }])]} />
      <main>
        <Hero />
        <FeaturedCities />
        <RankingPreview />
        <ValueProps />
        <HowItWorks />
        <EditorialBlock />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
