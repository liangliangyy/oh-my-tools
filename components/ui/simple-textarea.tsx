"use client"

import { cn } from "@/lib/utils"

interface SimpleTextareaProps {
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  className?: string
  height?: string
  placeholder?: string
}

export function SimpleTextarea({
  value,
  onChange,
  readOnly = false,
  className,
  height = "320px",
  placeholder,
}: SimpleTextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      readOnly={readOnly}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-lg border border-border bg-background px-3 py-2",
        "font-mono text-sm leading-relaxed",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-none",
        className
      )}
      style={{ height }}
      spellCheck={false}
    />
  )
}
