"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Trash2, Eye, EyeOff } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const exampleMarkdown = `# Markdown 示例

## 二级标题

这是一段**粗体文字**和*斜体文字*。

### 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
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
  const [html, setHtml] = useState("")
  const [copied, setCopied] = useState<"md" | "html" | null>(null)
  const [showPreview, setShowPreview] = useState(true)

  // 简易的 Markdown 转 HTML 实现
  const markdownToHtml = (markdown: string): string => {
    let result = markdown

    // 代码块
    result = result.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')

    // 标题
    result = result.replace(/^### (.*$)/gim, '<h3>$1</h3>')
    result = result.replace(/^## (.*$)/gim, '<h2>$1</h2>')
    result = result.replace(/^# (.*$)/gim, '<h1>$1</h1>')

    // 粗体和斜体
    result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
    result = result.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    result = result.replace(/__(.+?)__/g, '<strong>$1</strong>')
    result = result.replace(/_(.+?)_/g, '<em>$1</em>')

    // 删除线
    result = result.replace(/~~(.+?)~~/g, '<del>$1</del>')

    // 行内代码
    result = result.replace(/`([^`]+)`/g, '<code>$1</code>')

    // 链接
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

    // 图片
    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

    // 表格
    result = result.replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(cell => cell.trim())
      const isHeader = /^[-:\s|]+$/.test(cells.join('|'))
      if (isHeader) return '<tr class="table-divider"></tr>'
      const tag = match.includes('---') ? 'th' : 'td'
      return '<tr>' + cells.map(cell => `<${tag}>${cell.trim()}</${tag}>`).join('') + '</tr>'
    })
    result = result.replace(/(<tr>.*<\/tr>\n?)+/g, '<table>$&</table>')

    // 任务列表
    result = result.replace(/^- \[(x| )\] (.*)$/gim, (match, checked, text) => {
      const isChecked = checked === 'x'
      return `<label class="task-item"><input type="checkbox" ${isChecked ? 'checked' : ''} disabled /> ${text}</label>`
    })

    // 无序列表
    result = result.replace(/^\- (.+)$/gim, '<li>$1</li>')
    result = result.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

    // 有序列表
    result = result.replace(/^\d+\. (.+)$/gim, '<li>$1</li>')

    // 引用
    result = result.replace(/^\> (.+)$/gim, '<blockquote>$1</blockquote>')
    result = result.replace(/(<blockquote>.*<\/blockquote>\n?)+/g, '<div class="quote-block">$&</div>')

    // 水平线
    result = result.replace(/^---$/gim, '<hr />')

    // 段落
    result = result.replace(/\n\n/g, '</p><p>')
    result = '<p>' + result + '</p>'

    // 清理
    result = result.replace(/<p><\/p>/g, '')
    result = result.replace(/<p>(<h[1-6]>)/g, '$1')
    result = result.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
    result = result.replace(/<p>(<pre>)/g, '$1')
    result = result.replace(/(<\/pre>)<\/p>/g, '$1')
    result = result.replace(/<p>(<ul>)/g, '$1')
    result = result.replace(/(<\/ul>)<\/p>/g, '$1')
    result = result.replace(/<p>(<table>)/g, '$1')
    result = result.replace(/(<\/table>)<\/p>/g, '$1')
    result = result.replace(/<p>(<blockquote>)/g, '$1')
    result = result.replace(/(<\/blockquote>)<\/p>/g, '$1')
    result = result.replace(/<p>(<div class="quote-block">)/g, '$1')
    result = result.replace(/(<\/div>)<\/p>/g, '$1')
    result = result.replace(/<p>(<hr \/>)<\/p>/g, '$1')
    result = result.replace(/<p>(<label class="task-item">)/g, '$1')
    result = result.replace(/(<\/label>)<\/p>/g, '$1')

    return result
  }

  useEffect(() => {
    setHtml(markdownToHtml(input))
  }, [input])

  const copyToClipboard = async (text: string, type: "md" | "html") => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
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
            variant={showPreview ? "default" : "secondary"}
            size="sm"
            onClick={() => setShowPreview(true)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            预览
          </Button>
          <Button
            variant={!showPreview ? "default" : "secondary"}
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
          >
            {copied === "md" ? (
              <Check className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            复制 Markdown
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(html, "html")}
          >
            {copied === "html" ? (
              <Check className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            复制 HTML
          </Button>
          <Button variant="ghost" size="sm" onClick={clear}>
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
              <div
                className={cn(
                  "p-4 prose prose-sm dark:prose-invert max-w-none",
                  "prose-headings:font-semibold",
                  "prose-h1:text-2xl prose-h1:mb-4",
                  "prose-h2:text-xl prose-h2:mb-3",
                  "prose-h3:text-lg prose-h3:mb-2",
                  "prose-p:my-2",
                  "prose-a:text-accent hover:prose-a:text-accent/80",
                  "prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
                  "prose-pre:bg-secondary prose-pre:border prose-pre:border-border",
                  "prose-blockquote:border-l-accent prose-blockquote:bg-secondary/50 prose-blockquote:py-1",
                  "prose-table:border-collapse prose-table:w-full",
                  "prose-th:border prose-th:border-border prose-th:bg-secondary prose-th:p-2",
                  "prose-td:border prose-td:border-border prose-td:p-2",
                  "prose-ul:my-2 prose-li:my-1",
                  "prose-img:rounded-lg prose-img:border prose-img:border-border",
                  "[&_.task-item]:flex [&_.task-item]:items-center [&_.task-item]:gap-2 [&_.task-item]:my-1",
                  "[&_.task-item_input]:m-0"
                )}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <pre className="p-4 text-xs overflow-auto">
                <code>{html}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
