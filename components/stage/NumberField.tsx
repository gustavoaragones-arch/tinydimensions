"use client";

import { useId, useState } from "react";
import { formatFixed3 } from "@/lib/math-engine";
import { isValidDimensionMm } from "@/lib/stage/scene";

export interface NumberFieldProps {
  label: string;
  value: number;
  onCommit: (value: number) => void;
  /** Reject non-positive values on blur, reverting to the previous value. */
  requirePositive?: boolean;
  /** Wrap into [0, 360) on commit. */
  wrapDegrees?: boolean;
  /** Clamp to this minimum on commit (applied after requirePositive/wrapDegrees checks). */
  min?: number;
  hideLabel?: boolean;
  className?: string;
}

export function NumberField({
  label,
  value,
  onCommit,
  requirePositive,
  wrapDegrees,
  min,
  hideLabel = true,
  className,
}: NumberFieldProps) {
  const id = useId();
  const [raw, setRaw] = useState(String(formatFixed3(value)));
  // Adjust the edit buffer when `value` changes from outside (e.g. a drag in the
  // viewport), without an effect: https://react.dev/learn/you-might-not-need-an-effect
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setRaw(String(formatFixed3(value)));
  }

  function commit() {
    const parsed = Number.parseFloat(raw);
    if (!Number.isFinite(parsed) || (requirePositive && !isValidDimensionMm(parsed))) {
      setRaw(String(formatFixed3(value)));
      return;
    }
    let next = wrapDegrees ? ((parsed % 360) + 360) % 360 : parsed;
    if (min !== undefined) next = Math.max(min, next);
    onCommit(next);
  }

  return (
    <label className="flex flex-col gap-0.5">
      {hideLabel ? <span className="sr-only">{label}</span> : <span className="td-label">{label}</span>}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className={className ?? "td-field td-field--mono !min-h-0 w-20 !px-2 !py-1 text-xs"}
        aria-label={label}
      />
    </label>
  );
}
