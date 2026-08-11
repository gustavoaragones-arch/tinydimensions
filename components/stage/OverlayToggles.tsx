"use client";

import type { OverlayState } from "@/lib/stage/scene";

export interface OverlayTogglesProps {
  overlay: OverlayState;
  onChange: (patch: Partial<OverlayState>) => void;
}

const TOGGLES: { key: keyof OverlayState; label: string }[] = [
  { key: "thirds", label: "Thirds" },
  { key: "phi", label: "Phi" },
  { key: "centre", label: "Centre" },
  { key: "horizon", label: "Horizon" },
];

/**
 * Reference aids only. No overlay is labelled as a rule, a guide, or a recommendation -
 * the copy here stays purely descriptive of what each toggle draws.
 */
export function OverlayToggles({ overlay, onChange }: OverlayTogglesProps) {
  return (
    <div className="td-panel space-y-2 p-3 dark:bg-neutral-900/50">
      <h2 className="td-label">Overlays</h2>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Overlay toggles">
        {TOGGLES.map((toggle) => (
          <button
            key={toggle.key}
            type="button"
            onClick={() => onChange({ [toggle.key]: !overlay[toggle.key] })}
            aria-pressed={overlay[toggle.key]}
            className="td-chip !min-h-0 !px-3 !py-1.5 text-xs"
          >
            {toggle.label}
          </button>
        ))}
      </div>
      <p className="text-[0.65rem] leading-relaxed text-neutral-500 dark:text-neutral-400">
        Reference lines only, drawn over the image. They don&apos;t affect the scene.
      </p>
    </div>
  );
}
