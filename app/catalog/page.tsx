import type { Metadata } from "next";
import Link from "next/link";
import { LongFormShell, h2Class } from "@/components/LongFormShell";
import { CATALOG_CATEGORIES, CATALOG_OBJECTS } from "@/lib/object-catalog";
import { getSiteUrl } from "@/lib/site-url";

const base = getSiteUrl();

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Standard real-world reference lengths used in TinyDimensions — doors, ceilings, vehicles, and tabletop gaming.",
  alternates: { canonical: `${base}/catalog` },
};

export default function CatalogPage() {
  return (
    <LongFormShell title="Standard object catalog">
      <p>
        Reference lengths used by the quick-load catalog on the home page. To apply a value in the
        engine, open{" "}
        <Link
          href="/#catalog"
          className="font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-600 dark:text-neutral-100 dark:decoration-neutral-500 dark:hover:decoration-neutral-300"
        >
          Home → catalog
        </Link>
        .
      </p>

      {CATALOG_CATEGORIES.map((cat) => {
        const items = CATALOG_OBJECTS.filter((o) => o.category === cat.id);
        return (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
            <h2 id={`cat-${cat.id}`} className={h2Class}>
              {cat.label}
            </h2>
            <ul className="list-none space-y-3 pl-0">
              {items.map((obj) => (
                <li
                  key={obj.id}
                  className="rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-3 dark:border-neutral-700 dark:bg-neutral-900/40"
                >
                  <p className="font-sans text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    {obj.label}
                  </p>
                  <p className="mt-1 font-mono text-xs tabular-nums text-neutral-700 dark:text-neutral-300">
                    {obj.valueMm} mm
                  </p>
                  {obj.notes ? (
                    <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {obj.notes}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </LongFormShell>
  );
}
