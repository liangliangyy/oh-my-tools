"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check } from "lucide-react"

interface HashResult {
  algorithm: string
  hash: string
}

export function HashGenerator() {
  const [input, setInput] = useState("")
  const [results, setResults] = useState<HashResult[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generateHashes = async () => {
    if (!input) return
    setLoading(true)
    
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)
      
      const algorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"]
      const hashResults: HashResult[] = []
      
      for (const algorithm of algorithms) {
        const hashBuffer = await crypto.subtle.digest(algorithm, data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
        hashResults.push({ algorithm, hash: hashHex })
      }
      
      // Add MD5 simulation note (WebCrypto doesn't support MD5)
      setResults(hashResults)
    } catch (error) {
      console.error("Hash generation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">输入文本</label>
        <Textarea
          placeholder="输入要生成哈希的文本..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-32 font-mono text-sm bg-secondary border-border resize-none"
        />
      </div>

      <Button variant="ghost" onClick={generateHashes} disabled={!input || loading}>
        {loading ? "生成中..." : "生成 Hash"}
      </Button>

      {results.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">哈希结果</label>
          <div className="space-y-2">
            {results.map((result) => (
              <div key={result.algorithm} className="p-3 rounded-lg bg-secondary border border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-accent">{result.algorithm}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copy(result.hash, result.algorithm)} 
                    className="h-7 px-2"
                  >
                    {copied === result.algorithm ? (
                      <Check className="h-3.5 w-3.5 text-accent" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <code className="text-xs font-mono text-muted-foreground break-all">{result.hash}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
