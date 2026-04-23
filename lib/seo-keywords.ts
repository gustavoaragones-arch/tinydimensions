import { CATALOG_OBJECTS } from "@/lib/object-catalog";
import { SCALE_PRESETS } from "@/lib/math-engine";

const BASE_KEYWORDS = [
  "TinyDimensions",
  "About TinyDimensions",
  "Standard object catalog",
  "scale drawing",
  "architectural scale",
  "model scale",
  "mm to scale",
  "scale calculator",
  "hobby scale",
  "diorama",
  "floor plan scale",
  "HO scale",
  "O scale",
  "dollhouse scale",
] as const;

/** Keywords for home metadata (AEO / discovery); deduped, bounded. */
export function buildSiteKeywords(): string[] {
  const fromCatalog = CATALOG_OBJECTS.flatMap((obj) => {
    const parts = [obj.label, obj.notes].filter(Boolean) as string[];
    return [...parts, obj.id.replaceAll("-", " ")];
  });
  const fromScales = SCALE_PRESETS.map((p) => p.label);
  const merged = [...BASE_KEYWORDS, ...fromCatalog, ...fromScales];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of merged) {
    const t = k.trim();
    if (t.length < 2 || seen.has(t.toLowerCase())) continue;
    seen.add(t.toLowerCase());
    out.push(t);
    if (out.length >= 48) break;
  }
  return out;
}
