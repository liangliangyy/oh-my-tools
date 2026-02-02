"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "@/components/ui/code-editor"
import { Copy, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Language = "typescript" | "go" | "python" | "java" | "rust"

const languages: { id: Language; name: string; monacoLang: string }[] = [
  { id: "typescript", name: "TypeScript", monacoLang: "typescript" },
  { id: "go", name: "Go", monacoLang: "go" },
  { id: "python", name: "Python", monacoLang: "python" },
  { id: "java", name: "Java", monacoLang: "java" },
  { id: "rust", name: "Rust", monacoLang: "rust" },
]

function toPascalCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase())
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/[-]/g, "_")
}

function jsonToTypeScript(json: unknown, name = "Root", indent = 0): string {
  const spaces = "  ".repeat(indent)
  
  if (json === null) return `${spaces}type ${name} = null`
  if (typeof json !== "object") {
    const tsType = typeof json === "number" ? "number" : typeof json === "boolean" ? "boolean" : "string"
    return `${spaces}type ${name} = ${tsType}`
  }
  
  if (Array.isArray(json)) {
    if (json.length === 0) return `${spaces}type ${name} = unknown[]`
    const itemType = typeof json[0] === "object" && json[0] !== null
      ? `${name}Item`
      : typeof json[0] === "number" ? "number" : typeof json[0] === "boolean" ? "boolean" : "string"
    
    let result = ""
    if (typeof json[0] === "object" && json[0] !== null) {
      result = jsonToTypeScript(json[0], `${name}Item`, indent) + "\n\n"
    }
    return result + `${spaces}type ${name} = ${itemType}[]`
  }
  
  const obj = json as Record<string, unknown>
  const lines: string[] = []
  const nestedTypes: string[] = []
  
  lines.push(`${spaces}interface ${name} {`)
  
  for (const [key, value] of Object.entries(obj)) {
    let tsType: string
    if (value === null) {
      tsType = "null"
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        tsType = "unknown[]"
      } else if (typeof value[0] === "object" && value[0] !== null) {
        const nestedName = toPascalCase(key) + "Item"
        nestedTypes.push(jsonToTypeScript(value[0], nestedName, indent))
        tsType = `${nestedName}[]`
      } else {
        tsType = typeof value[0] === "number" ? "number[]" : typeof value[0] === "boolean" ? "boolean[]" : "string[]"
      }
    } else if (typeof value === "object") {
      const nestedName = toPascalCase(key)
      nestedTypes.push(jsonToTypeScript(value, nestedName, indent))
      tsType = nestedName
    } else {
      tsType = typeof value === "number" ? "number" : typeof value === "boolean" ? "boolean" : "string"
    }
    lines.push(`${spaces}  ${key}: ${tsType}`)
  }
  
  lines.push(`${spaces}}`)
  
  return [...nestedTypes, lines.join("\n")].join("\n\n")
}

function jsonToGo(json: unknown, name = "Root", indent = 0): string {
  const spaces = "\t".repeat(indent)
  
  if (json === null || typeof json !== "object") return ""
  
  if (Array.isArray(json)) {
    if (json.length === 0 || typeof json[0] !== "object") return ""
    return jsonToGo(json[0], name, indent)
  }
  
  const obj = json as Record<string, unknown>
  const lines: string[] = []
  const nestedTypes: string[] = []
  
  lines.push(`${spaces}type ${name} struct {`)
  
  for (const [key, value] of Object.entries(obj)) {
    const goKey = toPascalCase(key)
    let goType: string
    
    if (value === null) {
      goType = "interface{}"
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        goType = "[]interface{}"
      } else if (typeof value[0] === "object" && value[0] !== null) {
        const nestedName = toPascalCase(key) + "Item"
        nestedTypes.push(jsonToGo(value[0], nestedName, indent))
        goType = `[]${nestedName}`
      } else {
        goType = typeof value[0] === "number" 
          ? (Number.isInteger(value[0]) ? "[]int" : "[]float64")
          : typeof value[0] === "boolean" ? "[]bool" : "[]string"
      }
    } else if (typeof value === "object") {
      const nestedName = toPascalCase(key)
      nestedTypes.push(jsonToGo(value, nestedName, indent))
      goType = nestedName
    } else {
      goType = typeof value === "number" 
        ? (Number.isInteger(value) ? "int" : "float64")
        : typeof value === "boolean" ? "bool" : "string"
    }
    
    lines.push(`${spaces}\t${goKey} ${goType} \`json:"${key}"\``)
  }
  
  lines.push(`${spaces}}`)
  
  return [...nestedTypes, lines.join("\n")].filter(Boolean).join("\n\n")
}

