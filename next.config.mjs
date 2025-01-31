/** @type {import("next").NextConfig} */
const nextConfig = {
  basePath: "/chatforyouio/front",
  assetPrefix: "/chatforyouio/front",
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ["@svgr/webpack"],
    });
    return config;
  }
};

export default nextConfig;
