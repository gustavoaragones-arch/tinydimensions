import type { Metadata } from "next";
import { LongFormShell, h2Class, h3Class } from "@/components/LongFormShell";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export const metadata: Metadata = {
  title: {
    absolute: "About TinyDimensions | Scale Tools for Model Builders",
  },
  description:
    "TinyDimensions builds precision tools for scale model builders and architects: a scale calculator for mixed metric and imperial work, plus Stage for staging.",
  alternates: { canonical: `${base}/about` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${base}/about#webpage`,
      url: `${base}/about`,
      name: "About TinyDimensions",
      description:
        "TinyDimensions builds precision tools for scale model builders and architects: a scale calculator for mixed metric and imperial work, and Stage for viewer-angle staging.",
      isPartOf: { "@id": `${base}/#website` },
      about: { "@id": `${base}/#organization` },
      publisher: { "@id": "https://albordigital.com/#organization" },
      breadcrumb: { "@id": `${base}/about#breadcrumb` },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${base}/about#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "About" },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LongFormShell
        title="About TinyDimensions"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      >
        <p>
          TinyDimensions is a set of precision tools for people who build at scale. It converts
          real-world dimensions into scaled ones, and — with the Stage tool — lets you block out a
          scene and view it from where it will actually be seen. Both tools run in the browser, free,
          with no account.
        </p>

        <section aria-labelledby="what-heading">
          <h2 id="what-heading" className={h2Class}>
            What TinyDimensions is
          </h2>
          <p>
            Scale work is arithmetic you have already done a thousand times. A figure height in
            millimetres, a ratio, a base you are cutting to imperial because that is what the stock
            came in. None of it is difficult. All of it is repetitive, and every repetition is a place
            to drop a decimal.
          </p>
          <p>
            General-purpose unit converters handle part of this badly. They convert between units or
            they divide by a ratio, rarely both cleanly, and almost never while keeping metric and
            imperial in the same calculation without a detour through mental math. TinyDimensions was
            built to remove that friction rather than to teach anyone their craft.
          </p>
          <p>The Scale Calculator went live in 2026. Stage is in development.</p>
        </section>

        <section aria-labelledby="who-heading">
          <h2 id="who-heading" className={h2Class}>
            Who it&apos;s for
          </h2>
          <p>
            Model railroaders, wargamers, diorama builders, diecast collectors, miniature painters, and
            architects working on presentation models. The common thread is not the hobby — it is
            working to a ratio, in mixed units, where being 2 mm out is visible on the finished piece.
          </p>
          <p>
            The tools assume you know what you are doing at the bench. They are built to answer a
            question and get out of the way.
          </p>
        </section>

        <section aria-labelledby="tools-heading">
          <h2 id="tools-heading" className={h2Class}>
            The tools
          </h2>

          <div className="space-y-2">
            <h3 className={h3Class}>Scale Calculator</h3>
            <p>
              Converts real dimensions to scaled dimensions, or scaled back to real, across
              millimetres, centimetres, metres, inches, and feet — including when the input and output
              units differ. Results are given to three decimal places. Presets cover common
              architecture, model railroading, diecast, and tabletop ratios. Scaled results are drawn
              against familiar reference objects so you can see whether a number is plausible before
              you cut anything.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className={h3Class}>Stage</h3>
            <p>
              Stage is a staging tool, not a composition engine. You block a scene with proxy volumes,
              set the dimensions, and then look at it from where it will actually be viewed: a shelf
              above eye level, a competition table, a display case, or an eye position you specify.
              What reads from a 400 mm shelf does not read from a table you stand over, and the
              difference is easier to see than to reason about.
            </p>
            <p>
              Rule-of-thirds and golden-ratio overlays are available as optional reference aids. They
              are lines on a screen. They are not scored, not enforced, and not treated as rules.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className={h3Class}>Reference dimensions</h3>
            <p>
              A library of real-world object sizes — doors, vehicles, human figures, common furniture —
              used as comparison baselines. Its purpose is a sanity check: if a scaled result sits
              beside a familiar object at the same scale and looks wrong, it usually is.
            </p>
          </div>

          <p>Together the tools cover one workflow: convert the dimensions, block the scene, build it.</p>
        </section>

        <section aria-labelledby="trust-heading">
          <h2 id="trust-heading" className={h2Class}>
            Why the numbers can be trusted
          </h2>
          <p>
            Every calculation runs in millimetres. Whatever units you enter are normalised to
            millimetres first, the scale arithmetic happens there, and the results are converted back
            out to the units you asked for at the end. There is no chain of intermediate conversions,
            each one contributing its own small error.
          </p>
          <p>
            Rounding happens once. Values carry full precision the whole way through the calculation,
            and the three-decimal figure you see is produced at the final step, for display only. The
            size comparison is drawn from the unrounded value, so the picture and the number cannot
            drift apart.
          </p>
          <p>
            Output is checked against physical models and architectural drawings at the bench, not only
            against other calculators.
          </p>
          <p>Where something is uncertain, the site says so.</p>
        </section>

        <section aria-labelledby="not-heading">
          <h2 id="not-heading" className={h2Class}>
            What TinyDimensions does not do
          </h2>
          <p>
            It does not tell you where to put things. It does not score a composition, rank a layout,
            or claim that a proportion is correct because of a mathematical constant. Stage has proxy
            volumes and dimensions to work with — it has no information about colour, contrast,
            texture, or paint, so it does not offer opinions that would require them.
          </p>
          <p>
            It does not store your work. There are no accounts and no server-side saving; sessions are
            exported rather than saved.
          </p>
        </section>

        <section aria-labelledby="operator-heading">
          <h2 id="operator-heading" className={h2Class}>
            Who operates TinyDimensions
          </h2>
          <p>TinyDimensions is built and operated by Albor Digital LLC.</p>
          <p>
            Corrections and questions are welcome at{" "}
            <a
              href="mailto:contact@tinydimensions.com"
              className="font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-600 dark:text-neutral-100 dark:decoration-neutral-500 dark:hover:decoration-neutral-300"
            >
              contact@tinydimensions.com
            </a>
            .
          </p>
        </section>
      </LongFormShell>
    </>
  );
}
