"use client"

import { useEffect, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { oneDark } from "@codemirror/theme-one-dark"
import { cn } from "@/lib/utils"
import type { Extension } from "@codemirror/state"

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  language?: "json" | "javascript" | "typescript" | "yaml" | "text"
  readOnly?: boolean
  className?: string
  height?: string
  placeholder?: string
}

export function CodeEditor({
  value,
  onChange,
  language = "json",
  readOnly = false,
  className,
  height = "280px",
  placeholder,
}: CodeEditorProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [extensions, setExtensions] = useState<Extension[]>([])

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

  // 动态加载语言扩展（按需加载，避免加载所有语言包）
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
        setExtensions(ext)
      } catch (error) {
        console.error("Failed to load language extension:", error)
        setExtensions([])
      }
    }

    loadLanguageExtension()
  }, [language])

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      <CodeMirror
        value={value}
        height={height}
        theme={theme === "dark" ? oneDark : "light"}
        extensions={extensions}
        onChange={(value) => onChange?.(value)}
        editable={!readOnly}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightActiveLine: true,
          highlightSelectionMatches: false,
          syntaxHighlighting: true,
        }}
      />
    </div>
  )
}
