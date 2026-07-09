"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { tools } from "@/lib/tools-config"
import { useFavorites, useRecents } from "@/hooks/use-tool-prefs"
import { cn } from "@/lib/utils"
import { Search, Star, Clock, CornerDownLeft } from "lucide-react"

// 全局命令面板 —— Cmd/Ctrl+K 唤起，方向键导航，回车跳转。
// 手写轻量实现，不引入额外依赖。
export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const favorites = useFavorites()
  const recents = useRecents()

  // 全局快捷键：Cmd/Ctrl+K 开关
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // 打开时重置状态并聚焦输入框；锁定背景滚动
  useEffect(() => {
    if (open) {
      setQuery("")
      setActiveIndex(0)
      const t = setTimeout(() => inputRef.current?.focus(), 0)
      document.body.style.overflow = "hidden"
      return () => {
        clearTimeout(t)
        document.body.style.overflow = ""
      }
    }
  }, [open])

  // 结果：无查询时按「收藏 → 最近 → 全部」排序去重；有查询时按名称/描述/关键词过滤
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q) {
      return tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.keywords?.some((k) => k.toLowerCase().includes(q))
      )
    }
    const seen = new Set<string>()
    const ordered: typeof tools = []
    for (const id of [...favorites, ...recents]) {
      if (seen.has(id)) continue
      const t = tools.find((x) => x.id === id)
      if (t) {
        seen.add(id)
        ordered.push(t)
      }
    }
    const rest = tools.filter((t) => !seen.has(t.id))
    return [...ordered, ...rest]
  }, [query, favorites, recents])

  // 查询变化时把高亮收敛回顶部
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const close = useCallback(() => setOpen(false), [])

  const select = useCallback(
    (index: number) => {
      const tool = results[index]
      if (!tool) return
      setOpen(false)
      router.push(`/tools/${tool.id}`)
    },
    [results, router]
  )

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      select(activeIndex)
    } else if (e.key === "Escape") {
      e.preventDefault()
      close()
    }
  }

  // 高亮项滚动可见
  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, open])

  if (!open) return null

  const favSet = new Set(favorites)
  const recentSet = new Set(recents)
  const showQuickHint = query.trim() === ""

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[15vh] bg-background/80 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-full max-w-xl rounded-lg border border-border bg-card overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="命令面板"
      >
        {/* 输入框 */}
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="搜索工具…"
            className="flex-1 h-12 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* 结果列表 */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">未找到匹配的工具</p>
          ) : (
            results.map((tool, index) => {
              const Icon = tool.icon
              const isActive = index === activeIndex
              return (
                <button
                  key={tool.id}
                  data-index={index}
                  type="button"
                  onClick={() => select(index)}
                  onMouseMove={() => setActiveIndex(index)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    isActive ? "bg-secondary" : "hover:bg-secondary/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      isActive ? "text-accent" : "text-muted-foreground"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{tool.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
                  </div>
                  {showQuickHint && favSet.has(tool.id) && (
                    <Star className="h-3.5 w-3.5 text-accent fill-current flex-shrink-0" />
                  )}
                  {showQuickHint && !favSet.has(tool.id) && recentSet.has(tool.id) && (
                    <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                  {isActive && (
                    <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* 底部提示 */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="font-mono border border-border rounded px-1">↑</kbd>
            <kbd className="font-mono border border-border rounded px-1">↓</kbd>
            导航
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono border border-border rounded px-1">↵</kbd>
            打开
          </span>
        </div>
      </div>
    </div>
  )
}
