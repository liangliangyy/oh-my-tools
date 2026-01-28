"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy, Check, AlertCircle, Trash2 } from "lucide-react"

export function NumberBaseConverter() {
  const [binary, setBinary] = useState("")
  const [octal, setOctal] = useState("")
  const [decimal, setDecimal] = useState("")
  const [hexadecimal, setHexadecimal] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<string>("")

  const convert = (value: string, fromBase: number) => {
    setError("")

    if (!value.trim()) {
      setBinary("")
      setOctal("")
      setDecimal("")
      setHexadecimal("")
      return
    }

    try {
      // 验证输入
      const validChars = fromBase === 2 ? /^[01]+$/ :
                        fromBase === 8 ? /^[0-7]+$/ :
                        fromBase === 10 ? /^-?\d+$/ :
                        /^[0-9a-fA-F]+$/

      if (!validChars.test(value)) {
        throw new Error(`无效的${getBaseName(fromBase)}格式`)
      }

      // 转换为十进制
      const decimalValue = parseInt(value, fromBase)

      if (isNaN(decimalValue)) {
        throw new Error("转换失败")
      }

      // 检查是否超出安全整数范围
      if (!Number.isSafeInteger(decimalValue)) {
        setError("警告: 数值超出 JavaScript 安全整数范围，结果可能不准确")
      }

      // 转换到各个进制
      setBinary(decimalValue.toString(2))
      setOctal(decimalValue.toString(8))
      setDecimal(decimalValue.toString(10))
      setHexadecimal(decimalValue.toString(16).toUpperCase())

    } catch (e) {
      setError((e as Error).message)
      if (fromBase !== 2) setBinary("")
      if (fromBase !== 8) setOctal("")
      if (fromBase !== 10) setDecimal("")
      if (fromBase !== 16) setHexadecimal("")
    }
  }

  const getBaseName = (base: number) => {
    switch (base) {
      case 2: return "二进制"
      case 8: return "八进制"
      case 10: return "十进制"
      case 16: return "十六进制"
      default: return ""
    }
  }

  const handleBinaryChange = (value: string) => {
    setBinary(value)
    convert(value, 2)
  }

  const handleOctalChange = (value: string) => {
    setOctal(value)
    convert(value, 8)
  }

  const handleDecimalChange = (value: string) => {
    setDecimal(value)
    convert(value, 10)
  }

  const handleHexChange = (value: string) => {
    setHexadecimal(value)
    convert(value.toUpperCase(), 16)
  }

  const copyToClipboard = async (text: string, base: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(base)
    setTimeout(() => setCopied(""), 2000)
  }

  const clear = () => {
    setBinary("")
    setOctal("")
    setDecimal("")
    setHexadecimal("")
    setError("")
  }

  const addGrouping = (value: string, groupSize: number, separator: string = " ") => {
    if (!value) return ""
    return value.split("").reverse().reduce((acc, char, i) => {
      return i > 0 && i % groupSize === 0 ? char + separator + acc : char + acc
    }, "")
  }

  const commonNumbers = [
    { label: "8", decimal: "8" },
    { label: "16", decimal: "16" },
    { label: "32", decimal: "32" },
    { label: "64", decimal: "64" },
    { label: "128", decimal: "128" },
    { label: "256", decimal: "256" },
    { label: "512", decimal: "512" },
    { label: "1024", decimal: "1024" },
    { label: "2048", decimal: "2048" },
    { label: "4096", decimal: "4096" },
  ]

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* 二进制 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>二进制 (Binary)</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(binary, "binary")}
              disabled={!binary}
              className="hover:bg-accent/50 dark:hover:bg-accent/30"
            >
              {copied === "binary" ? (
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <Input
            value={binary}
            onChange={(e) => handleBinaryChange(e.target.value)}
            placeholder="输入二进制数 (例如: 1010)"
            className="font-mono"
          />
          {binary && (
            <p className="text-xs text-muted-foreground">
              分组: {addGrouping(binary, 4)}
            </p>
          )}
        </div>

        {/* 八进制 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>八进制 (Octal)</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(octal, "octal")}
              disabled={!octal}
              className="hover:bg-accent/50 dark:hover:bg-accent/30"
            >
              {copied === "octal" ? (
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <Input
            value={octal}
            onChange={(e) => handleOctalChange(e.target.value)}
            placeholder="输入八进制数 (例如: 12)"
            className="font-mono"
          />
        </div>

        {/* 十进制 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>十进制 (Decimal)</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(decimal, "decimal")}
              disabled={!decimal}
              className="hover:bg-accent/50 dark:hover:bg-accent/30"
            >
              {copied === "decimal" ? (
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <Input
            value={decimal}
            onChange={(e) => handleDecimalChange(e.target.value)}
            placeholder="输入十进制数 (例如: 10)"
            className="font-mono"
          />
          {decimal && parseInt(decimal) > 0 && (
            <p className="text-xs text-muted-foreground">
              千分位: {parseInt(decimal).toLocaleString()}
            </p>
          )}
        </div>

        {/* 十六进制 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>十六进制 (Hexadecimal)</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(hexadecimal, "hex")}
              disabled={!hexadecimal}
              className="hover:bg-accent/50 dark:hover:bg-accent/30"
            >
              {copied === "hex" ? (
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <Input
            value={hexadecimal}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="输入十六进制数 (例如: A 或 0xFF)"
            className="font-mono"
          />
          {hexadecimal && (
            <p className="text-xs text-muted-foreground">
              带前缀: 0x{hexadecimal}
            </p>
          )}
        </div>
      </div>

      <Button onClick={clear} variant="ghost" className="w-full">
        <Trash2 className="h-4 w-4 mr-2" />
        清空
      </Button>

      {/* 常用数字 */}
      <div className="space-y-3">
        <Label className="text-sm">常用数字</Label>
        <div className="grid grid-cols-5 gap-2">
          {commonNumbers.map((num) => (
            <Button
              key={num.decimal}
              variant="ghost"
              size="sm"
              onClick={() => handleDecimalChange(num.decimal)}
              className="font-mono"
            >
              {num.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 text-sm">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
        <div className="space-y-1 text-muted-foreground text-xs">
          <p>• 支持范围: -{Number.MAX_SAFE_INTEGER.toLocaleString()} 到 {Number.MAX_SAFE_INTEGER.toLocaleString()}</p>
          <p>• 在任意输入框输入数字，其他进制会自动转换</p>
          <p>• 二进制前缀 0b、八进制前缀 0o、十六进制前缀 0x 会被自动忽略</p>
        </div>
      </div>
    </div>
  )
}
