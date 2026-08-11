import Image from "next/image";
import Link from "next/link";

const navLinkClass =
  "td-nav-link rounded-md px-2 py-1.5 text-sm font-medium tracking-tight transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900";

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-100 dark:border-neutral-800">
      <div className="mx-auto max-w-5xl px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="td-nav-link flex shrink-0 items-center gap-3 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-500"
          >
            <Image
              src="/logo.svg"
              alt="TinyDimensions"
              width={40}
              height={40}
              priority
              className="size-10 shrink-0"
            />
            <span className="text-lg font-semibold tracking-tighter lowercase">
              tinydimensions
            </span>
          </Link>
          <nav className="flex flex-wrap gap-1" aria-label="Primary">
            <Link href="/" className={navLinkClass}>
              Home
            </Link>
            <Link href="/scale-calculator" className={navLinkClass}>
              Calculator
            </Link>
            <Link href="/stage" className={navLinkClass}>
              Stage
            </Link>
            <Link href="/reference" className={navLinkClass}>
              Reference
            </Link>
            <Link href="/guides" className={navLinkClass}>
              Guides
            </Link>
            <Link href="/about" className={navLinkClass}>
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
