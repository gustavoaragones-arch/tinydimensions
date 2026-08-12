"use client";

import { forwardRef, useImperativeHandle } from "react";
import { OverlayLayer } from "@/components/stage/OverlayLayer";
import { formatFixed3 } from "@/lib/math-engine";
import type { OverlayState, Scene, SceneBlock, ViewerState } from "@/lib/stage/scene";
import { type TransformMode, useStageScene } from "@/lib/stage/use-stage-scene";

export interface StageViewportProps {
  scene: Scene;
  viewer: ViewerState;
  overlay: OverlayState;
  selectedBlockId: string | null;
  transformMode: TransformMode;
  onTransformModeChange: (mode: TransformMode) => void;
  onSelectBlock: (id: string | null) => void;
  onBlockTransform: (
    id: string,
    patch: Partial<Pick<SceneBlock, "xMm" | "zMm" | "rotationDeg">>,
  ) => void;
  onViewerChange: (patch: Partial<ViewerState>) => void;
}

export interface StageViewportHandle {
  captureSnapshot: (overrideViewer?: ViewerState) => string | null;
  /** Serialized markup of the currently rendered overlay SVG, for PNG compositing. */
  captureOverlaySvgMarkup: () => string | null;
  getCanvasSize: () => { width: number; height: number } | null;
}

export const StageViewport = forwardRef<StageViewportHandle, StageViewportProps>(
  function StageViewport(
    {
      scene,
      viewer,
      overlay,
      selectedBlockId,
      transformMode,
      onTransformModeChange,
      onSelectBlock,
      onBlockTransform,
      onViewerChange,
    },
    ref,
  ) {
    const { containerRef, webglAvailable, captureSnapshot, getCanvasSize } = useStageScene({
      scene,
      viewer,
      selectedBlockId,
      transformMode,
      onSelectBlock,
      onBlockTransform,
      onViewerChange,
    });

    useImperativeHandle(ref, () => ({
      captureSnapshot,
      captureOverlaySvgMarkup: () => {
        const svg = document.getElementById("stage-overlay-svg");
        if (!svg) return null;
        // The live element's size comes from CSS (absolute inset-0); once serialized
        // and loaded as a detached <img> for PNG compositing it has no intrinsic size
        // to fall back on, so explicit width/height are set on a clone rather than
        // the live node, matching the actual capture's pixel dimensions.
        const clone = svg.cloneNode(true) as SVGSVGElement;
        const size = getCanvasSize();
        if (size) {
          clone.setAttribute("width", String(size.width));
          clone.setAttribute("height", String(size.height));
        }
        return new XMLSerializer().serializeToString(clone);
      },
      getCanvasSize,
    }));

    return (
      <div className="td-panel relative aspect-[4/3] w-full overflow-hidden dark:bg-neutral-900/50">
        {webglAvailable ? (
          <>
            <div ref={containerRef} className="absolute inset-0" />
            <OverlayLayer overlay={overlay} viewer={viewer} />

            <div className="absolute left-3 top-3 flex gap-1" role="group" aria-label="Block tool">
              <button
                type="button"
                onClick={() => onTransformModeChange("translate")}
                aria-pressed={transformMode === "translate"}
                className="td-viewport-control !min-h-0 !px-3 !py-1.5 text-xs"
              >
                Move
              </button>
              <button
                type="button"
                onClick={() => onTransformModeChange("rotate")}
                aria-pressed={transformMode === "rotate"}
                className="td-viewport-control !min-h-0 !px-3 !py-1.5 text-xs"
              >
                Rotate
              </button>
            </div>

            <output
              aria-live="polite"
              className="td-viewport-readout absolute bottom-3 left-3 rounded-md px-2.5 py-1 font-mono text-xs tabular-nums"
            >
              Viewing distance: {formatFixed3(viewer.viewingDistanceMm)} mm
            </output>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              3D viewport unavailable
            </p>
            <p className="max-w-xs text-xs leading-relaxed text-[var(--td-graphite)]">
              This browser or device doesn&apos;t support WebGL. The block table and viewer controls
              below still work — dimensions and positions are unaffected.
            </p>
          </div>
        )}
      </div>
    );
  },
);
