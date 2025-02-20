/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");
/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['drizzle-orm'],
  },
  // Add headers configuration to increase size limit
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-middleware-override-headers',
            value: '1',
          },
          {
            key: 'x-middleware-request-cookie',
            value: '1',
          },
        ],
      },
    ];
  },
};
export default config;
