import type { Metadata } from "next";
import Link from "next/link";
import { h2Class } from "@/components/LongFormShell";
import { StageWorkspace } from "@/components/stage/StageWorkspace";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();
const pageUrl = `${base}/stage`;

export const metadata: Metadata = {
  title: "Stage: Viewer-Angle Planning for Dioramas",
  description:
    "Block out a diorama with proxy volumes at real dimensions, then view it from the shelf, table, or case where it will actually sit. Free, runs in the browser.",
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
      name: "Stage: Viewer-Angle Planning for Dioramas",
      description:
        "Block out a diorama with proxy volumes at real dimensions, then view it from the shelf, table, or case where it will actually sit. Free, runs in the browser.",
      isPartOf: { "@id": `${base}/#website` },
      mainEntity: { "@id": `${pageUrl}#software` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      "@id": `${pageUrl}#software`,
      name: "TinyDimensions Stage",
      url: pageUrl,
      isPartOf: { "@id": `${base}/#website` },
      publisher: { "@id": `${base}/#organization` },
      author: { "@id": `${base}/#organization` },
      applicationCategory: "UtilitiesApplication",
      description:
        "Blocks out a diorama with proxy volumes at real-world dimensions and renders it in perspective from a specified surface height, eye height, and viewing distance.",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript and WebGL",
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
        { "@type": "ListItem", position: 2, name: "Stage" },
      ],
    },
  ],
};

const linkClass =
  "font-medium underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-600 dark:decoration-neutral-500 dark:hover:decoration-neutral-300";

function StageBelowFold() {
  return (
    <div className="td-prose mx-auto mt-10 max-w-2xl border-t border-neutral-200 pt-8 leading-relaxed dark:border-neutral-800">
      <section aria-labelledby="angle-heading" className="space-y-3">
        <h2 id="angle-heading" className={h2Class}>
          What viewing angle changes
        </h2>
        <p>
          A diorama is almost always built in one position and displayed in another. You work on
          it flat on a bench, leaning over it, looking down from perhaps 400 mm at a steep angle.
          Then it goes on a shelf, and someone stands two feet away looking at it nearly edge-on.
        </p>
        <p>Two things change, and both are geometry rather than taste.</p>
        <p>
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
            Foreshortening.
          </strong>{" "}
          Depth compresses as the viewing angle flattens, and the amount is not subtle. Leaning
          over a workbench, two figures 400 mm apart in real depth at 1:35 separate on screen by
          around a third of a figure&apos;s height — clearly distinct. Move the same scene to a
          chest-height shelf and that separation drops to about an eighth. The spacing you set
          while looking down is roughly three times what the viewer will actually see, and that
          ratio holds for any gap at those two positions.
        </p>
        <p>
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
            Occlusion.
          </strong>{" "}
          Anything in front hides more of what&apos;s behind it as the angle drops. Groundwork,
          low walls, and vehicle bodies that sit clear of each other on the bench begin to stack.
          This is the failure people notice after the piece is finished and mounted, when it is
          expensive to fix.
        </p>
        <p>
          There is a third, less obvious one: the surface of the base stops being visible. Detail
          worked into the groundwork — texture, debris, tracks — is fully visible from above and
          nearly invisible at a grazing angle. That is not a reason to skip it. It is a reason to
          know before you spend a weekend on it.
        </p>
      </section>

      <section aria-labelledby="positions-heading" className="mt-8 space-y-3">
        <h2 id="positions-heading" className={h2Class}>
          Shelf, table, and case
        </h2>
        <p>The differences between common display positions are larger than they sound.</p>
        <p>
          A <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
            competition table
          </strong>{" "}
          sits around 900 mm. A standing adult&apos;s eye is around 1570 mm, so the viewer looks
          down from about 670 mm above the surface, from a metre or less away. The base surface is
          fully in view. Groundwork reads. Silhouettes against the background matter less, because
          there is not much background in frame.
        </p>
        <p>
          A <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
            high shelf
          </strong>{" "}
          at 1700 mm puts the surface above eye level. The viewer looks up. The base surface is
          barely visible at all, the scene reads almost entirely as silhouette, and anything low
          is hidden by whatever is in front of it. Height and outline carry the whole composition.
        </p>
        <p>
          A{" "}
          <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
            display case at seated height
          </strong>{" "}
          is different again — around 750 mm with the viewer&apos;s eye near 1200 mm, usually
          closer than either of the above, so the scene fills more of the field of view and small
          detail is genuinely legible.
        </p>
        <p>
          None of these is the right one. Which applies depends on where the piece ends up, which
          is worth deciding before the groundwork goes down rather than after.
        </p>
      </section>

      <section aria-labelledby="how-heading" className="mt-8 space-y-3">
        <h2 id="how-heading" className={h2Class}>
          How Stage works
        </h2>
        <p>
          Blocks are entered at real-world dimensions and divided by the scene ratio, the same
          arithmetic the{" "}
          <Link href="/scale-calculator" className={linkClass}>
            Scale Calculator
          </Link>{" "}
          does. Positions are set on the base, in the base&apos;s own millimetres. Every value is
          editable as a number and every drag writes back to those numbers — the table and the 3D
          view are the same data.
        </p>
        <p>
          The viewing position takes three figures: the height of the surface the piece sits on,
          your own eye height above the floor, and how far back you stand. The camera is placed at
          that position in correct perspective.
        </p>
        <p>
          Zoom moves the camera rather than changing the lens, and the viewing distance in
          millimetres is shown at all times. This matters more than it sounds: changing the field
          of view from a fixed point produces a magnified version of the distant view,
          foreshortening and all. Moving the camera produces the image someone standing there
          would actually see.
        </p>
        <p>
          Export produces a bench sheet with the scene from each viewing position you have used,
          plus a table of every block&apos;s real and scaled dimensions.
        </p>
      </section>

      <section aria-labelledby="overlays-heading" className="mt-8 space-y-3">
        <h2 id="overlays-heading" className={h2Class}>
          About the overlays
        </h2>
        <p>
          Four toggles: thirds, phi, centre, and horizon. They draw lines over the image and
          nothing else. Nothing is scored, nothing is flagged, and no arrangement is called
          correct.
        </p>
        <p>
          Thirds, phi, and centre are fixed to the frame. They are there because some builders
          find them useful for noticing where things have landed, not because there is a rule
          underneath them.
        </p>
        <p>
          The horizon line is the one derived from your input: it marks the height of your own
          eye, projected into the scene. It shows exactly what sits above and below the
          viewer&apos;s eye level, which is usually the more useful of the four.
        </p>
      </section>

      <section aria-labelledby="not-heading" className="mt-8 space-y-3">
        <h2 id="not-heading" className={h2Class}>
          What Stage does not do
        </h2>
        <p>
          Stage has proxy volumes and dimensions. It has no colour, no contrast, no texture, and
          no paint. It therefore says nothing about what will draw the eye, what will read as
          cluttered, or which element competes with which — any such judgment would be built on
          information the tool does not have.
        </p>
        <p>It does not place anything for you, and it does not evaluate what you have placed.</p>
        <p>
          It does not store your work. There are no accounts and no server; a session is exported
          rather than saved.
        </p>
        {/* insertion point: link guide #2 (/guides/diorama-base-size) and guide #3
            (/guides/where-the-viewer-stands) once those exist */}
      </section>
    </div>
  );
}

export default function StagePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StageWorkspace
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Stage" }]}
        after={<StageBelowFold />}
      />
    </>
  );
}
