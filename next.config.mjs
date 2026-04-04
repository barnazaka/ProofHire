/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Fix for parseVec error in Next.js 15
    config.resolve.alias = {
      ...config.resolve.alias,
      '@midnight-ntwrk/ledger-v7': false,
      '@midnight-ntwrk/ledger-v8': false,
      '@midnight-ntwrk/onchain-runtime-v2': false,
      '@midnight-ntwrk/onchain-runtime-v3': false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        buffer: false,
      };
    }
    return config;
  },
};

export default nextConfig;
