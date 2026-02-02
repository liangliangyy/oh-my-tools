"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Check, Wand2, Upload } from "lucide-react"
import CryptoJS from "crypto-js"

export function Md5Generator() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [uppercase, setUppercase] = useState(false)
  const [copied, setCopied] = useState(false)

  // 生成 MD5
  const generate = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    const hash = CryptoJS.MD5(input).toString()
    setOutput(uppercase ? hash.toUpperCase() : hash)
  }

  // 文件 MD5
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const wordArray = CryptoJS.lib.WordArray.create(event.target?.result as ArrayBuffer)
      const hash = CryptoJS.MD5(wordArray).toString()
      setOutput(uppercase ? hash.toUpperCase() : hash)
      setInput(`文件: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)
    }
    reader.readAsArrayBuffer(file)
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
  }

  const toggleCase = () => {
    setUppercase(!uppercase)
    if (output) {
      setOutput(uppercase ? output.toLowerCase() : output.toUpperCase())
    }
  }

  return (
    <div className="space-y-4">
      {/* 输入区域 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>输入内容</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCase}
          >
            大小写: {uppercase ? "大写" : "小写"}
          </Button>
        </div>
        <Textarea
          placeholder="输入要生成 MD5 的文本..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            // 自动生成
            if (e.target.value.trim()) {
              const hash = CryptoJS.MD5(e.target.value).toString()
              setOutput(uppercase ? hash.toUpperCase() : hash)
            } else {
              setOutput("")
            }
          }}
          className="min-h-[150px] font-mono text-sm"
        />
      </div>

      {/* 文件上传 */}
      <div className="flex items-center gap-2">
        <Label
          htmlFor="file-upload"
          className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg cursor-pointer hover:bg-secondary/50"
        >
          <Upload className="h-4 w-4" />
          上传文件计算 MD5
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </Label>
      </div>

      {/* MD5 输出 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>MD5 结果</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyOutput}
            disabled={!output}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" />
                复制
              </>
            )}
          </Button>
        </div>
        <Textarea
          value={output}
          readOnly
          className="min-h-[80px] font-mono text-sm bg-secondary/50"
          placeholder="MD5 结果将显示在这里..."
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={generate}>
          <Wand2 className="h-4 w-4 mr-2" />
          生成 MD5
        </Button>
        <Button variant="outline" onClick={clear}>
          清空
        </Button>
      </div>

      {/* 说明 */}
      <div className="p-4 text-sm bg-secondary/30 rounded-lg space-y-2">
        <p className="font-medium">关于 MD5</p>
        <ul className="space-y-1 text-muted-foreground list-disc list-inside">
          <li>MD5 (Message-Digest Algorithm 5) 是一种广泛使用的哈希算法</li>
          <li>生成 128 位（32 个十六进制字符）的哈希值</li>
          <li>常用于文件完整性校验、密码存储（不推荐）等场景</li>
          <li>⚠️ MD5 已被证明存在碰撞漏洞，不建议用于安全敏感场景</li>
          <li>对于安全要求高的场景，建议使用 SHA-256 或更高级别的算法</li>
          <li>支持文本和文件的 MD5 计算，所有处理均在本地完成</li>
        </ul>
      </div>
    </div>
  )
}
