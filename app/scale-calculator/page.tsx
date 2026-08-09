import type { Metadata } from "next";
import { MeasurementWorkspace } from "@/components/MeasurementWorkspace";
import { buildSiteKeywords } from "@/lib/seo-keywords";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();
const pageUrl = `${base}/scale-calculator`;

export const metadata: Metadata = {
  title: "Scale Calculator for Models and Architecture",
  description:
    "Scale measurement calculator for architectural, diecast, and model-railroad ratios. Convert prototype lengths to scaled millimetres with fixed presets and multi-unit readouts.",
  keywords: buildSiteKeywords(),
  alternates: {
    canonical: pageUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${pageUrl}#software`,
      name: "TinyDimensions Scale Calculator",
      url: pageUrl,
      isPartOf: { "@id": `${base}/#website` },
      publisher: { "@id": `${base}/#organization` },
      author: { "@id": `${base}/#organization` },
      applicationCategory: "UtilitiesApplication",
      description:
        "Interactive scale calculator for models and architecture: full-size length in, scaled model dimensions out — millimetres, centimetres, metres, inches, and decimal feet from one fixed ratio per run.",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Scale Calculator" },
      ],
    },
  ],
};

export default function ScaleCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MeasurementWorkspace
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Scale Calculator" }]}
      />
    </>
  );
}
