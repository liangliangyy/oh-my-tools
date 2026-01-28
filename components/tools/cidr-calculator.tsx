"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Network, Copy, Check, Search } from "lucide-react"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function CidrCalculator() {
  const [ip, setIp] = useState("192.168.1.1")
  const [mask, setMask] = useState("24")
  const [result, setResult] = useState<any>(null)

  // IP 归属检测状态
  const [checkIpAddr, setCheckIpAddr] = useState("")
  const [subnetList, setSubnetList] = useState("")
  const [matchResults, setMatchResults] = useState<Array<{ subnet: string; contains: boolean }>>([])

  useEffect(() => {
    calculate()
  }, [ip, mask])

  const calculate = () => {
    try {
      if (!isValidIp(ip)) {
        setResult(null)
        return
      }

      const maskNum = parseInt(mask, 10)
      const ipNum = ipToLong(ip)
      
      const netmaskNum = (0xffffffff << (32 - maskNum)) >>> 0
      const networkNum = (ipNum & netmaskNum) >>> 0
      const broadcastNum = (networkNum | (~netmaskNum >>> 0)) >>> 0
      
      const firstHostNum = (networkNum + 1) >>> 0
      const lastHostNum = (broadcastNum - 1) >>> 0
      const totalHosts = Math.pow(2, 32 - maskNum) - 2

      setResult({
        network: longToIp(networkNum),
        netmask: longToIp(netmaskNum),
        broadcast: longToIp(broadcastNum),
        firstHost: maskNum === 32 ? longToIp(networkNum) : longToIp(firstHostNum),
        lastHost: maskNum === 32 ? longToIp(networkNum) : longToIp(lastHostNum),
        totalHosts: maskNum === 32 ? 1 : (totalHosts < 0 ? 0 : totalHosts),
        cidr: `/${maskNum}`,
        wildcard: longToIp(~netmaskNum >>> 0)
      })
    } catch (e) {
      console.error(e)
      setResult(null)
    }
  }

  const checkIpInSubnets = () => {
    if (!isValidIp(checkIpAddr)) {
      toast.error("请输入有效的 IP 地址")
      return
    }

    if (!subnetList.trim()) {
      toast.error("请输入子网列表")
      return
    }

    const subnets = subnetList.split("\n").map(s => s.trim()).filter(s => s)
    const results: Array<{ subnet: string; contains: boolean }> = []

    const targetIpLong = ipToLong(checkIpAddr)

    subnets.forEach(subnet => {
      try {
        const [subnetIp, maskStr] = subnet.split("/")
        if (!subnetIp || !maskStr) {
          results.push({ subnet, contains: false }) // 格式错误的简单处理为不包含
          return
        }

        if (!isValidIp(subnetIp)) {
          results.push({ subnet, contains: false })
          return
        }

        const maskInt = parseInt(maskStr, 10)
        if (isNaN(maskInt) || maskInt < 0 || maskInt > 32) {
          results.push({ subnet, contains: false })
          return
        }

        const subnetIpLong = ipToLong(subnetIp)
        const netmask = (0xffffffff << (32 - maskInt)) >>> 0
        const networkLong = (subnetIpLong & netmask) >>> 0
        const targetNetworkLong = (targetIpLong & netmask) >>> 0

        if (networkLong === targetNetworkLong) {
          results.push({ subnet, contains: true })
        }
      } catch (e) {
        console.error("Parse error for subnet:", subnet, e)
        // 忽略解析错误的行
      }
    })

    if (results.length === 0) {
      toast.info("未找到匹配的子网")
    }

    setMatchResults(results)
  }

  const isValidIp = (ip: string) => {
    const parts = ip.split(".")
    if (parts.length !== 4) return false
    return parts.every(part => {
      const num = parseInt(part, 10)
      return !isNaN(num) && num >= 0 && num <= 255
    })
  }

  const ipToLong = (ip: string) => {
    return ip.split(".").reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  }

  const longToIp = (long: number) => {
    return [
      (long >>> 24) & 0xff,
      (long >>> 16) & 0xff,
      (long >>> 8) & 0xff,
      long & 0xff
    ].join(".")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("已复制到剪贴板")
  }

  return (
    <div className="space-y-8">
      {/* CIDR 计算部分 */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Network className="h-5 w-5" />
          CIDR 详情计算
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>IP 地址</Label>
            <Input 
              value={ip} 
              onChange={(e) => setIp(e.target.value)} 
              placeholder="例如: 192.168.1.1" 
            />
          </div>
          <div className="space-y-2">
            <Label>子网掩码 (CIDR)</Label>
            <Select value={mask} onValueChange={setMask}>
              <SelectTrigger>
                <SelectValue placeholder="选择掩码位" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {Array.from({ length: 33 }).map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    /{i} ({longToIp((0xffffffff << (32 - i)) >>> 0)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ResultCard title="网络地址" value={`${result.network}${result.cidr}`} onCopy={() => copyToClipboard(`${result.network}${result.cidr}`)} />
            <ResultCard title="子网掩码" value={result.netmask} onCopy={() => copyToClipboard(result.netmask)} />
            <ResultCard title="可用主机数" value={result.totalHosts.toLocaleString()} onCopy={() => copyToClipboard(result.totalHosts.toString())} />
            <ResultCard title="起始 IP" value={result.firstHost} onCopy={() => copyToClipboard(result.firstHost)} />
            <ResultCard title="结束 IP" value={result.lastHost} onCopy={() => copyToClipboard(result.lastHost)} />
            <ResultCard title="广播地址" value={result.broadcast} onCopy={() => copyToClipboard(result.broadcast)} />
            <ResultCard title="通配符掩码" value={result.wildcard} onCopy={() => copyToClipboard(result.wildcard)} />
            <ResultCard title="IP 类型" value={getIpClass(result.network)} onCopy={() => copyToClipboard(getIpClass(result.network))} />
          </div>
        )}
      </div>

      <Separator />

      {/* IP 归属检测部分 */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Search className="h-5 w-5" />
          IP 归属检测
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>待检测 IP</Label>
              <Input 
                value={checkIpAddr} 
                onChange={(e) => setCheckIpAddr(e.target.value)} 
                placeholder="例如: 10.0.0.5" 
              />
            </div>
            <div className="space-y-2">
              <Label>子网列表 (每行一个，例如 10.0.0.0/24)</Label>
              <Textarea 
                value={subnetList} 
                onChange={(e) => setSubnetList(e.target.value)} 
                placeholder={`192.168.1.0/24\n10.0.0.0/8\n172.16.0.0/12`}
                className="h-[200px] font-mono text-sm"
              />
            </div>
            <Button onClick={checkIpInSubnets} className="w-full">
              检测归属
            </Button>
          </div>

          <div className="space-y-4">
            <Label>检测结果</Label>
            <div className="rounded-lg border bg-muted/50 p-4 h-[332px] overflow-y-auto space-y-2">
              {matchResults.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-12">
                  输入 IP 和子网列表以开始检测
                </div>
              ) : (
                <div className="space-y-2">
                   {matchResults.map((res, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-background border shadow-sm">
                      <span className="font-mono text-sm">{res.subnet}</span>
                      <Badge variant={res.contains ? "default" : "secondary"} className={res.contains ? "bg-green-600 hover:bg-green-700" : ""}>
                        {res.contains ? "包含" : "不包含"}
                      </Badge>
                    </div>
                   ))}
                   {matchResults.length > 0 && matchResults.every(r => !r.contains) && (
                      <div className="flex items-center justify-center p-2 text-sm text-red-500 font-medium">
                        该 IP 不在上述任何子网中
                      </div>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultCard({ title, value, onCopy }: { title: string, value: string, onCopy: () => void }) {
  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col justify-between space-y-2 group relative hover:border-accent/50 transition-colors">
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold font-mono truncate mr-2" title={value}>{value}</span>
        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function getIpClass(ip: string) {
  const firstOctet = parseInt(ip.split(".")[0], 10)
  if (firstOctet >= 1 && firstOctet <= 126) return "Class A"
  if (firstOctet >= 128 && firstOctet <= 191) return "Class B"
  if (firstOctet >= 192 && firstOctet <= 223) return "Class C"
  if (firstOctet >= 224 && firstOctet <= 239) return "Class D (Multicast)"
  if (firstOctet >= 240 && firstOctet <= 254) return "Class E (Experimental)"
  if (firstOctet === 127) return "Loopback"
  return "Unknown"
}
