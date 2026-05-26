"use client"

import { useState, memo } from "react"
import { XMLParser, XMLBuilder } from "fast-xml-parser"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "@/components/ui/code-editor"
import { Copy, Check, Wand2, Minimize2, Trash2, ArrowLeftRight } from "lucide-react"

type Mode = "format" | "xml2json" | "json2xml"

const modes: { id: Mode; name: string }[] = [
  { id: "format", name: "格式化" },
  { id: "xml2json", name: "XML → JSON" },
  { id: "json2xml", name: "JSON → XML" },
]

function formatXml(xml: string, indent = 2): string {
  const PADDING = " ".repeat(indent)
  const reg = /(>)(<)(\/*)/g
  let formatted = xml.replace(reg, "$1\r\n$2$3")
  let pad = 0
  return formatted
    .split("\r\n")
    .map((node) => {
      let i = 0
      if (node.match(/.+<\/\w[^>]*>$/)) {
        i = 0
      } else if (node.match(/^<\/\w/) && pad > 0) {
        pad -= 1
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        i = 1
      } else {
        i = 0
      }
      const padding = PADDING.repeat(pad)
      pad += i
      return padding + node
    })
    .join("\n")
}

function XmlFormatterInner() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState<Mode>("format")

  const inputLang = mode === "json2xml" ? "json" : "xml"
  const outputLang = mode === "xml2json" ? "json" : "xml"

  const process = () => {
    if (!input.trim()) {
      setError("请输入内容")
      return
    }
    try {
      if (mode === "format") {
        const parser = new XMLParser({ ignoreAttributes: false, preserveOrder: false })
        parser.parse(input)
        setOutput(formatXml(input.trim()))
      } else if (mode === "xml2json") {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
          parseAttributeValue: true,
          trimValues: true,
        })
        const obj = parser.parse(input)
        setOutput(JSON.stringify(obj, null, 2))
      } else {
        const obj = JSON.parse(input)
        const builder = new XMLBuilder({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
          format: true,
          indentBy: "  ",
        })
        setOutput(builder.build(obj))
      }
      setError("")
    } catch (e) {
      setError("处理失败：" + (e as Error).message)
      setOutput("")
    }
  }

  const copyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const swap = () => {
    if (mode === "xml2json") setMode("json2xml")
    else if (mode === "json2xml") setMode("xml2json")
    setInput(output)
    setOutput("")
    setError("")
  }

  const clearAll = () => {
    setInput("")
    setOutput("")
    setError("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 dark:bg-secondary/30 w-fit">
        {modes.map((m) => (
          <Button
            key={m.id}
            variant={mode === m.id ? "secondary" : "ghost"}
            size="sm"
            onClick={() => {
              setMode(m.id)
              setOutput("")
              setError("")
            }}
          >
            {m.name}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-medium tracking-wide text-muted-foreground">
              输入{mode === "json2xml" ? " JSON" : " XML"}
            </label>
            <span className="text-xs font-medium text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded-md">
              {input.length} 字符
            </span>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language={inputLang}
            height="480px"
            placeholder={mode === "json2xml" ? "请输入 JSON..." : "请输入 XML..."}
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
                <Button variant="ghost" size="sm" onClick={copyOutput}>
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
            language={outputLang}
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
        <Button variant="accent" onClick={process}>
          <Wand2 className="h-4 w-4" />
          {mode === "format" ? "格式化" : "转换"}
        </Button>
        {mode !== "format" && output && (
          <Button variant="outline" onClick={swap}>
            <ArrowLeftRight className="h-4 w-4" />
            反向转换
          </Button>
        )}
        <Button variant="ghost" onClick={clearAll}>
          <Trash2 className="h-4 w-4" />
          清空
        </Button>
      </div>
    </div>
  )
}

export const XmlFormatter = memo(XmlFormatterInner)
