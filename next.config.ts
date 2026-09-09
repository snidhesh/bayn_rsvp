import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Serve the standalone artifact-style invite at a clean URL.
      // The file lives at public/invitation.html and runs isolated
      // from the Next.js app (own styles, own scripts).
      { source: "/invitation", destination: "/invitation.html" },
    ];
  },
};

export default nextConfig;