function jsonToPython(json: unknown, name = "Root", indent = 0): string {
  const spaces = "    ".repeat(indent)
  
  if (json === null || typeof json !== "object") return ""
  
  if (Array.isArray(json)) {
    if (json.length === 0 || typeof json[0] !== "object") return ""
    return jsonToPython(json[0], name, indent)
  }
  
  const obj = json as Record<string, unknown>
  const lines: string[] = []
  const nestedTypes: string[] = []
  
  lines.push(`${spaces}@dataclass`)
  lines.push(`${spaces}class ${name}:`)
  
  for (const [key, value] of Object.entries(obj)) {
    const pyKey = toSnakeCase(key)
    let pyType: string
    
    if (value === null) {
      pyType = "None"
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        pyType = "list"
      } else if (typeof value[0] === "object" && value[0] !== null) {
        const nestedName = toPascalCase(key) + "Item"
        nestedTypes.push(jsonToPython(value[0], nestedName, indent))
        pyType = `list[${nestedName}]`
      } else {
        pyType = typeof value[0] === "number" 
          ? (Number.isInteger(value[0]) ? "list[int]" : "list[float]")
          : typeof value[0] === "boolean" ? "list[bool]" : "list[str]"
      }
    } else if (typeof value === "object") {
      const nestedName = toPascalCase(key)
      nestedTypes.push(jsonToPython(value, nestedName, indent))
      pyType = nestedName
    } else {
      pyType = typeof value === "number" 
        ? (Number.isInteger(value) ? "int" : "float")
        : typeof value === "boolean" ? "bool" : "str"
    }
    
    lines.push(`${spaces}    ${pyKey}: ${pyType}`)
  }
  
  return [...nestedTypes, lines.join("\n")].filter(Boolean).join("\n\n")
}

function jsonToJava(json: unknown, name = "Root", indent = 0): string {
  const spaces = "    ".repeat(indent)
  
  if (json === null || typeof json !== "object") return ""
  
  if (Array.isArray(json)) {
    if (json.length === 0 || typeof json[0] !== "object") return ""
    return jsonToJava(json[0], name, indent)
  }
  
  const obj = json as Record<string, unknown>
  const lines: string[] = []
  const nestedTypes: string[] = []
  
  lines.push(`${spaces}public class ${name} {`)
  
  for (const [key, value] of Object.entries(obj)) {
    let javaType: string
    
    if (value === null) {
      javaType = "Object"
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        javaType = "List<Object>"
      } else if (typeof value[0] === "object" && value[0] !== null) {
        const nestedName = toPascalCase(key) + "Item"
        nestedTypes.push(jsonToJava(value[0], nestedName, indent))
        javaType = `List<${nestedName}>`
      } else {
        javaType = typeof value[0] === "number" 
          ? (Number.isInteger(value[0]) ? "List<Integer>" : "List<Double>")
          : typeof value[0] === "boolean" ? "List<Boolean>" : "List<String>"
      }
    } else if (typeof value === "object") {
      const nestedName = toPascalCase(key)
      nestedTypes.push(jsonToJava(value, nestedName, indent))
      javaType = nestedName
    } else {
      javaType = typeof value === "number" 
        ? (Number.isInteger(value) ? "int" : "double")
        : typeof value === "boolean" ? "boolean" : "String"
    }
    
    lines.push(`${spaces}    private ${javaType} ${key};`)
  }
  
  lines.push(`${spaces}}`)
  
  return [...nestedTypes, lines.join("\n")].filter(Boolean).join("\n\n")
}

