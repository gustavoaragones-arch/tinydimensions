/**
 * Canonical site origin for metadata, JSON-LD, sitemap, and robots.
 * Set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://tinydimensions.com).
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://tinydimensions.com";
  return raw.replace(/\/$/, "");
}
