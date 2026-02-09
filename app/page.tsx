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
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { tools as toolsConfig, categories as categoriesConfig } from "@/lib/tools-config"

// 从 tools-config 映射首页需要的展示字段和图标
const iconMap: Record<string, any> = {
  json: Braces, json2code: FileCode, markdown: FileText, yaml: ArrowLeftRight, diff: GitCompare,
  base64: Binary, url: Link2, hash: Hash, "image-base64": Image, jwt: KeyRound,
  aes: Lock, rsa: ShieldCheck, hmac: ShieldAlert, md5: Fingerprint, "key-gen": KeySquare,
  uuid: Fingerprint, password: LockKeyhole, qrcode: QrCode,
  regex: Regex, cron: CalendarClock,
  timestamp: Clock, color: Palette, "base-converter": Calculator, "date-calc": CalendarDays, unit: Scale,
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
  color: t.color || "",
  category: categoryNameMap[t.category] || t.category,
}))

const TOOL_COUNT = toolsConfig.length
const CATEGORY_COUNT = categoriesConfig.length

const features = [
  { icon: Zap, title: "快速高效", description: "所有工具即开即用，无需安装，响应速度快" },
  { icon: Shield, title: "安全隐私", description: "100% 本地处理，数据不会上传到任何服务器" },
  { icon: Code2, title: "开发者友好", description: "专为程序员设计，支持深色模式，界面简洁" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 按分类分组
  const categories = ["格式化工具", "编码解码", "加密工具", "生成器", "转换器", "网络工具", "开发工具"]
  const toolsByCategory = categories.map(category => ({
    name: category,
    tools: filteredTools.filter(tool => tool.category === category)
  })).filter(group => group.tools.length > 0)

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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              免费在线工具
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
              程序员的
              <br className="hidden sm:block" />
              <span className="text-accent">效率工具箱</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-balance mb-4">
              集合 {TOOL_COUNT} 个常用开发工具，一站式解决日常开发需求
            </p>
            <p className="text-base text-muted-foreground text-balance mb-10 max-w-2xl mx-auto">
              JSON 格式化、代码生成、正则测试、Base64 编解码、AES/RSA 加密、HMAC/MD5 哈希、UUID 生成、二维码生成、Markdown 预览、时间戳转换、单位转换、CIDR 计算等
            </p>
            <Link
              href="/tools"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
            >
              开始使用
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
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
            <div className="p-6 rounded-xl border border-border bg-card hover:border-accent/50 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex-shrink-0">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">日常开发</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    JSON 格式化验证、代码转类型、正则测试、Cron 表达式生成等，提升编码效率
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card hover:border-accent/50 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  <Network className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">系统运维</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    CIDR 子网计算、端口连通性检测、Chmod 权限计算、文件对比等，辅助运维排查
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card hover:border-accent/50 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex-shrink-0">
                  <ArrowLeftRight className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">数据转换</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Base64/URL 编解码、单位转换、进制转换、颜色转换、时间戳、图片转 Base64 等
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl border border-border bg-card hover:border-accent/50 hover:bg-accent/5 dark:hover:bg-accent/10 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex-shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">加密与安全</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AES/RSA 加解密、HMAC/MD5/SHA 哈希计算、JWT 解码、密钥生成、UUID/密码生成，保障数据安全
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{TOOL_COUNT}+</div>
              <div className="text-sm text-muted-foreground">实用工具</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">100%</div>
              <div className="text-sm text-muted-foreground">本地处理</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">0</div>
              <div className="text-sm text-muted-foreground">数据上传</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">∞</div>
              <div className="text-sm text-muted-foreground">免费使用</div>
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
          // 搜索模式：显示扁平网格
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className={cn(
                    "group relative flex flex-col p-6 rounded-xl border border-border bg-card overflow-hidden transition-all duration-300",
                    "hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1"
                  )}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300", tool.color)} />
                  <div className="relative">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary mb-4 group-hover:bg-accent/10 transition-colors duration-300">
                      <Icon className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold mb-2 text-balance">{tool.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                    <div className="flex items-center gap-1.5 mt-4 text-sm font-medium text-accent opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      <span>立即使用</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          // 分类模式：按分类显示
          <div className="space-y-12">
            {toolsByCategory.map((group) => (
              <div key={group.name}>
                <div className="flex items-center gap-3 mb-6">
                  <h3 className="text-xl font-semibold">{group.name}</h3>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">{group.tools.length} 个工具</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {group.tools.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.id}`}
                        className={cn(
                          "group relative flex flex-col p-6 rounded-xl border border-border bg-card overflow-hidden transition-all duration-300",
                          "hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1"
                        )}
                      >
                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300", tool.color)} />
                        <div className="relative">
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary mb-4 group-hover:bg-accent/10 transition-colors duration-300">
                            <Icon className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                          </div>
                          <h3 className="font-semibold mb-2 text-balance">{tool.name}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                          <div className="flex items-center gap-1.5 mt-4 text-sm font-medium text-accent opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                            <span>立即使用</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
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
        <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
          <div className="relative p-8 md:p-12 text-center">
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
                href="https://github.com/liangliangyy/oh-my-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
