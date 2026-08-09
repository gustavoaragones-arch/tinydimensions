import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/disclaimer",
        destination: "/terms",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
