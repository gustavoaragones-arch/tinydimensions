"use client";

import { NumberField } from "@/components/stage/NumberField";
import { formatFixed3 } from "@/lib/math-engine";
import { scaleBlock, type BlockRole, type Scene, type SceneBlock } from "@/lib/stage/scene";

export interface BlockTableProps {
  scene: Scene;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onAddBlock: () => void;
  onDuplicateBlock: (id: string) => void;
  onRemoveBlock: (id: string) => void;
  onUpdateBlock: (id: string, patch: Partial<Omit<SceneBlock, "id">>) => void;
}

const ROLE_OPTIONS: { value: BlockRole; label: string }[] = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "terrain", label: "Terrain" },
];

export function BlockTable({
  scene,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
  onDuplicateBlock,
  onRemoveBlock,
  onUpdateBlock,
}: BlockTableProps) {
  return (
    <div className="td-panel space-y-3 p-3 dark:bg-neutral-900/50">
      <div className="flex items-center justify-between gap-3">
        <h2 className="td-label">Blocks</h2>
        <button type="button" onClick={onAddBlock} className="td-chip !min-h-0 !px-3 !py-1.5 text-xs">
          Add block
        </button>
      </div>

      {scene.blocks.length === 0 ? (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          No blocks yet. Add one to start blocking out the scene.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="td-table">
            <thead>
              <tr>
                <th>Label</th>
                <th>Role</th>
                <th>W real</th>
                <th>D real</th>
                <th>H real</th>
                <th>X on base</th>
                <th>Z on base</th>
                <th>Rot (°)</th>
                <th>Scaled</th>
                <th aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {scene.blocks.map((block) => {
                const scaled = scaleBlock(block, scene.ratio);
                const selected = block.id === selectedBlockId;
                return (
                  <tr
                    key={block.id}
                    onClick={() => onSelectBlock(block.id)}
                    className={selected ? "bg-neutral-100 dark:bg-neutral-800/60" : undefined}
                  >
                    <td>
                      <input
                        type="text"
                        value={block.label}
                        onChange={(e) => onUpdateBlock(block.id, { label: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        className="td-field !min-h-0 w-28 !px-2 !py-1 text-xs"
                        aria-label={`Label for ${block.label}`}
                      />
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        value={block.role}
                        onChange={(e) => onUpdateBlock(block.id, { role: e.target.value as BlockRole })}
                        className="td-field td-field--select !min-h-0 w-28 !px-2 !py-1 text-xs"
                        aria-label={`Role for ${block.label}`}
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <NumberField
                        label={`Width for ${block.label}`}
                        value={block.widthMm}
                        requirePositive
                        onCommit={(v) => onUpdateBlock(block.id, { widthMm: v })}
                      />
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <NumberField
                        label={`Depth for ${block.label}`}
                        value={block.depthMm}
                        requirePositive
                        onCommit={(v) => onUpdateBlock(block.id, { depthMm: v })}
                      />
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <NumberField
                        label={`Height for ${block.label}`}
                        value={block.heightMm}
                        requirePositive
                        onCommit={(v) => onUpdateBlock(block.id, { heightMm: v })}
                      />
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <NumberField
                        label={`X position for ${block.label}`}
                        value={block.xMm}
                        onCommit={(v) => onUpdateBlock(block.id, { xMm: v })}
                      />
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <NumberField
                        label={`Z position for ${block.label}`}
                        value={block.zMm}
                        onCommit={(v) => onUpdateBlock(block.id, { zMm: v })}
                      />
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <NumberField
                        label={`Rotation for ${block.label}`}
                        value={block.rotationDeg}
                        wrapDegrees
                        onCommit={(v) => onUpdateBlock(block.id, { rotationDeg: v })}
                      />
                    </td>
                    <td className="font-mono text-xs tabular-nums text-neutral-600 dark:text-neutral-400">
                      {formatFixed3(scaled.widthMm)} × {formatFixed3(scaled.depthMm)} ×{" "}
                      {formatFixed3(scaled.heightMm)}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => onDuplicateBlock(block.id)}
                          className="td-chip !min-h-0 !px-2 !py-1 text-xs"
                          aria-label={`Duplicate ${block.label}`}
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveBlock(block.id)}
                          className="td-chip !min-h-0 !px-2 !py-1 text-xs"
                          aria-label={`Remove ${block.label}`}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
