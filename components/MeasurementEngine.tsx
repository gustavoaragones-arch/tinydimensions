"use client";

import { useId, useMemo, useState } from "react";
import type { LengthUnit, ScalePreset } from "@/lib/math-engine";
import { ScaleVisualizer } from "@/components/ScaleVisualizer";
import {
  getDefaultScalePreset,
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

export function MeasurementEngine() {
  const baseId = useId();
  const valueId = `${baseId}-value`;
  const unitId = `${baseId}-unit`;
  const scaleId = `${baseId}-scale`;

  const [rawValue, setRawValue] = useState<string>("1");
  const [unit, setUnit] = useState<LengthUnit>("m");
  const [scale, setScale] = useState<ScalePreset>(getDefaultScalePreset());

  const { resultLine, scaledMm } = useMemo(() => {
    const parsed = Number.parseFloat(rawValue.replace(",", "."));
    if (!Number.isFinite(parsed)) {
      return { resultLine: null as string | null, scaledMm: null as number | null };
    }
    const realMm = normalizeToMm(parsed, unit);
    const scaledMm = realMmToScaledMm(realMm, scale.denominator);
    const rounded = roundAllUnits3(mmToAllUnits(scaledMm));
    return { resultLine: formatUnitLine(rounded), scaledMm };
  }, [rawValue, unit, scale.denominator]);

  return (
    <main className="mx-auto max-w-xl px-4 py-8 text-neutral-900 dark:text-neutral-100">
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
                onChange={(e) => setRawValue(e.target.value)}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 font-mono text-sm tabular-nums text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:ring-neutral-500"
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
                onChange={(e) => setUnit(e.target.value as LengthUnit)}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:ring-neutral-500"
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

        <section className="space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
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
              if (next) setScale(next);
            }}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:ring-neutral-500"
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

        <section className="space-y-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
          <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Scaled result
          </h2>
          <output
            htmlFor={`${valueId} ${unitId} ${scaleId}`}
            aria-live="polite"
            className="block rounded-md border border-neutral-200 bg-neutral-50 p-3 font-mono text-sm tabular-nums text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
          >
            {resultLine ?? "—"}
          </output>
          <ScaleVisualizer scaledValueMm={scaledMm} />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Same model length expressed in mm, cm, m, in, and ft at {scale.label}.
          </p>
        </section>
      </div>
    </main>
  );
}
