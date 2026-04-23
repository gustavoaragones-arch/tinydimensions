/**
 * Scale-aware length conversions. All internal math uses millimeters.
 * To scale (model): realMm / scaleDenominator
 * To real: scaledMm * scaleDenominator
 */

export type LengthUnit = "mm" | "cm" | "m" | "in" | "ft";

export type ScaleCategory = "architectural" | "hobbyist";

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

const MM_PER_IN = 25.4;
const MM_PER_FT = 12 * MM_PER_IN;

/** Convert a length expressed in `unit` into millimeters (full precision). */
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

/** Convert millimeters into every display unit (full precision). */
export function mmToAllUnits(valueMm: number): AllUnitsMm {
  return {
    mm: valueMm,
    cm: valueMm / 10,
    m: valueMm / 1000,
    in: valueMm / MM_PER_IN,
    ft: valueMm / MM_PER_FT,
  };
}

/** Round to exactly `decimals` decimal places (professional display). */
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

/** Real-world length → model length at scale (both in mm). */
export function realMmToScaledMm(realMm: number, scaleDenominator: number): number {
  return realMm / scaleDenominator;
}

/** Model length → real-world length (both in mm). */
export function scaledMmToRealMm(scaledMm: number, scaleDenominator: number): number {
  return scaledMm * scaleDenominator;
}

export const SCALE_PRESETS: readonly ScalePreset[] = [
  { id: "1-50", label: "1:50", category: "architectural", denominator: 50 },
  { id: "1-100", label: "1:100", category: "architectural", denominator: 100 },
  { id: "1-200", label: "1:200", category: "architectural", denominator: 200 },
  { id: "1-12", label: "1:12 (Dollhouse)", category: "hobbyist", denominator: 12 },
  { id: "1-48", label: "1:48 (O Scale)", category: "hobbyist", denominator: 48 },
  { id: "1-87", label: "1:87 (HO Scale)", category: "hobbyist", denominator: 87 },
  { id: "1-72", label: "1:72", category: "hobbyist", denominator: 72 },
] as const;

export function getDefaultScalePreset(): ScalePreset {
  return SCALE_PRESETS[0];
}
