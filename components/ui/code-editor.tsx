"use client"

import { useEffect, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { javascript } from "@codemirror/lang-javascript"
import { yaml } from "@codemirror/lang-yaml"
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

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      <CodeMirror
        value={value}
        height={height}
        theme={theme === "dark" ? oneDark : "light"}
        extensions={getLanguageExtension()}
        onChange={(value) => onChange?.(value)}
        editable={!readOnly}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  )
}
