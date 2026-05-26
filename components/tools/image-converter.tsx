"use client"

import { useState, useRef, memo } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, Upload, Download, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Format = "image/jpeg" | "image/png" | "image/webp"

const formats: { id: Format; name: string; ext: string }[] = [
  { id: "image/jpeg", name: "JPEG", ext: "jpg" },
  { id: "image/png", name: "PNG", ext: "png" },
  { id: "image/webp", name: "WebP", ext: "webp" },
]

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function ImageConverterInner() {
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [originalPreview, setOriginalPreview] = useState("")
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 })
  const [convertedUrl, setConvertedUrl] = useState("")
  const [convertedSize, setConvertedSize] = useState(0)
  const [format, setFormat] = useState<Format>("image/webp")
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(0)
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("请选择图片文件")
      return
    }
    setError("")
    setOriginalFile(file)
    setConvertedUrl("")
    setConvertedSize(0)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setOriginalPreview(result)
      const img = new Image()
      img.onload = () => setOriginalSize({ w: img.width, h: img.height })
      img.src = result
    }
    reader.readAsDataURL(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const convert = async () => {
    if (!originalFile || !originalPreview) {
      setError("请先选择图片")
      return
    }
    setProcessing(true)
    setError("")
    try {
      const img = new Image()
      img.src = originalPreview
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("图片加载失败"))
      })

      let targetW = img.width
      let targetH = img.height
      if (maxWidth > 0 && img.width > maxWidth) {
        targetW = maxWidth
        targetH = Math.round((img.height * maxWidth) / img.width)
      }

      const canvas = document.createElement("canvas")
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas 上下文创建失败")

      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, targetW, targetH)
      }
      ctx.drawImage(img, 0, 0, targetW, targetH)

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, format, quality / 100)
      )
      if (!blob) throw new Error("转换失败，浏览器可能不支持目标格式")

      if (convertedUrl) URL.revokeObjectURL(convertedUrl)
      setConvertedUrl(URL.createObjectURL(blob))
      setConvertedSize(blob.size)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setProcessing(false)
    }
  }

  const download = () => {
    if (!convertedUrl || !originalFile) return
    const fmt = formats.find((f) => f.id === format)!
    const baseName = originalFile.name.replace(/\.[^.]+$/, "")
    const a = document.createElement("a")
    a.href = convertedUrl
    a.download = `${baseName}.${fmt.ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const clear = () => {
    if (convertedUrl) URL.revokeObjectURL(convertedUrl)
    setOriginalFile(null)
    setOriginalPreview("")
    setOriginalSize({ w: 0, h: 0 })
    setConvertedUrl("")
    setConvertedSize(0)
    setError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const compressionRatio =
    originalFile && convertedSize > 0
      ? Math.round((1 - convertedSize / originalFile.size) * 100)
      : 0

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !originalPreview && fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center min-h-[180px] rounded-lg border-2 border-dashed transition-colors",
          originalPreview ? "border-accent bg-accent/5" : "border-border bg-secondary/30 hover:border-accent/50 hover:bg-secondary/50 cursor-pointer"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />
        {!originalPreview && (
          <div className="text-center p-8">
            <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm font-medium mb-1">点击或拖放图片到此处</p>
            <p className="text-xs text-muted-foreground">支持 JPG、PNG、WebP、GIF 等格式</p>
          </div>
        )}
        {originalPreview && (
          <div className="grid w-full md:grid-cols-2 gap-4 p-4">
            <div className="space-y-2">
              <div className="text-xs font-medium tracking-wide text-muted-foreground">
                原图
              </div>
              <img
                src={originalPreview}
                alt="原图"
                className="w-full max-h-[280px] object-contain rounded-lg border border-border bg-bg-inset"
              />
              <div className="text-xs text-muted-foreground font-mono space-y-0.5">
                <div>{originalSize.w} × {originalSize.h} px</div>
                <div>{originalFile && formatFileSize(originalFile.size)}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-medium tracking-wide text-muted-foreground">
                转换结果
              </div>
              {convertedUrl ? (
                <>
                  <img
                    src={convertedUrl}
                    alt="转换结果"
                    className="w-full max-h-[280px] object-contain rounded-lg border border-border bg-bg-inset"
                  />
                  <div className="text-xs font-mono space-y-0.5">
                    <div className="text-muted-foreground">
                      {formatFileSize(convertedSize)}
                      {compressionRatio !== 0 && (
                        <span className={cn("ml-2", compressionRatio > 0 ? "text-signal-ok" : "text-destructive")}>
                          {compressionRatio > 0 ? `↓ ${compressionRatio}%` : `↑ ${-compressionRatio}%`}
                        </span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-[280px] flex items-center justify-center rounded-lg border border-border bg-bg-inset text-xs text-muted-foreground">
                  点击下方"转换"按钮
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {originalPreview && (
        <div className="grid gap-4 md:grid-cols-3 p-4 rounded-lg bg-secondary/40 border border-border">
          <div className="space-y-2">
            <label className="text-xs font-medium tracking-wide text-muted-foreground">
              目标格式
            </label>
            <Select value={format} onValueChange={(v) => setFormat(v as Format)}>
              <SelectTrigger size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium tracking-wide text-muted-foreground">
                质量
              </label>
              <span className="text-xs font-mono text-muted-foreground">{quality}%</span>
            </div>
            <Slider
              value={[quality]}
              min={1}
              max={100}
              step={1}
              onValueChange={(v) => setQuality(v[0])}
              disabled={format === "image/png"}
            />
            {format === "image/png" && (
              <p className="text-xs text-muted-foreground">PNG 为无损格式，质量参数无效</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium tracking-wide text-muted-foreground">
                最大宽度
              </label>
              <span className="text-xs font-mono text-muted-foreground">
                {maxWidth === 0 ? "原图" : `${maxWidth}px`}
              </span>
            </div>
            <Slider
              value={[maxWidth]}
              min={0}
              max={4000}
              step={100}
              onValueChange={(v) => setMaxWidth(v[0])}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm font-medium text-destructive">{error}</span>
        </div>
      )}

      {originalPreview && (
        <div className="flex flex-wrap gap-2">
          <Button variant="accent" onClick={convert} disabled={processing}>
            <Wand2 className="h-4 w-4" />
            {processing ? "处理中..." : "转换"}
          </Button>
          {convertedUrl && (
            <Button variant="outline" onClick={download}>
              <Download className="h-4 w-4" />
              下载
            </Button>
          )}
          <Button variant="ghost" onClick={clear}>
            <Trash2 className="h-4 w-4" />
            清空
          </Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1 p-3 rounded-lg bg-accent/10">
        <p className="font-medium">说明：</p>
        <p>• 全部处理在本地浏览器进行，图片不会上传</p>
        <p>• WebP 在同等质量下通常体积比 JPEG 小 25-35%</p>
        <p>• JPEG 转换时透明背景会被替换为白色</p>
      </div>
    </div>
  )
}

export const ImageConverter = memo(ImageConverterInner)
