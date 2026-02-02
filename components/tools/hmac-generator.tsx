"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Key, Wand2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const HMAC_ALGORITHMS = [
  { value: "SHA-1", label: "HMAC-SHA1" },
  { value: "SHA-256", label: "HMAC-SHA256" },
  { value: "SHA-384", label: "HMAC-SHA384" },
  { value: "SHA-512", label: "HMAC-SHA512" },
]

export function HmacGenerator() {
  const [input, setInput] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [algorithm, setAlgorithm] = useState("SHA-256")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  // 生成随机密钥
  const generateKey = () => {
    const array = new Uint8Array(32) // 256 位密钥
    crypto.getRandomValues(array)
    const key = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    setSecretKey(key)
  }

  // 生成 HMAC
  const generate = async () => {
    try {
      if (!input.trim()) {
        setError("请输入要生成 HMAC 的内容")
        return
      }
      if (!secretKey.trim()) {
        setError("请输入密钥")
        return
      }

      // 导入密钥
      const keyData = new TextEncoder().encode(secretKey)
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: algorithm },
        false,
        ["sign"]
      )

      // 生成 HMAC
      const data = new TextEncoder().encode(input)
      const signature = await crypto.subtle.sign("HMAC", cryptoKey, data)

      // 转为十六进制
      const hashArray = Array.from(new Uint8Array(signature))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

      setOutput(hashHex)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成 HMAC 失败")
      setOutput("")
    }
  }

  // 验证 HMAC
  const verify = async () => {
    try {
      if (!input.trim()) {
        setError("请输入要验证的内容")
        return
      }
      if (!secretKey.trim()) {
        setError("请输入密钥")
        return
      }
      if (!output.trim()) {
        setError("请先生成 HMAC")
        return
      }

      // 重新生成 HMAC
      const keyData = new TextEncoder().encode(secretKey)
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: algorithm },
        false,
        ["sign"]
      )

      const data = new TextEncoder().encode(input)
      const signature = await crypto.subtle.sign("HMAC", cryptoKey, data)
      const hashArray = Array.from(new Uint8Array(signature))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

      // 比较
      if (hashHex === output.toLowerCase()) {
        setError("")
        alert("✓ HMAC 验证成功！消息完整且未被篡改。")
      } else {
        setError("HMAC 验证失败！消息可能已被篡改或密钥不匹配。")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "验证 HMAC 失败")
    }
  }

  const copyOutput = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const clear = () => {
    setInput("")
    setOutput("")
    setError("")
  }

  return (
    <div className="space-y-4">
      {/* 算法选择 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">HMAC 算法</Label>
        <Select value={algorithm} onValueChange={setAlgorithm}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HMAC_ALGORITHMS.map((algo) => (
              <SelectItem key={algo.value} value={algo.value}>
                {algo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 密钥输入 */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">密钥 (Secret Key)</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="输入密钥（字符串格式）"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="font-mono text-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={generateKey}
            className="hover:bg-accent/50 dark:hover:bg-accent/30"
          >
            <Key className="h-4 w-4 mr-2" />
            生成
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          密钥可以是任意字符串，也可以是十六进制格式
        </p>
      </div>

      {/* 输入内容 */}
      <div className="space-y-2">
        <Label>输入内容</Label>
        <Textarea
          placeholder="输入要生成 HMAC 的文本..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[150px] font-mono text-sm"
        />
      </div>

      {/* HMAC 输出 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>HMAC 结果</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyOutput}
            disabled={!output}
            className="h-7 px-2 hover:bg-accent/50 dark:hover:bg-accent/30"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
        <Textarea
          value={output}
          readOnly
          className="min-h-[100px] font-mono text-sm bg-secondary/50"
          placeholder="HMAC 结果将显示在这里..."
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
          {error}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <Button variant="default" onClick={generate}>
          <Wand2 className="h-4 w-4 mr-2" />
          生成 HMAC
        </Button>
        <Button variant="ghost" onClick={verify} disabled={!output}>
          验证 HMAC
        </Button>
        <Button variant="ghost" onClick={clear}>
          清空
        </Button>
      </div>

      {/* 说明 */}
      <div className="p-4 text-sm bg-secondary/30 rounded-lg space-y-2">
        <p className="font-medium">什么是 HMAC？</p>
        <ul className="space-y-1 text-muted-foreground list-disc list-inside">
          <li>HMAC (Hash-based Message Authentication Code) 是一种消息认证码</li>
          <li>用于验证消息的完整性和真实性，防止消息被篡改</li>
          <li>需要发送方和接收方共享相同的密钥</li>
          <li>常用于 API 签名、JWT Token、数据完整性验证等场景</li>
          <li>支持 SHA-1、SHA-256、SHA-384、SHA-512 等哈希算法</li>
          <li>所有处理均在本地完成，密钥不会上传</li>
        </ul>
      </div>
    </div>
  )
}
