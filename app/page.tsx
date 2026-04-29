import type { Metadata } from "next";
import { MeasurementWorkspace } from "@/components/MeasurementWorkspace";
import { buildSiteKeywords } from "@/lib/seo-keywords";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Instant Scale Measurement Calculator for Models & Architecture",
  description:
    "Convert real-world lengths to scaled model dimensions with architectural, diecast, and kit presets. Millimeter-accurate engine; three-decimal readouts.",
  keywords: buildSiteKeywords(),
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TinyDimensions",
  url: siteUrl,
  applicationCategory: "DesignApplication",
  description:
    "Scale-aware measurement engine: real-world length to model size using a fixed scale ratio. Results rounded to three decimal places across millimeters, centimeters, meters, inches, and decimal feet.",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  potentialAction: {
    "@type": "CalculateAction",
    name: "Convert real-world length to scaled model length",
    description:
      "Computes scaled model dimensions from a real-world measurement and a numeric scale ratio (for example 1:87 HO, 1:18 diecast, or 1:100 architecture).",
    target: {
      "@type": "EntryPoint",
      urlTemplate: siteUrl,
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MeasurementWorkspace />
    </>
  );
}
