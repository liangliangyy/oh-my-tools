"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Copy, Check, ArrowUpDown } from "lucide-react"

function Base64EncoderInner() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const process = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
      }
      setError("")
    } catch (e) {
      setError(mode === "decode" ? "无效的 Base64 字符串" : "编码失败")
      setOutput("")
    }
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const swap = () => {
    setInput(output)
    setOutput("")
    setMode(mode === "encode" ? "decode" : "encode")
  }

  return (
    <div className="space-y-4">
      <SegmentedControl<"encode" | "decode">
        ariaLabel="编解码模式"
        value={mode}
        onValueChange={setMode}
        items={[
          { value: "encode", label: "编码" },
          { value: "decode", label: "解码" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-medium tracking-wide text-muted-foreground">
            {mode === "encode" ? "原始文本" : "Base64 字符串"}
          </label>
          <Textarea
            placeholder={mode === "encode" ? "输入要编码的文本..." : "输入 Base64 字符串..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-48 font-mono text-sm bg-bg-inset border-border resize-none"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium tracking-wide text-muted-foreground">
              {mode === "encode" ? "Base64 结果" : "解码结果"}
            </label>
            {output && (
              <Button variant="ghost" size="sm" onClick={copyOutput}>
                {copied ? (
                  <Check className="text-signal-ok" />
                ) : (
                  <Copy />
                )}
              </Button>
            )}
          </div>
          <Textarea
            value={output}
            readOnly
            className="h-48 font-mono text-sm bg-secondary border-border resize-none"
            placeholder="结果将显示在这里..."
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-2">
        <Button variant="accent" onClick={process}>
          {mode === "encode" ? "编码" : "解码"}
        </Button>
        <Button variant="ghost" size="sm" onClick={swap}>
          <ArrowUpDown />
          交换
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setInput(""); setOutput(""); setError("") }}>
          清空
        </Button>
      </div>
    </div>
  )
}

export const Base64Encoder = memo(Base64EncoderInner)
