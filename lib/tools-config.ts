import { ComponentType, lazy } from "react"
import { LucideIcon } from "lucide-react"
import {
  Braces,
  Regex,
  Binary,
  Clock,
  Link2,
  Hash,
  Palette,
  Fingerprint,
  FileCode,
  GitCompare,
  KeyRound,
  CalendarClock,
  ArrowLeftRight,
  Lock,
  Calculator,
  FileText,
  QrCode,
  Image,
  CalendarDays,
  Network,
  Shield,
  PcCase,
  Scale,
  ShieldCheck,
  ShieldAlert,
  KeySquare,
  LockKeyhole,
  Database,
  Code2,
  SquareCode,
  Languages,
  Sparkles,
  Camera,
  ImageDown,
} from "lucide-react"

// 动态导入所有工具组件 - 按需加载，只在用户访问时才下载对应 JS
const JsonFormatter = lazy(() => import("@/components/tools/json-formatter").then(m => ({ default: m.JsonFormatter })))
const JsonToCode = lazy(() => import("@/components/tools/json-to-code").then(m => ({ default: m.JsonToCode })))
const FileDiff = lazy(() => import("@/components/tools/file-diff").then(m => ({ default: m.FileDiff })))
const RegexTester = lazy(() => import("@/components/tools/regex-tester").then(m => ({ default: m.RegexTester })))
const Base64Encoder = lazy(() => import("@/components/tools/base64-encoder").then(m => ({ default: m.Base64Encoder })))
const TimestampConverter = lazy(() => import("@/components/tools/timestamp-converter").then(m => ({ default: m.TimestampConverter })))
const UrlEncoder = lazy(() => import("@/components/tools/url-encoder").then(m => ({ default: m.UrlEncoder })))
const HashGenerator = lazy(() => import("@/components/tools/hash-generator").then(m => ({ default: m.HashGenerator })))
const ColorConverter = lazy(() => import("@/components/tools/color-converter").then(m => ({ default: m.ColorConverter })))
const UuidGenerator = lazy(() => import("@/components/tools/uuid-generator").then(m => ({ default: m.UuidGenerator })))
const JwtDecoder = lazy(() => import("@/components/tools/jwt-decoder").then(m => ({ default: m.JwtDecoder })))
const CronExpression = lazy(() => import("@/components/tools/cron-expression").then(m => ({ default: m.CronExpression })))
const YamlJsonConverter = lazy(() => import("@/components/tools/yaml-json-converter").then(m => ({ default: m.YamlJsonConverter })))
const PasswordGenerator = lazy(() => import("@/components/tools/password-generator").then(m => ({ default: m.PasswordGenerator })))
const NumberBaseConverter = lazy(() => import("@/components/tools/number-base-converter").then(m => ({ default: m.NumberBaseConverter })))
const MarkdownPreview = lazy(() => import("@/components/tools/markdown-preview").then(m => ({ default: m.MarkdownPreview })))
const QrcodeGenerator = lazy(() => import("@/components/tools/qrcode-generator").then(m => ({ default: m.QrcodeGenerator })))
const ImageToBase64 = lazy(() => import("@/components/tools/image-to-base64").then(m => ({ default: m.ImageToBase64 })))
const DateCalculator = lazy(() => import("@/components/tools/date-calculator").then(m => ({ default: m.DateCalculator })))
const CidrCalculator = lazy(() => import("@/components/tools/cidr-calculator").then(m => ({ default: m.CidrCalculator })))
const ChmodCalculator = lazy(() => import("@/components/tools/chmod-calculator").then(m => ({ default: m.ChmodCalculator })))
const PortCheckGenerator = lazy(() => import("@/components/tools/port-check-generator").then(m => ({ default: m.PortCheckGenerator })))
const UnitConverter = lazy(() => import("@/components/tools/unit-converter").then(m => ({ default: m.UnitConverter })))
const AesEncryption = lazy(() => import("@/components/tools/aes-encryption").then(m => ({ default: m.AesEncryption })))
const RsaEncryption = lazy(() => import("@/components/tools/rsa-encryption").then(m => ({ default: m.RsaEncryption })))
const HmacGenerator = lazy(() => import("@/components/tools/hmac-generator").then(m => ({ default: m.HmacGenerator })))
const Md5Generator = lazy(() => import("@/components/tools/md5-generator").then(m => ({ default: m.Md5Generator })))
const KeyGenerator = lazy(() => import("@/components/tools/key-generator").then(m => ({ default: m.KeyGenerator })))
const SqlFormatter = lazy(() => import("@/components/tools/sql-formatter").then(m => ({ default: m.SqlFormatter })))
const XmlFormatter = lazy(() => import("@/components/tools/xml-formatter").then(m => ({ default: m.XmlFormatter })))
const HtmlEntities = lazy(() => import("@/components/tools/html-entities").then(m => ({ default: m.HtmlEntities })))
const UnicodeEscape = lazy(() => import("@/components/tools/unicode-escape").then(m => ({ default: m.UnicodeEscape })))
const CodeBeautifier = lazy(() => import("@/components/tools/code-beautifier").then(m => ({ default: m.CodeBeautifier })))
const ImageExif = lazy(() => import("@/components/tools/image-exif").then(m => ({ default: m.ImageExif })))
const ImageConverter = lazy(() => import("@/components/tools/image-converter").then(m => ({ default: m.ImageConverter })))

