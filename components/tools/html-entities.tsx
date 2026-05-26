"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-secondary/50 dark:bg-secondary/30 w-fit">
        <Button
          variant={mode === "encode" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMode("encode")}
        >
          编码
        </Button>
        <Button
          variant={mode === "decode" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMode("decode")}
        >
          解码
        </Button>
      </div>

      {mode === "encode" && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium tracking-wide text-muted-foreground">
            编码方式
          </span>
          <div className="flex items-center gap-1 p-1 rounded-md bg-secondary/50 dark:bg-secondary/30">
            {([
              { id: "named", name: "命名实体" },
              { id: "numeric", name: "十进制" },
              { id: "hex", name: "十六进制" },
              { id: "all", name: "全部" },
            ] as { id: Strategy; name: string }[]).map((s) => (
              <Button
                key={s.id}
                variant={strategy === s.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setStrategy(s.id)}
                className="h-7 text-xs"
              >
                {s.name}
              </Button>
            ))}
          </div>
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
                    <Check className="h-3.5 w-3.5 text-signal-ok" />
                    <span className="text-xs font-medium text-signal-ok">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
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
        <Button variant="ghost" onClick={clearAll}>
          <Trash2 className="h-4 w-4" />
          清空
        </Button>
      </div>
    </div>
  )
}

export const HtmlEntities = memo(HtmlEntitiesInner)
