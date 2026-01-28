"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Copy, Check, RefreshCw } from "lucide-react"

export function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [password, setPassword] = useState("")
  const [passwords, setPasswords] = useState<string[]>([])
  const [batchCount, setBatchCount] = useState(5)
  const [copied, setCopied] = useState<number | "single" | "">("")

  const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const LOWERCASE = "abcdefghijklmnopqrstuvwxyz"
  const NUMBERS = "0123456789"
  const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?"
  const SIMILAR = "il1Lo0O"

  const generatePassword = (len: number = length) => {
    let charset = ""
    let result = ""

    // 构建字符集
    if (includeUppercase) charset += UPPERCASE
    if (includeLowercase) charset += LOWERCASE
    if (includeNumbers) charset += NUMBERS
    if (includeSymbols) charset += SYMBOLS

    // 排除相似字符
    if (excludeSimilar) {
      charset = charset.split("").filter(char => !SIMILAR.includes(char)).join("")
    }

    if (charset.length === 0) {
      return "请至少选择一种字符类型"
    }

    // 确保包含每种选中的字符类型
    const requiredChars: string[] = []
    if (includeUppercase && UPPERCASE.length > 0) {
      const filtered = excludeSimilar ?
        UPPERCASE.split("").filter(c => !SIMILAR.includes(c)) :
        UPPERCASE.split("")
      if (filtered.length > 0) {
        requiredChars.push(filtered[Math.floor(Math.random() * filtered.length)])
      }
    }
    if (includeLowercase && LOWERCASE.length > 0) {
      const filtered = excludeSimilar ?
        LOWERCASE.split("").filter(c => !SIMILAR.includes(c)) :
        LOWERCASE.split("")
      if (filtered.length > 0) {
        requiredChars.push(filtered[Math.floor(Math.random() * filtered.length)])
      }
    }
    if (includeNumbers && NUMBERS.length > 0) {
      const filtered = excludeSimilar ?
        NUMBERS.split("").filter(c => !SIMILAR.includes(c)) :
        NUMBERS.split("")
      if (filtered.length > 0) {
        requiredChars.push(filtered[Math.floor(Math.random() * filtered.length)])
      }
    }
    if (includeSymbols && SYMBOLS.length > 0) {
      requiredChars.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
    }

    // 添加必需字符
    for (const char of requiredChars) {
      result += char
    }

    // 填充剩余长度
    for (let i = result.length; i < len; i++) {
      result += charset[Math.floor(Math.random() * charset.length)]
    }

    // 打乱顺序
    result = result.split("").sort(() => Math.random() - 0.5).join("")

    return result
  }

  const handleGenerate = () => {
    const pwd = generatePassword()
    setPassword(pwd)
  }

  const handleBatchGenerate = () => {
    const pwds: string[] = []
    for (let i = 0; i < batchCount; i++) {
      pwds.push(generatePassword())
    }
    setPasswords(pwds)
  }

  const copyPassword = async (pwd: string, index: number | "single") => {
    await navigator.clipboard.writeText(pwd)
    setCopied(index)
    setTimeout(() => setCopied(""), 2000)
  }

  const getStrength = (pwd: string) => {
    if (!pwd) return { text: "", color: "" }

    let score = 0
    if (pwd.length >= 12) score++
    if (pwd.length >= 16) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^a-zA-Z0-9]/.test(pwd)) score++

    if (score <= 2) return { text: "弱", color: "text-red-500" }
    if (score <= 4) return { text: "中", color: "text-yellow-500" }
    return { text: "强", color: "text-green-500" }
  }

  const strength = getStrength(password)

  return (
    <div className="space-y-6">
      {/* 配置选项 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>密码长度: {length}</Label>
          </div>
          <Slider
            value={[length]}
            onValueChange={(val) => setLength(val[0])}
            min={4}
            max={64}
            step={1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uppercase"
              checked={includeUppercase}
              onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
            />
            <label htmlFor="uppercase" className="text-sm cursor-pointer">
              大写字母 (A-Z)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="lowercase"
              checked={includeLowercase}
              onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
            />
            <label htmlFor="lowercase" className="text-sm cursor-pointer">
              小写字母 (a-z)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={includeNumbers}
              onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
            />
            <label htmlFor="numbers" className="text-sm cursor-pointer">
              数字 (0-9)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={includeSymbols}
              onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
            />
            <label htmlFor="symbols" className="text-sm cursor-pointer">
              符号 (!@#$...)
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="exclude-similar"
            checked={excludeSimilar}
            onCheckedChange={(checked) => setExcludeSimilar(checked === true)}
          />
          <label htmlFor="exclude-similar" className="text-sm cursor-pointer">
            排除相似字符 (i, l, 1, L, o, 0, O)
          </label>
        </div>
      </div>

      {/* 生成单个密码 */}
      <div className="space-y-2">
        <Label>生成的密码</Label>
        <div className="flex gap-2">
          <Input
            value={password}
            readOnly
            placeholder="点击生成密码"
            className="font-mono"
          />
          <Button onClick={handleGenerate} size="icon" variant="secondary">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => copyPassword(password, "single")}
            size="icon"
            variant="secondary"
            disabled={!password}
          >
            {copied === "single" ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {password && (
          <p className="text-sm text-muted-foreground">
            强度: <span className={strength.color}>{strength.text}</span>
          </p>
        )}
      </div>

      {/* 批量生成 */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Label>批量生成</Label>
          <Input
            type="number"
            value={batchCount}
            onChange={(e) => setBatchCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            className="w-20 h-8"
            min={1}
            max={20}
          />
          <Button variant="secondary" onClick={handleBatchGenerate} size="sm">
            生成
          </Button>
        </div>

        {passwords.length > 0 && (
          <div className="space-y-2">
            {passwords.map((pwd, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-secondary/30">
                <code className="flex-1 text-sm font-mono">{pwd}</code>
                <Button
                  onClick={() => copyPassword(pwd, index)}
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                >
                  {copied === index ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
