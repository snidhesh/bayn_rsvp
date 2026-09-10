import type { NextConfig } from "next";

// Optional basePath — set NEXT_PUBLIC_BASE_PATH=/baynopenhouse in prod so the
// app is served under that prefix, matching the parent site's proxy rewrite
// (blackoak-re.com/baynopenhouse → bayn-rsvp.vercel.app/baynopenhouse/*).
// Left blank locally means the app still serves at root for dev.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(basePath ? { basePath } : {}),
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
