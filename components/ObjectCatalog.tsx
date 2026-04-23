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
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Quick-load catalog
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          Pick a reference length; values load into the engine in millimeters.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor={searchId}
          className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
        >
          Search
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Door, brick, container…"
          className="min-h-11 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-neutral-500"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={[
            "min-h-11 rounded-full border px-3 text-xs font-medium transition-colors",
            category === "all"
              ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
              : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900",
          ].join(" ")}
        >
          All
        </button>
        {CATALOG_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={[
              "min-h-11 rounded-full border px-3 text-xs font-medium transition-colors",
              category === c.id
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900",
            ].join(" ")}
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
              className="flex min-h-11 w-full flex-col justify-center rounded-md border border-transparent px-2 py-2 text-left text-sm transition-colors hover:border-neutral-200 hover:bg-neutral-50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/60"
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
