import type { ViewerState } from "@/lib/stage/scene";
import { relativeEyeHeightMm } from "@/lib/stage/scene";

/**
 * Vertical FOV in degrees. Fixed. Approximates attentive viewing of a
 * display object at conversational distance. Zoom moves the camera;
 * it never changes this value.
 */
export const STAGE_FOV_DEG = 35;

export interface CameraPositionMm {
  x: number;
  y: number;
  z: number;
}

/** Camera position in scaled-scene millimetres, given the current viewer state. Base centre is the origin. */
export function getCameraPositionMm(viewer: ViewerState): CameraPositionMm {
  const relativeEyeMm = relativeEyeHeightMm(viewer);
  const azimuthRad = (viewer.azimuthDeg * Math.PI) / 180;
  return {
    x: Math.sin(azimuthRad) * viewer.viewingDistanceMm,
    y: relativeEyeMm,
    z: Math.cos(azimuthRad) * viewer.viewingDistanceMm,
  };
}

export interface ViewerPreset {
  id: string;
  label: string;
  surfaceHeightMm: number | null;
  viewingDistanceMm: number | null;
  note: string;
}

/** eyeHeightMm is not part of a preset - it persists across preset changes as a property of the user. */
export const VIEWER_PRESETS: readonly ViewerPreset[] = [
  {
    id: "competition-table",
    label: "Competition table",
    surfaceHeightMm: 900,
    viewingDistanceMm: 700,
    note: "Standing, looking down",
  },
  {
    id: "chest-shelf",
    label: "Chest-height shelf",
    surfaceHeightMm: 1200,
    viewingDistanceMm: 700,
    note: "Standing",
  },
  {
    id: "high-shelf",
    label: "High shelf",
    surfaceHeightMm: 1700,
    viewingDistanceMm: 900,
    note: "Standing, looking up",
  },
  {
    id: "display-case-seated",
    label: "Display case, seated",
    surfaceHeightMm: 750,
    viewingDistanceMm: 600,
    note: "Seated",
  },
  {
    id: "custom",
    label: "Custom",
    surfaceHeightMm: null,
    viewingDistanceMm: null,
    note: "Both fields free",
  },
] as const;

export const DEFAULT_EYE_HEIGHT_MM = 1570;
/** Roughly accurate seated eye height, shown as a note next to the eye height field. */
export const SEATED_EYE_HEIGHT_NOTE_MM = 1200;

export interface NearFarPlanesMm {
  near: number;
  far: number;
}

/**
 * Near/far clip planes derived from the base's own extent rather than a fixed constant,
 * so a very large ratio (tiny scaled scene) or a very small one (large scaled scene) never clips.
 */
export function getNearFarPlanesMm(baseExtentMm: number): NearFarPlanesMm {
  const extent = Math.max(baseExtentMm, 1);
  return {
    near: Math.max(extent / 1000, 0.001),
    far: extent * 100,
  };
}

/**
 * Screen-space NDC y (-1..1, +1 = top) of the horizon: the horizontal plane at the
 * camera's own eye level, projected into the image. Derived analytically from the
 * camera's pitch (a level, non-rolled camera always renders its own eye-level plane
 * as one straight horizontal line) rather than from a live Three.js camera object -
 * consistent with the rule that the numeric viewer state is authoritative.
 *
 * The base's top surface is scene-local y = 0, and the camera always looks at the
 * base centre (0, 0, 0), so the camera's vertical pitch is atan2(relativeEyeMm, viewingDistanceMm).
 */
export function getHorizonNdcY(viewer: ViewerState): number {
  const relativeEyeMm = relativeEyeHeightMm(viewer);
  const pitchRad = Math.atan2(relativeEyeMm, viewer.viewingDistanceMm);
  const halfFovRad = (STAGE_FOV_DEG * Math.PI) / 180 / 2;
  return Math.tan(pitchRad) / Math.tan(halfFovRad);
}
