import type { NextConfig } from "next";

// Optional basePath — set NEXT_PUBLIC_BASE_PATH=/baynopenhouse in prod so the
// app is served under that prefix, matching the parent site's proxy rewrite
// (blackoak-re.com/baynopenhouse → baynrsvp.vercel.app/baynopenhouse/*).
// Left blank locally means the app still serves at root for dev.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(basePath ? { basePath } : {}),
  async rewrites() {
    return {
      // beforeFiles runs before Next's file-system routing, so `/` serves the
      // static invitation page even though there's no app/page.tsx.
      beforeFiles: [
        { source: "/", destination: "/invitation.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
