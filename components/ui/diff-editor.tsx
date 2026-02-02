"use client"

import { useEffect, useState, useRef } from "react"
import { EditorView, ViewUpdate } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { MergeView } from "@codemirror/merge"
import { json } from "@codemirror/lang-json"
import { javascript } from "@codemirror/lang-javascript"
import { yaml } from "@codemirror/lang-yaml"
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

  const getLanguageExtension = (): Extension[] => {
    switch (language) {
      case "json":
        return [json()]
      case "javascript":
        return [javascript({ jsx: false })]
      case "typescript":
        return [javascript({ jsx: false, typescript: true })]
      case "yaml":
        return [yaml()]
      default:
        return []
    }
  }

  // 初始化编辑器（只在必要时重新创建）
  useEffect(() => {
    if (!containerRef.current) return

    const extensions = [
      ...getLanguageExtension(),
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
  }, [language, theme, renderSideBySide])

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
