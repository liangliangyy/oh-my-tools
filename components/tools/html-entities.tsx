"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Copy, Check, Trash2 } from "lucide-react"

type Mode = "encode" | "decode"
type Strategy = "named" | "numeric" | "hex" | "all"

const namedEntities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  " ": "&nbsp;",
  "¢": "&cent;",
  "£": "&pound;",
  "¥": "&yen;",
  "€": "&euro;",
  "§": "&sect;",
  "¶": "&para;",
  "•": "&bull;",
  "…": "&hellip;",
  "—": "&mdash;",
  "–": "&ndash;",
  "‘": "&lsquo;",
  "’": "&rsquo;",
  "“": "&ldquo;",
  "”": "&rdquo;",
}

function encodeEntities(text: string, strategy: Strategy): string {
  if (strategy === "named") {
    return text.replace(/[&<>"' ©®™¢£¥€§¶•…—–‘’“”]/g, (c) => namedEntities[c] || c)
  }
  if (strategy === "numeric") {
    return text.replace(/[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\uFFFF]/g, (c) => {
      return `&#${c.charCodeAt(0)};`
    })
  }
  if (strategy === "hex") {
    return text.replace(/[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\uFFFF]/g, (c) => {
      return `&#x${c.charCodeAt(0).toString(16).toUpperCase()};`
    })
  }
  return text.replace(/./gs, (c) => {
    if (namedEntities[c]) return namedEntities[c]
    if (c.charCodeAt(0) > 127) return `&#${c.charCodeAt(0)};`
    return c
  })
}

function decodeEntities(text: string): string {
  if (typeof document !== "undefined") {
    const ta = document.createElement("textarea")
    ta.innerHTML = text
    return ta.value
  }
  return text
}

function HtmlEntitiesInner() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<Mode>("encode")
  const [strategy, setStrategy] = useState<Strategy>("named")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const process = () => {
    if (!input) {
      setError("请输入内容")
      return
    }
    try {
      setOutput(mode === "encode" ? encodeEntities(input, strategy) : decodeEntities(input))
      setError("")
    } catch (e) {
      setError("处理失败：" + (e as Error).message)
      setOutput("")
    }
  }

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setInput("")
    setOutput("")
    setError("")
  }

  return (
    <div className="space-y-4">
      <SegmentedControl<Mode>
        ariaLabel="编解码模式"
        value={mode}
        onValueChange={setMode}
        items={[
          { value: "encode", label: "编码" },
          { value: "decode", label: "解码" },
        ]}
      />

      {mode === "encode" && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium tracking-wide text-muted-foreground">
            编码方式
          </span>
          <SegmentedControl<Strategy>
            ariaLabel="编码方式"
            value={strategy}
            onValueChange={setStrategy}
            items={[
              { value: "named", label: "命名实体" },
              { value: "numeric", label: "十进制" },
              { value: "hex", label: "十六进制" },
              { value: "all", label: "全部" },
            ]}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-medium tracking-wide text-muted-foreground">
            {mode === "encode" ? "原始文本" : "HTML 实体字符串"}
          </label>
          <Textarea
            placeholder={
              mode === "encode"
                ? "输入要编码的 HTML 文本..."
                : "输入 HTML 实体（如 &amp;lt;div&amp;gt;）..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-64 font-mono text-sm bg-bg-inset border-border resize-none"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium tracking-wide text-muted-foreground">
              输出
            </label>
            {output && (
              <Button variant="ghost" size="sm" onClick={copyOutput}>
                {copied ? (
                  <>
                    <Check className="text-signal-ok" />
                    <span className="text-xs font-medium text-signal-ok">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy />
                    <span className="text-xs font-medium">复制</span>
                  </>
                )}
              </Button>
            )}
          </div>
          <Textarea
            value={output}
            readOnly
            className="h-64 font-mono text-sm bg-secondary border-border resize-none"
            placeholder="结果将显示在这里..."
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm font-medium text-destructive">{error}</span>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="accent" onClick={process}>
          {mode === "encode" ? "编码" : "解码"}
        </Button>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          <Trash2 />
          清空
        </Button>
      </div>
    </div>
  )
}

export const HtmlEntities = memo(HtmlEntitiesInner)
