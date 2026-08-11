import { realMmToScaledMm } from "@/lib/math-engine";

export type BlockRole = "primary" | "secondary" | "terrain";

export interface SceneBlock {
  id: string;
  /** User-supplied. Defaults to "Block N" on creation. */
  label: string;
  /** Real-world dimensions in millimetres. Divided by the scene ratio for display. */
  widthMm: number; // X extent
  depthMm: number; // Z extent
  heightMm: number; // Y extent
  /** Footprint centre position on the base, in scaled millimetres — the same units
   *  as baseWidthMm/baseDepthMm. Origin is the centre of the base. Not scaled. */
  xMm: number;
  zMm: number;
  /** Rotation about the Y axis, degrees, 0-360. */
  rotationDeg: number;
  role: BlockRole;
}

export interface Scene {
  /** Base dimensions in scaled millimetres - the physical base being built. */
  baseWidthMm: number;
  baseDepthMm: number;
  /** Divisor. Blocks are entered at real-world size and divided by this. */
  ratio: number;
  blocks: SceneBlock[];
}

export interface ViewerState {
  /** Height of the surface the diorama sits on, above the floor. */
  surfaceHeightMm: number;
  /** Viewer's eye height above the floor. */
  eyeHeightMm: number;
  /** Horizontal distance from viewer to base centre. */
  viewingDistanceMm: number;
  /** Orbit angle about the base centre, degrees. 0 = front. */
  azimuthDeg: number;
}

export interface OverlayState {
  thirds: boolean;
  phi: boolean;
  centre: boolean;
  horizon: boolean;
}

/** Minimum viewing distance. Prevents the camera from crossing the base. */
export const MIN_VIEWING_DISTANCE_MM = 50;

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

/** Eye height relative to the base surface. Negative is a valid high-shelf case. */
export function relativeEyeHeightMm(viewer: ViewerState): number {
  return viewer.eyeHeightMm - viewer.surfaceHeightMm;
}

export function clampViewingDistanceMm(distanceMm: number): number {
  return Math.max(MIN_VIEWING_DISTANCE_MM, distanceMm);
}

/** Rejects zero, negative, non-finite values. Used to gate BlockTable edits before commit. */
export function isValidDimensionMm(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export interface ScaledBlock {
  block: SceneBlock;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  xMm: number;
  zMm: number;
}

/**
 * A block's real-world dimensions, divided down by the scene ratio. Position (xMm/zMm)
 * is already in scaled millimetres - the same units as baseWidthMm/baseDepthMm - and
 * passes through unchanged.
 */
export function scaleBlock(block: SceneBlock, ratio: number): ScaledBlock {
  return {
    block,
    widthMm: realMmToScaledMm(block.widthMm, ratio),
    depthMm: realMmToScaledMm(block.depthMm, ratio),
    heightMm: realMmToScaledMm(block.heightMm, ratio),
    xMm: block.xMm,
    zMm: block.zMm,
  };
}

/** True when a block's scaled footprint extends past the base edge. */
export function isBlockOutOfBounds(scaled: ScaledBlock, scene: Scene): boolean {
  const halfW = scaled.widthMm / 2;
  const halfD = scaled.depthMm / 2;
  const baseHalfW = scene.baseWidthMm / 2;
  const baseHalfD = scene.baseDepthMm / 2;
  return (
    scaled.xMm - halfW < -baseHalfW ||
    scaled.xMm + halfW > baseHalfW ||
    scaled.zMm - halfD < -baseHalfD ||
    scaled.zMm + halfD > baseHalfD
  );
}

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `block-${Math.random().toString(36).slice(2)}`;
}

export function createBlock(nextNumber: number, overrides: Partial<SceneBlock> = {}): SceneBlock {
  return {
    id: createId(),
    label: `Block ${nextNumber}`,
    widthMm: 100,
    depthMm: 100,
    heightMm: 100,
    xMm: 0,
    zMm: 0,
    rotationDeg: 0,
    role: "secondary",
    ...overrides,
  };
}

export function createInitialScene(): Scene {
  return {
    baseWidthMm: 300,
    baseDepthMm: 300,
    ratio: 87.1,
    blocks: [],
  };
}

export function createInitialViewerState(): ViewerState {
  return {
    surfaceHeightMm: 900,
    eyeHeightMm: 1570,
    viewingDistanceMm: 700,
    azimuthDeg: 0,
  };
}

