import type { Metadata } from "next";
import { LongFormShell, h2Class } from "@/components/LongFormShell";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export const metadata: Metadata = {
  title: "About",
  description:
    "TinyDimensions is a scale-aware measurement engine created by Albor Digital LLC — precision for the smallest details.",
  alternates: { canonical: `${base}/about` },
};

export default function AboutPage() {
  return (
    <LongFormShell title="Precision for the Smallest Details.">
      <section aria-labelledby="mission-heading">
        <h2 id="mission-heading" className={h2Class}>
          Our mission
        </h2>
        <p>
          TinyDimensions was built to solve a specific &quot;micro-friction&quot; in the lives of creators.
          Whether you are an architect scaling a floor plan, a student building a model, or a hobbyist
          crafting a 1:87 scale diorama, the mental math required to convert real-world dimensions into
          miniature scales can be a constant distraction.
        </p>
        <p>
          TinyDimensions is a <strong>Scale-Aware Measurement Engine</strong>. We go beyond simple
          conversion by providing visual spatial context, allowing you to see how your scaled object
          compares to common items like a coin or a credit card.
        </p>
      </section>

      <section aria-labelledby="caliper-heading">
        <h2 id="caliper-heading" className={h2Class}>
          The caliper philosophy
        </h2>
        <p>
          We believe utility tools should be like a digital caliper: tactile, precise, and fast.
          TinyDimensions is a product of <strong>Albor Digital LLC</strong>, an independent digital
          product studio focused on building high-consistency tools that solve real problems with
          minimal bloat.
        </p>
      </section>
    </LongFormShell>
  );
}
