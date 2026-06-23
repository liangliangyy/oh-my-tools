/**
 * 网站配置
 *
 * 使用优先级：
 * 1. 环境变量 NEXT_PUBLIC_SITE_URL
 * 2. 默认值 https://tools.lylinux.net
 */

export const siteConfig = {
  // 网站基础URL（不要以斜杠结尾）
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.lylinux.net',

  // 网站名称
  name: 'oh-my-tools',

  // 工具总数 / 分类数（与 lib/tools-config.ts 保持一致，仅用于 SEO 文案；功能页一律以 tools-config 为准）
  toolCount: 35,
  categoryCount: 7,

  // 标题（用于 <title> / OG / Twitter）
  title: 'oh-my-tools - 程序员工具箱 | 35+ 免费在线开发者工具',

  // 网站描述（用于 description / OG / Twitter / JSON-LD）
  description: '免费在线程序员工具集合，35+ 实用开发工具：JSON/SQL/XML 格式化、HTML/CSS/JS 美化、Base64/Unicode 编解码、AES/RSA 加密、UUID/二维码生成、图片格式转换与 EXIF、CIDR 子网计算等。100% 浏览器本地处理，支持 PWA 安装到桌面离线使用。',

  // 简短描述（用于 Twitter Card 等字符受限场景）
  shortDescription: '35+ 实用开发工具，100% 本地处理，支持 PWA 离线安装',

  // SEO 关键词
  keywords:
    'JSON格式化,SQL格式化,XML转JSON,HTML美化,Base64编码,Unicode转义,AES加密,RSA加密,正则表达式,UUID生成,时间戳转换,二维码生成,图片格式转换,CIDR子网计算,JWT解码,PWA,离线工具,程序员工具,开发者工具,开发工具箱',

  // 作者信息
  author: {
    name: 'oh-my-tools',
    url: 'https://github.com/liangliangyy/oh-my-tools',
  },

  // 社交媒体链接
  links: {
    github: 'https://github.com/liangliangyy/oh-my-tools',
  },
}

/**
 * 获取完整的URL
 * @param path - 路径，如 '/tools/json'
 * @returns 完整的URL
 */
export function getFullUrl(path: string): string {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${siteConfig.baseUrl}${normalizedPath}`
}
