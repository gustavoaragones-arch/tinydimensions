import type { Metadata } from "next";
import { LongFormShell, h2Class } from "@/components/LongFormShell";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer and responsible use for TinyDimensions — educational and hobbyist reference only.",
  alternates: { canonical: `${base}/disclaimer` },
};

export default function DisclaimerPage() {
  return (
    <LongFormShell title="Disclaimer">
      <p className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Responsible use &amp; AI disclosure
      </p>

      <section aria-labelledby="edu-heading">
        <h2 id="edu-heading" className={h2Class}>
          1. Educational &amp; hobbyist use only
        </h2>
        <p>
          TinyDimensions is intended for use by hobbyists, students, and as a secondary reference for
          architectural modeling. It is not a substitute for professional engineering software or
          certified physical measuring tools.
        </p>
      </section>

      <section aria-labelledby="info-heading">
        <h2 id="info-heading" className={h2Class}>
          2. &quot;Informational use only&quot; (Responsible AI policy)
        </h2>
        <p>
          As per the Albor Digital Responsible AI Policy, any automated object data or scale
          suggestions provided by this tool are for informational purposes only. Users retain full
          responsibility for verifying dimensions before committing to physical construction or
          professional manufacturing.
        </p>
      </section>

      <section aria-labelledby="links-heading">
        <h2 id="links-heading" className={h2Class}>
          3. External links
        </h2>
        <p>
          Our &quot;Recommended Tools&quot; sections may contain affiliate links. We may earn a small
          commission at no extra cost to you if you purchase through these links. This helps keep
          TinyDimensions free and ad-light.
        </p>
      </section>

      <section aria-labelledby="advice-heading">
        <h2 id="advice-heading" className={h2Class}>
          4. No professional advice
        </h2>
        <p>
          Usage of this tool does not establish a professional-client relationship. Albor Digital LLC
          is an independent product studio and does not provide custom consulting or engineering
          services.
        </p>
      </section>

      <aside
        className="mt-12 rounded-md border border-neutral-300 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/60"
        aria-labelledby="responsible-ai-footer"
      >
        <h2 id="responsible-ai-footer" className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-400">
          Responsible AI
        </h2>
        <p className="mt-2 font-mono text-xs leading-relaxed text-neutral-800 dark:text-neutral-200">
          Results are for educational and hobbyist use only. Verify dimensions for professional
          construction.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
          Automated suggestions and catalog data are informational only — confirm every dimension
          before you build or manufacture.
        </p>
      </aside>
    </LongFormShell>
  );
}
