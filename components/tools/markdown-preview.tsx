"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Trash2, Eye, EyeOff } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const exampleMarkdown = `# Markdown 示例

## 二级标题

这是一段**粗体文字**和*斜体文字*。

### 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Mermaid 流程图

\`\`\`mermaid
graph TD
    A[开始] --> B{是否登录?}
    B -->|是| C[显示首页]
    B -->|否| D[跳转登录]
    C --> E[结束]
    D --> E
\`\`\`

### 列表

- 列表项 1
- 列表项 2
  - 嵌套列表项
- 列表项 3

### 链接和图片

[访问 GitHub](https://github.com)

### 引用

> 这是一段引用文字

### 表格

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

### 任务列表

- [x] 已完成任务
- [ ] 未完成任务
`

export function MarkdownPreview() {
  const [input, setInput] = useState(exampleMarkdown)
  const [copied, setCopied] = useState<"md" | "html" | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const previewRef = useRef<HTMLDivElement>(null)

  // 渲染 Mermaid
  useEffect(() => {
    if (!previewRef.current || !showPreview) return

    const renderMermaid = async () => {
      try {
        const mermaid = (await import('mermaid')).default
        
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
          securityLevel: 'loose',
        })

        const mermaidDivs = previewRef.current!.querySelectorAll('.mermaid')
        
        for (let i = 0; i < mermaidDivs.length; i++) {
          const div = mermaidDivs[i] as HTMLElement
          const code = div.getAttribute('data-code') || ''
          if (!code.trim()) continue

          try {
            const id = `mermaid-${Date.now()}-${i}`
            const { svg } = await mermaid.render(id, code)
            div.innerHTML = svg
          } catch (e: any) {
            console.error('Mermaid render error:', e)
            div.innerHTML = `<div class="text-destructive text-sm p-4">Mermaid 渲染失败: ${e.message || '语法错误'}</div>`
          }
        }
      } catch (error) {
        console.error('Failed to load Mermaid:', error)
      }
    }

    const timer = setTimeout(renderMermaid, 100)
    return () => clearTimeout(timer)
  }, [input, showPreview])

  const copyToClipboard = async (text: string, type: "md" | "html") => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const getHtmlContent = () => {
    if (!previewRef.current) return ""
    return previewRef.current.innerHTML
  }

  const clear = () => {
    setInput("")
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={showPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowPreview(true)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            预览
          </Button>
          <Button
            variant={!showPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowPreview(false)}
            className="gap-2"
          >
            <EyeOff className="h-4 w-4" />
            HTML
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(input, "md")}
            className="hover:bg-accent/50 dark:hover:bg-accent/30"
          >
            {copied === "md" ? (
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            复制 Markdown
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(getHtmlContent(), "html")}
            className="hover:bg-accent/50 dark:hover:bg-accent/30"
          >
            {copied === "html" ? (
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            复制 HTML
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clear}
            className="hover:bg-accent/50 dark:hover:bg-accent/30"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            清空
          </Button>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Markdown 输入</label>
          <Textarea
            placeholder="输入 Markdown 文本..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-mono text-sm min-h-[500px] resize-none"
          />
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {showPreview ? "预览" : "HTML 源码"}
          </label>
          <div className="rounded-lg border border-border bg-card min-h-[500px] overflow-auto">
            {showPreview ? (
              <div ref={previewRef} className="p-6">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold mb-4 mt-6 pb-2 border-b">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold mb-3 mt-5 pb-2 border-b">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold mb-2 mt-4">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="my-3 leading-7">{children}</p>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside my-3 space-y-1">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside my-3 space-y-1">{children}</ol>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary bg-secondary/50 py-2 px-4 my-4">{children}</blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="w-full border-collapse">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="border border-border bg-secondary p-2 text-left font-semibold">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-border p-2">{children}</td>
                    ),
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      const language = match ? match[1] : ''
                      
                      // Mermaid 特殊处理
                      if (language === 'mermaid') {
                        return (
                          <div 
                            className="mermaid my-6 flex justify-center"
                            data-code={String(children).replace(/\n$/, '')}
                          >
                            {String(children)}
                          </div>
                        )
                      }
                      
                      // 行内代码
                      if (inline) {
                        return (
                          <code className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        )
                      }
                      
                      // 代码块
                      return (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={language || 'text'}
                          PreTag="div"
                          className="rounded-lg !my-4"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      )
                    }
                  }}
                >
                  {input}
                </ReactMarkdown>
              </div>
            ) : (
              <pre className="p-4 text-xs overflow-auto">
                <code>{getHtmlContent()}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
