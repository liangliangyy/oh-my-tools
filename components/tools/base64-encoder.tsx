"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function Base64Encoder() {
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
      <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 dark:bg-secondary/30">
        <Button
          variant={mode === "encode" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("encode")}
          className={cn(
            "transition-all duration-200",
            mode !== "encode" && "hover:bg-accent/50 dark:hover:bg-accent/30"
          )}
        >
          编码
        </Button>
        <Button
          variant={mode === "decode" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("decode")}
          className={cn(
            "transition-all duration-200",
            mode !== "decode" && "hover:bg-accent/50 dark:hover:bg-accent/30"
          )}
        >
          解码
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {mode === "encode" ? "原始文本" : "Base64 字符串"}
          </label>
          <Textarea
            placeholder={mode === "encode" ? "输入要编码的文本..." : "输入 Base64 字符串..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-48 font-mono text-sm bg-secondary border-border resize-none"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              {mode === "encode" ? "Base64 结果" : "解码结果"}
            </label>
            {output && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyOutput} 
                className="h-7 px-2 hover:bg-accent/50 dark:hover:bg-accent/30"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
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

      <div className="flex gap-2">
        <Button variant="default" onClick={process}>
          {mode === "encode" ? "编码" : "解码"}
        </Button>
        <Button variant="ghost" onClick={swap} className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          交换
        </Button>
        <Button variant="ghost" onClick={() => { setInput(""); setOutput(""); setError("") }}>
          清空
        </Button>
      </div>
    </div>
  )
}
