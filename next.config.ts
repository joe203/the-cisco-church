import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      // Preaching sheets are self-contained static HTML in public/preach.
      // This serves them without the .html so the URL is easy to type on a
      // strange computer: /preach/new-life
      {
        source: "/preach/:sheet",
        destination: "/preach/:sheet.html",
      },
    ];
  },
  async redirects() {
    return [
      // The controller moved from /present to /controls — keep old bookmarks
      // and any note cards with the old URL working.
      {
        source: "/slides/:deck/present",
        destination: "/slides/:deck/controls",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
