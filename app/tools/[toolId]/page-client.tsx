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
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )
}

export function ToolPageClient({ toolId }: ToolPageClientProps) {
  const currentTool = getToolById(toolId)

  // 如果工具不存在，显示404
  if (!currentTool) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 md:p-6">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">工具未找到</h1>
          <p className="text-muted-foreground mb-6">请求的工具不存在</p>
          <Link href="/tools" className="text-accent hover:underline">
            返回工具箱
          </Link>
        </div>
      </div>
    )
  }

  const ActiveComponent = currentTool.component

  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="mb-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
            <currentTool.icon className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">{currentTool.name}</h1>
            <p className="text-sm text-muted-foreground">{currentTool.description}</p>
          </div>
        </div>
      </div>
      <Suspense fallback={<ToolLoadingFallback />}>
        <ActiveComponent />
      </Suspense>
    </div>
  )
}
