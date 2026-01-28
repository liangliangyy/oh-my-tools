"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MonacoEditor } from "@/components/ui/monaco-editor"
import { Copy, Check, ArrowLeftRight, Trash2, AlertCircle } from "lucide-react"

export function YamlJsonConverter() {
  const [yamlInput, setYamlInput] = useState("")
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<"yaml" | "json" | "">("")

  // 简单的 YAML 转 JSON 解析器（支持基本语法）
  const parseYAML = (yaml: string): any => {
    const lines = yaml.split("\n").filter(line => line.trim() && !line.trim().startsWith("#"))
    const result: any = {}
    const stack: any[] = [{ obj: result, indent: -1 }]

    for (const line of lines) {
      const indent = line.search(/\S/)
      const trimmed = line.trim()

      // 跳过注释
      if (trimmed.startsWith("#")) continue

      // 计算当前层级
      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
        stack.pop()
      }

      const current = stack[stack.length - 1].obj

      if (trimmed.includes(":")) {
        const colonIndex = trimmed.indexOf(":")
        const key = trimmed.substring(0, colonIndex).trim()
        const value = trimmed.substring(colonIndex + 1).trim()

        if (value === "" || value === "{}") {
          // 对象开始
          current[key] = {}
          stack.push({ obj: current[key], indent })
        } else if (value === "[]") {
          // 数组开始
          current[key] = []
          stack.push({ obj: current[key], indent })
        } else {
          // 直接赋值
          current[key] = parseValue(value)
        }
      } else if (trimmed.startsWith("-")) {
        // 数组元素
        const value = trimmed.substring(1).trim()
        if (Array.isArray(current)) {
          if (value.includes(":")) {
            const obj: any = {}
            const colonIndex = value.indexOf(":")
            const key = value.substring(0, colonIndex).trim()
            const val = value.substring(colonIndex + 1).trim()
            obj[key] = parseValue(val)
            current.push(obj)
          } else {
            current.push(parseValue(value))
          }
        }
      }
    }

    return result
  }

  const parseValue = (value: string): any => {
    // 布尔值
    if (value === "true") return true
    if (value === "false") return false
    if (value === "null") return null

    // 数字
    if (/^-?\d+$/.test(value)) return parseInt(value)
    if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value)

    // 字符串（移除引号）
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1)
    }

    return value
  }

  // JSON 转 YAML
  const jsonToYAML = (obj: any, indent = 0): string => {
    const spaces = "  ".repeat(indent)
    let result = ""

    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (typeof item === "object" && item !== null) {
          result += `${spaces}-\n${jsonToYAML(item, indent + 1)}`
        } else {
          result += `${spaces}- ${formatValue(item)}\n`
        }
      }
    } else if (typeof obj === "object" && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object" && value !== null) {
          result += `${spaces}${key}:\n${jsonToYAML(value, indent + 1)}`
        } else {
          result += `${spaces}${key}: ${formatValue(value)}\n`
        }
      }
    }

    return result
  }

  const formatValue = (value: any): string => {
    if (typeof value === "string") {
      // 如果包含特殊字符，使用引号
      if (value.includes(":") || value.includes("#") || value.includes("\n")) {
        return `"${value}"`
      }
      return value
    }
    if (value === null) return "null"
    return String(value)
  }

  const convertYamlToJson = () => {
    if (!yamlInput.trim()) {
      setError("请输入 YAML 内容")
      return
    }

    try {
      const parsed = parseYAML(yamlInput)
      setJsonInput(JSON.stringify(parsed, null, 2))
      setError("")
    } catch (e) {
      setError("YAML 解析失败：" + (e as Error).message)
    }
  }

  const convertJsonToYaml = () => {
    if (!jsonInput.trim()) {
      setError("请输入 JSON 内容")
      return
    }

    try {
      const parsed = JSON.parse(jsonInput)
      setYamlInput(jsonToYAML(parsed))
      setError("")
    } catch (e) {
      setError("JSON 解析失败：" + (e as Error).message)
    }
  }

  const copyYaml = async () => {
    await navigator.clipboard.writeText(yamlInput)
    setCopied("yaml")
    setTimeout(() => setCopied(""), 2000)
  }

  const copyJson = async () => {
    await navigator.clipboard.writeText(jsonInput)
    setCopied("json")
    setTimeout(() => setCopied(""), 2000)
  }

  const clear = () => {
    setYamlInput("")
    setJsonInput("")
    setError("")
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* YAML */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">YAML</label>
            <Button variant="ghost" size="sm" onClick={copyYaml} disabled={!yamlInput}>
              {copied === "yaml" ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <MonacoEditor
            value={yamlInput}
            onChange={setYamlInput}
            language="yaml"
            height="400px"
            placeholder="在此输入 YAML..."
          />
        </div>

        {/* JSON */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">JSON</label>
            <Button variant="ghost" size="sm" onClick={copyJson} disabled={!jsonInput}>
              {copied === "json" ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <MonacoEditor
            value={jsonInput}
            onChange={setJsonInput}
            language="json"
            height="400px"
            placeholder="在此输入 JSON..."
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="secondary" onClick={convertYamlToJson} className="gap-2">
          YAML → JSON
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
        <Button variant="secondary" onClick={convertJsonToYaml} className="gap-2">
          JSON → YAML
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
        <Button variant="secondary" onClick={clear}>
          <Trash2 className="h-4 w-4 mr-1" />
          清空
        </Button>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 text-sm">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
        <span className="text-muted-foreground">
          当前实现为简化版 YAML 解析器，支持基本对象、数组、字符串、数字、布尔值
        </span>
      </div>
    </div>
  )
}