export interface Tool {
  id: string
  name: string
  icon: LucideIcon
  component: ComponentType<any>
  description: string
  fullDescription?: string // 完整描述，用于SEO meta description
  category: string
  color?: string
  keywords?: string[] // 用于SEO
}

export const tools: Tool[] = [
  {
    id: "json",
    name: "JSON 格式化",
    icon: Braces,
    component: JsonFormatter,
    description: "格式化、压缩、验证JSON",
    fullDescription: "在线JSON格式化工具，支持JSON美化、压缩、验证和语法高亮。快速检查JSON数据格式错误，提升开发效率。完全本地处理，保护数据隐私。",
    category: "format",
    color: "from-emerald-500/20 to-emerald-500/5",
    keywords: ["json", "格式化", "验证", "压缩", "json formatter"],
  },
  {
    id: "json2code",
    name: "JSON 转代码",
    icon: FileCode,
    component: JsonToCode,
    description: "JSON 转多语言类型",
    fullDescription: "将JSON数据快速转换为TypeScript、Go、Python、Java、Rust等多种编程语言的类型定义或数据结构。自动识别数据类型，生成规范代码，提升开发效率。",
    category: "format",
    color: "from-indigo-500/20 to-indigo-500/5",
    keywords: ["json", "typescript", "go", "python", "java", "rust", "代码生成", "类型转换"],
  },
  {
    id: "markdown",
    name: "Markdown 预览",
    icon: FileText,
    component: MarkdownPreview,
    description: "Markdown 实时预览",
    category: "format",
    color: "from-blue-500/20 to-blue-500/5",
    keywords: ["markdown", "预览", "mermaid"],
  },
  {
    id: "yaml",
    name: "YAML ↔ JSON",
    icon: ArrowLeftRight,
    component: YamlJsonConverter,
    description: "YAML/JSON 互转",
    category: "format",
    color: "from-green-500/20 to-green-500/5",
    keywords: ["yaml", "json", "转换"],
  },
  {
    id: "diff",
    name: "文件 Diff",
    icon: GitCompare,
    component: FileDiff,
    description: "对比两个文件差异",
    category: "format",
    color: "from-teal-500/20 to-teal-500/5",
    keywords: ["diff", "对比", "文件"],
  },
  {
    id: "sql",
    name: "SQL 格式化",
    icon: Database,
    component: SqlFormatter,
    description: "SQL 美化与压缩",
    fullDescription: "在线 SQL 格式化工具，支持 MySQL、PostgreSQL、SQLite、SQL Server、BigQuery 等 11 种 SQL 方言。一键美化、压缩、关键字大写。本地处理，数据安全可靠。",
    category: "format",
    color: "from-emerald-500/20 to-emerald-500/5",
    keywords: ["sql", "格式化", "美化", "mysql", "postgresql", "sql formatter"],
  },
  {
    id: "xml",
    name: "XML 工具",
    icon: Code2,
    component: XmlFormatter,
    description: "XML 格式化与 JSON 互转",
    fullDescription: "在线 XML 工具，支持 XML 格式化、XML 转 JSON、JSON 转 XML。适用于 SOAP API、配置文件、数据交换等场景。本地处理，保护数据隐私。",
    category: "format",
    color: "from-orange-500/20 to-orange-500/5",
    keywords: ["xml", "json", "格式化", "转换", "xml to json"],
  },
  {
    id: "beautifier",
    name: "HTML/CSS/JS 美化",
    icon: Sparkles,
    component: CodeBeautifier,
    description: "前端代码美化压缩",
    fullDescription: "在线 HTML/CSS/JavaScript 代码美化压缩工具，基于 js-beautify。一键格式化或压缩前端代码，支持自定义缩进，本地处理无需上传。",
    category: "format",
    color: "from-purple-500/20 to-purple-500/5",
    keywords: ["html", "css", "javascript", "美化", "压缩", "minify", "beautify"],
  },
  {
    id: "base64",
    name: "Base64",
    icon: Binary,
    component: Base64Encoder,
    description: "Base64 编码/解码",
    fullDescription: "在线Base64编码解码工具，支持文本与Base64格式快速互转。适用于数据传输、图片编码、API调试等场景。完全本地处理，安全可靠。",
    category: "encode",
    color: "from-amber-500/20 to-amber-500/5",
    keywords: ["base64", "编码", "解码", "base64 encode", "base64 decode"],
  },
  {
    id: "url",
    name: "URL 编码",
    icon: Link2,
    component: UrlEncoder,
    description: "URL 编码/解码",
    category: "encode",
    color: "from-cyan-500/20 to-cyan-500/5",
    keywords: ["url", "编码", "解码"],
  },
  {
    id: "hash",
    name: "Hash 生成",
    icon: Hash,
    component: HashGenerator,
    description: "SHA-1/256/384/512",
    category: "encode",
    color: "from-violet-500/20 to-violet-500/5",
    keywords: ["hash", "sha", "sha256", "sha512"],
  },
  {
    id: "image-base64",
    name: "图片转 Base64",
    icon: Image,
    component: ImageToBase64,
    description: "图片转 Base64",
    category: "encode",
    color: "from-pink-500/20 to-pink-500/5",
    keywords: ["图片", "base64", "转换"],
  },
  {
    id: "jwt",
    name: "JWT 解码器",
    icon: KeyRound,
    component: JwtDecoder,
    description: "解析 JWT Token",
    category: "encode",
    color: "from-sky-500/20 to-sky-500/5",
    keywords: ["jwt", "token", "解码"],
  },
  {
    id: "html-entities",
    name: "HTML 实体",
    icon: SquareCode,
    component: HtmlEntities,
    description: "HTML 实体编码/解码",
    fullDescription: "在线 HTML 实体编解码工具，支持命名实体、十进制、十六进制三种编码方式。快速处理特殊字符转义，适用于 HTML 模板、富文本处理等场景。",
    category: "encode",
    color: "from-yellow-500/20 to-yellow-500/5",
    keywords: ["html", "实体", "entities", "编码", "解码", "转义"],
  },
  {
    id: "unicode",
    name: "Unicode 转义",
    icon: Languages,
    component: UnicodeEscape,
    description: "Unicode 字符转义/还原",
    fullDescription: "在线 Unicode 转义工具，支持 \\u4F60、\\xFF、&#20320; 等多种格式互转。调试日志中的转义字符、JSON 字符串处理、跨语言字符编码必备。",
    category: "encode",
    color: "from-lime-500/20 to-lime-500/5",
    keywords: ["unicode", "转义", "escape", "字符编码", "中文转义"],
  },
  {
    id: "aes",
    name: "AES 加解密",
    icon: Lock,
    component: AesEncryption,
    description: "AES 对称加密/解密",
    fullDescription: "在线AES加密解密工具，支持AES-128/192/256位加密，提供CBC、GCM等多种模式。适用于数据加密、密钥管理、API安全等场景。本地处理，数据不上传。",
    category: "crypto",
    color: "from-blue-500/20 to-blue-500/5",
    keywords: ["aes", "加密", "解密", "gcm", "aes-256", "对称加密"],
  },
  {
    id: "rsa",
    name: "RSA 加解密",
    icon: ShieldCheck,
    component: RsaEncryption,
    description: "RSA 非对称加密",
    category: "crypto",
    color: "from-purple-500/20 to-purple-500/5",
    keywords: ["rsa", "加密", "解密", "公钥", "私钥"],
  },
  {
    id: "hmac",
    name: "HMAC 生成器",
    icon: ShieldAlert,
    component: HmacGenerator,
    description: "消息认证码生成",
    category: "crypto",
    color: "from-red-500/20 to-red-500/5",
    keywords: ["hmac", "sha", "认证"],
  },
  {
    id: "md5",
    name: "MD5 生成器",
    icon: Fingerprint,
    component: Md5Generator,
    description: "MD5 哈希生成",
    category: "crypto",
    color: "from-orange-500/20 to-orange-500/5",
    keywords: ["md5", "哈希", "hash"],
  },
  {
    id: "key-gen",
    name: "密钥生成器",
    icon: KeySquare,
    component: KeyGenerator,
    description: "加密密钥生成",
    category: "crypto",
    color: "from-cyan-500/20 to-cyan-500/5",
    keywords: ["密钥", "生成器", "hex", "base64"],
  },
  {
    id: "uuid",
    name: "UUID 生成",
    icon: Fingerprint,
    component: UuidGenerator,
    description: "生成 UUID v1/v4/v5",
    category: "generator",
    color: "from-orange-500/20 to-orange-500/5",
    keywords: ["uuid", "guid", "生成器"],
  },
  {
    id: "password",
    name: "密码生成器",
    icon: LockKeyhole,
    component: PasswordGenerator,
    description: "生成安全密码",
    category: "generator",
    color: "from-red-500/20 to-red-500/5",
    keywords: ["密码", "生成器", "随机"],
  },
  {
    id: "qrcode",
    name: "二维码生成",
    icon: QrCode,
    component: QrcodeGenerator,
    description: "生成二维码图片",
    category: "generator",
    color: "from-indigo-500/20 to-indigo-500/5",
    keywords: ["二维码", "qrcode", "生成"],
  },
  {
    id: "regex",
    name: "正则测试",
    icon: Regex,
    component: RegexTester,
    description: "测试正则表达式匹配",
    fullDescription: "在线正则表达式测试工具，实时匹配测试，高亮显示匹配结果。支持多行模式、全局匹配、忽略大小写等常用标志。适用于数据验证、文本提取、字符串匹配等开发场景。",
    category: "tool",
    color: "from-blue-500/20 to-blue-500/5",
    keywords: ["正则", "regex", "匹配", "正则表达式", "regex tester"],
  },
  {
    id: "cron",
    name: "Cron 表达式",
    icon: CalendarClock,
    component: CronExpression,
    description: "Cron 定时任务",
    category: "tool",
    color: "from-purple-500/20 to-purple-500/5",
    keywords: ["cron", "定时", "任务"],
  },
  {
    id: "timestamp",
    name: "时间戳",
    icon: Clock,
    component: TimestampConverter,
    description: "Unix 时间戳转换",
    fullDescription: "Unix时间戳转换工具，支持秒级和毫秒级时间戳与标准日期时间格式互转。实时显示当前时间戳，支持自定义日期格式。适用于API调试、日志分析、数据处理等场景。",
    category: "converter",
    color: "from-rose-500/20 to-rose-500/5",
    keywords: ["时间戳", "timestamp", "unix", "时间戳转换", "unix timestamp"],
  },
  {
    id: "color",
    name: "颜色转换",
    icon: Palette,
    component: ColorConverter,
    description: "HEX/RGB/HSL 互转",
    category: "converter",
    color: "from-pink-500/20 to-pink-500/5",
    keywords: ["颜色", "hex", "rgb", "hsl"],
  },
  {
    id: "base-converter",
    name: "进制转换",
    icon: Calculator,
    component: NumberBaseConverter,
    description: "二/八/十/十六进制互转",
    category: "converter",
    color: "from-slate-500/20 to-slate-500/5",
    keywords: ["进制", "二进制", "十六进制"],
  },
  {
    id: "date-calc",
    name: "日期计算器",
    icon: CalendarDays,
    component: DateCalculator,
    description: "日期差计算、日期加减运算",
    category: "converter",
    color: "from-teal-500/20 to-teal-500/5",
    keywords: ["日期", "计算器", "差值"],
  },
  {
    id: "unit",
    name: "单位转换",
    icon: Scale,
    component: UnitConverter,
    description: "常用单位数值转换",
    category: "converter",
    color: "from-indigo-500/20 to-indigo-500/5",
    keywords: ["单位", "转换", "长度", "重量"],
  },
  {
    id: "cidr",
    name: "IP 子网计算",
    icon: Network,
    component: CidrCalculator,
    description: "CIDR 子网掩码计算",
    category: "network",
    color: "from-blue-600/20 to-blue-600/5",
    keywords: ["cidr", "ip", "子网", "网络"],
  },
  {
    id: "chmod",
    name: "Chmod 计算",
    icon: Shield,
    component: ChmodCalculator,
    description: "Linux 文件权限计算",
    category: "network",
    color: "from-red-600/20 to-red-600/5",
    keywords: ["chmod", "权限", "linux"],
  },
  {
    id: "port-check",
    name: "端口检测命令",
    icon: PcCase,
    component: PortCheckGenerator,
    description: "生成端口连通性检测命令",
    category: "network",
    color: "from-orange-600/20 to-orange-600/5",
    keywords: ["端口", "检测", "telnet"],
  },
  {
    id: "exif",
    name: "图片 EXIF",
    icon: Camera,
    component: ImageExif,
    description: "查看图片元数据",
    fullDescription: "在线图片 EXIF 元数据查看工具，解析照片的拍摄设备、参数、GPS 位置等信息。支持 JPG、TIFF、HEIC 等格式，本地解析保护隐私。",
    category: "tool",
    color: "from-fuchsia-500/20 to-fuchsia-500/5",
    keywords: ["exif", "元数据", "图片", "metadata", "gps"],
  },
  {
    id: "image-convert",
    name: "图片格式转换",
    icon: ImageDown,
    component: ImageConverter,
    description: "JPG/PNG/WebP 互转压缩",
    fullDescription: "在线图片格式转换与压缩工具，支持 JPG、PNG、WebP 互转。可调整质量、限制最大宽度，浏览器本地处理无需上传。WebP 同等质量下体积更小。",
    category: "converter",
    color: "from-rose-500/20 to-rose-500/5",
    keywords: ["图片", "压缩", "转换", "webp", "jpg", "png", "image converter"],
  },
]

export const categories = [
  { id: "format", name: "格式化工具", icon: Braces },
  { id: "encode", name: "编码解码", icon: Binary },
  { id: "crypto", name: "加密工具", icon: ShieldCheck },
  { id: "generator", name: "生成器", icon: Fingerprint },
  { id: "converter", name: "转换器", icon: ArrowLeftRight },
  { id: "tool", name: "开发工具", icon: Regex },
  { id: "network", name: "网络工具", icon: Network },
]

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id)
}

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter((tool) => tool.category === categoryId)
}
