"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check } from "lucide-react"

export function UrlEncoder() {
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
      <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary">
        <Button
          variant={mode === "encode" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("encode")}
        >
          编码
        </Button>
        <Button
          variant={mode === "decode" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("decode")}
        >
          解码
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">输入</label>
          <Textarea
            placeholder={mode === "encode" ? "输入要编码的URL或文本..." : "输入URL编码字符串..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-40 font-mono text-sm bg-secondary border-border resize-none"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">输出</label>
            {output && (
              <Button variant="ghost" size="sm" onClick={copyOutput} className="h-7 px-2">
                {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
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

      <div className="flex gap-2">
        <Button variant="ghost" onClick={process}>
          {mode === "encode" ? "编码" : "解码"}
        </Button>
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError("") }}>
          清空
        </Button>
      </div>
    </div>
  )
}
