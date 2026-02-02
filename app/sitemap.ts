import { MetadataRoute } from 'next'
import { tools } from '@/lib/tools-config'
import { siteConfig } from '@/lib/site-config'

// 静态导出模式需要设置
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.baseUrl

  // 首页
  const homeUrl = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }

  // 工具箱入口页
  const toolsIndexUrl = {
    url: `${baseUrl}/tools`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }

  // 为每个工具生成 sitemap 条目
  const toolUrls = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    homeUrl,
    toolsIndexUrl,
    ...toolUrls,
  ]
}
