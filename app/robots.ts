import type { MetadataRoute } from "next";

/**
 * Staff tools, API endpoints, the live-slide and preaching-sheet pages, and the
 * unlisted share pages are not for search engines.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/staff", "/api/", "/auth/", "/embed/", "/slides/", "/preach/", "/share/"],
    },
    sitemap: "https://theciscochurch.org/sitemap.xml",
  };
}
