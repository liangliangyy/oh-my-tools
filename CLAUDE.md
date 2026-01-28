# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

oh-my-tools is a Next.js 16 web application providing free online developer utilities. It's a collection of client-side tools including JSON formatters, regex testers, encoders/decoders, and other common developer utilities. All processing happens client-side for privacy.

## Development Commands

```bash
# Development server (default port 3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: Radix UI primitives + shadcn/ui component pattern
- **Code Editor**: Monaco Editor (@monaco-editor/react) loaded from CDN
- **Analytics**: Vercel Analytics

### Project Structure

```
app/
├── page.tsx         # Landing page with tool showcase
├── layout.tsx       # Root layout with metadata and analytics
├── globals.css      # Tailwind imports and CSS variable theme definitions
└── tools/
    └── page.tsx     # Main tools interface with sidebar navigation

components/
├── ui/              # shadcn/ui base components (buttons, inputs, dialogs, etc.)
├── tools/           # Individual tool implementations
│   ├── json-formatter.tsx
│   ├── json-to-code.tsx
│   ├── file-diff.tsx
│   ├── regex-tester.tsx
│   ├── base64-encoder.tsx
│   ├── timestamp-converter.tsx
│   ├── url-encoder.tsx
│   ├── hash-generator.tsx
│   ├── color-converter.tsx
│   ├── uuid-generator.tsx
│   ├── jwt-decoder.tsx
│   ├── cron-expression.tsx
│   ├── yaml-json-converter.tsx
│   ├── password-generator.tsx
│   └── number-base-converter.tsx
├── theme-provider.tsx
└── theme-toggle.tsx

lib/
└── utils.ts         # cn() utility for className merging

hooks/
├── use-mobile.ts
└── use-toast.ts
```

### Key Patterns

**Tool Component Structure**: Each tool in `components/tools/` follows this pattern:
- Client component (`"use client"`)
- Manages its own state with React hooks
- Uses Monaco Editor for code/text input when appropriate
- Includes action buttons for operations (format, copy, clear, etc.)
- All logic runs client-side (no API calls)

**Page Routing**:
- `/` - Landing page showcasing all available tools
- `/tools` - Main tools interface
- `/tools?tool={id}` - Deep link to specific tool (e.g., `?tool=json`)

**Tool Registration**: Tools are defined as arrays in both `app/page.tsx` and `app/tools/page.tsx`:
```typescript
const tools = [
  {
    id: "json",
    name: "JSON 格式化",
    icon: Braces,
    component: JsonFormatter,  // Only in tools/page.tsx
    description: "格式化、压缩、验证JSON",
    color: "from-emerald-500/20 to-emerald-500/5"  // Only in page.tsx
  },
  // ...
]
```

**Theme System**:
- Managed by `next-themes` with system preference detection
- CSS variables defined in `app/globals.css` for light/dark modes
- Monaco Editor theme dynamically switches with app theme
- Uses OKLCH color space for better perceptual uniformity

**Component Library**: This project uses shadcn/ui pattern configured in `components.json`:
- Style: "new-york"
- Path aliases: `@/components`, `@/lib/utils`, `@/hooks`
- Components are owned source files (not npm packages)
- Icon library: lucide-react

### Adding New Tools

1. Create tool component in `components/tools/{tool-name}.tsx`
2. Add tool definition to both `app/page.tsx` and `app/tools/page.tsx` arrays
3. Import the component in `app/tools/page.tsx`
4. Follow existing patterns: client-side processing, Monaco Editor for code, copy/clear buttons

### Monaco Editor Usage

The `MonacoEditor` component (`components/ui/monaco-editor.tsx`):
- Loads locally from node_modules (self-hosted, no CDN)
- Supports light/dark theme switching via MutationObserver
- Common languages: json, yaml, typescript, javascript, python, go, markdown
- Typical height: 280px (can be customized with height prop)
- Always include `placeholder` prop for empty state UX

## Available Tools (15 total)

### Data Format Tools
- **JSON 格式化**: Format, compress, validate JSON
- **JSON 转代码**: Convert JSON to TypeScript/Go/Python types
- **YAML ↔ JSON**: Bidirectional YAML/JSON converter

### Development Tools
- **文件 Diff**: Compare two files with diff visualization
- **正则测试**: Test regex patterns with live matching
- **JWT 解码器**: Parse JWT tokens and display header/payload
- **Cron 表达式**: Generate and parse cron expressions with visual builder

### Encoding/Decoding
- **Base64 编解码**: Encode/decode Base64 strings
- **URL 编解码**: URL encode/decode
- **Hash 生成**: Generate SHA-1/256/384/512 hashes

### Converters
- **时间戳转换**: Unix timestamp ↔ date/time converter
- **颜色转换**: HEX ↔ RGB ↔ HSL color converter
- **进制转换**: Binary/Octal/Decimal/Hexadecimal converter

### Generators
- **UUID 生成**: Generate batch UUIDs (v4)
- **密码生成器**: Generate secure random passwords with customizable options

## Build Configuration

- **next.config.mjs**:
  - TypeScript build errors are ignored (`ignoreBuildErrors: true`)
  - Images are unoptimized
  - Empty `turbopack: {}` config to support webpack configuration
  - Webpack fallback disables `fs` and `module` for client-side Monaco Editor
- **tsconfig.json**: Strict mode enabled, uses path alias `@/*` for imports
- Target: ES6, Module resolution: bundler

## Important Notes

- All tools process data client-side - never send user data to external servers
- No backend API or database
- No authentication or user accounts
- Internationalization: Chinese (Simplified) text throughout UI
- **Package manager**: pnpm (REQUIRED - do not use npm or yarn)
  - Lock file: `pnpm-lock.yaml` only (no `package-lock.json` or `yarn.lock`)
  - Install dependencies: `pnpm install`
  - Add new package: `pnpm add <package>`
