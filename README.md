# oh-my-tools

<div align="center">

**🛠️ 程序员的在线工具箱**

一个免费、开源的开发者工具集合，所有处理均在浏览器本地进行，保护您的数据隐私。

[在线体验](https://tools.lylinux.net/) | [功能列表](#-功能列表) | [本地开发](#-本地开发)

</div>

---

## ✨ 特性

- 🔒 **隐私优先** - 所有数据处理均在浏览器本地完成，不上传到任何服务器
- 🚀 **即开即用** - 无需安装、注册，打开即可使用
- 🎨 **现代化界面** - 支持深色/浅色主题切换，响应式设计
- 💻 **离线可用** - 支持离线使用，随时随地完成工作
- 🌐 **完全免费** - 开源项目，永久免费

## 🧰 功能列表

### 格式化工具 (5个)

- **JSON 格式化** - 格式化、压缩、验证 JSON 数据
- **JSON 转代码** - 将 JSON 转换为 TypeScript、Go、Python、Java、Rust 类型定义
- **Markdown 预览** - 实时预览 Markdown 渲染效果，支持 Mermaid 流程图
- **YAML ↔ JSON** - YAML 与 JSON 格式双向转换
- **文件 Diff** - 对比两个文件的差异，支持并排/内联视图

### 编码解码 (5个)

- **Base64 编解码** - Base64 编码与解码转换
- **URL 编解码** - URL 编码与解码处理
- **Hash 生成** - 生成 SHA-1、SHA-256、SHA-384、SHA-512 哈希值
- **图片转 Base64** - 图片文件转 Base64 编码，支持拖拽上传
- **JWT 解码器** - 解析 JWT Token，查看 header、payload 内容

### 加密工具 (5个)

- **AES 加解密** - AES-128/192/256 对称加密与解密，支持 GCM 模式
- **RSA 加解密** - RSA 非对称加密，支持 2048/3072/4096 位密钥对生成
- **HMAC 生成器** - 生成消息认证码 (HMAC-SHA1/256/384/512)
- **MD5 生成器** - MD5 哈希值生成，支持文本和文件
- **密钥生成器** - 生成十六进制、Base64、随机字符串、RSA 密钥对

### 生成器 (3个)

- **UUID 生成** - 批量生成 UUID (支持 v1/v4/v5)
- **密码生成器** - 生成安全的随机密码，支持自定义规则
- **二维码生成** - 生成自定义二维码图片，可调整颜色和尺寸

### 转换器 (5个)

- **时间戳转换** - Unix 时间戳与日期时间互相转换
- **颜色转换** - HEX、RGB、HSL 颜色格式互转
- **进制转换** - 二进制、八进制、十进制、十六进制互转
- **日期计算器** - 日期差计算、日期加减运算、工作日统计
- **单位转换** - 长度、重量、温度等常用单位互转

### 网络工具 (3个)

- **IP 子网计算** - CIDR 子网掩码计算，IP 范围分析
- **Chmod 计算** - Linux 文件权限数字与符号互转
- **端口检测** - 生成端口连通性检测命令

### 开发工具 (2个)

- **正则测试** - 实时测试正则表达式匹配结果
- **Cron 表达式** - 可视化生成和解析 Cron 定时任务表达式

**总计: 28 个工具**

## 🚀 技术栈

- **框架**: [Next.js 16.0.10](https://nextjs.org/) with App Router
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS v4](https://tailwindcss.com/)
- **组件库**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **代码编辑器**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **图标**: [Lucide Icons](https://lucide.dev/)
- **主题**: [next-themes](https://github.com/pacocoursey/next-themes)

## 📦 本地开发

### 环境要求

- Node.js 18.x 或更高版本
- **pnpm** (必须使用 pnpm，不支持 npm 或 yarn)

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/liangliangyy/oh-my-tools.git
cd oh-my-tools
```

2. 安装 pnpm（如果尚未安装）

```bash
npm install -g pnpm
```

3. 安装依赖

```bash
pnpm install
```

4. 启动开发服务器

```bash
pnpm dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 构建部署

```bash
# 本地构建（使用 .env.local 中的配置）
pnpm build

# 生产环境构建（指定域名）
NEXT_PUBLIC_SITE_URL=https://your-domain.com pnpm build

# 启动生产服务器
pnpm start
```

### 环境变量配置

复制 `.env.example` 为 `.env.local` 并修改配置：

```bash
cp .env.example .env.local
```

主要配置项：
- `NEXT_PUBLIC_SITE_URL`: 网站基础URL，用于生成 sitemap.xml 和 robots.txt

## 🔧 添加新工具

1. 在 `components/tools/` 目录下创建新工具组件
2. 在 `app/page.tsx` 中注册工具（首页展示），指定 `category` 分类
3. 在 `app/tools/page.tsx` 中注册工具（工具页面），指定 `category` 分类
4. 确保使用统一的按钮样式：
   - 操作按钮: `variant="ghost"`
   - 切换按钮(选中): `variant="default"`
   - 切换按钮(未选中): `variant="ghost"`

示例：

```tsx
// components/tools/my-tool.tsx
"use client"

import { Button } from "@/components/ui/button"

export function MyTool() {
  const [mode, setMode] = useState("encode")

  return (
    <div className="space-y-4">
      {/* 切换按钮 */}
      <div className="flex gap-2">
        <Button
          variant={mode === "encode" ? "default" : "ghost"}
          onClick={() => setMode("encode")}
        >
          编码
        </Button>
      </div>

      {/* 操作按钮 */}
      <Button variant="ghost">执行操作</Button>
    </div>
  )
}
```

## 📝 项目结构

```
oh-my-tools/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 首页
│   ├── layout.tsx           # 根布局
│   ├── loading.tsx          # 加载状态
│   ├── globals.css          # 全局样式
│   └── tools/               # 工具页面
│       ├── page.tsx
│       └── loading.tsx
├── components/
│   ├── ui/                  # 基础 UI 组件 (shadcn/ui)
│   ├── tools/               # 工具组件 (28个)
│   │   ├── json-formatter.tsx
│   │   ├── json-to-code.tsx
│   │   ├── jwt-decoder.tsx
│   │   ├── aes-encryption.tsx
│   │   ├── rsa-encryption.tsx
│   │   ├── hmac-generator.tsx
│   │   ├── md5-generator.tsx
│   │   ├── key-generator.tsx
│   │   ├── cidr-calculator.tsx
│   │   ├── chmod-calculator.tsx
│   │   ├── port-check-generator.tsx
│   │   └── ...
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   └── utils.ts             # 工具函数
└── public/                  # 静态资源
    ├── logo.png
    └── favicon.ico
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

Made with ❤️ by developers, for developers

⭐ 如果这个项目对你有帮助，请给个 Star！

</div>
