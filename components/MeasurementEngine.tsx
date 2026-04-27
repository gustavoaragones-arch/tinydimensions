"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { LengthUnit, ScalePreset } from "@/lib/math-engine";
import { ScaleVisualizer } from "@/components/ScaleVisualizer";
import {
  mmToAllUnits,
  normalizeToMm,
  realMmToScaledMm,
  roundAllUnits3,
  SCALE_PRESETS,
} from "@/lib/math-engine";

const LENGTH_UNITS: LengthUnit[] = ["mm", "cm", "m", "in", "ft"];

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
      <header className="mb-6">
        <h1 className="font-sans text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
          Convert &amp; compare
        </h1>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          Set real length, unit, and drawing scale — then read the scaled strip and workbench.
        </p>
      </header>

      <div className="td-panel space-y-6 p-4 dark:bg-neutral-900/50">
        <section className="space-y-3" aria-labelledby={`${valueId}-legend`}>
          <h2 id={`${valueId}-legend`} className="sr-only">
            Source measurement
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={valueId} className="td-label">
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
                className="td-field td-field--mono"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={unitId} className="td-label">
                Unit
              </label>
              <select
                id={unitId}
                name="realUnit"
                value={unit}
                onChange={(e) => onUnitChange(e.target.value as LengthUnit)}
                className="td-field td-field--select"
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
          <label htmlFor={scaleId} className="td-label">
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
            className="td-field td-field--select"
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
        </section>

        <section className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="td-label">Scaled result</h2>
              <button
                type="button"
                onClick={() => void handleCopy()}
                disabled={!copyText}
                aria-describedby={copied ? copyStatusId : undefined}
                className="td-btn-icon"
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
              className="td-readout"
            >
              {resultLine ?? "—"}
            </output>
          </div>
          <div className="mt-10">
            <ScaleVisualizer scaledValueMm={scaledMm} resultLabel={activeCatalogLabel} />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Same model length expressed in mm, cm, m, in, and ft at {scale.label}.
          </p>
        </section>
      </div>
    </main>
  );
}
