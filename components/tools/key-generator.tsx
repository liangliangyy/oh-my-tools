"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Check, Key, RefreshCw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const KEY_TYPES = [
  { value: "hex", label: "十六进制密钥 (HEX)" },
  { value: "base64", label: "Base64 密钥" },
  { value: "random", label: "随机字符串" },
  { value: "rsa", label: "RSA 密钥对" },
]

const KEY_LENGTHS = {
  hex: [
    { value: "128", label: "128 位 (16 字节)" },
    { value: "192", label: "192 位 (24 字节)" },
    { value: "256", label: "256 位 (32 字节)" },
    { value: "512", label: "512 位 (64 字节)" },
  ],
  base64: [
    { value: "16", label: "16 字节" },
    { value: "24", label: "24 字节" },
    { value: "32", label: "32 字节" },
    { value: "64", label: "64 字节" },
  ],
  random: [
    { value: "16", label: "16 字符" },
    { value: "32", label: "32 字符" },
    { value: "64", label: "64 字符" },
    { value: "128", label: "128 字符" },
  ],
  rsa: [
    { value: "2048", label: "2048 位" },
    { value: "3072", label: "3072 位" },
    { value: "4096", label: "4096 位" },
  ],
}

function KeyGeneratorInner() {
  const [keyType, setKeyType] = useState("hex")
  const [keyLength, setKeyLength] = useState("256")
  const [output, setOutput] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [copied, setCopied] = useState<string>("")
  const [generating, setGenerating] = useState(false)
  const [count, setCount] = useState(1)

  // ArrayBuffer 转 Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  // 导出密钥为 PEM 格式
  const exportToPem = (key: ArrayBuffer, type: "PUBLIC" | "PRIVATE"): string => {
    const base64 = arrayBufferToBase64(key)
    const chunks = base64.match(/.{1,64}/g) || []
    const pem = chunks.join("\n")
    return `-----BEGIN ${type} KEY-----\n${pem}\n-----END ${type} KEY-----`
  }

  // 生成十六进制密钥
  const generateHexKey = () => {
    const size = parseInt(keyLength) / 8
    const keys = []
    for (let i = 0; i < count; i++) {
      const array = new Uint8Array(size)
      crypto.getRandomValues(array)
      const key = Array.from(array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
      keys.push(key)
    }
    setOutput(keys.join("\n\n"))
  }

  // 生成 Base64 密钥
  const generateBase64Key = () => {
    const size = parseInt(keyLength)
    const keys = []
    for (let i = 0; i < count; i++) {
      const array = new Uint8Array(size)
      crypto.getRandomValues(array)
      const key = btoa(String.fromCharCode(...array))
      keys.push(key)
    }
    setOutput(keys.join("\n\n"))
  }

  // 生成随机字符串
  const generateRandomString = () => {
    const length = parseInt(keyLength)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    const keys = []
    for (let i = 0; i < count; i++) {
      let key = ""
      const array = new Uint8Array(length)
      crypto.getRandomValues(array)
      for (let j = 0; j < length; j++) {
        key += chars[array[j] % chars.length]
      }
      keys.push(key)
    }
    setOutput(keys.join("\n\n"))
  }

  // 生成 RSA 密钥对
  const generateRsaKeyPair = async () => {
    try {
      setGenerating(true)

      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: parseInt(keyLength),
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      )

      // 导出公钥
      const exportedPublicKey = await crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
      )
      const publicKeyPem = exportToPem(exportedPublicKey, "PUBLIC")
      setPublicKey(publicKeyPem)

      // 导出私钥
      const exportedPrivateKey = await crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
      )
      const privateKeyPem = exportToPem(exportedPrivateKey, "PRIVATE")
      setPrivateKey(privateKeyPem)

      setOutput("")
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  // 生成密钥
  const generate = async () => {
    setPublicKey("")
    setPrivateKey("")
    setOutput("")

    switch (keyType) {
      case "hex":
        generateHexKey()
        break
      case "base64":
        generateBase64Key()
        break
      case "random":
        generateRandomString()
        break
      case "rsa":
        await generateRsaKeyPair()
        break
    }
  }

  const copyText = async (text: string, type: string) => {
    if (text) {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    }
  }

  return (
    <div className="space-y-4">
      {/* 密钥类型选择 */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-sm font-medium">密钥类型</Label>
          <Select value={keyType} onValueChange={(v) => {
            setKeyType(v)
            setKeyLength(KEY_LENGTHS[v as keyof typeof KEY_LENGTHS][0].value)
            setOutput("")
            setPublicKey("")
            setPrivateKey("")
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {KEY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {keyType === "rsa" ? "密钥长度" : "长度"}
          </Label>
          <Select value={keyLength} onValueChange={setKeyLength}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {KEY_LENGTHS[keyType as keyof typeof KEY_LENGTHS].map((len) => (
                <SelectItem key={len.value} value={len.value}>
                  {len.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 批量生成数量 */}
      {keyType !== "rsa" && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">生成数量</Label>
          <Input
            type="number"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-32"
          />
          <p className="text-xs text-muted-foreground">最多生成 50 个密钥</p>
        </div>
      )}

      {/* 生成按钮 */}
      <Button onClick={generate} disabled={generating} className="w-full">
        <Key className="h-4 w-4 mr-2" />
        {generating ? "生成中..." : "生成密钥"}
      </Button>

      {/* 结果展示 - RSA 密钥对 */}
      {keyType === "rsa" && (publicKey || privateKey) && (
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">公钥 (Public Key)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyText(publicKey, "public")}
                className="h-7 px-2 hover:bg-accent/50 dark:hover:bg-accent/30"
              >
                {copied === "public" ? (
                  <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <Textarea
              value={publicKey}
              readOnly
              className="min-h-[200px] font-mono text-xs bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">私钥 (Private Key)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyText(privateKey, "private")}
                className="h-7 px-2 hover:bg-accent/50 dark:hover:bg-accent/30"
              >
                {copied === "private" ? (
                  <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <Textarea
              value={privateKey}
              readOnly
              className="min-h-[200px] font-mono text-xs bg-secondary/50"
            />
          </div>
        </div>
      )}

      {/* 结果展示 - 其他密钥 */}
      {keyType !== "rsa" && output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">生成的密钥</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyText(output, "output")}
              className="h-7 px-2 hover:bg-accent/50 dark:hover:bg-accent/30"
            >
              {copied === "output" ? (
                <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          <Textarea
            value={output}
            readOnly
            className="min-h-[200px] font-mono text-sm bg-secondary/50"
          />
        </div>
      )}

      {/* 说明 */}
      <div className="p-4 text-sm bg-secondary/30 rounded-lg space-y-2">
        <p className="font-medium">密钥类型说明:</p>
        <ul className="space-y-1 text-muted-foreground list-disc list-inside">
          <li><strong>十六进制密钥</strong>: 适用于 AES、DES 等对称加密算法</li>
          <li><strong>Base64 密钥</strong>: 常用于 API 密钥、Token 等场景</li>
          <li><strong>随机字符串</strong>: 适用于密码、验证码等场景</li>
          <li><strong>RSA 密钥对</strong>: 公钥加密、私钥解密的非对称加密</li>
          <li>所有密钥均使用 crypto.getRandomValues() 生成，保证高安全性</li>
          <li>所有处理均在本地完成，密钥不会上传到服务器</li>
        </ul>
      </div>
    </div>
  )
}

export const KeyGenerator = memo(KeyGeneratorInner)
