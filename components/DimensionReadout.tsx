interface DimensionReadoutProps {
  primary: string;
  secondary: string;
}

/**
 * Drawing-style dimension leader for the primary scaled readout (scale-calculator v2 only).
 *
 * Built entirely in real CSS pixels (border widths, not SVG viewBox units). The first version
 * used an SVG with `preserveAspectRatio="none"` stretched across a flexible width — a 0.5
 * stroke-width in that viewBox scaled down to well under a real pixel once rendered, while the
 * visually identical instruction in ScaleVisualizer's fixed mm-to-px scene rendered several
 * pixels wide. Same nominal number, two coordinate systems, two different results. This
 * component only has one coordinate system, so "1px" here means what it says.
 */
export function DimensionReadout({ primary, secondary }: DimensionReadoutProps) {
  return (
    <div className="td-dimension-readout">
      <div className="td-dimension-readout__annotation">
        <span className="td-dimension-tick" aria-hidden="true" />
        <span className="td-dimension-leader" aria-hidden="true">
          <span className="td-dimension-arrow td-dimension-arrow--left" />
          <span className="td-dimension-line" />
        </span>
        <span className="td-dimension-readout__value td-measure">{primary}</span>
        <span className="td-dimension-leader" aria-hidden="true">
          <span className="td-dimension-line" />
          <span className="td-dimension-arrow td-dimension-arrow--right" />
        </span>
        <span className="td-dimension-tick" aria-hidden="true" />
      </div>
      <p className="td-dimension-readout__secondary td-measure">{secondary}</p>
    </div>
  );
}
