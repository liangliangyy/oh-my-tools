"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Check, RefreshCw, Trash2, Info } from "lucide-react"

type UuidVersion = "v4" | "v1" | "v5"

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [version, setVersion] = useState<UuidVersion>("v4")
  const [namespace, setNamespace] = useState("")
  const [name, setName] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  // UUID v1: 基于时间戳
  const generateUuidV1 = () => {
    const timestamp = Date.now()
    const clockSeq = Math.floor(Math.random() * 0x4000)
    const node = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256))

    const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0')
    const timeMid = ((timestamp >> 32) & 0xffff).toString(16).padStart(4, '0')
    const timeHi = (((timestamp >> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0')
    const clkSeqHi = ((clockSeq >> 8) | 0x80).toString(16).padStart(2, '0')
    const clkSeqLow = (clockSeq & 0xff).toString(16).padStart(2, '0')
    const nodeStr = node.map(n => n.toString(16).padStart(2, '0')).join('')

    return `${timeLow}-${timeMid}-${timeHi}-${clkSeqHi}${clkSeqLow}-${nodeStr}`
  }

  // UUID v4: 随机
  const generateUuidV4 = () => {
    return crypto.randomUUID()
  }

  // UUID v5: 基于命名空间和名称的SHA-1
  const generateUuidV5 = async (namespace: string, name: string) => {
    const namespaceUuid = namespace || 'ffffffff-ffff-ffff-ffff-ffffffffffff'
    const data = namespaceUuid + name

    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-1', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))

    hashArray[6] = (hashArray[6] & 0x0f) | 0x50 // Version 5
    hashArray[8] = (hashArray[8] & 0x3f) | 0x80 // Variant

    const hex = hashArray.slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
  }

  const generateUuid = async () => {
    switch (version) {
      case "v1":
        return generateUuidV1()
      case "v5":
        return await generateUuidV5(namespace, name)
      case "v4":
      default:
        return generateUuidV4()
    }
  }

  const generate = async () => {
    const newUuids: string[] = []
    for (let i = 0; i < count; i++) {
      newUuids.push(await generateUuid())
    }
    setUuids([...newUuids, ...uuids])
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"))
    setCopied("all")
    setTimeout(() => setCopied(null), 2000)
  }

  const remove = (index: number) => {
    setUuids(uuids.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Version Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="space-y-2">
            <Label className="text-sm">UUID 版本</Label>
            <Select value={version} onValueChange={(v) => setVersion(v as UuidVersion)}>
              <SelectTrigger className="w-36 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v4">UUID v4 (随机)</SelectItem>
                <SelectItem value="v1">UUID v1 (时间戳)</SelectItem>
                <SelectItem value="v5">UUID v5 (命名)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">生成数量</Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-24 font-mono bg-secondary border-border h-9"
            />
          </div>
        </div>

        {/* UUID v5 额外输入 */}
        {version === "v5" && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">命名空间 (可选)</Label>
              <Input
                placeholder="例如: DNS, URL, OID, X500"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">名称</Label>
              <Input
                placeholder="输入名称"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-mono text-sm"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 items-center">
          <Button variant="ghost" onClick={generate} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            生成 UUID
          </Button>
          {uuids.length > 0 && (
            <>
              <Button variant="ghost" onClick={copyAll} className="gap-2">
                {copied === "all" ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                复制全部
              </Button>
              <Button variant="ghost" onClick={() => setUuids([])}>
                清空
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Version Info */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 text-sm">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
        <div className="text-muted-foreground">
          {version === "v4" && "UUID v4 使用随机数生成，适合大多数场景"}
          {version === "v1" && "UUID v1 基于时间戳和随机节点，每次生成都唯一且有时序"}
          {version === "v5" && "UUID v5 基于命名空间和名称的 SHA-1 哈希，相同输入产生相同 UUID"}
        </div>
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {uuids.map((uuid, index) => (
            <div key={`${uuid}-${index}`} className="flex items-center gap-2 p-2 rounded-lg bg-secondary border border-border group">
              <code className="flex-1 font-mono text-sm">{uuid}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copy(uuid, uuid)}
                className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied === uuid ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {uuids.length === 0 && (
        <div className="flex items-center justify-center h-32 rounded-lg bg-secondary border border-border border-dashed">
          <p className="text-muted-foreground text-sm">点击上方按钮生成 UUID</p>
        </div>
      )}
    </div>
  )
}
