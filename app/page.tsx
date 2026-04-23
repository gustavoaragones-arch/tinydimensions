import type { Metadata } from "next";
import { MeasurementWorkspace } from "@/components/MeasurementWorkspace";
import { buildSiteKeywords } from "@/lib/seo-keywords";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "TinyDimensions — Scale-aware measurements",
  description:
    "Convert real-world lengths to scaled model dimensions with architectural and hobbyist presets. Logic-first, millimeter-accurate engine.",
  keywords: buildSiteKeywords(),
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TinyDimensions",
  url: siteUrl,
  applicationCategory: "EducationalApplication",
  description:
    "Scale-aware measurement engine for architects and hobbyists: real-world to model conversions with preset scales.",
  operatingSystem: "Any",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-1 flex-col bg-neutral-50 dark:bg-neutral-950">
        <MeasurementWorkspace />
      </div>
    </>
  );
}
