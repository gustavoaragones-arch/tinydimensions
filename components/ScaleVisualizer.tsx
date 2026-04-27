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
  /** When set (e.g. catalog selection), shown as the result context label. */
  resultLabel?: string | null;
}

function ReferenceSvgShape({ refObj }: { refObj: ReturnType<typeof getReferenceById> }) {
  if (refObj.shape === "circle") {
    const r = refObj.widthMm / 2;
    return (
      <circle
        cx={0}
        cy={0}
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

export function ScaleVisualizer({ scaledValueMm, resultLabel = null }: ScaleVisualizerProps) {
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

    const hasSizedResult = resultLenMm > 0;
    const labelPad = resultLabel && hasSizedResult ? 5 : 0;

    if (!hasSizedResult) {
      const idleSide = Math.max(refW, refH, 56) + PAD_MM * 2;
      return {
        S: idleSide,
        stackH: 0,
        refCenterY: 0,
        resCenterY: 0,
        resultW,
        resultH,
        labelPad: 0,
        resultLabelX: 0,
        resultLabelY: 0,
      };
    }

    /** Vertical stack: optional label, reference, gap, result — centered on y = 0. */
    const stackH = labelPad + refH + GAP_MM + resultH;
    const stackW = Math.max(refW, resultW);
    const innerMax = Math.max(stackW, stackH);
    const S = innerMax + PAD_MM * 2;

    const refCenterY = -stackH / 2 + labelPad + refH / 2;
    const resCenterY = refCenterY + refH / 2 + GAP_MM + resultH / 2;

    return {
      S,
      stackH,
      refCenterY,
      resCenterY,
      resultW,
      resultH,
      labelPad,
      resultLabelX: 0,
      resultLabelY: labelPad > 0 ? -stackH / 2 + labelPad / 2 : 0,
    };
  }, [refObj, scaledValueMm, resultLabel]);

  const naturalSidePx = scene.S * NATURAL_PPMM;
  const needsFit =
    containerWidthPx > 0 && naturalSidePx > containerWidthPx - 1; // 1px tolerance

  const ppmm = useMemo(() => {
    if (containerWidthPx <= 0) {
      return NATURAL_PPMM;
    }
    if (!needsFit || !scaleToFit) {
      return NATURAL_PPMM;
    }
    const targetPx = Math.max(containerWidthPx - 8, 64);
    return targetPx / scene.S;
  }, [containerWidthPx, needsFit, scaleToFit, scene.S]);

  const svgSidePx = scene.S * ppmm;

  const showResult = scaledValueMm !== null && Number.isFinite(scaledValueMm) && scaledValueMm >= 0;

  return (
    <section
      className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800"
      aria-label="Spatial comparison"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <label htmlFor={referenceSelectId} className="td-label">
            Reference object
          </label>
          <select
            id={referenceSelectId}
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value as ReferenceId)}
            className="td-field td-field--select w-full max-w-xs sm:w-auto"
          >
            {REFERENCE_OBJECTS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {needsFit ? (
          <div className="flex min-h-11 items-center gap-3 px-0.5">
            <input
              id={fitToggleId}
              type="checkbox"
              checked={scaleToFit}
              onChange={(e) => setScaleToFit(e.target.checked)}
              className="td-checkbox"
            />
            <label
              htmlFor={fitToggleId}
              className="cursor-pointer text-sm leading-snug text-neutral-700 dark:text-neutral-300"
            >
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
          True-scale preview — scroll if the workbench extends past the square.
        </p>
      ) : null}

      <div
        ref={containerRef}
        className={[
          "relative mx-auto aspect-square w-full max-w-xl rounded-lg border border-neutral-200/90 bg-neutral-100/90 bg-center shadow-sm [background-size:10px_10px] dark:border-neutral-700 dark:bg-neutral-950/70",
          "[background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)]",
          "overflow-hidden",
        ].join(" ")}
      >
        <div
          className={
            needsFit && !scaleToFit
              ? "flex h-full w-full items-start justify-start overflow-auto p-0"
              : "flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-0"
          }
        >
          <svg
            viewBox={`${-scene.S / 2} ${-scene.S / 2} ${scene.S} ${scene.S}`}
            width={svgSidePx}
            height={svgSidePx}
            role="img"
            aria-label="Workbench comparison of reference object and scaled length"
            className="block max-w-none shrink-0 transition-[width,height] duration-300 ease-out"
          >
            <title>Reference and scaled length</title>
            {showResult && scene.resultW > 0 ? (
              <>
                {refObj.shape === "circle" ? (
                  <g transform={`translate(0, ${scene.refCenterY})`}>
                    <ReferenceSvgShape refObj={refObj} />
                  </g>
                ) : (
                  <g transform={`translate(${-refObj.widthMm / 2}, ${scene.refCenterY - refObj.heightMm / 2})`}>
                    <ReferenceSvgShape refObj={refObj} />
                  </g>
                )}
                <rect
                  x={-scene.resultW / 2}
                  y={scene.resCenterY - scene.resultH / 2}
                  width={scene.resultW}
                  height={scene.resultH}
                  rx={1}
                  className="fill-neutral-800 stroke-neutral-950 dark:fill-neutral-100 dark:stroke-neutral-50"
                  strokeWidth={0.35}
                />
                {resultLabel && scene.labelPad > 0 ? (
                  <text
                    x={scene.resultLabelX}
                    y={scene.resultLabelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-neutral-700 dark:fill-neutral-200"
                    style={{ fontSize: 2.75 }}
                  >
                    {resultLabel.length > 36 ? `${resultLabel.slice(0, 34)}…` : resultLabel}
                  </text>
                ) : null}
              </>
            ) : (
              <text
                x={0}
                y={0}
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
