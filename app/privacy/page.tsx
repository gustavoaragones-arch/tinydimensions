import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for TinyDimensions by Albor Digital.",
  alternates: { canonical: `${base}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-10 text-neutral-900 dark:text-neutral-100">
      <main>
        <h1 className="text-2xl font-semibold tracking-tight">Privacy</h1>
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          This page is a placeholder. Privacy commitments and data practices for Albor Digital are
          documented in{" "}
          <span className="font-mono text-neutral-800 dark:text-neutral-200">
            Albor_Digital_Legal_Documents.pdf
          </span>
          . Replace this route with your finalized privacy policy when ready.
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
