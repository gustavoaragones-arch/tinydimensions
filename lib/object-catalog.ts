/**
 * Standard real-world objects for quick-loading into the measurement engine.
 * Dimensions are in millimeters unless noted.
 */

export type CatalogCategory = "architecture" | "humans" | "vehicles" | "tabletop";

export interface CatalogObject {
  id: string;
  label: string;
  category: CatalogCategory;
  /** Primary length applied to the 1D engine (mm). */
  valueMm: number;
  /** Extra context (e.g. full brick dimensions). */
  notes?: string;
}

/** Typical US single door slab height (nominal). */
export const STANDARD_SINGLE_DOOR_HEIGHT_MM = 2032;

/** Common residential ceiling datum (regional; typical). */
export const STANDARD_CEILING_HEIGHT_MM = 2400;

/** UK / modular brick nominal length × width × height (mm). */
export const BRICK_LENGTH_MM = 215;
export const BRICK_WIDTH_MM = 102.5;
export const BRICK_HEIGHT_MM = 65;

export const AVERAGE_ADULT_MALE_HEIGHT_MM = 1750;
export const AVERAGE_ADULT_FEMALE_HEIGHT_MM = 1620;

export const COMPACT_CAR_LENGTH_MM = 4500;

/** ISO 668: 20 ft container external length (mm). */
export const SHIPPING_CONTAINER_20FT_LENGTH_MM = 6058;

/** Common tabletop “28 mm” figure height (foot to eyes convention varies by line). */
export const MINIATURE_28MM_HEIGHT_MM = 28;

/** D&D grid: 5 ft square side length in mm (5 × 304.8). */
export const DND_5FT_SQUARE_SIDE_MM = 1524;

export const CATALOG_OBJECTS: readonly CatalogObject[] = [
  {
    id: "arch-door-single",
    label: "Standard single door",
    category: "architecture",
    valueMm: STANDARD_SINGLE_DOOR_HEIGHT_MM,
    notes: "Nominal 2032 mm height (typical slab).",
  },
  {
    id: "arch-ceiling-2400",
    label: "Ceiling height (typical)",
    category: "architecture",
    valueMm: STANDARD_CEILING_HEIGHT_MM,
    notes: "Common residential datum; varies by code and region.",
  },
  {
    id: "arch-brick-modular",
    label: "Modular brick (length)",
    category: "architecture",
    valueMm: BRICK_LENGTH_MM,
    notes: `Full unit ${BRICK_LENGTH_MM} × ${BRICK_WIDTH_MM} × ${BRICK_HEIGHT_MM} mm; length drives the preview.`,
  },
  {
    id: "human-adult-male",
    label: "Average adult male (height)",
    category: "humans",
    valueMm: AVERAGE_ADULT_MALE_HEIGHT_MM,
    notes: "Population average order-of-magnitude; not a medical standard.",
  },
  {
    id: "human-adult-female",
    label: "Average adult female (height)",
    category: "humans",
    valueMm: AVERAGE_ADULT_FEMALE_HEIGHT_MM,
    notes: "Population average order-of-magnitude; not a medical standard.",
  },
  {
    id: "vehicle-compact-car",
    label: "Standard compact car (length)",
    category: "vehicles",
    valueMm: COMPACT_CAR_LENGTH_MM,
    notes: "Typical compact class overall length.",
  },
  {
    id: "vehicle-container-20ft",
    label: "Shipping container (20 ft)",
    category: "vehicles",
    valueMm: SHIPPING_CONTAINER_20FT_LENGTH_MM,
    notes: "ISO 668 external length for a 20 ft container.",
  },
  {
    id: "tabletop-miniature-28mm",
    label: '28 mm miniature (height)',
    category: "tabletop",
    valueMm: MINIATURE_28MM_HEIGHT_MM,
    notes: "Nominal figure height for 28 mm scale gaming.",
  },
  {
    id: "tabletop-dnd-5ft-square",
    label: "D&D 5 ft grid square (side)",
    category: "tabletop",
    valueMm: DND_5FT_SQUARE_SIDE_MM,
    notes: "One side of a 5 ft battle-map square.",
  },
] as const;

export const CATALOG_CATEGORIES: readonly { id: CatalogCategory; label: string; tag: string }[] = [
  { id: "architecture", label: "Architecture", tag: "Architecture" },
  { id: "humans", label: "People", tag: "People" },
  { id: "vehicles", label: "Vehicles", tag: "Vehicles" },
  { id: "tabletop", label: "Tabletop", tag: "Tabletop" },
] as const;

export function filterCatalogObjects(
  objects: readonly CatalogObject[],
  query: string,
  category: CatalogCategory | "all",
): CatalogObject[] {
  const q = query.trim().toLowerCase();
  return objects.filter((obj) => {
    if (category !== "all" && obj.category !== category) return false;
    if (!q) return true;
    const hay = `${obj.label} ${obj.notes ?? ""}`.toLowerCase();
    return hay.includes(q);
  });
}
