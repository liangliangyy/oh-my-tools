"use client"

import { useState, useEffect, useRef, memo } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Trash2, QrCode } from "lucide-react"

function QrcodeGeneratorInner() {
  const [text, setText] = useState("https://github.com")
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!text.trim() || !canvasRef.current) return

    const generateQR = async () => {
      try {
        const QRCode = (await import('qrcode')).default
        await QRCode.toCanvas(canvasRef.current!, text, {
          width: size,
          margin: 1,
          errorCorrectionLevel: errorLevel,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        })
        setQrCodeUrl(canvasRef.current!.toDataURL("image/png"))
      } catch (error) {
        console.error("二维码生成失败:", error)
      }
    }

    generateQR()
  }, [text, size, fgColor, bgColor, errorLevel])

  const downloadQrCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.download = `qrcode-${Date.now()}.png`
    link.href = qrCodeUrl
    link.click()
  }

  const clear = () => {
    setText("")
  }

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 左侧：配置 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>内容</Label>
            <Textarea
              placeholder="输入文本或URL..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="font-mono text-sm min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">尺寸 (px)</Label>
              <Select value={size.toString()} onValueChange={(v) => setSize(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">128 x 128</SelectItem>
                  <SelectItem value="256">256 x 256</SelectItem>
                  <SelectItem value="512">512 x 512</SelectItem>
                  <SelectItem value="1024">1024 x 1024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">容错级别</Label>
              <Select value={errorLevel} onValueChange={(v) => setErrorLevel(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">低 (L)</SelectItem>
                  <SelectItem value="M">中 (M)</SelectItem>
                  <SelectItem value="Q">高 (Q)</SelectItem>
                  <SelectItem value="H">最高 (H)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">前景色</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-14 h-9 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">背景色</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-14 h-9 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 font-mono text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={clear} className="gap-2">
              <Trash2 className="h-4 w-4" />
              清空
            </Button>
          </div>
        </div>

        {/* 右侧：预览 */}
        <div className="space-y-4">
          <Label>预览</Label>
          <div className="flex items-center justify-center min-h-[300px] rounded-lg border-2 border-dashed border-border bg-secondary/30 p-6">
            {text.trim() ? (
              <div className="space-y-4">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto rounded-lg shadow-lg border border-border"
                  style={{ display: "none" }}
                />
                {qrCodeUrl && (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    style={{ maxWidth: `${Math.min(size, 400)}px` }}
                  />
                )}
                <Button onClick={downloadQrCode} className="w-full gap-2" disabled={!qrCodeUrl}>
                  <Download className="h-4 w-4" />
                  下载二维码
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <QrCode className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">输入内容以生成二维码</p>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>* 容错级别越高，二维码越复杂，但容错能力越强</p>
            <p>* 支持文本、URL、联系方式等内容</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const QrcodeGenerator = memo(QrcodeGeneratorInner)
