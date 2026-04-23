import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer for TinyDimensions by Albor Digital.",
  alternates: { canonical: `${base}/disclaimer` },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-10 text-neutral-900 dark:text-neutral-100">
      <main>
        <h1 className="text-2xl font-semibold tracking-tight">Disclaimer</h1>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          This page is a placeholder. Product disclaimers and limitations are summarized in{" "}
          <span className="font-mono text-neutral-800 dark:text-neutral-200">
            Albor_Digital_Legal_Documents.pdf
          </span>{" "}
          and the responsible use posture in{" "}
          <span className="font-mono text-neutral-800 dark:text-neutral-200">
            Albor_Digital_Responsible_AI_Policy.pdf
          </span>
          .
        </p>
        <p className="mt-4 text-sm text-neutral-700 dark:text-neutral-300">
          Results are for educational and hobbyist use only. Verify dimensions for professional
          construction.
        </p>
        <p className="mt-6">
          <Link href="/" className="text-sm font-medium text-neutral-900 underline dark:text-neutral-100">
            Back to TinyDimensions
          </Link>
        </p>
      </main>
    </div>
  );
}
