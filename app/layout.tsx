import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TinyDimensions",
    template: "%s · TinyDimensions",
  },
  description:
    "Scale-aware measurement tools for architects and hobbyists — real-world to model conversions.",
};

/**
 * Site-wide entity graph. Organization/WebSite/publisher are defined once here and
 * referenced by @id from page-level JSON-LD (e.g. app/page.tsx, app/about/page.tsx)
 * rather than being redefined per route.
 */
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: `${siteUrl}/`,
      name: "TinyDimensions",
      publisher: { "@id": "https://albordigital.com/#organization" },
      inLanguage: "en",
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "TinyDimensions",
      url: `${siteUrl}/`,
      email: "contact@tinydimensions.com",
      description:
        "Precision tools for people who build at scale: dimension conversion across metric and imperial units, and viewer-angle staging for dioramas and display models.",
      foundingDate: "2026",
      knowsAbout: [
        "Scale models",
        "Scale conversion",
        "Model railroading",
        "Diorama construction",
        "Architectural models",
        "Miniature wargaming",
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://albordigital.com/#organization",
      name: "Albor Digital LLC",
      url: "https://albordigital.com/",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
