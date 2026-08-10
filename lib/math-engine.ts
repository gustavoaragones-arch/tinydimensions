/**
 * Scale-aware length conversions. All internal math uses millimeters.
 * To scale (model): realMm / scaleRatio
 * To real: scaledMm * scaleRatio
 */

export type LengthUnit = "mm" | "cm" | "m" | "in" | "ft";

export type ScaleCategory =
  | "architecture"
  | "automotive"
  | "aircraft"
  | "military"
  | "naval"
  | "railway"
  | "figures"
  | "dollhouse";

export interface ScalePreset {
  /** Exact divisor. 87.1, not 87. Used for all arithmetic. */
  ratio: number;
  /** Display string, e.g. "1:87.1". Derived, but stored for exactness. */
  label: string;
  /** Short common name where one exists: "HO", "OO", "N". Omitted where none. */
  name?: string;
  /** Every category this ratio is genuinely used in. Order is not significant. */
  categories: ScaleCategory[];
  /** Hidden search terms. Never rendered. Lowercased matching. */
  aliases: string[];
}

export interface AllUnitsMm {
  mm: number;
  cm: number;
  m: number;
  in: number;
  ft: number;
}

/** International inch definition (ISO 80000-3). */
export const MM_PER_IN = 25.4;
export const MM_PER_FT = 12 * MM_PER_IN;

