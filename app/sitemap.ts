import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  // lastModified is a hardcoded ISO date per route, updated by hand when that route's content changes.
  return [
    { url: `${base}/`, lastModified: "2026-08-09", changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${base}/scale-calculator`,
      lastModified: "2026-08-09",
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: `${base}/about`, lastModified: "2026-08-09", changeFrequency: "monthly", priority: 0.6 },
    {
      url: `${base}/catalog`,
      lastModified: "2026-08-09",
      changeFrequency: "monthly",
      priority: 0.55,
    },
    { url: `${base}/guides`, lastModified: "2026-08-09", changeFrequency: "monthly", priority: 0.5 },
    {
      url: `${base}/guides/reading-scale-ratios`,
      lastModified: "2026-08-09",
      changeFrequency: "monthly",
      priority: 0.65,
    },
  ];
}
