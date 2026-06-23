"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Braces,
  Regex,
  Binary,
  Clock,
  Link2,
  Hash,
  Palette,
  Fingerprint,
  Terminal,
  Search,
  ArrowRight,
  Zap,
  Shield,
  Code2,
  FileCode,
  GitCompare,
  KeyRound,
  CalendarClock,
  ArrowLeftRight,
  Lock,
  Calculator,
  FileText,
  QrCode,
  Image,
  CalendarDays,
  Network,
  PcCase,
  Scale,
  ShieldCheck,
  ShieldAlert,
  KeySquare,
  LockKeyhole,
  Database,
  SquareCode,
  Languages,
  Sparkles,
  Camera,
  ImageDown,
  Download,
  Github,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { tools as toolsConfig, categories as categoriesConfig } from "@/lib/tools-config"
import { siteConfig } from "@/lib/site-config"

// 从 tools-config 映射首页需要的展示字段和图标
const iconMap: Record<string, any> = {
  json: Braces, json2code: FileCode, markdown: FileText, yaml: ArrowLeftRight, diff: GitCompare,
  sql: Database, xml: Code2, beautifier: Sparkles,
  base64: Binary, url: Link2, hash: Hash, "image-base64": Image, jwt: KeyRound,
  "html-entities": SquareCode, unicode: Languages,
  aes: Lock, rsa: ShieldCheck, hmac: ShieldAlert, md5: Fingerprint, "key-gen": KeySquare,
  uuid: Fingerprint, password: LockKeyhole, qrcode: QrCode,
  regex: Regex, cron: CalendarClock, exif: Camera,
  timestamp: Clock, color: Palette, "base-converter": Calculator, "date-calc": CalendarDays, unit: Scale,
  "image-convert": ImageDown,
  cidr: Network, chmod: Shield, "port-check": PcCase,
}

const categoryNameMap: Record<string, string> = {
  format: "格式化工具", encode: "编码解码", crypto: "加密工具",
  generator: "生成器", converter: "转换器", tool: "开发工具", network: "网络工具",
}

const tools = toolsConfig.map(t => ({
  id: t.id,
  name: t.name,
  icon: iconMap[t.id] || Braces,
  description: t.description,
  categoryId: t.category,
  category: categoryNameMap[t.category] || t.category,
}))

const TOOL_COUNT = toolsConfig.length
const CATEGORY_COUNT = categoriesConfig.length

const categoryShortNames: Record<string, string> = {
  format: "格式化", encode: "编解码", crypto: "加密",
  generator: "生成器", converter: "转换", tool: "开发", network: "网络",
}

const features = [
  { icon: Zap, title: "极速响应", description: "纯浏览器执行，无服务往返，操作即出结果" },
  { icon: Shield, title: "本地处理", description: "数据全程留在浏览器，不上传、不收集" },
  { icon: Code2, title: "开发者审美", description: "深色优先精确美学，分类配色，Geist Mono 等宽字体" },
  { icon: Download, title: "PWA 离线", description: "可安装到桌面，断网也能用，与原生应用体验一致" },
]

// 按 tools-config 顺序展示分类（避免硬编码漂移）
const orderedCategories = categoriesConfig.map((c) => ({
  id: c.id,
  name: categoryNameMap[c.id] || c.name,
}))

type ToolItem = (typeof tools)[number]

