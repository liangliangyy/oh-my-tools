import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 启用静态导出模式，适用于 Cloudflare Pages
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 使用空的 turbopack 配置以支持 webpack
  turbopack: {},
  webpack: (config, { isServer, dev }) => {
    // Monaco Editor 配置
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
      }
    }

    // 生产环境下启用最大级别压缩
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: [
          // JavaScript 压缩 - 使用 Terser 最大压缩配置
          new TerserPlugin({
            terserOptions: {
              parse: {
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                comparisons: false,
                inline: 2,
                drop_console: true, // 移除 console.log
                drop_debugger: true, // 移除 debugger
                pure_funcs: ['console.log', 'console.info', 'console.debug'], // 移除特定函数
                passes: 3, // 多次压缩以获得更好的结果
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false, // 移除所有注释
                ascii_only: true,
              },
            },
            parallel: true,
            extractComments: false, // 不提取注释到单独文件
          }),
          // CSS 压缩 - 最大压缩配置
          new CssMinimizerPlugin({
            minimizerOptions: {
              preset: [
                'default',
                {
                  discardComments: { removeAll: true }, // 移除所有注释
                  normalizeWhitespace: true, // 规范化空白
                  minifyFontValues: true, // 压缩字体值
                  minifyGradients: true, // 压缩渐变
                  minifySelectors: true, // 压缩选择器
                  reduceIdents: true, // 减少标识符
                  colormin: true, // 压缩颜色值
                  calc: true, // 优化 calc()
                  mergeLonghand: true, // 合并 longhand 属性
                  mergeRules: true, // 合并规则
                  cssDeclarationSorter: true, // 排序 CSS 声明
                },
              ],
            },
            parallel: true,
          }),
        ],
      }

      // 分割代码以优化加载
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // 将 node_modules 中的库分离
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // 共享的公共代码
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      }
    }

    return config
  },
  // 启用压缩
  compress: true,
  // 生产环境下禁用 source map
  productionBrowserSourceMaps: false,
}

export default nextConfig
