import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white text-neutral-800 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <p className="text-sm font-medium tracking-tight text-neutral-900 lowercase dark:text-neutral-100">
          tinydimensions <span className="text-neutral-400">/</span> albor digital
        </p>
        <p className="mt-2 max-w-2xl text-xs text-neutral-700 dark:text-neutral-300">
          Results are for hobbyist and educational use. Verify dimensions before professional
          construction.
        </p>
        <nav
          className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-700 underline-offset-4 dark:text-neutral-300"
          aria-label="Site and legal"
        >
          <Link className="hover:underline" href="/">
            Home
          </Link>
          <Link className="hover:underline" href="/catalog">
            Catalog
          </Link>
          <Link className="hover:underline" href="/about">
            About
          </Link>
          <Link className="hover:underline" href="/terms">
            Terms
          </Link>
          <Link className="hover:underline" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:underline" href="/disclaimer">
            Disclaimer
          </Link>
        </nav>
        <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">
          © 2026 Albor Digital LLC
        </p>
      </div>
    </footer>
  );
}