export function createInitialOverlayState(): OverlayState {
  return {
    thirds: false,
    phi: false,
    centre: false,
    horizon: false,
  };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export interface StageState {
  scene: Scene;
  viewer: ViewerState;
  overlay: OverlayState;
  selectedBlockId: string | null;
  nextBlockNumber: number;
  /** Preset ids visited this session, for the export bench sheet. */
  visitedPresetIds: string[];
}

export function createInitialStageState(): StageState {
  return {
    scene: createInitialScene(),
    viewer: createInitialViewerState(),
    overlay: createInitialOverlayState(),
    selectedBlockId: null,
    nextBlockNumber: 1,
    // Matches createInitialViewerState()'s surfaceHeightMm/viewingDistanceMm (900/700),
    // which is the "competition-table" preset - so the default view counts as visited.
    visitedPresetIds: ["competition-table"],
  };
}

export type StageAction =
  | { type: "ADD_BLOCK" }
  | { type: "DUPLICATE_BLOCK"; id: string }
  | { type: "UPDATE_BLOCK"; id: string; patch: Partial<Omit<SceneBlock, "id">> }
  | { type: "REMOVE_BLOCK"; id: string }
  | { type: "SELECT_BLOCK"; id: string | null }
  | { type: "SET_RATIO"; ratio: number }
  | { type: "SET_BASE"; baseWidthMm: number; baseDepthMm: number }
  | { type: "SET_VIEWER"; patch: Partial<ViewerState> }
  | { type: "VISIT_PRESET"; presetId: string }
  | { type: "SET_OVERLAY"; patch: Partial<OverlayState> }
  | { type: "RESTORE"; state: StageState };

export function stageReducer(state: StageState, action: StageAction): StageState {
  switch (action.type) {
    case "ADD_BLOCK": {
      const block = createBlock(state.nextBlockNumber);
      return {
        ...state,
        scene: { ...state.scene, blocks: [...state.scene.blocks, block] },
        selectedBlockId: block.id,
        nextBlockNumber: state.nextBlockNumber + 1,
      };
    }
    case "DUPLICATE_BLOCK": {
      const source = state.scene.blocks.find((b) => b.id === action.id);
      if (!source) return state;
      const block = createBlock(state.nextBlockNumber, {
        widthMm: source.widthMm,
        depthMm: source.depthMm,
        heightMm: source.heightMm,
        xMm: source.xMm,
        zMm: source.zMm,
        rotationDeg: source.rotationDeg,
        role: source.role,
        label: `Block ${state.nextBlockNumber}`,
      });
      return {
        ...state,
        scene: { ...state.scene, blocks: [...state.scene.blocks, block] },
        selectedBlockId: block.id,
        nextBlockNumber: state.nextBlockNumber + 1,
      };
    }
    case "UPDATE_BLOCK": {
      return {
        ...state,
        scene: {
          ...state.scene,
          blocks: state.scene.blocks.map((b) =>
            b.id === action.id ? { ...b, ...action.patch } : b,
          ),
        },
      };
    }
    case "REMOVE_BLOCK": {
      return {
        ...state,
        scene: {
          ...state.scene,
          blocks: state.scene.blocks.filter((b) => b.id !== action.id),
        },
        selectedBlockId: state.selectedBlockId === action.id ? null : state.selectedBlockId,
      };
    }
    case "SELECT_BLOCK":
      return { ...state, selectedBlockId: action.id };
    case "SET_RATIO":
      return { ...state, scene: { ...state.scene, ratio: action.ratio } };
    case "SET_BASE":
      return {
        ...state,
        scene: {
          ...state.scene,
          baseWidthMm: action.baseWidthMm,
          baseDepthMm: action.baseDepthMm,
        },
      };
    case "SET_VIEWER":
      return { ...state, viewer: { ...state.viewer, ...action.patch } };
    case "VISIT_PRESET":
      // "custom" has no fixed, reproducible values to re-render at export time, so it
      // is never tracked as a visited preset - only the four named presets are.
      if (action.presetId === "custom" || state.visitedPresetIds.includes(action.presetId)) {
        return state;
      }
      return { ...state, visitedPresetIds: [...state.visitedPresetIds, action.presetId] };
    case "SET_OVERLAY":
      return { ...state, overlay: { ...state.overlay, ...action.patch } };
    case "RESTORE":
      return action.state;
    default:
      return state;
  }
}
