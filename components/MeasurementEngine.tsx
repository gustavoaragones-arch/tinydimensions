"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import type { LengthUnit, ScalePreset } from "@/lib/math-engine";
import { ScaleVisualizer } from "@/components/ScaleVisualizer";
import {
  formatFixed3,
  mmToAllUnits,
  prefersMmPrimaryReadout,
  realMmToScaledMm,
  roundAllUnits3,
  SCALE_PRESETS,
} from "@/lib/math-engine";
import { resolveRealWorldLengthMm } from "@/lib/real-world-input";

const LENGTH_UNITS: LengthUnit[] = ["mm", "cm", "m", "in", "ft"];

// Purpose: One-line readout for architectural scales where Yuki expects every unit in the studio packet.
function formatArchitecturalReadout(units: ReturnType<typeof roundAllUnits3>): string {
  return `${formatFixed3(units.mm)} mm / ${formatFixed3(units.cm)} cm / ${formatFixed3(units.m)} m / ${formatFixed3(units.in)} in / ${formatFixed3(units.ft)} ft`;
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

  const { resultLine, scaledMm, copyText, hobbySecondaryLine } = useMemo(() => {
    const mmPrimaryReadout = prefersMmPrimaryReadout(scale.category);
    const realMm = resolveRealWorldLengthMm(rawValue, unit);
    if (realMm === null) {
      return {
        resultLine: null as string | null,
        scaledMm: null as number | null,
        copyText: null as string | null,
        hobbySecondaryLine: null as string | null,
      };
    }
    const scaledMm = realMmToScaledMm(realMm, scale.denominator);
    const rounded = roundAllUnits3(mmToAllUnits(scaledMm));
    const copyText = `${formatFixed3(rounded.mm)} mm (${scale.label} scale)`;
    if (mmPrimaryReadout) {
      const primary = `${formatFixed3(rounded.mm)} mm`;
      const secondary = `${formatFixed3(rounded.cm)} cm · ${formatFixed3(rounded.m)} m · ${formatFixed3(rounded.in)} in · ${formatFixed3(rounded.ft)} ft`;
      return {
        resultLine: primary,
        scaledMm,
        copyText,
        hobbySecondaryLine: secondary,
      };
    }
    return {
      resultLine: formatArchitecturalReadout(rounded),
      scaledMm,
      copyText,
      hobbySecondaryLine: null,
    };
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
          Instant Scale Measurement Calculator for Models &amp; Architecture
        </h1>
        <p className="mt-1 max-w-prose text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
          Enter a full-size span, choose HO, architectural, or diecast ratios, then copy scaled millimetres and
          companion units for elevations, track plans, and model components.
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
          <label htmlFor={scaleId} className="td-label">
            Select your scale
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
            <optgroup label="Diecast">
              {SCALE_PRESETS.filter((p) => p.category === "diecast").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Modeling">
              {SCALE_PRESETS.filter((p) => p.category === "modeling").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Model railroad &amp; dollhouse">
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
              {resultLine === null ? (
                "—"
              ) : hobbySecondaryLine ? (
                <span className="block space-y-1">
                  <span className="block font-medium">{resultLine}</span>
                  <span className="block text-xs font-normal text-neutral-800 dark:text-neutral-200">
                    {hobbySecondaryLine}
                  </span>
                </span>
              ) : (
                resultLine
              )}
            </output>
          </div>
          <div className="mt-10">
            <ScaleVisualizer scaledValueMm={scaledMm} resultLabel={activeCatalogLabel} />
          </div>
          <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
            {prefersMmPrimaryReadout(scale.category)
              ? `Scaled length at ${scale.label}; millimetres listed first for kit and bench work. In the workbench below, the high-contrast bar is your scaled length; lighter shapes are reference-only silhouettes.`
              : `Scaled length at ${scale.label} in millimetres, centimetres, metres, inches, and decimal feet. In the workbench below, the high-contrast bar is your scaled length; lighter shapes are reference-only silhouettes.`}
          </p>
        </section>
      </div>
    </article>
  );
}
