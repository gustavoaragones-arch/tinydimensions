import type { Metadata } from "next";
import Link from "next/link";
import { h2Class, h3Class } from "@/components/LongFormShell";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export const metadata: Metadata = {
  title: {
    absolute: "TinyDimensions — Precision Tools for Scale Model Builders",
  },
  description:
    "Convert real dimensions to any scale across metric and imperial units, then stage your build from the angle it will actually be viewed. Free browser tools.",
  alternates: {
    canonical: `${base}/`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${base}/#webpage`,
      url: `${base}/`,
      name: "TinyDimensions — Precision Tools for Scale Model Builders",
      description:
        "Convert real dimensions to any scale across metric and imperial units, then stage your build from the angle it will actually be viewed. Free browser tools.",
      isPartOf: { "@id": `${base}/#website` },
      about: { "@id": `${base}/#organization` },
      publisher: { "@id": "https://albordigital.com/#organization" },
      inLanguage: "en",
    },
  ],
};

const linkClass =
  "font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-600 dark:text-neutral-100 dark:decoration-neutral-500 dark:hover:decoration-neutral-300";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex flex-1 flex-col bg-neutral-50 dark:bg-neutral-950">
        <div className="mx-auto w-full max-w-2xl px-6 py-12 text-neutral-900 dark:text-neutral-100">
          <header>
            <h1 className="mb-4 font-sans text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              Precision tools for scale model builders
            </h1>
            <p className="mb-10 max-w-prose text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              Convert the dimensions, block the scene, build it. A scale calculator that handles
              metric and imperial in the same calculation, and a staging tool that shows you the
              scene from where it will actually be seen.
            </p>
          </header>

          <section aria-labelledby="tools-heading" className="mb-12">
            <h2 id="tools-heading" className={`${h2Class} mb-4`}>
              The tools
            </h2>

            <div className="space-y-4">
              <Link
                href="/scale-calculator"
                className="td-panel block p-5 transition-shadow hover:shadow-md dark:bg-neutral-900/50"
              >
                <h3 className={`${h3Class} text-base`}>Scale Calculator</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  Enter a real-world dimension and a ratio, get the scaled figure to three decimal
                  places. Input in feet, output in millimetres, or any other combination — the
                  conversion and the scaling happen in one step rather than two. Presets cover
                  architecture, model railroading, diecast, and tabletop scales, and results are
                  drawn against familiar objects at the same scale so you can see whether a number
                  is plausible before you cut.
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Open the calculator →
                </span>
              </Link>

              <Link
                href="/stage"
                className="td-panel block p-5 transition-shadow hover:shadow-md dark:bg-neutral-900/50"
              >
                <h3 className={h3Class}>Stage</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  Block out a diorama with proxy volumes, set the dimensions, then look at it from
                  where it will actually be viewed: a shelf above eye level, a competition table you
                  stand over, a display case. Composition overlays are available as optional
                  reference aids.
                </p>
              </Link>
            </div>
          </section>

          <section aria-labelledby="how-heading" className="mb-12 space-y-6">
            <h2 id="how-heading" className={h2Class}>
              How scale works
            </h2>

            <div className="space-y-3">
              <h3 className={h3Class}>Reading a scale ratio</h3>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                A scale ratio is a division instruction. In 1:87, one unit on the model represents
                87 of the same unit in the real world — 87 millimetres becomes 1 millimetre, 87
                feet becomes 1 foot. The units on both sides are always identical, which is what
                makes the ratio itself unitless and portable between measurement systems.
              </p>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                Written as a fraction, 1/87, it behaves the same way: multiply a real dimension by
                the fraction to scale down, divide to scale up. Larger denominators mean smaller
                models. 1:12 is a doll&apos;s house; 1:160 fits a mainline locomotive in the palm
                of your hand.
              </p>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                The ratio tells you nothing about the size of the finished piece on its own. A 1:35
                figure is roughly 50 mm tall; a 1:35 tank is roughly 250 mm long. Same scale, very
                different bench space.
              </p>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                For the four notations that ratio gets written in, why so many of the standard
                numbers are awkward, and which scales sit close enough to confuse, see{" "}
                <Link href="/guides/reading-scale-ratios" className={linkClass}>
                  Reading scale ratios: notation, awkward numbers, and near-identical scales
                </Link>
                .
              </p>
            </div>

            <div className="space-y-3">
              <h3 className={h3Class}>Where mixed units go wrong</h3>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                Most scale errors are not arithmetic errors. They are unit errors that survive the
                arithmetic intact.
              </p>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">The common shapes:</p>
              <ul className="list-none space-y-3 pl-0 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                <li>
                  <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Converting and scaling as separate operations.
                  </strong>{" "}
                  Reducing 24 feet to 1:48 by first converting to millimetres, then dividing, then
                  rounding to something convenient, then converting again for the ruler you happen
                  to be holding. Each conversion is correct; the accumulated rounding is not.
                </li>
                <li>
                  <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Reference material in a system you aren&apos;t working in.
                  </strong>{" "}
                  A drawing dimensioned in inches, a kit moulded to metric, a base cut from imperial
                  stock. Nothing is wrong with any of them individually.
                </li>
                <li>
                  <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Ratios that aren&apos;t the ones you assume.
                  </strong>{" "}
                  1:76 and 1:72 are close enough to look interchangeable in a photograph and far
                  enough apart to be obvious side by side on a shelf. So are 1:48 and 1:43.
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                The defence is doing the whole conversion in one operation, and keeping full
                precision until the moment you actually read a number off. Rounding early is where
                the millimetre goes.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className={h3Class}>Scale, bases, and display height</h3>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                Scaled dimensions determine the model. They do not determine the base, and they do
                not determine what the finished piece looks like to someone standing in front of
                it.
              </p>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                Base size is a composition decision that starts from the model&apos;s footprint and
                adds working room — space for groundwork, for a second figure, for the eye to settle
                before it reaches the edge. There is no ratio that produces it.
              </p>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                Display height is the part most often left until the model is finished. A diorama
                built flat on a bench and then placed on a shelf at 1600 mm is seen from below, at
                an angle it was never composed for. Elements that read clearly from above disappear
                behind each other. Nothing about the scale conversion predicts this — it is a
                function of where the piece ends up, which is why it is worth deciding before the
                groundwork goes down.
              </p>
            </div>
          </section>

          <section aria-labelledby="reference-heading">
            <h2 id="reference-heading" className={`${h2Class} mb-4`}>
              Reference and guides
            </h2>
            <ul className="list-none space-y-2 pl-0 text-sm">
              <li>
                <Link href="/catalog" className={linkClass}>
                  Common object dimensions for scale comparison
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
