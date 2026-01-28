"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Minus, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"

type CalculateMode = "diff" | "add" | "subtract"

export function DateCalculator() {
  const [mode, setMode] = useState<CalculateMode>("diff")

  // 日期差计算
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [diffResult, setDiffResult] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    totalDays: number
    workdays: number
  } | null>(null)

  // 日期加减
  const [baseDate, setBaseDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [amount, setAmount] = useState<number>(1)
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days")
  const [addSubResult, setAddSubResult] = useState<string>("")

  // 计算两个日期的差
  const calculateDiff = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // 重置时间为00:00:00以便准确计算天数
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    const diffMs = end.getTime() - start.getTime()
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const absDays = Math.abs(totalDays)

    const hours = Math.floor((Math.abs(diffMs) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((Math.abs(diffMs) % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((Math.abs(diffMs) % (1000 * 60)) / 1000)

    // 计算工作日（排除周末）
    let workdays = 0
    const [earlierDate, laterDate] = start <= end ? [new Date(start), new Date(end)] : [new Date(end), new Date(start)]

    // 逐天遍历计算工作日
    const currentDate = new Date(earlierDate)
    while (currentDate <= laterDate) {
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workdays++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    setDiffResult({ days: absDays, hours, minutes, seconds, totalDays, workdays })
  }

  // 日期加减计算
  const calculateAddSub = () => {
    const date = new Date(baseDate)
    const operation = mode === "add" ? 1 : -1
    const value = amount * operation

    switch (unit) {
      case "days":
        date.setDate(date.getDate() + value)
        break
      case "weeks":
        date.setDate(date.getDate() + value * 7)
        break
      case "months":
        date.setMonth(date.getMonth() + value)
        break
      case "years":
        date.setFullYear(date.getFullYear() + value)
        break
    }

    setAddSubResult(date.toISOString().split("T")[0])
  }

  const setToday = (setter: (date: string) => void) => {
    setter(new Date().toISOString().split("T")[0])
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    })
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex gap-2 p-1 bg-secondary rounded-lg">
        <Button
          variant={mode === "diff" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("diff")}
          className="flex-1"
        >
          <Calculator className="h-4 w-4 mr-2" />
          日期差计算
        </Button>
        <Button
          variant={mode === "add" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("add")}
          className="flex-1"
        >
          <Plus className="h-4 w-4 mr-2" />
          日期加法
        </Button>
        <Button
          variant={mode === "subtract" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("subtract")}
          className="flex-1"
        >
          <Minus className="h-4 w-4 mr-2" />
          日期减法
        </Button>
      </div>

      {/* Date Diff Calculator */}
      {mode === "diff" && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>开始日期</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={() => setToday(setStartDate)}>
                  今天
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>结束日期</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={() => setToday(setEndDate)}>
                  今天
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={calculateDiff} className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            计算日期差
          </Button>

          {diffResult && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {diffResult.days}
                  </p>
                  <p className="text-sm text-muted-foreground">天</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {diffResult.hours}
                  </p>
                  <p className="text-sm text-muted-foreground">小时</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {diffResult.minutes}
                  </p>
                  <p className="text-sm text-muted-foreground">分钟</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {diffResult.seconds}
                  </p>
                  <p className="text-sm text-muted-foreground">秒</p>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-secondary/30">
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">总计天数:</span>
                    <span className="font-semibold">{Math.abs(diffResult.totalDays)} 天</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">工作日:</span>
                    <span className="font-semibold">{diffResult.workdays} 天</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">周数:</span>
                    <span className="font-semibold">
                      {(Math.abs(diffResult.totalDays) / 7).toFixed(1)} 周
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">月数:</span>
                    <span className="font-semibold">
                      {(Math.abs(diffResult.totalDays) / 30).toFixed(1)} 月
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Date Add/Subtract */}
      {(mode === "add" || mode === "subtract") && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>基准日期</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" size="sm" onClick={() => setToday(setBaseDate)}>
                今天
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{formatDate(baseDate)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{mode === "add" ? "增加" : "减少"}数量</Label>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label>单位</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">天</SelectItem>
                  <SelectItem value="weeks">周</SelectItem>
                  <SelectItem value="months">月</SelectItem>
                  <SelectItem value="years">年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculateAddSub} className="w-full">
            {mode === "add" ? <Plus className="h-4 w-4 mr-2" /> : <Minus className="h-4 w-4 mr-2" />}
            计算结果
          </Button>

          {addSubResult && (
            <div className="p-6 rounded-lg border-2 border-accent bg-accent/5">
              <div className="text-center space-y-2">
                <Calendar className="h-8 w-8 mx-auto text-accent" />
                <p className="text-sm text-muted-foreground">结果日期</p>
                <p className="text-3xl font-bold">{addSubResult}</p>
                <p className="text-sm text-muted-foreground">{formatDate(addSubResult)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1 p-3 rounded-lg bg-accent/10">
        <p>* 工作日计算自动排除周末（周六、周日）</p>
        <p>* 月份计算按自然月，可能导致日期调整</p>
        <p>* 所有计算均基于本地时区</p>
      </div>
    </div>
  )
}
