/**
 * Real-world reference dimensions (millimeters) for spatial comparison in the workbench.
 */

export type ReferenceId = "us-quarter" | "credit-card" | "pencil-diameter" | "aa-battery";

export type ReferenceShapeKind = "circle" | "rect";

export interface ReferenceObject {
  id: ReferenceId;
  label: string;
  shape: ReferenceShapeKind;
  /** Bounding width in mm (circle: diameter). */
  widthMm: number;
  /** Bounding height in mm (circle: diameter). */
  heightMm: number;
  /** Notes for humans / future tooling. */
  notes?: string;
}

/** US quarter per US Mint spec (diameter). */
export const US_QUARTER_DIAMETER_MM = 24.26;

/** ISO/IEC 7810 ID-1 width; length per brief. */
export const CREDIT_CARD_LENGTH_MM = 85.6;

/** ISO/IEC 7810 ID-1 height (standard payment card). */
export const CREDIT_CARD_HEIGHT_MM = 53.98;

/** Typical woodcase pencil body (order-of-magnitude). */
export const PENCIL_DIAMETER_MM = 7;

/** AA cell height (IEC LR6 typical). */
export const AA_BATTERY_HEIGHT_MM = 50.5;

/** Typical AA diameter for silhouette (IEC LR6 ~14.2–14.5 mm). */
export const AA_BATTERY_DIAMETER_MM = 14.2;

export const REFERENCE_OBJECTS: readonly ReferenceObject[] = [
  {
    id: "us-quarter",
    label: "US quarter",
    shape: "circle",
    widthMm: US_QUARTER_DIAMETER_MM,
    heightMm: US_QUARTER_DIAMETER_MM,
    notes: "Diameter 24.26 mm",
  },
  {
    id: "credit-card",
    label: "Credit card (ID-1)",
    shape: "rect",
    widthMm: CREDIT_CARD_LENGTH_MM,
    heightMm: CREDIT_CARD_HEIGHT_MM,
    notes: "85.6 × 53.98 mm (ISO/IEC 7810 ID-1)",
  },
  {
    id: "pencil-diameter",
    label: "Pencil (diameter)",
    shape: "circle",
    widthMm: PENCIL_DIAMETER_MM,
    heightMm: PENCIL_DIAMETER_MM,
    notes: "7 mm body diameter (typical)",
  },
  {
    id: "aa-battery",
    label: "AA battery",
    shape: "rect",
    widthMm: AA_BATTERY_DIAMETER_MM,
    heightMm: AA_BATTERY_HEIGHT_MM,
    notes: "50.5 mm height; ~14.2 mm diameter for preview",
  },
] as const;

export const DEFAULT_REFERENCE_ID: ReferenceId = "us-quarter";

export function getReferenceById(id: ReferenceId): ReferenceObject {
  const found = REFERENCE_OBJECTS.find((r) => r.id === id);
  if (!found) {
    return REFERENCE_OBJECTS[0];
  }
  return found;
}
