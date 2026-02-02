import { Metadata } from "next"
import { tools, getToolById } from "@/lib/tools-config"
import { siteConfig, getFullUrl } from "@/lib/site-config"
import { ToolPageClient } from "./page-client"

// 预生成所有工具的静态路径 - 用于静态导出
export function generateStaticParams() {
  return tools.map((tool) => ({
    toolId: tool.id,
  }))
}

// 生成每个工具页面的metadata (用于SEO)
export async function generateMetadata({ params }: { params: Promise<{ toolId: string }> }): Promise<Metadata> {
  const { toolId } = await params
  const tool = getToolById(toolId)

  if (!tool) {
    return {
      title: "工具未找到 - oh-my-tools",
    }
  }

  const keywords = tool.keywords || []
  const title = `${tool.name} - oh-my-tools 在线工具`
  const description = tool.fullDescription || `免费在线${tool.name}工具。${tool.description}，支持本地处理，保护数据隐私。`

  return {
    title,
    description,
    keywords: [...keywords, "在线工具", "开发者工具", "程序员工具箱", "oh-my-tools"].join(", "),
    openGraph: {
      title,
      description,
      type: "website",
    },
  }
}

interface ToolPageProps {
  params: Promise<{
    toolId: string
  }>
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { toolId } = await params
  const tool = getToolById(toolId)

  // 如果工具不存在，返回客户端组件处理
  if (!tool) {
    return <ToolPageClient toolId={toolId} />
  }

  // 为每个工具生成 JSON-LD 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${tool.name} - oh-my-tools`,
    applicationCategory: 'DeveloperApplication',
    description: tool.fullDescription || `免费在线${tool.name}工具。${tool.description}，100%本地处理，保护数据隐私。`,
    url: getFullUrl(`/tools/${tool.id}`),
    operatingSystem: 'Any',
    permissions: 'browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'oh-my-tools',
      url: siteConfig.baseUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
    featureList: tool.keywords?.join(', ') || '',
  }

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageClient toolId={toolId} />
    </>
  )
}
