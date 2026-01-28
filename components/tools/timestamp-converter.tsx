"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, RefreshCw } from "lucide-react"

export function TimestampConverter() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000))
  const [inputTimestamp, setInputTimestamp] = useState("")
  const [inputDate, setInputDate] = useState("")
  const [convertedDate, setConvertedDate] = useState("")
  const [convertedTimestamp, setConvertedTimestamp] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const timestampToDate = () => {
    const ts = parseInt(inputTimestamp)
    if (isNaN(ts)) return
    
    // Handle both seconds and milliseconds
    const date = new Date(ts > 9999999999 ? ts : ts * 1000)
    setConvertedDate(date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }))
  }

  const dateToTimestamp = () => {
    const date = new Date(inputDate)
    if (isNaN(date.getTime())) return
    setConvertedTimestamp(Math.floor(date.getTime() / 1000).toString())
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatCurrentDate = () => {
    return new Date(currentTimestamp * 1000).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    })
  }

  return (
    <div className="space-y-6">
      {/* Current Time */}
      <div className="p-4 rounded-lg bg-secondary border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">当前时间</span>
          <Button variant="ghost" size="sm" onClick={() => setCurrentTimestamp(Math.floor(Date.now() / 1000))} className="h-7 px-2">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 rounded bg-background font-mono text-lg">{currentTimestamp}</code>
            <Button variant="ghost" size="sm" onClick={() => copy(currentTimestamp.toString(), "current-ts")} className="h-8 px-2">
              {copied === "current-ts" ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-2 rounded bg-background font-mono">{formatCurrentDate()}</code>
            <Button variant="ghost" size="sm" onClick={() => copy(formatCurrentDate(), "current-date")} className="h-8 px-2">
              {copied === "current-date" ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Timestamp to Date */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">时间戳 → 日期</label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={inputTimestamp}
            onChange={(e) => setInputTimestamp(e.target.value)}
            placeholder="输入时间戳（秒或毫秒）"
            className="font-mono bg-secondary border-border"
          />
          <Button variant="secondary" onClick={timestampToDate}>转换</Button>
        </div>
        {convertedDate && (
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 rounded bg-secondary font-mono">{convertedDate}</code>
            <Button variant="ghost" size="sm" onClick={() => copy(convertedDate, "converted-date")} className="h-8 px-2">
              {copied === "converted-date" ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>

      {/* Date to Timestamp */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">日期 → 时间戳</label>
        <div className="flex gap-2">
          <Input
            type="datetime-local"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="font-mono bg-secondary border-border"
          />
          <Button variant="secondary" onClick={dateToTimestamp}>转换</Button>
        </div>
        {convertedTimestamp && (
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 rounded bg-secondary font-mono">{convertedTimestamp}</code>
            <Button variant="ghost" size="sm" onClick={() => copy(convertedTimestamp, "converted-ts")} className="h-8 px-2">
              {copied === "converted-ts" ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
