import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms of use for TinyDimensions by Albor Digital.",
  alternates: { canonical: `${base}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-10 text-neutral-900 dark:text-neutral-100">
      <main>
        <h1 className="text-2xl font-semibold tracking-tight">Terms of use</h1>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          This page is a placeholder. The governing terms for Albor Digital products are provided in{" "}
          <span className="font-mono text-neutral-800 dark:text-neutral-200">
            Albor_Digital_Legal_Documents.pdf
          </span>
          . Replace this route with your finalized policy text when ready.
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
