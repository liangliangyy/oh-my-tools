import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next' // Vercel Analytics 不支持静态导出 (output: 'export') 且在非 Vercel 环境下会报 404
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { siteConfig } from '@/lib/site-config'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'oh-my-tools - 程序员工具箱 | 28+免费在线开发者工具',
  description: '免费在线程序员工具集合，包含JSON格式化、Base64编解码、AES/RSA加密、正则表达式测试、UUID生成、时间戳转换等28+实用开发工具。100%本地处理，保护数据隐私。',
  keywords: 'JSON格式化,Base64编码,在线工具,程序员工具,开发者工具,AES加密,正则表达式,UUID生成,时间戳转换,开发工具箱',
  generator: 'v0.app',
  authors: [{ name: 'oh-my-tools', url: 'https://github.com/liangliangyy/oh-my-tools' }],
  creator: 'oh-my-tools',
  publisher: 'oh-my-tools',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteConfig.baseUrl,
    title: 'oh-my-tools - 程序员工具箱 | 28+免费在线开发者工具',
    description: '免费在线程序员工具集合，包含JSON格式化、Base64编解码、AES/RSA加密、正则表达式测试、UUID生成、时间戳转换等28+实用开发工具。100%本地处理，保护数据隐私。',
    siteName: 'oh-my-tools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'oh-my-tools - 程序员工具箱',
    description: '免费在线程序员工具集合，28+实用开发工具，100%本地处理',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // 网站级别的 JSON-LD 结构化数据
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'oh-my-tools',
    url: siteConfig.baseUrl,
    description: siteConfig.description,
    inLanguage: 'zh-CN',
    author: {
      '@type': 'Organization',
      name: 'oh-my-tools',
      url: siteConfig.links.github,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.baseUrl}/tools?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'oh-my-tools',
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}/logo.png`,
    sameAs: [siteConfig.links.github],
  }

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
