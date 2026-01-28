"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { JsonFormatter } from "@/components/tools/json-formatter"
import { JsonToCode } from "@/components/tools/json-to-code"
import { FileDiff } from "@/components/tools/file-diff"
import { RegexTester } from "@/components/tools/regex-tester"
import { Base64Encoder } from "@/components/tools/base64-encoder"
import { TimestampConverter } from "@/components/tools/timestamp-converter"
import { UrlEncoder } from "@/components/tools/url-encoder"
import { HashGenerator } from "@/components/tools/hash-generator"
import { ColorConverter } from "@/components/tools/color-converter"
import { UuidGenerator } from "@/components/tools/uuid-generator"
import { JwtDecoder } from "@/components/tools/jwt-decoder"
import { CronExpression } from "@/components/tools/cron-expression"
import { YamlJsonConverter } from "@/components/tools/yaml-json-converter"
import { PasswordGenerator } from "@/components/tools/password-generator"
import { NumberBaseConverter } from "@/components/tools/number-base-converter"
import { MarkdownPreview } from "@/components/tools/markdown-preview"
import { QrcodeGenerator } from "@/components/tools/qrcode-generator"
import { ImageToBase64 } from "@/components/tools/image-to-base64"
import { DateCalculator } from "@/components/tools/date-calculator"
import { CidrCalculator } from "@/components/tools/cidr-calculator"
import { ChmodCalculator } from "@/components/tools/chmod-calculator"
import { PortCheckGenerator } from "@/components/tools/port-check-generator"
import { UnitConverter } from "@/components/tools/unit-converter"
import { ThemeToggle } from "@/components/theme-toggle"
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
  Home,
  Menu,
  X,
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
  Shield,
  PcCase,
  Scale,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const tools = [
  { id: "json", name: "JSON 格式化", icon: Braces, component: JsonFormatter, description: "格式化、压缩、验证JSON", category: "format" },
  { id: "json2code", name: "JSON 转代码", icon: FileCode, component: JsonToCode, description: "JSON 转多语言类型", category: "format" },
  { id: "markdown", name: "Markdown 预览", icon: FileText, component: MarkdownPreview, description: "Markdown 实时预览", category: "format" },
  { id: "yaml", name: "YAML ↔ JSON", icon: ArrowLeftRight, component: YamlJsonConverter, description: "YAML/JSON 互转", category: "format" },
  { id: "diff", name: "文件 Diff", icon: GitCompare, component: FileDiff, description: "对比两个文件差异", category: "format" },
  { id: "base64", name: "Base64", icon: Binary, component: Base64Encoder, description: "Base64 编码/解码", category: "encode" },
  { id: "url", name: "URL 编码", icon: Link2, component: UrlEncoder, description: "URL 编码/解码", category: "encode" },
  { id: "hash", name: "Hash 生成", icon: Hash, component: HashGenerator, description: "SHA-1/256/384/512", category: "encode" },
  { id: "image-base64", name: "图片转 Base64", icon: Image, component: ImageToBase64, description: "图片转 Base64", category: "encode" },
  { id: "jwt", name: "JWT 解码器", icon: KeyRound, component: JwtDecoder, description: "解析 JWT Token", category: "encode" },
  { id: "uuid", name: "UUID 生成", icon: Fingerprint, component: UuidGenerator, description: "生成 UUID v1/v4/v5", category: "generator" },
  { id: "password", name: "密码生成器", icon: Lock, component: PasswordGenerator, description: "生成安全密码", category: "generator" },
  { id: "qrcode", name: "二维码生成", icon: QrCode, component: QrcodeGenerator, description: "生成二维码图片", category: "generator" },
  { id: "regex", name: "正则测试", icon: Regex, component: RegexTester, description: "测试正则表达式匹配", category: "tool" },
  { id: "cron", name: "Cron 表达式", icon: CalendarClock, component: CronExpression, description: "Cron 定时任务", category: "tool" },
  { id: "timestamp", name: "时间戳", icon: Clock, component: TimestampConverter, description: "Unix 时间戳转换", category: "converter" },
  { id: "color", name: "颜色转换", icon: Palette, component: ColorConverter, description: "HEX/RGB/HSL 互转", category: "converter" },
  { id: "unit", name: "单位转换", icon: Scale, component: UnitConverter, description: "常用单位数值转换", category: "converter" },
  { id: "cidr", name: "IP 子网计算", icon: Network, component: CidrCalculator, description: "CIDR 子网掩码计算", category: "network" },
  { id: "chmod", name: "Chmod 计算", icon: Shield, component: ChmodCalculator, description: "Linux 文件权限计算", category: "network" },
  { id: "port-check", name: "端口检测命令", icon: PcCase, component: PortCheckGenerator, description: "生成端口连通性检测命令", category: "network" },
]

