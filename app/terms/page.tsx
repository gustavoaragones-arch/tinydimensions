import type { Metadata } from "next";
import { LongFormShell, h2Class, h3Class, monoNoteClass } from "@/components/LongFormShell";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for TinyDimensions.com, a property of Albor Digital LLC.",
  alternates: { canonical: `${base}/terms` },
};

export default function TermsPage() {
  return (
    <LongFormShell title="Terms of Service" eyebrow="Last updated: April 2026">
      <section aria-labelledby="accept-heading">
        <h2 id="accept-heading" className={h2Class}>
          1. Acceptance of terms
        </h2>
        <p>
          By accessing or using TinyDimensions.com, a property of <strong>Albor Digital LLC</strong>{" "}
          (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of
          Service. If you do not agree, please do not use the tool.
        </p>
      </section>

      <section aria-labelledby="use-heading">
        <h2 id="use-heading" className={h2Class}>
          2. Use of the service
        </h2>
        <p>
          TinyDimensions provides a measurement conversion utility for educational, architectural, and
          hobbyist purposes. You agree to use the service only for lawful purposes.
        </p>
      </section>

      <section aria-labelledby="ip-heading">
        <h2 id="ip-heading" className={h2Class}>
          3. Intellectual property
        </h2>
        <p>
          The &quot;TinyDimensions&quot; brand, logo, and the custom code powering the measurement
          engine are the exclusive property of Albor Digital LLC.
        </p>
      </section>

      <section aria-labelledby="liability-heading">
        <h2 id="liability-heading" className={h2Class}>
          4. Limitation of liability
        </h2>
        <p>
          TinyDimensions is provided &quot;as is&quot; without any warranties. While we strive for extreme
          precision, we are not liable for any errors in construction, manufacturing, or design
          resulting from the use of this tool.
        </p>
      </section>

      <section aria-labelledby="termination-heading">
        <h2 id="termination-heading" className={h2Class}>
          5. Termination
        </h2>
        <p>
          We reserve the right to modify or terminate the service at any time without notice.
        </p>
      </section>

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading" className={h2Class}>
          Contact
        </h2>
        <p className={monoNoteClass}>
          <a href="mailto:contact@tinydimensions.com" className="underline underline-offset-2">
            contact@tinydimensions.com
          </a>
        </p>
      </section>

      <section aria-labelledby="disclaimer-heading">
        <h2 id="disclaimer-heading" className={h2Class}>
          6. Disclaimer
        </h2>
        <p className="font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Responsible use &amp; AI disclosure
        </p>

        <div className="mt-3 space-y-3">
          <h3 id="edu-heading" className={h3Class}>
            6.1. Educational &amp; hobbyist use only
          </h3>
          <p>
            TinyDimensions is intended for use by hobbyists, students, and as a secondary reference for
            architectural modeling. It is not a substitute for professional engineering software or
            certified physical measuring tools.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <h3 id="info-heading" className={h3Class}>
            6.2. &quot;Informational use only&quot; (Responsible AI policy)
          </h3>
          <p>
            As per the Albor Digital Responsible AI Policy, any automated object data or scale
            suggestions provided by this tool are for informational purposes only. Users retain full
            responsibility for verifying dimensions before committing to physical construction or
            professional manufacturing.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <h3 id="links-heading" className={h3Class}>
            6.3. External links
          </h3>
          <p>
            Our &quot;Recommended Tools&quot; sections may contain affiliate links. We may earn a small
            commission at no extra cost to you if you purchase through these links. This helps keep
            TinyDimensions free and ad-light.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <h3 id="advice-heading" className={h3Class}>
            6.4. No professional advice
          </h3>
          <p>
            Usage of this tool does not establish a professional-client relationship. Albor Digital LLC
            is an independent product studio and does not provide custom consulting or engineering
            services.
          </p>
        </div>

        <aside
          className="mt-8 rounded-lg border-2 border-amber-600/45 bg-amber-50 p-6 shadow-sm dark:border-amber-500/50 dark:bg-amber-950/35 dark:shadow-none"
          aria-labelledby="responsible-ai-footer"
        >
          <h3
            id="responsible-ai-footer"
            className="font-sans text-xs font-semibold uppercase tracking-wide text-amber-950 dark:text-amber-100"
          >
            Responsible AI
          </h3>
          <p className="mt-3 font-mono text-sm font-medium leading-relaxed text-amber-950 dark:text-amber-50 md:text-base">
            Results are for educational and hobbyist use only. Verify dimensions for professional
            construction.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-amber-950/90 dark:text-amber-100/90">
            Automated suggestions and catalog data are informational only — confirm every dimension
            before you build or manufacture.
          </p>
        </aside>
      </section>
    </LongFormShell>
  );
}
