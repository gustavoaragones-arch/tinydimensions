import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const shellClass = "mx-auto max-w-2xl flex-1 px-6 py-12";

const bodyClass =
  "td-prose leading-relaxed [&>aside]:mt-10 [&>p]:mb-6 [&>section]:space-y-3 [&>section:first-of-type]:mt-0 [&>section~section]:mt-10 [&_strong]:font-semibold";

const h1Class = "mb-6";

const h2Class = "scroll-mt-8";

const h3Class = "";

const monoNoteClass = "td-caption font-mono";

export function LongFormShell({
  title,
  eyebrow,
  breadcrumbs,
  children,
}: {
  title: string;
  eyebrow?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className={shellClass}>
      <article>
        {breadcrumbs ? <Breadcrumbs crumbs={breadcrumbs} /> : null}
        {eyebrow ? <p className={`mb-2 ${monoNoteClass}`}>{eyebrow}</p> : null}
        <h1 className={h1Class}>{title}</h1>
        <div className={bodyClass}>{children}</div>
        <p className="mt-12 text-sm">
          <Link
            href="/"
            className="font-medium underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-600 dark:decoration-neutral-500 dark:hover:decoration-neutral-300"
          >
            ← back to tinydimensions
          </Link>
        </p>
      </article>
    </div>
  );
}

export { h2Class, h3Class, monoNoteClass };
