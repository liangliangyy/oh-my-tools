"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { tools } from "@/lib/tools-config"

// 工具箱入口页 - 重定向到第一个工具
export default function ToolsPage() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到第一个工具
    if (tools.length > 0) {
      router.replace(`/tools/${tools[0].id}`)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-muted-foreground">加载中...</p>
      </div>
    </div>
  )
}
