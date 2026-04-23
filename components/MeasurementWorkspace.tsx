"use client";

import { useCallback, useState } from "react";
import { MeasurementEngine } from "@/components/MeasurementEngine";
import { ObjectCatalog } from "@/components/ObjectCatalog";
import { useMinLg } from "@/hooks/useMinLg";
import type { LengthUnit } from "@/lib/math-engine";
import { getDefaultScalePreset, type ScalePreset } from "@/lib/math-engine";
import type { CatalogObject } from "@/lib/object-catalog";

export function MeasurementWorkspace() {
  const isLg = useMinLg();

  const [rawValue, setRawValue] = useState<string>("1");
  const [unit, setUnit] = useState<LengthUnit>("m");
  const [scale, setScale] = useState<ScalePreset>(() => getDefaultScalePreset());
  const [activeCatalogLabel, setActiveCatalogLabel] = useState<string | null>(null);

  const handleRawValueChange = useCallback((value: string) => {
    setActiveCatalogLabel(null);
    setRawValue(value);
  }, []);

  const handleUnitChange = useCallback((next: LengthUnit) => {
    setActiveCatalogLabel(null);
    setUnit(next);
  }, []);

  const handleSelectObject = useCallback((object: CatalogObject) => {
    setRawValue(String(object.valueMm));
    setUnit("mm");
    setActiveCatalogLabel(object.label);
  }, []);

  const catalog = (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900/40">
      <ObjectCatalog onSelectObject={handleSelectObject} />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start">
        <MeasurementEngine
          rawValue={rawValue}
          unit={unit}
          scale={scale}
          activeCatalogLabel={activeCatalogLabel}
          onRawValueChange={handleRawValueChange}
          onUnitChange={handleUnitChange}
          onScaleChange={setScale}
        />

        {isLg ? <aside className="min-w-0">{catalog}</aside> : null}
      </div>

      {!isLg ? (
        <details className="mx-auto mt-6 max-w-xl rounded-lg border border-neutral-200 bg-white open:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/40 lg:max-w-none">
          <summary className="flex min-h-11 cursor-pointer select-none items-center px-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Browse standard objects
          </summary>
          <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">{catalog}</div>
        </details>
      ) : null}
    </div>
  );
}
