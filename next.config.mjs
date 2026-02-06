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
                ecma: 2017,
                warnings: false,
                comparisons: false,
                inline: 2,
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
                passes: 3,
              },
              mangle: true,
              output: {
                ecma: 2017,
                comments: false,
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

      // 分割代码以优化加载 - 让 React.lazy 的动态 import 自动产生独立 chunk
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // 将 codemirror 相关库分离为独立 chunk，仅在编辑器工具中加载
          codemirror: {
            name: 'codemirror',
            test: /[\\/]node_modules[\\/](@codemirror|@uiw[\\/]react-codemirror|@lezer|codemirror)/,
            chunks: 'all',
            priority: 30,
          },
          // react-markdown + 相关解析器分离
          markdown: {
            name: 'markdown-vendor',
            test: /[\\/]node_modules[\\/](react-markdown|remark-|rehype-|unified|unist-|mdast-|micromark|hast-|property-information|vfile|bail|trough|decode-named)/,
            chunks: 'all',
            priority: 30,
          },
          // react-syntax-highlighter 分离（用于 markdown 代码高亮）
          syntaxHighlighter: {
            name: 'syntax-highlighter',
            test: /[\\/]node_modules[\\/](react-syntax-highlighter|refractor|prismjs)/,
            chunks: 'all',
            priority: 30,
          },
          // crypto-js 分离
          crypto: {
            name: 'crypto-vendor',
            test: /[\\/]node_modules[\\/]crypto-js/,
            chunks: 'all',
            priority: 30,
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
