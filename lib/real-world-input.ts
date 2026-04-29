import type { LengthUnit } from "@/lib/math-engine";
import { MM_PER_IN, normalizeToMm } from "@/lib/math-engine";

// Purpose: Collapse Unicode primes and typographic quotes so Arthur can paste dimensions from PDFs and forums without manual cleanup.
function collapsePrimesForParsing(raw: string): string {
  return raw
    .trim()
    .replace(/\u2032/g, "'")
    .replace(/\u2033/g, '"')
    .replace(/[’‘]/g, "'")
    .replace(/[”“]/g, '"');
}

// Purpose: Combine whole feet and inch remainder into a single inch total for Marcus’s imperial datasheets before converting to millimeters.
function totalInchesFromParts(feet: number, inches: number): number {
  return feet * 12 + inches;
}

// Purpose: Convert a total inch length to millimeters using the international inch definition (25.4 mm per inch).
function inchesTotalToMm(totalInches: number): number {
  return totalInches * MM_PER_IN;
}

// Purpose: Parse compact `N' M"` and word forms (`N ft M in`) when explicit markers exist so hybrid input wins over the unit dropdown (Arthur / Lachlan).
export function tryParseFeetInchesToMm(raw: string): number | null {
  const s = collapsePrimesForParsing(raw)
    .replace(/\s+/g, " ")
    .replace(/,/g, ".")
    .trim();
  if (!s) return null;

  const hasFeetPrime = /['′]/.test(s);
  const hasInchQuote = /["″]/.test(s);
  const hasFtWord = /\bft\b|\bfeet\b/i.test(s);
  const hasInWord = /\b(in|ins|inch|inches)\b/i.test(s);

  const tryParts = (feet: number, inches: number): number | null => {
    if (!Number.isFinite(feet) || !Number.isFinite(inches) || feet < 0 || inches < 0) return null;
    return inchesTotalToMm(totalInchesFromParts(feet, inches));
  };

  let m = s.match(/^(\d+(?:\.\d+)?)\s*['′]\s*(\d+(?:\.\d+)?)\s*(["″])?$/);
  if (m && hasFeetPrime) {
    return tryParts(Number(m[1]), Number(m[2]));
  }

  m = s.match(/^(\d+(?:\.\d+)?)\s*['′]\s*$/);
  if (m && hasFeetPrime) {
    return tryParts(Number(m[1]), 0);
  }

  m = s.match(/^(\d+(?:\.\d+)?)\s*ft\s+(\d+(?:\.\d+)?)\s*in\b$/i);
  if (m) {
    return tryParts(Number(m[1]), Number(m[2]));
  }

  m = s.match(/^(\d+(?:\.\d+)?)\s*feet\s+(\d+(?:\.\d+)?)\s*inches\b$/i);
  if (m) {
    return tryParts(Number(m[1]), Number(m[2]));
  }

  m = s.match(/^(\d+(?:\.\d+)?)ft(\d+(?:\.\d+)?)in$/i);
  if (m) {
    return tryParts(Number(m[1]), Number(m[2]));
  }

  m = s.match(/^(\d+(?:\.\d+)?)ft$/i);
  if (m) {
    return tryParts(Number(m[1]), 0);
  }

  m = s.match(/^(\d+(?:\.\d+)?)\s*ft\b$/i);
  if (m && hasFtWord && !hasInWord && !hasFeetPrime) {
    return tryParts(Number(m[1]), 0);
  }

  m = s.match(/^(\d+(?:\.\d+)?)\s*(["″])$/);
  if (m && hasInchQuote) {
    return tryParts(0, Number(m[1]));
  }

  if (hasFtWord && hasInWord) {
    m = s.match(/^(\d+(?:\.\d+)?)\s*(?:ft|feet)\s+(\d+(?:\.\d+)?)\s*(?:(?:in|ins|inch|inches)|["″])?$/i);
    if (m) {
      return tryParts(Number(m[1]), Number(m[2]));
    }
  }

  return null;
}

// Purpose: Single resolution path — hybrid ft/in when the string matches explicit imperial notation; otherwise decimal value with the selected unit (Yuki metric workflow unchanged).
export function resolveRealWorldLengthMm(raw: string, unit: LengthUnit): number | null {
  const hybridMm = tryParseFeetInchesToMm(raw);
  if (hybridMm !== null) {
    return hybridMm;
  }
  const parsed = Number.parseFloat(raw.replace(",", "."));
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return normalizeToMm(parsed, unit);
}
