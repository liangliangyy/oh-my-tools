"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  readOnly?: boolean
  className?: string
  language?: string
}

export function CodeEditor({
  value,
  onChange,
  placeholder,
  readOnly = false,
  className,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  const lines = value.split("\n")
  const lineCount = Math.max(lines.length, 1)

  useEffect(() => {
    const textarea = textareaRef.current
    const lineNumbers = lineNumbersRef.current
    if (textarea && lineNumbers) {
      const syncScroll = () => {
        lineNumbers.scrollTop = textarea.scrollTop
      }
      textarea.addEventListener("scroll", syncScroll)
      return () => textarea.removeEventListener("scroll", syncScroll)
    }
  }, [])

  return (
    <div
      className={cn(
        "relative flex rounded-lg border border-border bg-secondary overflow-hidden",
        className
      )}
    >
      {/* Line Numbers */}
      <div
        ref={lineNumbersRef}
        className="flex-shrink-0 w-12 bg-muted/50 border-r border-border overflow-hidden select-none"
        aria-hidden="true"
      >
        <div className="py-3 px-2 text-right">
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className="text-xs leading-6 text-muted-foreground/60 font-mono"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={false}
        className={cn(
          "flex-1 min-h-[256px] py-3 px-4 bg-transparent resize-none outline-none",
          "font-mono text-sm leading-6 text-foreground placeholder:text-muted-foreground/50",
          readOnly && "cursor-default"
        )}
      />
    </div>
  )
}
