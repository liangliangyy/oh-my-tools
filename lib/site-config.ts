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

  // 网站描述
  description: '免费在线程序员工具集合，包含JSON格式化、正则表达式测试、编码解码、时间戳转换等实用工具',

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