function ToolCard({ tool }: { tool: ToolItem }) {
  const Icon = tool.icon
  return (
    <Link
      href={`/tools/${tool.id}`}
      className="group relative flex flex-col p-5 rounded-md border border-border bg-card overflow-hidden transition-colors duration-150 hover:border-accent/30"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-accent transition-colors duration-150" />
          <h3 className="font-medium text-sm leading-tight text-balance">{tool.name}</h3>
        </div>
        <span
          className="ml-2 flex-shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded tracking-wide whitespace-nowrap"
          style={{
            color: `var(--cat-${tool.categoryId})`,
            backgroundColor: `color-mix(in oklch, var(--cat-${tool.categoryId}) 12%, transparent)`,
          }}
        >
          {categoryShortNames[tool.categoryId] || tool.category}
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-50"
        style={{ backgroundColor: `var(--cat-${tool.categoryId})` }}
      />
    </Link>
  )
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 按 tools-config 顺序分组
  const toolsByCategory = orderedCategories
    .map((c) => ({
      name: c.name,
      tools: filteredTools.filter((tool) => tool.categoryId === c.id),
    }))
    .filter((group) => group.tools.length > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-foreground">
              <Terminal className="h-5 w-5 text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tight">oh-my-tools</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/tools"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              进入工具箱
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>免费在线 · 100% 本地</span>
              <span className="text-border">·</span>
              <span>支持 PWA 离线安装</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
              程序员的
              <br className="hidden sm:block" />
              <span className="text-accent">效率工具箱</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance mb-4">
              集合 <span className="font-mono text-foreground">{TOOL_COUNT}</span> 个常用开发工具，一站式解决日常开发需求
            </p>
            <p className="text-base text-muted-foreground text-balance mb-10 max-w-2xl mx-auto">
              JSON / SQL / XML 格式化 · HTML/CSS/JS 美化 · Base64 / Unicode 编解码 · AES/RSA 加密 · UUID / 二维码生成 · 图片格式转换与 EXIF · CIDR 子网计算
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 active:bg-primary/80 transition-colors duration-150"
              >
                开始使用
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-border bg-card text-foreground font-medium hover:border-accent/40 hover:bg-secondary/60 transition-colors duration-150"
              >
                <Github className="h-4 w-4" />
                查看 GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">适用场景</h2>
            <p className="text-muted-foreground">
              无论是日常开发、调试排错、网络运维还是数据处理，oh-my-tools 都能帮你快速解决问题
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                catId: "tool",
                icon: Code2,
                title: "日常开发",
                tools: ["JSON 格式化", "SQL 美化", "HTML 美化", "正则测试", "Cron 表达式", "JSON 转类型"],
                desc: "调试、排错、写代码时的高频小工具，一键即用",
              },
              {
                catId: "network",
                icon: Network,
                title: "系统运维",
                tools: ["CIDR 子网", "Chmod 权限", "端口检测", "文件 Diff"],
                desc: "网络排查、权限计算、配置对比，节省手算时间",
              },
              {
                catId: "converter",
                icon: ArrowLeftRight,
                title: "数据转换",
                tools: ["Base64 / URL", "Unicode / HTML 实体", "XML ↔ JSON", "进制 / 单位", "图片格式"],
                desc: "接口调试、跨语言数据交换、本地批量处理",
              },
              {
                catId: "crypto",
                icon: Shield,
                title: "加密与安全",
                tools: ["AES / RSA", "HMAC / MD5 / SHA", "JWT 解码", "密钥 / 密码生成"],
                desc: "敏感数据加解密、签名验签、密钥批量生成",
              },
            ].map((useCase) => {
              const Icon = useCase.icon
              return (
                <div
                  key={useCase.title}
                  className="p-6 rounded-xl border border-border bg-card hover:border-accent/40 transition-colors duration-150"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: `color-mix(in oklch, var(--cat-${useCase.catId}) 12%, transparent)`,
                        color: `var(--cat-${useCase.catId})`,
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold mb-2">{useCase.title}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {useCase.tools.map((t) => (
                          <span
                            key={t}
                            className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-secondary text-foreground/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{useCase.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold font-mono text-accent mb-2">{TOOL_COUNT}+</div>
              <div className="text-sm text-muted-foreground">实用工具</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-mono text-accent mb-2">{CATEGORY_COUNT}</div>
              <div className="text-sm text-muted-foreground">大分类覆盖</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-mono text-accent mb-2">100%</div>
              <div className="text-sm text-muted-foreground">浏览器本地</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold font-mono text-accent mb-2">PWA</div>
              <div className="text-sm text-muted-foreground">离线可安装</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">全部工具</h2>
          <p className="text-muted-foreground mb-8">
            {CATEGORY_COUNT} 大分类，{TOOL_COUNT} 个工具，覆盖开发者日常所需
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索工具..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-secondary border-border"
            />
          </div>
        </div>

        {searchQuery ? (
          // 搜索模式：扁平网格
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          // 分类模式：按 tools-config 顺序分组
          <div className="space-y-12">
            {toolsByCategory.map((group) => (
              <div key={group.name}>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-xl font-semibold">{group.name}</h3>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground font-mono">{group.tools.length} 个工具</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {group.tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTools.length === 0 && (
          <p className="text-center text-muted-foreground py-12">未找到匹配的工具</p>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">准备好提升开发效率了吗？</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              所有工具完全免费，无需注册，打开即用
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              进入工具箱
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground">
                  <Terminal className="h-4 w-4 text-background" />
                </div>
                <span className="font-medium">oh-my-tools</span>
              </div>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                开发者工具箱 · 数据本地处理，安全可靠
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>·</span>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </div>
            <div className="font-mono text-[11px] text-muted-foreground/80 tracking-wide">
              {TOOL_COUNT} tools · {CATEGORY_COUNT} categories · 100% local · MIT licensed
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
