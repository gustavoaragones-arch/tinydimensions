"use client";

import { useId, useMemo, useState } from "react";
import {
  filterScalePresets,
  SCALE_CATEGORY_LABELS,
  SCALE_CATEGORY_ORDER,
  SCALE_PRESETS,
  type ScalePreset,
} from "@/lib/math-engine";

export interface ScalePickerProps {
  value: ScalePreset;
  onChange: (preset: ScalePreset) => void;
  /** id of the heading/label this picker is described by. */
  labelledBy?: string;
}

export function ScalePicker({ value, onChange, labelledBy }: ScalePickerProps) {
  const baseId = useId();
  const searchId = `${baseId}-scale-search`;

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => filterScalePresets(SCALE_PRESETS, query), [query]);

  const sections = useMemo(
    () =>
      SCALE_CATEGORY_ORDER.map((category) => ({
        category,
        heading: SCALE_CATEGORY_LABELS[category],
        presets: filtered
          .filter((p) => p.categories.includes(category))
          .slice()
          .sort((a, b) => a.ratio - b.ratio),
      })).filter((section) => section.presets.length > 0),
    [filtered],
  );

  return (
    <div className="space-y-3" role="group" aria-labelledby={labelledBy}>
      <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
        Selected:{" "}
        <span className="font-mono font-medium text-neutral-950 dark:text-neutral-50">
          {value.label}
        </span>
        {value.name ? (
          <span className="text-neutral-500 dark:text-neutral-400"> ({value.name})</span>
        ) : null}
      </p>

      <div className="space-y-2">
        <label htmlFor={searchId} className="td-label">
          Filter scales
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="HO, 1:87, quarter inch…"
          className="td-field"
        />
      </div>

      <div className="td-panel max-h-72 space-y-4 overflow-y-auto p-3 dark:bg-neutral-900/50">
        {sections.map((section) => (
          <div key={section.category}>
            <h3 className="td-label">{section.heading}</h3>
            <ul className="mt-1.5 space-y-1">
              {section.presets.map((preset) => {
                const selected = preset.ratio === value.ratio;
                return (
                  <li key={preset.ratio}>
                    <button
                      type="button"
                      onClick={() => onChange(preset)}
                      aria-pressed={selected}
                      className={[
                        "td-catalog-item flex-row items-center justify-between gap-3 text-left",
                        selected
                          ? "border-neutral-900 bg-neutral-100 dark:border-neutral-100 dark:bg-neutral-800"
                          : "",
                      ].join(" ")}
                    >
                      <span className="font-mono text-sm tabular-nums text-neutral-900 dark:text-neutral-100">
                        {preset.label}
                      </span>
                      {preset.name ? (
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {preset.name}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {sections.length === 0 ? (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            No scales match this filter.
          </p>
        ) : null}
      </div>
    </div>
  );
}
