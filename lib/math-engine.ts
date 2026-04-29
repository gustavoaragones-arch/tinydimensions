/**
 * Scale-aware length conversions. All internal math uses millimeters.
 * To scale (model): realMm / scaleDenominator
 * To real: scaledMm * scaleDenominator
 */

export type LengthUnit = "mm" | "cm" | "m" | "in" | "ft";

export type ScaleCategory = "architectural" | "diecast" | "hobbyist" | "modeling";

export interface ScalePreset {
  id: string;
  label: string;
  category: ScaleCategory;
  /** e.g. 50 for a 1:50 drawing */
  denominator: number;
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

// Purpose: Prefer millimeters as the headline readout for hobby, diecast, and kit scales where builders spec parts in mm (Arthur HO, Lachlan diecast).
export function prefersMmPrimaryReadout(category: ScaleCategory): boolean {
  return category !== "architectural";
}

// Purpose: Real-world length → model length at scale (both in mm) for maquette and layout math (Yuki studio submissions).
export function realMmToScaledMm(realMm: number, scaleDenominator: number): number {
  return realMm / scaleDenominator;
}

// Purpose: Model length → real-world length (both in mm) for reverse checks when a physical part is measured on the bench.
export function scaledMmToRealMm(scaledMm: number, scaleDenominator: number): number {
  return scaledMm * scaleDenominator;
}

export const SCALE_PRESETS: readonly ScalePreset[] = [
  { id: "1-50", label: "1:50", category: "architectural", denominator: 50 },
  { id: "1-100", label: "1:100", category: "architectural", denominator: 100 },
  { id: "1-200", label: "1:200", category: "architectural", denominator: 200 },
  { id: "1-18", label: "1:18 (Diecast)", category: "diecast", denominator: 18 },
  { id: "1-43", label: "1:43 (Diecast)", category: "diecast", denominator: 43 },
  { id: "1-64", label: "1:64 (Diecast)", category: "diecast", denominator: 64 },
  { id: "1-35", label: "1:35 (Military)", category: "modeling", denominator: 35 },
  { id: "1-72", label: "1:72 (Aircraft)", category: "modeling", denominator: 72 },
  { id: "1-12", label: "1:12 (Dollhouse)", category: "hobbyist", denominator: 12 },
  { id: "1-48", label: "1:48 (O scale)", category: "hobbyist", denominator: 48 },
  { id: "1-87", label: "1:87 (HO scale)", category: "hobbyist", denominator: 87 },
] as const;

export function getDefaultScalePreset(): ScalePreset {
  return SCALE_PRESETS[0];
}
