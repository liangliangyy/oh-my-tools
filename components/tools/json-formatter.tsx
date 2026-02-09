"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { SimpleTextarea } from "@/components/ui/simple-textarea"
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
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">输入 JSON</label>
            <span className="text-xs text-muted-foreground">{input.length} 字符</span>
          </div>
          <SimpleTextarea
            value={input}
            onChange={setInput}
            height="320px"
            placeholder="请输入 JSON 数据..."
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">输出结果</label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground mr-2">{output.length} 字符</span>
              {output && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyOutput} 
                  className="h-7 px-2 gap-1.5 hover:bg-accent/50 dark:hover:bg-accent/30"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-600 dark:text-green-400">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="text-xs">复制</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          <SimpleTextarea
            value={output}
            readOnly
            height="320px"
          />
        </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        <Button variant="default" onClick={formatJson} className="gap-2">
          <Wand2 className="h-4 w-4" />
          格式化
        </Button>
        <Button variant="ghost" onClick={minifyJson} className="gap-2">
          <Minimize2 className="h-4 w-4" />
          压缩
        </Button>
        <Button variant="ghost" onClick={clearAll} className="gap-2">
          <Trash2 className="h-4 w-4" />
          清空
        </Button>
      </div>
    </div>
  )
}

export const JsonFormatter = memo(JsonFormatterInner)
