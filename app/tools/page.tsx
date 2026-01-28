"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
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
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const tools = [
  { id: "json", name: "JSON 格式化", icon: Braces, component: JsonFormatter, description: "格式化、压缩、验证JSON" },
  { id: "json2code", name: "JSON 转代码", icon: FileCode, component: JsonToCode, description: "JSON 转多语言类型" },
  { id: "diff", name: "文件 Diff", icon: GitCompare, component: FileDiff, description: "对比两个文件差异" },
  { id: "regex", name: "正则测试", icon: Regex, component: RegexTester, description: "测试正则表达式匹配" },
  { id: "base64", name: "Base64", icon: Binary, component: Base64Encoder, description: "Base64 编码/解码" },
  { id: "timestamp", name: "时间戳", icon: Clock, component: TimestampConverter, description: "Unix 时间戳转换" },
  { id: "url", name: "URL 编码", icon: Link2, component: UrlEncoder, description: "URL 编码/解码" },
  { id: "hash", name: "Hash 生成", icon: Hash, component: HashGenerator, description: "SHA-1/256/384/512" },
  { id: "color", name: "颜色转换", icon: Palette, component: ColorConverter, description: "HEX/RGB/HSL 互转" },
  { id: "uuid", name: "UUID 生成", icon: Fingerprint, component: UuidGenerator, description: "生成随机 UUID" },
  { id: "jwt", name: "JWT 解码器", icon: KeyRound, component: JwtDecoder, description: "解析 JWT Token" },
  { id: "cron", name: "Cron 表达式", icon: CalendarClock, component: CronExpression, description: "Cron 定时任务" },
  { id: "yaml", name: "YAML ↔ JSON", icon: ArrowLeftRight, component: YamlJsonConverter, description: "YAML/JSON 互转" },
  { id: "password", name: "密码生成器", icon: Lock, component: PasswordGenerator, description: "生成安全密码" },
  { id: "base-converter", name: "进制转换", icon: Calculator, component: NumberBaseConverter, description: "进制互转" },
]

export default function ToolsPage() {
  const searchParams = useSearchParams()
  const toolParam = searchParams.get("tool")
  
  const [activeTool, setActiveTool] = useState(toolParam || tools[0].id)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (toolParam && tools.some(t => t.id === toolParam)) {
      setActiveTool(toolParam)
    }
  }, [toolParam])

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

              {/* Tool List */}
              <nav className="space-y-1">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setActiveTool(tool.id)
                        setSidebarOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all relative",
                        activeTool === tool.id
                          ? "bg-accent/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      {activeTool === tool.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full" />
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
                        <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
                      </div>
                    </button>
                  )
                })}
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
          <p className="text-sm text-muted-foreground text-center">
            oh-my-tools - 开发者工具箱 · 所有工具均在本地运行，数据不会上传
          </p>
        </div>
      </footer>
    </div>
  )
}
