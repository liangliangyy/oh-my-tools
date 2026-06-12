"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Copy, Check, Trash2 } from "lucide-react"

type Mode = "encode" | "decode"
type Format = "u" | "uHex" | "x" | "all"

function encodeUnicode(text: string, format: Format): string {
  if (format === "u") {
    return text
      .split("")
      .map((c) => {
        const code = c.charCodeAt(0)
        if (code < 128) return c
        return `\\u${code.toString(16).padStart(4, "0").toUpperCase()}`
      })
      .join("")
  }
  if (format === "uHex") {
    return text
      .split("")
      .map((c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0").toUpperCase()}`)
      .join("")
  }
  if (format === "x") {
    return text
      .split("")
      .map((c) => `\\x${c.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase()}`)
      .join("")
  }
  return text
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0)
      return `&#${code};`
    })
    .join("")
}

function decodeUnicode(text: string): string {
  let result = text
  result = result.replace(/\\\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  )
  result = result.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  )
  result = result.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  )
  result = result.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  )
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  )
  result = result.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCodePoint(parseInt(dec, 10))
  )
  result = result.replace(/U\+([0-9a-fA-F]{4,6})/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  )
  return result
}

function UnicodeEscapeInner() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<Mode>("encode")
  const [format, setFormat] = useState<Format>("u")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const process = () => {
    if (!input) {
      setError("请输入内容")
      return
    }
    try {
      setOutput(mode === "encode" ? encodeUnicode(input, format) : decodeUnicode(input))
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
            输出格式
          </span>
          <SegmentedControl<Format>
            ariaLabel="输出格式"
            value={format}
            onValueChange={setFormat}
            items={[
              { value: "u", label: <span className="font-mono">\u (仅非ASCII)</span> },
              { value: "uHex", label: <span className="font-mono">\u (全部)</span> },
              { value: "x", label: <span className="font-mono">\x</span> },
              { value: "all", label: <span className="font-mono">&#dec;</span> },
            ]}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-medium tracking-wide text-muted-foreground">
            {mode === "encode" ? "原始文本" : "Unicode 转义字符串"}
          </label>
          <Textarea
            placeholder={
              mode === "encode"
                ? "输入要转义的文本（如：你好 World）..."
                : "输入转义序列（如：\\u4F60\\u597D 或 &#20320;&#22909;）..."
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
          {mode === "encode" ? "转义" : "还原"}
        </Button>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          <Trash2 />
          清空
        </Button>
      </div>

      <div className="text-xs text-muted-foreground space-y-1 p-3 rounded-lg bg-accent/10">
        <p className="font-medium">支持解析的格式：</p>
        <p className="font-mono">{"• \\u4F60 / \\\\u4F60 / \\u{1F600} / \\x41 / U+4F60 / &#20320; / &#x4F60;"}</p>
      </div>
    </div>
  )
}

export const UnicodeEscape = memo(UnicodeEscapeInner)
