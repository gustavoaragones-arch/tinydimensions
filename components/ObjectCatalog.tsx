"use client";

import { useId, useMemo, useState } from "react";
import {
  CATALOG_CATEGORIES,
  CATALOG_OBJECTS,
  type CatalogCategory,
  type CatalogObject,
  filterCatalogObjects,
} from "@/lib/object-catalog";

export interface ObjectCatalogProps {
  onSelectObject: (object: CatalogObject) => void;
}

export function ObjectCatalog({ onSelectObject }: ObjectCatalogProps) {
  const baseId = useId();
  const searchId = `${baseId}-search`;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CatalogCategory | "all">("all");

  const filtered = useMemo(
    () => filterCatalogObjects(CATALOG_OBJECTS, query, category),
    [query, category],
  );

  return (
    <nav aria-label="Standard object catalog" className="space-y-3">
      <div className="space-y-1">
        <h2 className="td-label">Quick-load catalog</h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Pick a reference length; values load into the engine in millimeters.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor={searchId} className="td-label">
          Search
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Door, brick, container…"
          className="td-field"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className="td-chip"
          aria-pressed={category === "all"}
        >
          All
        </button>
        {CATALOG_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className="td-chip"
            aria-pressed={category === c.id}
          >
            {c.tag}
          </button>
        ))}
      </div>

      <ul className="max-h-72 space-y-1 overflow-y-auto pr-1">
        {filtered.map((obj) => (
          <li key={obj.id}>
            <button
              type="button"
              onClick={() => onSelectObject(obj)}
              className="td-catalog-item"
            >
              <span className="font-medium text-neutral-900 dark:text-neutral-100">{obj.label}</span>
              <span className="font-mono text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
                {obj.valueMm} mm
              </span>
              {obj.notes ? (
                <span className="text-xs text-neutral-500 dark:text-neutral-500">{obj.notes}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">No objects match this filter.</p>
      ) : null}
    </nav>
  );
}
