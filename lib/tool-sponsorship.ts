import type { ScaleCategory } from "@/lib/math-engine";

export interface ToolSponsorshipConfig {
  headline: string;
  productLabel: string;
  /** Placeholder until real affiliate URLs are configured. */
  href: string;
}

const PLACEHOLDER_BASE = "https://example.com/affiliate";

export const TOOL_SPONSORSHIP_BY_CATEGORY: Record<ScaleCategory, ToolSponsorshipConfig> = {
  architectural: {
    headline: "Trusted Tools for Architectural Builders",
    productLabel: "Digital Laser Measure",
    href: `${PLACEHOLDER_BASE}/digital-laser-measure`,
  },
  hobbyist: {
    headline: "Trusted Tools for Hobbyist Builders",
    productLabel: "Precision Hobby Knife Set",
    href: `${PLACEHOLDER_BASE}/precision-hobby-knife-set`,
  },
};
