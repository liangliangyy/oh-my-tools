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
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const tools = [
  { id: "json", name: "JSON 格式化", icon: Braces, description: "格式化、压缩、验证 JSON 数据", color: "from-emerald-500/20 to-emerald-500/5" },
  { id: "json2code", name: "JSON 转代码", icon: FileCode, description: "JSON 转 TypeScript/Go/Python 等", color: "from-indigo-500/20 to-indigo-500/5" },
  { id: "diff", name: "文件 Diff", icon: GitCompare, description: "对比两个文件的差异", color: "from-teal-500/20 to-teal-500/5" },
  { id: "regex", name: "正则测试", icon: Regex, description: "实时测试正则表达式匹配结果", color: "from-blue-500/20 to-blue-500/5" },
  { id: "base64", name: "Base64 编解码", icon: Binary, description: "Base64 编码与解码转换", color: "from-amber-500/20 to-amber-500/5" },
  { id: "timestamp", name: "时间戳转换", icon: Clock, description: "Unix 时间戳与日期时间互转", color: "from-rose-500/20 to-rose-500/5" },
  { id: "url", name: "URL 编解码", icon: Link2, description: "URL 编码与解码处理", color: "from-cyan-500/20 to-cyan-500/5" },
  { id: "hash", name: "Hash 生成", icon: Hash, description: "生成 SHA-1/256/384/512 哈希", color: "from-violet-500/20 to-violet-500/5" },
  { id: "color", name: "颜色转换", icon: Palette, description: "HEX、RGB、HSL 格式互转", color: "from-pink-500/20 to-pink-500/5" },
  { id: "uuid", name: "UUID 生成", icon: Fingerprint, description: "批量生成随机 UUID v4", color: "from-orange-500/20 to-orange-500/5" },
  { id: "jwt", name: "JWT 解码器", icon: KeyRound, description: "解析 JWT Token 查看内容", color: "from-sky-500/20 to-sky-500/5" },
  { id: "cron", name: "Cron 表达式", icon: CalendarClock, description: "生成和解析 Cron 定时任务", color: "from-purple-500/20 to-purple-500/5" },
  { id: "yaml", name: "YAML ↔ JSON", icon: ArrowLeftRight, description: "YAML 与 JSON 格式互转", color: "from-green-500/20 to-green-500/5" },
  { id: "password", name: "密码生成器", icon: Lock, description: "生成安全随机密码", color: "from-red-500/20 to-red-500/5" },
  { id: "base-converter", name: "进制转换", icon: Calculator, description: "二/八/十/十六进制互转", color: "from-slate-500/20 to-slate-500/5" },
]

const features = [
  { icon: Zap, title: "快速高效", description: "所有工具即开即用，无需安装" },
  { icon: Shield, title: "安全隐私", description: "数据本地处理，不会上传服务器" },
  { icon: Code2, title: "开发者友好", description: "专为程序员设计的工具集" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <p className="text-lg md:text-xl text-muted-foreground text-balance mb-10">
              集合 JSON、正则、编码、时间戳等常用开发工具，一站式解决日常开发需求
            </p>
            <Link
              href="/tools"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-all shadow-lg shadow-foreground/10 hover:shadow-xl hover:shadow-foreground/20"
            >
              开始使用
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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

      {/* Tools Grid */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">全部工具</h2>
          <p className="text-muted-foreground mb-8">
            选择你需要的工具，立即开始使用
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.id}
                href={`/tools?tool=${tool.id}`}
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors"
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground">
                <Terminal className="h-4 w-4 text-background" />
              </div>
              <span className="font-medium">oh-my-tools</span>
            </div>
            <p className="text-sm text-muted-foreground">
              oh-my-tools · 开发者工具箱 · 数据本地处理，安全可靠
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
