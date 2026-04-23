"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { LengthUnit, ScalePreset } from "@/lib/math-engine";
import { ScaleVisualizer } from "@/components/ScaleVisualizer";
import { ToolsSponsorship } from "@/components/ToolsSponsorship";
import {
  mmToAllUnits,
  normalizeToMm,
  realMmToScaledMm,
  roundAllUnits3,
  SCALE_PRESETS,
} from "@/lib/math-engine";

const LENGTH_UNITS: LengthUnit[] = ["mm", "cm", "m", "in", "ft"];

const touchControlClass =
  "min-h-11 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:ring-neutral-500";

function formatUnitLine(units: ReturnType<typeof roundAllUnits3>): string {
  return `${units.mm}mm / ${units.cm}cm / ${units.m}m / ${units.in}in / ${units.ft}ft`;
}

function ClipboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.586-1.414l-2.242-2.242A2 2 0 0015.758 3H10a2 2 0 00-2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface MeasurementEngineProps {
  rawValue: string;
  unit: LengthUnit;
  scale: ScalePreset;
  activeCatalogLabel: string | null;
  onRawValueChange: (value: string) => void;
  onUnitChange: (unit: LengthUnit) => void;
  onScaleChange: (scale: ScalePreset) => void;
}

export function MeasurementEngine({
  rawValue,
  unit,
  scale,
  activeCatalogLabel,
  onRawValueChange,
  onUnitChange,
  onScaleChange,
}: MeasurementEngineProps) {
  const baseId = useId();
  const valueId = `${baseId}-value`;
  const unitId = `${baseId}-unit`;
  const scaleId = `${baseId}-scale`;
  const copyStatusId = `${baseId}-copy-status`;

  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { resultLine, scaledMm, copyText } = useMemo(() => {
    const parsed = Number.parseFloat(rawValue.replace(",", "."));
    if (!Number.isFinite(parsed)) {
      return {
        resultLine: null as string | null,
        scaledMm: null as number | null,
        copyText: null as string | null,
      };
    }
    const realMm = normalizeToMm(parsed, unit);
    const scaledMm = realMmToScaledMm(realMm, scale.denominator);
    const rounded = roundAllUnits3(mmToAllUnits(scaledMm));
    const copyText = `${rounded.mm} mm (${scale.label} scale)`;
    return { resultLine: formatUnitLine(rounded), scaledMm, copyText };
  }, [rawValue, unit, scale]);

  const handleCopy = useCallback(async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      if (copyResetRef.current) clearTimeout(copyResetRef.current);
      copyResetRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [copyText]);

  return (
    <main className="mx-auto w-full max-w-none text-neutral-900 dark:text-neutral-100">
      <header className="mb-8 space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Measurement engine</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Real-world length to model size using a fixed scale. Results rounded to three decimal
          places.
        </p>
      </header>

      <div className="space-y-6 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
        <section className="space-y-3" aria-labelledby={`${valueId}-legend`}>
          <h2 id={`${valueId}-legend`} className="sr-only">
            Source measurement
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor={valueId}
                className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
              >
                Real-world value
              </label>
              <input
                id={valueId}
                name="realValue"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={rawValue}
                onChange={(e) => onRawValueChange(e.target.value)}
                className={`${touchControlClass} font-mono tabular-nums`}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={unitId}
                className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
              >
                Unit
              </label>
              <select
                id={unitId}
                name="realUnit"
                value={unit}
                onChange={(e) => onUnitChange(e.target.value as LengthUnit)}
                className={touchControlClass}
              >
                {LENGTH_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Feet are decimal feet (e.g. 5′11″ ≈ 5.917 ft).
          </p>
        </section>

        <section className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <label
            htmlFor={scaleId}
            className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            Scale
          </label>
          <select
            id={scaleId}
            name="scale"
            value={scale.id}
            onChange={(e) => {
              const next = SCALE_PRESETS.find((p) => p.id === e.target.value);
              if (next) onScaleChange(next);
            }}
            className={touchControlClass}
          >
            <optgroup label="Architectural">
              {SCALE_PRESETS.filter((p) => p.category === "architectural").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Hobbyist">
              {SCALE_PRESETS.filter((p) => p.category === "hobbyist").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </optgroup>
          </select>
          <ToolsSponsorship category={scale.category} />
        </section>

        <section className="space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div className="flex min-h-11 items-center justify-between gap-2">
            <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Scaled result
            </h2>
            <button
              type="button"
              onClick={() => void handleCopy()}
              disabled={!copyText}
              aria-describedby={copied ? copyStatusId : undefined}
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-md border border-neutral-300 bg-white px-2 text-neutral-800 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
              aria-label="Copy scaled result to clipboard"
            >
              <ClipboardIcon />
              <span className="sr-only">Copy</span>
            </button>
          </div>
          <span id={copyStatusId} className="sr-only" aria-live="polite">
            {copied ? "Copied to clipboard" : ""}
          </span>
          <output
            htmlFor={`${valueId} ${unitId} ${scaleId}`}
            aria-live="polite"
            className="block min-h-11 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-sm leading-normal tabular-nums text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
          >
            {resultLine ?? "—"}
          </output>
          <ScaleVisualizer scaledValueMm={scaledMm} resultLabel={activeCatalogLabel} />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Same model length expressed in mm, cm, m, in, and ft at {scale.label}.
          </p>
        </section>
      </div>
    </main>
  );
}
