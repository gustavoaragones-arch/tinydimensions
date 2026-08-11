"use client";

import { NumberField } from "@/components/stage/NumberField";
import { formatFixed3 } from "@/lib/math-engine";
import { SEATED_EYE_HEIGHT_NOTE_MM, VIEWER_PRESETS } from "@/lib/stage/camera";
import { MIN_VIEWING_DISTANCE_MM, relativeEyeHeightMm, type ViewerState } from "@/lib/stage/scene";

export interface ViewerControlsProps {
  viewer: ViewerState;
  onChange: (patch: Partial<ViewerState>) => void;
  onPresetSelect: (presetId: string) => void;
}

function matchingPresetId(viewer: ViewerState): string {
  const match = VIEWER_PRESETS.find(
    (p) =>
      p.surfaceHeightMm === viewer.surfaceHeightMm && p.viewingDistanceMm === viewer.viewingDistanceMm,
  );
  return match?.id ?? "custom";
}

export function ViewerControls({ viewer, onChange, onPresetSelect }: ViewerControlsProps) {
  const activePresetId = matchingPresetId(viewer);
  const relativeEyeMm = relativeEyeHeightMm(viewer);

  return (
    <div className="td-panel space-y-4 p-3 dark:bg-neutral-900/50">
      <div className="space-y-2">
        <h2 className="td-label">Viewing position</h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Viewer presets">
          {VIEWER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                if (preset.surfaceHeightMm !== null && preset.viewingDistanceMm !== null) {
                  onChange({
                    surfaceHeightMm: preset.surfaceHeightMm,
                    viewingDistanceMm: preset.viewingDistanceMm,
                  });
                }
                onPresetSelect(preset.id);
              }}
              aria-pressed={activePresetId === preset.id}
              className="td-chip !min-h-0 !px-3 !py-1.5 text-xs"
              title={preset.note}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="td-label">Eye height (mm)</span>
          <NumberField
            label="Eye height in millimetres"
            value={viewer.eyeHeightMm}
            onCommit={(v) => onChange({ eyeHeightMm: v })}
            className="td-field td-field--mono !min-h-0 w-full !px-2 !py-1.5 text-xs"
          />
          <p className="text-[0.65rem] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Your own eye height above the floor. Seated is roughly {SEATED_EYE_HEIGHT_NOTE_MM} mm.
          </p>
        </div>

        <div className="space-y-1">
          <span className="td-label">Surface height (mm)</span>
          <NumberField
            label="Surface height in millimetres"
            value={viewer.surfaceHeightMm}
            onCommit={(v) => {
              onChange({ surfaceHeightMm: v });
              onPresetSelect("custom");
            }}
            className="td-field td-field--mono !min-h-0 w-full !px-2 !py-1.5 text-xs"
          />
          <p className="text-[0.65rem] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Height of the surface the diorama sits on, above the floor.
          </p>
        </div>

        <div className="space-y-1">
          <span className="td-label">Viewing distance (mm)</span>
          <NumberField
            label="Viewing distance in millimetres"
            value={viewer.viewingDistanceMm}
            min={MIN_VIEWING_DISTANCE_MM}
            onCommit={(v) => {
              onChange({ viewingDistanceMm: v });
              onPresetSelect("custom");
            }}
            className="td-field td-field--mono !min-h-0 w-full !px-2 !py-1.5 text-xs"
          />
        </div>

        <div className="space-y-1">
          <span className="td-label">Azimuth (°)</span>
          <NumberField
            label="Azimuth in degrees"
            value={viewer.azimuthDeg}
            wrapDegrees
            onCommit={(v) => onChange({ azimuthDeg: v })}
            className="td-field td-field--mono !min-h-0 w-full !px-2 !py-1.5 text-xs"
          />
        </div>
      </div>

      <p className="font-mono text-[0.65rem] text-neutral-500 dark:text-neutral-400">
        Eye relative to base surface: {formatFixed3(relativeEyeMm)} mm
        {relativeEyeMm < 0 ? " (looking up)" : ""}
      </p>
    </div>
  );
}
