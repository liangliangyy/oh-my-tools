"use client"

import { useState, memo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CodeEditor } from "@/components/ui/code-editor"
import { Copy, Check, Wand2, Minimize2, Trash2 } from "lucide-react"

/** 递归地把所有"看起来是 JSON"的字符串值解析成对象/数组，用于展开被转义的字符串字段。 */
function deepParseStrings(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(deepParseStrings)
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) result[k] = deepParseStrings(v)
    return result
  }
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return deepParseStrings(JSON.parse(trimmed))
      } catch {
        return value
      }
    }
  }
  return value
}

function JsonFormatterInner() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  // 保留转义：true 时保留原始转义字符串；false（默认）时把形如 JSON 的字符串展开为对象/数组
  const [keepEscaped, setKeepEscaped] = useState(false)

  // 记录上次转换模式，开关变化时自动按同模式重转
  const lastMode = useRef<"pretty" | "minify" | null>(null)

  const convert = (mode: "pretty" | "minify", keep: boolean = keepEscaped) => {
    if (!input.trim()) {
      setError("请输入 JSON 内容")
      return
    }
    try {
      let parsed: unknown = JSON.parse(input)
      if (!keep) parsed = deepParseStrings(parsed)
      setOutput(mode === "pretty" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed))
      lastMode.current = mode
      setError("")
    } catch (e) {
      setError("JSON 格式错误：" + (e as Error).message)
      setOutput("")
    }
  }

  const formatJson = () => convert("pretty")

  const minifyJson = () => convert("minify")

  // 开关变化：若已经转换过，则按上次模式、用新设置重新转换一次
  const toggleKeepEscaped = (next: boolean) => {
    setKeepEscaped(next)
    if (lastMode.current && input.trim()) {
      convert(lastMode.current, next)
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
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-medium tracking-wide text-muted-foreground">
              输入 JSON
            </label>
            <span className="text-xs font-medium text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded-md">
              {input.length} 字符
            </span>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="json"
            height="480px"
            placeholder="请输入 JSON 数据..."
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-medium tracking-wide text-muted-foreground">
              输出结果
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded-md">
                {output.length} 字符
              </span>
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
          </div>
          <CodeEditor
            value={output}
            readOnly
            language="json"
            height="480px"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm font-medium text-destructive">{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button variant="accent" onClick={formatJson}>
          <Wand2 />
          格式化
        </Button>
        <Button variant="outline" onClick={minifyJson}>
          <Minimize2 />
          压缩
        </Button>
        <label className="flex items-center gap-2 cursor-pointer select-none ml-1">
          <Checkbox
            checked={keepEscaped}
            onCheckedChange={(v) => toggleKeepEscaped(v === true)}
          />
          <span className="text-xs font-medium text-muted-foreground">
            保留转义
          </span>
        </label>
        <Button variant="ghost" size="sm" onClick={clearAll} className="ml-auto">
          <Trash2 />
          清空
        </Button>
      </div>
    </div>
  )
}

export const JsonFormatter = memo(JsonFormatterInner)
