export interface PresetCaptureRecord {
  presetId: string;
  label: string;
  dataUrl: string;
  surfaceHeightMm: number;
  eyeHeightMm: number;
  viewingDistanceMm: number;
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = src;
  });
}

/**
 * Composites the rendered viewport with the screen-space overlay SVG on top, so the
 * PNG export matches what's on screen (§8: "including any active overlays"). Uses an
 * offscreen canvas and the browser's own image loading - no new dependency.
 */
export async function compositePngWithOverlay(
  baseDataUrl: string,
  overlaySvgMarkup: string | null,
  width: number,
  height: number,
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return baseDataUrl;

  const baseImg = await loadImage(baseDataUrl);
  ctx.drawImage(baseImg, 0, 0, width, height);

  if (overlaySvgMarkup) {
    const svgBlob = new Blob([overlaySvgMarkup], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    try {
      const overlayImg = await loadImage(svgUrl);
      ctx.drawImage(overlayImg, 0, 0, width, height);
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  }

  return canvas.toDataURL("image/png");
}
