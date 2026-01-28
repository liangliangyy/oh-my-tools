/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 使用空的 turbopack 配置以支持 webpack
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Monaco Editor 配置
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
      }
    }

    return config
  },
}

export default nextConfig
