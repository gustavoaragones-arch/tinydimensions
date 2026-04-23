import type { Metadata } from "next";
import { LongFormShell, h2Class, monoNoteClass } from "@/components/LongFormShell";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for TinyDimensions — privacy-first measurement tools by Albor Digital LLC.",
  alternates: { canonical: `${base}/privacy` },
};

export default function PrivacyPage() {
  return (
    <LongFormShell title="Privacy Policy" eyebrow="Effective date: January 1, 2026">
      <section aria-labelledby="collection-heading">
        <h2 id="collection-heading" className={h2Class}>
          1. Data collection
        </h2>
        <p>TinyDimensions is designed with a &quot;Privacy-First&quot; mindset.</p>
        <p>
          <strong>Personal data:</strong> We do not require an account or collect personal identifiers
          (names, addresses) to use the engine.
        </p>
        <p>
          <strong>Usage data:</strong> We use Vercel Analytics to collect anonymized data such as page
          views and common scale selections to improve the tool&apos;s performance.
        </p>
      </section>

      <section aria-labelledby="cookies-heading">
        <h2 id="cookies-heading" className={h2Class}>
          2. Cookies
        </h2>
        <p>
          We use strictly necessary cookies to maintain your unit preferences (e.g., keeping the engine
          set to metric or imperial) during your session.
        </p>
      </section>

      <section aria-labelledby="third-heading">
        <h2 id="third-heading" className={h2Class}>
          3. Third-party services
        </h2>
        <p>
          We may use third-party analytics and affiliate networks (such as Amazon Associates). These
          services have their own privacy policies regarding tracking.
        </p>
      </section>

      <section aria-labelledby="rights-heading">
        <h2 id="rights-heading" className={h2Class}>
          4. Your rights
        </h2>
        <p>
          Since we do not store personal profiles, there is no data to delete or port. For any privacy
          inquiries, contact us at{" "}
          <a
            href="mailto:contact@tinydimensions.com"
            className={`${monoNoteClass} underline underline-offset-2`}
          >
            contact@tinydimensions.com
          </a>
          .
        </p>
      </section>
    </LongFormShell>
  );
}
