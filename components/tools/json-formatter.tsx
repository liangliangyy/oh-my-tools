"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "@/components/ui/code-editor"
import { Copy, Check, Wand2, Minimize2, Trash2 } from "lucide-react"

function JsonFormatterInner() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const formatJson = () => {
    if (!input.trim()) {
      setError("请输入 JSON 内容")
      return
    }
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setError("")
    } catch (e) {
      setError("JSON 格式错误：" + (e as Error).message)
      setOutput("")
    }
  }

  const minifyJson = () => {
    if (!input.trim()) {
      setError("请输入 JSON 内容")
      return
    }
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError("")
    } catch (e) {
      setError("JSON 格式错误：" + (e as Error).message)
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyOutput}
                  className="h-7 px-2.5 gap-1.5 hover:bg-accent/60 dark:hover:bg-accent/40 transition-colors"
                >
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

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          variant="accent"
          onClick={formatJson}
          className="gap-2 transition-colors"
        >
          <Wand2 className="h-4 w-4" />
          格式化
        </Button>
        <Button
          variant="outline"
          onClick={minifyJson}
          className="gap-2 hover:bg-accent/60 transition-colors"
        >
          <Minimize2 className="h-4 w-4" />
          压缩
        </Button>
        <Button
          variant="outline"
          onClick={clearAll}
          className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          清空
        </Button>
      </div>
    </div>
  )
}

export const JsonFormatter = memo(JsonFormatterInner)
