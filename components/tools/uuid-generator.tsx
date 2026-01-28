"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react"

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)

  const generateUuid = () => {
    return crypto.randomUUID()
  }

  const generate = () => {
    const newUuids = Array.from({ length: count }, generateUuid)
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
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
          className="w-24 font-mono bg-secondary border-border"
        />
        <Button variant="secondary" onClick={generate} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          生成 UUID
        </Button>
        {uuids.length > 0 && (
          <>
            <Button variant="secondary" onClick={copyAll} className="gap-2">
              {copied === "all" ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
              复制全部
            </Button>
            <Button variant="secondary" onClick={() => setUuids([])}>
              清空
            </Button>
          </>
        )}
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
