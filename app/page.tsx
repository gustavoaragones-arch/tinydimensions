import type { Metadata } from "next";
import { MeasurementEngine } from "@/components/MeasurementEngine";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://tinydimensions.com";

export const metadata: Metadata = {
  title: "TinyDimensions — Scale-aware measurements",
  description:
    "Convert real-world lengths to scaled model dimensions with architectural and hobbyist presets. Logic-first, millimeter-accurate engine.",
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
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <MeasurementEngine />
      </div>
    </>
  );
}
