"use client"

import { useState, memo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Terminal, Network } from "lucide-react"
import { toast } from "sonner"

function PortCheckGeneratorInner() {
  const [host, setHost] = useState("example.com")
  const [port, setPort] = useState("443")

  const commands = {
    "Windows (PowerShell)": `Test-NetConnection -ComputerName ${host} -Port ${port}`,
    "Windows (CMD)": `telnet ${host} ${port}`,
    "Linux (NC)": `nc -zv ${host} ${port}`,
    "Linux (Telnet)": `telnet ${host} ${port}`,
    "Linux (Bash)": `(echo > /dev/tcp/${host}/${port}) >/dev/null 2>&1 && echo "Open" || echo "Closed"`,
    "Linux (Curl)": `curl -v telnet://${host}:${port}`,
    "Python": `python3 -c "import socket; print('Open' if socket.socket().connect_ex(('${host}', ${port})) == 0 else 'Closed')"`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("命令已复制")
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>目标主机 (IP / Domain)</Label>
          <div className="relative">
            <Network className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={host} 
              onChange={(e) => setHost(e.target.value)} 
              placeholder="127.0.0.1 或 example.com"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>端口</Label>
          <Input 
            value={port} 
            onChange={(e) => setPort(e.target.value)} 
            placeholder="80" 
            type="number"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          只需要复制以下命令在终端执行即可：
        </h3>
        
        <Tabs defaultValue="windows" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="windows">Windows</TabsTrigger>
            <TabsTrigger value="linux">Linux / macOS</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>
          
          <TabsContent value="windows" className="space-y-4 pt-4">
            <CommandCard title="PowerShell (推荐)" command={commands["Windows (PowerShell)"]} onCopy={() => copyToClipboard(commands["Windows (PowerShell)"])} />
            <CommandCard title="CMD (需要启用 Telnet)" command={commands["Windows (CMD)"]} onCopy={() => copyToClipboard(commands["Windows (CMD)"])} />
          </TabsContent>
          
          <TabsContent value="linux" className="space-y-4 pt-4">
            <CommandCard title="Netcat (推荐)" command={commands["Linux (NC)"]} onCopy={() => copyToClipboard(commands["Linux (NC)"])} />
            <CommandCard title="Curl (通常已安装)" command={commands["Linux (Curl)"]} onCopy={() => copyToClipboard(commands["Linux (Curl)"])} />
            <CommandCard title="Pure Bash (无依赖)" command={commands["Linux (Bash)"]} onCopy={() => copyToClipboard(commands["Linux (Bash)"])} />
            <CommandCard title="Telnet" command={commands["Linux (Telnet)"]} onCopy={() => copyToClipboard(commands["Linux (Telnet)"])} />
          </TabsContent>
          
          <TabsContent value="python" className="space-y-4 pt-4">
            <CommandCard title="Python 3 One-Liner" command={commands["Python"]} onCopy={() => copyToClipboard(commands["Python"])} />
          </TabsContent>
        </Tabs>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground border border-border">
          <p>⚠️ 注意：由于浏览器安全限制 (CORS/Sockets)，无法直接从网页发起 TCP 连接测试。</p>
          <p>请使用上述命令在您的本机终端中进行测试。</p>
        </div>
      </div>
    </div>
  )
}

export const PortCheckGenerator = memo(PortCheckGeneratorInner)

function CommandCard({ title, command, onCopy }: { title: string, command: string, onCopy: () => void }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-muted-foreground">{title}</Label>
      </div>
      <div className="relative group">
        <div className="min-h-[3rem] w-full rounded-md border border-input bg-background px-3 py-3 text-sm font-mono shadow-sm flex items-center pr-10">
          {command}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-1 top-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
