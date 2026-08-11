import type { Metadata } from "next";
import Link from "next/link";
import { LongFormShell, h2Class, h3Class } from "@/components/LongFormShell";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();
const pageUrl = `${base}/guides/reading-scale-ratios`;

export const metadata: Metadata = {
  title: "Reading Scale Ratios: A Builder's Guide",
  description:
    "What 1:87 actually means, why so many model scales are awkward numbers, and which near-identical ratios will show on the shelf. With worked conversions.",
  alternates: { canonical: pageUrl },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      headline: "Reading scale ratios: a builder's guide",
      description:
        "What 1:87 actually means, why so many model scales are awkward numbers, and which near-identical ratios will show on the shelf. With worked conversions.",
      mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
      author: { "@id": `${base}/#organization` },
      publisher: { "@id": "https://albordigital.com/#organization" },
      datePublished: "2026-08-09",
      dateModified: "2026-08-09",
      inLanguage: "en",
      about: [
        { "@type": "Thing", name: "Scale model" },
        { "@type": "Thing", name: "Scale ratio" },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: "Reading Scale Ratios: A Builder's Guide",
      isPartOf: { "@id": `${base}/#website` },
      breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${base}/guides` },
        { "@type": "ListItem", position: 3, name: "Reading scale ratios" },
      ],
    },
  ],
};

const linkClass =
  "font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-600 dark:text-neutral-100 dark:decoration-neutral-500 dark:hover:decoration-neutral-300";

export default function ReadingScaleRatiosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LongFormShell
        title="Reading scale ratios"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: "Reading scale ratios" },
        ]}
      >
        <p>
          A scale ratio is the simplest piece of arithmetic in the hobby and the source of a
          surprising amount of confusion — not because the division is hard, but because the same
          scale gets written four different ways depending on who is writing it, and because
          several of the standard ratios are awkward numbers with historical rather than
          mathematical origins.
        </p>
        <p>This is a reference for reading any of those notations and converting between them.</p>

        <section aria-labelledby="ratio-heading">
          <h2 id="ratio-heading" className={h2Class}>
            What the ratio is telling you
          </h2>
          <p>
            A scale ratio is a division instruction. In 1:87, one unit on the model represents 87
            of the same unit on the real thing. Eighty-seven millimetres becomes one millimetre.
            Eighty-seven feet becomes one foot. Eighty-seven of anything becomes one of that same
            thing.
          </p>
          <p>
            Both sides of the ratio always carry identical units, which is what makes the ratio
            itself unitless. That is the property worth holding on to: 1:87 means the same thing to
            someone working in millimetres and someone working in inches, and it can be applied to
            a dimension in any unit without converting first.
          </p>
          <p>
            Larger second numbers mean smaller models. The ratio alone says nothing about finished
            size — a 1:35 figure stands around 50 mm, a 1:35 tank runs around 250 mm. Same scale,
            different shelf.
          </p>
        </section>

        <section aria-labelledby="notations-heading">
          <h2 id="notations-heading" className={h2Class}>
            The four notations you&apos;ll meet
          </h2>

          <div className="space-y-2">
            <h3 className={h3Class}>Ratio and fraction</h3>
            <p>
              1:87 and 1/87 are the same instruction written two ways. The fraction form is more
              common in North America and in military and aircraft modelling; the colon form
              dominates in Europe, architecture, and rail. Neither carries additional meaning.
            </p>
            <p>
              Occasionally you will see it inverted — 87:1 — which is either an error or someone
              describing magnification rather than reduction. In model contexts, assume reduction.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className={h3Class}>Millimetres to the foot</h3>
            <p>
              Model railroading, particularly in Britain, expresses scale as millimetres of model
              per foot of prototype. <strong>4 mm scale</strong> means four millimetres represents
              one real foot. <strong>3.5 mm scale</strong> and <strong>2 mm scale</strong> work
              identically.
            </p>
            <p>
              This notation mixes metric and imperial deliberately, which looks wrong and is
              entirely functional: the prototype railway was built to imperial dimensions and the
              modeller works in metric. It is a conversion factor with the unit system baked in.
            </p>
            <p>To convert to a ratio: one foot is 304.8 mm, so divide 304.8 by the millimetre figure.</p>
            <ul className="list-none space-y-1 pl-0">
              <li>4 mm to the foot → 304.8 ÷ 4 = <strong>1:76.2</strong></li>
              <li>3.5 mm to the foot → 304.8 ÷ 3.5 = <strong>1:87.1</strong></li>
              <li>2 mm to the foot → 304.8 ÷ 2 = <strong>1:152.4</strong></li>
            </ul>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className={h3Class}>Inches to the foot</h3>
            <p>
              Architecture and North American model railroading use fractional inches per foot.{" "}
              <strong>Quarter-inch scale</strong> means a quarter inch on the drawing represents one
              foot of building.
            </p>
            <p>To convert to a ratio: divide 12 by the inch figure.</p>
            <ul className="list-none space-y-1 pl-0">
              <li>1/4 inch to the foot → 12 ÷ 0.25 = <strong>1:48</strong></li>
              <li>1/8 inch to the foot → 12 ÷ 0.125 = <strong>1:96</strong></li>
              <li>3/16 inch to the foot → 12 ÷ 0.1875 = <strong>1:64</strong></li>
              <li>1 inch to the foot → 12 ÷ 1 = <strong>1:12</strong></li>
            </ul>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className={h3Class}>Converting between notations</h3>
            <p>Two formulas cover every case:</p>
            <ul className="list-none space-y-1 pl-0">
              <li><strong>mm per foot → ratio:</strong> 304.8 ÷ (mm per foot)</li>
              <li><strong>inches per foot → ratio:</strong> 12 ÷ (inches per foot)</li>
            </ul>
            <p>
              Both reverse by division. To find millimetres per foot from a ratio, divide 304.8 by
              the ratio&apos;s second number. 1:160 gives 304.8 ÷ 160 = 1.905 mm to the foot.
            </p>
            <p>
              The{" "}
              <Link href="/scale-calculator" className={linkClass}>
                Scale Calculator
              </Link>{" "}
              performs the conversion and the scaling in one pass, without an intermediate rounding
              step.
            </p>
          </div>
        </section>

        <section aria-labelledby="awkward-heading">
          <h2 id="awkward-heading" className={h2Class}>
            Why the numbers are awkward
          </h2>
          <p>
            1:87.1 is not a number anyone would choose. Neither is 1:76.2 or 1:43.5. They exist
            because the notation came first and the ratio was derived from it afterwards.
          </p>
          <p>
            HO began as 3.5 mm to the foot — a clean figure in its own notation — and 1:87.1 is
            simply what that works out to. British OO is 4 mm to the foot, giving 1:76.2, and it
            runs on the same 16.5 mm track as HO. The track was standardised for the smaller scale
            and the bodies grew around it, which is why OO models sit on gauge that is narrow for
            their size. That compromise is eighty years old and permanent.
          </p>
          <p>
            O scale splits by geography for the same reason: 1/4 inch to the foot in North America
            gives 1:48, while 7 mm to the foot in Britain gives 1:43.5.
          </p>
          <p>
            Military and aircraft modelling mostly avoided this. 1:72 is 1/6 inch to the foot, and
            1:35 derives from no measurement convention at all — it originated as a manufacturing
            decision and became a standard because enough kits used it.
          </p>
          <p>
            The practical consequence: when a ratio looks like an odd number, it usually is one, and
            rounding it to something tidier will put you out by a visible amount on anything large.
          </p>
          {/* insertion point: link to /scale/1-87 and /scale/1-76 once those pages exist */}
        </section>

        <section aria-labelledby="confuse-heading">
          <h2 id="confuse-heading" className={h2Class}>
            Scales that are close enough to confuse
          </h2>
          <p>
            Several standard scales sit within a few percent of each other. The difference is
            invisible in a photograph and obvious on a shelf.
          </p>
          <div className="overflow-x-auto">
            <table className="td-table">
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Difference</th>
                  <th>Where it shows</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1:72 and 1:76.2</td>
                  <td>~5.8%</td>
                  <td>Vehicles beside each other; figures are near-interchangeable</td>
                </tr>
                <tr>
                  <td>1:32 and 1:35</td>
                  <td>~9.4%</td>
                  <td>Figures and crew beside a vehicle</td>
                </tr>
                <tr>
                  <td>1:48 and 1:43.5</td>
                  <td>~10.3%</td>
                  <td>Any two vehicles on the same base</td>
                </tr>
                <tr>
                  <td>1:24 and 1:25</td>
                  <td>~4.2%</td>
                  <td>Rarely — the most forgiving pair on this list</td>
                </tr>
                <tr>
                  <td>1:160, 1:150, 1:148</td>
                  <td>up to ~8.1%</td>
                  <td>Rolling stock in a consist</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Worked through: a six-foot figure is 1828.8 mm real. At 1:72 that is 25.4 mm; at 1:76.2
            it is 24.0 mm. A 1.4 mm difference — you would struggle to call it in isolation.
          </p>
          <p>
            Apply the same pair to a forty-foot vehicle, 12192 mm real. At 1:72 it is 169.3 mm; at
            1:76.2 it is 160.0 mm. Now the gap is over 9 mm, and two vehicles side by side on one
            base will not read as the same scene.
          </p>
          <p>
            The rule that follows: scale mismatch scales. Small subjects tolerate it, large subjects
            do not, and a mismatch you accepted on a figure will betray you on the vehicle it stands
            beside.
          </p>
        </section>

        <section aria-labelledby="directions-heading">
          <h2 id="directions-heading" className={h2Class}>
            Working in both directions
          </h2>

          <div className="space-y-2">
            <h3 className={h3Class}>Real to scaled</h3>
            <p>Divide the real dimension by the ratio&apos;s second number.</p>
            <p>
              A car 4500 mm long at 1:64: 4500 ÷ 64 = <strong>70.3 mm</strong>.
            </p>
            <p>
              The unit of the answer matches the unit you started in. Millimetres in, millimetres
              out. This is why the ratio&apos;s unitlessness matters — no conversion is required
              before dividing.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className={h3Class}>Scaled to real</h3>
            <p>Multiply by the ratio&apos;s second number.</p>
            <p>
              A figure measuring 38 mm at 1:35: 38 × 35 = 1330 mm, or <strong>1.33 m</strong> — about
              four foot four. Useful as a sanity check on a kit whose stated scale you doubt.
            </p>
            <p>
              A worked check with imperial: a wall 24 feet long at 1:48. Twenty-four feet is
              7315.2 mm; divided by 48 gives 152.4 mm. Because 1:48 is quarter-inch scale, the same
              answer arrives directly as 24 × 0.25 = 6 inches — and 6 inches is 152.4 mm. Two
              routes, one answer, which is how you know the notation conversion held.
            </p>
          </div>
        </section>

        <section aria-labelledby="disciplines-heading">
          <h2 id="disciplines-heading" className={h2Class}>
            Common scales by discipline
          </h2>
          <div className="overflow-x-auto">
            <table className="td-table">
              <thead>
                <tr>
                  <th>Ratio</th>
                  <th>Also written</th>
                  <th>Used for</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1:12</td><td>1 in to the foot</td><td>Doll&apos;s houses, large figures, some motorcycles</td></tr>
                <tr><td>1:24</td><td>1/2 in to the foot</td><td>Car models</td></tr>
                <tr><td>1:25</td><td>—</td><td>Car models</td></tr>
                <tr><td>1:32</td><td>3/8 in to the foot</td><td>Aircraft, farm models, some figures</td></tr>
                <tr><td>1:35</td><td>—</td><td>Military vehicles and figures</td></tr>
                <tr><td>1:43.5</td><td>7 mm to the foot</td><td>British O gauge</td></tr>
                <tr><td>1:48</td><td>1/4 in to the foot</td><td>US O gauge, aircraft, architectural presentation</td></tr>
                <tr><td>1:64</td><td>3/16 in to the foot</td><td>S gauge, mass-market diecast</td></tr>
                <tr><td>1:72</td><td>1/6 in to the foot</td><td>Aircraft, military, wargaming</td></tr>
                <tr><td>1:76.2</td><td>4 mm to the foot</td><td>British OO</td></tr>
                <tr><td>1:87.1</td><td>3.5 mm to the foot</td><td>HO</td></tr>
                <tr><td>1:96</td><td>1/8 in to the foot</td><td>Architectural, ships</td></tr>
                <tr><td>1:100 / 1:200</td><td>—</td><td>Architectural models, metric</td></tr>
                <tr><td>1:120</td><td>—</td><td>TT</td></tr>
                <tr><td>1:160</td><td>—</td><td>N (Europe and North America)</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            To check a finished dimension against a familiar object at the same scale, see the{" "}
            <Link href="/reference" className={linkClass}>
              standard object catalog
            </Link>
            .
          </p>
          {/* insertion point: link each ratio to /scale/[ratio] once those pages exist */}
        </section>

        <section aria-labelledby="errors-heading">
          <h2 id="errors-heading" className={h2Class}>
            Where the errors actually come from
          </h2>
          <p>
            Almost none of the errors in scale work are division errors. They come from the
            surrounding operations — converting units before scaling and rounding at each step,
            working from a drawing dimensioned in a system you aren&apos;t building in, or assuming a
            ratio the kit never claimed.
          </p>
          <p>
            The defence is doing the conversion and the scaling as a single operation and keeping
            full precision until you read a number off. Rounding early is where the millimetre goes.
          </p>
          {/* insertion point: link to /guides/metric-imperial-conversion-errors (guide #5) once it exists */}
          <p>
            The{" "}
            <Link href="/scale-calculator" className={linkClass}>
              Scale Calculator
            </Link>{" "}
            handles the conversion and the ratio in one step, in whichever units you have and
            whichever units you need.
          </p>
        </section>
      </LongFormShell>
    </>
  );
}
