import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

// 静态导出模式需要设置
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.baseUrl

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // 如果有API路由，禁止爬取
          '/_next/',         // Next.js内部文件
          '/404',            // 404页面
        ],
      },
      // 针对特定爬虫的规则（可选）
      {
        userAgent: 'GPTBot', // OpenAI爬虫
        disallow: '/',       // 如果不想被AI训练，可以禁止
      },
      {
        userAgent: 'CCBot',  // Common Crawl
        disallow: '/',       // 如果不想被AI训练，可以禁止
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
