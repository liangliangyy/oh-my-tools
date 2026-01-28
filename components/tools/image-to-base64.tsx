"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Copy, Check, Trash2, Upload, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ImageToBase64() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [base64, setBase64] = useState<string>("")
  const [dataUrl, setDataUrl] = useState<string>("")
  const [copied, setCopied] = useState<"base64" | "dataurl" | null>(null)
  const [imageInfo, setImageInfo] = useState<{
    name: string
    size: number
    type: string
    width: number
    height: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件")
      return
    }

    setImageFile(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
      setDataUrl(result)

      // 提取 base64 部分（去除 data:image/xxx;base64, 前缀）
      const base64String = result.split(",")[1]
      setBase64(base64String)

      // 获取图片尺寸
      const img = new Image()
      img.onload = () => {
        setImageInfo({
          name: file.name,
          size: file.size,
          type: file.type,
          width: img.width,
          height: img.height,
        })
      }
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const copyToClipboard = async (text: string, type: "base64" | "dataurl") => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const clear = () => {
    setImageFile(null)
    setImagePreview("")
    setBase64("")
    setDataUrl("")
    setImageInfo(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center min-h-[200px] rounded-lg border-2 border-dashed transition-colors cursor-pointer",
          imagePreview
            ? "border-accent bg-accent/5"
            : "border-border bg-secondary/30 hover:border-accent/50 hover:bg-secondary/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {imagePreview ? (
          <div className="relative w-full p-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-[300px] mx-auto rounded-lg shadow-lg"
            />
          </div>
        ) : (
          <div className="text-center p-8">
            <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm font-medium mb-1">点击或拖放图片到此处</p>
            <p className="text-xs text-muted-foreground">支持 JPG, PNG, GIF, WebP 等格式</p>
          </div>
        )}
      </div>

      {/* Image Info */}
      {imageInfo && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 rounded-lg bg-secondary/50 text-sm">
          <div>
            <span className="text-muted-foreground">文件名:</span>
            <p className="font-medium truncate">{imageInfo.name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">大小:</span>
            <p className="font-medium">{formatFileSize(imageInfo.size)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">类型:</span>
            <p className="font-medium">{imageInfo.type}</p>
          </div>
          <div>
            <span className="text-muted-foreground">尺寸:</span>
            <p className="font-medium">
              {imageInfo.width} x {imageInfo.height}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Base64:</span>
            <p className="font-medium">{formatFileSize(base64.length)}</p>
          </div>
        </div>
      )}

      {/* Base64 Output */}
      {base64 && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Base64 编码（纯数据）</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(base64, "base64")}
              >
                {copied === "base64" ? (
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                复制
              </Button>
            </div>
            <Textarea
              value={base64}
              readOnly
              className="font-mono text-xs min-h-[100px] resize-none bg-secondary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Data URL（可直接用于 img src）</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(dataUrl, "dataurl")}
              >
                {copied === "dataurl" ? (
                  <Check className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                复制
              </Button>
            </div>
            <Textarea
              value={dataUrl}
              readOnly
              className="font-mono text-xs min-h-[100px] resize-none bg-secondary"
            />
          </div>

          <Button variant="ghost" onClick={clear} className="w-full gap-2">
            <Trash2 className="h-4 w-4" />
            清空
          </Button>
        </>
      )}

      {/* Tips */}
      <div className="text-xs text-muted-foreground space-y-1 p-3 rounded-lg bg-accent/10">
        <p className="font-medium">使用提示：</p>
        <p>• Base64 编码会使文件体积增大约 33%</p>
        <p>• Data URL 可直接用于 HTML/CSS 的 src 或 background-image</p>
        <p>• 适用于小图标、小图片，不建议对大图片使用</p>
      </div>
    </div>
  )
}
