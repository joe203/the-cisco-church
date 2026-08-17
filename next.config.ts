import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
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
