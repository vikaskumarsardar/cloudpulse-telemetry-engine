/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@app/telemetry-contracts"]
};

module.exports = nextConfig;
