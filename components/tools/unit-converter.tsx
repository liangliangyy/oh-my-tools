"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeftRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

type UnitType = "length" | "weight" | "temperature" | "storage" | "area" | "speed"

const UNIT_TYPES: { value: UnitType; label: string }[] = [
  { value: "length", label: "长度" },
  { value: "weight", label: "重量" },
  { value: "temperature", label: "温度" },
  { value: "storage", label: "存储" },
  { value: "area", label: "面积" },
  { value: "speed", label: "速度" },
]

const UNITS: Record<UnitType, { value: string; label: string; ratio?: number }[]> = {
  length: [
    { value: "nm", label: "纳米 (nm)", ratio: 1e-9 },
    { value: "um", label: "微米 (μm)", ratio: 1e-6 },
    { value: "mm", label: "毫米 (mm)", ratio: 0.001 },
    { value: "cm", label: "厘米 (cm)", ratio: 0.01 },
    { value: "m", label: "米 (m)", ratio: 1 },
    { value: "km", label: "千米 (km)", ratio: 1000 },
    { value: "in", label: "英寸 (in)", ratio: 0.0254 },
    { value: "ft", label: "英尺 (ft)", ratio: 0.3048 },
    { value: "yd", label: "码 (yd)", ratio: 0.9144 },
    { value: "mi", label: "英里 (mi)", ratio: 1609.344 },
  ],
  weight: [
    { value: "mg", label: "毫克 (mg)", ratio: 1e-6 },
    { value: "g", label: "克 (g)", ratio: 0.001 },
    { value: "kg", label: "千克 (kg)", ratio: 1 },
    { value: "t", label: "吨 (t)", ratio: 1000 },
    { value: "oz", label: "盎司 (oz)", ratio: 0.0283495 },
    { value: "lb", label: "磅 (lb)", ratio: 0.453592 },
  ],
  temperature: [
    { value: "c", label: "摄氏度 (°C)" },
    { value: "f", label: "华氏度 (°F)" },
    { value: "k", label: "开尔文 (K)" },
  ],
  storage: [
    { value: "b", label: "Byte (B)", ratio: 1 },
    { value: "kb", label: "Kilobyte (KB)", ratio: 1024 },
    { value: "mb", label: "Megabyte (MB)", ratio: 1048576 },
    { value: "gb", label: "Gigabyte (GB)", ratio: 1073741824 },
    { value: "tb", label: "Terabyte (TB)", ratio: 1099511627776 },
    { value: "pb", label: "Petabyte (PB)", ratio: 1125899906842624 },
  ],
  area: [
    { value: "m2", label: "平方米 (m²)", ratio: 1 },
    { value: "km2", label: "平方千米 (km²)", ratio: 1e6 },
    { value: "ha", label: "公顷 (ha)", ratio: 10000 },
    { value: "mu", label: "亩", ratio: 666.666667 },
    { value: "ft2", label: "平方英尺 (sq ft)", ratio: 0.092903 },
    { value: "ac", label: "英亩 (ac)", ratio: 4046.85642 },
  ],
  speed: [
    { value: "mps", label: "米/秒 (m/s)", ratio: 1 },
    { value: "kph", label: "千米/时 (km/h)", ratio: 0.277778 },
    { value: "mph", label: "英里/时 (mph)", ratio: 0.44704 },
    { value: "kn", label: "节 (kn)", ratio: 0.514444 },
    { value: "mach", label: "马赫 (Mach)", ratio: 340.29 },
  ]
}

