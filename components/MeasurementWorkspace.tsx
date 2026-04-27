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

  const catalogInner = <ObjectCatalog onSelectObject={handleSelectObject} />;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="grid gap-6 lg:mx-auto lg:w-max lg:max-w-full lg:grid-cols-[minmax(0,40rem)_17.5rem] lg:items-start lg:gap-x-8">
        <MeasurementEngine
          rawValue={rawValue}
          unit={unit}
          scale={scale}
          activeCatalogLabel={activeCatalogLabel}
          onRawValueChange={handleRawValueChange}
          onUnitChange={handleUnitChange}
          onScaleChange={setScale}
        />

        {isLg ? (
          <aside id="catalog" className="td-panel min-w-0 scroll-mt-24 p-3 dark:bg-neutral-900/50">
            {catalogInner}
          </aside>
        ) : null}
      </div>

      {!isLg ? (
        <details
          id="catalog"
          className="td-panel mx-auto mt-6 max-w-xl scroll-mt-24 overflow-hidden open:shadow-md lg:max-w-none dark:bg-neutral-900/50"
        >
          <summary className="td-summary">Browse standard objects</summary>
          <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">{catalogInner}</div>
        </details>
      ) : null}
    </div>
  );
}
