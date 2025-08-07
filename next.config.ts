import withRspack from "next-rspack";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "*.app.github.dev",
        "https://naive-bayes-classifer-thesis.vercel.app",
        "https://xuanzang-thesis.hf.space",
      ],
    },
  },
};

export default withRspack(nextConfig);
