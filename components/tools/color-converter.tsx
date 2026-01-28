"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

export function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6")
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [copied, setCopied] = useState<string | null>(null)

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    }
    return null
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = Math.max(0, Math.min(255, x)).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }).join("")
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }

  const updateFromHex = (newHex: string) => {
    setHex(newHex)
    const rgbVal = hexToRgb(newHex)
    if (rgbVal) {
      setRgb(rgbVal)
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b))
    }
  }

  const updateFromRgb = (newRgb: { r: number; g: number; b: number }) => {
    setRgb(newRgb)
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }

  const updateFromHsl = (newHsl: { h: number; s: number; l: number }) => {
    setHsl(newHsl)
    const rgbVal = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgb(rgbVal)
    setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b))
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div className="flex gap-4">
        <div
          className="w-24 h-24 rounded-lg border border-border shadow-lg"
          style={{ backgroundColor: hex }}
        />
        <div className="flex-1">
          <Input
            type="color"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-full h-24 p-1 cursor-pointer bg-secondary border-border"
          />
        </div>
      </div>

      {/* HEX */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">HEX</label>
        <div className="flex gap-2">
          <Input
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="font-mono bg-secondary border-border"
            placeholder="#000000"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => copy(hex, "hex")}
            className="hover:bg-accent/50 dark:hover:bg-accent/30"
          >
            {copied === "hex" ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* RGB */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">RGB</label>
        <div className="flex gap-2">
          <div className="flex gap-2 flex-1">
            <Input
              type="number"
              min={0}
              max={255}
              value={rgb.r}
              onChange={(e) => updateFromRgb({ ...rgb, r: parseInt(e.target.value) || 0 })}
              className="font-mono bg-secondary border-border"
              placeholder="R"
            />
            <Input
              type="number"
              min={0}
              max={255}
              value={rgb.g}
              onChange={(e) => updateFromRgb({ ...rgb, g: parseInt(e.target.value) || 0 })}
              className="font-mono bg-secondary border-border"
              placeholder="G"
            />
            <Input
              type="number"
              min={0}
              max={255}
              value={rgb.b}
              onChange={(e) => updateFromRgb({ ...rgb, b: parseInt(e.target.value) || 0 })}
              className="font-mono bg-secondary border-border"
              placeholder="B"
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => copy(rgbString, "rgb")}
            className="hover:bg-accent/50 dark:hover:bg-accent/30"
          >
            {copied === "rgb" ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <code className="text-xs text-muted-foreground font-mono">{rgbString}</code>
      </div>

      {/* HSL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">HSL</label>
        <div className="flex gap-2">
          <div className="flex gap-2 flex-1">
            <Input
              type="number"
              min={0}
              max={360}
              value={hsl.h}
              onChange={(e) => updateFromHsl({ ...hsl, h: parseInt(e.target.value) || 0 })}
              className="font-mono bg-secondary border-border"
              placeholder="H"
            />
            <Input
              type="number"
              min={0}
              max={100}
              value={hsl.s}
              onChange={(e) => updateFromHsl({ ...hsl, s: parseInt(e.target.value) || 0 })}
              className="font-mono bg-secondary border-border"
              placeholder="S"
            />
            <Input
              type="number"
              min={0}
              max={100}
              value={hsl.l}
              onChange={(e) => updateFromHsl({ ...hsl, l: parseInt(e.target.value) || 0 })}
              className="font-mono bg-secondary border-border"
              placeholder="L"
            />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => copy(hslString, "hsl")}
            className="hover:bg-accent/50 dark:hover:bg-accent/30"
          >
            {copied === "hsl" ? <Check className="h-4 w-4 text-green-600 dark:text-green-400" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <code className="text-xs text-muted-foreground font-mono">{hslString}</code>
      </div>
    </div>
  )
}
