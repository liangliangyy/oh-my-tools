"use client"

import { useEffect, useState, useRef, memo } from "react"
import { DiffEditor } from "@/components/ui/diff-editor"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Copy, RotateCcw, ArrowLeftRight, FileText, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const languages = [
  { value: "plaintext", label: "纯文本" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "json", label: "JSON" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "sql", label: "SQL" },
  { value: "markdown", label: "Markdown" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
  { value: "shell", label: "Shell" },
]

const examples = {
  original: `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const users = ["Alice", "Bob"];
users.forEach(user => greet(user));`,
  modified: `function greet(name: string): boolean {
  console.log(\`Hello, \${name}!\`);
  return true;
}

const users: string[] = ["Alice", "Bob", "Charlie"];
users.forEach(user => greet(user));

// Added new function
function farewell(name: string) {
  console.log(\`Goodbye, \${name}!\`);
}`,
}

function FileDiffInner() {
  const [mounted, setMounted] = useState(false)
  const [original, setOriginal] = useState(examples.original)
  const [modified, setModified] = useState(examples.modified)
  const [language, setLanguage] = useState("javascript")
  const [renderSideBySide, setRenderSideBySide] = useState(true)
  const [copied, setCopied] = useState<"original" | "modified" | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSwap = () => {
    const temp = original
    setOriginal(modified)
    setModified(temp)
  }

  const handleCopy = async (type: "original" | "modified") => {
    const text = type === "original" ? original : modified
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleClear = (type: "original" | "modified") => {
    if (type === "original") {
      setOriginal("")
    } else {
      setModified("")
    }
  }

  const handleReset = () => {
    setOriginal(examples.original)
    setModified(examples.modified)
  }

  const getDiffStats = () => {
    const originalLines = original.split("\n")
    const modifiedLines = modified.split("\n")
    
    let added = 0
    let removed = 0
    
    const maxLen = Math.max(originalLines.length, modifiedLines.length)
    for (let i = 0; i < maxLen; i++) {
      if (i >= originalLines.length) {
        added++
      } else if (i >= modifiedLines.length) {
        removed++
      } else if (originalLines[i] !== modifiedLines[i]) {
        added++
        removed++
      }
    }
    
    return { added, removed, total: modifiedLines.length }
  }

  const stats = getDiffStats()

  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-secondary rounded-lg animate-pulse" />
        <div className="h-[500px] bg-secondary rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">语言:</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">视图:</Label>
          <div className="flex gap-2">
            <Button
              variant={renderSideBySide ? "default" : "ghost"}
              size="sm"
              onClick={() => setRenderSideBySide(true)}
            >
              并排
            </Button>
            <Button
              variant={!renderSideBySide ? "default" : "ghost"}
              size="sm"
              onClick={() => setRenderSideBySide(false)}
            >
              内联
            </Button>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSwap}>
            <ArrowLeftRight className="h-4 w-4 mr-1.5" />
            交换
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1.5" />
            重置
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">共 {stats.total} 行</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-green-500/20 border border-green-500" />
          <span className="text-green-600 dark:text-green-400">+{stats.added} 新增</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-500/20 border border-red-500" />
          <span className="text-red-600 dark:text-red-400">-{stats.removed} 删除</span>
        </div>
      </div>

      {/* Editor Labels */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">原始文件</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => handleClear("original")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 hover:bg-accent/50 dark:hover:bg-accent/30"
              onClick={() => handleCopy("original")}
            >
              {copied === "original" ? (
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">修改后文件</span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={() => handleClear("modified")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 hover:bg-accent/50 dark:hover:bg-accent/30"
              onClick={() => handleCopy("modified")}
            >
              {copied === "modified" ? (
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Diff Editor */}
      <DiffEditor
        height="500px"
        language={language as "json" | "javascript" | "typescript" | "yaml" | "text"}
        original={original}
        modified={modified}
        onOriginalChange={setOriginal}
        onModifiedChange={setModified}
        renderSideBySide={renderSideBySide}
      />

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>* 左侧编辑器为原始文件，右侧为修改后文件</p>
        <p>* 绿色背景表示新增内容，红色背景表示删除内容</p>
      </div>
    </div>
  )
}

export const FileDiff = memo(FileDiffInner)
