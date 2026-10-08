import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // HTTPS only, for a year. Caddy already redirects http -> https.
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Only this site may frame its pages (the Downloads "View" window does).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
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
      // Unlisted share-only pages: self-contained static HTML in
      // public/share, given a short link-friendly URL. Not in nav, not
      // indexed — visited only by whoever Joe sends the link to.
      {
        source: "/share/:page",
        destination: "/share/:page.html",
      },
    ];
  },
  async redirects() {
    return [
      // The Oct 4 lesson was first published under the series title; it is
      // now "The Jesus Test", Lesson 1 of the Hold On to What Is Good series.
      {
        source: "/sermons/hold-on-to-what-is-good",
        destination: "/sermons/the-jesus-test",
        permanent: true,
      },
      {
        source: "/downloads/hold-on-to-what-is-good/:piece*",
        destination: "/downloads/the-jesus-test/:piece*",
        permanent: true,
      },
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