// Purpose: Convert a numeric length in the user’s selected unit into millimeters so every downstream scale step shares one internal representation (Carolina’s multi-unit handoffs).
export function normalizeToMm(value: number, unit: LengthUnit): number {
  switch (unit) {
    case "mm":
      return value;
    case "cm":
      return value * 10;
    case "m":
      return value * 1000;
    case "in":
      return value * MM_PER_IN;
    case "ft":
      return value * MM_PER_FT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

// Purpose: Emit every common unit from a millimeter value so the fabrication team can screenshot one panel (Carolina / museum workflows).
export function mmToAllUnits(valueMm: number): AllUnitsMm {
  return {
    mm: valueMm,
    cm: valueMm / 10,
    m: valueMm / 1000,
    in: valueMm / MM_PER_IN,
    ft: valueMm / MM_PER_FT,
  };
}

// Purpose: Round to a fixed decimal count without loosening the brand’s precision promise in UI copy.
export function roundToDecimals(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function roundAllUnits3(units: AllUnitsMm): AllUnitsMm {
  return {
    mm: roundToDecimals(units.mm, 3),
    cm: roundToDecimals(units.cm, 3),
    m: roundToDecimals(units.m, 3),
    in: roundToDecimals(units.in, 3),
    ft: roundToDecimals(units.ft, 3),
  };
}

// Purpose: Format a number with exactly three fractional digits so readouts read as 0.000 mm, matching the “three decimal places. Every time.” brand rule.
export function formatFixed3(value: number): string {
  return roundToDecimals(value, 3).toFixed(3);
}

// Purpose: Real-world length → model length at scale (both in mm) for maquette and layout math (Yuki studio submissions).
export function realMmToScaledMm(realMm: number, ratio: number): number {
  return realMm / ratio;
}

// Purpose: Model length → real-world length (both in mm) for reverse checks when a physical part is measured on the bench.
export function scaledMmToRealMm(scaledMm: number, ratio: number): number {
  return scaledMm * ratio;
}

function preset(
  ratio: number,
  categories: ScaleCategory[],
  aliases: string[],
  name?: string,
): ScalePreset {
  return { ratio, label: `1:${ratio}`, name, categories, aliases };
}

/**
 * 36 fixed ratios across model railway, automotive, aircraft, military, naval,
 * architecture, figures, and dollhouse work. Ordered smallest ratio to largest.
 * Exact ratios only (HO is 87.1, not 87; British O is 43.5, not 43) — the rounded
 * forms live in `aliases` so search still finds them, but arithmetic always uses
 * `ratio`. No brand or product-line names appear in `label`, `name`, or `aliases`.
 */
export const SCALE_PRESETS: readonly ScalePreset[] = [
  preset(6, ["automotive", "figures", "dollhouse"], ["1/6", "playscale"]),
  preset(9, ["automotive"], ["1/9"]),
  preset(12, ["automotive", "dollhouse", "figures"], ["1/12", "one inch scale", "dollhouse"]),
  preset(16, ["military", "automotive"], ["1/16"]),
  preset(18, ["automotive"], ["1/18"]),
  preset(20, ["architecture", "automotive"], ["1/20"]),
  preset(22.5, ["railway"], ["1/22.5", "g scale", "g gauge"], "G"),
  preset(24, ["automotive", "dollhouse"], ["1/24", "half inch scale"]),
  preset(25, ["automotive"], ["1/25"]),
  preset(29, ["railway"], ["1/29", "g scale"], "G"),
  preset(
    32,
    ["aircraft", "military", "automotive", "railway"],
    ["1/32", "gauge one", "three eighths scale", "slot car"],
    "Gauge 1",
  ),
  preset(35, ["military"], ["1/35"]),
  preset(43, ["automotive"], ["1/43"]),
  preset(43.5, ["railway"], ["1/43.5", "7mm scale", "o gauge"], "British O"),
  preset(45, ["railway"], ["1/45", "o gauge"], "European O"),
  preset(
    48,
    ["railway", "aircraft", "military", "architecture", "dollhouse"],
    ["1/48", "quarter inch scale", "quarter scale", "o gauge"],
    "O",
  ),
  preset(50, ["architecture"], ["1/50"]),
  preset(60, ["figures"], ["1/60"]),
  preset(
    64,
    ["railway", "automotive"],
    ["1/64", "s scale", "s gauge", "three sixteenths scale"],
    "S",
  ),
  preset(72, ["aircraft", "military"], ["1/72"]),
  preset(
    76.2,
    ["railway", "military"],
    ["1/76", "1/76.2", "oo gauge", "4mm scale", "double o"],
    "OO",
  ),
  preset(87.1, ["railway"], ["1/87", "1/87.1", "ho scale", "h0"], "HO"),
  preset(96, ["architecture", "naval"], ["1/96", "eighth inch scale"]),
  preset(100, ["architecture", "figures", "aircraft"], ["1/100"]),
  preset(120, ["railway"], ["1/120", "tt scale", "tt gauge"], "TT"),
  preset(144, ["aircraft", "figures"], ["1/144"]),
  preset(148, ["railway"], ["1/148", "n gauge"], "British N"),
  preset(150, ["railway"], ["1/150", "n gauge"], "Japanese N"),
  preset(160, ["railway"], ["1/160", "n scale", "n gauge"], "N"),
  preset(200, ["architecture", "aircraft", "naval"], ["1/200"]),
  preset(220, ["railway"], ["1/220", "z scale", "z gauge"], "Z"),
  preset(350, ["naval"], ["1/350"]),
  preset(400, ["naval", "aircraft"], ["1/400"]),
  preset(500, ["architecture"], ["1/500"]),
  preset(700, ["naval"], ["1/700"]),
  preset(1200, ["naval"], ["1/1200"]),
] as const;

/** Display order for grouping presets by category in the picker and the reference table. */
export const SCALE_CATEGORY_ORDER: readonly ScaleCategory[] = [
  "railway",
  "automotive",
  "aircraft",
  "military",
  "naval",
  "architecture",
  "figures",
  "dollhouse",
] as const;

export const SCALE_CATEGORY_LABELS: Record<ScaleCategory, string> = {
  railway: "Model railway",
  automotive: "Automotive",
  aircraft: "Aircraft",
  military: "Military",
  naval: "Naval",
  architecture: "Architecture",
  figures: "Figures",
  dollhouse: "Dollhouse",
};

// Purpose: Let the picker search box find a ratio by its notation, common name, or a hidden alias (e.g. "HO", "1:87", "quarter inch") without showing the alias anywhere.
export function filterScalePresets(
  presets: readonly ScalePreset[],
  query: string,
): ScalePreset[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...presets];
  return presets.filter((p) => {
    const haystack = [p.label, p.name ?? "", ...p.aliases].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}

export function getDefaultScalePreset(): ScalePreset {
  return SCALE_PRESETS.find((p) => p.ratio === 87.1) ?? SCALE_PRESETS[0];
}
