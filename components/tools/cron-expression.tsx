"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Check, AlertCircle, Info } from "lucide-react"

const MINUTE_OPTIONS = ["*", "0", "15", "30", "45"]
const HOUR_OPTIONS = ["*", "0", "1", "6", "12", "18"]
const DAY_OPTIONS = ["*", "1", "15", "L"]
const MONTH_OPTIONS = ["*", "1", "6", "12"]
const WEEK_OPTIONS = ["*", "0", "1", "5", "6"]

export function CronExpression() {
  const [minute, setMinute] = useState("*")
  const [hour, setHour] = useState("*")
  const [day, setDay] = useState("*")
  const [month, setMonth] = useState("*")
  const [week, setWeek] = useState("*")
  const [customInput, setCustomInput] = useState("")
  const [copied, setCopied] = useState(false)

  const cronExpression = `${minute} ${hour} ${day} ${month} ${week}`

  const parseCron = (expression: string) => {
    const parts = expression.trim().split(/\s+/)
    if (parts.length === 5) {
      setMinute(parts[0])
      setHour(parts[1])
      setDay(parts[2])
      setMonth(parts[3])
      setWeek(parts[4])
      setCustomInput("")
    }
  }

  const getDescription = () => {
    const parts = cronExpression.split(/\s+/)
    if (parts.length !== 5) return "无效的 Cron 表达式"

    const [m, h, d, mon, w] = parts
    const descriptions: string[] = []

    // 分钟
    if (m === "*") {
      descriptions.push("每分钟")
    } else if (m.includes("/")) {
      const [, interval] = m.split("/")
      descriptions.push(`每 ${interval} 分钟`)
    } else if (m.includes(",")) {
      descriptions.push(`在第 ${m.replace(/,/g, "、")} 分钟`)
    } else {
      descriptions.push(`在第 ${m} 分钟`)
    }

    // 小时
    if (h === "*") {
      descriptions.push("每小时")
    } else if (h.includes("/")) {
      const [, interval] = h.split("/")
      descriptions.push(`每 ${interval} 小时`)
    } else if (h.includes(",")) {
      descriptions.push(`在 ${h.replace(/,/g, "、")} 点`)
    } else if (h.includes("-")) {
      descriptions.push(`在 ${h} 点之间`)
    } else {
      descriptions.push(`在 ${h} 点`)
    }

    // 日期
    if (d === "*") {
      descriptions.push("每天")
    } else if (d === "L") {
      descriptions.push("在每月最后一天")
    } else if (d.includes("/")) {
      const [, interval] = d.split("/")
      descriptions.push(`每 ${interval} 天`)
    } else if (d.includes(",")) {
      descriptions.push(`在第 ${d.replace(/,/g, "、")} 号`)
    } else {
      descriptions.push(`在第 ${d} 号`)
    }

    // 月份
    if (mon === "*") {
      descriptions.push("每月")
    } else if (mon.includes(",")) {
      descriptions.push(`在 ${mon.replace(/,/g, "、")} 月`)
    } else if (mon.includes("-")) {
      descriptions.push(`在 ${mon} 月之间`)
    } else {
      const monthNames = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
      descriptions.push(`在 ${monthNames[parseInt(mon)] || mon} 月`)
    }

    // 星期
    if (w === "*" || w === "?") {
      // 不添加星期描述
    } else if (w.includes(",")) {
      const weekNames = ["日", "一", "二", "三", "四", "五", "六"]
      const days = w.split(",").map(d => `周${weekNames[parseInt(d)]}`)
      descriptions.push(`在 ${days.join("、")}`)
    } else if (w.includes("-")) {
      descriptions.push(`在周 ${w}`)
    } else {
      const weekNames = ["日", "一", "二", "三", "四", "五", "六"]
      descriptions.push(`在周${weekNames[parseInt(w)]}`)
    }

    return descriptions.join("，")
  }

  const copyExpression = async () => {
    await navigator.clipboard.writeText(cronExpression)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const commonExpressions = [
    { label: "每分钟执行", value: "* * * * *" },
    { label: "每小时执行", value: "0 * * * *" },
    { label: "每天凌晨执行", value: "0 0 * * *" },
    { label: "每天早上 9 点执行", value: "0 9 * * *" },
    { label: "每周一早上 9 点执行", value: "0 9 * * 1" },
    { label: "每月 1 号凌晨执行", value: "0 0 1 * *" },
    { label: "每 5 分钟执行", value: "*/5 * * * *" },
    { label: "每 30 分钟执行", value: "*/30 * * * *" },
    { label: "工作日早上 9 点执行", value: "0 9 * * 1-5" },
    { label: "每天中午 12 点执行", value: "0 12 * * *" },
  ]

  return (
    <div className="space-y-6">
      {/* Cron 表达式生成器 */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Cron 表达式生成器</h3>
        <div className="grid grid-cols-5 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">分钟</Label>
            <Select value={minute} onValueChange={setMinute}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MINUTE_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
                <SelectItem value="*/5">*/5</SelectItem>
                <SelectItem value="*/15">*/15</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">小时</Label>
            <Select value={hour} onValueChange={setHour}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HOUR_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
                <SelectItem value="*/2">*/2</SelectItem>
                <SelectItem value="*/6">*/6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">日</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAY_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">月</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">周</Label>
            <Select value={week} onValueChange={setWeek}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEK_OPTIONS.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 或者输入自定义表达式 */}
      <div className="space-y-2">
        <Label className="text-sm">或者输入自定义表达式</Label>
        <div className="flex gap-2">
          <Input
            placeholder="例如: 0 9 * * 1-5"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="font-mono"
          />
          <Button
            variant="secondary"
            onClick={() => parseCron(customInput)}
            disabled={!customInput}
          >
            解析
          </Button>
        </div>
      </div>

      {/* 表达式结果 */}
      <div className="rounded-lg border border-border bg-secondary/30 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
          <span className="text-sm font-medium">Cron 表达式</span>
          <Button variant="ghost" size="sm" onClick={copyExpression}>
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
        <div className="p-4">
          <code className="text-lg font-mono">{cronExpression}</code>
          <p className="text-sm text-muted-foreground mt-3">{getDescription()}</p>
        </div>
      </div>

      {/* 常用表达式 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">常用表达式</h3>
        <div className="grid gap-2">
          {commonExpressions.map((expr) => (
            <button
              key={expr.value}
              onClick={() => parseCron(expr.value)}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors text-left"
            >
              <span className="text-sm">{expr.label}</span>
              <code className="text-xs font-mono text-muted-foreground">{expr.value}</code>
            </button>
          ))}
        </div>
      </div>

      {/* 说明 */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 text-sm">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
        <div className="space-y-1 text-muted-foreground">
          <p>Cron 表达式格式：分钟 小时 日 月 周</p>
          <p className="text-xs">
            * = 每个时间单位 | */N = 每 N 个时间单位 | 1,2,3 = 列举 | 1-5 = 范围 | L = 最后一天
          </p>
        </div>
      </div>
    </div>
  )
}
