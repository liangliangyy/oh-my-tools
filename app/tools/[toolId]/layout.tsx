"use client"

import { useState, ReactNode, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { tools, categories } from "@/lib/tools-config"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Terminal,
  Search,
  Home,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SIDEBAR_COLLAPSE_KEY = "toolsSidebarCollapsed"
const AUTO_COLLAPSE_QUERY = "(max-width: 1279px)"

export default function ToolsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const currentToolId = pathname.split('/').pop() || ''
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userCollapsed, setUserCollapsed] = useState(false)
  const [viewportForcesCollapse, setViewportForcesCollapse] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.id))
  )
  const navRef = useRef<HTMLElement>(null)
  const activeItemRef = useRef<HTMLAnchorElement>(null)

  const collapsed = userCollapsed || viewportForcesCollapse

  // 初始化：读取用户偏好 + 视口监听
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSE_KEY)
    if (stored === "1") setUserCollapsed(true)

    const mql = window.matchMedia(AUTO_COLLAPSE_QUERY)
    const apply = () => setViewportForcesCollapse(mql.matches)
    apply()
    mql.addEventListener("change", apply)
    return () => mql.removeEventListener("change", apply)
  }, [])

  const toggleCollapse = useCallback(() => {
    // 视口强制折叠时，点击展开仅临时展开，不覆盖用户偏好
    if (viewportForcesCollapse) {
      setViewportForcesCollapse(false)
      return
    }
    setUserCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(SIDEBAR_COLLAPSE_KEY, next ? "1" : "0")
      return next
    })
  }, [viewportForcesCollapse])

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const saveScrollPosition = () => {
    if (navRef.current) {
      sessionStorage.setItem('toolsNavScrollPosition', navRef.current.scrollTop.toString())
    }
  }

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('toolsNavScrollPosition')
    if (savedPosition && navRef.current) {
      navRef.current.scrollTop = parseInt(savedPosition, 10)
    }
  }, [])

  useEffect(() => {
    if (activeItemRef.current && navRef.current) {
      const activeItem = activeItemRef.current
      const nav = navRef.current
      const navRect = nav.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()
      const isVisible =
        itemRect.top >= navRect.top &&
        itemRect.bottom <= navRect.bottom
      if (!isVisible) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentToolId, collapsed])

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toolsByCategory = categories.map(category => ({
    ...category,
    tools: filteredTools.filter(tool => tool.category === category.id)
  })).filter(category => category.tools.length > 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-3 md:px-4 h-16 flex items-center justify-between">
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

      <div className="px-3 md:px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
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
              "fixed lg:relative inset-y-0 left-0 z-40 bg-background lg:bg-transparent p-4 lg:p-0 transform transition-[transform,width] duration-200 ease-out lg:transform-none border-r lg:border-r-0 border-border flex-shrink-0",
              sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0",
              collapsed ? "lg:w-14" : "lg:w-60",
              !sidebarOpen && "w-72"
            )}
          >
            <div className="sticky top-20 space-y-3 pt-16 lg:pt-0">
              {/* Collapse toggle (desktop only) */}
              <div className={cn("hidden lg:flex", collapsed ? "justify-center" : "justify-end")}>
                <button
                  type="button"
                  onClick={toggleCollapse}
                  title={collapsed ? "展开侧边栏" : "折叠侧边栏"}
                  className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </button>
              </div>

              {/* Search */}
              {collapsed ? (
                <button
                  type="button"
                  onClick={toggleCollapse}
                  title="搜索工具"
                  className="hidden lg:flex items-center justify-center h-9 w-9 mx-auto rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索工具..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-secondary border-border"
                  />
                </div>
              )}

              {/* Tool List */}
              <nav
                ref={navRef}
                onScroll={saveScrollPosition}
                className={cn(
                  "max-h-[calc(100vh-11rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                  collapsed ? "lg:px-0 space-y-1" : "pr-2 space-y-3"
                )}
              >
                {collapsed ? (
                  // 折叠：图标条
                  <div className="hidden lg:flex flex-col items-center gap-1">
                    {tools.map((tool) => {
                      const Icon = tool.icon
                      const isActive = currentToolId === tool.id
                      return (
                        <Link
                          key={tool.id}
                          ref={isActive ? activeItemRef : null}
                          href={`/tools/${tool.id}`}
                          title={tool.name}
                          className={cn(
                            "relative flex items-center justify-center h-9 w-9 rounded-md transition-colors",
                            isActive
                              ? "bg-accent/15 text-accent"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          )}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full" />
                          )}
                          <Icon className="h-4 w-4" />
                        </Link>
                      )
                    })}
                  </div>
                ) : searchQuery ? (
                  // 搜索：扁平列表
                  <div className="space-y-1">
                    {filteredTools.map((tool) => {
                      const Icon = tool.icon
                      const isActive = currentToolId === tool.id
                      return (
                        <Link
                          key={tool.id}
                          ref={isActive ? activeItemRef : null}
                          href={`/tools/${tool.id}`}
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative",
                            isActive
                              ? "bg-accent/15 text-accent"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                          )}
                        >
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full" />
                          )}
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-sm truncate">{tool.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  // 分类分组
                  toolsByCategory.map((category) => {
                    const CategoryIcon = category.icon
                    const isExpanded = expandedCategories.has(category.id)

                    return (
                      <div key={category.id} className="space-y-1">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="h-3.5 w-3.5" />
                            <span>{category.name}</span>
                            <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                              {category.tools.length}
                            </span>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>

                        {isExpanded && (
                          <div className="space-y-0.5 pl-2">
                            {category.tools.map((tool) => {
                              const Icon = tool.icon
                              const isActive = currentToolId === tool.id
                              return (
                                <Link
                                  key={tool.id}
                                  ref={isActive ? activeItemRef : null}
                                  href={`/tools/${tool.id}`}
                                  onClick={() => setSidebarOpen(false)}
                                  className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative",
                                    isActive
                                      ? "bg-accent/15 text-accent"
                                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                  )}
                                >
                                  {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full" />
                                  )}
                                  <Icon className="h-4 w-4 flex-shrink-0" />
                                  <span className="font-medium text-sm truncate">{tool.name}</span>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </nav>

              {!collapsed && filteredTools.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">未找到匹配的工具</p>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="px-3 md:px-4 py-6">
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
