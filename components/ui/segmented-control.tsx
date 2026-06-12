"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * SegmentedControl — 互斥单选按钮组（mode toggle / tab-like）。
 *
 * 规则（system.md）：
 *  - 凹槽容器 bg-bg-inset + border-border
 *  - 凸起激活键 bg-card text-foreground
 *  - 未选中 text-muted-foreground hover:bg-secondary/60
 *  - 仅一种尺寸 h-7。统一性硬约束，不暴露 size 参数。
 *  - 禁止再用 variant={active ? "secondary" : "ghost"} 自行拼装。
 */

export type SegmentedControlItem<T extends string> = {
  value: T
  label: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  ariaLabel?: string
  disabled?: boolean
}

interface SegmentedControlProps<T extends string> {
  value: T
  onValueChange: (value: T) => void
  items: SegmentedControlItem<T>[]
  className?: string
  ariaLabel?: string
}

export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  items,
  className,
  ariaLabel,
}: SegmentedControlProps<T>) {
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([])

  const focusItem = (index: number) => {
    const len = items.length
    const normalized = ((index % len) + len) % len
    itemRefs.current[normalized]?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault()
        focusItem(index + 1)
        break
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault()
        focusItem(index - 1)
        break
      case "Home":
        e.preventDefault()
        focusItem(0)
        break
      case "End":
        e.preventDefault()
        focusItem(items.length - 1)
        break
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex w-fit items-center gap-0.5 rounded-md border border-border bg-bg-inset p-1",
        className,
      )}
    >
      {items.map((item, index) => {
        const isActive = item.value === value
        const Icon = item.icon
        return (
          <button
            key={item.value}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={item.ariaLabel}
            tabIndex={isActive ? 0 : -1}
            disabled={item.disabled}
            onClick={() => !item.disabled && onValueChange(item.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "inline-flex h-7 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-3 text-sm font-medium outline-none transition-colors duration-150",
              "focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isActive
                ? "bg-card text-foreground hover:bg-card"
                : "bg-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