const categories = [
  { id: "format", name: "格式化工具", icon: Braces },
  { id: "encode", name: "编码解码", icon: Binary },
  { id: "generator", name: "生成器", icon: Fingerprint },
  { id: "converter", name: "转换器", icon: ArrowLeftRight },
  { id: "tool", name: "开发工具", icon: Terminal },
  { id: "network", name: "网络工具", icon: Network },
]

export default function ToolsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const toolParam = searchParams.get("tool")

  const [activeTool, setActiveTool] = useState(toolParam || tools[0].id)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.id))
  )

  useEffect(() => {
    if (toolParam && tools.some(t => t.id === toolParam)) {
      setActiveTool(toolParam)
    }
  }, [toolParam])

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const handleToolChange = (toolId: string) => {
    setActiveTool(toolId)
    setSidebarOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    if (toolId) {
      params.set("tool", toolId)
    } else {
      params.delete("tool")
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // 按分类分组工具
  const toolsByCategory = categories.map(category => ({
    ...category,
    tools: filteredTools.filter(tool => tool.category === category.id)
  })).filter(category => category.tools.length > 0)

  const ActiveComponent = tools.find((t) => t.id === activeTool)?.component || JsonFormatter
  const currentTool = tools.find((t) => t.id === activeTool)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-foreground">
                <Terminal className="h-5 w-5 text-background" />
              </div>
              <span className="font-semibold text-lg tracking-tight">oh-my-tools</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">返回首页</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={cn(
              "fixed lg:relative inset-y-0 left-0 z-40 w-72 lg:w-64 bg-background lg:bg-transparent p-4 lg:p-0 transform transition-transform lg:transform-none border-r lg:border-r-0 border-border",
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}
          >
            <div className="sticky top-24 space-y-4 pt-16 lg:pt-0">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索工具..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>

              {/* Tool List - Categorized */}
              <nav className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {searchQuery ? (
                  // 搜索模式：显示扁平列表
                  <div className="space-y-1">
                    {filteredTools.map((tool) => {
                      const Icon = tool.icon
                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleToolChange(tool.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 relative",
                            activeTool === tool.id
                              ? "bg-accent/50 text-accent-foreground dark:bg-accent/30"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent/30 active:bg-accent/40 dark:hover:bg-accent/20 dark:active:bg-accent/30"
                          )}
                        >
                          {activeTool === tool.id && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-r-full" />
                          )}
                          <Icon className={cn(
                            "h-4 w-4 flex-shrink-0 transition-colors",
                            activeTool === tool.id && "text-accent"
                          )} />
                          <div className="min-w-0 flex-1">
                            <div className={cn(
                              "font-medium text-sm truncate",
                              activeTool === tool.id && "text-accent"
                            )}>{tool.name}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  // 分类模式：显示可折叠分组
                  toolsByCategory.map((category) => {
                    const CategoryIcon = category.icon
                    const isExpanded = expandedCategories.has(category.id)

                    return (
                      <div key={category.id} className="space-y-1">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/20 active:bg-accent/30 dark:hover:bg-accent/10 dark:active:bg-accent/20 rounded-md transition-all duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="h-3.5 w-3.5" />
                            <span>{category.name}</span>
                            <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                              {category.tools.length}
                            </span>
                          </div>
                          <svg
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isExpanded && "rotate-180"
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isExpanded && (
                          <div className="space-y-0.5 pl-2">
                            {category.tools.map((tool) => {
                              const Icon = tool.icon
                              return (
                                <button
                                  key={tool.id}
                                  onClick={() => handleToolChange(tool.id)}
                                  className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 relative",
                                    activeTool === tool.id
                                      ? "bg-accent/50 text-accent-foreground dark:bg-accent/30"
                                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30 active:bg-accent/40 dark:hover:bg-accent/20 dark:active:bg-accent/30"
                                  )}
                                >
                                  {activeTool === tool.id && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-r-full" />
                                  )}
                                  <Icon className={cn(
                                    "h-4 w-4 flex-shrink-0 transition-colors",
                                    activeTool === tool.id && "text-accent"
                                  )} />
                                  <div className="min-w-0 flex-1">
                                    <div className={cn(
                                      "font-medium text-sm truncate",
                                      activeTool === tool.id && "text-accent"
                                    )}>{tool.name}</div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </nav>

              {filteredTools.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">未找到匹配的工具</p>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="rounded-xl border border-border bg-card p-4 md:p-6">
              <div className="mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  {currentTool && (
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                      <currentTool.icon className="h-5 w-5 text-accent" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-xl font-semibold">{currentTool?.name}</h1>
                    <p className="text-sm text-muted-foreground">{currentTool?.description}</p>
                  </div>
                </div>
              </div>
              <ActiveComponent />
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground text-center">
              oh-my-tools - 开发者工具箱 · 所有工具均在本地运行，数据不会上传
            </p>
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
