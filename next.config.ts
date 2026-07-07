import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add explicit project root for Turbopack to avoid it picking up a parent lockfile
  // This tells Turbopack that the project lives in this directory.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
