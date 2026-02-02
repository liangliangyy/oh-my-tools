"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Check, Lock, Unlock, Key, RefreshCw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

const KEY_SIZES = [
  { value: "2048", label: "2048 位" },
  { value: "3072", label: "3072 位" },
  { value: "4096", label: "4096 位" },
]

export function RsaEncryption() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [keySize, setKeySize] = useState("2048")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<string>("")
  const [generating, setGenerating] = useState(false)

  // ArrayBuffer 转 Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  // Base64 转 ArrayBuffer
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  // 导出密钥为 PEM 格式
  const exportToPem = (key: ArrayBuffer, type: "PUBLIC" | "PRIVATE"): string => {
    const base64 = arrayBufferToBase64(key)
    const chunks = base64.match(/.{1,64}/g) || []
    const pem = chunks.join("\n")
    return `-----BEGIN ${type} KEY-----\n${pem}\n-----END ${type} KEY-----`
  }

  // 从 PEM 格式导入密钥
  const importFromPem = (pem: string): ArrayBuffer => {
    const base64 = pem
      .replace(/-----BEGIN (.*)-----/g, "")
      .replace(/-----END (.*)-----/g, "")
      .replace(/\s/g, "")
    return base64ToArrayBuffer(base64)
  }

  // 生成 RSA 密钥对
  const generateKeyPair = async () => {
    try {
      setGenerating(true)
      setError("")

      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: parseInt(keySize),
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "密钥生成失败")
    } finally {
      setGenerating(false)
    }
  }

  // 加密
  const encrypt = async () => {
    try {
      if (!input.trim()) {
        setError("请输入要加密的内容")
        return
      }
      if (!publicKey.trim()) {
        setError("请输入公钥")
        return
      }

      // 导入公钥
      const keyData = importFromPem(publicKey)
      const cryptoKey = await crypto.subtle.importKey(
        "spki",
        keyData,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["encrypt"]
      )

      // 加密
      const encoded = new TextEncoder().encode(input)
      const encrypted = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        cryptoKey,
        encoded
      )

      // 转为 Base64
      const base64 = arrayBufferToBase64(encrypted)
      setOutput(base64)
      setError("")
    } catch (err) {
      setError("加密失败，请检查公钥格式是否正确")
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
      if (!privateKey.trim()) {
        setError("请输入私钥")
        return
      }

      // 导入私钥
      const keyData = importFromPem(privateKey)
      const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        keyData,
        { name: "RSA-OAEP", hash: "SHA-256" },
        false,
        ["decrypt"]
      )

      // 解密
      const encrypted = base64ToArrayBuffer(input)
      const decrypted = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        cryptoKey,
        encrypted
      )

      // 转为文本
      const decoded = new TextDecoder().decode(decrypted)
      setOutput(decoded)
      setError("")
    } catch (err) {
      setError("解密失败，请检查私钥或密文是否正确")
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

  const copyText = async (text: string, type: string) => {
    if (text) {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
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

      {/* 密钥管理 */}
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">生成密钥对</TabsTrigger>
          <TabsTrigger value="input">导入密钥</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-3">
          <div className="flex items-center gap-2">
            <Select value={keySize} onValueChange={setKeySize}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KEY_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={generateKeyPair} disabled={generating}>
              <Key className="h-4 w-4 mr-2" />
              {generating ? "生成中..." : "生成密钥对"}
            </Button>
          </div>

          {(publicKey || privateKey) && (
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
                  className="min-h-[150px] font-mono text-xs bg-secondary/50"
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
                  className="min-h-[150px] font-mono text-xs bg-secondary/50"
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="input" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm">公钥 (用于加密)</Label>
              <Textarea
                placeholder="粘贴 PEM 格式的公钥..."
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="min-h-[150px] font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">私钥 (用于解密)</Label>
              <Textarea
                placeholder="粘贴 PEM 格式的私钥..."
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="min-h-[150px] font-mono text-xs"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* 输入输出区域 */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{mode === "encrypt" ? "明文" : "密文"}</Label>
          <Textarea
            placeholder={
              mode === "encrypt"
                ? "输入要加密的文本..."
                : "输入要解密的 Base64 文本..."
            }
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
        <Button
          variant="ghost"
          onClick={() => copyText(output, "output")}
          disabled={!output}
        >
          {copied === "output" ? (
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
          <li>支持 2048、3072、4096 位密钥长度</li>
          <li>使用 RSA-OAEP 加密模式，更加安全</li>
          <li>公钥用于加密，私钥用于解密</li>
          <li>密钥为标准 PEM 格式，可与 OpenSSL 等工具互通</li>
          <li>RSA 适合加密小量数据，大文件建议使用 AES</li>
          <li>所有处理均在本地完成，私钥不会上传</li>
        </ul>
      </div>
    </div>
  )
}
