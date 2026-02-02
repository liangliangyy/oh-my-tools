"use client"

import { useEffect, useState, useRef } from "react"
import { EditorView, ViewUpdate } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { MergeView } from "@codemirror/merge"
import { oneDark } from "@codemirror/theme-one-dark"
import { cn } from "@/lib/utils"
import type { Extension } from "@codemirror/state"

interface DiffEditorProps {
  original: string
  modified: string
  onOriginalChange?: (value: string) => void
  onModifiedChange?: (value: string) => void
  language?: "json" | "javascript" | "typescript" | "yaml" | "text"
  className?: string
  height?: string
  renderSideBySide?: boolean
}

export function DiffEditor({
  original,
  modified,
  onOriginalChange,
  onModifiedChange,
  language = "text",
  className,
  height = "500px",
  renderSideBySide = true,
}: DiffEditorProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<MergeView | null>(null)
  const [langExtensions, setLangExtensions] = useState<Extension[]>([])

  useEffect(() => {
    // 检测当前主题
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark") ||
        (!document.documentElement.classList.contains("light") &&
         window.matchMedia("(prefers-color-scheme: dark)").matches)
      setTheme(isDark ? "dark" : "light")
    }

    checkTheme()

    // 监听主题变化
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  // 动态加载语言扩展
  useEffect(() => {
    const loadLanguageExtension = async () => {
      try {
        let ext: Extension[] = []
        switch (language) {
          case "json":
            const { json } = await import("@codemirror/lang-json")
            ext = [json()]
            break
          case "javascript":
            const { javascript: js } = await import("@codemirror/lang-javascript")
            ext = [js({ jsx: false })]
            break
          case "typescript":
            const { javascript: ts } = await import("@codemirror/lang-javascript")
            ext = [ts({ jsx: false, typescript: true })]
            break
          case "yaml":
            const { yaml: yml } = await import("@codemirror/lang-yaml")
            ext = [yml()]
            break
          default:
            ext = []
        }
        setLangExtensions(ext)
      } catch (error) {
        console.error("Failed to load language extension:", error)
        setLangExtensions([])
      }
    }

    loadLanguageExtension()
  }, [language])

  // 初始化编辑器（只在必要时重新创建）
  useEffect(() => {
    if (!containerRef.current || langExtensions.length === 0) return

    const extensions = [
      ...langExtensions,
      theme === "dark" ? oneDark : [],
      EditorView.lineWrapping,
    ]

    // 创建merge view
    const view = new MergeView({
      a: {
        doc: original,
        extensions: [
          ...extensions,
          EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.docChanged && onOriginalChange) {
              onOriginalChange(update.state.doc.toString())
            }
          }),
        ],
      },
      b: {
        doc: modified,
        extensions: [
          ...extensions,
          EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.docChanged && onModifiedChange) {
              onModifiedChange(update.state.doc.toString())
            }
          }),
        ],
      },
      parent: containerRef.current,
      orientation: renderSideBySide ? "a-b" : "b-a",
      highlightChanges: true,
      gutter: true,
    })

    viewRef.current = view

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [langExtensions, theme, renderSideBySide])

  // 更新原始文档内容（不重新创建编辑器）
  useEffect(() => {
    if (!viewRef.current) return
    const view = viewRef.current.a
    const currentDoc = view.state.doc.toString()
    
    if (currentDoc !== original) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: original,
        },
      })
    }
  }, [original])

  // 更新修改文档内容（不重新创建编辑器）
  useEffect(() => {
    if (!viewRef.current) return
    const view = viewRef.current.b
    const currentDoc = view.state.doc.toString()
    
    if (currentDoc !== modified) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentDoc.length,
          insert: modified,
        },
      })
    }
  }, [modified])

  return (
    <div 
      ref={containerRef}
      className={cn("rounded-lg border border-border overflow-hidden", className)}
      style={{ height }}
    />
  )
}
