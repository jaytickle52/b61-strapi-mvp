import type { NextConfig } from "next";

// Every page reads straight from the school's Strapi instance on each request,
// so a saved change shows up on the next page load. Caching can come later.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
