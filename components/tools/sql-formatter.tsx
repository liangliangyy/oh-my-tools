"use client"

import { useState, memo } from "react"
import { format as sqlFormat } from "sql-formatter"
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

type Dialect =
  | "sql"
  | "mysql"
  | "postgresql"
  | "sqlite"
  | "mariadb"
  | "tsql"
  | "bigquery"
  | "redshift"
  | "snowflake"
  | "spark"
  | "hive"

const dialects: { id: Dialect; name: string }[] = [
  { id: "sql", name: "标准 SQL" },
  { id: "mysql", name: "MySQL" },
  { id: "postgresql", name: "PostgreSQL" },
  { id: "sqlite", name: "SQLite" },
  { id: "mariadb", name: "MariaDB" },
  { id: "tsql", name: "T-SQL (SQL Server)" },
  { id: "bigquery", name: "BigQuery" },
  { id: "redshift", name: "Redshift" },
  { id: "snowflake", name: "Snowflake" },
  { id: "spark", name: "Spark" },
  { id: "hive", name: "Hive" },
]

function SqlFormatterInner() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [dialect, setDialect] = useState<Dialect>("sql")
  const [tabWidth, setTabWidth] = useState(2)

  const formatSql = () => {
    if (!input.trim()) {
      setError("请输入 SQL 语句")
      return
    }
    try {
      const result = sqlFormat(input, {
        language: dialect,
        tabWidth,
        keywordCase: "upper",
        linesBetweenQueries: 2,
      })
      setOutput(result)
      setError("")
    } catch (e) {
      setError("格式化失败：" + (e as Error).message)
      setOutput("")
    }
  }

  const minifySql = () => {
    if (!input.trim()) {
      setError("请输入 SQL 语句")
      return
    }
    try {
      const result = input
        .replace(/--.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\s+/g, " ")
        .trim()
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
          <span className="text-xs font-medium tracking-wide text-muted-foreground">
            SQL 方言
          </span>
          <Select value={dialect} onValueChange={(v) => setDialect(v as Dialect)}>
            <SelectTrigger size="sm" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dialects.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium tracking-wide text-muted-foreground">
            缩进
          </span>
          <Select
            value={String(tabWidth)}
            onValueChange={(v) => setTabWidth(Number(v))}
          >
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
              输入 SQL
            </label>
            <span className="text-xs font-medium text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded-md">
              {input.length} 字符
            </span>
          </div>
          <CodeEditor
            value={input}
            onChange={setInput}
            language="sql"
            height="480px"
            placeholder="请输入 SQL 语句..."
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-medium tracking-wide text-muted-foreground">
              格式化结果
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground/80 bg-muted/50 px-2 py-0.5 rounded-md">
                {output.length} 字符
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
            language="sql"
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
        <Button variant="accent" onClick={formatSql}>
          <Wand2 />
          格式化
        </Button>
        <Button variant="outline" onClick={minifySql}>
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

export const SqlFormatter = memo(SqlFormatterInner)