function jsonToRust(json: unknown, name = "Root", indent = 0): string {
  const spaces = "    ".repeat(indent)
  
  if (json === null || typeof json !== "object") return ""
  
  if (Array.isArray(json)) {
    if (json.length === 0 || typeof json[0] !== "object") return ""
    return jsonToRust(json[0], name, indent)
  }
  
  const obj = json as Record<string, unknown>
  const lines: string[] = []
  const nestedTypes: string[] = []
  
  lines.push(`${spaces}#[derive(Debug, Serialize, Deserialize)]`)
  lines.push(`${spaces}pub struct ${name} {`)
  
  for (const [key, value] of Object.entries(obj)) {
    const rustKey = toSnakeCase(key)
    let rustType: string
    
    if (value === null) {
      rustType = "Option<serde_json::Value>"
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        rustType = "Vec<serde_json::Value>"
      } else if (typeof value[0] === "object" && value[0] !== null) {
        const nestedName = toPascalCase(key) + "Item"
        nestedTypes.push(jsonToRust(value[0], nestedName, indent))
        rustType = `Vec<${nestedName}>`
      } else {
        rustType = typeof value[0] === "number" 
          ? (Number.isInteger(value[0]) ? "Vec<i64>" : "Vec<f64>")
          : typeof value[0] === "boolean" ? "Vec<bool>" : "Vec<String>"
      }
    } else if (typeof value === "object") {
      const nestedName = toPascalCase(key)
      nestedTypes.push(jsonToRust(value, nestedName, indent))
      rustType = nestedName
    } else {
      rustType = typeof value === "number" 
        ? (Number.isInteger(value) ? "i64" : "f64")
        : typeof value === "boolean" ? "bool" : "String"
    }
    
    if (rustKey !== key) {
      lines.push(`${spaces}    #[serde(rename = "${key}")]`)
    }
    lines.push(`${spaces}    pub ${rustKey}: ${rustType},`)
  }
  
  lines.push(`${spaces}}`)
  
  return [...nestedTypes, lines.join("\n")].filter(Boolean).join("\n\n")
}

export function JsonToCode() {
  const [input, setInput] = useState(`{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "tags": ["developer", "designer"],
  "address": {
    "city": "Beijing",
    "zipCode": "100000"
  }
}`)
  const [language, setLanguage] = useState<Language>("typescript")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const output = useMemo(() => {
    try {
      const parsed = JSON.parse(input)
      setError(null)
      
      switch (language) {
        case "typescript":
          return jsonToTypeScript(parsed)
        case "go":
          return jsonToGo(parsed)
        case "python":
          return `from dataclasses import dataclass\n\n${jsonToPython(parsed)}`
        case "java":
          return `import java.util.List;\n\n${jsonToJava(parsed)}`
        case "rust":
          return `use serde::{Deserialize, Serialize};\n\n${jsonToRust(parsed)}`
        default:
          return ""
      }
    } catch (e) {
      setError("JSON 格式错误")
      return ""
    }
  }, [input, language])

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentLang = languages.find((l) => l.id === language)

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <Button
            key={lang.id}
            variant={language === lang.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage(lang.id)}
          >
            {lang.name}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">JSON 输入</label>
            {error && (
              <span className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </span>
            )}
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="json"
            height="400px"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{currentLang?.name} 代码</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!output}
              className="h-7 gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  复制
                </>
              )}
            </Button>
          </div>
          <CodeEditor
            value={output || "// 等待输入有效的 JSON..."}
            language={currentLang?.id === "typescript" || currentLang?.id === "javascript" ? "typescript" : "text"}
            readOnly
            height="400px"
          />
        </div>
      </div>
    </div>
  )
}
