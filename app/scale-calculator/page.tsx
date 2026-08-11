import type { Metadata } from "next";
import { MeasurementWorkspace } from "@/components/MeasurementWorkspace";
import {
  SCALE_CATEGORY_LABELS,
  SCALE_CATEGORY_ORDER,
  SCALE_PRESETS,
  type ScaleCategory,
} from "@/lib/math-engine";
import { buildSiteKeywords } from "@/lib/seo-keywords";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();
const pageUrl = `${base}/scale-calculator`;

// Purpose: Render each preset's tags in one fixed order so "Used for" reads the same way on every row.
function usedForLabel(categories: ScaleCategory[]): string {
  return SCALE_CATEGORY_ORDER.filter((c) => categories.includes(c))
    .map((c) => SCALE_CATEGORY_LABELS[c])
    .join(", ");
}

const PRESETS_BY_RATIO = [...SCALE_PRESETS].sort((a, b) => a.ratio - b.ratio);

export const metadata: Metadata = {
  title: "Scale Calculator for Models and Architecture",
  description:
    "Scale calculator for model railway, automotive, aircraft, military, naval, and architectural ratios. Convert real dimensions to scaled millimetres, inches, or feet across 36 presets.",
  keywords: buildSiteKeywords(),
  alternates: {
    canonical: pageUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Scale Calculator for Models and Architecture",
      isPartOf: { "@id": `${base}/#website` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      mainEntity: { "@id": `${pageUrl}#software` },
      inLanguage: "en",
    },
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

function AvailableScalesSection() {
  return (
    <section
      className="mx-auto mt-10 max-w-xl border-t border-neutral-200 pt-8 lg:max-w-none dark:border-neutral-800"
      aria-labelledby="available-scales-heading"
    >
      <h2
        id="available-scales-heading"
        className="font-sans text-base font-semibold tracking-tight text-neutral-950 dark:text-neutral-50"
      >
        Scales available in this calculator
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        Fixed ratios you can select above. Each run uses one scale; model length is real-world
        length divided by the denominator.
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="td-table">
          <thead>
            <tr>
              <th>Scale</th>
              <th>Common name</th>
              <th>Used for</th>
            </tr>
          </thead>
          <tbody>
            {PRESETS_BY_RATIO.map((preset) => (
              <tr key={preset.ratio}>
                <td className="font-mono tabular-nums">
                  {preset.label} / 1/{preset.ratio}
                </td>
                <td>{preset.name ?? "—"}</td>
                <td>{usedForLabel(preset.categories)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function ScaleCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="td-v2">
        <MeasurementWorkspace
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Scale Calculator" }]}
          after={<AvailableScalesSection />}
        />
      </div>
    </>
  );
}
