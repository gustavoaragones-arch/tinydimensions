"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { LengthUnit, ScalePreset } from "@/lib/math-engine";
import { DimensionReadout } from "@/components/DimensionReadout";
import { ScalePicker } from "@/components/ScalePicker";
import { ScaleVisualizer } from "@/components/ScaleVisualizer";
import {
  formatFixed3,
  mmToAllUnits,
  realMmToScaledMm,
  roundAllUnits3,
} from "@/lib/math-engine";
import { resolveRealWorldLengthMm } from "@/lib/real-world-input";

const LENGTH_UNITS: LengthUnit[] = ["mm", "cm", "m", "in", "ft"];

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

  const { resultLine, scaledMm, copyText, secondaryLine } = useMemo(() => {
    const realMm = resolveRealWorldLengthMm(rawValue, unit);
    if (realMm === null) {
      return {
        resultLine: null as string | null,
        scaledMm: null as number | null,
        copyText: null as string | null,
        secondaryLine: null as string | null,
      };
    }
    const scaledMm = realMmToScaledMm(realMm, scale.ratio);
    const rounded = roundAllUnits3(mmToAllUnits(scaledMm));
    const copyText = `${formatFixed3(rounded.mm)} mm (${scale.label} scale)`;
    const resultLine = `${formatFixed3(rounded.mm)} mm`;
    const secondaryLine = `${formatFixed3(rounded.cm)} cm · ${formatFixed3(rounded.m)} m · ${formatFixed3(rounded.in)} in · ${formatFixed3(rounded.ft)} ft`;
    return { resultLine, scaledMm, copyText, secondaryLine };
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
    <article className="mx-auto w-full max-w-none text-neutral-900 dark:text-neutral-100">
      <header className="mb-6">
        <h1 className="text-balance font-sans text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
          Scale Calculator for Models and Architecture
        </h1>
        <p className="mt-1 max-w-prose text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
          Enter a full-size span, choose from 36 scale ratios, then copy scaled millimetres and companion
          units.
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
                Insert a real-world value
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
          <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            Decimal in the unit you selected, or feet and inches (for example 6&apos;2&quot; or 6 ft 2
            in). When you use feet and inches, that value is used even if another unit is selected.
          </p>
        </section>

        <section className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <h2 id={scaleId} className="td-label">
            Select your scale
          </h2>
          <ScalePicker value={scale} onChange={onScaleChange} labelledBy={scaleId} />
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
              {resultLine === null || secondaryLine === null ? (
                "—"
              ) : (
                <DimensionReadout primary={resultLine} secondary={secondaryLine} />
              )}
            </output>
          </div>
          <div className="mt-10">
            <ScaleVisualizer scaledValueMm={scaledMm} resultLabel={activeCatalogLabel} />
          </div>
          <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            {`Scaled length at ${scale.label}; millimetres listed first for kit and bench work. In the workbench below, the high-contrast bar is your scaled length; lighter shapes are reference-only silhouettes.`}
          </p>
        </section>
      </div>
    </article>
  );
}