export function UnitConverter() {
  const [type, setType] = useState<UnitType>("length")
  const [fromUnit, setFromUnit] = useState(UNITS.length[4].value) // m
  const [toUnit, setToUnit] = useState(UNITS.length[5].value) // km
  const [inputValue, setInputValue] = useState("1")
  const [outputValue, setOutputValue] = useState("")

  // Handle type change
  useEffect(() => {
    // Reset units when type changes
    const defaultUnits = UNITS[type]
    if (defaultUnits && defaultUnits.length >= 2) {
      setFromUnit(defaultUnits[0].value)
      setToUnit(defaultUnits[1].value)
    }
  }, [type])

  // Calculate
  useEffect(() => {
    const val = parseFloat(inputValue)
    if (isNaN(val)) {
      setOutputValue("")
      return
    }

    let result = 0

    if (type === "temperature") {
      result = convertTemperature(val, fromUnit, toUnit)
    } else {
      const fromRatio = UNITS[type].find(u => u.value === fromUnit)?.ratio || 1
      const toRatio = UNITS[type].find(u => u.value === toUnit)?.ratio || 1
      const baseValue = val * fromRatio
      result = baseValue / toRatio
    }

    // Smart rounding
    const rounded = parseFloat(result.toPrecision(12))
    setOutputValue(rounded.toString())

  }, [inputValue, fromUnit, toUnit, type])

  const convertTemperature = (val: number, from: string, to: string) => {
    if (from === to) return val
    
    let celsius = val
    if (from === "f") celsius = (val - 32) * 5 / 9
    if (from === "k") celsius = val - 273.15
    
    if (to === "c") return celsius
    if (to === "f") return celsius * 9 / 5 + 32
    if (to === "k") return celsius + 273.15
    return celsius
  }

  const handleSwap = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
    setInputValue(outputValue)
  }

  const copyToClipboard = () => {
    if (!outputValue) return
    navigator.clipboard.writeText(outputValue)
    toast.success("结果已复制")
  }

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg border w-fit">
        {UNIT_TYPES.map(t => (
            <Button
                key={t.value}
                variant={type === t.value ? "secondary" : "ghost"}
                className={`h-9 rounded-md min-w-[3rem] ${
                    type === t.value 
                    ? "bg-background text-foreground shadow-sm font-medium hover:bg-background" 
                    : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                }`}
                onClick={() => setType(t.value)}
            >
                {t.label}
            </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-center pt-2">
                
                {/* Source Input Group */}
                <div className="flex-1 w-full space-y-2">
                    <Label className="text-muted-foreground ml-1 text-xs">数值 ({UNITS[type].find(u => u.value === fromUnit)?.label})</Label>
                    <div className="flex gap-0 relative rounded-md border bg-background ring-offset-background group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <Input 
                            type="number" 
                            value={inputValue} 
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="0"
                            className="text-xl h-14 font-medium border-0 focus-visible:ring-0 shadow-none rounded-r-none px-4"
                        />
                        <div className="bg-muted/10 border-l flex items-center px-1">
                             <Select value={fromUnit} onValueChange={setFromUnit}>
                                <SelectTrigger className="w-[85px] h-10 border-0 bg-transparent focus:ring-0 text-sm gap-1 shadow-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    {UNITS[type].map(u => (
                                        <SelectItem key={u.value} value={u.value}>{u.value}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Swap Button */}
                <div className="flex shrink-0 self-center">
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleSwap} 
                        className="rounded-full h-10 w-10 hover:bg-muted text-muted-foreground hover:text-foreground"
                     >
                        <ArrowLeftRight className="h-5 w-5" />
                     </Button>
                </div>

                {/* Target Output Group */}
                 <div className="flex-1 w-full space-y-2">
                    <Label className="text-muted-foreground ml-1 text-xs">结果 ({UNITS[type].find(u => u.value === toUnit)?.label})</Label>
                    <div className="flex gap-0 relative rounded-md border bg-muted/30 ring-offset-background group hover:bg-muted/40 transition-colors">
                         <div className="flex-1">
                            <Input 
                                value={outputValue} 
                                readOnly 
                                className="text-xl h-14 font-bold bg-transparent text-primary border-0 focus-visible:ring-0 shadow-none rounded-r-none px-4 cursor-pointer"
                                onClick={copyToClipboard}
                            />
                        </div>
                        <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-24 top-2 h-10 w-10 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                onClick={copyToClipboard}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        <div className="bg-muted/10 border-l flex items-center px-1">
                             <Select value={toUnit} onValueChange={setToUnit}>
                                <SelectTrigger className="w-[85px] h-10 border-0 bg-transparent focus:ring-0 text-sm gap-1 shadow-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    {UNITS[type].map(u => (
                                        <SelectItem key={u.value} value={u.value}>{u.value}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

            </div>
        </CardContent>
      </Card>
    </div>
  )
}
