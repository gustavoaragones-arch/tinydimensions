import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

const linkClass = "underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-600 dark:decoration-neutral-500 dark:hover:decoration-neutral-300";

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="td-caption flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? (
                <span aria-hidden="true">/</span>
              ) : null}
              {crumb.href && !isLast ? (
                // The linked ancestors are the one place breadcrumb text departs from
                // --td-graphite: they're interactive, so they take --td-signal like any
                // other link, via the site-wide `a:not([class*="td-btn"])` rule.
                <Link href={crumb.href} className={linkClass}>
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>{crumb.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
