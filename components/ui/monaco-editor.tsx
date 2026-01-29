"use client"

import { useEffect, useState, useRef } from "react"
import Editor from "@monaco-editor/react"
import { cn } from "@/lib/utils"

interface MonacoEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: string
  readOnly?: boolean
  className?: string
  height?: string | number
  placeholder?: string
}

export function MonacoEditor({
  value,
  onChange,
  language = "json",
  readOnly = false,
  className,
  height = "280px",
  placeholder,
}: MonacoEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark")
  const editorRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
    // 检测当前主题
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark") ||
        (!document.documentElement.classList.contains("light") &&
         window.matchMedia("(prefers-color-scheme: dark)").matches)
      setTheme(isDark ? "vs-dark" : "light")
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

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    // 强制编辑器重新计算布局
    setTimeout(() => {
      editor.layout()
    }, 100)
  }

  if (!mounted) {
    return (
      <div 
        className={cn(
          "rounded-lg border border-border bg-secondary animate-pulse",
          className
        )}
        style={{ height }}
      />
    )
  }

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(v) => onChange?.(v || "")}
        theme={theme}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 12, bottom: 12 },
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          renderLineHighlight: "none",
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          contextmenu: false,
          folding: true,
          lineDecorationsWidth: 8,
          lineNumbersMinChars: 3,
          glyphMargin: false,
          fixedOverflowWidgets: true,
        }}
      />
      {!value && placeholder && (
        <div className="absolute top-3 left-14 text-muted-foreground/50 text-sm font-mono pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  )
}
