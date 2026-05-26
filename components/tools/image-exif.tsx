"use client"

import { useState, useRef, memo } from "react"
import exifr from "exifr"
import { Button } from "@/components/ui/button"
import { Copy, Check, Trash2, Upload, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExifSection {
  title: string
  entries: { label: string; value: string }[]
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return "-"
  if (v instanceof Date) return v.toLocaleString("zh-CN")
  if (Array.isArray(v)) return v.join(", ")
  if (typeof v === "number") return v.toString()
  if (typeof v === "object") return JSON.stringify(v)
  return String(v)
}

function buildSections(meta: Record<string, unknown>, file: File): ExifSection[] {
  const m = meta || {}
  const sections: ExifSection[] = []

  sections.push({
    title: "文件信息",
    entries: [
      { label: "文件名", value: file.name },
      { label: "大小", value: formatFileSize(file.size) },
      { label: "类型", value: file.type || "未知" },
      {
        label: "尺寸",
        value:
          m.ImageWidth && m.ImageHeight
            ? `${m.ImageWidth} × ${m.ImageHeight}`
            : "-",
      },
    ],
  })

  const cameraEntries: { label: string; value: string }[] = []
  if (m.Make) cameraEntries.push({ label: "厂商", value: formatValue(m.Make) })
  if (m.Model) cameraEntries.push({ label: "型号", value: formatValue(m.Model) })
  if (m.LensModel)
    cameraEntries.push({ label: "镜头", value: formatValue(m.LensModel) })
  if (m.Software)
    cameraEntries.push({ label: "软件", value: formatValue(m.Software) })
  if (cameraEntries.length) sections.push({ title: "设备信息", entries: cameraEntries })

  const shootEntries: { label: string; value: string }[] = []
  if (m.DateTimeOriginal)
    shootEntries.push({ label: "拍摄时间", value: formatValue(m.DateTimeOriginal) })
  if (m.ExposureTime)
    shootEntries.push({
      label: "曝光时间",
      value: typeof m.ExposureTime === "number" && m.ExposureTime < 1
        ? `1/${Math.round(1 / m.ExposureTime)} s`
        : `${formatValue(m.ExposureTime)} s`,
    })
  if (m.FNumber)
    shootEntries.push({ label: "光圈", value: `f/${formatValue(m.FNumber)}` })
  if (m.ISO) shootEntries.push({ label: "ISO", value: formatValue(m.ISO) })
  if (m.FocalLength)
    shootEntries.push({ label: "焦距", value: `${formatValue(m.FocalLength)} mm` })
  if (m.Flash) shootEntries.push({ label: "闪光灯", value: formatValue(m.Flash) })
  if (m.WhiteBalance)
    shootEntries.push({ label: "白平衡", value: formatValue(m.WhiteBalance) })
  if (shootEntries.length) sections.push({ title: "拍摄参数", entries: shootEntries })

  const gpsEntries: { label: string; value: string }[] = []
  if (m.latitude && m.longitude) {
    gpsEntries.push({
      label: "经纬度",
      value: `${formatValue(m.latitude)}, ${formatValue(m.longitude)}`,
    })
  }
  if (m.GPSAltitude !== undefined)
    gpsEntries.push({ label: "海拔", value: `${formatValue(m.GPSAltitude)} m` })
  if (m.GPSDateStamp)
    gpsEntries.push({ label: "GPS 时间", value: formatValue(m.GPSDateStamp) })
  if (gpsEntries.length) sections.push({ title: "GPS 信息", entries: gpsEntries })

  const skipKeys = new Set([
    "Make",
    "Model",
    "LensModel",
    "Software",
    "DateTimeOriginal",
    "ExposureTime",
    "FNumber",
    "ISO",
    "FocalLength",
    "Flash",
    "WhiteBalance",
    "latitude",
    "longitude",
    "GPSAltitude",
    "GPSDateStamp",
    "ImageWidth",
    "ImageHeight",
    "thumbnail",
  ])
  const otherEntries = Object.entries(m)
    .filter(([k, v]) => !skipKeys.has(k) && v !== undefined && v !== null && v !== "")
    .map(([k, v]) => ({ label: k, value: formatValue(v) }))
  if (otherEntries.length)
    sections.push({ title: "其他元数据", entries: otherEntries.slice(0, 50) })

  return sections
}

function ImageExifInner() {
  const [imagePreview, setImagePreview] = useState("")
  const [sections, setSections] = useState<ExifSection[]>([])
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [hasGps, setHasGps] = useState<{ lat: number; lng: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("请选择图片文件")
      return
    }
    setError("")
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
    try {
      const meta = (await exifr.parse(file, { gps: true })) as
        | Record<string, unknown>
        | undefined
      const result = buildSections(meta || {}, file)
      setSections(result)
      if (meta && meta.latitude && meta.longitude) {
        setHasGps({ lat: meta.latitude as number, lng: meta.longitude as number })
      } else {
        setHasGps(null)
      }
    } catch (e) {
      setError("解析失败：" + (e as Error).message)
      setSections(buildSections({}, file))
      setHasGps(null)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const copyAll = async () => {
    const text = sections
      .map(
        (s) =>
          `[${s.title}]\n` +
          s.entries.map((e) => `${e.label}: ${e.value}`).join("\n")
      )
      .join("\n\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clear = () => {
    setImagePreview("")
    setSections([])
    setError("")
    setHasGps(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
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
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />
        {imagePreview ? (
          <div className="relative w-full p-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-[300px] mx-auto rounded-lg border border-border"
            />
          </div>
        ) : (
          <div className="text-center p-8">
            <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm font-medium mb-1">点击或拖放图片到此处</p>
            <p className="text-xs text-muted-foreground">支持 JPG、TIFF、HEIC、PNG 等含 EXIF 的格式</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm font-medium text-destructive">{error}</span>
        </div>
      )}

      {sections.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide text-muted-foreground">
              元数据信息
            </span>
            <div className="flex items-center gap-2">
              {hasGps && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://www.google.com/maps?q=${hasGps.lat},${hasGps.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    在地图查看
                  </a>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={copyAll}>
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-signal-ok" />
                    <span className="text-xs font-medium text-signal-ok">已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">复制全部</span>
                  </>
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={clear}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {sections.map((sec) => (
              <div
                key={sec.title}
                className="rounded-lg border border-border bg-secondary/40 p-4"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                  {sec.title}
                </h3>
                <div className="space-y-2">
                  {sec.entries.map((entry, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 text-sm">
                      <span className="text-muted-foreground col-span-1 truncate">
                        {entry.label}
                      </span>
                      <span className="font-mono col-span-2 break-all">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="text-xs text-muted-foreground space-y-1 p-3 rounded-lg bg-accent/10">
        <p className="font-medium">隐私提示：</p>
        <p>• EXIF 元数据可能包含 GPS 位置、设备信息等隐私数据</p>
        <p>• 所有解析在本地浏览器完成，图片不会上传到服务器</p>
        <p>• 分享图片前建议清除敏感 EXIF 信息</p>
      </div>
    </div>
  )
}

export const ImageExif = memo(ImageExifInner)
