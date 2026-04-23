import type { ScaleCategory } from "@/lib/math-engine";
import { TOOL_SPONSORSHIP_BY_CATEGORY } from "@/lib/tool-sponsorship";

export interface ToolsSponsorshipProps {
  category: ScaleCategory;
}

export function ToolsSponsorship({ category }: ToolsSponsorshipProps) {
  const cfg = TOOL_SPONSORSHIP_BY_CATEGORY[category];

  return (
    <aside
      className="rounded-md border border-dashed border-neutral-300 bg-neutral-50/80 px-3 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900/50"
      aria-label="Recommended tools"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Recommended tools
      </p>
      <p className="mt-1 text-neutral-800 dark:text-neutral-200">{cfg.headline}</p>
      <a
        href={cfg.href}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-600 dark:text-neutral-100 dark:decoration-neutral-500 dark:hover:decoration-neutral-300"
      >
        {cfg.productLabel}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </aside>
  );
}
