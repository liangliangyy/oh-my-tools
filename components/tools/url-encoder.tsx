"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

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
      <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 dark:bg-secondary/30">
        <Button
          variant={mode === "encode" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMode("encode")}
          className="transition-colors duration-150"
        >
          编码
        </Button>
        <Button
          variant={mode === "decode" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMode("decode")}
          className="transition-colors duration-150"
        >
          解码
        </Button>
      </div>

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
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyOutput} 
                className="h-7 px-2 hover:bg-accent/50 dark:hover:bg-accent/30"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-signal-ok" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
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

      <div className="flex gap-2">
        <Button variant="accent" onClick={process}>
          {mode === "encode" ? "编码" : "解码"}
        </Button>
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError("") }}>
          清空
        </Button>
      </div>
    </div>
  )
}

export const UrlEncoder = memo(UrlEncoderInner)
