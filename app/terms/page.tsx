import type { Metadata } from "next";
import { LongFormShell, h2Class, monoNoteClass } from "@/components/LongFormShell";
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
    </LongFormShell>
  );
}
