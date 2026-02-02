"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Lock, Unlock, Key, RefreshCw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const AES_MODES = [
  { value: "128", label: "AES-128" },
  { value: "192", label: "AES-192" },
  { value: "256", label: "AES-256" },
]

export function AesEncryption() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [keySize, setKeySize] = useState("256")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  // 生成随机密钥
  const generateKey = () => {
    const size = parseInt(keySize) / 8
    const array = new Uint8Array(size)
    crypto.getRandomValues(array)
    const key = Array.from(array)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    setSecretKey(key)
    setError("")
  }

  // 字符串转 ArrayBuffer
  const str2ab = (str: string): ArrayBuffer => {
    const buf = new ArrayBuffer(str.length)
    const bufView = new Uint8Array(buf)
    for (let i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i)
    }
    return buf
  }

  // ArrayBuffer 转字符串
  const ab2str = (buf: ArrayBuffer): string => {
    return String.fromCharCode(...new Uint8Array(buf))
  }

  // 导入密钥
  const importKey = async (keyHex: string): Promise<CryptoKey> => {
    const size = parseInt(keySize)
    const expectedLength = size / 4 // hex length

    if (keyHex.length !== expectedLength) {
      throw new Error(`密钥长度应为 ${expectedLength} 个十六进制字符 (${size} 位)`)
    }

    const keyBytes = new Uint8Array(
      keyHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    )

    return await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    )
  }

  // 加密
  const encrypt = async () => {
    try {
      if (!input.trim()) {
        setError("请输入要加密的内容")
        return
      }
      if (!secretKey.trim()) {
        setError("请输入密钥")
        return
      }

      const key = await importKey(secretKey)
      const iv = crypto.getRandomValues(new Uint8Array(12)) // GCM 推荐 12 字节 IV
      const encoded = new TextEncoder().encode(input)

      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded
      )

      // 将 IV 和密文组合并转为 Base64
      const combined = new Uint8Array(iv.length + encrypted.byteLength)
      combined.set(iv)
      combined.set(new Uint8Array(encrypted), iv.length)

      const base64 = btoa(ab2str(combined.buffer))
      setOutput(base64)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "加密失败")
      setOutput("")
    }
  }

  // 解密
  const decrypt = async () => {
    try {
      if (!input.trim()) {
        setError("请输入要解密的内容")
        return
      }
      if (!secretKey.trim()) {
        setError("请输入密钥")
        return
      }

      const key = await importKey(secretKey)

      // Base64 解码
      const combined = str2ab(atob(input))
      const combinedArray = new Uint8Array(combined)

      // 提取 IV (前 12 字节) 和密文
      const iv = combinedArray.slice(0, 12)
      const ciphertext = combinedArray.slice(12)

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
      )

      const decoded = new TextDecoder().decode(decrypted)
      setOutput(decoded)
      setError("")
    } catch (err) {
      setError("解密失败，请检查密钥或密文是否正确")
      setOutput("")
    }
  }

  const process = () => {
    if (mode === "encrypt") {
      encrypt()
    } else {
      decrypt()
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

  const swap = () => {
    setInput(output)
    setOutput("")
    setMode(mode === "encrypt" ? "decrypt" : "encrypt")
  }

  return (
    <div className="space-y-4">
      {/* 模式切换 */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 dark:bg-secondary/30">
        <Button
          variant={mode === "encrypt" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("encrypt")}
          className={cn(
            "transition-all duration-200",
            mode !== "encrypt" && "hover:bg-accent/50 dark:hover:bg-accent/30"
          )}
        >
          <Lock className="h-4 w-4 mr-2" />
          加密
        </Button>
        <Button
          variant={mode === "decrypt" ? "default" : "ghost"}
          size="sm"
          onClick={() => setMode("decrypt")}
          className={cn(
            "transition-all duration-200",
            mode !== "decrypt" && "hover:bg-accent/50 dark:hover:bg-accent/30"
          )}
        >
          <Unlock className="h-4 w-4 mr-2" />
          解密
        </Button>
      </div>

      {/* 密钥配置 */}
      <div className="space-y-3 p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">加密密钥</Label>
          <Select value={keySize} onValueChange={setKeySize}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AES_MODES.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={`请输入 ${parseInt(keySize) / 4} 位十六进制密钥`}
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="font-mono text-xs"
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
          密钥长度: {keySize} 位 ({parseInt(keySize) / 4} 个十六进制字符)
        </p>
      </div>

      {/* 输入输出区域 */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{mode === "encrypt" ? "明文" : "密文"}</Label>
          <Textarea
            placeholder={mode === "encrypt" ? "输入要加密的文本..." : "输入要解密的 Base64 文本..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label>{mode === "encrypt" ? "密文" : "明文"}</Label>
          <Textarea
            value={output}
            readOnly
            className="min-h-[200px] font-mono text-sm bg-secondary/50"
            placeholder="处理结果将显示在这里..."
          />
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
          {error}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <Button variant="default" onClick={process}>
          {mode === "encrypt" ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              加密
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4 mr-2" />
              解密
            </>
          )}
        </Button>
        <Button variant="ghost" onClick={copyOutput} disabled={!output}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              已复制
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              复制结果
            </>
          )}
        </Button>
        <Button variant="ghost" onClick={swap} disabled={!output}>
          <RefreshCw className="h-4 w-4 mr-2" />
          交换
        </Button>
        <Button variant="ghost" onClick={clear}>
          清空
        </Button>
      </div>

      {/* 说明 */}
      <div className="p-4 text-sm bg-secondary/30 rounded-lg space-y-2">
        <p className="font-medium">使用说明:</p>
        <ul className="space-y-1 text-muted-foreground list-disc list-inside">
          <li>支持 AES-128、AES-192、AES-256 三种加密强度</li>
          <li>使用 AES-GCM 模式，提供加密和认证</li>
          <li>密钥为十六进制格式，可点击"生成"按钮随机生成</li>
          <li>加密结果为 Base64 编码，包含 IV 和密文</li>
          <li>所有处理均在本地完成，不会上传数据</li>
        </ul>
      </div>
    </div>
  )
}
