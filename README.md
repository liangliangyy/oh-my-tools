# oh-my-tools

<div align="center">

**🛠️ 程序员的在线工具箱**

一个免费、开源的开发者工具集合，所有处理均在浏览器本地进行，保护您的数据隐私。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

[🌐 在线体验](https://tools.lylinux.net/) | [🧰 功能列表](#-功能列表) | [🚀 本地开发](#-本地开发) | [🤝 贡献](#-贡献)

</div>

---

## ✨ 特性

- 🔒 **隐私优先** - 所有数据处理均在浏览器本地完成，不上传到任何服务器
- 🚀 **即开即用** - 无需安装、注册，打开即可使用
- 🎨 **现代化界面** - 支持深色/浅色主题切换，响应式设计，适配桌面和移动端
- 💻 **离线可用** - 核心功能支持离线使用，随时随地完成工作
- ⚡ **高性能** - 基于 Next.js App Router + React 19，极速加载
- 🌐 **完全免费** - 开源项目，永久免费，无广告

---

## 🧰 功能列表

> 共 **35 个工具**，覆盖开发者日常所需的各类场景。

### 📄 格式化工具 (8个)

| 工具 | 描述 |
|------|------|
| **JSON 格式化** | 格式化、压缩、验证 JSON 数据，支持语法高亮 |
| **JSON 转代码** | 将 JSON 转换为 TypeScript、Go、Python、Java、Rust 类型定义 |
| **SQL 格式化** | SQL 美化与压缩，支持 MySQL / PostgreSQL / SQLite / SQL Server / BigQuery 等 11 种方言 |
| **XML 工具** | XML 格式化以及 XML ↔ JSON 双向互转 |
| **HTML/CSS/JS 美化** | 前端代码美化与压缩，基于 js-beautify，支持自定义缩进 |
| **Markdown 预览** | 实时预览 Markdown 渲染效果，支持 GFM 和 Mermaid 流程图 |
| **YAML ↔ JSON** | YAML 与 JSON 格式双向转换，支持语法高亮编辑 |
| **文件 Diff** | 对比两段文本/文件的差异，支持并排/内联视图 |

### 🔐 编码解码 (7个)

| 工具 | 描述 |
|------|------|
| **Base64 编解码** | Base64 编码与解码转换，支持文本和文件 |
| **URL 编解码** | URL 编码与解码处理，支持批量转换 |
| **HTML 实体** | HTML 实体编解码，支持命名实体、十进制、十六进制三种方式 |
| **Unicode 转义** | Unicode 字符与转义序列互转，支持 `\u`、`\x`、`&#dec;`、`U+` 等多种格式 |
| **Hash 生成** | 生成 SHA-1、SHA-256、SHA-384、SHA-512 哈希值 |
| **图片转 Base64** | 图片文件转 Base64 编码，支持拖拽上传，预览原图 |
| **JWT 解码器** | 解析 JWT Token，查看 Header、Payload 内容，验证签名结构 |

### 🔑 加密工具 (5个)

| 工具 | 描述 |
|------|------|
| **AES 加解密** | AES-128/192/256 对称加密与解密，支持 GCM 模式 |
| **RSA 加解密** | RSA 非对称加密，支持 2048/3072/4096 位密钥对生成 |
| **HMAC 生成器** | 生成消息认证码 (HMAC-SHA1/256/384/512) |
| **MD5 生成器** | MD5 哈希值生成，支持文本和文件输入 |
| **密钥生成器** | 生成十六进制、Base64、随机字符串及 RSA 密钥对 |

### 🎲 生成器 (3个)

| 工具 | 描述 |
|------|------|
| **UUID 生成** | 批量生成 UUID，支持 v1/v4/v5 格式 |
| **密码生成器** | 生成安全的随机密码，支持自定义长度、字符集和规则 |
| **二维码生成** | 生成自定义二维码图片，可调整颜色、尺寸，支持下载 |

### 🔄 转换器 (6个)

| 工具 | 描述 |
|------|------|
| **时间戳转换** | Unix 时间戳与日期时间互相转换，支持多时区 |
| **颜色转换** | HEX、RGB、HSL 颜色格式互转，带颜色预览 |
| **进制转换** | 二进制、八进制、十进制、十六进制互转 |
| **日期计算器** | 日期差计算、日期加减运算、工作日统计 |
| **单位转换** | 长度、重量、温度等常用单位互转 |
| **图片格式转换** | JPG / PNG / WebP 互转，支持质量调整与尺寸缩放，本地 Canvas 处理 |

### 🌐 网络工具 (3个)

| 工具 | 描述 |
|------|------|
| **IP 子网计算** | CIDR 子网掩码计算，IP 范围与主机数分析 |
| **Chmod 计算** | Linux 文件权限数字与符号互转，直观权限选择器 |
| **端口检测** | 生成 TCP/UDP 端口连通性检测命令 |

### 💡 开发工具 (3个)

| 工具 | 描述 |
|------|------|
| **正则测试** | 实时测试正则表达式匹配结果，支持标志位选择与匹配高亮 |
| **Cron 表达式** | 可视化生成和解析 Cron 定时任务表达式，展示下次执行时间 |
| **图片 EXIF** | 查看图片元数据（设备、拍摄参数、GPS 等），支持地图链接跳转 |

---

## 🚀 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| [Next.js](https://nextjs.org/) | 16.x | 全栈框架，使用 App Router |
| [React](https://reactjs.org/) | 19.x | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | 类型安全 |
| [Tailwind CSS](https://tailwindcss.com/) | v4 | 原子化 CSS 样式 |
| [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) | latest | 无障碍 UI 组件库 |
| [CodeMirror 6](https://codemirror.net/) | 6.x | 代码编辑器，支持语法高亮与 Diff 视图 |
| [Lucide Icons](https://lucide.dev/) | latest | 图标库 |
| [next-themes](https://github.com/pacocoursey/next-themes) | latest | 深色/浅色主题切换 |
| [Mermaid](https://mermaid.js.org/) | 11.x | Markdown 中的流程图渲染 |
| [qrcode](https://github.com/soldair/node-qrcode) | 1.x | 二维码生成 |
| [sql-formatter](https://github.com/sql-formatter-org/sql-formatter) | 15.x | SQL 多方言格式化 |
| [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) | 5.x | XML 解析与构建 |
| [js-beautify](https://github.com/beautifier/js-beautify) | 1.x | HTML / CSS / JS 美化 |
| [exifr](https://github.com/MikeKovarik/exifr) | 7.x | 图片 EXIF 元数据解析 |

---

## 📦 本地开发

### 环境要求

- Node.js **18.x** 或更高版本
- **pnpm**（必须使用 pnpm，不支持 npm 或 yarn）

### 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/liangliangyy/oh-my-tools.git
cd oh-my-tools

# 2. 安装 pnpm（如果尚未安装）
npm install -g pnpm

# 3. 安装依赖
pnpm install

# 4. 复制环境变量配置
cp .env.example .env.local

# 5. 启动开发服务器
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可预览。

### 构建与部署

```bash
# 本地构建（使用 .env.local 中的配置）
pnpm build

# 生产环境构建（指定域名，用于生成 sitemap / robots.txt）
NEXT_PUBLIC_SITE_URL=https://your-domain.com pnpm build

# 启动生产服务器
pnpm start
```

### 环境变量配置

复制 `.env.example` 为 `.env.local` 并按需修改：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 网站基础 URL，用于生成 sitemap.xml 和 robots.txt | `https://tools.lylinux.net` |

### Docker 部署

```bash
# 构建镜像
docker build -t oh-my-tools .

# 运行容器
docker run -p 3000:3000 -e NEXT_PUBLIC_SITE_URL=https://your-domain.com oh-my-tools
```

---

## 🔧 添加新工具

1. 在 `components/tools/` 目录下创建新工具组件文件（如 `my-tool.tsx`），导出命名组件
2. 在 `lib/tools-config.ts` 中以 `lazy()` 注册组件，添加工具条目（id、name、icon、description、category、keywords 等）
3. 若需要在首页显示自定义图标，在 `app/page.tsx` 的 `iconMap` 中补充映射
4. 遵循统一的设计系统规范（详见 `.interface-design/system.md`）：

   | 场景 | variant |
   |------|---------|
   | 主操作按钮（格式化、转换、生成等） | `"accent"` |
   | 次要操作（压缩、下载等） | `"outline"` |
   | 工具栏 / 清空 / 复制 | `"ghost"` |
   | 切换按钮（选中态） | `"secondary"` |
   | 切换按钮（未选中态） | `"ghost"` |

**示例组件：**

```tsx
// components/tools/my-tool.tsx
"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"

function MyToolInner() {
  const [mode, setMode] = useState<"encode" | "decode">("encode")

  return (
    <div className="space-y-4">
      {/* 切换按钮组 */}
      <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 dark:bg-secondary/30 w-fit">
        <Button
          variant={mode === "encode" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMode("encode")}
        >
          编码
        </Button>
        <Button
          variant={mode === "decode" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setMode("decode")}
        >
          解码
        </Button>
      </div>

      {/* 主操作按钮 */}
      <Button variant="accent">
        <Wand2 className="h-4 w-4" />
        执行操作
      </Button>
    </div>
  )
}

export const MyTool = memo(MyToolInner)
```

注册到 `lib/tools-config.ts`：

```ts
const MyTool = lazy(() =>
  import("@/components/tools/my-tool").then((m) => ({ default: m.MyTool }))
)

// 在 tools 数组中添加：
{
  id: "my-tool",
  name: "我的工具",
  icon: Wand2,
  component: MyTool,
  description: "工具简介",
  category: "tool",
  keywords: ["关键词1", "关键词2"],
}
```

---

## 📝 项目结构

```
oh-my-tools/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # 首页（工具导航）
│   ├── layout.tsx               # 根布局（SEO、主题、字体）
│   ├── loading.tsx              # 全局加载状态
│   ├── globals.css              # 全局样式（Tailwind v4）
│   ├── robots.ts                # robots.txt 生成
│   ├── sitemap.ts               # sitemap.xml 生成
│   └── tools/                   # 工具详情页
│       ├── page.tsx             # 工具列表页
│       ├── loading.tsx          # 工具页加载状态
│       └── [toolId]/            # 动态路由：各工具页面
├── components/
│   ├── ui/                      # 基础 UI 组件（shadcn/ui）
│   ├── tools/                   # 工具组件（35个，详见 lib/tools-config.ts）
│   ├── theme-provider.tsx       # 主题 Provider
│   └── theme-toggle.tsx         # 主题切换按钮
├── hooks/                        # 自定义 React Hooks
├── lib/
│   └── utils.ts                 # 工具函数（cn 等）
├── styles/                       # 额外样式文件
├── public/                       # 静态资源
│   ├── logo.png
│   └── favicon.ico
├── Dockerfile                    # Docker 镜像构建
├── nginx.conf                    # Nginx 配置
├── next.config.mjs               # Next.js 配置
├── tailwind.config              # Tailwind 配置（内联于 CSS）
└── .env.example                  # 环境变量示例
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

**提交规范（推荐使用 [Conventional Commits](https://www.conventionalcommits.org/)）：**

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式调整 |
| `refactor` | 重构 |
| `chore` | 构建/工具链更新 |

---

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证，详见 `LICENSE` 文件。

---

## 🙏 致谢

感谢以下优秀的开源项目：

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - 精美的 UI 组件集合
- [Radix UI](https://www.radix-ui.com/) - 无障碍 UI 原语
- [CodeMirror](https://codemirror.net/) - 强大的代码编辑器
- [Lucide Icons](https://lucide.dev/) - 简洁美观的图标库
- [Mermaid](https://mermaid.js.org/) - 文本到图表的渲染引擎

---

<div align="center">

Made with ❤️ by developers, for developers

⭐ 如果这个项目对你有帮助，请给个 Star！

[🌐 tools.lylinux.net](https://tools.lylinux.net/)

</div>
