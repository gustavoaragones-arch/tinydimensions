import Image from "next/image";
import Link from "next/link";

const MISSION =
  "Measurement engine: Real-world length to model size using a fixed scale. Results rounded to three decimal places.";

const navLinkClass =
  "rounded-md px-2 py-1.5 text-sm font-medium tracking-tight text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white";

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-3 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-500"
            >
              <Image
                src="/logo.svg"
                alt="TinyDimensions"
                width={40}
                height={40}
                priority
                className="size-10 shrink-0"
              />
              <span className="font-sans text-lg font-semibold tracking-tighter text-neutral-900 lowercase dark:text-neutral-50">
                tinydimensions
              </span>
            </Link>
          </div>
          <p className="max-w-prose text-sm font-normal leading-relaxed text-neutral-600 md:max-w-md md:text-right dark:text-neutral-500">
            {MISSION}
          </p>
        </div>
        <nav
          className="mt-4 flex flex-wrap gap-1 border-t border-neutral-100 pt-4 dark:border-neutral-800/80"
          aria-label="Primary"
        >
          <Link href="/" className={navLinkClass}>
            Home
          </Link>
          <Link href="/catalog" className={navLinkClass}>
            Catalog
          </Link>
          <Link href="/about" className={navLinkClass}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
