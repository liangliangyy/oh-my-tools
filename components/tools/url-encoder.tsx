"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Copy, Check } from "lucide-react"

function UrlEncoderInner() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const process = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
      setError("")
    } catch {
      setError(mode === "decode" ? "无效的 URL 编码字符串" : "编码失败")
      setOutput("")
    }
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
          <label className="text-xs font-medium tracking-wide text-muted-foreground">输入</label>
          <Textarea
            placeholder={mode === "encode" ? "输入要编码的URL或文本..." : "输入URL编码字符串..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-40 font-mono text-sm bg-secondary border-border resize-none"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium tracking-wide text-muted-foreground">输出</label>
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
            className="h-40 font-mono text-sm bg-secondary border-border resize-none"
            placeholder="结果将显示在这里..."
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-2">
        <Button variant="accent" onClick={process}>
          {mode === "encode" ? "编码" : "解码"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { setInput(""); setOutput(""); setError("") }}>
          清空
        </Button>
      </div>
    </div>
  )
}

export const UrlEncoder = memo(UrlEncoderInner)
