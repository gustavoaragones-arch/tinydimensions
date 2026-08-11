"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { StageViewportHandle } from "@/components/stage/StageViewport";
import { formatFixed3 } from "@/lib/math-engine";
import { compositePngWithOverlay, downloadDataUrl, type PresetCaptureRecord } from "@/lib/stage/export";
import { VIEWER_PRESETS } from "@/lib/stage/camera";
import { scaleBlock, type Scene, type ViewerState } from "@/lib/stage/scene";

export interface ExportPanelProps {
  scene: Scene;
  viewer: ViewerState;
  visitedPresetIds: string[];
  overlayActive: boolean;
  viewportRef: RefObject<StageViewportHandle | null>;
}

export function ExportPanel({
  scene,
  viewer,
  visitedPresetIds,
  overlayActive,
  viewportRef,
}: ExportPanelProps) {
  const [pngBusy, setPngBusy] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [printCaptures, setPrintCaptures] = useState<PresetCaptureRecord[] | null>(null);
  const [printDate, setPrintDate] = useState("");
  const pendingPrintRef = useRef(false);

  const isEmpty = scene.blocks.length === 0;

  useEffect(() => {
    if (printCaptures && pendingPrintRef.current) {
      pendingPrintRef.current = false;
      window.print();
    }
  }, [printCaptures]);

  async function handleExportPng() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setPngBusy(true);
    try {
      const base = viewport.captureSnapshot();
      if (!base) return;
      const size = viewport.getCanvasSize();
      const width = size?.width ?? 1200;
      const height = size?.height ?? 900;
      const overlaySvg = overlayActive ? viewport.captureOverlaySvgMarkup() : null;
      const composited = await compositePngWithOverlay(base, overlaySvg, width, height);
      downloadDataUrl(composited, "stage-view.png");
    } finally {
      setPngBusy(false);
    }
  }

  function handleExportPdf() {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setPdfBusy(true);
    try {
      const captures: PresetCaptureRecord[] = [];
      for (const presetId of visitedPresetIds) {
        const preset = VIEWER_PRESETS.find((p) => p.id === presetId);
        if (!preset || preset.surfaceHeightMm === null || preset.viewingDistanceMm === null) continue;
        const presetViewer: ViewerState = {
          ...viewer,
          surfaceHeightMm: preset.surfaceHeightMm,
          viewingDistanceMm: preset.viewingDistanceMm,
        };
        const dataUrl = viewport.captureSnapshot(presetViewer);
        if (!dataUrl) continue;
        captures.push({
          presetId,
          label: preset.label,
          dataUrl,
          surfaceHeightMm: preset.surfaceHeightMm,
          eyeHeightMm: viewer.eyeHeightMm,
          viewingDistanceMm: preset.viewingDistanceMm,
        });
      }
      setPrintDate(new Date().toISOString().slice(0, 10));
      pendingPrintRef.current = true;
      setPrintCaptures(captures);
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <div className="td-panel space-y-3 p-3 dark:bg-neutral-900/50">
      <h2 className="td-label">Export</h2>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleExportPng()}
          disabled={isEmpty || pngBusy}
          className="td-chip !min-h-0 !px-3 !py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pngBusy ? "Capturing…" : "Export PNG"}
        </button>
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={isEmpty || pdfBusy}
          className="td-chip !min-h-0 !px-3 !py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pdfBusy ? "Preparing…" : "Export PDF (print)"}
        </button>
      </div>
      <p className="text-[0.65rem] leading-relaxed text-neutral-500 dark:text-neutral-400">
        PDF opens your browser&apos;s print dialog with a bench sheet covering every viewing
        position you&apos;ve visited this session, plus the full block table.
      </p>

      <div id="stage-print-sheet">
        <PrintSheet scene={scene} captures={printCaptures ?? []} date={printDate} />
      </div>
    </div>
  );
}

function PrintSheet({
  scene,
  captures,
  date,
}: {
  scene: Scene;
  captures: PresetCaptureRecord[];
  date: string;
}) {
  return (
    <div className="font-sans text-black">
      <div className="text-lg font-semibold">TinyDimensions Stage — bench sheet</div>
      <p className="mt-1 text-xs">
        Ratio 1:{scene.ratio} · Base {scene.baseWidthMm} × {scene.baseDepthMm} mm · {date}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {captures.map((capture) => (
          <figure key={capture.presetId} className="break-inside-avoid">
            {/* eslint-disable-next-line @next/next/no-img-element -- runtime canvas.toDataURL() capture, not an optimizable static/remote source */}
            <img src={capture.dataUrl} alt={capture.label} className="w-full border border-black" />
            <figcaption className="mt-1 text-xs">
              {capture.label} — surface {capture.surfaceHeightMm} mm, eye {capture.eyeHeightMm} mm,
              distance {capture.viewingDistanceMm} mm
            </figcaption>
          </figure>
        ))}
      </div>

      <table className="mt-6 w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="border border-black p-1 text-left">Label</th>
            <th className="border border-black p-1 text-left">Real (mm)</th>
            <th className="border border-black p-1 text-left">Scaled (mm)</th>
            <th className="border border-black p-1 text-left">Position (mm)</th>
            <th className="border border-black p-1 text-left">Rotation</th>
          </tr>
        </thead>
        <tbody>
          {scene.blocks.map((block) => {
            const scaled = scaleBlock(block, scene.ratio);
            return (
              <tr key={block.id}>
                <td className="border border-black p-1">{block.label}</td>
                <td className="border border-black p-1">
                  {block.widthMm} × {block.depthMm} × {block.heightMm}
                </td>
                <td className="border border-black p-1">
                  {formatFixed3(scaled.widthMm)} × {formatFixed3(scaled.depthMm)} ×{" "}
                  {formatFixed3(scaled.heightMm)}
                </td>
                <td className="border border-black p-1">
                  x {formatFixed3(scaled.xMm)}, z {formatFixed3(scaled.zMm)}
                </td>
                <td className="border border-black p-1">{block.rotationDeg}°</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
