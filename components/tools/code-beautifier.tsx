"use client"

import { useState, memo } from "react"
import { html as beautifyHtml, css as beautifyCss, js as beautifyJs } from "js-beautify"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "@/components/ui/code-editor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Copy, Check, Wand2, Minimize2, Trash2 } from "lucide-react"

type Lang = "html" | "css" | "javascript"

const langs: { id: Lang; name: string; editorLang: "html" | "css" | "javascript" }[] = [
  { id: "html", name: "HTML", editorLang: "html" },
  { id: "css", name: "CSS", editorLang: "css" },
  { id: "javascript", name: "JavaScript", editorLang: "javascript" },
]

function minifyHtml(s: string): string {
  return s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim()
}

function minifyCss(s: string): string {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim()
}

function minifyJs(s: string): string {
  return s
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([=+\-*/%<>!&|,;:?{}()\[\]])\s*/g, "$1")
    .trim()
}

function CodeBeautifierInner() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [lang, setLang] = useState<Lang>("html")
  const [indent, setIndent] = useState(2)

  const currentLang = langs.find((l) => l.id === lang)!

  const beautify = () => {
    if (!input.trim()) {
      setError("请输入代码")
      return
    }
    try {
      const opts = { indent_size: indent, end_with_newline: false, preserve_newlines: true }
      let result = ""
      if (lang === "html") result = beautifyHtml(input, opts as Parameters<typeof beautifyHtml>[1])
      else if (lang === "css") result = beautifyCss(input, opts)
      else result = beautifyJs(input, opts)
      setOutput(result)
      setError("")
    } catch (e) {
      setError("美化失败：" + (e as Error).message)
      setOutput("")
    }
  }

  const minify = () => {
    if (!input.trim()) {
      setError("请输入代码")
      return
    }
    try {
      let result = ""
      if (lang === "html") result = minifyHtml(input)
      else if (lang === "css") result = minifyCss(input)
      else result = minifyJs(input)
      setOutput(result)
      setError("")
    } catch (e) {
      setError("压缩失败：" + (e as Error).message)
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
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium tracking-wide text-muted-foreground">语言</span>
          <Select value={lang} onValueChange={(v) => setLang(v as Lang)}>
            <SelectTrigger size="sm" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {langs.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium tracking-wide text-muted-foreground">缩进</span>
          <Select value={String(indent)} onValueChange={(v) => setIndent(Number(v))}>
            <SelectTrigger size="sm" className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 空格</SelectItem>
              <SelectItem value="4">4 空格</SelectItem>
              <SelectItem value="8">8 空格</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-medium tracking-wide text-muted-foreground">
              输入 {currentLang.name}
            </label>
            <span className="text-xs font-medium text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded-md">
              {input.length} 字符
            </span>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language={currentLang.editorLang}
            height="480px"
            placeholder={`请输入 ${currentLang.name} 代码...`}
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
                {input.length > 0 && output.length > 0 && (
                  <span className="ml-1 text-signal-ok">
                    ({Math.round((1 - output.length / input.length) * 100)}%)
                  </span>
                )}
              </span>
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
          </div>
          <CodeEditor
            value={output}
            readOnly
            language={currentLang.editorLang}
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
        <Button variant="accent" onClick={beautify}>
          <Wand2 />
          美化
        </Button>
        <Button variant="outline" onClick={minify}>
          <Minimize2 />
          压缩
        </Button>
        <Button variant="ghost" size="sm" onClick={clearAll}>
          <Trash2 />
          清空
        </Button>
      </div>
    </div>
  )
}

export const CodeBeautifier = memo(CodeBeautifierInner)
