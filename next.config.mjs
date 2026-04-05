/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
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

    // Fix for isomorphic-ws in browser and server
    config.resolve.alias = {
      ...config.resolve.alias,
      'isomorphic-ws': isServer
        ? new URL('./lib/ws-bridge-node.js', import.meta.url).pathname
        : new URL('./lib/ws-bridge.js', import.meta.url).pathname,
    };
    return config;
  },
};

export default nextConfig;
