"use client"

import { Suspense } from "react"
import Link from "next/link"
import { getToolById } from "@/lib/tools-config"
import { Loader2 } from "lucide-react"

interface ToolPageClientProps {
  toolId: string
}

function ToolLoadingFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  )
}

export function ToolPageClient({ toolId }: ToolPageClientProps) {
  const currentTool = getToolById(toolId)

  if (!currentTool) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 md:p-6">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-3">工具未找到</h1>
          <p className="text-muted-foreground mb-6">请求的工具不存在</p>
          <Link href="/tools" className="text-accent hover:underline font-medium">
            返回工具箱
          </Link>
        </div>
      </div>
    )
  }

  const ActiveComponent = currentTool.component
  const catColorVar = `var(--cat-${currentTool.category})`

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* 工具头部 */}
      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
            style={{
              backgroundColor: `color-mix(in oklch, ${catColorVar} 14%, transparent)`,
              color: catColorVar,
            }}
          >
            <currentTool.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-semibold tracking-tight leading-snug">{currentTool.name}</h1>
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap leading-none"
                style={{
                  backgroundColor: `color-mix(in oklch, ${catColorVar} 14%, transparent)`,
                  color: catColorVar,
                }}
              >
                {currentTool.category}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{currentTool.description}</p>
          </div>
        </div>
      </div>
      {/* 工具内容 */}
      <div className="p-3 md:p-5">
        <Suspense fallback={<ToolLoadingFallback />}>
          <ActiveComponent />
        </Suspense>
      </div>
    </div>
  )
}
