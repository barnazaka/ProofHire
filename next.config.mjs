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

      // Fix for isomorphic-ws in browser
      config.resolve.alias = {
        ...config.resolve.alias,
        'isomorphic-ws': 'isomorphic-ws/browser.js',
      };
    }
    return config;
  },
};

export default nextConfig;
