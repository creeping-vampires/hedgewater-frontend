const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.tsx?$/, // Match .ts and .tsx files
      include: [path.resolve(__dirname, "node_modules/hypurr-grpc")],
      use: [
        {
          loader: "ts-loader", // Use ts-loader to compile TypeScript
          options: {
            transpileOnly: true, // Speeds up the build process
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;
