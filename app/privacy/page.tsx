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
          <strong>Usage data:</strong> We use{" "}
          <a
            href="https://vercel.com/docs/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-600 dark:text-neutral-100 dark:decoration-neutral-500 dark:hover:decoration-neutral-300"
          >
            Vercel Analytics
          </a>{" "}
          to collect anonymized data such as page views and common scale selections to improve the
          tool&apos;s performance. Vercel processes this data according to its own policies and
          infrastructure safeguards.
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
