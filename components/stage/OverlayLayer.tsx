import { getHorizonNdcY } from "@/lib/stage/camera";
import type { OverlayState, ViewerState } from "@/lib/stage/scene";

export interface OverlayLayerProps {
  overlay: OverlayState;
  viewer: ViewerState;
}

// Inline stroke colours, not Tailwind classes: a serialized SVG loaded as an <img> for
// PNG export is an isolated document with no access to the page stylesheet, so
// class-based strokes resolve to nothing there even though they render fine on screen.
// Picked against the viewport's fixed 0xf5f5f4 Three.js background (that background
// does not change with the site's light/dark mode, so one literal colour suffices).
const LINE_STROKE = "rgba(23, 23, 23, 0.55)";
const HORIZON_STROKE = "rgba(217, 119, 6, 0.85)";

/**
 * Screen-space SVG layer over the canvas. Composition applies to the image, not the
 * 3D world - lines here are fixed to the viewport and never move with camera azimuth,
 * except the horizon, which is derived from the viewer's own eye level.
 */
export function OverlayLayer({ overlay, viewer }: OverlayLayerProps) {
  const horizonNdcY = getHorizonNdcY(viewer);
  const horizonPercent = ((1 - horizonNdcY) / 2) * 100;
  const showHorizon = overlay.horizon && horizonPercent >= 0 && horizonPercent <= 100;

  return (
    <svg
      id="stage-overlay-svg"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {overlay.thirds ? (
        <g stroke={LINE_STROKE} strokeWidth={0.2}>
          <line x1={33.333} y1={0} x2={33.333} y2={100} />
          <line x1={66.667} y1={0} x2={66.667} y2={100} />
          <line x1={0} y1={33.333} x2={100} y2={33.333} />
          <line x1={0} y1={66.667} x2={100} y2={66.667} />
        </g>
      ) : null}
      {overlay.phi ? (
        <g stroke={LINE_STROKE} strokeWidth={0.2} strokeDasharray="1.5,1.5">
          <line x1={38.2} y1={0} x2={38.2} y2={100} />
          <line x1={61.8} y1={0} x2={61.8} y2={100} />
          <line x1={0} y1={38.2} x2={100} y2={38.2} />
          <line x1={0} y1={61.8} x2={100} y2={61.8} />
        </g>
      ) : null}
      {overlay.centre ? (
        <g stroke={LINE_STROKE} strokeWidth={0.25}>
          <line x1={50} y1={0} x2={50} y2={100} />
          <line x1={0} y1={50} x2={100} y2={50} />
        </g>
      ) : null}
      {showHorizon ? (
        <line
          x1={0}
          y1={horizonPercent}
          x2={100}
          y2={horizonPercent}
          stroke={HORIZON_STROKE}
          strokeWidth={0.35}
        />
      ) : null}
    </svg>
  );
}
