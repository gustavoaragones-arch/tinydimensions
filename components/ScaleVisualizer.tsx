"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  DEFAULT_REFERENCE_ID,
  getReferenceById,
  type ReferenceId,
  REFERENCE_OBJECTS,
} from "@/lib/reference-data";

const GAP_MM = 8;
const PAD_MM = 4;
/** Cross-axis thickness for the scaled “length” bar so it stays visible. */
const RESULT_BAR_THICK_MM = 6;
/** Pixels per millimeter when not compressing to fit (true-scale preview). */
const NATURAL_PPMM = 3.75;

interface ScaleVisualizerProps {
  scaledValueMm: number | null;
}

function ReferenceSvgShape({ refObj }: { refObj: ReturnType<typeof getReferenceById> }) {
  if (refObj.shape === "circle") {
    const d = refObj.widthMm;
    const r = d / 2;
    return (
      <circle
        cx={r}
        cy={r}
        r={r}
        className="fill-neutral-200 stroke-neutral-500 dark:fill-neutral-800 dark:stroke-neutral-400"
        strokeWidth={0.35}
      />
    );
  }
  return (
    <rect
      x={0}
      y={0}
      width={refObj.widthMm}
      height={refObj.heightMm}
      rx={1.5}
      className="fill-neutral-200 stroke-neutral-500 dark:fill-neutral-800 dark:stroke-neutral-400"
      strokeWidth={0.35}
    />
  );
}

export function ScaleVisualizer({ scaledValueMm }: ScaleVisualizerProps) {
  const baseId = useId();
  const referenceSelectId = `${baseId}-reference`;
  const fitToggleId = `${baseId}-fit`;

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidthPx, setContainerWidthPx] = useState(0);
  const [referenceId, setReferenceId] = useState<ReferenceId>(DEFAULT_REFERENCE_ID);
  const [scaleToFit, setScaleToFit] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setContainerWidthPx(w);
    });
    ro.observe(el);
    setContainerWidthPx(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const refObj = useMemo(() => getReferenceById(referenceId), [referenceId]);

  const scene = useMemo(() => {
    const resultLenMm =
      scaledValueMm === null || !Number.isFinite(scaledValueMm)
        ? 0
        : Math.max(scaledValueMm, 0);
    const resultW = resultLenMm;
    const resultH = RESULT_BAR_THICK_MM;

    const refW = refObj.widthMm;
    const refH = refObj.heightMm;

    const innerW = refW + GAP_MM + resultW;
    const innerH = Math.max(refH, resultH);
    const vbW = innerW + PAD_MM * 2;
    const vbH = innerH + PAD_MM * 2;

    const refX = PAD_MM;
    const refY = PAD_MM + (innerH - refH) / 2;

    const resultX = PAD_MM + refW + GAP_MM;
    const resultY = PAD_MM + (innerH - resultH) / 2;

    return {
      vbW,
      vbH,
      refX,
      refY,
      resultX,
      resultY,
      resultW,
      resultH,
      innerW,
      innerH,
    };
  }, [refObj, scaledValueMm]);

  const naturalWidthPx = scene.vbW * NATURAL_PPMM;
  const needsFit =
    containerWidthPx > 0 && naturalWidthPx > containerWidthPx - 1; // 1px tolerance

  const ppmm = useMemo(() => {
    if (containerWidthPx <= 0) {
      return NATURAL_PPMM;
    }
    if (!needsFit || !scaleToFit) {
      return NATURAL_PPMM;
    }
    const targetPx = Math.max(containerWidthPx - 8, 64);
    return targetPx / scene.vbW;
  }, [containerWidthPx, needsFit, scaleToFit, scene.vbW]);

  const svgWidthPx = scene.vbW * ppmm;
  const svgHeightPx = scene.vbH * ppmm;

  const showResult = scaledValueMm !== null && Number.isFinite(scaledValueMm) && scaledValueMm >= 0;

  return (
    <section
      className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800"
      aria-label="Spatial comparison"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <label
            htmlFor={referenceSelectId}
            className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
          >
            Reference object
          </label>
          <select
            id={referenceSelectId}
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value as ReferenceId)}
            className="w-full max-w-xs rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:ring-neutral-500 sm:w-auto"
          >
            {REFERENCE_OBJECTS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {needsFit ? (
          <div className="flex items-center gap-2">
            <input
              id={fitToggleId}
              type="checkbox"
              checked={scaleToFit}
              onChange={(e) => setScaleToFit(e.target.checked)}
              className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400 dark:border-neutral-600 dark:bg-neutral-950 dark:focus:ring-neutral-500"
            />
            <label htmlFor={fitToggleId} className="text-sm text-neutral-700 dark:text-neutral-300">
              Scale to fit
            </label>
          </div>
        ) : null}
      </div>

      {needsFit && scaleToFit ? (
        <p className="text-xs text-amber-800 dark:text-amber-200/90">
          Preview scaled to fit — millimeter proportions preserved; not at natural pixel size.
        </p>
      ) : null}

      {needsFit && !scaleToFit ? (
        <p className="text-xs text-neutral-600 dark:text-neutral-400">
          True-scale preview — scroll horizontally if the bench extends past the screen.
        </p>
      ) : null}

      <div
        ref={containerRef}
        className={[
          "rounded-md border border-neutral-200 dark:border-neutral-800",
          "bg-neutral-100/80 [background-size:10px_10px] dark:bg-neutral-950/60",
          "[background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]",
          needsFit && !scaleToFit ? "overflow-x-auto" : "overflow-hidden",
        ].join(" ")}
      >
        <div className={needsFit && !scaleToFit ? "min-w-0 py-4 pr-2 pl-2" : "py-4 pr-2 pl-2"}>
          <svg
            viewBox={`0 0 ${scene.vbW} ${scene.vbH}`}
            width={svgWidthPx}
            height={svgHeightPx}
            role="img"
            aria-label="Workbench comparison of reference object and scaled length"
            className="mx-auto block max-w-none transition-[width,height] duration-300 ease-out"
          >
            <title>Reference and scaled length</title>
            {showResult && scene.resultW > 0 ? (
              <>
                <g transform={`translate(${scene.refX}, ${scene.refY})`}>
                  <ReferenceSvgShape refObj={refObj} />
                </g>
                <rect
                  x={scene.resultX}
                  y={scene.resultY}
                  width={scene.resultW}
                  height={scene.resultH}
                  rx={1}
                  className="fill-neutral-800 stroke-neutral-950 dark:fill-neutral-100 dark:stroke-neutral-50"
                  strokeWidth={0.35}
                />
              </>
            ) : (
              <text
                x={scene.vbW / 2}
                y={scene.vbH / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-neutral-500 dark:fill-neutral-400"
                style={{ fontSize: 3.5 }}
              >
                Enter a valid measurement to compare
              </text>
            )}
          </svg>
        </div>
      </div>
    </section>
  );
}
