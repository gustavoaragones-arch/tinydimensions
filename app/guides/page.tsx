import type { Metadata } from "next";
import Link from "next/link";
import { LongFormShell } from "@/components/LongFormShell";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();
const pageUrl = `${base}/guides`;

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Builder's guides for scale modeling and architecture — reading scale ratios, mixed-unit conversion, and other reference material behind the calculator.",
  alternates: { canonical: pageUrl },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Guides",
      isPartOf: { "@id": `${base}/#website` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Guides" },
      ],
    },
  ],
};

const linkClass =
  "font-medium underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-600 dark:decoration-neutral-500 dark:hover:decoration-neutral-300";

export default function GuidesIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LongFormShell title="Guides" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Guides" }]}>
        <p>
          Reference guides for scale modeling and architecture — the arithmetic behind the
          calculator, written out.
        </p>
        <ul className="list-none space-y-2 pl-0">
          <li>
            <Link href="/guides/reading-scale-ratios" className={linkClass}>
              Reading scale ratios: notation, awkward numbers, and near-identical scales
            </Link>
          </li>
        </ul>
      </LongFormShell>
    </>
  );
}
