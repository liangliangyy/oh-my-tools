"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, Trash2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface JWTPayload {
  header: Record<string, any>
  payload: Record<string, any>
  signature: string
}

export function JwtDecoder() {
  const [input, setInput] = useState("")
  const [decoded, setDecoded] = useState<JWTPayload | null>(null)
  const [error, setError] = useState("")
  const [copiedPart, setCopiedPart] = useState<string>("")

  const decodeJWT = () => {
    if (!input.trim()) {
      setError("请输入 JWT Token")
      setDecoded(null)
      return
    }

    try {
      const parts = input.trim().split(".")
      if (parts.length !== 3) {
        throw new Error("无效的 JWT 格式，应包含三个部分（header.payload.signature）")
      }

      const [headerB64, payloadB64, signature] = parts

      // 解码 header
      const header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")))

      // 解码 payload
      const payload = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")))

      setDecoded({ header, payload, signature })
      setError("")
    } catch (e) {
      setError("JWT 解码失败：" + (e as Error).message)
      setDecoded(null)
    }
  }

  const copyToClipboard = async (text: string, part: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedPart(part)
    setTimeout(() => setCopiedPart(""), 2000)
  }

  const clear = () => {
    setInput("")
    setDecoded(null)
    setError("")
  }

  const formatTimestamp = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      })
    } catch {
      return timestamp.toString()
    }
  }

  const isExpired = decoded?.payload.exp && decoded.payload.exp < Date.now() / 1000

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">JWT Token</label>
          <Button variant="ghost" size="sm" onClick={clear}>
            <Trash2 className="h-4 w-4 mr-1" />
            清空
          </Button>
        </div>
        <Textarea
          placeholder="粘贴 JWT Token 到这里..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono text-sm min-h-[120px]"
        />
      </div>

      <Button variant="ghost" onClick={decodeJWT} className="w-full">
        解码
      </Button>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {decoded && (
        <div className="space-y-3">
          {/* Header */}
          <div className="rounded-lg border border-border bg-secondary/30 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
              <span className="text-sm font-medium">Header</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), "header")}
              >
                {copiedPart === "header" ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <pre className="p-4 text-xs overflow-x-auto">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div className="rounded-lg border border-border bg-secondary/30 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
              <span className="text-sm font-medium">Payload</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), "payload")}
              >
                {copiedPart === "payload" ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <div className="p-4 space-y-2">
              {/* 时间戳特殊处理 */}
              {Object.entries(decoded.payload).map(([key, value]) => {
                const isTimestamp = ["exp", "iat", "nbf"].includes(key) && typeof value === "number"
                return (
                  <div key={key} className="text-xs">
                    <span className="text-muted-foreground">{key}: </span>
                    <span className={cn(
                      "font-mono",
                      key === "exp" && isExpired && "text-destructive font-medium"
                    )}>
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      {isTimestamp && ` (${formatTimestamp(value as number)})`}
                      {key === "exp" && isExpired && " ⚠️ 已过期"}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Signature */}
          <div className="rounded-lg border border-border bg-secondary/30 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
              <span className="text-sm font-medium">Signature</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(decoded.signature, "signature")}
              >
                {copiedPart === "signature" ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            <pre className="p-4 text-xs overflow-x-auto break-all">
              {decoded.signature}
            </pre>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
            <span className="text-muted-foreground">
              JWT 仅解码显示内容，不验证签名有效性
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
