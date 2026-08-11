"use client";

import { useCallback, useEffect, useReducer, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NumberField } from "@/components/stage/NumberField";
import { BlockTable } from "@/components/stage/BlockTable";
import { ExportPanel } from "@/components/stage/ExportPanel";
import { OverlayToggles } from "@/components/stage/OverlayToggles";
import { ScalePicker } from "@/components/ScalePicker";
import { StageViewport, type StageViewportHandle } from "@/components/stage/StageViewport";
import { ViewerControls } from "@/components/stage/ViewerControls";
import { getDefaultScalePreset, SCALE_PRESETS } from "@/lib/math-engine";
import { createInitialStageState, stageReducer, type StageState } from "@/lib/stage/scene";
import type { TransformMode } from "@/lib/stage/use-stage-scene";

const SESSION_STORAGE_KEY = "tinydimensions-stage-v1";

function isStageState(value: unknown): value is StageState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return Boolean(v.scene && v.viewer && v.overlay);
}

export interface StageWorkspaceProps {
  breadcrumbs?: { label: string; href?: string }[];
  /** Optional content below the tool (e.g. below-fold viewer-angle copy). */
  after?: ReactNode;
}

export function StageWorkspace({ breadcrumbs, after }: StageWorkspaceProps) {
  const [state, dispatch] = useReducer(stageReducer, undefined, createInitialStageState);
  const [transformMode, setTransformMode] = useState<TransformMode>("translate");
  const viewportRef = useRef<StageViewportHandle>(null);
  const hasRestoredRef = useRef(false);

  // Restore from sessionStorage after mount only, so the first (server-matching) render
  // is always the deterministic default - a brief post-hydration update, not a mismatch.
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    try {
      const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);
      // Merged over the defaults rather than trusted wholesale: a stored state from an
      // older session missing a since-added field (e.g. visitedPresetIds) would
      // otherwise pass this shallow guard and crash ExportPanel when it iterates it.
      if (isStageState(parsed)) {
        dispatch({ type: "RESTORE", state: { ...createInitialStageState(), ...parsed } });
      }
    } catch {
      // Corrupt or unavailable storage: fall back to the default scene silently.
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full or unavailable (e.g. private browsing): the session simply won't persist.
    }
  }, [state]);

  const handleBlockTransform = useCallback(
    (id: string, patch: { xMm?: number; zMm?: number; rotationDeg?: number }) => {
      dispatch({ type: "UPDATE_BLOCK", id, patch });
    },
    [],
  );

  const activeRatioPreset =
    SCALE_PRESETS.find((p) => p.ratio === state.scene.ratio) ?? getDefaultScalePreset();

  return (
    <main className="flex flex-1 flex-col bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        {breadcrumbs ? <Breadcrumbs crumbs={breadcrumbs} /> : null}

        <h1 className="mb-4 font-sans text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
          Stage your diorama from the viewer&apos;s actual position
        </h1>

        <div className="grid gap-6 lg:mx-auto lg:w-max lg:max-w-full lg:grid-cols-[minmax(0,40rem)_20rem] lg:items-start lg:gap-x-8">
          <div className="min-w-0 space-y-4">
            <StageViewport
              ref={viewportRef}
              scene={state.scene}
              viewer={state.viewer}
              overlay={state.overlay}
              selectedBlockId={state.selectedBlockId}
              transformMode={transformMode}
              onTransformModeChange={setTransformMode}
              onSelectBlock={(id) => dispatch({ type: "SELECT_BLOCK", id })}
              onBlockTransform={handleBlockTransform}
              onViewerChange={(patch) => dispatch({ type: "SET_VIEWER", patch })}
            />
            <BlockTable
              scene={state.scene}
              selectedBlockId={state.selectedBlockId}
              onSelectBlock={(id) => dispatch({ type: "SELECT_BLOCK", id })}
              onAddBlock={() => dispatch({ type: "ADD_BLOCK" })}
              onDuplicateBlock={(id) => dispatch({ type: "DUPLICATE_BLOCK", id })}
              onRemoveBlock={(id) => dispatch({ type: "REMOVE_BLOCK", id })}
              onUpdateBlock={(id, patch) => dispatch({ type: "UPDATE_BLOCK", id, patch })}
            />
          </div>

          <div className="min-w-0 space-y-4">
            <div className="td-panel space-y-3 p-3 dark:bg-neutral-900/50">
              <h2 className="td-label">Scene setup</h2>
              <ScalePicker
                value={activeRatioPreset}
                onChange={(preset) => dispatch({ type: "SET_RATIO", ratio: preset.ratio })}
              />
              <p className="text-[0.65rem] leading-relaxed text-neutral-500 dark:text-neutral-400">
                New to a ratio like this one? See{" "}
                <Link
                  href="/guides/reading-scale-ratios"
                  className="underline decoration-neutral-400 underline-offset-2 hover:decoration-neutral-600 dark:decoration-neutral-500 dark:hover:decoration-neutral-300"
                >
                  Reading scale ratios
                </Link>
                . To convert a specific real-world dimension first, use the{" "}
                <Link
                  href="/scale-calculator"
                  className="underline decoration-neutral-400 underline-offset-2 hover:decoration-neutral-600 dark:decoration-neutral-500 dark:hover:decoration-neutral-300"
                >
                  Scale Calculator
                </Link>
                .
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="td-label">Base width (mm)</span>
                  <NumberField
                    label="Base width in millimetres"
                    value={state.scene.baseWidthMm}
                    requirePositive
                    onCommit={(v) =>
                      dispatch({ type: "SET_BASE", baseWidthMm: v, baseDepthMm: state.scene.baseDepthMm })
                    }
                    className="td-field td-field--mono !min-h-0 w-full !px-2 !py-1.5 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <span className="td-label">Base depth (mm)</span>
                  <NumberField
                    label="Base depth in millimetres"
                    value={state.scene.baseDepthMm}
                    requirePositive
                    onCommit={(v) =>
                      dispatch({ type: "SET_BASE", baseWidthMm: state.scene.baseWidthMm, baseDepthMm: v })
                    }
                    className="td-field td-field--mono !min-h-0 w-full !px-2 !py-1.5 text-xs"
                  />
                </div>
              </div>
            </div>

            <ViewerControls
              viewer={state.viewer}
              onChange={(patch) => dispatch({ type: "SET_VIEWER", patch })}
              onPresetSelect={(presetId) => dispatch({ type: "VISIT_PRESET", presetId })}
            />
            <OverlayToggles
              overlay={state.overlay}
              onChange={(patch) => dispatch({ type: "SET_OVERLAY", patch })}
            />
            <ExportPanel
              scene={state.scene}
              viewer={state.viewer}
              visitedPresetIds={state.visitedPresetIds}
              overlayActive={Object.values(state.overlay).some(Boolean)}
              viewportRef={viewportRef}
            />
          </div>
        </div>

        {after}
      </div>
    </main>
  );
}
