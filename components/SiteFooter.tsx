import Link from "next/link";

const footerNavLinkClass = "td-nav-link hover:underline";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        <p className="text-sm font-medium tracking-tight lowercase">tinydimensions</p>
        <p className="td-caption mt-2 max-w-2xl">
          Results are for hobbyist and educational use. Verify dimensions before professional
          construction.
        </p>
        <nav
          className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm underline-offset-4"
          aria-label="Site and legal"
        >
          <Link className={footerNavLinkClass} href="/">
            Home
          </Link>
          <Link className={footerNavLinkClass} href="/scale-calculator">
            Calculator
          </Link>
          <Link className={footerNavLinkClass} href="/stage">
            Stage
          </Link>
          <Link className={footerNavLinkClass} href="/reference">
            Reference
          </Link>
          <Link className={footerNavLinkClass} href="/guides">
            Guides
          </Link>
          <Link className={footerNavLinkClass} href="/about">
            About
          </Link>
          <Link className={footerNavLinkClass} href="/terms">
            Terms
          </Link>
          <Link className={footerNavLinkClass} href="/privacy">
            Privacy
          </Link>
          <Link className={footerNavLinkClass} href="/terms#disclaimer-heading">
            Disclaimer
          </Link>
        </nav>
        <p className="td-caption mt-6">© 2026 Albor Digital LLC</p>
      </div>
    </footer>
  );
}
