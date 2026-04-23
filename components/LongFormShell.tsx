import Link from "next/link";

const shellClass =
  "mx-auto max-w-2xl flex-1 px-6 py-12 text-neutral-900 dark:text-neutral-100";

const bodyClass =
  "text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 [&>aside]:mt-10 [&>p]:mb-6 [&>section]:space-y-3 [&>section:first-of-type]:mt-0 [&>section~section]:mt-10 [&_strong]:font-semibold [&_strong]:text-neutral-900 dark:[&_strong]:text-neutral-100";

const h1Class =
  "mb-6 font-sans text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50";

const h2Class =
  "scroll-mt-8 font-sans text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400";

const monoNoteClass = "font-mono text-xs text-neutral-600 dark:text-neutral-400";

export function LongFormShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={shellClass}>
      <article>
        {eyebrow ? <p className={`mb-2 ${monoNoteClass}`}>{eyebrow}</p> : null}
        <h1 className={h1Class}>{title}</h1>
        <div className={bodyClass}>{children}</div>
        <p className="mt-12 font-sans text-sm">
          <Link
            href="/"
            className="font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-600 dark:text-neutral-100 dark:decoration-neutral-500 dark:hover:decoration-neutral-300"
          >
            ← back to tinydimensions
          </Link>
        </p>
      </article>
    </div>
  );
}

export { h2Class, monoNoteClass };
