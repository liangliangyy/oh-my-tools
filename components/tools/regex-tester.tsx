"use client"

import { useState, useMemo, memo } from "react"
import { Input } from "@/components/ui/input"
import { CodeEditor } from "@/components/ui/code-editor"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

function RegexTesterInner() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false })
  const [testString, setTestString] = useState("")
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    if (!pattern || !testString) return { matches: [], highlightedText: testString }
    
    try {
      const flagStr = Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("")
      const regex = new RegExp(pattern, flagStr)
      const matches: RegExpExecArray[] = []
      let match: RegExpExecArray | null
      
      if (flags.g) {
        while ((match = regex.exec(testString)) !== null) {
          matches.push(match)
          if (match.index === regex.lastIndex) regex.lastIndex++
        }
      } else {
        match = regex.exec(testString)
        if (match) matches.push(match)
      }

      // Create highlighted text
      let highlightedText = testString
      let offset = 0
      matches.forEach((m) => {
        const start = m.index + offset
        const end = start + m[0].length
        const before = highlightedText.slice(0, start)
        const matched = highlightedText.slice(start, end)
        const after = highlightedText.slice(end)
        highlightedText = before + `【${matched}】` + after
        offset += 2
      })

      return { matches, highlightedText, error: null }
    } catch (e) {
      return { matches: [], highlightedText: testString, error: (e as Error).message }
    }
  }, [pattern, flags, testString])

  const copyPattern = async () => {
    if (!pattern) return
    await navigator.clipboard.writeText(`/${pattern}/${Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("")}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const flagDescriptions: Record<string, string> = {
    g: "全局匹配",
    i: "忽略大小写",
    m: "多行模式",
    s: "点号匹配换行"
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">正则表达式</label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyPattern} 
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
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-muted-foreground font-mono text-lg">/</span>
          <Input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="输入正则表达式..."
            className="font-mono bg-secondary border-border flex-1"
          />
          <span className="text-muted-foreground font-mono text-lg">/</span>
          <span className="font-mono text-accent min-w-[40px]">{Object.entries(flags).filter(([, v]) => v).map(([k]) => k).join("")}</span>
        </div>
        
        {/* Flags */}
        <div className="flex flex-wrap gap-4 p-3 rounded-lg bg-secondary/50">
          {Object.entries(flags).map(([flag, checked]) => (
            <div key={flag} className="flex items-center gap-2">
              <Checkbox
                id={`flag-${flag}`}
                checked={checked}
                onCheckedChange={(c) => setFlags({ ...flags, [flag]: !!c })}
              />
              <Label htmlFor={`flag-${flag}`} className="cursor-pointer flex items-center gap-1.5">
                <span className="font-mono text-sm font-semibold">{flag}</span>
                <span className="text-xs text-muted-foreground">{flagDescriptions[flag]}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">测试字符串</label>
        <CodeEditor
          value={testString}
          onChange={setTestString}
          language="text"
          height="160px"
        />
      </div>

      {result.error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
          <span className="text-sm text-destructive">{result.error}</span>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-muted-foreground">匹配结果</label>
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            result.matches.length > 0 ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
          )}>
            {result.matches.length} 个匹配
          </span>
        </div>
        <div className="p-4 rounded-lg bg-secondary border border-border font-mono text-sm whitespace-pre-wrap break-all min-h-[80px]">
          {result.highlightedText || <span className="text-muted-foreground">暂无匹配结果</span>}
        </div>
      </div>

      {result.matches.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">匹配详情</label>
          <div className="space-y-1.5 max-h-[200px] overflow-auto">
            {result.matches.map((m, i) => (
              <div key={i} className="flex items-center gap-4 text-sm font-mono p-2.5 rounded-lg bg-secondary border border-border">
                <span className="text-muted-foreground w-8">#{i + 1}</span>
                <span className="text-accent font-medium flex-1 truncate">{`"${m[0]}"`}</span>
                <span className="text-xs text-muted-foreground">位置: {m.index}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button
          variant="ghost"
          onClick={() => { setPattern(""); setTestString(""); }}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          清空
        </Button>
      </div>
    </div>
  )
}

export const RegexTester = memo(RegexTesterInner)
