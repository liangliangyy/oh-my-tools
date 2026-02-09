'use client'

import Script from 'next/script'

/**
 * Google 服务集成组件
 * 支持 Google Analytics 和 Google AdSense
 * 通过环境变量配置，未配置时不加载
 */
export function GoogleScripts() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID

  return (
    <>
      {/* Google Analytics - 仅在配置了 ID 时加载 */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}

      {/* Google AdSense - 仅在配置了 ID 时加载 */}
      {ADSENSE_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
    </>
  )
}
