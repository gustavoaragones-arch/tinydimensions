/** Shared dimension-line geometry for inline-SVG annotations (mm scene units). */
export const DIMENSION_LEADER_OFFSET_MM = 5;
export const DIMENSION_EXT_HEIGHT_MM = 4;

export function dimensionLeaderY(barTopY: number): number {
  return barTopY - DIMENSION_LEADER_OFFSET_MM;
}

export function arrowHeadPoints(
  tipX: number,
  tipY: number,
  direction: "left" | "right",
  size = 0.9,
): string {
  if (direction === "right") {
    return `${tipX},${tipY} ${tipX - size},${tipY - size * 0.55} ${tipX - size},${tipY + size * 0.55}`;
  }
  return `${tipX},${tipY} ${tipX + size},${tipY - size * 0.55} ${tipX + size},${tipY + size * 0.55}`;
}
